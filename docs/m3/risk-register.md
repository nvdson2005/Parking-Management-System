# Sổ rủi ro M3 (A-102)

| Trường | Nội dung |
|---|---|
| Hoạt động | A-102 Rà soát sổ rủi ro hằng tuần (P01) |
| Người lập | Nguyễn Phạm Mạnh Dũng (RES-03) |
| Gốc | Sổ rủi ro Baseline V1.0, báo cáo M2 mục 2.8.2 (`docs/m2-report/generated/risks.md`, tag `baseline-v1.0`) |
| Cập nhật gần nhất | 22/11/2026 (cuối W13) |
| Trạng thái | **Đã chốt ngày 22/11 bởi RES-03** (chủ sổ rủi ro): điểm, trạng thái và hoạt động ứng phó dưới đây là bản chính thức. RES-01 xem lại tại buổi A-97; nếu RES-01 đổi điểm nào thì ghi một dòng rà soát mới ở mục 5, không sửa dòng cũ. Riêng CR-03 (mục 6) cần RES-01 duyệt mới được ghi vào Change Log |

Sổ V1.0 không bị sửa. File này ghi trạng thái hiện tại, các lần chấm lại và rủi ro mới. Mọi thay đổi cũng được chép sang sheet `Risk Register` của workbook dùng chung.

Các sự kiện từ lần rà soát trước (17/11) được tính đến trong bản này:
- **CR-01** (tuần 16/11): giảng viên dời hạn nộp báo cáo cuối và sản phẩm (M-05) từ 07/12 lên **29/11**. Năng lực còn 140h; phương án C (`docs/m3/decision-record.md`).
- **CR-02** (15/11): bốn thay đổi theo câu trả lời vòng 3 (Q28, Q31, Q32), đã ghi Change Log 19/11.
- Nhánh round3 merge vào `main` qua PR #4 (`8fd4926`, 19/11). Hợp đồng vào/ra có test hợp đồng (A-79, PR #6, `tests/contract-inout.test.ts`).
- P18 v1.0 (A-22) xong 19/11. A-63 xong 19/11. Bộ test 181/181 đạt (19/11).
- Đối chiếu lại đủ 9 câu trả lời vòng 3 (Q27-Q35) với code `main` ngày 22/11 (P03 v0.4).

## 1. Thang điểm

Theo thang điểm rủi ro mức hoạt động đã thống nhất ở M2 (Drafts M2).

| L | Khả năng xảy ra | I | Mức ảnh hưởng |
|---|---|---|---|
| 1 | ≤ 10% | 1 | ≤ 4 giờ, không ảnh hưởng lịch |
| 2 | > 10% đến 30% | 2 | > 4 đến 12 giờ, hấp thụ được bằng float |
| 3 | > 30% đến 50% | 3 | > 12 đến 24 giờ, trễ 1-2 ngày ở hoạt động không găng, hoặc giảm một yêu cầu Should/Could |
| 4 | > 50% đến 80% | 4 | > 24 đến 48 giờ, trễ 3-5 ngày trên đường găng, hoặc giảm chất lượng một yêu cầu Must |
| 5 | > 80% | 5 | > 48 giờ, trễ mốc milestone, hoặc phải bỏ yêu cầu Must |

| Score = L × I | Mức | Cách xử lý |
|---|---|---|
| 1-4 | Thấp | Chấp nhận, theo dõi trong log tuần |
| 5-9 | Trung bình | Phải có phương án dự phòng |
| 10-14 | Cao | Phải có biện pháp chủ động: thêm hoạt động ứng phó vào lịch, kèm ước lượng giờ |
| 15-25 | Nghiêm trọng | Như mức Cao, báo PM ngay, xem lại ở mỗi checkpoint |

**Ngưỡng phải phản ứng chủ động: Score ≥ 10.** Trạng thái dùng các giá trị: Mở, Đang theo dõi, Đã xảy ra (chuyển sang mục 4), Đóng.

## 2. Rủi ro của Baseline V1.0: trạng thái tại 22/11

| R-ID | Sự kiện rủi ro | V1.0 L × I | 17/11 | **22/11** L × I | Phụ trách | Trạng thái | Căn cứ / ghi chú |
|---|---|---|---|---|---|---|---|
| R-G1-01 | Khách hàng phản hồi vòng 3 hoặc duyệt baseline muộn, hoặc trả lời khác giả định | 3 × 1 = 3 | Đã xảy ra | — | RES-04 | **Đã xảy ra** (ISS-M3-02) | Vòng 3 (Q27-Q35) trả lời 15/11. Q29, Q30, Q33 đồng ý giả định. Q27, Q32 đồng ý nhưng Q32 khác code MVP (chưa hủy đặt chỗ khi tạm ngưng). Q28, Q31, Q34 khác giả định. Q35 đúng giả định (xóa tự động) nhưng khác code MVP (xóa thủ công). Phần ngưỡng nghiệm thu trong Q28 không được trả lời (R-M3-06). Email duyệt Baseline V1.0 (09/11) vẫn chưa có phản hồi |
| R-G2-01 | Cập nhật chỗ trống qua SSE không ổn định khi kiểm thử, không đạt O1 | 2 × 1 = 2 | 2 × 1 = 2 | 2 × 1 = 2 | RES-03 | Mở | A-67 (20/11): 120 sự kiện mô phỏng, không lỗi. A-49 làm ở W14 |
| R-G2-02 | Sửa hợp đồng API vào/ra (KB-01) làm hỏng bộ mô phỏng hoặc màn hình Staff | 3 × 2 = 6 | 4 × 2 = 8 | **2 × 2 = 4** | RES-03 | Đang theo dõi | Giảm L: P18 v1.0 (19/11) đóng băng hợp đồng với hai thay đổi đã biết (KB-04, KB-05); có test hợp đồng A-79; A-67 chạy 25 kiểm tra HTTP đạt. Còn rủi ro khi A-65 thêm endpoint mới |
| R-G4-01 | Sửa luồng vào/ra (KB-02 đến KB-05) gây lỗi hồi quy ở chỗ trống hoặc ngoại lệ | 3 × 2 = 6 | 3 × 2 = 6 | **2 × 2 = 4** | RES-01 | Đang theo dõi | A-63 xong 19/11, bộ test 181/181 đạt, có test hồi quy KB-02 đến KB-05, KB-13. CR-01 làm giảm thời gian khắc phục nếu lỗi xuất hiện ở A-68 |
| R-G4-02 | Thành viên không giữ được số giờ mỗi tuần | 2 × 3 = 6 | 2 × 3 = 6 | — | RES-01 | **Đã xảy ra** (ISS-M3-03) | CR-01 bỏ W15: năng lực 190h → 140h, nhu cầu ≈ 164,1h sau cắt giảm. Ứng phó: W14 thêm 2h mỗi người. Giờ thực tế (A-100) vẫn chưa có, các tuần đang ghi bằng giả định |
| R-G4-03 | Lần chạy kiểm thử tự động đầu tiên lỗi nhiều | 3 × 3 = 9 | 3 × 3 = 9 | — | RES-02 | **Đóng 22/11** | Rủi ro không xảy ra: bộ test đạt 181/181 ngày 19/11 (Quality Evidence trong `docs/m3/workbook-rows.md`). Lỗi ở các lần chạy sau thuộc R-G5-01, R-G5-02. RES-02 bổ sung ngày chạy A-96 vào Quality Evidence |
| R-G5-01 | Mô-đun chưa sửa xong khi dry run | 3 × 3 = 9 | 3 × 3 = 9 | 3 × 3 = 9 | RES-02 | Mở | CR-01 gộp A-95 vào A-87, xác suất 35% → 45% (vẫn L = 3). A-28, A-65 (RES-03) chưa bắt đầu và đều phải xong trước A-87 (26-27/11) |
| R-G5-02 | Dry run phát hiện nhiều lỗi hơn dự kiến | 3 × 3 = 9 | 3 × 3 = 9 | **4 × 3 = 12** | RES-02 | Mở | CR-01: xác suất 45% → 55%, nên L = 4, mức **Cao**. Hoạt động ứng phó: A-87 chạy kịch bản Must trước, lỗi được phân loại ngay trong ngày; lỗi chưa sửa đưa vào P14 (giữ trong 0,5h dự phòng của RES-02) |
| R-G5-03 | Khách hàng không phản hồi xác nhận kịch bản hoặc demo | 3 × 3 = 9 | 3 × 3 = 9 | 3 × 3 = 9 | RES-02 | Mở | A-85 chưa ghi kết quả. Vòng 3 cho thấy khách hàng có trả lời qua email, nhưng không trả lời phần ngưỡng nghiệm thu (R-M3-06) |

## 3. Rủi ro mới

| R-ID | Ngày | Sự kiện rủi ro | Xác suất | Ảnh hưởng | L × I | Mức | Phụ trách | Giảm thiểu | Dự phòng | Phơi nhiễm (giờ) | Trạng thái |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R-M3-01 | 17/11 | SRS v0.2 (15/11) thêm yêu cầu dữ liệu không có trong Baseline V1.0: giờ hoạt động (FR-22), bảng giá theo bãi và theo giờ (FR-24, FR-34), mục giá trên giao dịch (FR-36), hết phiên sau 30 phút (FR-03). Phải đổi lược đồ, tính phí, giao diện, test | 10% (17/11, 22/11: 30%) | Sau khi chốt: +5h (G-05, G-07, G-08) trong A-28, A-65; review CP-03 (23/11) thêm G-06, G-09 và G-04 (+5h, đã làm). **Vòng 5 của khách hàng (23/11):** Q37 yêu cầu giờ hoạt động (G-01, phần rủi ro này đã xảy ra, đã làm 24/11, +1,5h); Q36, Q39, Q40 xác nhận việc hoãn G-02, G-03, FR-03. Cùng vòng, Q38, Q44, Q45, Q46 thêm 4,5h (đã làm 24/11). Rủi ro còn lại: RES-01 không duyệt CR-03 cho G-02, G-03, FR-03, phải làm thêm khoảng 12h | **1 × 3 = 3** (17/11: 12; 22/11: 6) | Thấp | RES-03 | **Hoạt động ứng phó đã làm (22/11, 1,5h RES-03):** phân tích khoảng trống và chốt phạm vi trong P03 v0.4 mục 11.1; soạn CR-03 (mục 6) | Nếu CP-03 hoặc khách hàng yêu cầu một mục bị hoãn thì làm theo thứ tự Must trước (FR-03, G-01), qua CR riêng (đã dùng cho G-01 ngày 24/11) | 1,2 | Đang theo dõi |
| R-M3-02 | 17/11 | SRS v0.2 đánh số lại FR nên truy vết trong P03, P18, P24, test và chú thích code trỏ sai yêu cầu | 70% | +6h ánh xạ lại; CP-02/CP-03 có thể bị trả về | 4 × 2 = 8 | Trung bình | RES-04 (P02, P24), RES-03 (P03) | Bảng ánh xạ FR v0.1 → v0.2 một lần; P03 đã chuyển sang mã v0.2 | Ghi "FR theo SRS v0.x" cạnh mỗi mã cho đến khi ánh xạ xong | 4,2 | Mở |
| R-M3-03 | 17/11 | Code bị sửa trước khi CP-02 đạt nên bị xung đột hoặc làm lại | 40% | +5h | — | — | RES-01 | — | — | 0 | **Đóng 22/11**: nhánh round3 đã merge (PR #4) và có CR-02; A-63 đã làm trên `main` sau khi merge |
| R-M3-04 | 17/11 | Nhóm dùng song song hai bảng checkpoint nên CP được đánh giá theo tiêu chí sai | 40% | +3h làm lại review | 3 × 1 = 3 | Thấp | RES-01 | Thông báo bảng CP V1.0 (báo cáo M2 mục 2.5) là bản chính thức | Nếu muốn dùng bảng khác thì lập CR | 1,2 | Mở |
| R-M3-05 | 17/11 | Workbook trong repo lệch với bản dùng chung trên Drive | 50% | +2h đối chiếu | 3 × 1 = 3 | Thấp | RES-03 | Bản trên Drive là bản chính; repo chỉ giữ ảnh chụp ở mốc milestone | Đối chiếu trước khi viết A-92 | 1 | Mở |
| R-G5-04 | 19/11 | Dồn deadline: hạn nộp dời lên 29/11, không còn float; trễ bất kỳ đâu là trễ ngày nộp | 70% | ≈ 11,5h chưa có nguồn bù; trễ 1-3 ngày trên đường găng A-90 → A-92 | 4 × 4 = **16** | **Nghiêm trọng** | RES-01 | Phương án C (cắt giảm, gộp báo cáo vào A-92); W14 thêm 2h mỗi người; xem lại ở M-03 24/11 | Kích hoạt thứ tự Q22 tại M-03 nếu một sản phẩm Must chưa được kiểm tra hoặc lịch trễ hơn 2 ngày: bỏ kiểm tra A-72, A-76 và ghi là khoảng trống | 8,1 | Mở |
| R-M3-06 | 22/11 | Ngưỡng nghiệm thu nhóm gửi kèm Q28 (khớp 100% số đếm tay trong kịch bản 100 lượt, 100% lượt đủ bản ghi, 5/5 ngoại lệ, tối đa 3 giây mỗi lượt) không được khách hàng trả lời, nên P21 và CP-08 dựa trên ngưỡng chưa được chấp nhận | 40% | Khách hàng dùng tiêu chí khác khi demo 27/11; +2-4h sửa kịch bản và kiểm tra lại | 3 × 2 = 6 | Trung bình | RES-01 (liên hệ), RES-02 (P21) | Đưa ngưỡng vào email gửi kịch bản nghiệm thu (A-85), đề nghị khách hàng xác nhận | Nếu không có trả lời trước 27/11: ghi trong P14 là "ngưỡng do nhóm đề xuất, khách hàng không phản đối" (Q28, Q11) | 1,2 | Mở |
| R-M3-07 | 22/11 | Hai yêu cầu vòng 3 chưa có code: Staff tra cứu xe và đặt chỗ (Q34, G-08) và xóa biển số tự động sau 12 tháng (Q35, G-05). Nếu không xong trước A-87 thì demo 27/11 không đáp ứng câu trả lời của khách hàng | 45% | 4,5h code và test; thiếu thì giảm chất lượng một yêu cầu Must (FR-45) | 3 × 4 = **12** | **Cao** | RES-03 | **Hoạt động ứng phó (đã chốt, P03 mục 11.1):** G-05 làm trong A-28 (1,5h), G-07 và G-08 làm trong A-65 (3,5h), 23-25/11, sau khi ghi kết quả CP-02; mỗi mục có test (phân quyền Staff, bộ hẹn giờ xóa). Không thêm mã hoạt động mới vì nằm trong A-28, A-65 đã có. **23/11: G-05 xong** (A-28, `bc172ce`) **và G-08 xong** (A-65, `49299ac`), có test, PR #11 chờ merge trước A-87 | Nếu hết giờ: giữ G-05 (Must, bảo vệ dữ liệu), chuyển G-08 thành tra cứu qua trang lượt gửi đã có và ghi khác biệt trong P14 | 2 | Mở |

Phơi nhiễm = xác suất × số giờ ảnh hưởng ước lượng.

## 4. Vấn đề đã xảy ra

| ISS-ID | Vấn đề | Từ rủi ro | Ngày phát hiện | Ảnh hưởng | Phụ trách | Hành động | Trạng thái |
|---|---|---|---|---|---|---|---|
| ISS-M3-01 | CP-02 và CP-03 chưa có biên bản review | — | 17/11 | A-23 (đường găng) dự kiến 13/11. A-28, A-44, A-63, A-65, A-70 lẽ ra phải chờ cổng này | RES-01, RES-02, RES-03 | **Cập nhật 22/11:** P18 v1.0 xong 19/11 (A-22). Review CP-02 hẹn 20/11 (RES-02, RES-03), **chưa ghi kết quả**. P03 v0.4 (22/11) sẵn sàng cho CP-03 (A-27). **Quyết định 23/11 (RES-03):** mục đích của CP-02 (quyết định KB-01 đến KB-19, đóng băng hợp đồng vào/ra) đã đạt trong P18 v1.0, nên A-28, A-65 làm song song với việc ghi biên bản, như A-44, A-63, A-74, A-79 đã làm. RES-03 ghi phần review CP-02 của mình; RES-02 bổ sung. Code vào `main` qua PR có review. **23/11:** RES-03 đã ghi phần review CP-02 (`docs/m3/cp-02-review-res03.md`, PR #12): đạt có điều kiện; còn chờ RES-02 và RES-01 duyệt. CP-03: P03 v0.4 chờ RES-02 | Mở (chờ RES-02, RES-01) |
| ISS-M3-02 | Câu trả lời vòng 3 khác giả định hoặc khác code MVP | R-G1-01 | 15/11 | Xem bảng chi tiết bên dưới | RES-01 (CR), RES-03 (Q34, Q35) | CR-02 đã ghi Change Log 19/11 cho Q28, Q31, Q32. Q34, Q35 đưa vào **CR-03** (mục 6, chờ RES-01 duyệt) và làm trong A-28, A-65 (R-M3-07). Ghi effort thực tế của nhánh round3 (≈ 4,25h RES-01) vào A-103 | Mở một phần |
| ISS-M3-03 | Thay đổi của giảng viên: hạn nộp dời từ 07/12 lên 29/11 (CR-01) | R-G4-02 | tuần 16/11 | Năng lực 190h → 140h; nhu cầu ≈ 164,1h sau cắt giảm; ≈ 11,5h chưa có nguồn bù; Baseline V2.0 bắt buộc (A-106) | RES-01 | Phương án C (`docs/m3/decision-record.md`); R-G5-04 mới; RES-03 sinh lại Baseline V2.0 trước 24/11 | Mở |

### 4.1 Chi tiết ISS-M3-02: câu trả lời vòng 3 so với code `main` (22/11)

| Câu | Câu trả lời của khách hàng | So với giả định nhóm | Code `main` | Trạng thái |
|---|---|---|---|---|
| Q27 | 5 ngoại lệ như nhóm đề xuất; không bắt buộc phí phạt | Đồng ý | Đã có (EX-01 đến EX-05) | Đóng |
| Q28 | Tỷ lệ sử dụng tính riêng theo loại xe hoặc khu vực; giờ cao điểm phải nêu khoảng thống kê; không đến chỉ tính đặt chỗ hết thời gian chờ; không trả lời phần ngưỡng | Khác | `utilisationBySlice` theo khu vực × loại xe; giờ cao điểm theo giờ đồng hồ (P03 v0.4 mục 4.1) | Đóng (CR-02); ngưỡng → R-M3-06 |
| Q29 | Đồng ý: nhiều xe, biển số duy nhất, gán xe vãng lai | Đồng ý | Đã có | Đóng |
| Q30 | Đồng ý: tự chọn nhóm, mức "Khách" | Đồng ý | Đã có | Đóng |
| Q31 | Tối đa 1 đặt chỗ mỗi tài khoản; xe đến sớm do Staff kiểm tra và tiếp nhận, không tự check-in; vào khu vực khác theo giả định | Khác | `RESERVATION_LIMIT`, `EARLY_ARRIVAL` + `confirmEarly` | Đóng (CR-02) |
| Q32 | Đồng ý: cho xe ra, từ chối đặt chỗ mới, hủy đặt chỗ đang chờ và thông báo | Đồng ý, nhưng khác code MVP | Hủy với `LOT_SUSPENDED` và tạo `notifications` | Đóng (CR-02) |
| Q33 | Đồng ý: Staff xác nhận thanh toán khi xe ra | Đồng ý | Đã có | Đóng |
| Q34 | Quản lý (Admin) như nhóm đề xuất; Staff còn tra cứu lượt, xác nhận thanh toán, xử lý ngoại lệ và được xem xe, lượt gửi, đặt chỗ, tình trạng bãi | Khác | Staff chưa đọc được xe và đặt chỗ (`/api/vehicles`, `/api/reservations` chỉ cho CUSTOMER) | **Code xong** (A-65, `49299ac`; trùng KB-21 trong P18 v1.1 của RES-04); chờ merge PR #11; CR-03 |
| Q35 | Tự động xóa hoặc ẩn biển số trên lượt đã kết thúc sau 12 tháng, giữ thống kê | Đồng ý, nhưng khác code MVP | Cách xóa đúng; vẫn chỉ chạy khi Manager bấm | **Code xong** (A-28, `bc172ce`); chờ merge PR #11; CR-03 |

## 5. Nhật ký rà soát hằng tuần

| Tuần | Ngày rà soát | Người rà soát | Thay đổi |
|---|---|---|---|
| W12 | — | — | Không có buổi rà soát. A-102 bắt đầu trễ, xem dòng W13 |
| W13 | 17/11/2026 | RES-03 (bản nháp) | Lập sổ M3 từ V1.0. R-G1-01 chuyển sang Đã xảy ra (ISS-M3-02). Đề xuất tăng R-G2-02 từ 6 lên 8. Thêm R-M3-01 đến R-M3-05; R-M3-01 ở mức Cao nên cần hoạt động ứng phó. Thêm ISS-M3-01 |
| W13 | 22/11/2026 | RES-03 (bản nháp) | Tính đến CR-01, CR-02, merge PR #4, P18 v1.0, A-63, A-67, A-79. R-G4-02 chuyển sang Đã xảy ra (ISS-M3-03). Thêm R-G5-04 (16, Nghiêm trọng) theo decision record. Chấm lại: R-G2-02 8 → 4, R-G4-01 6 → 4, R-G4-03 9 → 3 (đề xuất đóng), R-G5-02 9 → 12 (Cao). Đóng R-M3-03. Thêm R-M3-06 (ngưỡng nghiệm thu Q28) và R-M3-07 (Q34, Q35 chưa có code, Cao). ISS-M3-02 đối chiếu đủ Q27-Q35 |
| W13 | 22/11/2026 | RES-03 (chốt) | Chốt sổ: bỏ trạng thái bản nháp. Đóng R-G4-03. R-M3-01 chấm lại 12 → 6 sau khi chốt phạm vi trong P03 v0.4 mục 11.1 (hoạt động ứng phó đã làm). R-M3-07 chốt cách ứng phó trong A-28, A-65. Soạn CR-03 (mục 6) |
| W14 | 23/11/2026 | RES-03 (cập nhật giữa tuần) | G-05, G-07, G-08 có code và test (PR #11). R-M3-07 chuyển sang Đang theo dõi. ISS-M3-01: RES-03 đã ghi phần review CP-02. Lần rà soát W14 đầy đủ làm sau M-03 (24/11) và A-87 (26/11) |
| W14 | 23/11/2026 | RES-03 | Review CP-03 của RES-02 (5 comment trên P03 v0.4) tìm ra G-09 (thiếu cổng, FR-09) và cho thấy G-06 cần cho AT-03, AT-04. Cả hai đã làm (`6ef8862`, PR #11), P03 lên v0.5, CR-03 cập nhật (+3,5h). Vòng review thứ hai (4 comment) thêm G-04 (`68abc69`, +1,5h); CR-03 còn hoãn G-01 đến G-03 và FR-03. Điểm R-M3-01 giữ 6: phần rủi ro đã xảy ra đã được xử lý trong ngày |
| W14 | 24/11/2026 | RES-03 | Câu trả lời vòng 5 của khách hàng (Q36-Q46, 23/11). Q37 đảo việc hoãn G-01: đã làm (PR #17). Q38, Q45 làm mới (PR #17). Q44, Q46 cho thấy hai giả định của nhóm sai (mốc xóa theo giờ vào, Staff xem đầy đủ mọi lượt): đã sửa (PR #11). Q36, Q39, Q40 xác nhận việc hoãn G-02, G-03, FR-03, nên R-M3-01 giảm 6 → 3. CR-03 thành +16h. Review PR #11 và PR #10 của RES-01: đã sửa (PR #11) và sinh lại Baseline V2.0 với toàn bộ CR-03: lịch đã cân bằng ra ngày 23,63/15, R-G5-04 vẫn nghiêm trọng; `baseline-v2.0.md` tách mục tiêu và dự báo cho A-87, A-88 |

## 6. Change Log: CR-03 (soạn sẵn, chờ RES-01 duyệt)

Cùng định dạng cột với `docs/m3/decision-record.md` mục "Change Log rows". RES-01 điền ngày duyệt rồi dán vào sheet Change Log.

```text
CR-03 | 22/11/2026 (cập nhật 24/11) | RES-03 (từ câu trả lời vòng 3 Q34, Q35, vòng 5 Q36-Q46 và đối chiếu SRS v0.2) | (1) Làm: Staff tra cứu xe và đặt chỗ (Q34, G-08); xóa biển số tự động sau 12 tháng (Q35, G-05); chỉ mục G-07; **bổ sung 23/11 sau review CP-03 của RES-02:** ghi đăng nhập thất bại và từ chối quyền (G-06, FR-43, AT-03, AT-04) và cổng vào/ra trên lượt gửi (G-09, FR-09, AT-01); vòng review thứ hai: nguồn ghi nhận DEVICE/MANUAL (G-04, FR-10, AT-01 bước 5); **bổ sung 24/11 theo vòng 5 của khách hàng:** giờ hoạt động chỉ để thông báo (Q37, G-01, FR-22), Customer xin đổi nhóm và Manager cập nhật (Q38, FR-07, FR-08), Customer xem bảng giá nhóm mình (Q45, FR-26), mốc xóa tính từ giờ ra (Q44), Staff chỉ xem biển số đã che với lượt đã đóng (Q46, FR-42). (2) Hoãn: bảng giá theo bãi/theo giờ (G-02), mục giá trên giao dịch (G-03; AT-06 xác định mục giá qua loại xe, nhóm phí và số tiền), hết phiên sau 30 phút (FR-03); khách hàng xác nhận ở Q36 (chỉ tính theo lượt), Q39 (không bắt buộc hết phiên), Q40 (một bãi thí điểm). (3) Chấp nhận KB-16 không sửa. (4) Sửa tiêu chí PD-P03 số 8 và 10 | P03, P07, P11, P14, P21, A-28, A-65 | +16 (trong A-28, A-65: 5 h ban đầu; G-06 1,5 h, G-09 2 h, G-04 1,5 h sau review CP-03; G-01 1,5 h, Q38 2 h, Q45 1 h, Q44 0,5 h, Q46 1 h theo vòng 5); Baseline V2.0: A-28 7,75 h, A-65 14,33 h | 0 (đã làm 23-24/11, trước A-87) | 16 h = 800.000 VNĐ quy đổi | Thêm các hành vi khách hàng yêu cầu ở vòng 3 và vòng 5, 3 yêu cầu Must mà bộ AT kiểm tra; 3 yêu cầu SRS v0.2 hoãn có xác nhận của khách hàng, ghi trong P14 | R-M3-01 giảm 12 → 6 → 3; R-M3-07 có ứng phó | 1 làm hết (P03 mục 11: 21 h + FR-03 2,5 h), 2 chỉ làm theo khách hàng + việc nhỏ, 3 không làm gì | Phương án 2 | Đáp ứng mọi câu trả lời vòng 3 và vòng 5 trong giờ còn lại; theo Q22 ưu tiên chức năng cốt lõi | TODO(RES-01) | TODO(RES-01) | Có, đưa vào Baseline V2.0 (A-106)
```
