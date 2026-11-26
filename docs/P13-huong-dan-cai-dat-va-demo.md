# P13 - Hướng dẫn cài đặt và chạy demo

| Trường | Nội dung |
|---|---|
| Sản phẩm | P13, hướng dẫn cài đặt và chạy demo (sản phẩm bàn giao) |
| Hoạt động | A-33 |
| Người viết | Nguyễn Phạm Mạnh Dũng (RES-03) |
| Phiên bản | v1.0, 23/11/2026 |
| Tiêu chí nghiệm thu | Một người không phải tác giả chạy được demo chỉ bằng hướng dẫn này (PD-P13) |
| Áp dụng cho | `main` từ 24/11 (PR #11 đã merge; PR #17 tích hợp qua PR #21) |

Tài liệu đi kèm: [README](../README.md) (lệnh, tài khoản, bảng API), [hướng dẫn kiểm thử E2E thủ công](manual-e2e-test-guide.md) (kiểm thử chi tiết từng màn hình).

## 1. Yêu cầu

| Thành phần | Yêu cầu | Ghi chú |
|---|---|---|
| Hệ điều hành | Windows 10/11, macOS hoặc Linux | Đã chạy trên Windows 11 |
| Node.js | ≥ 20 | Đã thử với 22.17.1 |
| npm | Đi kèm Node | |
| Git | Bất kỳ bản nào | Để tải mã nguồn |
| Trình duyệt | Chrome, Edge hoặc Firefox bản mới | Nên mở 2-3 cửa sổ riêng (hoặc profile riêng) cho từng vai trò |
| Mạng | Chỉ cần khi cài đặt (`npm i`) | Ứng dụng chạy hoàn toàn trên máy, không cần internet, không cần thiết bị thật (QR, RFID và biển số được mô phỏng) |

Không cần cài CSDL riêng: hệ thống dùng SQLite, CSDL là một file `prisma/dev.db` tự tạo khi chạy lệnh ở mục 2.

## 2. Cài đặt (khoảng 5 phút)

```bash
git clone https://github.com/nvdson2005/Parking-Management-System.git
cd Parking-Management-System
npm i
cp .env.example .env               # Windows PowerShell: Copy-Item .env.example .env
npx prisma migrate reset --force   # tạo CSDL, chạy migration, nạp dữ liệu demo
npm run dev
```

Mở http://localhost:3000. Trang đăng nhập hiện ra là cài đặt đã thành công.

- `npx prisma migrate reset --force` (hoặc `npm run db:reset`) **xóa và tạo lại** `prisma/dev.db` với dữ liệu demo: một bãi thí điểm có khu A, B (150 xe máy mỗi khu) và C (30 ô tô), bảng giá, và các tài khoản ở mục 3. Chạy lại lệnh này bất cứ khi nào cần đưa demo về trạng thái sạch.
- Khi kéo bản mới có thêm migration mà muốn **giữ dữ liệu**, chạy `npx prisma migrate deploy` rồi `npx prisma generate` thay cho lệnh reset.

## 3. Tài khoản demo

Mật khẩu chung: **`password123`**.

| Vai trò | Email |
|---|---|
| Manager (Quản lý, khách hàng gọi là Admin) | `manager1@demo.local`, `manager2@demo.local` |
| Staff (nhân viên bãi) | `staff1@demo.local`, `staff2@demo.local` |
| Customer (người gửi xe) | `customer01@demo.local` … `customer15@demo.local` |

Mỗi Customer có sẵn một xe máy. Customer số lẻ thuộc nhóm Sinh viên, số chẵn thuộc nhóm Giảng viên/nhân viên. Xe không gắn tài khoản được tính theo mức Khách.

## 4. Kịch bản demo (khoảng 20 phút)

Chuẩn bị: chạy `npm run db:reset`, rồi mở 3 cửa sổ trình duyệt riêng, đăng nhập lần lượt **Customer** (`customer01`), **Staff** (`staff1`) và **Manager** (`manager1`). Đặt cửa sổ Staff cạnh cửa sổ Customer để thấy số chỗ trống cập nhật trực tiếp.

| # | Vai trò | Thao tác | Kết quả mong đợi | Yêu cầu |
|---|---|---|---|---|
| 1 | Customer | `/customer/vehicles`: xem xe và mã QR | Có ảnh QR và mã RFID mô phỏng | Q29 |
| 2 | Customer | `/customer/reservations`: đặt chỗ khu A cho giờ đến sau thời điểm hiện tại khoảng 1 giờ | Đặt chỗ thành công; **số chỗ trống khu A trên cửa sổ Staff giảm 1 ngay lập tức** | Q15, Q31, O1 |
| 3 | Customer | `/customer/vehicles`: thêm một xe máy thứ hai (ví dụ `59X1-123.45`), rồi đặt chỗ cho xe đó | Bị từ chối: mỗi **tài khoản** chỉ có 1 đặt chỗ đang hiệu lực. (Đặt lại cho chính xe ở bước 2 sẽ báo lỗi khác, "xe đã có đặt chỗ", vì hệ thống kiểm tra theo xe trước) | Q31 |
| 4 | Staff | `/staff/lookup`: nhập biển số xe của `customer01` | Thấy xe, "Không ở trong bãi" và đặt chỗ vừa tạo. Danh sách "Các đặt chỗ đang hiệu lực" có đặt chỗ này | Q34 |
| 5 | Staff | `/staff/entry`: chọn QR, dán mã QR của xe đó, khu A | Bị chặn vì xe **đến sớm** hơn giờ hẹn; Staff kiểm tra chỗ rồi bấm xác nhận thì xe được vào, đặt chỗ chuyển sang FULFILLED | Q31 |
| 6 | Staff | `/staff/entry`: chọn biển số, nhập một biển mới (ví dụ `51F-999.99`), ô tô, khu C | Mở lượt gửi cho xe khách vãng lai | Q30 |
| 7 | Staff | `/staff/exit`: tìm xe máy ở bước 5, xem phí, xác nhận thanh toán | Hiện phí; lượt đóng; Customer thấy giao dịch ở `/customer/history` | Q33, O4 |
| 8 | Manager | `/manager/simulator`: chạy lần lượt 5 ngoại lệ EX-01 đến EX-05 | Mỗi ngoại lệ trả đúng kết quả (hết chỗ, lệch biển, mất thẻ, lượt đã mở, bãi tạm ngưng). EX-02 và EX-03 xử lý tiếp ở `/staff/exit` theo hướng dẫn hiện ra | Q27, O4 |
| 9 | Manager | `/manager/lots`: tạm ngưng bãi | Huy hiệu "Tạm ngưng" hiện trên màn hình chỗ trống; xe mới bị từ chối; xe đang gửi vẫn ra được; đặt chỗ đang chờ bị hủy và **Customer nhận thông báo ở chuông** | Q32 |
| 10 | Manager | Kích hoạt lại bãi; `/manager/tariffs`: sửa giá | Bãi hoạt động lại; giá mới áp dụng cho lượt ra sau đó | Q14, Q16 |
| 11 | Manager | `/manager/simulator`: chạy "live" với ít nhất 100 lượt, rồi "history" vài ngày | Bộ mô phỏng báo số lượt vào, ra và bị từ chối; mọi lượt có bản ghi đầy đủ | SC-07, O2 |
| 12 | Manager | `/manager/reports`: chọn khoảng ngày | 4 chỉ số: tỷ lệ sử dụng theo giờ (có chọn từng khu và loại xe), 3 giờ cao điểm, doanh thu theo ngày, tỷ lệ không đến | Q28, O3 |
| 13 | Manager | `/manager/access-log` | Thấy LOGIN, VIEW_FULL_PLATE (từ bước 4), PURGE. Dòng PURGE không có người thực hiện là lần xóa **tự động** | Q35, CN4 |
| 14 | Bất kỳ | Bấm nút đổi ngôn ngữ VI ↔ EN | Mọi trang đổi ngôn ngữ | Q8 |

Lưu ý:
- Sau EX-01 (hết chỗ), khu bị lấp đầy. Màn hình mô phỏng sẽ nhắc chạy `npm run db:reset` trước kịch bản tiếp theo.
- Lần xóa tự động đầu tiên chạy khoảng 60 giây sau khi server khởi động. Dữ liệu demo cần có lượt cũ hơn 12 tháng mới thấy biển số bị che; chạy "history" ở bước 11 với số ngày lớn sẽ tạo dữ liệu như vậy.

## 5. Kiểm tra tự động (tùy chọn)

```bash
npm test         # toàn bộ test (dùng prisma/test.db riêng, không đụng dữ liệu demo)
npm run lint
npm run build
```

Từ PR #27 (F5-01, 25/11), bộ test mô phỏng có timeout 60 giây trong `tests/simulator.test.ts`, nên `npm test` chạy được mà không cần thêm tham số.

## 6. Xử lý sự cố

| Hiện tượng | Cách xử lý |
|---|---|
| `Error: Port 3000 is in use` | Tắt tiến trình đang dùng cổng 3000, hoặc chạy `npx next dev -p 3001` rồi mở http://localhost:3001 |
| Lỗi `@prisma/client did not initialize` hoặc thiếu bảng | Chạy `npx prisma generate`, sau đó `npm run db:reset` |
| Build lỗi lạ sau khi đổi nhánh | Xóa thư mục `.next` rồi chạy lại `npm run build` (gặp ngày 19/11, ghi trong weekly log) |
| Đăng nhập báo sai mật khẩu với tài khoản demo | Dữ liệu demo chưa nạp: chạy `npm run db:reset` |
| Số chỗ trống không tự cập nhật | Tải lại trang. Luồng cập nhật trực tiếp dùng SSE; một số tiện ích mở rộng chặn quảng cáo có thể chặn kết nối này |
| Sau EX-01 không còn chỗ | Chạy `npm run db:reset` |

## 7. Kiểm tra tiêu chí P13

| Kiểm tra | Cách làm | Kết quả |
|---|---|---|
| Người không phải tác giả cài và chạy được | Một thành viên khác làm theo mục 2-4 trên máy của mình | `TODO`: ghi tên người thử, ngày và vấn đề gặp phải (đề xuất làm trong buổi chạy thử A-87, 26/11) |
