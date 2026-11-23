# Project Baseline V2.0 (A-106, Task 3.7)

| Trường | Nội dung |
|---|---|
| Người sinh | Nguyễn Phạm Mạnh Dũng (RES-03), 23/11/2026; sinh lại 24/11/2026 sau review PR #10 của RES-01 |
| Người duyệt | Nguyễn Võ Đức Sơn (RES-01). **Chưa duyệt**, xem checklist trong `baseline-v2-handoff.md` |
| Lý do | CR-01: hạn nộp dời từ 07/12 lên 29/11 (bắt buộc V2.0). Kèm CR-02 (vòng 3, không đổi effort) và CR-03 (Q34, Q35, review CP-03 và câu trả lời vòng 5 của khách hàng ngày 23/11; chờ RES-01 duyệt) |
| Nguồn | `docs/m2-report/data/plan-v2.0.mjs` |
| Bảng sinh ra | `docs/m2-report/generated-v2/` (19 file, cùng cấu trúc với `generated/` của V1.0) |
| Lệnh sinh lại | `node docs/m2-report/scripts/schedule-v2.mjs` |
| V1.0 | Giữ nguyên tại `docs/m2-report/data/plan.mjs`, `generated/`, tag `baseline-v1.0`; bản lưu `data/archive/plan-v1.0.mjs` |

## Cách làm

- `schedule-v2.mjs` chạy **chính bộ lập lịch của V1.0** (`schedule.mjs`, không sửa). Nó chỉ đổi file kế hoạch đầu vào, thư mục đầu ra và nhãn tuần. Thuật toán PERT, CPM và cân bằng nguồn lực giống hệt V1.0, nên hai bộ số so sánh được với nhau.
- Không file V1.0 nào bị sửa. `generated/` vẫn là V1.0 nên không cần chép sang `archive/` (khác bước 1 của hướng dẫn bàn giao; mục đích "V1.0 vẫn còn để so sánh" vẫn đạt).
- Đây là bản **tối thiểu** theo phương án C: lập lại kế hoạch cho cùng cửa sổ 09/11 → 29/11. Hoạt động đã xong vẫn nằm trong kế hoạch với effort kế hoạch; số thực tế nằm ở A-103 và A-90.

## Thay đổi so với V1.0

| Mục | V1.0 | V2.0 | Nguồn |
|---|---|---|---|
| Hạn nộp (M-05) | 07/12 | **29/11** (M3 và cuối kỳ nộp chung) | CR-01 |
| Tuần | W12-W15 | W12-W14 (bỏ W15) | CR-01 |
| Giờ mỗi người mỗi tuần | 8 / 10 / 10 / 10 | 8 / 10 / **12** (W14 thêm 2h) | Phương án C |
| Năng lực nhóm | 190h | **150h** | |
| Mốc | M-03, M-04 tính theo lịch | M-03 **24/11**, M-04 **27/11** cố định | Hướng dẫn bàn giao |
| Hoạt động mới | — | A-100 đến A-106, A-108, A-110, A-112 đến A-116 (lower-level plan, Task 3.8) | Work division §4 |
| Cắt giảm | — | A-95 gộp vào A-87 (+1,1h cho A-87); A-72 còn 1,6h; A-76 còn 1h; A-108 còn 1h rà soát; A-110, A-112, A-113 viết thành mục của A-92 (≈ 70%); A-115 còn 2,25h; A-91 chuyển về W14; A-94 còn 3 tuần | Phương án C |
| A-28 | 3,17h | **7,75h**: thêm xóa tự động (Q35, G-05); KB-16 chấp nhận, bỏ 1h; nhật ký đăng nhập thất bại, từ chối quyền (G-06, +1,5h, 23/11); đổi nhóm người dùng (Q38, +2h) và mốc xóa tính từ giờ ra (Q44, +0,5h) theo vòng 5 (24/11) | CR-03 |
| A-65 | 4,33h | **14,33h**: thêm Staff tra cứu xe, đặt chỗ (Q34, G-08) và chỉ mục (G-07); cổng (G-09, +2h) và nguồn ghi nhận (G-04, +1,5h) sau review CP-03 (23/11); giờ hoạt động (Q37, G-01, +1,5h), bảng giá theo nhóm (Q45, +1h), che biển số lượt đã đóng (Q46, +1h) theo vòng 5 (24/11); bỏ phụ thuộc A-27 | CR-03 |
| A-87 | phụ thuộc A-95 | phụ thuộc A-85, A-67 và thêm **A-28, A-65** (phải xong trước chạy thử) | |
| A-92 | phụ thuộc A-90, A-87 | thêm A-89, A-110, A-112, A-113 (các mục của báo cáo) | Phương án C |
| Rủi ro | 9 rủi ro V1.0 | 14 rủi ro theo sổ ngày 22/11 (bỏ R-G1-01 đã xảy ra, R-G4-03 và R-M3-03 đã đóng). R-G4-02 và R-G5-04 là rủi ro năng lực, không tính vào dự phòng | `risk-register.md` |

## Kết quả

| Chỉ số | V1.0 | V2.0 | Chênh lệch |
|---|---|---|---|
| Effort cơ sở | 131,15h | 169,82h | +38,67h |
| Dự phòng làm lại | 8,45h | 12,58h | +4,13h (rủi ro mới R-M3-01, R-M3-02, R-M3-07; R-M3-01 hạ còn 10% × 12h ngày 24/11 sau khi khách hàng xác nhận Q36, Q39, Q40) |
| Tổng effort baseline | 139,6h | **182,39h** | +42,79h |
| Năng lực | 190h | **150h** | −40h |
| Mức sử dụng năng lực | 73,47% | **121,59%** | |
| Chi phí quy đổi (50.000 VNĐ/h) | 6.980.000 VNĐ | 9.119.583 VNĐ (cơ sở 8.490.833 + dự phòng 628.750) | +2.139.583 VNĐ |
| Đường găng (mạng lý tưởng) | A-22 → A-23 → A-44 → A-45 → A-67 → A-68 → A-90 → A-92 = 10,63 ngày | A-22 → A-23 → A-65 → A-87 → A-88 → A-89 → A-92 → A-116 = 15,43 ngày | A-65 (14,33h, một người) thành đường găng; nghiệm thu và nộp bài vẫn nằm trên đường găng |
| Lịch đã cân bằng nguồn lực (dự báo theo mô hình) | xong 01/12 (ngày 16,69 / 20) | **ngày 23,63 / 15: vượt khoảng 8,6 ngày làm việc** | |

Bộ lập lịch báo lỗi `Levelled schedule ends on working day 23.63 > 15`. Nhãn "27/11" trong `generated-v2/totals.md` và `schedule.md` là ngày cuối của cửa sổ (bộ lập lịch chặn nhãn ở đó), không phải ngày xong thực tế.

So với decision record (19/11, 164,1h): V2.0 cao hơn vì (1) CR-03 thêm 14,58h vào A-28, A-65 (7,5h → 22,08h theo PERT): Q34, Q35 ban đầu, review CP-03 (G-06, G-09, G-04) và vòng 5 của khách hàng (Q37, Q38, Q44, Q45, Q46); (2) dự phòng được tính lại theo 14 rủi ro hiện tại (12,58h thay vì 8,45h). Nếu chỉ so effort cơ sở với năng lực: 169,82h so với 150h, **thiếu khoảng 19,8h**; tính cả dự phòng thì thiếu khoảng 32,4h.

**Lưu ý về A-28, A-65:** cả hai đã làm xong ngày 23-24/11 (PR #11, PR #17, chờ merge). Baseline giữ effort kế hoạch như mọi hoạt động đã xong (mục Cách làm); giờ thực tế ghi ở A-103 và A-90. Vì vậy dự báo theo mô hình ở trên bi quan hơn tình hình thực tế đối với RES-03.

## Vì sao vẫn vượt

1. **Thiếu năng lực:** 122% tải. Đây là R-G5-04 đã ghi trong sổ rủi ro, đúng như dự báo của decision record.
2. **Chuỗi sau buổi nghiệm thu:** A-88 cố định 27/11 (thứ Sáu), nhưng A-89 → A-92 → A-116 phải làm sau đó. Lịch thứ Hai đến thứ Sáu không còn ngày nào, trong khi kế hoạch CR-01 tính A-92 xong thứ Bảy 28/11 và nộp Chủ nhật 29/11.
3. Đã thử chuyển A-33 và một nửa A-65 từ RES-03 sang RES-05: lịch chỉ giảm từ 18,99 xuống 18,63 ngày (đo trên bản ngày 23/11, trước khi cộng phần CR-03 sau review). Vì vậy tắc nghẽn không nằm ở một người mà ở tổng giờ và chuỗi phụ thuộc. Phương án này **không** đưa vào V2.0 vì việc giao lại là quyết định của RES-01.

## Mục tiêu và dự báo cho buổi chạy thử và buổi nghiệm thu

**Mục tiêu** là ngày cố định, không phải kết quả của bộ lập lịch: A-87 chạy thử ngày **26/11** (ngày làm việc 13), A-88 trình diễn ngày **27/11** (ngày 14), nộp bài **29/11**. **Dự báo theo mô hình** (lịch đã cân bằng từ effort kế hoạch, không dùng số thực tế) đặt A-87 ở ngày 20-21,3 và A-88 ở ngày 21-21,6, tức sau mục tiêu khoảng 7 ngày làm việc. Mô hình không đạt được mục tiêu; mục tiêu chỉ đạt nếu các hoạt động trước A-87 xong trước 25/11 theo tình trạng thực tế dưới đây.

| Hoạt động trước A-87 | Phụ trách | Effort kế hoạch | Dự báo theo mô hình (ngày) | Tình trạng thực tế 24/11 |
|---|---|---|---|---|
| A-28 Sửa xác thực, nhật ký, xóa tự động | RES-03 | 7,75h | 16-19,8 | **Xong** 23-24/11 (PR #11, chờ merge) |
| A-65 Bổ sung API, Staff tra cứu | RES-03 | 14,33h | 5-15,2 | **Xong** 23-24/11 (PR #11, PR #17, chờ merge) |
| A-85 Review bộ test nghiệm thu | RES-02, RES-03 | 2,5h | 8-20,2 | Chờ bộ AT; `TODO(RES-02)` |
| A-67 Tích hợp bộ mô phỏng | RES-01, RES-05 | 2,17h | 16-17,4 | `TODO(RES-01)` |
| A-68 Kiểm thử xe ra/vào | RES-05, RES-02 | 3,17h | 17-17,7 | `TODO(RES-05)` |
| A-49 Kiểm thử hiển thị chỗ trống | RES-04 | 2h | 17-17,8 | `TODO(RES-04)` |
| A-31 Kiểm thử xác thực, phân quyền | RES-05 | 2h | 19-19,8 | `TODO(RES-05)`; cần PR #11 merge trước |
| A-61 Kiểm thử quản lý bãi | RES-01 | 1,5h | 4-8,6 | `TODO(RES-01)` |
| A-72 Kiểm thử đặt chỗ | RES-02 | 1,6h | 10-10,9 | `TODO(RES-02)`; bỏ được theo thứ tự Q22 |
| A-76 Kiểm thử thanh toán | RES-04 | 1h | 16-16,9 | `TODO(RES-04)`; bỏ được theo thứ tự Q22 |
| A-77 Kiểm thử báo cáo | RES-05 | 2,58h | 2-4,5 | `TODO(RES-05)` |

**Cách A-87, A-88 vẫn vừa mục tiêu:** (1) PR #11 merge trước 25/11 để A-31 và A-87 chạy trên mã đã sửa; (2) mỗi người phụ trách ghi tình trạng vào bảng trên tại M-03 (24/11); (3) hoạt động nào chưa xong trước 25/11 thì A-87 chạy theo đợt và ghi AT chưa chạy vào P14 (dự phòng của R-G5-01), A-72, A-76 bỏ theo thứ tự Q22 (lựa chọn 3); (4) chuỗi sau nghiệm thu dùng lựa chọn 1 và 2. Nếu tại M-03 còn hơn 2 hoạt động chưa xong, RES-01 quyết định dời phạm vi chạy thử, không dời ngày A-88 (cố định với khách hàng).

## Cần RES-01 quyết định trước hoặc tại M-03 (24/11)

| # | Lựa chọn | Tác dụng | Ghi chú |
|---|---|---|---|
| 1 | Viết A-89, A-110, A-112 song song trước buổi nghiệm thu (bỏ phụ thuộc A-88 → A-89), chỉ điền kết quả sau 27/11 | Rút chuỗi sau nghiệm thu còn A-92 hoàn thiện + A-116 | Không tốn thêm giờ |
| 2 | Chấp nhận làm thứ Bảy 28/11 và Chủ nhật 29/11 cho A-92, A-116 | Đúng kế hoạch CR-01 | Ghi rõ trong V2.0 là làm cuối tuần |
| 3 | Kích hoạt thứ tự Q22 tại M-03 (bỏ kiểm tra A-72, A-76) | −2,6h | Đã là dự phòng của R-G5-04 |
| 4 | Giao lại việc cho RES-02, RES-04 | Giảm tải RES-01, RES-03 | Không đủ một mình (xem trên). **Không dùng cột "Dư" của `generated-v2/resource-load.md` làm giờ trống:** khi lịch vượt cửa sổ (ngày 23,63/15), bộ lập lịch chỉ tính phần việc nằm trong 15 ngày (116,9h), nên "Dư" của cả nhóm (≈ 33h) không phải năng lực thật; effort cơ sở là 169,82h trên 150h. Giờ trống thật ở W14 phải do từng người xác nhận tại M-03 |

Đề xuất của RES-03: áp dụng 1 và 2 ngay, giữ 3 làm dự phòng tại M-03, dùng 4 cho A-33.

## Duyệt

- [ ] RES-01 xem bảng thay đổi và kết quả ở trên, đối chiếu checklist trong `baseline-v2-handoff.md`.
- [ ] RES-01 chọn các lựa chọn ở mục trên; RES-03 cập nhật `plan-v2.0.mjs` và chạy lại.
- [ ] Ghi ngày duyệt: `TODO(RES-01)`.
