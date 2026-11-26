# A-89 Kết quả nghiệm thu (mục của A-92, sản phẩm P14)

| Trường | Nội dung |
|---|---|
| Người viết | Nguyễn Phạm Mạnh Dũng (RES-03); kết quả từng phần do RES-02 (A-87), RES-04 (A-49, A-70), RES-05 (A-67, A-68, A-31) và RES-01 (A-61, A-87 chạy kỹ thuật) cung cấp |
| Cập nhật | 26/11/2026 |
| Trạng thái | **Đã có kết quả kiểm thử đến 26/11.** Cột "Demo A-88" điền sau buổi demo 27/11 |
| Hình thức nghiệm thu | **Nội bộ.** RES-01 xác nhận ngày 26/11: A-88 ngày 27/11 là buổi demo nội bộ của nhóm, không có khách hàng tham dự. Vì vậy mục này ghi kết quả nghiệm thu nội bộ theo bộ kịch bản AT; **chưa có xác nhận nghiệm thu của khách hàng** (xem mục 5) |
| Nguồn số liệu | `docs/m3/a-68-cp05-test.md` (CP-05), `a-67-integration-check.md`, `a-31-auth-test.md`, `quality-evidence-A-61.md`, `quality-evidence-A-49.md`, `docs/final/res04/a49-retest.md`, `docs/m3/A-77/`, `docs/m3/evidence/a87-res01-technical-2026-11-24.md` (pending #19), `docs/final/res05/demo-script-and-viva.md` mục 6 |

## 1. Các lần nghiệm thu

| Lần | Ngày | Người làm | Phiên bản | Hình thức | Kết quả |
|---|---|---|---|---|---|
| A-67 tích hợp bộ mô phỏng | 20/11, 23/11 | RES-01 (HTTP), RES-05 (giao diện) | `5182b97`, `4c8fde2` | Kịch bản SC-01..SC-07 qua API và giao diện | Đạt: 25 kiểm tra HTTP, 120 sự kiện, 0 bị từ chối |
| A-68 kiểm thử vào/ra (CP-05) | 24/11; 25/11: C1, C3, C4, C5 xong, C2 được miễn, C6 sửa D-01 | RES-05, RES-02 quyết định cổng | `8472986`; đếm tay trên `0be7ccf` (bản build production) | 100 lượt trên bộ mô phỏng, T05-T13 | **Đạt có điều kiện C1-C6** (RES-02, 24/11) |
| A-31 xác thực, phân quyền | 24/11 | RES-05 | `36b1c91`; bộ test chạy lại trên `4f2089f` | Ma trận 3 vai trò × 5 nhóm chức năng | Đạt |
| A-87 chạy kỹ thuật | 24/11 | RES-01 | `main` `26a623c` (sau PR #21), bản build production, CSDL mới | 100 lượt, 200 sự kiện; Chrome ở 360, 768, 1920 px | Đạt các ngưỡng (mục 3); còn lỗi giao diện đã biết; chưa kiểm Edge, Firefox |
| A-49 retest sau CR-03 | 24/11 | RES-04 | PR #24 | Kịch bản 100 lượt, đo thời gian | Đạt (A-49 Verified) |
| A-87 chạy thử (CP-07) | 26/11 | RES-02 | SHA do F2-04 ghi | Toàn bộ kịch bản demo | Chờ F2-04 (`docs/final/res02/a87-dry-run.md`) |
| A-88 demo nội bộ | 27/11 | Cả nhóm, RES-01 chủ trì | SHA của A-87 | Theo `demo-script-and-viva.md` | Điền sau 27/11 (mục 6 của kịch bản demo) |

## 2. Kết quả theo kịch bản nghiệm thu

| AT | Nội dung | Mục tiêu | Kết quả đến 26/11 | Bằng chứng | Demo A-88 (27/11) |
|---|---|---|---|---|---|
| AT-100 | Kịch bản 100 lượt | O1, O2 | **Đạt.** 100 lượt vào, 69 lượt ra, 0 bị từ chối; chỗ trống A 143, B 138, C 18 khớp số đếm tay (7 / 12 / 12 xe đang gửi) và CSDL. RES-02 chưa ký xác nhận số đếm tay (ISS-06) | A-68 T05, T11, ISS-06; A-87 chạy kỹ thuật | |
| AT-01 | Xe máy: đặt chỗ, vào bằng QR, ra, thanh toán | O1, O2 | **Đạt phần vào, ra, thanh toán.** Vào bằng QR với 3 thao tác, ≤ 3 s; ra và thanh toán mô phỏng đúng phí. Bước đặt chỗ chưa chạy cùng luồng này; đặt chỗ kiểm riêng ở AT-05 | A-68 T13, T08; A-79 test hợp đồng | |
| AT-02 | Ô tô khách vãng lai theo biển số | O2 | **Đạt** | A-68 (vào/ra theo biển số), A-87 chạy kỹ thuật | |
| AT-03 | Quản lý bãi, khu vực, sức chứa, bảng giá | O5 | **Đạt.** Staff nhận 403 ở cả 7 yêu cầu quản lý bãi đã thử; giờ hoạt động (Q37) chỉ để hiển thị | A-61 (`0faa6cb`); test Q37 (PR #17, #21) | |
| AT-04 | RBAC, che biển số, nhật ký truy cập | O5 | **Đạt.** Customer bị từ chối (403) ở mọi route vào/ra; Staff thấy biển số đã che với lượt đã đóng (Q46); lọc nhật ký theo tài khoản, thao tác, thời gian (FR-44) | A-31, T12; test Q46, FR-44 | |
| AT-05 | Đặt chỗ: hủy, không đến, đến sớm, khác khu; 1 đặt chỗ mỗi tài khoản | O3 | **Đạt ở mức test tự động và retest giao diện.** Chưa chạy thủ công đủ các bước | Test đặt chỗ (Q31, KB-11, KB-20, KB-21), A-70, A-49 retest (PR #24) | |
| AT-06 | Thanh toán mô phỏng, 6 tổ hợp phí | O4 | **Đạt một phần.** Trên `main`, `tests/fees.test.ts` kiểm 4 tổ hợp loại xe × nhóm phí; test đủ 6 tổ hợp nằm ở `26677dc` (nhánh `test/A-76-payment`, chưa có PR). Một lượt ra (xe máy, sinh viên) thu 2.000 ₫ đúng bảng | `tests/fees.test.ts`, `26677dc` (A-76); A-68 T08 | |
| AT-07 | Báo cáo 4 chỉ số | O3 | **Đạt trên dữ liệu mẫu.** 4 chỉ số khớp số tính tay; tỷ lệ sử dụng theo khu vực × loại xe (Q28) | A-77 (`docs/m3/A-77/`) | |
| AT-EX01 | Khu đầy, từ chối xe vào | O4 | **Đạt.** `ZONE_FULL`, chỗ trống không âm | A-67 SC-02, A-68 T06 | |
| AT-EX02 | Biển số không khớp, cần xác nhận thủ công | O4 | **Đạt.** Có cảnh báo; nút xác nhận chỉ bật sau khi tích "Xác nhận thủ công". Lỗi hiển thị D-04 còn mở | A-68 T07 | |
| AT-EX03 | Mất thẻ, tra theo biển số | O4 | **Đạt** | A-68 T08 | |
| AT-EX04 | Không cho mở lượt thứ hai cùng xe | O4 | **Đạt** | A-67 SC-05, A-68 T09 | |
| AT-EX05 | Bãi tạm ngưng: từ chối xe vào, vẫn cho ra | O4 | **Đạt** | A-68 T10 | |

## 3. Số đo so với mục tiêu

| Mục tiêu | Thước đo (P21, Q28) | Ngưỡng | Kết quả | Đạt |
|---|---|---|---|---|
| O1 | Chỗ trống khớp số đếm tay sau 100 lượt | 100% | 3/3 khu khớp (A-68, ISS-06; RES-02 chưa ký); 6/6 số chỗ trống khớp (A-87 chạy kỹ thuật) | Đạt |
| O2 | Lượt có bản ghi đầy đủ | 100% | `incomplete: 0` trên 100 lượt (A-68 T11) và 100/100 (A-87 chạy kỹ thuật) | Đạt |
| O2 | Thời gian ghi nhận mỗi lượt | ≤ 3 s | Chậm nhất 153 ms (A-49); 14-31 ms mỗi yêu cầu vào/ra trên bản build production (A-68 C3) | Đạt |
| O1 | Thời gian hiển thị chỗ trống | ≤ 5 s | Chậm nhất 155 ms (A-49) | Đạt |
| O3 | 4 chỉ số khớp số tính tay | Khớp | Khớp trên dữ liệu mẫu (A-77) | Đạt |
| O4 | Ngoại lệ xử lý đúng; phí đúng | 5/5; 6/6 | 5/5 ngoại lệ (AT-EX01..05); phí: 4/6 tổ hợp có test trên `main`, 6/6 trên nhánh chưa merge | Ngoại lệ đạt; phí **đạt một phần** |
| O5 | P20 mục 4: 100% yêu cầu Must có ≥ 1 test đạt; CP-07: 100% AT Must đạt | 100% | Chưa đủ: ma trận truy vết F4-03 (RES-04) và A-87 (CP-07) chưa xong; AT-05 chưa chạy thủ công đủ; phí 4/6 trên `main` | **Chưa xác nhận** |
| O5 | SRS v2.1: đạt tiêu chí nghiệm thu của khách hàng | Khách hàng xác nhận | Không có: A-88 là buổi nội bộ; video CP-05 chưa gửi khách hàng (ISS-07, Q23) | **Chưa đạt** |

Các ngưỡng do nhóm đề xuất kèm Q28. Khách hàng không trả lời phần này (R-M3-06), nên kết quả "Đạt" ở trên là đạt theo ngưỡng của nhóm, chưa phải ngưỡng khách hàng đã chấp nhận.

## 4. Lỗi và vấn đề còn mở

| # | Mô tả | Mức | Người phụ trách | Hạn | Trạng thái 26/11 |
|---|---|---|---|---|---|
| D-03 | Form vào của Staff hiện mã nội bộ của khu vực và `MOTORBIKE` thay cho tên | S2 | RES-04 | CP-07 | **Đã sửa** trong PR #24 (merge 26/11): select hiện tên, có `tests/entry-form.test.ts`. Chờ chạy lại theo mã D-03 |
| D-04 | Màn hình ra ghi nhãn "Biển số quan sát" cho biển số lúc vào | S2 | RES-04 | CP-07 | Mở; chưa có bằng chứng đóng trong repo |
| D-05 | Chi tiết lượt gửi không hiện phương thức nhận diện và Staff lúc vào (dữ liệu đã lưu) | S3 | RES-04 | — | Mở; RES-01 có thể chấp nhận để mở trong P14 |
| CP-05 | Cổng đạt có điều kiện: ISS-06..ISS-11 chưa được RES-02 phân bổ và RES-01 duyệt; C2 (gửi video, Q23) mới chỉ được miễn bằng lời | — | RES-02, RES-01 | 28/11 | Mở (R-M3-08) |
| AT-05 | Chưa chạy thủ công đủ các bước đặt chỗ | — | RES-02 (F2-02), RES-04 | 27/11 | Chạy trong A-87 và A-88 |
| Trình duyệt | Mới kiểm Chrome; chưa kiểm Edge, Firefox | — | RES-02 | 27/11 | Mở |

Đã đóng: D-01 (chạy song song bộ mô phỏng, PR #26), D-02 (cookie cũ trả lỗi 500, A-28), D-06 (timeout test bộ mô phỏng, PR #27). Các vấn đề đã biết trước nghiệm thu nằm trong `a-112-closure-plan.md` mục 2.

## 5. Kết luận

**Nghiệm thu nội bộ:** đến 26/11, mọi kịch bản AT đã được kiểm, và các thước đo O1-O3 đạt ngưỡng nhóm đề xuất; O4 đạt phần ngoại lệ, phần phí mới có 4/6 tổ hợp trên `main`. Còn một lỗi S2 về hiển thị (D-04), một lỗi S2 đã sửa nhưng chưa chạy lại (D-03) và một lỗi S3 (D-05), không lỗi nào làm sai kết quả của kịch bản.

**Nghiệm thu của khách hàng:** chưa có. A-88 là buổi demo nội bộ, và chưa có email nào gửi khách hàng (Q23). Vì vậy O5 theo SRS ghi là chưa đạt; O5 theo thước đo của P20 chờ F4-03 và A-87. A-92 phải trình bày đúng như vậy. Đây là khác biệt so với Baseline V1.0, nơi M-04 cần "video demo và email xác nhận của khách hàng (Q23, Q11)". Nếu nhóm gửi video và khách hàng trả lời trước ngày 29/11, ghi ngày và trích nội dung trả lời vào đây.

## 6. Sau buổi demo 27/11

Chép từ `demo-script-and-viva.md` mục 6 vào cột "Demo A-88" ở mục 2: SHA, người dự, kịch bản đã chạy, lỗi mới (kèm người phụ trách và hạn). Sau đó cập nhật mục 4 và mục 5.
