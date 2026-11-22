# Project Baseline V2.0 (A-106, Task 3.7)

| Trường | Nội dung |
|---|---|
| Người sinh | Nguyễn Phạm Mạnh Dũng (RES-03), 23/11/2026 |
| Người duyệt | Nguyễn Võ Đức Sơn (RES-01). **Chưa duyệt**, xem checklist trong `baseline-v2-handoff.md` |
| Lý do | CR-01: hạn nộp dời từ 07/12 lên 29/11 (bắt buộc V2.0). Kèm CR-02 (vòng 3, không đổi effort) và CR-03 (Q34, Q35; chờ RES-01 duyệt) |
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
| A-28 | 3,17h | **3,75h**: thêm xóa tự động (Q35, G-05); KB-16 chấp nhận, bỏ 1h | CR-03 |
| A-65 | 4,33h | **7,33h**: thêm Staff tra cứu xe, đặt chỗ (Q34, G-08) và chỉ mục (G-07); bỏ phụ thuộc A-27 | CR-03 |
| A-87 | phụ thuộc A-95 | phụ thuộc A-85, A-67 và thêm **A-28, A-65** (phải xong trước chạy thử) | |
| A-92 | phụ thuộc A-90, A-87 | thêm A-89, A-110, A-112, A-113 (các mục của báo cáo) | Phương án C |
| Rủi ro | 9 rủi ro V1.0 | 14 rủi ro theo sổ ngày 22/11 (bỏ R-G1-01 đã xảy ra, R-G4-03 và R-M3-03 đã đóng). R-G4-02 và R-G5-04 là rủi ro năng lực, không tính vào dự phòng | `risk-register.md` |

## Kết quả

| Chỉ số | V1.0 | V2.0 | Chênh lệch |
|---|---|---|---|
| Effort cơ sở | 131,15h | 158,82h | +27,67h |
| Dự phòng làm lại | 8,45h | 15,58h | +7,13h (rủi ro mới R-M3-01, R-M3-02, R-M3-07) |
| Tổng effort baseline | 139,6h | **174,39h** | +34,79h |
| Năng lực | 190h | **150h** | −40h |
| Mức sử dụng năng lực | 73,47% | **116,26%** | |
| Chi phí quy đổi (50.000 VNĐ/h) | 6.980.000 VNĐ | 8.719.583 VNĐ | +1.739.583 VNĐ |
| Đường găng (mạng lý tưởng) | A-22 → A-23 → A-44 → A-45 → A-67 → A-68 → A-90 → A-92 = 10,63 ngày | A-22 → A-23 → A-44 → A-45 → A-67 → A-49 → A-87 → A-88 → A-89 → A-92 → A-116 = 12,97 ngày | Dài hơn vì nghiệm thu và nộp bài nằm trên đường găng |
| Lịch đã cân bằng nguồn lực | xong 01/12 (ngày 16,69 / 20) | **ngày 18,99 / 15: vượt khoảng 4 ngày làm việc** | |

Bộ lập lịch báo lỗi `Levelled schedule ends on working day 18.99 > 15`. Nhãn "27/11" trong `generated-v2/totals.md` và `schedule.md` là ngày cuối của cửa sổ (bộ lập lịch chặn nhãn ở đó), không phải ngày xong thực tế.

So với decision record (19/11, 164,1h): V2.0 cao hơn vì (1) CR-03 thêm khoảng 3,6h vào A-28, A-65; (2) dự phòng được tính lại theo 14 rủi ro hiện tại (15,58h thay vì 8,45h). Nếu chỉ so effort cơ sở với năng lực: 158,82h so với 150h, **thiếu khoảng 8,8h**; tính cả dự phòng thì thiếu khoảng 24,4h.

## Vì sao vẫn vượt

1. **Thiếu năng lực:** 116% tải. Đây là R-G5-04 đã ghi trong sổ rủi ro, đúng như dự báo của decision record.
2. **Chuỗi sau buổi nghiệm thu:** A-88 cố định 27/11 (thứ Sáu), nhưng A-89 → A-92 → A-116 phải làm sau đó. Lịch thứ Hai đến thứ Sáu không còn ngày nào, trong khi kế hoạch CR-01 tính A-92 xong thứ Bảy 28/11 và nộp Chủ nhật 29/11.
3. Đã thử chuyển A-33 và một nửa A-65 từ RES-03 sang RES-05: lịch chỉ giảm từ 18,99 xuống 18,63 ngày. Vì vậy tắc nghẽn không nằm ở một người mà ở tổng giờ và chuỗi phụ thuộc. Phương án này **không** đưa vào V2.0 vì việc giao lại là quyết định của RES-01.

## Cần RES-01 quyết định trước hoặc tại M-03 (24/11)

| # | Lựa chọn | Tác dụng | Ghi chú |
|---|---|---|---|
| 1 | Viết A-89, A-110, A-112 song song trước buổi nghiệm thu (bỏ phụ thuộc A-88 → A-89), chỉ điền kết quả sau 27/11 | Rút chuỗi sau nghiệm thu còn A-92 hoàn thiện + A-116 | Không tốn thêm giờ |
| 2 | Chấp nhận làm thứ Bảy 28/11 và Chủ nhật 29/11 cho A-92, A-116 | Đúng kế hoạch CR-01 | Ghi rõ trong V2.0 là làm cuối tuần |
| 3 | Kích hoạt thứ tự Q22 tại M-03 (bỏ kiểm tra A-72, A-76) | −2,6h | Đã là dự phòng của R-G5-04 |
| 4 | Giao lại việc cho RES-02, RES-04 (còn 6,4h và 4,1h ở W14) | Giảm tải RES-01, RES-03 | Không đủ một mình (xem trên) |

Đề xuất của RES-03: áp dụng 1 và 2 ngay, giữ 3 làm dự phòng tại M-03, dùng 4 cho A-33.

## Duyệt

- [ ] RES-01 xem bảng thay đổi và kết quả ở trên, đối chiếu checklist trong `baseline-v2-handoff.md`.
- [ ] RES-01 chọn các lựa chọn ở mục trên; RES-03 cập nhật `plan-v2.0.mjs` và chạy lại.
- [ ] Ghi ngày duyệt: `TODO(RES-01)`.
