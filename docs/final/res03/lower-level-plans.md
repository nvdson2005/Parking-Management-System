# Kế hoạch cấp thấp lập trong lúc thực hiện (F3-03, M3 Task 3.8)

| Trường | Nội dung |
|---|---|
| Hoạt động | F3-03: Task 3.8, kế hoạch cấp thấp và lý do không lập được ở giai đoạn baseline |
| Người lập | Nguyễn Phạm Mạnh Dũng (RES-03) |
| Ngày | 26/11/2026 |
| Baseline so sánh | Baseline V1.0, nộp ngày 09/11/2026 (M-01, tag `baseline-v1.0`) |
| Dùng cho | Báo cáo cuối A-92 (M3 §3.8); RES-01 ghi một dòng trong weekly log (F1-01) |

Yêu cầu của Task 3.8: lập kế hoạch cấp thấp khi có thêm chi tiết trong lúc thực hiện, và giải thích vì sao chi tiết đó chưa phù hợp hoặc chưa thể có ở giai đoạn lập kế hoạch trước. Mỗi kế hoạch dưới đây được lập **sau** ngày 09/11. Baseline V1.0 không bị sửa; các kế hoạch này nằm trong file riêng, và phần làm thay đổi baseline đi vào V2.0 (A-106).

## 1. Danh sách kế hoạch cấp thấp

| # | Kế hoạch | Ngày lập | Người lập | Chi tiết thêm so với V1.0 | Nằm ở |
|---|---|---|---|---|---|
| L-01 | Phân công M3/M4 và 16 hoạt động mới A-100..A-116 | 09/11 | RES-01 | Ánh xạ từng Task 3.x, 4.x sang người phụ trách; lịch tuần của từng người; giờ PERT cho hoạt động mới (≈ 32,5 h) | `docs/m3-m4-work-division.md` mục 3-5 |
| L-02 | Spec Kit cho các sửa lỗi KB-01..KB-19 | 19/11 | RES-01 | Yêu cầu, kế hoạch và danh sách task cho từng KB đã được quyết trong P18 v1.0 | `specs/001-m3-kb-fixes/` |
| L-03 | Kế hoạch W13-W14 sau khi đổi hạn nộp (CR-01) | 19/11 | RES-01 | Lịch mới bỏ W15; cắt giảm theo phương án C; điểm kích hoạt Q22 tại M-03 | `docs/m3-m4-work-division.md` mục 7, `decision-record.md` |
| L-04 | Chốt phạm vi CR-03 và bảng khoảng trống G-01..G-09 | 22/11, cập nhật đến 24/11 | RES-03 | Từng khoảng trống so với SRS: làm hay hoãn, giờ, người quyết, commit | P03 v0.4-v0.6 §11.1, `risk-register.md` mục 6 |
| L-05 | Spec Kit cho các thay đổi của A-28, A-65 | 23/11-24/11 | RES-03 | Yêu cầu, plan, task và test cho G-05 (xóa tự động), G-08 (Staff tra cứu), G-06, G-09 (nhật ký và cổng), Q37, Q38, Q45 | `specs/002-a28-auth-log-purge/`, `003-a65-staff-lookup-api/`, `004-g06-g09-auth-log-gate/`, `005-q37-q38-q45-client-round5/` |
| L-06 | Đối chiếu nghiệm thu với câu trả lời của giảng viên (Phase 5) | 23/11 | RES-01 | 11 câu trả lời vòng 5 chuyển thành yêu cầu nghiệm thu và việc của từng người | `specs/002-lecturer-acceptance-alignment/`, PR #19 |
| L-07 | Baseline V2.0 | 23/11-24/11 | RES-03 (lập), RES-01 (duyệt) | Kế hoạch, Gantt, CPM, rủi ro sinh lại với CR-01 và CR-03; mục tiêu và dự báo cho A-87, A-88 | `docs/m2-report/data/plan-v2.0.mjs`, `generated-v2/`, `docs/m3/baseline-v2.0.md` |
| L-08 | Spec Kit cho CR-03 giao diện (A-49) | 24/11 | RES-04 | Các việc sửa màn hình chỗ trống FR-19..FR-21 và lỗi trên đường demo | `specs/006-cr03-ui-fixes/` |
| L-09 | Phân công cuối M3/M4 (F1-01..F5-07) | 24/11 | RES-01 | 26 task có file đầu ra, mục báo cáo, giờ và thứ tự phụ thuộc cho 24/11-29/11; quy tắc mỗi file một người sửa | `docs/m3-m4-final-work-division.md` |
| L-10 | Xử lý điều kiện CP-05 (A-117) | 25/11-26/11 | RES-01, RES-05 | Điều kiện C1-C6, ISS-06..ISS-11, sửa D-01 và D-06, người kiểm và hạn | `docs/m3/cp05-follow-up-verification.md`, `specs/005-cp05-gate-follow-up/`, `006-a68-d01-simulator-single-run/`, `007-f5-01-simulator-test-timeout/` |
| L-11 | Kịch bản demo A-88 và kế hoạch mock viva (A-115) | 25/11 | RES-05 | Thứ tự trình diễn, ai trình bày gì, cách xử lý lỗi đã biết khi demo, mỗi người giải thích một sản phẩm không do mình làm | `docs/final/res05/demo-script-and-viva.md` |
| L-12 | Kế hoạch đóng của RES-03 | 26/11 | RES-03 | Thứ tự F3-01..F3-05 và phần còn lại của PR #12; quy tắc ghi giờ ước tính | `docs/superpowers/plans/2026-11-26-res03-final-closure.md` |

## 2. Vì sao chi tiết này không có trong Baseline V1.0

Các kế hoạch được chia theo nguyên nhân. Nhóm cũng ghi rõ trường hợp **lẽ ra đã lập được từ trước** (nhóm A), vì đó là sai sót trong lập kế hoạch, không phải chi tiết mới phát sinh.

### Nhóm A: lẽ ra lập được ở baseline (bỏ sót)

| Kế hoạch | Lý do bỏ sót | Ảnh hưởng |
|---|---|---|
| L-01 (A-100..A-116) | Lúc lập baseline, nhóm lấy danh sách hoạt động từ các sản phẩm phần mềm (P01-P24) theo Step Wise, nhưng không đối chiếu từng Task 3.x, 4.x của đề bài. Các hoạt động quản lý như ghi giờ (A-100), theo dõi kế hoạch và thực tế (A-103), sổ rủi ro hằng tuần (A-102) và các mục báo cáo M4 vì vậy bị thiếu | +32,5 h ngay đầu M3; mức sử dụng năng lực từ 73% lên khoảng 91% (L-01 mục 4). A-100 không được thực hiện, nên đến cuối dự án vẫn không có giờ đo (ISS-M3-05) |

Bài học (gửi A-113): ngoài danh sách sản phẩm, cần đối chiếu từng yêu cầu của đề bài khi lập work breakdown.

### Nhóm B: phụ thuộc thông tin chỉ có sau baseline

| Kế hoạch | Thông tin còn thiếu ngày 09/11 | Có khi nào |
|---|---|---|
| L-02 | Cách sửa KB-01..KB-19 phụ thuộc quyết định thiết kế trong P18 v1.0 (ví dụ KB-02, KB-03 được chấp nhận, không sửa). Lập task sửa code trước khi có quyết định thì phải làm lại | P18 v1.0, 19/11 (A-22) |
| L-04, L-05 | Khách hàng chưa trả lời vòng 3 (Q27-Q35). Chưa biết phải làm Staff tra cứu (Q34) và xóa biển số tự động (Q35). SRS v0.2 (15/11) thêm yêu cầu dữ liệu mới. Review CP-03 tìm thêm G-06, G-09 | Vòng 3 ngày 15/11; SRS v0.2 ngày 15/11; CP-03 ngày 23/11 |
| L-06, phần Q37-Q46 của L-05 | Vòng 5 (Q36-Q46) chưa được gửi. Hai giả định của nhóm (Q44 tính thời hạn lưu từ lúc vào, Q46 Staff xem đầy đủ biển số) chỉ biết là sai khi khách hàng trả lời | 23/11 |
| L-08 | Các khoảng trống FR-19..FR-21 trên màn hình chỗ trống chỉ lộ ra khi chạy kiểm thử A-49 | 23/11-24/11 |
| L-10 | Điều kiện C1-C6 và lỗi D-01..D-06 là kết quả của cổng CP-05. Theo định nghĩa, chúng không có trước khi kiểm thử | 24/11 |

### Nhóm C: do sự kiện thay đổi

| Kế hoạch | Sự kiện | Lý do không lập trước được |
|---|---|---|
| L-03, L-07, L-09 | Giảng viên dời hạn nộp từ 07/12 lên 29/11 (CR-01, tuần 16/11) | Đề bài báo trước sẽ có một sự kiện thay đổi, và L-01 đã dự trù A-105 (họp chọn phương án) và A-106 (V2.0, có điều kiện), nhưng nội dung (bỏ W15, năng lực còn 140 h, cắt giảm nào) phụ thuộc vào chính sự kiện. Lập trước nhiều phương án chi tiết thì tốn giờ cho kịch bản không xảy ra. Đây là cách làm Step Wise khuyến nghị: chỉ lập chi tiết khi thông tin đã rõ |

### Nhóm D: chi tiết ngắn hạn, không phù hợp để đưa vào baseline

| Kế hoạch | Lý do |
|---|---|
| L-11, L-12 | Kịch bản demo theo từng phút và thứ tự việc trong 2-3 ngày cuối phụ thuộc vào trạng thái code và lỗi còn mở lúc đó. Đưa vào baseline 3 tuần trước thì chắc chắn phải sửa, và baseline sẽ rối với các chi tiết không phải để kiểm soát dự án |

## 3. Cách các kế hoạch cấp thấp nối với baseline

- **Không sửa V1.0.** L-01 và L-03 nằm trong file riêng. Phần làm thay đổi effort, lịch hoặc phạm vi đi vào Baseline V2.0 (L-07). V1.0 giữ ở tag `baseline-v1.0` và `data/archive/` (`baseline-v1.0-freeze.md`).
- **Truy vết bằng A-ID.** Mỗi kế hoạch Spec Kit và mỗi commit ghi A-ID của baseline (A-28, A-65, A-49, A-68), hoặc A-ID mới (A-100..A-117). Nhờ vậy giờ của các kế hoạch cấp thấp cộng ngược về hoạt động gốc trong `docs/m3/actuals.md`.
- **Thay đổi phạm vi qua CR.** L-04, L-05, L-06 và L-08 chỉ được làm sau khi có CR (CR-02, CR-03) hoặc quyết định của RES-01 ghi trong `decision-record.md`.

## 4. Vấn đề phát hiện khi tổng hợp

| Vấn đề | Đề xuất |
|---|---|
| Thư mục Spec Kit trùng số: hai thư mục `002-*`, hai thư mục `005-*`, hai thư mục `006-*`, vì các thành viên tạo song song trên các nhánh khác nhau | Không đổi tên (nhiều tài liệu và commit đã trỏ tới). A-92 dẫn đường dẫn đầy đủ, không chỉ số |
| Mã CR-03 được dùng cho hai thay đổi (ISS-M3-04 trong `risk-register-final.md`) | RES-01 quyết; đề xuất đổi thay đổi của RES-04 thành CR-04 |
| L-01 giao A-108 (tổng hợp M3), A-89, A-110, A-112 và A-113 là tài liệu riêng; L-03 gộp chúng vào A-92 | A-92 ghi theo L-03 (bản mới hơn, có quyết định của RES-01) |
