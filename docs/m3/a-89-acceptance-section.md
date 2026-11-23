# A-89 Kết quả nghiệm thu (mục của A-92, sản phẩm P14)

| Trường | Nội dung |
|---|---|
| Người viết | Nguyễn Phạm Mạnh Dũng (RES-03) và Phạm Duy Quý (RES-04) |
| Trạng thái | **Khung, chưa có số liệu.** Điền sau A-87 (26-27/11) và A-88 (27/11) |
| Nguồn số liệu | A-87 (RES-02, RES-04): kết quả từng AT; A-88 (RES-01, RES-05): biên bản demo và email khách hàng; A-68, A-49 (Quality Evidence) |
| Phụ thuộc | Bộ AT-01 đến AT-07 (A-82) và AT-EX01 đến AT-EX05 + kịch bản 100 lượt (A-83) **chưa có trong repo** lúc lập khung này (23/11) |

## 1. Buổi nghiệm thu

| Mục | Nội dung |
|---|---|
| Ngày, giờ | `TODO(A-88)` |
| Người tham dự | `TODO(A-88)`: khách hàng (thầy Nguyễn Minh Tâm), các thành viên |
| Hình thức | `TODO`: trực tiếp hoặc video gửi qua email (Q23) |
| Phiên bản phần mềm | `TODO`: commit hoặc tag trên `main` |
| Kịch bản | `docs/P13-huong-dan-cai-dat-va-demo.md` mục 4 (14 bước) và bộ AT trong P21 |

## 2. Kết quả theo kịch bản nghiệm thu

| AT | Nội dung | Mục tiêu | Dry run A-87 | Demo A-88 | Ghi chú |
|---|---|---|---|---|---|
| AT-01 | Xe máy: đặt chỗ, vào bằng QR, ra, thanh toán | O1, O2 | `TODO` | `TODO` | |
| AT-02 | Ô tô khách vãng lai theo biển số | O2 | `TODO` | `TODO` | |
| AT-03 | Quản lý bãi, khu vực, sức chứa, bảng giá | O5 | `TODO` | `TODO` | |
| AT-04 | RBAC và che biển số | O5 | `TODO` | `TODO` | Gồm Staff tra cứu (Q34) |
| AT-05 | Đặt chỗ: hủy, không đến, đến sớm, khác khu | O3 | `TODO` | `TODO` | Gồm 1 đặt chỗ mỗi tài khoản (Q31) |
| AT-06 | Thanh toán mô phỏng, 6 tổ hợp phí | O4 | `TODO` | `TODO` | |
| AT-07 | Báo cáo 4 chỉ số | O3 | `TODO` | `TODO` | Theo khu vực × loại xe (Q28) |
| AT-EX01..05 | 5 ngoại lệ | O4 | `TODO` | `TODO` | |
| AT-100 | Kịch bản 100 lượt | O1, O2 | `TODO` | `TODO` | |

## 3. Số đo so với mục tiêu

| Mục tiêu | Thước đo (P21, Q28) | Ngưỡng | Kết quả | Đạt |
|---|---|---|---|---|
| O1 | Chỗ trống khớp số đếm tay sau 100 lượt | 100% | `TODO` | |
| O2 | Lượt có bản ghi đầy đủ; thời gian ghi nhận mỗi lượt | 100%; ≤ 3 giây | `TODO` (FR-16 đo được < 2 giây trong `tests/simulator.test.ts`) | |
| O3 | 4 chỉ số khớp số tính tay | Khớp | `TODO` (A-77 đã kiểm chứng trên dữ liệu mẫu) | |
| O4 | Ngoại lệ xử lý đúng; phí đúng | 5/5; 6/6 tổ hợp | `TODO` | |
| O5 | Khách hàng xác nhận nghiệm thu | Xác nhận | `TODO` | |

Ngưỡng do nhóm đề xuất kèm Q28; khách hàng chưa trả lời phần này (R-M3-06). Ghi lại nếu khách hàng chấp nhận hoặc đổi ngưỡng trong buổi demo.

## 4. Lỗi và vấn đề còn mở sau nghiệm thu

| # | Mô tả | Mức | Người phụ trách | Hạn | Trạng thái |
|---|---|---|---|---|---|
| | `TODO(A-87, A-88)` | | | | |

Vấn đề đã biết trước nghiệm thu nằm trong `a-112-closure-plan.md` mục 2.

## 5. Kết luận của khách hàng

`TODO(A-88)`: trích ý kiến hoặc email xác nhận của khách hàng, ngày xác nhận.
