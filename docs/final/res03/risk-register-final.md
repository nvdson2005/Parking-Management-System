# Rà soát rủi ro lần cuối (F3-01, A-102)

| Trường | Nội dung |
|---|---|
| Hoạt động | F3-01: A-102 rà soát rủi ro lần cuối (M3 Task 3.4) |
| Người lập | Nguyễn Phạm Mạnh Dũng (RES-03, chủ sổ rủi ro) |
| Ngày | 26/11/2026 (W14, trước A-87 chạy thử và A-88 demo 27/11) |
| Gốc | Sổ M3 `docs/m3/risk-register.md` (chốt 22/11, cập nhật 24/11); sổ V1.0 `docs/m2-report/generated/risks.md` (tag `baseline-v1.0`, không sửa) |
| Dùng cho | Báo cáo cuối A-92 (M3 §3.4), F3-04 chiều "rủi ro", ma trận truy vết F4-03, sheet Risk Register của workbook (F3-05) |
| Còn chờ | Kết quả A-87 (RES-02) và A-88 (RES-01); chấm lại R-G5-02, R-G5-03, R-M3-06 sau hai mốc này |

Theo quy tắc 2 của `docs/m3-m4-final-work-division.md`, file này **không sửa** `docs/m3/risk-register.md`. Trạng thái cuối nằm ở đây. Mục 6 là các dòng để RES-03 dán vào workbook ngày 28/11. Thang điểm L × I và ngưỡng phải phản ứng (Score ≥ 10) giữ như sổ M3, mục 1.

## 1. Sự kiện từ lần rà soát 24/11

- **PR #11 merge vào `main` (24/11, `755caf6`); PR #21 (24/11)** tích hợp nhánh của PR #17 vào `main` (`26a623c`): G-01, G-04..G-09, Q38, Q44, Q45, Q46 có trên `main`. 339/339 test, lint và build đều đạt.
- **A-87 chạy kỹ thuật của RES-01 (24/11)**, trên bản build production và CSDL mới: 100 lượt, 200 sự kiện, 100/100 lượt đủ bản ghi, 6/6 số chỗ trống khớp, đạt ngưỡng 3 s và 5 s (`a87-res01-technical-2026-11-24.md`, PR #19).
- **A-49 (RES-04, 24/11)**: kịch bản 100 lượt, ghi nhận chậm nhất 153 ms, hiển thị chậm nhất 155 ms, so với giới hạn 3 s và 5 s. Retest sau CR-03 giao diện đạt (PR #24, `docs/final/res04/a49-retest.md`).
- **CP-05 (RES-02, 24/11)**: đạt có điều kiện C1-C6. A-68 tìm ra lỗi D-01..D-06. D-01 đã sửa (PR #26, 409 `SIMULATOR_BUSY`). D-02 đã đóng. D-06 đã sửa (PR #27, F5-01). D-03, D-04 (S2) và D-05 (S3) thuộc RES-04. ISS-06..ISS-11 do RES-05 đề xuất, chờ RES-02 phân bổ và RES-01 duyệt.
- **RES-01 quyết định (24/11)** giữ kiểm tra thủ công A-72 và A-76 dù Q22 đã đủ điều kiện kích hoạt. Không có giờ tiết kiệm từ phương án dự phòng.
- **SRS v2.1 và P18 v1.1** đã merge (PR #16, #22): 35 REST + 1 SSE = 36 endpoint (26/11).

## 2. Trạng thái cuối của từng rủi ro

"22/11" là điểm đã chốt trong sổ M3. "26/11" là điểm cuối, do RES-03 (chủ sổ rủi ro) chấm theo thang L × I ở mục 1 của sổ M3. Đến 26/11 RES-01 không chấm lại rủi ro nào. Nếu RES-01 muốn chấm khác, RES-01 thêm một dòng rà soát mới, không sửa dòng ở đây.

### 2.1 Rủi ro của Baseline V1.0

| R-ID | Sự kiện rủi ro | V1.0 | 22/11 | **26/11** | Trạng thái cuối | Căn cứ |
|---|---|---|---|---|---|---|
| R-G1-01 | Khách hàng trả lời muộn hoặc khác giả định | 3 × 1 = 3 | Đã xảy ra | — | **Đã xảy ra hai lần** (ISS-M3-02, vòng 5) | Vòng 3 (15/11) dẫn tới CR-02. Vòng 5 (Q36-Q46, 23/11) cho thấy giả định ở Q44, Q46 sai và thêm Q37, Q38, Q45. Cả hai vòng đã có code trên `main` (PR #4, PR #21). Ảnh hưởng ở mục 3 |
| R-G2-01 | SSE chỗ trống không ổn định, không đạt O1 | 2 × 1 = 2 | 2 × 1 = 2 | **1 × 1 = 1** | **Đóng 24/11** | A-49: chậm nhất 155 ms so với giới hạn 5 s trong kịch bản 100 lượt. A-87 kỹ thuật: 6/6 số chỗ trống khớp |
| R-G2-02 | Sửa hợp đồng API vào/ra làm hỏng bộ mô phỏng hoặc màn hình Staff | 3 × 2 = 6 | 2 × 2 = 4 | **1 × 2 = 2** | Đang theo dõi đến A-88 | A-65 thêm endpoint nhưng test hợp đồng A-79 vẫn đạt. P18 v1.1 khớp code (36 endpoint). Vẫn theo dõi vì F4-01 còn sửa giao diện |
| R-G4-01 | Sửa vào/ra gây lỗi hồi quy | 3 × 2 = 6 | 2 × 2 = 4 | **1 × 2 = 2** | Đang theo dõi đến A-88 | A-68 không thấy hồi quy ở luồng KB-02..KB-05. D-01 là lỗi chạy song song bộ mô phỏng, không phải hồi quy, và đã sửa |
| R-G4-02 | Thành viên không giữ được số giờ mỗi tuần | 2 × 3 = 6 | Đã xảy ra | — | **Đã xảy ra** (ISS-M3-03, ISS-M3-05) | Năng lực 190 h giảm còn 140 h (CR-01), rồi 150 h (W14 thêm 2 h mỗi người). Đến 26/11 dùng 136,75 h (`docs/m3/actuals.md`, pending #12). RES-03 vượt 4,25 h ở W14. Không ai ghi giờ thật (A-100) |
| R-G4-03 | Lần chạy test tự động đầu tiên lỗi nhiều | 3 × 3 = 9 | Đóng | — | Đóng 22/11 | Không xảy ra (181/181 ngày 19/11) |
| R-G5-01 | Mô-đun chưa sửa xong khi dry run | 3 × 3 = 9 | 3 × 3 = 9 | **2 × 2 = 4** | Đang theo dõi | A-28, A-65 lên `main` ngày 24/11, trước A-87. Còn D-03, D-04 (S2, RES-04) và F4-01, F4-02 chưa có bằng chứng đóng trong repo ngày 26/11 |
| R-G5-02 | Dry run tìm thấy nhiều lỗi hơn dự kiến | 3 × 3 = 9 | 4 × 3 = 12 | **3 × 2 = 6** | **Đã xảy ra một phần** (ISS-11) | A-68 tìm ra 6 lỗi (D-01..D-06; 0 lỗi S1, 4 lỗi S2, 2 lỗi S3). Hoạt động ứng phó đã chạy như kế hoạch: phân loại trong ngày, sửa D-01, D-02, D-06 trong 1-2 ngày. Phần còn lại (D-03, D-04, D-05) chỉ ảnh hưởng hiển thị. Chấm lại sau kết quả A-87 |
| R-G5-03 | Khách hàng không xác nhận kịch bản hoặc demo | 3 × 3 = 9 | 3 × 3 = 9 | **3 × 3 = 9** | Mở đến 27/11 | Video CP-05 chưa gửi cho khách hàng (ISS-07, Q23 chưa đáp ứng). A-88 là lần xác nhận duy nhất còn lại trước khi nộp |

### 2.2 Rủi ro thêm trong M3

| R-ID | Sự kiện rủi ro | Lúc thêm | 22/11 | **26/11** | Trạng thái cuối | Căn cứ |
|---|---|---|---|---|---|---|
| R-M3-01 | SRS v0.2 thêm yêu cầu dữ liệu không có trong V1.0 | 3 × 4 = 12 | 2 × 3 = 6 | **1 × 1 = 1** | **Đóng 24/11**, đã xảy ra một phần | Phần đã xảy ra (G-01, G-04, G-06, G-09) đã làm qua CR-04 (RES-03). Khách hàng xác nhận hoãn G-02, G-03, FR-03 ở Q36, Q39, Q40 |
| R-M3-02 | SRS đánh số lại FR nên truy vết bị trỏ sai | 4 × 2 = 8 | 4 × 2 = 8 | **2 × 2 = 4** | Đang theo dõi đến F4-03 | P03 v0.6, SRS v2.1 và P18 v1.1 đã dùng chung một bộ mã. Còn ma trận P24 (F4-03, RES-04) |
| R-M3-03 | Sửa code trước khi CP-02 đạt | — | Đóng | — | Đóng 22/11 | — |
| R-M3-04 | Dùng song song hai bảng checkpoint | 3 × 1 = 3 | 3 × 1 = 3 | **2 × 1 = 2** | Đang theo dõi | CP-05 chấm theo P20 v1.2 mục 7.1, đúng bảng chính thức. Một hiện tượng gần giống đã xảy ra với mã CR (ISS-M3-04) |
| R-M3-05 | Workbook trong repo lệch với bản trên Drive | 3 × 1 = 3 | 3 × 1 = 3 | **2 × 1 = 2** | Đang theo dõi đến 28/11 | Ứng phó: từ ngày 24/11 chỉ RES-03 được sửa workbook, và chỉ dán một lần ngày 28/11 (F3-05) |
| R-G5-04 | Hạn nộp dời lên 29/11, không còn float | 4 × 4 = 16 | 4 × 4 = 16 | **3 × 4 = 12** | Mở đến 29/11 | Giảm L: mọi sản phẩm Must đã lên `main` và chạy kỹ thuật đạt trước 25/11. Đường găng còn lại chỉ là tài liệu: A-88 (27/11) → A-92 (28/11) → nộp (29/11). Mức vẫn **Cao** vì không còn float. Baseline V2.0 dự báo ngày 24,63/15 theo effort kế hoạch; tình hình thực tế tốt hơn dự báo (F3-02) |
| R-M3-06 | Khách hàng không trả lời ngưỡng nghiệm thu gửi kèm Q28 | 3 × 2 = 6 | 3 × 2 = 6 | **2 × 2 = 4** | Mở đến 27/11 | Chạy kỹ thuật đã đạt đúng các ngưỡng nhóm đề xuất (100/100, 6/6, 3 s và 5 s). Còn chờ khách hàng chấp nhận ở A-88 |
| R-M3-07 | Q34, Q35 chưa có code trước A-87 | 3 × 4 = 12 | 3 × 4 = 12 | — | **Đóng 24/11** | G-05 và G-08 lên `main` qua PR #21. Có test |

### 2.3 Rủi ro mới (26/11)

| R-ID | Sự kiện rủi ro | Xác suất | Ảnh hưởng | L × I | Mức | Phụ trách | Giảm thiểu | Dự phòng | Phơi nhiễm (giờ) | Trạng thái |
|---|---|---|---|---|---|---|---|---|---|---|
| R-M3-08 | Báo cáo nộp khi cổng CP-05 còn mở: ISS-06..ISS-11 chưa được phân bổ và duyệt, điều kiện C2 (gửi video, Q23) mới chỉ được miễn theo lời nói | 50% | 1-2 giờ hoàn thiện hồ sơ; có thể bị trừ điểm chất lượng A-68 | 3 × 1 = **3** | Thấp | RES-02 (cổng), RES-01 (duyệt) | F2-03 nhật ký cổng ghi quyết định, ngày, người duyệt; RES-01 duyệt các ISS trước 28/11 | Nếu chưa đóng: A-92 ghi CP-05 là "đạt có điều kiện" kèm danh sách điều kiện còn mở, không ghi "đạt" | 0,75 | Mở |
| R-M3-09 | Giảng viên hỏi về số giờ thực tế khi bảo vệ, nhưng các số đều là ước tính tái dựng | 40% | ≤ 2 giờ chuẩn bị giải thích; mất điểm M4 §4.2 nếu số trình bày như số đo | 3 × 1 = **3** | Thấp | RES-03 | Mọi bảng giờ ghi nhãn "ước tính, chưa đo"; F3-04 nêu cách tính và giới hạn | Trình bày đây là bài học (A-113): ghi giờ hằng ngày ngay từ W12 | 0,8 | Mở |

## 3. Rủi ro đã xảy ra: ảnh hưởng lên lịch, chi phí, phạm vi

Chi phí quy đổi theo đơn giá 50.000 VNĐ/giờ, như Change Log CR-04 (17,5 h = 875.000 VNĐ). Đây không phải tiền mặt.

| R-ID | Khi xảy ra | Lịch | Effort và chi phí | Phạm vi | Cách đã xử lý |
|---|---|---|---|---|---|
| R-G1-01 (vòng 3) | 15/11 | A-22 trễ 7 ngày (19/11 so với 12/11) | CR-02 4,25 h RES-01 (212.500 VNĐ) | Đổi 4 hành vi (Q28, Q31, Q32) | CR-02, PR #4 |
| R-G1-01 (vòng 5) | 23/11 | A-28 hoàn thành 24/11, sau kế hoạch 20/11 4 ngày; không trễ A-87 | 6,0 h trong CR-04 (RES-03): Q37 1,5, Q38 2, Q45 1, Q44 0,5, Q46 1 (300.000 VNĐ). Đây cũng là nhóm D của CR-03 (RES-04); chỉ tính một lần, ở CR-04 | Thêm Q37, Q38, Q45; sửa 2 giả định sai (Q44, Q46) | PR #11, #17, rồi PR #21 |
| R-G4-02 | Tuần 16/11 (CR-01) | Bỏ W15: M-05 từ 07/12 lên 29/11; A-108, A-89, A-110, A-112, A-113 gộp vào A-92 | Năng lực 190 h giảm còn 140 h, rồi 150 h; RES-03 vượt 4,25 h ở W14 | Phương án C: cắt bớt kiểm tra Should/Could, rút A-115 còn kịch bản demo | Quyết định phương án C (RES-01, 19/11), Baseline V2.0 |
| R-M3-01 | 17/11 đến 24/11 | 0 ngày: làm trong A-28, A-65 trước A-87 | CR-04 (RES-03) +17,5 h (875.000 VNĐ), gồm 6,0 h của vòng 5 ở trên | +9 mục làm; 3 mục hoãn được khách hàng xác nhận | Chốt phạm vi P03 v0.4 §11.1 (1,5 h ứng phó) |
| R-G5-02 (một phần) | 24/11 (A-68) | A-68 xong 24/11, sau kế hoạch 23/11 1 ngày; xử lý điều kiện và chạy lại C5 ngày 25/11 | Sửa D-01 khoảng 1 h, D-06 0,5 h (RES-05); D-03, D-04 thuộc RES-04 | Không đổi; D-05 có thể được chấp nhận để mở trong P14 | PR #26, #27, ISS-11 |
| R-G5-04 | 19/11 | Mô hình V2.0 dự báo ngày 24,63/15; thực tế các mốc A-87 (26/11) và A-88 (27/11) vẫn giữ | Khoảng trống 21,3 h (33,9 h kể cả dự phòng) theo mô hình | Không cắt yêu cầu Must; RES-01 giữ A-72, A-76 | Phương án C, W14 thêm giờ, làm cuối tuần 28-29/11 |

## 4. Vấn đề (issue)

| ISS-ID | Vấn đề | Từ rủi ro | Trạng thái cuối | Ghi chú |
|---|---|---|---|---|
| ISS-M3-01 | CP-02, CP-03 chưa có biên bản | — | **Đóng phía RES-03 (24/11)** | CP-02: RES-03 ghi 23/11 (`cp-02-review-res03.md`, pending #12), RES-01 review lần hai 24/11. CP-03: RES-02 review hai vòng ngày 23/11, P03 lên v0.6. RES-02 ghi kết quả cả hai cổng vào nhật ký cổng F2-03 |
| ISS-M3-02 | Câu trả lời vòng 3 khác giả định hoặc khác code MVP | R-G1-01 | **Đóng 24/11** | Q27-Q35 đều đã có code trên `main` (PR #4, PR #21) |
| ISS-M3-03 | Hạn nộp dời lên 29/11 (CR-01) | R-G4-02 | Đã xử lý, còn theo dõi qua R-G5-04 | Baseline V2.0 chốt ở F3-02 |
| ISS-M3-04 | Mã CR-03 được dùng cho hai thay đổi khác nhau: thay đổi phạm vi P03 của RES-03 (22/11, +17,5 h) và thay đổi của RES-04 (câu trả lời của giảng viên 23/11 và khoảng trống A-49, 24/11). PR #19 gộp hai thay đổi làm một. Hai thay đổi còn trùng nhau ở nhóm D của RES-04 (Q37, Q38, Q44, Q45, Q46) | R-M3-04 | **Đã xử lý phía RES-03 (26/11)**; chờ RES-01 ghi vào `decision-record.md` | Nhóm quyết ngày 26/11: CR-03 thuộc RES-04; thay đổi của RES-03 là **CR-04**. Ngày duyệt CR-04 (24/11, RES-01) **suy ra** từ việc RES-01 tích hợp toàn bộ phạm vi này vào `main` qua PR #21; PR #21 không ghi duyệt CR. Nhóm D chỉ tính giờ ở CR-04 (6,0 h); CR-03 tính nhóm A-C. Đã đổi mã trong P03 v0.6, Baseline V2.0 (sinh lại, effort và lịch không đổi) và spec 002-005. Dòng Change Log của CR-04 ở mục 7. Còn ghi CR-03 cho thay đổi của RES-03 trong: `risk-register.md` mục 6 (file dùng chung, không sửa trực tiếp theo quy tắc 2), `baseline-v2-handoff.md`, `m3-m4-final-work-division.md` (F3-02), PR #19 |
| ISS-M3-05 | Không ai ghi giờ thật (A-100) suốt W12-W14 | R-G4-02 | Đã xảy ra, không khắc phục được | Giờ đều là ước tính tái dựng (`actuals.md` mục 1, pending #12); xem R-M3-09 |
| ISS-06..ISS-11 | Điều kiện C1-C6 của CP-05 | R-G5-02, R-M3-08 | Theo `docs/m3/a-68-cp05-test.md` | Do RES-02 phân bổ, RES-01 duyệt |

## 5. Đánh giá công tác quản lý rủi ro (cho A-92 và F3-04)

- **Có tác dụng.** Hai rủi ro mức Cao đã được ứng phó trước khi gây trễ (R-M3-01, R-M3-07): chốt phạm vi ngày 22/11 và gắn hoạt động ứng phó vào A-28, A-65, nên phần việc thêm xong trước A-87. Ứng phó của R-G5-02 (phân loại lỗi trong ngày) giữ được lịch A-87.
- **Chưa có tác dụng.** R-G4-02 được nhận ra từ V1.0, nhưng không có biện pháp theo dõi (A-100 không làm), nên đến cuối dự án vẫn không có số đo. R-G1-01 xảy ra hai lần: nhóm đã chủ động gửi câu hỏi vòng 5, nhưng chậm, nên câu trả lời về ngày 23/11, chỉ 3 ngày trước dry run.
- **Bài học (gửi F5-05, A-113):** ghi giờ theo ngày ngay từ tuần đầu; gửi câu hỏi cho khách hàng sớm hơn một vòng so với hoạt động cần câu trả lời; đánh mã CR tập trung ở một chỗ (Change Log), không đánh trong từng tài liệu.

## 6. Dòng dán vào workbook, sheet Risk Register (F3-05, 28/11)

Cùng định dạng với `docs/m3/workbook-rows.md`.

```text
R-G1-01 | A-16, A-28, A-65 | Client replies late or differ from assumptions | Occurred twice: round 3 (15/11, CR-02) and round 5 (23/11, Q37-Q46) | Effect: CR-02 4.25 h; round-5 items 6.0 h inside CR-04; A-28 finished 4 days late, A-87 not delayed | RES-04 | Status: Occurred, resolved | Updated 26/11
R-G2-01 | A-48, A-49 | SSE availability unstable | Re-rate 1 x 1 = 1: A-49 max display 155 ms vs 5 s in the 100-visit scenario; A-87 technical run 6/6 counts | RES-03 | Status: Closed 24/11 | Updated 26/11
R-G2-02 | A-65, A-79 | Entry/exit API change breaks simulator or Staff screens | Re-rate 1 x 2 = 2: contract tests pass, P18 v1.1 matches 36 endpoints | RES-03 | Status: Watching until A-88 | Updated 26/11
R-G4-01 | A-63, A-68 | Entry/exit fixes cause regressions | Re-rate 1 x 2 = 2: A-68 found no regression in KB-02..KB-05 flows | RES-01 | Status: Watching until A-88 | Updated 26/11
R-G4-02 | W12-W14 | Members cannot keep their hours | Occurred: capacity 190 -> 140 -> 150 h; 136.75 h used to 26/11 (estimated); RES-03 +4.25 h in W14; no measured hours (ISS-M3-05) | RES-01 | Status: Occurred | Updated 26/11
R-G5-01 | A-28, A-65, F4-01 | Modules not fixed by the dry run | Re-rate 2 x 2 = 4: A-28/A-65 on main 24/11 (PR #21); D-03, D-04 open (RES-04) | RES-02 | Status: Watching | Updated 26/11
R-G5-02 | A-68, A-87 | Dry run finds more defects than expected | Partly occurred: D-01..D-06 at CP-05 (0 S1, 4 S2, 2 S3); D-01, D-02, D-06 fixed; re-rate 3 x 2 = 6 | RES-02 | Status: Occurred (partly), ISS-11 | Updated 26/11
R-G5-03 | A-85, A-88 | Client does not confirm scenarios or demo | 3 x 3 = 9 unchanged: CP-05 video not emailed (ISS-07, Q23) | RES-02 | Status: Open until 27/11 | Updated 26/11
R-M3-01 | A-24, A-28, A-65 | SRS v0.2 adds data requirements not in V1.0 | Re-rate 1 x 1 = 1: occurred part done via CR-04 (RES-03, +17.5 h); G-02, G-03, FR-03 deferral confirmed by client (Q36, Q39, Q40) | RES-03 | Status: Closed 24/11 | Updated 26/11
R-M3-02 | P03, P18, P24 | FR renumbering breaks traceability | Re-rate 2 x 2 = 4: P03 v0.6, SRS v2.1, P18 v1.1 aligned; P24 pending (F4-03) | RES-04 (P02, P24), RES-03 (P03) | Status: Watching until F4-03 | Updated 26/11
R-M3-04 | CP-01..CP-07 | Two checkpoint tables in use | Re-rate 2 x 1 = 2: CP-05 judged against P20 v1.2; related ID clash ISS-M3-04 handled by RES-03 26/11 (RES-03 change renamed CR-04), RES-01 to record | RES-01 | Status: Watching | Updated 26/11
R-M3-05 | Workbook | Repo workbook drifts from Drive | Re-rate 2 x 1 = 2: single editor RES-03, one paste on 28/11 | RES-03 | Status: Watching until 28/11 | Updated 26/11
R-G5-04 | A-88, A-92, A-116 | Deadline compression to 29/11, no float | Re-rate 3 x 4 = 12 (High): all Must products on main and technically verified by 25/11; remaining critical path A-88 -> A-92 -> submission | RES-01 | Status: Open until 29/11 | Updated 26/11
R-M3-06 | A-87, A-88, P21 | Client does not answer acceptance thresholds (Q28) | Re-rate 2 x 2 = 4: technical run met the proposed thresholds (100/100, 6/6, 3 s / 5 s) | RES-01, RES-02 | Status: Open until 27/11 | Updated 26/11
R-M3-07 | A-28, A-65 | Q34, Q35 not coded before A-87 | G-05, G-08 on main via PR #21 with tests | RES-03 | Status: Closed 24/11 | Updated 26/11
R-M3-08 | A-68, CP-05, A-92 | Report submitted with CP-05 still open (ISS-06..ISS-11 unallocated, C2 waived verbally) | Likelihood 50% | Impact: 1-2 h paperwork, possible quality mark on A-68 | Score 3 x 1 = 3 | RES-02, RES-01 | Response: F2-03 gate log, RES-01 approves ISS rows before 28/11 | Fallback: report CP-05 as conditional pass with open conditions | Status: Open | Raised 26/11
R-M3-09 | A-90, F3-04, A-92 | Viva questions on actual hours that are reconstructed estimates | Likelihood 40% | Impact: up to 2 h, M4 4.2 marks if shown as measured | Score 3 x 1 = 3 | RES-03 | Response: every hour table labelled estimated, F3-04 states method and limits | Fallback: present as lesson learned (A-113) | Status: Open | Raised 26/11
```

## 7. Dòng dán vào workbook, sheet Change Log: CR-04 (F3-05, 28/11)

Thay cho dòng CR-03 soạn sẵn ở `docs/m3/risk-register.md` mục 6 (cùng nội dung, đổi mã, thêm ghi chú nhóm D, điền người duyệt và ngày duyệt; xem ISS-M3-04). Cùng định dạng cột với `docs/m3/decision-record.md`.

```text
CR-04 | 22/11/2026 (cập nhật 24/11) | RES-03 (từ câu trả lời vòng 3 Q34, Q35, vòng 5 Q36-Q46 và đối chiếu SRS v0.2) | Nhóm D trong CR-03 của RES-04 (Q37, Q38, Q44, Q45, Q46) được làm và tính giờ tại đây, không tính lại ở CR-03. (1) Làm: Staff tra cứu xe và đặt chỗ (Q34, G-08); xóa biển số tự động sau 12 tháng (Q35, G-05); chỉ mục G-07; **bổ sung 23/11 sau review CP-03 của RES-02:** ghi đăng nhập thất bại và từ chối quyền (G-06, FR-43, AT-03, AT-04) và cổng vào/ra trên lượt gửi (G-09, FR-09, AT-01); vòng review thứ hai: nguồn ghi nhận DEVICE/MANUAL (G-04, FR-10, AT-01 bước 5); **bổ sung 24/11 theo vòng 5 của khách hàng:** giờ hoạt động chỉ để thông báo (Q37, G-01, FR-22), Customer xin đổi nhóm và Manager cập nhật (Q38, FR-07, FR-08), Customer xem bảng giá nhóm mình (Q45, FR-26), mốc xóa tính từ giờ ra (Q44), Staff chỉ xem biển số đã che với lượt đã đóng (Q46, FR-42); lọc nhật ký theo tài khoản, thao tác, thời gian (FR-44 của SRS v0.2, vì AT-04 bước 8 mức Must kiểm tra). (2) Hoãn: bảng giá theo bãi/theo giờ (G-02), mục giá trên giao dịch (G-03; AT-06 xác định mục giá qua loại xe, nhóm phí và số tiền), hết phiên sau 30 phút (FR-03); khách hàng xác nhận ở Q36 (chỉ tính theo lượt), Q39 (không bắt buộc hết phiên), Q40 (một bãi thí điểm). (3) Chấp nhận KB-16 không sửa. (4) Sửa tiêu chí PD-P03 số 8 và 10 | P03, P07, P11, P14, P21, A-28, A-65 | +17,5 (trong A-28, A-65: 5 h ban đầu; G-06 1,5 h, G-09 2 h, G-04 1,5 h sau review CP-03; G-01 1,5 h, Q38 2 h, Q45 1 h, Q44 0,5 h, Q46 1 h theo vòng 5; FR-44 1,5 h); Baseline V2.0: A-28 7,75 h, A-65 15,83 h | 0 (đã làm 23-24/11, trước A-87) | 17,5 h = 875.000 VNĐ quy đổi | Thêm các hành vi khách hàng yêu cầu ở vòng 3 và vòng 5, 3 yêu cầu Must mà bộ AT kiểm tra; 3 yêu cầu SRS v0.2 hoãn có xác nhận của khách hàng, ghi trong P14 | R-M3-01 giảm 12 → 6 → 3; R-M3-07 có ứng phó | 1 làm hết cùng phạm vi (29,5 h: G-01 đến G-09 21 h, FR-03 2,5 h, Q38 2 h, Q45 1 h, Q44 0,5 h, Q46 1 h, FR-44 1,5 h), 2 làm theo khách hàng, bộ AT và việc nhỏ (17,5 h), 3 không làm gì | Phương án 2: tiết kiệm 12 h (G-02 8 h, G-03 1,5 h, FR-03 2,5 h, khách hàng đã xác nhận hoãn) | Đáp ứng mọi câu trả lời vòng 3 và vòng 5 trong giờ còn lại; theo Q22 ưu tiên chức năng cốt lõi | Nguyễn Võ Đức Sơn (RES-01, PM) | 24/11/2026 | Có, đưa vào Baseline V2.0 (A-106)
```
