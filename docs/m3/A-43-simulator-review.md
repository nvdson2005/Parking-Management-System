# A-43. Rà soát bộ mô phỏng (P04) theo PD-P04 và danh mục kịch bản SC-01 đến SC-07

| Trường | Nội dung |
|---|---|
| Hoạt động / sản phẩm | A-43 / P04 – Bộ mô phỏng thiết bị |
| Người thực hiện | Nguyễn Tuấn Thành (RES-05) |
| Kế hoạch | 09/11 → 11/11/2026; E = 3,17 h (đối chiếu 10 tiêu chí 1,5 h; mô tả 7 kịch bản 1,4 h) |
| Effort thực tế | 2,5 giờ |
| Mã được rà soát | `main` @ `0babc33`: `src/server/services/simulator.ts`, `src/app/api/simulator/route.ts`, `src/app/manager/simulator/*`, `tests/simulator.test.ts` |
| Căn cứ | PD-P04 (M2 mục 2.2); SRS v0.1 (FR-11, FR-15, FR-33, FR-34, EX-01..EX-05); P18 mục 10 (KB-01, KB-08, KB-09) |
| Đầu ra cho | A-44 (sửa theo cột "Chuyển cho" ở mục 1), CP-02, A-45 / CP-04, A-47, A-83 |

## 1. Đối chiếu 10 tiêu chí PD-P04

| # | Tiêu chí | Kết quả | Căn cứ trong mã | Chuyển cho |
|---|---|---|---|---|
| 1 | Sinh sự kiện vào/ra cho xe máy và ô tô theo từng phương thức | Một phần | Có cả hai loại xe. `simulateLive` chỉ dùng `method: 'PLATE'`; QR chỉ có trong EX03; không sinh RFID | A-44: sinh thêm QR/RFID |
| 2 | Một lần chạy tạo đủ ≥ 100 lượt | Một phần | N đếm *sự kiện* (vào + ra), không phải *lượt gửi* (FR-34). Khoảng 40% sự kiện là xe ra, nên mặc định N = 120 không bảo đảm ≥ 100 lượt gửi | A-44: chạy đến khi đủ ≥ 100 lượt gửi |
| 3 | Cùng cấu hình cho kết quả tái lập được | Không đạt | Dùng `Math.random()` và `crypto.randomBytes`, không có seed. Hàm `randomInt` dùng `randomBytes(1) % span` nên chỉ trả được 0–255 và phân bố lệch | A-44: thêm seed, sửa `randomInt` |
| 4 | Mỗi EX-01 đến EX-05 kích hoạt được | Đạt | `triggerException` xử lý đủ 5 mã; có test trong `tests/simulator.test.ts`. Lưu ý KB-08: EX01 lấp đầy khu vực (cần reset CSDL sau); EX05 không ghi `LOT_CHANGE`, không phát SSE | A-44 (KB-08), A-45 kiểm lại |
| 5 | Đổi tham số không sửa mã | Một phần | Đổi được N, số ngày, sức chứa và bảng giá. Tỷ lệ xe ra 0,4, số lượt/ngày, thời gian đỗ còn viết cứng (KB-09) | A-47 ghi lại |
| 6 | Sự kiện đi qua API vào/ra (FR-15) | Một phần | Gọi trực tiếp các hàm service, không qua HTTP `/api/events/*` (KB-01) | CP-02: chấp nhận tầng service hay gọi HTTP |
| 7 | Dữ liệu là dữ liệu mô phỏng | Một phần | Biển số và thẻ đều giả, nhưng không có cờ đánh dấu dữ liệu mô phỏng | CP-02: thêm cờ hay ghi quy ước ở A-47 |
| 8 | Kết quả đủ để đối chiếu số đếm tay (O1) | Đạt | Trả về `entries / exits / rejected`; chỗ trống tính từ dữ liệu lượt gửi | A-45 kiểm lại |
| 9 | Người không phải tác giả chạy được theo P13 | Chưa đánh giá | P13 chưa có (A-33, 20–23/11); hiện mới có README | A-33 |
| 10 | Ít nhất 2 thành viên review | Chưa đánh giá | Review tại CP-04. A-45 hiện chỉ có 1 reviewer không phải tác giả (RES-02) | Thêm RES-01 làm reviewer thứ hai |

**Tổng hợp:** 2 đạt, 5 một phần, 1 không đạt, 2 chưa tới hạn đánh giá.

## 2. Danh mục kịch bản SC-01 đến SC-07

Quy ước chung:
- Tài khoản Manager, thao tác tại `/manager/simulator`.
- CSDL vừa reset bằng `npm run db:reset` (sức chứa thí điểm: A 150, B 150 xe máy; C 30 ô tô).
- Chỉ chạy một tiến trình server.
- Kết quả ghi vào tab Quality Evidence.

| SC-ID | Tên | Thao tác | Kết quả mong đợi | Truy vết |
|---|---|---|---|---|
| SC-01 | Luồng thường vào/ra | Live events, N = 20 | `entries + exits + rejected = 20`; `rejected = 0`; mỗi lượt đủ trường; chỗ trống = sức chứa − lượt đang mở; màn hình chỗ trống tự cập nhật | FR-11, FR-15; T05, T11; AT-01, AT-02 |
| SC-02 | EX-01 Khu vực hết chỗ | Bấm EX-01 Zone full | Trả về `ZONE_FULL`; chỗ trống = 0, không âm. **Reset CSDL sau khi chạy** | EX-01; T06; AT-EX01 |
| SC-03 | EX-02 Biển số không khớp | Bấm EX-02; Staff ra xe tại `/staff/exit` với biển quan sát trong hướng dẫn | Trả về `SESSION_OPEN`. Màn hình cảnh báo lệch biển. Không tích "Confirm manually" → bị từ chối `PLATE_MISMATCH`. Có tích → lượt đóng, có `MANUAL_CONFIRM` | EX-02; T07; AT-EX02 |
| SC-04 | EX-03 Mất mã QR/thẻ | Bấm EX-03; Staff ra xe theo biển số, tích "Lost card" | Trả về `SESSION_OPEN` (lượt vào bằng QR); khi ra: lượt đóng, có sự kiện `LOST_CARD`, phí bình thường, không phạt | EX-03; T08; AT-EX03 |
| SC-05 | EX-04 Vào trùng | Bấm EX-04 Duplicate entry | Trả về `ALREADY_OPEN`; chỉ còn 1 lượt mở cho biển số đó | EX-04; T09; AT-EX04 |
| SC-06 | EX-05 Bãi tạm ngưng | Bấm EX-05 Lot suspended | Trả về `LOT_SUSPENDED`; bãi trở về trạng thái ban đầu. Sau A-44: có `LOT_CHANGE` và SSE | EX-05; T10; AT-EX05 |
| SC-07 | Tải ≥ 100 lượt gửi | Live events, N = 200 (sau A-44: chế độ "≥ 100 lượt gửi") | ≥ 100 lượt gửi; 100% lượt đủ trường; chỗ trống khớp số đếm tay; mỗi lượt ≤ 2 s | FR-16, FR-34; T11; AT-100; CP-04, CP-05 |

**Ghi chú cho A-83:** SC-02..SC-06 tương ứng AT-EX01..AT-EX05; SC-07 tương ứng AT-100. Bộ mô phỏng chưa kiểm ý "xe vẫn ra được khi bãi tạm ngưng" của EX-05, nên AT-EX05 cần thêm bước này làm bằng tay.
