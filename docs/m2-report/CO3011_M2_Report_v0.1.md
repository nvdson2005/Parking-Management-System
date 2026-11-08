# CO3011 - QUẢN LÝ DỰ ÁN PHẦN MỀM

## Báo cáo Milestone 2: Lập kế hoạch theo sản phẩm và Project Baseline V1.0

### Hệ thống quản lý bãi đỗ xe thông minh (Smart Parking Management System)

| Thông tin | Chi tiết |
|---|---|
| Nhóm | 11 |
| Thành viên | Đào Xuân Sơn - 2312954; Nguyễn Phạm Mạnh Dũng - 2310559; Nguyễn Tuấn Thành - 2313132; Nguyễn Võ Đức Sơn - 2312974; Phạm Duy Quý - 2312900 |
| Khách hàng / nhà tài trợ | Thầy Nguyễn Minh Tâm (đại diện nhà trường) |
| Quản lý dự án | Nguyễn Võ Đức Sơn |
| Mốc lập kế hoạch (planning cut-off) | 09/11/2026 (hạn nộp Milestone 2) |
| Năm học | 2026-2027 |
| Trạng thái tài liệu | v1.0 - Project Baseline V1.0 (đóng băng 09/11/2026; chờ khách hàng duyệt) |

<!-- REVIEW-INDEX-START -->
## Danh mục cần review (xóa trước khi xuất bản DOCX)

| # | Mục | Nội dung cần review | Loại |
|---|---|---|---|
| 1 | 2.1.1 | `diagrams/01-pbs.drawio`: đủ P00-P24, nhánh PG-1 đến PG-4, sản phẩm hoãn tô xám | Sơ đồ |
| 2 | 2.3 | `diagrams/02-pfd.drawio`: mũi tên khớp bảng 2.3.1, không có chu trình | Sơ đồ |
| 3 | 2.4.2 | `diagrams/03-activity-network.drawio`: mạng lý tưởng, mũi tên khớp cột "Hoạt động trước" của 2.4.1 | Sơ đồ |
| 4 | 2.11.4 | `diagrams/04-gantt.drawio`: lịch đã cân bằng nguồn lực khớp bảng 2.11.1 | Sơ đồ |
| 5 | 2.11.5 | `diagrams/05-critical-path.drawio`: đường găng A-24 → A-26 → A-78 → A-63 → A-66 → A-68 → A-90 → A-92 | Sơ đồ |
| 6 | 2.8.1 | `diagrams/06-risk-matrix.drawio`: vị trí R-ID trên ma trận L × I | Sơ đồ |
| 7 | 2.10.1 | Nhóm xác nhận cam kết 8 giờ ở W9 và 12 giờ/tuần ở W10-W12 (quyết định làm thêm giờ, phương án A) | Quyết định |
| 8 | 2.0.2 | Phạm vi Baseline V1.0 chỉ gồm nhóm Must; P06, P10, P11, P12 hoãn theo Q22, cần khách hàng chấp thuận trong email duyệt Baseline | Quyết định |
| 9 | 1.5 → 2.10 | Chuyển vai trò QA từ Nguyễn Võ Đức Sơn sang Đào Xuân Sơn | Quyết định |
| 10 | 2.12.5 | Phê duyệt của khách hàng đang ở trạng thái chờ; cập nhật khi có email | Chờ khách hàng |
| 11 | 2.2 | Kiểm tra 5 PD sau khi làm sạch (bỏ giờ hoạt động, ENT-14, thống nhất 5 ngoại lệ) | Nội dung |
<!-- REVIEW-INDEX-END -->

## Kiểm soát tài liệu

| Phiên bản | Ngày | Người thực hiện | Mục thay đổi | Tóm tắt thay đổi |
|---|---|---|---|---|
| v0.1 | 31/10/2026 | Các chủ PD | 2.2, 2.6, 2.8 | Bản nháp PD-P02, P03, P04, P05, P21; ước lượng và rủi ro theo nhóm |
| v0.2 | 08/11/2026 | Nguyễn Võ Đức Sơn | Toàn bộ | Hợp nhất bản nháp; thống nhất ID; bổ sung 2.5, 2.10-2.14; lập lịch theo nguồn lực |
| 1.0 | 09/11/2026 | Nguyễn Võ Đức Sơn | Toàn bộ | Đóng băng Project Baseline V1.0; sửa mâu thuẫn với thiết kế (ngôn ngữ giao diện, SSE, bảng giá); gửi khách hàng duyệt |

### Vai trò thành viên ở Milestone 2

| Thành viên | MSSV | Vai trò dự án | Nhóm sản phẩm phụ trách | Mã nguồn lực |
|---|---|---|---|---|
| Nguyễn Võ Đức Sơn | 2312974 | Quản lý dự án (PM), Trưởng nhóm kỹ thuật | Kiến trúc và API (P18), nghiệp vụ gửi xe (P05, P08), báo cáo cuối kỳ | RES-01 |
| Đào Xuân Sơn | 2312954 | Phân tích nghiệp vụ (BA), Phụ trách chất lượng (QA) | Kế hoạch kiểm thử, bộ test nghiệm thu (P20, P21) | RES-02 |
| Nguyễn Phạm Mạnh Dũng | 2310559 | Kiến trúc và dữ liệu | Thiết kế CSDL (P03), xác thực và phân quyền (P07), hướng dẫn cài đặt (P13) | RES-03 |
| Phạm Duy Quý | 2312900 | Yêu cầu và giao diện | SRS (P02), thiết kế giao diện (P19), báo cáo nghiệm thu (P14) | RES-04 |
| Nguyễn Tuấn Thành | 2313132 | Mô phỏng và giám sát | Bộ mô phỏng (P04), dữ liệu mô phỏng (P22), hiển thị chỗ trống (P09) | RES-05 |

Thay đổi so với M1 mục 1.5: vai trò Phụ trách chất lượng chuyển từ Nguyễn Võ Đức Sơn sang Đào Xuân Sơn. Lý do: ở M1, một người giữ cả ba vai trò PM, Trưởng nhóm kỹ thuật và QA nên phải review gần như mọi checkpoint. Khi lập lịch theo nguồn lực (2.10), người này trở thành điểm nghẽn. Tách QA cũng bảo đảm người review khác người viết.

### Khai báo sử dụng AI tạo sinh

| Công cụ AI | Mục đích sử dụng | Mục bị ảnh hưởng | Cách kiểm chứng / điều chỉnh đầu ra |
|---|---|---|---|
| Claude | Rà soát mâu thuẫn giữa các bản nháp PD, ước lượng và rủi ro; đối chiếu với Client Interaction Log và báo cáo M1 | 2.2, 2.6, 2.8 | Nhóm quyết định từng điểm sửa; mọi số liệu nghiệp vụ lấy từ câu trả lời của khách hàng (Q01-Q26) |
| Claude | Viết script tính đường găng và cân bằng nguồn lực từ dữ liệu kế hoạch | 2.4, 2.10, 2.11 | PM kiểm tra kết quả với bảng hoạt động; các quyết định phân bổ và làm thêm giờ do nhóm chọn |
| Claude | Soạn thảo ban đầu một số mục mô tả | 2.0, 2.5, 2.12 | Thành viên phụ trách đọc lại, sửa theo thực tế dự án |

### Ký hiệu viết tắt

| Ký hiệu | Ý nghĩa |
|---|---|
| P / PG | Sản phẩm / nhóm sản phẩm trong PBS |
| PD | Mô tả sản phẩm (Product Description) |
| A | Hoạt động (activity) |
| CP | Checkpoint (cổng review / phê duyệt) |
| M | Mốc (milestone) |
| R | Rủi ro mức hoạt động; R-Gn là rủi ro của nhóm sản phẩm n |
| RES | Nguồn lực (thành viên) |
| T, AT, AT-EX | Test; kịch bản nghiệm thu chính; kịch bản nghiệm thu ngoại lệ |
| EX | Ngoại lệ trong ma trận ngoại lệ của SRS |
| O, Q, AS, CN | Mục tiêu, câu hỏi khách hàng, giả định, ràng buộc (kế thừa M1) |
| O / M / P / E / σ | Ước lượng lạc quan / khả dĩ nhất / bi quan / kỳ vọng (O + 4M + P) / 6 / độ lệch chuẩn (P − O) / 6 |
| ES / EF / LS / LF | Bắt đầu sớm / kết thúc sớm / bắt đầu muộn / kết thúc muộn |

# 2. Lập kế hoạch theo sản phẩm và Project Baseline V1.0

## 2.0 Đầu vào lập kế hoạch và giả định

### 2.0.1 Đầu vào từ Milestone 1

| Đầu vào | Vị trí | Quyết định chuyển sang M2 |
|---|---|---|
| Đề bài và Client Interaction Log (vòng 1-2) | Phụ lục A báo cáo M1; workbook | Q01-Q26 đã trả lời; ba chức năng cốt lõi (Q01); thứ tự lùi khi thiếu thời gian (Q22) |
| Mục tiêu và thước đo | M1 1.4.3 | O1-O5; giá trị nền ước tính và dữ liệu mô phỏng được chấp nhận (Q26) |
| Phạm vi và ngoài phạm vi | M1 1.4.1, 1.4.2 | Nhóm Must, Should, Could; loại trừ giờ hoạt động, phí theo giờ, vé tháng, theo dõi từng ô đỗ |
| Vòng đời và tiêu chuẩn | M1 1.7.1, 1.8.3 | Phát triển tăng dần; quy tắc đặt tên, ID Registry, Git, kiểm soát thay đổi |
| Thẩm quyền và giao tiếp | M1 1.5, 1.7.3 | Khách hàng duyệt Baseline và CR qua email, không có thời gian phản hồi cố định (Q19); demo qua email (Q23) |

### 2.0.2 Quyết định nghiệp vụ đã xác nhận dùng cho kế hoạch

Các bản nháp PD viết trước vòng 2 có một số điểm mâu thuẫn. Bảng sau là căn cứ duy nhất mà mọi mục trong báo cáo này dùng.

| Chủ đề | Quyết định | Nguồn |
|---|---|---|
| Thông tin bãi đỗ | Tên bãi, địa chỉ, khu vực, sức chứa theo loại xe, trạng thái hoạt động (đang hoạt động / tạm ngưng), bảng giá. Không quản lý giờ hoạt động | Q14; M1 1.4.2 |
| Cách tính chỗ trống | Theo lượt vào/ra của từng khu vực và loại xe; không theo dõi từng ô đỗ | Q17 (AS12) |
| Ngoại lệ phải xử lý | 5 ngoại lệ cốt lõi: EX-01 bãi/khu vực hết chỗ, EX-02 biển số không khớp khi xe ra, EX-03 mất mã QR/thẻ, EX-04 xe đã có lượt gửi đang mở, EX-05 bãi tạm ngưng hoạt động | Q21 (AS13); M1 O4 |
| Phí gửi xe | Theo lượt, đơn giá cấu hình theo loại xe và nhóm người dùng. Không có phí theo giờ, vé tháng | Q16; M1 1.4.1, 1.4.2 |
| Vai trò | Customer, Staff, Manager; chức năng quản trị chỉ Manager truy cập | Q07, Q25 (AS5) |
| Lưu giữ biển số | 12 tháng, sau đó xóa | Q18 (AS6) |
| Quy mô bãi thí điểm | 3 khu vực, khoảng 300 chỗ xe máy và 30 chỗ ô tô | Q24 (AS14) |
| Phê duyệt và demo | Qua email, không có thời gian phản hồi cố định; demo cuối mỗi increment gửi qua email | Q19, Q23 |
| Thứ tự lùi phạm vi | Báo cáo, sau đó thanh toán mô phỏng, sau đó đặt chỗ trước | Q22 |

**Phạm vi của Baseline V1.0.** Năng lực còn lại từ mốc lập kế hoạch đến hạn cuối chỉ đủ cho nhóm Must (phân tích ở 2.10). Vì vậy Baseline V1.0 gồm các hạng mục Must ở M1 1.4.1: nền tảng và RBAC, quản lý xe vào/ra, theo dõi trạng thái chỗ đỗ, quản lý thông tin bãi đỗ, bảo mật dữ liệu. Các mô-đun đặt chỗ (P06), thanh toán mô phỏng (P10), báo cáo (P11) và hướng dẫn sử dụng riêng (P12) được **hoãn** theo đúng thứ tự Q22. Chúng không bị xóa khỏi phạm vi dự án: chúng là ứng viên của Baseline V2.0 nếu năng lực dư sau increment 2. Quyết định này được gửi khách hàng cùng email xin duyệt Baseline (2.12.5).

### 2.0.3 Giả định và ràng buộc lập kế hoạch

Mã AS1-AS15 kế thừa M1 và các bản nháp PD. Các giả định mới đánh tiếp từ AS16.

| ID | Giả định / ràng buộc | Nguồn hoặc cách kiểm chứng | Ảnh hưởng tới kế hoạch |
|---|---|---|---|
| AS16 | Lịch dự án 14/09/2026 đến 07/12/2026; cả nhóm nghỉ tuần 12/10 (W5); Baseline V1.0 bắt đầu 09/11 (W9) | Lịch học phần trên LMS | Cửa sổ thực hiện còn W9-W12, 20 ngày làm việc |
| AS17 | Mỗi thành viên làm 8 giờ ở W9 và 12 giờ/tuần ở W10-W12, 5 ngày làm việc mỗi tuần | Nhóm cam kết tại buổi chốt baseline (2.10) | Năng lực 220 người-giờ; theo dõi bằng R-G4-02 |
| AS18 | Dùng công cụ và dịch vụ miễn phí (Git, Google Docs/Sheets, môi trường demo miễn phí) | CN5 | Chi phí tiền mặt bằng 0 |
| AS19 | Khách hàng trả lời câu hỏi vòng 3 và duyệt Baseline qua email trong khoảng 1 tuần; nếu chưa trả lời, nhóm tiếp tục theo giả định đã ghi | Q19, CN3 | Rủi ro R-G1-01, R-G5-03 |
| AS20 | Câu hỏi vòng 3 (chưa gửi) được giữ theo giả định của nhóm: một tài khoản đăng ký nhiều xe, biển số duy nhất (R3-Q1); bãi tạm ngưng vẫn cho xe ra (R3-Q4); mất mã QR/thẻ thì nhân viên tra theo biển số và xác nhận thủ công, không thu phí phạt (R3-Q5); quá 12 tháng thì xóa biển số trên lượt gửi, giữ số liệu (R3-Q6); giao diện song ngữ Việt/Anh có nút chuyển (R3-Q8) | Client Interaction Log vòng 3 (A-16) | Nếu khách hàng trả lời khác, xử lý bằng CR |

### 2.0.4 Lịch làm việc và đơn vị

| Hạng mục | Quy định |
|---|---|
| Bắt đầu / hạn | Baseline V1.0 bắt đầu 09/11/2026; công việc kế hoạch kết thúc trước 04/12/2026; nộp báo cáo cuối kỳ 07/12/2026 |
| Lịch làm việc | Thứ Hai đến thứ Sáu; W9 = 09/11-13/11, W10 = 16/11-20/11, W11 = 23/11-27/11, W12 = 30/11-04/12 |
| Đơn vị | Effort tính bằng người-giờ; thời gian tính bằng ngày làm việc; tiền tệ VNĐ |
| Đơn giá quy đổi | 50.000 VNĐ/người-giờ, giống M1 1.3.3; là đơn giá quy ước, không phải chi phí tiền mặt |
| Câu hỏi còn mở | Vòng 3: R3-Q1, R3-Q4, R3-Q5, R3-Q6, R3-Q8 (phụ trách: Nguyễn Võ Đức Sơn, A-16) |

## 2.1 Cấu trúc phân rã sản phẩm (PBS)

### 2.1.1 Cây sản phẩm

> 📐 **SƠ ĐỒ CẦN REVIEW:** `diagrams/01-pbs.drawio` (xuất ảnh: `diagrams/01-pbs.png`)
> Kiểm tra: đủ P00-P24, bốn nhánh PG-1 đến PG-4, sản phẩm hoãn tô xám, nhãn có mã P.

### 2.1.2 Danh mục sản phẩm

| P-ID | P-ID cha | Sản phẩm | Loại | Trạng thái | Nghiệm thu / sử dụng |
|---|---|---|---|---|---|
| P00 | — | Hệ thống quản lý bãi đỗ xe thông minh (dự án) | Bàn giao | Lập kế hoạch | Workflow cốt lõi chạy xuyên suốt, xử lý 5 ngoại lệ, đạt yêu cầu đã thống nhất (Q11) |
| P07 | PG-1 (Phần mềm bàn giao) | Mô-đun xác thực và phân quyền | Bàn giao | Lập kế hoạch (Inc 1) | Đăng ký, đăng nhập, RBAC 3 vai trò, che biển số, nhật ký truy cập (CN4) |
| P08 | PG-1 (Phần mềm bàn giao) | Mô-đun quản lý thông tin bãi | Bàn giao | Lập kế hoạch (Inc 1) | Manager quản lý tên bãi, địa chỉ, khu vực, sức chứa theo loại xe, trạng thái, bảng giá (Q14) |
| P05 | PG-1 (Phần mềm bàn giao) | Mô-đun quản lý xe ra/vào | Bàn giao | Lập kế hoạch (Inc 2) | Ghi nhận vào/ra, cập nhật chỗ trống, xử lý 5 ngoại lệ (PD-P05) |
| P09 | PG-1 (Phần mềm bàn giao) | Mô-đun hiển thị tình trạng chỗ đỗ | Bàn giao | Lập kế hoạch (Inc 2) | Số chỗ trống theo khu vực và loại xe khớp số đếm tay (O1) |
| P06 | PG-1 (Phần mềm bàn giao) | Mô-đun đặt chỗ | Bàn giao | Hoãn (Q22) | Hoãn theo Q22 (Should); ứng viên Baseline V2.0 |
| P10 | PG-1 (Phần mềm bàn giao) | Mô-đun thanh toán mô phỏng | Bàn giao | Hoãn (Q22) | Hoãn theo Q22 (Should); ứng viên Baseline V2.0 |
| P11 | PG-1 (Phần mềm bàn giao) | Mô-đun báo cáo | Bàn giao | Hoãn (Q22) | Hoãn theo Q22 (Could); ứng viên Baseline V2.0 |
| P13 | PG-2 (Tài liệu bàn giao) | Hướng dẫn cài đặt và chạy demo | Bàn giao | Lập kế hoạch | Người không phải tác giả chạy được demo chỉ bằng hướng dẫn |
| P14 | PG-2 (Tài liệu bàn giao) | Báo cáo kết quả kiểm thử nghiệm thu | Bàn giao | Lập kế hoạch | Kết quả 9 AT và kịch bản 100 lượt; số đo O4 |
| P12 | PG-2 (Tài liệu bàn giao) | Hướng dẫn sử dụng | Bàn giao | Hoãn (Q22) | Hoãn; thay bằng phần hướng dẫn thao tác trong P13 |
| P01 | PG-3 (Sản phẩm quản lý dự án) | Project Baseline V1.0 (báo cáo M2) | Bàn giao | Đã hoàn thành | Được nhóm thống nhất và gửi khách hàng duyệt qua email (Q19) |
| P15 | PG-3 (Sản phẩm quản lý dự án) | Client Interaction Log | Bàn giao | Lập kế hoạch | Mọi trao đổi ghi trong 24 giờ (M1 1.7.3) |
| P16 | PG-3 (Sản phẩm quản lý dự án) | Nhật ký dự án hằng tuần | Bàn giao | Lập kế hoạch | Mỗi tuần một dòng kế hoạch/thực tế (Task 3.2) |
| P17 | PG-3 (Sản phẩm quản lý dự án) | Báo cáo quản lý dự án cuối kỳ | Bàn giao | Lập kế hoạch | So sánh baseline với thực tế, bài học kinh nghiệm (Task 4) |
| P23 | PG-3 (Sản phẩm quản lý dự án) | Tài liệu định nghĩa dự án (báo cáo M1) | Bàn giao | Đã hoàn thành | Đã nộp M1 |
| P24 | PG-3 (Sản phẩm quản lý dự án) | Ma trận truy vết | Trung gian | Lập kế hoạch | Nằm trong P01 mục 2.13 và workbook; cập nhật mỗi checkpoint |
| P02 | PG-4 (Sản phẩm trung gian) | Đặc tả yêu cầu phần mềm (SRS) | Trung gian | Lập kế hoạch | 7 tiêu chí chất lượng PD-P02 |
| P18 | PG-4 (Sản phẩm trung gian) | Thiết kế kiến trúc và API | Trung gian | Lập kế hoạch | Qua review CP-02 |
| P03 | PG-4 (Sản phẩm trung gian) | Thiết kế CSDL | Trung gian | Lập kế hoạch | 11 tiêu chí chất lượng PD-P03 |
| P19 | PG-4 (Sản phẩm trung gian) | Thiết kế giao diện (wireframe) | Trung gian | Lập kế hoạch | Đủ màn hình cho luồng cốt lõi theo vai trò |
| P04 | PG-4 (Sản phẩm trung gian) | Bộ mô phỏng thiết bị | Trung gian | Lập kế hoạch | 10 tiêu chí chất lượng PD-P04 |
| P22 | PG-4 (Sản phẩm trung gian) | Dữ liệu mô phỏng bãi thí điểm | Trung gian | Lập kế hoạch | 3 khu vực, khoảng 300 chỗ xe máy và 30 chỗ ô tô (Q24) |
| P20 | PG-4 (Sản phẩm trung gian) | Kế hoạch kiểm thử | Trung gian | Lập kế hoạch | Mỗi yêu cầu Must có ít nhất 1 test (M1 1.7.1) |
| P21 | PG-4 (Sản phẩm trung gian) | Bộ test nghiệm thu | Trung gian | Lập kế hoạch | 9 tiêu chí PD-P21 |

### 2.1.3 Cơ sở phân loại

| Hạng mục | Giải thích |
|---|---|
| Sản phẩm bàn giao | Những gì khách hàng nhận và nghiệm thu (các mô-đun phần mềm, hướng dẫn cài đặt, báo cáo nghiệm thu) hoặc nộp theo yêu cầu học phần (Baseline, Client Interaction Log, nhật ký tuần, báo cáo cuối kỳ) |
| Sản phẩm trung gian | Tạo ra để làm sản phẩm khác và không bàn giao riêng: SRS, thiết kế kiến trúc và API, thiết kế CSDL, thiết kế giao diện, bộ mô phỏng thiết bị, dữ liệu mô phỏng, kế hoạch kiểm thử, bộ test nghiệm thu, ma trận truy vết. Bộ mô phỏng P04 là trung gian vì nó thay thế phần cứng, không phải chức năng nghiệp vụ; khách hàng xem demo qua video (Q23) nên không cần tự chạy |
| Kiểm tra đầy đủ | Mọi hạng mục Must ở M1 1.4.1 đều có sản phẩm: nền tảng và bảo mật (P07), xe vào/ra (P05), trạng thái chỗ đỗ (P09), thông tin bãi (P08). Ba hạng mục Should/Could có sản phẩm P06, P10, P11 ở trạng thái hoãn. P23 và P01 đã hoàn thành trước mốc lập kế hoạch |

## 2.2 Mô tả sản phẩm (PD)

Nhóm viết PD cho năm sản phẩm quan trọng nhất: SRS (P02) là đầu vào của hầu hết sản phẩm khác; thiết kế CSDL (P03) quyết định độ chính xác chỗ trống (O1); bộ mô phỏng (P04) thay thế phần cứng; mô-đun xe ra/vào (P05) là chức năng cốt lõi số một; bộ test nghiệm thu (P21) là căn cứ nghiệm thu (Q11).

### PD-P02. Đặc tả yêu cầu phần mềm (SRS)

| Trường | Nội dung |
|---|---|
| Định danh | P02 - Đặc tả yêu cầu phần mềm; sản phẩm trung gian; file CO3011_M2_SRS_v1.0 |
| Chủ sở hữu / người review | Phạm Duy Quý, đồng tác giả Đào Xuân Sơn (BA) / Nguyễn Tuấn Thành, Nguyễn Võ Đức Sơn |
| Mục tiêu liên quan | O1, O2, O4, O5 |
| Mô tả và mục đích | Liệt kê yêu cầu chức năng và phi chức năng của phạm vi Must. Mỗi yêu cầu có mã, mức ưu tiên MoSCoW, nguồn (Q hoặc AS), mục tiêu (O) và tiêu chí chấp nhận kiểm tra được. Chứa ma trận 5 ngoại lệ. Là căn cứ cho thiết kế, kiểm thử và nghiệm thu theo Q11 |
| Sinh ra từ | P15 Client Interaction Log (Q01-Q26, AS20); P23 báo cáo M1 (phạm vi 1.4.1, 1.4.2; mục tiêu 1.4.3; ràng buộc CN1-CN5) |
| Cung cấp cho | P18 (endpoint theo yêu cầu), P19 (màn hình theo vai trò), P03 (dữ liệu cần lưu), P04 (sự kiện và ngoại lệ cần mô phỏng), P05, P07, P08, P09 (yêu cầu chức năng), P20 và P21 (mỗi yêu cầu Must có ít nhất 1 test), P24 |
| Thành phần | 1. Giới thiệu, phạm vi, thuật ngữ; 2. Vai trò Customer, Staff, Manager; 3. Yêu cầu chức năng theo nhóm Nền tảng, Xe vào/ra, Trạng thái chỗ đỗ, Thông tin bãi (khoảng 23 FR); 4. Yêu cầu phi chức năng: bảo mật và quyền riêng tư, hiệu năng, khả dụng, web responsive, mở rộng đa bãi (khoảng 8 NFR); 5. Ma trận ngoại lệ EX-01 đến EX-05; 6. Ngoài phạm vi và hạng mục hoãn; 7. Giả định và câu hỏi mở; 8. Truy vết yêu cầu → O và nguồn |
| Định dạng / vị trí | Google Docs; bảng 6 cột ID, Mô tả, Ưu tiên, Nguồn, Mục tiêu, Tiêu chí chấp nhận; mã FR-xx, NFR-xx, EX-xx đăng ký trong ID Registry; mỗi yêu cầu một câu dạng "Hệ thống phải..." |
| Tiêu chuẩn áp dụng | ISO/IEC/IEEE 29148 (tham khảo cách viết yêu cầu); MoSCoW; quy tắc đặt tên và ID Registry (M1 1.7.1); sửa sau baseline phải có CR |
| Tiêu chí chất lượng | (1) 100% hạng mục Must ở M1 1.4.1 có ít nhất 1 FR; (2) mỗi yêu cầu có tiêu chí chấp nhận đo được, không dùng từ mơ hồ khi chưa có số; (3) mỗi yêu cầu có cột Nguồn và Mục tiêu không trống; (4) không có yêu cầu thuộc danh sách ngoài phạm vi hoặc hạng mục hoãn; (5) mỗi EX có ít nhất 1 FR xử lý; (6) không có hai yêu cầu mâu thuẫn, số liệu khớp 2.0.2; (7) ít nhất 2 thành viên không phải tác giả review |
| Kiểm chứng / trách nhiệm | Tác giả tự kiểm 7 tiêu chí; review tại CP-01 (A-09); biên bản review lưu cùng tài liệu |

### PD-P03. Thiết kế CSDL

| Trường | Nội dung |
|---|---|
| Định danh | P03 - Thiết kế CSDL; sản phẩm trung gian; tài liệu CO3011_M2_ThietKeCSDL_v1.0 và thư mục prisma/ trong repo |
| Chủ sở hữu / người review | Nguyễn Phạm Mạnh Dũng / Đào Xuân Sơn (QA) |
| Mục tiêu liên quan | O1, O2, O4 |
| Mô tả và mục đích | Thực thể, thuộc tính, khóa, ràng buộc toàn vẹn, chỉ mục và cách bảo vệ dữ liệu cá nhân. Bảo đảm số chỗ trống tính ra khớp số lượt thực tế (O1), mọi lượt vào/ra có bản ghi truy vết được (O2), đủ dữ liệu xử lý ngoại lệ (O4). Tách sức chứa theo loại xe (Q05); thêm bãi mới chỉ bằng dữ liệu (Q04); biển số đầy đủ chỉ lưu ở một bảng (CN4) |
| Sinh ra từ | Danh sách thực thể trong PD này và M1 (phạm vi, AS4-AS8, CN4); P02 khi có (A-24 bắt đầu từ danh sách thực thể, đối chiếu SRS tại CP-03); P18 (loại CSDL quan hệ) |
| Cung cấp cho | P05, P07, P08, P09 (bảng và truy vấn nền), P22 (cấu trúc dữ liệu mô phỏng), P13 (script cài đặt), P20, P21 (dữ liệu kiểm thử) |
| Thành phần | 1. ERD; 2. Danh sách thực thể ENT-01 users, ENT-02 roles, ENT-03 parking_lots, ENT-04 zones, ENT-05 vehicle_types, ENT-06 zone_capacities, ENT-07 vehicles, ENT-08 parking_sessions, ENT-09 session_events, ENT-11 tariffs (bảng giá theo loại xe × nhóm, thuộc thông tin bãi Q14), ENT-13 access_logs (ENT-10 reservations, ENT-12 payments hoãn cùng P06, P10; bảng vẫn có trong lược đồ để không phải đổi lược đồ ở Baseline V2.0); 3. Từ điển dữ liệu; 4. Quy tắc toàn vẹn: mỗi xe chỉ có một lượt đang mở; chỗ trống = sức chứa − số lượt đang mở theo khu vực và loại xe, tính từ dữ liệu, không lưu cột riêng; 5. Hỗ trợ nhiều bãi; 6. Bảo vệ dữ liệu: mật khẩu băm có salt, nhật ký truy cập, tham số thời hạn lưu biển số 12 tháng và script xóa, cờ dữ liệu mô phỏng; 7. Chỉ mục cho tìm lượt đang mở và đếm lượt đang mở; 8. Script lược đồ và dữ liệu cấu hình mẫu; 9. Truy vết FR → thực thể |
| Định dạng / vị trí | Google Docs, ERD nhúng hình; lược đồ prisma/schema.prisma, migration trong prisma/migrations (đánh số theo thời gian), dữ liệu mẫu prisma/seed.ts, README; bảng và cột tiếng Anh snake_case |
| Tiêu chuẩn áp dụng | Dạng chuẩn 3 (chỉ phi chuẩn hóa khi có lý do ghi rõ); ID Registry (ENT-xx); Git và pull request có review; sau baseline đổi lược đồ bằng migration mới; Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 |
| Tiêu chí chất lượng | T-DB1 mỗi FR lưu dữ liệu có thực thể; T-DB2 khóa chính, khóa ngoại, 3NF; T-DB3 script chạy trên CSDL trống tạo đủ bảng; T-DB4 dữ liệu vi phạm ràng buộc bị từ chối 100%; T-DB5 không tạo được lượt mở thứ hai cho cùng xe; T-DB6 truy vấn chỗ trống khớp số đếm tay và dùng chỉ mục; T-DB7 thêm bãi thứ hai không sửa lược đồ; T-DB8 không có mật khẩu rõ, biển số đầy đủ chỉ ở vehicles, access_logs không cho trống; T-DB9 script lưu giữ xóa đúng bản ghi quá hạn; T-DB10 tên và kiểu khớp P02, P05; ít nhất 2 thành viên review |
| Kiểm chứng / trách nhiệm | Kiểm thử T-DB trong A-26; review tại CP-03 (A-27); kết quả ghi tab Quality Evidence |

### PD-P04. Bộ mô phỏng thiết bị

| Trường | Nội dung |
|---|---|
| Định danh | P04 - Bộ mô phỏng thiết bị; sản phẩm trung gian; thư mục simulator/ trong repo kèm README |
| Chủ sở hữu / người review | Nguyễn Tuấn Thành / Đào Xuân Sơn (QA) |
| Mục tiêu liên quan | O1, O2, O4 |
| Mô tả và mục đích | Thay thế camera biển số, đầu đọc QR/RFID và barie mà khách hàng xác nhận không cần tích hợp (Q06). Sinh sự kiện xe vào/ra giả theo kịch bản và cấu hình, gửi vào hệ thống qua đúng giao diện thiết bị thật sẽ dùng. Không chứa logic nghiệp vụ. Bộ dữ liệu cụ thể cho bãi thí điểm là sản phẩm riêng P22 |
| Sinh ra từ | P15 (Q06, Q17, Q24); P18 (hợp đồng sự kiện vào/ra, A-21); danh sách 5 ngoại lệ (2.0.2) |
| Cung cấp cho | P05 (nguồn sự kiện để tích hợp và kiểm thử), P09 (biến động chỗ trống), P22 (công cụ sinh dữ liệu), P21 (kịch bản 100 lượt và kích hoạt ngoại lệ), P13 |
| Thành phần | 1. Cấu hình (số bãi, khu vực, sức chứa theo loại xe, phương thức nhận diện, tốc độ, seed); 2. Bộ sinh dữ liệu giả (biển số, mã QR/RFID, cờ mô phỏng); 3. Bộ sinh sự kiện vào/ra có seed; 4. Bộ gửi sự kiện theo hợp đồng P18, không truy cập CSDL; 5. Nhật ký chạy; 6. 7 kịch bản SC-01 đến SC-07 (1 luồng thường, 5 ngoại lệ, 1 tải ≥ 100 lượt); 7. Điều khiển dòng lệnh và README |
| Định dạng / vị trí | Mã nguồn tách khỏi mô-đun lõi; cấu hình và kịch bản dạng file văn bản, không hard-code; nhật ký mỗi sự kiện một dòng; mã SC-xx trong ID Registry |
| Tiêu chuẩn áp dụng | Quy chuẩn mã nguồn và quy tắc nhánh (M1 1.7.1); chỉ dùng biển số và thẻ giả (CN4); sửa sau baseline phải có CR |
| Tiêu chí chất lượng | (1) Sinh sự kiện vào/ra cho xe máy và ô tô theo từng phương thức; (2) một lần chạy ≥ 100 lượt hoàn tất; (3) cùng seed và cấu hình thì cùng chuỗi sự kiện; (4) mỗi EX-01 đến EX-05 có ít nhất 1 kịch bản; (5) đổi cấu hình không sửa mã; (6) chỉ gọi giao diện P18; (7) dữ liệu gắn cờ mô phỏng; (8) nhật ký đủ để đối chiếu số đếm tay (O1); (9) người không phải tác giả chạy được bằng README; (10) ít nhất 2 thành viên review |
| Kiểm chứng / trách nhiệm | Tiêu chí 1-8 kiểm trong A-45; tiêu chí 9 khi viết P13 (A-33); review tại CP-04 |

### PD-P05. Mô-đun quản lý xe ra/vào

| Trường | Nội dung |
|---|---|
| Định danh | P05 - Mô-đun quản lý xe ra/vào; sản phẩm bàn giao; mã nguồn trên nhánh main; increment 2 |
| Chủ sở hữu / người review | Nguyễn Võ Đức Sơn; phát triển cùng Nguyễn Phạm Mạnh Dũng và Phạm Duy Quý / Đào Xuân Sơn (QA) |
| Mục tiêu liên quan | O1, O2, O4 |
| Mô tả và mục đích | Cho nhân viên bãi ghi nhận lượt xe vào và ra, đối chiếu lượt ra với lượt vào, cập nhật số chỗ trống theo khu vực và loại xe ngay sau mỗi lượt. Mỗi lượt được lưu làm dữ liệu cho truy vết và (sau này) tính phí. Là chức năng ưu tiên số một ở Q01. Ngoài phạm vi: tính phí (P10, hoãn), phần cứng thật (thay bằng P04), đặt chỗ (P06, hoãn) |
| Sinh ra từ | P02 (yêu cầu xe vào/ra, ma trận ngoại lệ), P03 (bảng lượt gửi, khu vực, sức chứa, xe), P04 và P22 (sự kiện, dữ liệu), P07 (vai trò Staff, Manager), P08 (khu vực, sức chứa, trạng thái bãi), P18 (hợp đồng API), P19 (màn hình) |
| Cung cấp cho | P09 (số chỗ trống sau mỗi lượt), P14 (kết quả nghiệm thu), P10 (lượt đã đóng, khi được khôi phục ở Baseline V2.0) |
| Thành phần | 1. Màn hình ghi nhận xe vào (nhập hoặc quét biển số/QR, chọn loại xe và khu vực); 2. Màn hình ghi nhận xe ra; 3. API sự kiện vào/ra cho màn hình và P04; 4. Logic cập nhật chỗ trống có giao dịch và khóa theo khu vực; 5. Xử lý EX-01 đến EX-05; 6. Bản ghi lượt gửi (thời điểm vào/ra, biển số, loại xe, khu vực, nhân viên); 7. Unit test và integration test |
| Định dạng / vị trí | Mã nguồn trên main, giao diện web responsive; tài liệu API ngắn trong README; test tự động chạy cùng mã nguồn |
| Tiêu chuẩn áp dụng | Pull request có review (M1 1.7.1); Definition of Done; RBAC chỉ Staff và Manager (CN4); biển số đầy đủ chỉ hiển thị cho Staff và Manager (Luật 91/2025/QH15); sửa sau baseline có CR |
| Tiêu chí chất lượng | T05 sau mọi lượt, chỗ trống = sức chứa − lượt đang mở, kể cả lượt gần như đồng thời (O1); T06 từ chối xe vào khi hết chỗ (EX-01); T07 biển số không khớp thì cảnh báo và yêu cầu xác nhận thủ công (EX-02); T08 mất QR/thẻ thì tra theo biển số và xác nhận thủ công (EX-03); T09 không mở lượt thứ hai cho cùng biển số (EX-04); T10 từ chối xe vào khi bãi tạm ngưng, vẫn cho xe ra (EX-05); T11 mỗi lượt lưu đủ trường (O2); T12 chỉ Staff và Manager thao tác được; T13 ghi nhận xe vào trong tối đa 3 thao tác và ≤ 2 giây với dữ liệu thí điểm |
| Kiểm chứng / trách nhiệm | Kiểm thử A-68 trên bộ mô phỏng (kịch bản 100 lượt); kết quả tại CP-05 (kết thúc increment 2); demo video gửi khách hàng |

### PD-P21. Bộ test nghiệm thu

| Trường | Nội dung |
|---|---|
| Định danh | P21 - Bộ test nghiệm thu; sản phẩm trung gian, chạy khi nghiệm thu, kết quả nộp trong P14; file CO3011_M2_AcceptanceTests_v1.0 |
| Chủ sở hữu / người review | Đào Xuân Sơn / Phạm Duy Quý; khách hàng xác nhận danh sách |
| Mục tiêu liên quan | O1, O2, O4, O5 |
| Mô tả và mục đích | Kịch bản nghiệm thu mức hệ thống viết bằng ngôn ngữ nghiệp vụ. Mỗi kịch bản có tiền điều kiện, bước, dữ liệu và kết quả mong đợi cụ thể, chạy trên môi trường demo với dữ liệu từ bộ mô phỏng. Chứng minh ba điều khách hàng nêu ở Q11: workflow cốt lõi chạy xuyên suốt, ngoại lệ được xử lý, hệ thống đáp ứng yêu cầu đã thống nhất. Số ngoại lệ đạt / 5 là số đo O4 |
| Sinh ra từ | P02 (FR/NFR, tiêu chí chấp nhận, ma trận ngoại lệ); P20 (môi trường, dữ liệu, tiêu chí bắt đầu và kết thúc); P04 (kịch bản 100 lượt); P15 (Q11, Q21, Q24) |
| Cung cấp cho | P14 (kết quả và biên bản nghiệm thu), P24 (truy vết AT ↔ FR), P17 (bằng chứng nghiệm thu) |
| Thành phần | 1. Giới thiệu và quy ước ID; 2. Điều kiện tiên quyết (môi trường demo, dữ liệu theo Q24, tài khoản 3 vai trò, script đưa bãi về trạng thái ban đầu); 3. Kịch bản chính AT-01 xe máy vào/ra và chỗ trống, AT-02 ô tô vào/ra, AT-03 Manager quản lý thông tin bãi (Q14), AT-04 RBAC, che biển số và lưu giữ 12 tháng (Q18, Q25); 4. Kịch bản ngoại lệ AT-EX01 đến AT-EX05 ứng với EX-01 đến EX-05; 5. Kịch bản khối lượng AT-100 (≥ 100 lượt từ P04, mọi lượt có bản ghi hợp lệ); 6. Cấu trúc mỗi test; 7. Mẫu biên bản nghiệm thu; 8. Truy vết |
| Định dạng / vị trí | Google Docs dạng bảng; bản chạy có cột kết quả; kết quả ghi tab Quality Evidence; mã AT-xx, AT-EXxx trong ID Registry |
| Tiêu chuẩn áp dụng | Quy định kiểm thử M1 1.7.1; ISO/IEC/IEEE 29119-3 (tham khảo cấu trúc test case); chỉ dùng dữ liệu mô phỏng; sửa sau baseline có CR |
| Tiêu chí chất lượng | (1) 100% yêu cầu Must có ít nhất 1 AT; (2) 100% EX-01 đến EX-05 có AT-EX; (3) mỗi AT có tiền điều kiện, bước, dữ liệu, kết quả mong đợi bằng giá trị cụ thể; (4) mỗi mục tiêu O1, O2, O4, O5 có ít nhất 1 AT có ngưỡng bằng số; (5) chạy trọn bộ không sửa CSDL bằng tay, có log; (6) có AT-100; (7) khách hàng xác nhận danh sách qua email trước nghiệm thu; (8) không có AT cho hạng mục ngoài phạm vi hoặc hoãn; (9) ít nhất 2 thành viên review |
| Kiểm chứng / trách nhiệm | Review và gửi khách hàng tại CP-06 (A-85); chạy thử sớm A-95; dry run tại CP-07 (A-87); nghiệm thu tại CP-08 (A-88) |

### 2.2.1 Phạm vi và trách nhiệm PD

| PD | P-ID | Chủ sở hữu | Người review | Checkpoint |
|---|---|---|---|---|
| PD-P02 | P02 | Phạm Duy Quý | Nguyễn Tuấn Thành, Nguyễn Võ Đức Sơn | CP-01 |
| PD-P03 | P03 | Nguyễn Phạm Mạnh Dũng | Đào Xuân Sơn | CP-03 |
| PD-P04 | P04 | Nguyễn Tuấn Thành | Đào Xuân Sơn | CP-04 |
| PD-P05 | P05 | Nguyễn Võ Đức Sơn | Đào Xuân Sơn | CP-05 |
| PD-P21 | P21 | Đào Xuân Sơn | Phạm Duy Quý; khách hàng | CP-06 |

## 2.3 Sơ đồ luồng sản phẩm (PFD)

> 📐 **SƠ ĐỒ CẦN REVIEW:** `diagrams/02-pfd.drawio` (xuất ảnh: `diagrams/02-pfd.png`)
> Kiểm tra: mũi tên đi từ sản phẩm đầu vào tới sản phẩm phụ thuộc, khớp bảng 2.3.1; sản phẩm hoãn không nằm trên luồng chính.

### 2.3.1 Phụ thuộc và thể hiện sản phẩm

| Sản phẩm đầu ra / thể hiện | Đầu vào bắt buộc | Lý do phụ thuộc |
|---|---|---|
| P02 SRS v1.0 | P15, P23 | Yêu cầu rút từ câu trả lời của khách hàng và phạm vi M1 |
| P18 Thiết kế kiến trúc và API | P02 (đối chiếu tại CP-02) | Endpoint bám theo yêu cầu |
| P03 Thiết kế CSDL | P18 (loại CSDL), P02 | Lược đồ phụ thuộc loại CSDL và yêu cầu dữ liệu |
| P19 Thiết kế giao diện | P02 | Màn hình theo vai trò và luồng nghiệp vụ |
| P04 Bộ mô phỏng | P18 (hợp đồng sự kiện vào/ra) | Bộ gửi sự kiện phải đúng hợp đồng |
| P22 Dữ liệu mô phỏng bãi thí điểm | P03, P04 | Dữ liệu sinh bằng P04 theo cấu trúc P03 |
| P07, P08 (increment 1) | P18, P03, P19 | Mô-đun dựng trên API, lược đồ và giao diện đã thiết kế |
| P05, P09 (increment 2) | P18, P03, P19, P07, P08, P04, P22 | Xe ra/vào cần vai trò, khu vực, sức chứa và nguồn sự kiện; P09 hiển thị kết quả của P05 |
| P20 Kế hoạch kiểm thử | P02 | Phạm vi kiểm thử theo yêu cầu |
| P21 Bộ test nghiệm thu | P02, P20, P04 | Kịch bản theo yêu cầu, kế hoạch và dữ liệu mô phỏng |
| P13 Hướng dẫn cài đặt | P03, P04 | Hướng dẫn chạy script CSDL và bộ mô phỏng |
| P14 Báo cáo nghiệm thu (thể hiện: lần chạy dry run, lần trình diễn) | P21, P05, P07, P08, P09, P13 | Ghi kết quả chạy bộ test trên các mô-đun |
| P16 Nhật ký tuần (4 thể hiện W9-W12) | P01 | So sánh kế hoạch với thực tế mỗi tuần |
| P17 Báo cáo cuối kỳ | P14, P16, P24 | So sánh baseline với thực tế, truy vết |

### 2.3.2 Kiểm tra luồng sản phẩm

- [x] Mọi sản phẩm đang lập kế hoạch trong PBS có trong PFD, kể cả sản phẩm trung gian.
- [x] Mũi tên thể hiện điều kiện tiên quyết thật; các thể hiện lặp (P14, P16) được ghi rõ.
- [x] Không có chu trình (kiểm tra tự động trong script lập lịch).

## 2.4 Hoạt động và mạng hoạt động lý tưởng

### 2.4.1 Danh mục hoạt động

Hoạt động được suy ra từ sản phẩm, đặt tên dạng động từ + danh từ. Mã đánh theo dải của nhóm sản phẩm: A-01..19 yêu cầu và giao diện, A-20..39 kiến trúc, dữ liệu, xác thực, A-40..59 mô phỏng và hiển thị, A-60..79 nghiệp vụ gửi xe, A-80..99 kiểm thử, đóng dự án và quản lý. Danh mục dưới đây là bộ hoạt động đã kiểm soát (sau 2.7 và 2.9); bộ hoạt động lý tưởng ban đầu và cách chuyển đổi ở 2.7.

| A-ID | Hoạt động | Sản phẩm | Hoạt động trước | Phụ trách | CP |
|---|---|---|---|---|---|
| A-01 | Viết SRS v1.0 phạm vi Must | P02 | — | RES-04, RES-02 |  |
| A-09 | Review SRS | P02 | A-01 | RES-04, RES-05, RES-01 | CP-01 |
| A-13 | Thiết kế giao diện luồng cốt lõi | P19 | A-01 | RES-04 |  |
| A-16 | Gửi câu hỏi vòng 3 và cập nhật Client Interaction Log | P15 | — | RES-01 |  |
| A-30 | Xây dựng che biển số, nhật ký truy cập và màn hình tài khoản | P07 | A-28 | RES-02 |  |
| A-66 | Xây dựng màn hình ghi nhận xe vào/ra | P05 | A-63, A-13 | RES-04 |  |
| A-89 | Viết báo cáo kết quả nghiệm thu | P14 | A-88 | RES-04, RES-03 |  |
| A-20 | Chọn công nghệ và thiết kế kiến trúc tổng thể | P18 | — | RES-01 |  |
| A-21 | Thiết kế quy ước API và hợp đồng sự kiện vào/ra | P18 | A-20 | RES-01, RES-05 |  |
| A-22 | Đặc tả API mô-đun cốt lõi | P18 | A-21 | RES-01, RES-03 |  |
| A-23 | Review kiến trúc và API | P18 | A-22, A-09 | RES-02, RES-03 | CP-02 |
| A-24 | Thiết kế ERD và từ điển dữ liệu | P03 | — | RES-03 |  |
| A-26 | Viết và kiểm thử script lược đồ, dữ liệu mẫu, script lưu giữ | P03 | A-24 | RES-03 |  |
| A-27 | Review thiết kế CSDL | P03 | A-26 | RES-02, RES-03 | CP-03 |
| A-28 | Xây dựng đăng ký, đăng nhập, phiên và RBAC | P07 | A-21, A-26 | RES-03 |  |
| A-90 | Tổng hợp số liệu thực tế và so sánh với baseline | P17 | A-68 | RES-01 |  |
| A-40 | Xây dựng cấu hình, bộ sinh dữ liệu giả và bộ sinh sự kiện | P04 | — | RES-05 |  |
| A-42 | Xây dựng bộ gửi sự kiện và nhật ký chạy | P04 | A-40, A-21 | RES-05 |  |
| A-43 | Xây dựng kịch bản mô phỏng và README | P04 | A-42 | RES-05 |  |
| A-45 | Kiểm thử và review bộ mô phỏng | P04 | A-43 | RES-05, RES-02 | CP-04 |
| A-47 | Tạo dữ liệu mô phỏng bãi thí điểm | P22 | A-26, A-42 | RES-05 |  |
| A-48 | Xây dựng mô-đun hiển thị tình trạng chỗ đỗ | P09 | A-21, A-26, A-13 | RES-05 |  |
| A-79 | Xây dựng bộ kiểm thử hợp đồng API vào/ra | P05 | A-21 | RES-05 |  |
| A-33 | Viết hướng dẫn cài đặt và chạy demo | P13 | A-45 | RES-03 |  |
| A-61 | Kiểm thử mô-đun quản lý thông tin bãi | P08 | A-60, A-28 | RES-01 |  |
| A-68 | Kiểm thử mô-đun xe ra/vào | P05 | A-66, A-67, A-30, A-45 | RES-05, RES-02 | CP-05 |
| A-60 | Xây dựng mô-đun quản lý thông tin bãi | P08 | A-21, A-26, A-13 | RES-04, RES-01 |  |
| A-78 | Thử nghiệm xử lý đồng thời cập nhật chỗ trống | P05 | A-26 | RES-01 |  |
| A-63 | Xây dựng API sự kiện vào/ra và cập nhật chỗ trống | P05 | A-21, A-26, A-78 | RES-03, RES-04 |  |
| A-65 | Xây dựng xử lý 5 ngoại lệ xe vào/ra | P05 | A-63 | RES-03, RES-01 |  |
| A-67 | Tích hợp mô-đun xe ra/vào với bộ mô phỏng | P05 | A-65, A-42, A-47, A-79, A-23 | RES-01, RES-05 |  |
| A-49 | Kiểm thử mô-đun hiển thị chỗ trống | P09 | A-48, A-67 | RES-04 |  |
| A-31 | Kiểm thử mô-đun xác thực và phân quyền | P07 | A-30 | RES-05 |  |
| A-80 | Viết kế hoạch kiểm thử | P20 | A-01 | RES-02 |  |
| A-82 | Viết kịch bản nghiệm thu chính AT-01 đến AT-04 | P21 | A-80, A-09 | RES-02 |  |
| A-83 | Viết kịch bản nghiệm thu ngoại lệ và kịch bản 100 lượt | P21 | A-80, A-09 | RES-02 |  |
| A-85 | Review bộ test nghiệm thu và gửi khách hàng xác nhận | P21 | A-82, A-83 | RES-02, RES-04 | CP-06 |
| A-95 | Chạy thử sớm AT-01, AT-02 và kịch bản 100 lượt | P21 | A-85, A-67 | RES-02 |  |
| A-87 | Chạy thử nghiệm thu nội bộ | P21 | A-95, A-68, A-49, A-31, A-61 | RES-02, RES-04 | CP-07 |
| A-88 | Trình diễn nghiệm thu với khách hàng | P14 | A-87, A-33 | RES-01, RES-05 | CP-08 |
| A-92 | Viết và rà soát báo cáo quản lý dự án cuối kỳ | P17 | A-90, A-87 | RES-03, RES-02 |  |
| A-94 | Ghi nhật ký dự án hằng tuần | P16 | — | RES-01 |  |
| A-97 | Họp tiến độ hằng tuần | P16 | — | RES-01, RES-02, RES-03, RES-04, RES-05 |  |
| A-91 | Họp tổng kết và ghi bài học kinh nghiệm | P17 | — | RES-01, RES-02, RES-03, RES-04, RES-05 |  |
| A-99 | Phân tích tác động sự kiện thay đổi và cập nhật baseline | P01 | — | RES-01 |  |

### 2.4.2 Mạng hoạt động lý tưởng

> 📐 **SƠ ĐỒ CẦN REVIEW:** `diagrams/03-activity-network.drawio` (xuất ảnh: `diagrams/03-activity-network.png`)
> Kiểm tra: hộp = A-ID và tên; mũi tên = hoạt động trước ở 2.4.1; checkpoint đánh dấu; chưa có độ trễ do nguồn lực.

### 2.4.3 Giả định của mạng

| Hạng mục | Quy định |
|---|---|
| Kiểu phụ thuộc | Finish-to-start. Ngoại lệ có chủ đích: lập trình mô-đun (A-28, A-48, A-60, A-63) bắt đầu khi có quy ước API và hợp đồng vào/ra (A-21) và script CSDL (A-26), không chờ review CP-02 (A-23). CP-02 chạy song song và phải đạt trước khi tích hợp (A-67). Đây là fast-tracking, chấp nhận rủi ro R-G2-02 và giảm bằng bộ kiểm thử hợp đồng A-79 |
| Việc song song | Thiết kế CSDL (A-24) bắt đầu ngay từ danh sách thực thể trong PD-P03, song song với kiến trúc (A-20) và SRS (A-01). Bộ sinh dữ liệu và sự kiện của bộ mô phỏng (A-40) không cần hợp đồng nên làm ngay W9 |
| Đầu vào bên ngoài | Phản hồi vòng 3 (A-16), xác nhận danh sách kịch bản (A-85) và nghiệm thu (A-88) phụ thuộc khách hàng; nhóm tiếp tục theo giả định nếu chưa có phản hồi (AS19) |
| Hoạt động định kỳ | A-16, A-94, A-97, A-91, A-99 đặt theo tuần, không nằm trên mạng logic |

## 2.5 Checkpoint và cổng review

| CP-ID | Kích hoạt / sản phẩm | Tiêu chí đạt và minh chứng | Người review / phê duyệt | Nếu không đạt |
|---|---|---|---|---|
| CP-01 | Hoàn thành A-01 (SRS v1.0) (A-09) | 7 tiêu chí PD-P02 đạt; 100% hạng mục Must ở M1 1.4.1 có FR; biên bản review | RES-01 (Tech lead) duyệt; RES-02 (QA) xác nhận | Trả về A-01, sửa trong 2 ngày dùng dự phòng làm lại; A-22, A-80 chờ |
| CP-02 | Hoàn thành A-22 (đặc tả API) (A-23) | Hợp đồng sự kiện vào/ra đóng băng; mỗi FR Must có endpoint; bộ kiểm thử hợp đồng A-79 chạy được | RES-02 (QA) review; RES-01 (Tech lead) duyệt | Không mở A-28, A-60, A-63, A-48; sửa và review lại trong 1 ngày |
| CP-03 | Hoàn thành A-26 (script CSDL) (A-27) | T-DB1 đến T-DB10 của PD-P03 đạt; script chạy trên CSDL trống | RES-01 (Tech lead) | Mô-đun nghiệp vụ chờ; sửa bằng migration mới |
| CP-04 | Kết thúc increment 1 (P07, P08, P04) (A-45) | Demo đăng nhập theo vai trò, Manager quản lý bãi, bộ mô phỏng chạy 100 lượt tới stub | RES-02 (QA) nội bộ; video demo gửi khách hàng (Q23) | Phần chưa đạt chuyển sang đầu increment 2; báo PM theo mức leo thang 1 |
| CP-05 | Kết thúc increment 2 (P05, P09) (A-68) | T05-T13 đạt; 100 lượt mô phỏng có bản ghi hợp lệ (O2); chỗ trống khớp số đếm tay (O1) | RES-02 (QA); video demo gửi khách hàng (Q23) | Dùng dự phòng làm lại; nếu vượt, CR theo M1 1.7.1 |
| CP-06 | Hoàn thành A-82, A-83 (bộ test nghiệm thu) (A-85) | 9 tiêu chí PD-P21; khách hàng xác nhận danh sách qua email | RES-04 review; khách hàng xác nhận | Chạy với danh sách đề xuất, ghi giả định tạm vào Client Interaction Log |
| CP-07 | Hoàn thành dry run A-87 (A-87) | 100% AT Must đạt hoặc có lỗi mở được PM chấp nhận | RES-02 (QA); RES-01 (PM) quyết định demo | Sửa lỗi và chạy lại AT không đạt; lùi demo tối đa 2 ngày |
| CP-08 | Trình diễn nghiệm thu A-88 (A-88) | Khách hàng xác nhận kết quả theo Q11 | Khách hàng (thầy Nguyễn Minh Tâm) | Ghi lỗi còn mở vào P14; xử lý theo CR |

### 2.5.1 Quy tắc ra quyết định

| Hạng mục | Quy định |
|---|---|
| Thẩm quyền | Checkpoint nội bộ: QA (Đào Xuân Sơn) xác nhận đạt/không đạt; Trưởng nhóm kỹ thuật duyệt checkpoint kỹ thuật. Checkpoint có khách hàng (CP-06, CP-08 và video demo CP-04, CP-05) theo M1 1.5 |
| Lưu minh chứng | Biên bản review trong thư mục tài liệu milestone; kết quả test ở tab Quality Evidence; email khách hàng trong Client Interaction Log |
| Làm lại và kiểm lại | Checkpoint không đạt trả sản phẩm về hoạt động sở hữu. Sửa xong, người review kiểm lại các tiêu chí không đạt. Không đạt lần hai thì leo thang mức 1 (M1 1.5.1) |
| Ảnh hưởng lịch và chi phí | Giờ review đã tính trong hoạt động review. Giờ làm lại lấy từ dự phòng làm lại 11,5 giờ (2.9), không cộng vào ước lượng cơ sở |

### 2.5.2 Kiểm tra vị trí checkpoint

- [x] Checkpoint đặt ở sản phẩm rủi ro cao và điểm bàn giao giữa các nhóm: SRS, API, CSDL, mỗi increment, bộ test, dry run, nghiệm thu.
- [x] Mỗi checkpoint có hoạt động và giờ review trong ước lượng và trong mạng.
- [x] Đường xử lý khi không đạt và người phê duyệt được ghi rõ.

## 2.6 Ước lượng effort từ dưới lên

### 2.6.1 Phương pháp và giả định

| Hạng mục | Quy định |
|---|---|
| Phương pháp | Phân rã từ dưới lên: mỗi hoạt động chia thành sub-task có số lượng × giờ đơn vị, tạo ra giá trị M. Hoạt động lớn và bất định dùng ước lượng ba điểm PERT, E = (O + 4M + P) / 6. Hoạt động nhỏ, lặp lại (review, kiểm thử ngắn, họp) dùng mức chuẩn (standard allowance) |
| Đơn vị | Người-giờ. Năng lực mỗi người: 1,6 giờ/ngày ở W9 và 2,4 giờ/ngày ở W10-W12 (8 và 12 giờ/tuần, 5 ngày) |
| Căn cứ và độ tin cậy | Kinh nghiệm môn học trước của thành viên; bản nháp ước lượng v0.2 của từng nhóm; số lượng đếm từ PD (số FR, endpoint, thực thể, kịch bản). σ cho biết độ bất định; hoạt động có σ lớn được đưa vào sổ rủi ro |
| Phạm vi ước lượng | Chỉ tính thời gian làm việc tập trung, gồm cả unit test và review pull request trong hoạt động; không gồm thời gian học công cụ mới. Dự phòng làm lại tách riêng (2.9) |
| Đã làm trước mốc lập kế hoạch | Báo cáo M1 (P23), Client Interaction Log vòng 1-2 và báo cáo M2 này (P01) là công sức thực tế W1-W8, không nằm trong ước lượng |

### 2.6.2 Ước lượng ba điểm

| A-ID | Hoạt động | Căn cứ (sub-task) | O | M | P | E (giờ) | σ |
|---|---|---|---|---|---|---|---|
| A-01 | Viết SRS v1.0 phạm vi Must | Khung và phần 1-2: 1h; FR nền tảng 6 × 0,25h = 1,5h; FR xe vào/ra 7 × 0,3h = 2,1h; FR chỗ trống 4 × 0,3h = 1,2h; FR thông tin bãi 6 × 0,25h = 1,5h; NFR 8 × 0,25h = 2h; ma trận 5 EX × 0,3h = 1,5h; phần 6-8: 1h | 9 | 12 | 17 | 12,33 | 1,33 |
| A-13 | Thiết kế giao diện luồng cốt lõi | 7 màn hình × 0,5h = 3,5h (đăng nhập/đăng ký, bãi, khu vực và sức chứa, xe vào, xe ra và ngoại lệ, chỗ trống, tài khoản và nhật ký); luồng điều hướng theo vai trò 1h | 3,5 | 4,5 | 7 | 4,75 | 0,58 |
| A-30 | Xây dựng che biển số, nhật ký truy cập và màn hình tài khoản | Che biển số 1h; ghi và xem nhật ký truy cập 1,5h; màn hình quản lý tài khoản của Manager 1,5h; unit test 0,5h | 3,5 | 4,5 | 8 | 4,92 | 0,75 |
| A-66 | Xây dựng màn hình ghi nhận xe vào/ra | Màn hình vào 1,5h; màn hình ra 1,5h; thông báo lỗi và cảnh báo ngoại lệ 1h; responsive 0,5h | 3,5 | 4,5 | 8 | 4,92 | 0,75 |
| A-89 | Viết báo cáo kết quả nghiệm thu | Tổng hợp 9 AT và kịch bản 100 lượt 1h; số đo O4 0,5h; lỗi còn mở 0,5h; viết 1h | 2 | 3 | 5 | 3,17 | 0,5 |
| A-20 | Chọn công nghệ và thiết kế kiến trúc tổng thể | So sánh stack 1,5h; sơ đồ thành phần 1,5h; luồng sự kiện vào/ra và cập nhật chỗ trống qua SSE 1h; phân quyền, che biển số, đa bãi 0,5h; cấu trúc repo và linter 0,5h | 3,5 | 5 | 9 | 5,42 | 0,92 |
| A-21 | Thiết kế quy ước API và hợp đồng sự kiện vào/ra | Quy ước chung 1h; hợp đồng sự kiện vào/ra cho P04 và P05 1,5h; ví dụ yêu cầu/phản hồi 0,5h | 2 | 3 | 5 | 3,17 | 0,5 |
| A-22 | Đặc tả API mô-đun cốt lõi | 16 endpoint × 0,25h = 4h (tài khoản 5, bãi 6, vào/ra 3, chỗ trống 2); đối chiếu SRS 0,5h | 3 | 4,5 | 8 | 4,83 | 0,83 |
| A-24 | Thiết kế ERD và từ điển dữ liệu | 10 thực thể × 0,3h = 3h; quan hệ, khóa, đa bãi 1h; chỗ trống và ràng buộc một lượt mở 0,5h; từ điển dữ liệu 1h | 4 | 5,5 | 9 | 5,83 | 0,83 |
| A-26 | Viết và kiểm thử script lược đồ, dữ liệu mẫu, script lưu giữ | Script lược đồ 2h; seed 0,5h; script lưu giữ biển số 12 tháng 1h; kiểm thử T-DB 1,5h | 3,5 | 5 | 9 | 5,42 | 0,92 |
| A-28 | Xây dựng đăng ký, đăng nhập, phiên và RBAC | Đăng ký và băm mật khẩu 1,5h; đăng nhập, đăng xuất, phiên 1,5h; RBAC dùng chung 2h; unit test 0,5h | 4 | 5,5 | 10 | 6 | 1 |
| A-90 | Tổng hợp số liệu thực tế và so sánh với baseline | Thu Task Log 5 × 0,25h = 1,25h; so sánh effort và tiến độ 1,5h; đối chiếu rủi ro 0,5h | 2,5 | 3,25 | 5 | 3,42 | 0,42 |
| A-40 | Xây dựng cấu hình, bộ sinh dữ liệu giả và bộ sinh sự kiện | Cấu hình và sinh biển số, mã QR/RFID giả có cờ mô phỏng 2h; sinh sự kiện vào/ra có seed 2h; unit test 0,5h | 3,5 | 4,5 | 7 | 4,75 | 0,58 |
| A-42 | Xây dựng bộ gửi sự kiện và nhật ký chạy | Client gửi theo hợp đồng và stub P05 2h; nhật ký chạy (seed, cấu hình, kết quả) 1h; unit test 0,5h | 2,5 | 3,5 | 6 | 3,75 | 0,58 |
| A-43 | Xây dựng kịch bản mô phỏng và README | 7 kịch bản (1 thường, 5 ngoại lệ, 1 tải ≥ 100 lượt) × 0,4h = 2,8h; README 1h | 3 | 4 | 6 | 4,17 | 0,5 |
| A-47 | Tạo dữ liệu mô phỏng bãi thí điểm | Cấu hình 3 khu vực, 300 + 30 chỗ 1h; nạp và kiểm tra 1h | 1,5 | 2 | 4 | 2,25 | 0,42 |
| A-48 | Xây dựng mô-đun hiển thị tình trạng chỗ đỗ | API chỗ trống theo khu vực và loại xe 2h; màn hình 2,5h; cập nhật trực tiếp qua SSE 1h; unit test 1h | 5 | 6,5 | 11 | 7 | 1 |
| A-79 | Xây dựng bộ kiểm thử hợp đồng API vào/ra | Ca kiểm thử cho từng endpoint theo hợp đồng 1,5h; chạy với P04 và P05 0,5h | 1,5 | 2 | 3 | 2,08 | 0,25 |
| A-68 | Kiểm thử mô-đun xe ra/vào | Chạy T05-T13 1,5h; kịch bản 100 lượt 1h; ghi Quality Evidence 0,5h | 2 | 3 | 5 | 3,17 | 0,5 |
| A-60 | Xây dựng mô-đun quản lý thông tin bãi | CRUD bãi 1,5h; khu vực 1,5h; sức chứa theo loại xe 1,5h; trạng thái hoạt động 0,5h; bảng giá theo loại xe/nhóm người dùng (lưu và hiển thị) 1h; phân quyền Manager 0,5h; unit test 1h | 5,5 | 7,5 | 12 | 7,92 | 1,08 |
| A-78 | Thử nghiệm xử lý đồng thời cập nhật chỗ trống | Dựng kịch bản nhiều lượt cùng lúc 1h; thử giao dịch/khóa theo khu vực 1h | 1,5 | 2 | 3 | 2,08 | 0,25 |
| A-63 | Xây dựng API sự kiện vào/ra và cập nhật chỗ trống | Endpoint vào 1,5h; endpoint ra 1,5h; kiểm tra dữ liệu 1h; đếm lượt mở và cập nhật 1,5h; giao dịch/khóa 1h; unit test 1h | 5,5 | 7,5 | 12 | 7,92 | 1,08 |
| A-65 | Xây dựng xử lý 5 ngoại lệ xe vào/ra | 5 ngoại lệ (bãi hết chỗ, biển số không khớp, mất QR/thẻ, xe đã có lượt mở, bãi tạm ngưng) × 1h; ghi session_events 0,5h | 4 | 5,5 | 9 | 5,83 | 0,83 |
| A-67 | Tích hợp mô-đun xe ra/vào với bộ mô phỏng | Kết nối theo hợp đồng 1h; chạy kịch bản và sửa lỗi 1,5h | 1,5 | 2,5 | 5 | 2,75 | 0,58 |
| A-80 | Viết kế hoạch kiểm thử | Mức kiểm thử và phạm vi 1h; ánh xạ O1, O2, O4, O5 sang cách đo 1h; môi trường, dữ liệu, tiêu chí vào/ra 1h; quản lý lỗi 0,5h | 2,5 | 3,5 | 6 | 3,75 | 0,58 |
| A-82 | Viết kịch bản nghiệm thu chính AT-01 đến AT-04 | 4 kịch bản × 0,75h (xe máy vào/ra, ô tô vào/ra, Manager quản lý bãi, RBAC và che biển số) | 2 | 3 | 5 | 3,17 | 0,5 |
| A-83 | Viết kịch bản nghiệm thu ngoại lệ và kịch bản 100 lượt | 5 AT-EX × 0,4h = 2h; kịch bản 100 lượt 1h | 2 | 3 | 5 | 3,17 | 0,5 |
| A-95 | Chạy thử sớm AT-01, AT-02 và kịch bản 100 lượt | Dựng môi trường và script reset 0,5h; chạy AT-01, AT-02 0,5h; 100 lượt 0,5h; ghi lỗi 0,5h | 1,5 | 2 | 3,5 | 2,17 | 0,33 |
| A-87 | Chạy thử nghiệm thu nội bộ | 9 AT × 0,3h = 2,7h; 100 lượt 0,5h; chỉnh kịch bản 0,5h; ghi Quality Evidence 0,5h | 3 | 4,2 | 7 | 4,47 | 0,67 |
| A-88 | Trình diễn nghiệm thu với khách hàng | Chuẩn bị môi trường và kịch bản 1h; quay video demo 1h; gửi email và ghi nhận 0,5h (Q23) | 2 | 2,5 | 5 | 2,83 | 0,5 |
| A-92 | Viết và rà soát báo cáo quản lý dự án cuối kỳ | Phân tích kết quả theo O1-O5 1,5h; viết và định dạng 3h; review 2 người × 0,5h | 4 | 5,5 | 9 | 5,83 | 0,83 |
|  | **Tổng** |  |  |  |  | **143,22** |  |

### 2.6.3 Mức chuẩn cho hoạt động nhỏ và định kỳ

| A-ID | Hoạt động | Effort (giờ) | Căn cứ |
|---|---|---|---|
| A-09 | Review SRS | 3 | RES-05 đọc toàn bộ 1h; RES-01 đọc phần Must liên quan kiến trúc 0,5h; tác giả sửa sau review 1,5h |
| A-16 | Gửi câu hỏi vòng 3 và cập nhật Client Interaction Log | 2 | Rút gọn câu hỏi vòng 3 còn các câu thuộc phạm vi Must 0,5h; ghi phản hồi 1h; cập nhật giả định SRS 0,5h |
| A-23 | Review kiến trúc và API | 2 | 1 người đọc 1h (QA) + sửa sau review 1h (tác giả) |
| A-27 | Review thiết kế CSDL | 1,5 | 1 người đọc 1h + sửa 0,5h |
| A-45 | Kiểm thử và review bộ mô phỏng | 2 | Chạy tiêu chí 1-5, 7, 8 của PD-P04 1h; review 1h |
| A-33 | Viết hướng dẫn cài đặt và chạy demo | 2 | Cài đặt và nạp dữ liệu 1h; chạy bộ mô phỏng và kịch bản demo 1h |
| A-61 | Kiểm thử mô-đun quản lý thông tin bãi | 1,5 | CRUD và phân quyền Manager 1h; ghi Quality Evidence 0,5h |
| A-49 | Kiểm thử mô-đun hiển thị chỗ trống | 2 | So số đếm tay sau kịch bản P04 1h; đo độ trễ cập nhật 0,5h; ghi Quality Evidence 0,5h |
| A-31 | Kiểm thử mô-đun xác thực và phân quyền | 2 | Ma trận quyền 3 vai trò × 5 nhóm chức năng 1h; che biển số và nhật ký 0,5h; ghi Quality Evidence 0,5h |
| A-85 | Review bộ test nghiệm thu và gửi khách hàng xác nhận | 2,5 | Review 1h (RES-04); sửa 0,5h; email và ghi log 0,5h; điều phối 0,5h |
| A-94 | Ghi nhật ký dự án hằng tuần | 2 | 4 tuần × 0,5h |
| A-97 | Họp tiến độ hằng tuần | 7,5 | 3 tuần × 5 người × 0,5h; tuần 12 thay bằng A-91 |
| A-91 | Họp tổng kết và ghi bài học kinh nghiệm | 2,5 | 5 người × 0,5h, thay họp tuần 12 |
| A-99 | Phân tích tác động sự kiện thay đổi và cập nhật baseline | 3 | Task 3.6: phân tích tác động 1,5h; phương án và CR, Baseline V2.0 nếu cần 1,5h |
|  | **Tổng** | **35,5** |  |

### 2.6.4 Effort và thời gian trôi qua

Effort là số người-giờ. Thời gian tối thiểu là effort chia cho năng lực của những người được giao, giả định họ dành toàn bộ thời gian khả dụng (2 giờ/ngày danh nghĩa). Thời gian theo lịch dài hơn khi người làm bận việc khác hoặc phải chờ hoạt động trước.

| A-ID | Effort (giờ) | Người làm | Năng lực (giờ/ngày) | Thời gian tối thiểu (ngày) | Lịch thực tế (ngày làm việc) và lý do |
|---|---|---|---|---|---|
| A-01 | 12,33 | RES-04, RES-02 | 2 × 2 | 4,01 | 5,26 (09/11 → 16/11); chờ nguồn lực/phụ thuộc |
| A-09 | 3 | RES-04, RES-05, RES-01 | 3 × 2 | 0,75 | 0,88 (16/11 → 16/11) |
| A-13 | 4,75 | RES-04 | 1 × 2 | 2,38 | 2,94 (16/11 → 18/11) |
| A-30 | 4,92 | RES-02 | 1 × 2 | 2,46 | 2,17 (23/11 → 25/11) |
| A-66 | 4,92 | RES-04 | 1 × 2 | 2,46 | 2,17 (25/11 → 27/11) |
| A-89 | 3,17 | RES-04, RES-03 | 2 × 2 | 0,79 | 1,24 (02/12 → 03/12) |
| A-20 | 5,42 | RES-01 | 1 × 2 | 2,71 | 4,64 (09/11 → 13/11); chờ nguồn lực/phụ thuộc |
| A-21 | 3,17 | RES-01, RES-05 | 2 × 2 | 0,79 | 1,92 (13/11 → 16/11); chờ nguồn lực/phụ thuộc |
| A-22 | 4,83 | RES-01, RES-03 | 2 × 2 | 1,21 | 2,9 (16/11 → 18/11); chờ nguồn lực/phụ thuộc |
| A-23 | 2 | RES-02, RES-03 | 2 × 2 | 0,5 | 1,36 (18/11 → 19/11) |
| A-24 | 5,83 | RES-03 | 1 × 2 | 2,92 | 3,9 (09/11 → 12/11) |
| A-26 | 5,42 | RES-03 | 1 × 2 | 2,71 | 3,65 (12/11 → 17/11) |
| A-27 | 1,5 | RES-02, RES-03 | 2 × 2 | 0,5 | 0,85 (17/11 → 17/11) |
| A-28 | 6 | RES-03 | 1 × 2 | 3 | 2,94 (19/11 → 23/11) |
| A-90 | 3,42 | RES-01 | 1 × 2 | 1,71 | 1,59 (30/11 → 01/12) |
| A-40 | 4,75 | RES-05 | 1 × 2 | 2,38 | 3,22 (09/11 → 12/11) |
| A-42 | 3,75 | RES-05 | 1 × 2 | 1,88 | 2,14 (16/11 → 18/11) |
| A-43 | 4,17 | RES-05 | 1 × 2 | 2,08 | 1,92 (18/11 → 19/11) |
| A-45 | 2 | RES-05, RES-02 | 2 × 2 | 0,5 | 1,38 (19/11 → 20/11) |
| A-47 | 2,25 | RES-05 | 1 × 2 | 1,13 | 1,35 (20/11 → 23/11) |
| A-48 | 7 | RES-05 | 1 × 2 | 3,5 | 3,31 (24/11 → 27/11) |
| A-79 | 2,08 | RES-05 | 1 × 2 | 1,04 | 1,26 (23/11 → 24/11) |
| A-33 | 2 | RES-03 | 1 × 2 | 1 | 1,81 (26/11 → 27/11) |
| A-61 | 1,5 | RES-01 | 1 × 2 | 0,75 | 0,83 (24/11 → 24/11) |
| A-68 | 3,17 | RES-05, RES-02 | 2 × 2 | 0,79 | 1,58 (27/11 → 30/11) |
| A-60 | 7,92 | RES-04, RES-01 | 2 × 2 | 1,98 | 4,41 (18/11 → 24/11); chờ nguồn lực/phụ thuộc |
| A-78 | 2,08 | RES-01 | 1 × 2 | 1,04 | 1,67 (18/11 → 19/11) |
| A-63 | 7,92 | RES-03, RES-04 | 2 × 2 | 1,98 | 4,68 (19/11 → 25/11); chờ nguồn lực/phụ thuộc |
| A-65 | 5,83 | RES-03, RES-01 | 2 × 2 | 1,46 | 1,93 (25/11 → 26/11) |
| A-67 | 2,75 | RES-01, RES-05 | 2 × 2 | 0,69 | 1,88 (26/11 → 27/11); chờ nguồn lực/phụ thuộc |
| A-49 | 2 | RES-04 | 1 × 2 | 1 | 1,47 (27/11 → 30/11) |
| A-31 | 2 | RES-05 | 1 × 2 | 1 | 1,45 (30/11 → 01/12) |
| A-80 | 3,75 | RES-02 | 1 × 2 | 1,88 | 2,52 (16/11 → 18/11) |
| A-82 | 3,17 | RES-02 | 1 × 2 | 1,58 | 2,34 (18/11 → 20/11) |
| A-83 | 3,17 | RES-02 | 1 × 2 | 1,58 | 3,83 (20/11 → 25/11); chờ nguồn lực/phụ thuộc |
| A-85 | 2,5 | RES-02, RES-04 | 2 × 2 | 0,75 | 2,59 (25/11 → 27/11); chờ nguồn lực/phụ thuộc |
| A-95 | 2,17 | RES-02 | 1 × 2 | 1,08 | 1,65 (27/11 → 30/11) |
| A-87 | 4,47 | RES-02, RES-04 | 2 × 2 | 1,12 | 0,97 (01/12 → 01/12) |
| A-88 | 2,83 | RES-01, RES-05 | 2 × 2 | 0,71 | 1,26 (01/12 → 02/12) |
| A-92 | 5,83 | RES-03, RES-02 | 2 × 2 | 1,75 | 1,99 (01/12 → 02/12) |

## 2.7 Rà soát khả năng kiểm soát hoạt động

### 2.7.1 Quyết định tách và gộp

Bản nháp v0.2 có 71 hoạt động cho toàn bộ phạm vi (gồm đặt chỗ và thanh toán; chưa có hoạt động cho P09, P11, P19, P22). Sau khi thu hẹp phạm vi về nhóm Must (2.10), nhóm rà lại kích thước từng hoạt động theo hai ngưỡng: không quá 24 người-giờ (để kiểm tra được trong 1 tuần) và không dưới khoảng 1,5 người-giờ (trừ việc định kỳ).

| Hoạt động ban đầu | Vấn đề | Hoạt động sau rà soát | Thay đổi phụ thuộc / ước lượng |
|---|---|---|---|
| A-21 + A-22 "Thiết kế đặc tả API" (E 28,3 giờ, bản nháp) | Vượt 24 giờ | A-21 quy ước và hợp đồng vào/ra; A-22 đặc tả API mô-đun cốt lõi | A-40, A-42, A-63 chỉ cần A-21 nên bắt đầu sớm hơn |
| A-40/A-41 bộ mô phỏng (bản nháp tách theo chức năng) | Phần cần hợp đồng và phần không cần bị gộp chung | A-40 cấu hình, sinh dữ liệu và sự kiện (không cần hợp đồng); A-42 bộ gửi và nhật ký (cần A-21) | A-40 bắt đầu ngay W9 |
| A-28/A-29/A-30 mô-đun xác thực | Phần RBAC chặn các mô-đun khác nhưng bị gộp với màn hình | A-28 đăng ký, đăng nhập, phiên, RBAC; A-30 che biển số, nhật ký, màn hình tài khoản | Ứng phó R-G2-03: mô-đun nghiệp vụ chỉ chờ A-28 |
| A-01 đến A-08, A-10 (9 hoạt động viết SRS theo phần) | Nhiều hoạt động 3-12 giờ cho một tài liệu, phạm vi đã thu hẹp | A-01 viết SRS v1.0 phạm vi Must (E 12,3 giờ) | Gộp; A-11, A-12 không còn cần (phí và đặt chỗ hoãn; review sớm thay bằng đồng tác giả BA) |
| A-24 + A-25 ERD và từ điển dữ liệu | Hai hoạt động nhỏ trên cùng tài liệu | A-24 | Gộp |
| A-63 + A-64 API vào/ra và logic chỗ trống | Hai phần của cùng endpoint | A-63 | Gộp |
| A-62, A-69, A-73, A-77, A-32 review từng mô-đun | Review 1,5-4 giờ trùng với review pull request | Review pull request trong từng hoạt động (Definition of Done) cộng kiểm thử độc lập A-31, A-49, A-61, A-68 | Bỏ hoạt động riêng |
| A-81, A-84, A-86 review kế hoạch kiểm thử, truy vết, gửi khách hàng | Ba hoạt động 3-5 giờ quanh cùng bộ test | A-85 review bộ test và gửi khách hàng xác nhận | Gộp |
| A-34 chạy thử hướng dẫn trên máy sạch | Trùng với tiêu chí 9 của PD-P04 và với dry run | Trong A-33 và A-87 | Gộp |
| A-70 đến A-77 (mô-đun P06, P10) | Ngoài phạm vi Baseline V1.0 | Hoãn theo Q22 | Bỏ khỏi baseline, giữ trong danh sách ứng viên V2.0 |

### 2.7.2 Quy tắc kiểm soát

| Hạng mục | Quy định |
|---|---|
| Độ chi tiết | Mỗi hoạt động ≤ 24 người-giờ và thường kết thúc trong ≤ 5 ngày làm việc, để nhật ký tuần thấy được hoàn thành hay chưa |
| Đo tiến độ | Một hoạt động là xong khi có sản phẩm kiểm tra được: pull request đã merge và test đạt, hoặc tài liệu đã qua review |
| Danh mục cuối | Bảng 2.4.1 là danh mục duy nhất dùng cho ước lượng, rủi ro, nguồn lực, lịch và truy vết (kiểm tra tự động bằng script) |

- [x] Mỗi hoạt động có người phụ trách và đầu ra kiểm chứng được.
- [x] Mã hoạt động khớp giữa ước lượng, sổ rủi ro, phân bổ, lịch và truy vết.

## 2.8 Đánh giá rủi ro mức hoạt động

### 2.8.1 Thang điểm

| Khả năng (L) | Mô tả | Ảnh hưởng (I) | Giờ công mất thêm | Lịch / phạm vi / chất lượng |
|---|---|---|---|---|
| 1 Rất thấp | ≤ 10% | 1 Không đáng kể | ≤ 4 giờ | Không ảnh hưởng lịch |
| 2 Thấp | > 10% đến 30% | 2 Nhẹ | > 4 đến 12 giờ | Hấp thụ bằng float |
| 3 Trung bình | > 30% đến 50% | 3 Vừa | > 12 đến 24 giờ | Trễ 1-2 ngày, hoặc giảm một yêu cầu Should/Could |
| 4 Cao | > 50% đến 80% | 4 Lớn | > 24 đến 48 giờ | Trễ 3-5 ngày trên đường găng, hoặc giảm chất lượng một yêu cầu Must |
| 5 Rất cao | > 80% | 5 Nghiêm trọng | > 48 giờ | Trễ milestone hoặc phải bỏ yêu cầu Must |

Điểm = L × I. Ảnh hưởng lấy mức cao hơn giữa giờ công và lịch. 1-4 Thấp: chấp nhận, theo dõi trong nhật ký tuần. 5-9 Trung bình: phải có phương án dự phòng. 10-14 Cao: phải có hoạt động giảm thiểu trong lịch. 15-25 Nghiêm trọng: như Cao và báo PM ngay. Ngưỡng phản ứng chủ động: điểm ≥ 10.

> 📐 **SƠ ĐỒ CẦN REVIEW:** `diagrams/06-risk-matrix.drawio` (xuất ảnh: `diagrams/06-risk-matrix.png`)
> Kiểm tra: mỗi R-ID nằm đúng ô L × I của bảng 2.8.2.

### 2.8.2 Sổ rủi ro mức hoạt động

| R-ID / A-ID | Sự kiện rủi ro | Xác suất | Ảnh hưởng | L × I | Mức | Phụ trách | Giảm thiểu | Dự phòng | Phơi nhiễm (giờ) |
|---|---|---|---|---|---|---|---|---|---|
| R-G1-01 / A-16, A-01 | Khách hàng phản hồi vòng 3 hoặc duyệt Baseline muộn, hoặc trả lời khác giả định (Q19) | 40% | +4h; Không găng | 3 × 1 = 3 | Thấp | RES-04 | Gửi câu hỏi vòng 3 ngay đầu W9, chỉ giữ câu thuộc phạm vi Must; ghi giả định bằng mã AS | Đóng băng giả định vào Baseline V1.0; thay đổi sau đó qua CR | 1,6 |
| R-G1-02 / A-01, A-09 | SRS mơ hồ hoặc thiếu truy vết nên CP-01 không đạt | 30% | +5h; 1 ngày trên đường găng | 2 × 3 = 6 | Trung bình | RES-04 | Đồng tác giả BA (RES-02) viết A-01; tự kiểm 7 tiêu chí trước review | Sửa trong 2 ngày bằng dự phòng làm lại | 1,5 |
| R-G2-01 / A-20, A-48 | Cập nhật gần thời gian thực qua SSE không ổn định hoặc trễ, không đạt mục tiêu O1 (R5 ở M1) | 30% | +6h; Không găng | 2 × 2 = 4 | Thấp | RES-03 | Chốt cơ chế SSE ở A-20; đo độ trễ ngay trong A-48 | Chuyển màn hình chỗ trống sang làm mới theo chu kỳ | 1,8 |
| R-G2-02 / A-21, A-40, A-63 | Hợp đồng API vào/ra đổi sau khi A-40, A-63 đã bắt đầu | 25% | +6h; 1 ngày | 2 × 2 = 4 | Thấp | RES-03 | Đóng băng hợp đồng tại CP-02; bộ kiểm thử hợp đồng A-79 | Lớp chuyển đổi giữa hợp đồng cũ và mới | 1,5 |
| R-G2-03 / A-28, A-63, A-60 | Mô-đun xác thực (A-28) trễ, chặn mô-đun nghiệp vụ trên đường găng | 40% | +3h; 2-3 ngày trên đường găng | 3 × 4 = 12 | Cao | RES-03 | Tái cấu trúc mạng: A-60, A-63, A-48 không chờ A-28, dùng phân quyền giả lập; tách A-28/A-30 | Gắn P07 vào cuối increment 2 trước A-68 | 1,2 |
| R-G3-01 / A-40, A-67 | Bộ mô phỏng chạy tốt với stub nhưng lệch khi nối P05 thật | 35% | +4h; 1 ngày | 3 × 1 = 3 | Thấp | RES-05 | Dùng chung bộ kiểm thử hợp đồng A-79 | Giữ stub làm đường kiểm thử; chỉnh lớp client, không sửa bộ sinh | 1,4 |
| R-G3-02 / A-43, A-65, A-83 | Khách hàng thêm hoặc đổi ngoại lệ khi duyệt Baseline hoặc tại CP-06 | 25% | +4h; Không găng | 2 × 1 = 2 | Thấp | RES-05 | Gửi danh sách 5 ngoại lệ cùng email duyệt Baseline | Ngoại lệ thêm muộn dùng dự phòng hoặc CR | 1 |
| R-G4-01 / A-63, A-67, A-68 | Nhiều lượt vào/ra gần như đồng thời làm lệch số chỗ trống (O1) | 30% | +6h; 1 ngày trên đường găng | 2 × 3 = 6 | Trung bình | RES-01 | Thử nghiệm A-78 trước A-63; giao dịch và ràng buộc một lượt mở (T-DB5) | Khóa tuần tự theo khu vực, chấp nhận chậm hơn | 1,8 |
| R-G4-02 / W10-W12 | Thành viên không giữ được 12h/tuần ở W10-W12 do lịch thi và môn học khác | 50% | 2-4 ngày trên đường găng | 3 × 4 = 12 | Cao | RES-01 | Đặt việc găng sớm; ghi giờ thực tế hằng tuần (A-94); leo thang mức 1 khi thiếu > 2h/tuần | Dùng dự phòng; nếu vẫn thiếu, CR giảm phạm vi trong nhóm Must với khách hàng duyệt | Không tính (rủi ro năng lực) |
| R-G5-01 / A-87 | Mô-đun chưa sẵn sàng khi dry run | 45% | +2h; 2 ngày trên đường găng | 3 × 3 = 9 | Trung bình | RES-02 | Chạy thử sớm A-95; theo dõi trạng thái trong nhật ký tuần | Chạy A-87 theo đợt; AT chưa chạy ghi lý do vào P14 | 0,9 |
| R-G5-02 / A-87, A-88 | Dry run phát hiện nhiều lỗi hơn dự kiến | 55% | +4h; 1-2 ngày trên đường găng | 4 × 3 = 12 | Cao | RES-02 | A-95 lộ lỗi sớm; phân loại lỗi ngay khi gặp | Chỉ chạy lại AT không đạt; lỗi không chặn ghi vào P14 | 2,2 |
| R-G5-03 / A-85, A-88 | Khách hàng không phản hồi xác nhận kịch bản hoặc demo (Q19) | 40% | +2h; 2-3 ngày | 3 × 3 = 9 | Trung bình | RES-02 | Gửi ngay sau review, nhắc sau 2 ngày | Chạy theo danh sách đề xuất, ghi trạng thái chờ xác nhận | 0,8 |

### 2.8.3 Ưu tiên và ảnh hưởng định lượng

| Rủi ro | Ảnh hưởng lịch (ngày) | Ảnh hưởng chi phí (VNĐ, quy đổi) | Ngày rà soát | Mức còn lại sau ứng phó |
|---|---|---|---|---|
| R-G2-03 | 2-3 | 150.000 | CP-02 (19/11) | L 2 × I 2 = 4, nhờ tái cấu trúc mạng (A-60, A-63 không chờ A-28) |
| R-G4-02 | 2-4 | Không quy đổi (rủi ro năng lực) | Mỗi tuần (A-94) | Giữ L 3 × I 4 = 12; 1,8 ngày float cuối lịch là vùng đệm |
| R-G5-02 | 1-2 | 200.000 | CP-07 (01/12) | L 3 × I 2 = 6, nhờ A-95 |
| R-G4-01 | 1 | 300.000 | 19/11 (sau A-78) | L 2 × I 2 = 4, nhờ A-78 |
| R-G5-01 | 2 | 100.000 | CP-07 | L 2 × I 2 = 4, nhờ A-95 |
| R-G1-02 | 1 | 250.000 | CP-01 (16/11) | L 2 × I 2 = 4 (đồng tác giả BA) |

Chi phí quy đổi = số giờ thêm × 50.000 VNĐ. Không cộng ảnh hưởng này vào cả lịch lẫn chi phí: phần giờ đã nằm trong dự phòng làm lại (2.9.2).

## 2.9 Điều chỉnh kế hoạch theo ứng phó rủi ro

### 2.9.1 Hoạt động thêm hoặc thay đổi

| R-ID | Quyết định ứng phó | Hoạt động | Effort thêm (giờ) | Phụ thuộc / tác dụng |
|---|---|---|---|---|
| R-G4-01 | Thử nghiệm trước | A-78 thử nghiệm xử lý đồng thời | 2,08 | A-26 → A-78 → A-63 |
| R-G2-02, R-G3-01 | Phòng ngừa | A-79 bộ kiểm thử hợp đồng API vào/ra | 2,08 | A-21 → A-79 → A-67 |
| R-G5-01, R-G5-02 | Chạy thử sớm | A-95 smoke run AT-01, AT-02, AT-100 | 2,17 | A-85, A-67 → A-95 → A-87 |
| R-G2-03 | Tái cấu trúc (không thêm giờ) | Tách A-28/A-30; A-60, A-63, A-48 không chờ A-28 | 0 | Rút ngắn chuỗi trước tích hợp |
| R-G2-01 | Chấp nhận, đo sớm | Không thêm hoạt động; đo độ trễ trong A-48. Bỏ spike thời gian thực của bản nháp vì A-20 chọn Server-Sent Events (SSE), cơ chế một chiều đơn giản có sẵn trong trình duyệt | 0 | Dự phòng: làm mới theo chu kỳ cho màn hình chỗ trống |
| R-G4-02 | Chấp nhận, theo dõi | Ghi giờ thực tế hằng tuần (A-94); 1,8 ngày float | 0 | Leo thang khi thiếu > 2 giờ/tuần |
| Các rủi ro còn lại | Chỉ dự phòng | Dự phòng làm lại 11,5 giờ | — | Kích hoạt khi rủi ro xảy ra, PM duyệt |

### 2.9.2 Dự phòng làm lại (phương án A)

Dự phòng bằng tổng phơi nhiễm còn lại sau ứng phó của các rủi ro tốn giờ công. Không dùng thêm tỷ lệ cố định 15% (workbook Estimates V1) để tránh tính trùng cùng một bất định. Dự phòng không phân cho hoạt động nào; PM duyệt khi dùng và ghi vào nhật ký tuần.

| R-ID | Xác suất trước | Xác suất sau ứng phó | Giờ nếu xảy ra | Dự phòng (giờ) |
|---|---|---|---|---|
| R-G1-01 | 40% | 40% | 4 | 1,6 |
| R-G1-02 | 30% | 30% | 5 | 1,5 |
| R-G2-01 | 30% | 30% | 6 | 1,8 |
| R-G2-02 | 25% | 10% | 6 | 0,6 |
| R-G2-03 | 40% | 20% | 3 | 0,6 |
| R-G3-01 | 35% | 20% | 4 | 0,8 |
| R-G3-02 | 25% | 25% | 4 | 1 |
| R-G4-01 | 30% | 15% | 6 | 0,9 |
| R-G5-01 | 45% | 25% | 2 | 0,5 |
| R-G5-02 | 55% | 35% | 4 | 1,4 |
| R-G5-03 | 40% | 40% | 2 | 0,8 |
| **Tổng** |  |  |  | **11,5** |

### 2.9.3 Đối chiếu trước và sau ứng phó

| Chỉ số | Trước ứng phó | Sau ứng phó | Giải thích |
|---|---|---|---|
| Tổng effort cơ sở (người-giờ) | 172,38 | 178,72 | Thêm A-78, A-79, A-95 (6,33 giờ) |
| Dự phòng làm lại (người-giờ) | 15,70 (phơi nhiễm ban đầu) | 11,50 | Xác suất của R-G2-02, R-G2-03, R-G3-01, R-G4-01, R-G5-01, R-G5-02 giảm |
| Thời gian theo lịch | Không khả thi (trễ sau 04/12) | Kết thúc 03/12 | Gồm cả tái cấu trúc mạng và làm thêm giờ (2.10.3) |
| Chi phí quy đổi (VNĐ) | 9.404.167 | 9.510.833 | (effort cơ sở + dự phòng) × 50.000 |
| Rủi ro cao nhất | 12 (R-G2-03, R-G4-02, R-G5-02) | 12 (R-G4-02) | Chỉ còn rủi ro năng lực ở mức Cao |

- [x] Mọi hoạt động ứng phó có trong danh mục, phân bổ, lịch và chi phí.
- [x] Biện pháp phòng ngừa và dự phòng tách riêng; dự phòng không được tính là việc chắc chắn làm.

## 2.10 Nguồn lực và phân bổ khả thi

### 2.10.1 Năng lực nguồn lực

| RES-ID / vai trò | Thành viên | Kỹ năng / trách nhiệm | Giờ/tuần (W9 / W10-W12) | Giờ khả dụng W9-W12 | Ghi chú |
|---|---|---|---|---|---|
| RES-01 / PM, Trưởng nhóm kỹ thuật | Nguyễn Võ Đức Sơn | Điều phối, kiến trúc, backend nghiệp vụ | 8 / 12 | 44 | Bỏ vai trò QA (chuyển cho RES-02) để giảm tải review |
| RES-02 / BA, Phụ trách chất lượng (QA) | Đào Xuân Sơn | Yêu cầu, kiểm thử nghiệm thu | 8 / 12 | 44 | Nhận vai trò QA từ M2 (thay đổi so với M1 1.5) |
| RES-03 / Kiến trúc và dữ liệu | Nguyễn Phạm Mạnh Dũng | Thiết kế API, CSDL, xác thực | 8 / 12 | 44 | Nằm đầu chuỗi phụ thuộc (P18, P03, P07) |
| RES-04 / Yêu cầu và giao diện | Phạm Duy Quý | SRS, wireframe, giao diện web | 8 / 12 | 44 |  |
| RES-05 / Mô phỏng và giám sát | Nguyễn Tuấn Thành | Bộ mô phỏng, hiển thị chỗ trống, kiểm thử | 8 / 12 | 44 |  |

Năng lực được xác định qua ba bước. (1) Mỗi thành viên cam kết 8 giờ/tuần, tổng 440 người-giờ cho cả dự án (11 tuần làm việc, trừ tuần 12/10). (2) Đến mốc lập kế hoạch 09/11 chỉ còn W9-W12, tức 160 người-giờ, trong khi kế hoạch lý tưởng cần khoảng 765 người-giờ. (3) Sau khi thu hẹp phạm vi và ước lượng lại, nhóm đồng ý làm thêm giờ ở W10-W12 (12 giờ/tuần). Năng lực cuối là 220 người-giờ.

### 2.10.2 Phân bổ theo hoạt động

| A-ID | RES-ID | Giờ theo người | Cửa sổ làm việc |
|---|---|---|---|
| A-01 | RES-04, RES-02 | RES-04: 8,02; RES-02: 4,32 | 09/11 → 16/11 |
| A-09 | RES-04, RES-05, RES-01 | RES-04: 1,5; RES-05: 1; RES-01: 0,5 | 16/11 → 16/11 |
| A-13 | RES-04 | RES-04: 4,75 | 16/11 → 18/11 |
| A-30 | RES-02 | RES-02: 4,92 | 23/11 → 25/11 |
| A-66 | RES-04 | RES-04: 4,92 | 25/11 → 27/11 |
| A-89 | RES-04, RES-03 | RES-04: 1,58; RES-03: 1,58 | 02/12 → 03/12 |
| A-20 | RES-01 | RES-01: 5,42 | 09/11 → 13/11 |
| A-21 | RES-01, RES-05 | RES-01: 1,58; RES-05: 1,58 | 13/11 → 16/11 |
| A-22 | RES-01, RES-03 | RES-01: 2,42; RES-03: 2,42 | 16/11 → 18/11 |
| A-23 | RES-02, RES-03 | RES-02: 1; RES-03: 1 | 18/11 → 19/11 |
| A-24 | RES-03 | RES-03: 5,83 | 09/11 → 12/11 |
| A-26 | RES-03 | RES-03: 5,42 | 12/11 → 17/11 |
| A-27 | RES-02, RES-03 | RES-02: 1; RES-03: 0,5 | 17/11 → 17/11 |
| A-28 | RES-03 | RES-03: 6 | 19/11 → 23/11 |
| A-90 | RES-01 | RES-01: 3,42 | 30/11 → 01/12 |
| A-40 | RES-05 | RES-05: 4,75 | 09/11 → 12/11 |
| A-42 | RES-05 | RES-05: 3,75 | 16/11 → 18/11 |
| A-43 | RES-05 | RES-05: 4,17 | 18/11 → 19/11 |
| A-45 | RES-05, RES-02 | RES-05: 1; RES-02: 1 | 19/11 → 20/11 |
| A-47 | RES-05 | RES-05: 2,25 | 20/11 → 23/11 |
| A-48 | RES-05 | RES-05: 7 | 24/11 → 27/11 |
| A-79 | RES-05 | RES-05: 2,08 | 23/11 → 24/11 |
| A-33 | RES-03 | RES-03: 2 | 26/11 → 27/11 |
| A-61 | RES-01 | RES-01: 1,5 | 24/11 → 24/11 |
| A-68 | RES-05, RES-02 | RES-05: 1,58; RES-02: 1,58 | 27/11 → 30/11 |
| A-60 | RES-04, RES-01 | RES-04: 3,96; RES-01: 3,96 | 18/11 → 24/11 |
| A-78 | RES-01 | RES-01: 2,08 | 18/11 → 19/11 |
| A-63 | RES-03, RES-04 | RES-03: 3,96; RES-04: 3,96 | 19/11 → 25/11 |
| A-65 | RES-03, RES-01 | RES-03: 2,92; RES-01: 2,92 | 25/11 → 26/11 |
| A-67 | RES-01, RES-05 | RES-01: 1,38; RES-05: 1,38 | 26/11 → 27/11 |
| A-49 | RES-04 | RES-04: 2 | 27/11 → 30/11 |
| A-31 | RES-05 | RES-05: 2 | 30/11 → 01/12 |
| A-80 | RES-02 | RES-02: 3,75 | 16/11 → 18/11 |
| A-82 | RES-02 | RES-02: 3,17 | 18/11 → 20/11 |
| A-83 | RES-02 | RES-02: 3,17 | 20/11 → 25/11 |
| A-85 | RES-02, RES-04 | RES-02: 1,5; RES-04: 1 | 25/11 → 27/11 |
| A-95 | RES-02 | RES-02: 2,17 | 27/11 → 30/11 |
| A-87 | RES-02, RES-04 | RES-02: 2,23; RES-04: 2,23 | 01/12 → 01/12 |
| A-88 | RES-01, RES-05 | RES-01: 1,42; RES-05: 1,42 | 01/12 → 02/12 |
| A-92 | RES-03, RES-02 | RES-03: 3,5; RES-02: 2,33 | 01/12 → 02/12 |

### 2.10.3 Giải quyết xung đột nguồn lực

| Xung đột | Vấn đề trong kế hoạch lý tưởng | Cách giải quyết và đánh đổi | Thay đổi lịch |
|---|---|---|---|
| C-01 Năng lực tổng | Kế hoạch lý tưởng (bản nháp v0.2) ≈ 665 người-giờ đã ước lượng + ≈ 100 giờ cho P09, P11, P19, P22, P12, P24 chưa ước lượng, so với 160 người-giờ còn lại | Ba đòn bẩy: (1) hoãn P06, P10, P11, P12 theo Q22; (2) ước lượng lại theo phạm vi Must và gộp hoạt động (2.7); (3) làm thêm giờ | Từ không khả thi xuống 178,72 + 11,5 giờ |
| C-02 Lịch theo thời gian | Ở 10 giờ/tuần, tổng giờ vừa đủ nhưng W9-W11 kín 100% cho mọi người, lịch trễ 1,6 ngày sau 04/12 | Nâng W10-W12 lên 12 giờ/tuần (phương án A); không chọn 11 giờ vì không còn float | Kết thúc 03/12, float khoảng 1,8 ngày |
| C-03 PM kiêm Tech lead và QA | Nguyễn Võ Đức Sơn là người review gần như mọi checkpoint | Chuyển QA sang Đào Xuân Sơn; review CSDL, mô phỏng, API do QA làm | Checkpoint không còn chờ PM |
| C-04 Chuỗi kiến trúc - dữ liệu | Nguyễn Phạm Mạnh Dũng nằm đầu chuỗi P18 → P03 → P07 → mô-đun | Tech lead làm A-20, A-21, A-22; A-24 làm song song từ PD-P03; A-63 làm cặp với Phạm Duy Quý | Mô-đun bắt đầu từ 18-19/11 thay vì 23/11 |
| C-05 Dồn việc kiểm thử cuối kỳ | QA nhận quá nhiều việc ở W12 | Chia kiểm thử độc lập: A-31 cho Nguyễn Tuấn Thành, A-49 cho Phạm Duy Quý, A-61 cho Nguyễn Võ Đức Sơn; báo cáo cuối kỳ chia 2 người | Dry run 01/12 |
| C-06 Bộ mô phỏng chờ hợp đồng | Bộ mô phỏng không làm được gì ở W9 nếu chờ A-21 | Tách A-40/A-42; Nguyễn Tuấn Thành cùng viết hợp đồng A-21 | Bộ mô phỏng sẵn sàng 20/11 |

### 2.10.4 Tải nguồn lực theo tuần

| RES-ID | Thành viên | W9 (giờ / 8) | W10 (giờ / 12) | W11 (giờ / 12) | W12 (giờ / 12) | Tổng giao | Khả dụng | Dư |
|---|---|---|---|---|---|---|---|---|
| RES-01 | Nguyễn Võ Đức Sơn | 8 | 12 | 9,75 | 5,83 | 35,58 | 44 | 8,42 |
| RES-02 | Đào Xuân Sơn | 4,82 | 12 | 10,8 | 6,52 | 34,13 | 44 | 9,87 |
| RES-03 | Nguyễn Phạm Mạnh Dũng | 8 | 12 | 11,54 | 5,58 | 37,13 | 44 | 6,88 |
| RES-04 | Phạm Duy Quý | 8 | 12 | 10,58 | 5,33 | 35,92 | 44 | 8,08 |
| RES-05 | Nguyễn Tuấn Thành | 6,75 | 12 | 12 | 5,21 | 35,96 | 44 | 8,04 |

## 2.11 Lịch và chi phí baseline

### 2.11.1 Lịch hoạt động đã cân bằng nguồn lực

Lịch được lập bằng phương pháp lập lịch nối tiếp (serial schedule generation) theo ngày: hoạt động sẵn sàng được xếp theo độ ưu tiên LS nhỏ nhất (checkpoint ưu tiên trước), mỗi người chỉ dùng phần năng lực còn lại trong ngày. Thứ tự ưu tiên được thử nhiều lần với nhiễu ngẫu nhiên có seed cố định, và giữ lịch ngắn nhất. Script và dữ liệu đầu vào lưu trong repo để tái lập.

| A-ID / mốc | Hoạt động trước | Phụ trách | Effort (giờ) | Bắt đầu | Kết thúc | Thời gian (ngày) |
|---|---|---|---|---|---|---|
| A-40 | — | RES-05 | 4,75 | 09/11 | 12/11 | 3,22 |
| A-24 | — | RES-03 | 5,83 | 09/11 | 12/11 | 3,9 |
| A-20 | — | RES-01 | 5,42 | 09/11 | 13/11 | 4,64 |
| A-01 | — | RES-04, RES-02 | 12,33 | 09/11 | 16/11 | 5,26 |
| A-26 | A-24 | RES-03 | 5,42 | 12/11 | 17/11 | 3,65 |
| A-21 | A-20 | RES-01, RES-05 | 3,17 | 13/11 | 16/11 | 1,92 |
| A-09 | A-01 | RES-04, RES-05, RES-01 | 3 | 16/11 | 16/11 | 0,88 |
| A-42 | A-40, A-21 | RES-05 | 3,75 | 16/11 | 18/11 | 2,14 |
| A-80 | A-01 | RES-02 | 3,75 | 16/11 | 18/11 | 2,52 |
| A-22 | A-21 | RES-01, RES-03 | 4,83 | 16/11 | 18/11 | 2,9 |
| A-13 | A-01 | RES-04 | 4,75 | 16/11 | 18/11 | 2,94 |
| A-27 | A-26 | RES-02, RES-03 | 1,5 | 17/11 | 17/11 | 0,85 |
| A-23 | A-22, A-09 | RES-02, RES-03 | 2 | 18/11 | 19/11 | 1,36 |
| A-78 | A-26 | RES-01 | 2,08 | 18/11 | 19/11 | 1,67 |
| A-43 | A-42 | RES-05 | 4,17 | 18/11 | 19/11 | 1,92 |
| A-82 | A-80, A-09 | RES-02 | 3,17 | 18/11 | 20/11 | 2,34 |
| A-60 | A-21, A-26, A-13 | RES-04, RES-01 | 7,92 | 18/11 | 24/11 | 4,41 |
| A-45 | A-43 | RES-05, RES-02 | 2 | 19/11 | 20/11 | 1,38 |
| A-28 | A-21, A-26 | RES-03 | 6 | 19/11 | 23/11 | 2,94 |
| A-63 | A-21, A-26, A-78 | RES-03, RES-04 | 7,92 | 19/11 | 25/11 | 4,68 |
| A-47 | A-26, A-42 | RES-05 | 2,25 | 20/11 | 23/11 | 1,35 |
| A-83 | A-80, A-09 | RES-02 | 3,17 | 20/11 | 25/11 | 3,83 |
| A-79 | A-21 | RES-05 | 2,08 | 23/11 | 24/11 | 1,26 |
| A-30 | A-28 | RES-02 | 4,92 | 23/11 | 25/11 | 2,17 |
| A-61 | A-60, A-28 | RES-01 | 1,5 | 24/11 | 24/11 | 0,83 |
| A-48 | A-21, A-26, A-13 | RES-05 | 7 | 24/11 | 27/11 | 3,31 |
| A-65 | A-63 | RES-03, RES-01 | 5,83 | 25/11 | 26/11 | 1,93 |
| A-66 | A-63, A-13 | RES-04 | 4,92 | 25/11 | 27/11 | 2,17 |
| A-85 | A-82, A-83 | RES-02, RES-04 | 2,5 | 25/11 | 27/11 | 2,59 |
| A-33 | A-45 | RES-03 | 2 | 26/11 | 27/11 | 1,81 |
| A-67 | A-65, A-42, A-47, A-79, A-23 | RES-01, RES-05 | 2,75 | 26/11 | 27/11 | 1,88 |
| A-49 | A-48, A-67 | RES-04 | 2 | 27/11 | 30/11 | 1,47 |
| A-68 | A-66, A-67, A-30, A-45 | RES-05, RES-02 | 3,17 | 27/11 | 30/11 | 1,58 |
| A-95 | A-85, A-67 | RES-02 | 2,17 | 27/11 | 30/11 | 1,65 |
| A-31 | A-30 | RES-05 | 2 | 30/11 | 01/12 | 1,45 |
| A-90 | A-68 | RES-01 | 3,42 | 30/11 | 01/12 | 1,59 |
| A-87 | A-95, A-68, A-49, A-31, A-61 | RES-02, RES-04 | 4,47 | 01/12 | 01/12 | 0,97 |
| A-88 | A-87, A-33 | RES-01, RES-05 | 2,83 | 01/12 | 02/12 | 1,26 |
| A-92 | A-90, A-87 | RES-03, RES-02 | 5,83 | 01/12 | 02/12 | 1,99 |
| A-89 | A-88 | RES-04, RES-03 | 3,17 | 02/12 | 03/12 | 1,24 |
| A-16 | — | RES-01 | 2 | W9 | W10 | định kỳ |
| A-94 | — | RES-01 | 2 | W9 | W12 | định kỳ |
| A-97 | — | RES-01, RES-02, RES-03, RES-04, RES-05 | 7,5 | W9 | W11 | định kỳ |
| A-91 | — | RES-01, RES-02, RES-03, RES-04, RES-05 | 2,5 | W12 | W12 | định kỳ |
| A-99 | — | RES-01 | 3 | W10 | W11 | định kỳ |

### 2.11.2 Mốc và điều kiện nghiệm thu

| Mốc | Ngày dự kiến | Điều kiện vào | Phê duyệt / minh chứng |
|---|---|---|---|
| M-01 Baseline V1.0 nộp và gửi khách hàng duyệt | 09/11 | Báo cáo M2 hoàn tất | Email gửi khách hàng (Q19) |
| M-02 Kết thúc increment 1 | 24/11 | A-45, A-61, A-28 | Video demo qua email (Q23) |
| M-03 Kết thúc increment 2 | 30/11 | A-68, A-49 | Video demo qua email (Q23) |
| M-04 Nghiệm thu | 02/12 | A-88 | Video demo qua email (Q23) |
| M-05 Nộp báo cáo cuối kỳ | 07/12 | A-92, A-89 | Nộp LMS |

### 2.11.3 Ràng buộc lịch

| Hạng mục | Quy định |
|---|---|
| Mốc cố định | 09/11 nộp M2; 07/12 nộp báo cáo cuối kỳ (LMS) |
| Lịch làm việc | 8 giờ/người ở W9; 12 giờ/người/tuần ở W10-W12; thứ Hai đến thứ Sáu |
| Vùng đệm lịch | Lịch kết thúc 03/12; 1,8 ngày làm việc (03/12 chiều - 04/12) là vùng đệm, PM sở hữu. Tách biệt với dự phòng làm lại 11,5 giờ |
| File lịch | `docs/m2-report/data/plan.mjs` (dữ liệu) và `docs/m2-report/scripts/schedule.mjs` (tính toán) trong repo |

### 2.11.4 Biểu đồ Gantt

> 📐 **SƠ ĐỒ CẦN REVIEW:** `diagrams/04-gantt.drawio` (xuất ảnh: `diagrams/04-gantt.png`)
> Kiểm tra: thanh ngày khớp bảng 2.11.1; hoạt động găng tô đỏ; mốc ◆ đúng ngày.

Bảng theo tuần (■ = có làm trong tuần, ▒ = việc định kỳ, ◆ = mốc):

| A-ID / hoạt động | W9 (09/11) | W10 (16/11) | W11 (23/11) | W12 (30/11) |
|---|---|---|---|---|
| A-40 Xây dựng cấu hình, bộ sinh dữ liệu giả và bộ sinh sự kiện | ■ |  |  |  |
| A-24 Thiết kế ERD và từ điển dữ liệu | ■ găng |  |  |  |
| A-20 Chọn công nghệ và thiết kế kiến trúc tổng thể | ■ |  |  |  |
| A-01 Viết SRS v1.0 phạm vi Must | ■ | ■ |  |  |
| A-16 Gửi câu hỏi vòng 3 và cập nhật Client Interaction Log | ▒ | ▒ |  |  |
| A-97 Họp tiến độ hằng tuần | ▒ | ▒ | ▒ |  |
| A-94 Ghi nhật ký dự án hằng tuần | ▒ | ▒ | ▒ | ▒ |
| A-26 Viết và kiểm thử script lược đồ, dữ liệu mẫu, script lưu giữ | ■ găng | ■ găng |  |  |
| A-21 Thiết kế quy ước API và hợp đồng sự kiện vào/ra | ■ | ■ |  |  |
| A-09 Review SRS |  | ■ |  |  |
| A-42 Xây dựng bộ gửi sự kiện và nhật ký chạy |  | ■ |  |  |
| A-80 Viết kế hoạch kiểm thử |  | ■ |  |  |
| A-22 Đặc tả API mô-đun cốt lõi |  | ■ |  |  |
| A-13 Thiết kế giao diện luồng cốt lõi |  | ■ |  |  |
| A-99 Phân tích tác động sự kiện thay đổi và cập nhật baseline |  | ▒ | ▒ |  |
| A-27 Review thiết kế CSDL |  | ■ |  |  |
| A-23 Review kiến trúc và API |  | ■ |  |  |
| A-78 Thử nghiệm xử lý đồng thời cập nhật chỗ trống |  | ■ găng |  |  |
| A-43 Xây dựng kịch bản mô phỏng và README |  | ■ |  |  |
| A-82 Viết kịch bản nghiệm thu chính AT-01 đến AT-04 |  | ■ |  |  |
| A-60 Xây dựng mô-đun quản lý thông tin bãi |  | ■ | ■ |  |
| A-45 Kiểm thử và review bộ mô phỏng |  | ■ |  |  |
| A-28 Xây dựng đăng ký, đăng nhập, phiên và RBAC |  | ■ | ■ |  |
| A-63 Xây dựng API sự kiện vào/ra và cập nhật chỗ trống |  | ■ găng | ■ găng |  |
| A-47 Tạo dữ liệu mô phỏng bãi thí điểm |  | ■ | ■ |  |
| A-83 Viết kịch bản nghiệm thu ngoại lệ và kịch bản 100 lượt |  | ■ | ■ |  |
| A-79 Xây dựng bộ kiểm thử hợp đồng API vào/ra |  |  | ■ |  |
| A-30 Xây dựng che biển số, nhật ký truy cập và màn hình tài khoản |  |  | ■ |  |
| A-61 Kiểm thử mô-đun quản lý thông tin bãi |  |  | ■ |  |
| A-48 Xây dựng mô-đun hiển thị tình trạng chỗ đỗ |  |  | ■ |  |
| A-65 Xây dựng xử lý 5 ngoại lệ xe vào/ra |  |  | ■ |  |
| A-66 Xây dựng màn hình ghi nhận xe vào/ra |  |  | ■ găng |  |
| A-85 Review bộ test nghiệm thu và gửi khách hàng xác nhận |  |  | ■ |  |
| A-33 Viết hướng dẫn cài đặt và chạy demo |  |  | ■ |  |
| A-67 Tích hợp mô-đun xe ra/vào với bộ mô phỏng |  |  | ■ |  |
| A-49 Kiểm thử mô-đun hiển thị chỗ trống |  |  | ■ | ■ |
| A-68 Kiểm thử mô-đun xe ra/vào |  |  | ■ găng | ■ găng |
| A-95 Chạy thử sớm AT-01, AT-02 và kịch bản 100 lượt |  |  | ■ | ■ |
| A-31 Kiểm thử mô-đun xác thực và phân quyền |  |  |  | ■ |
| A-90 Tổng hợp số liệu thực tế và so sánh với baseline |  |  |  | ■ găng |
| A-91 Họp tổng kết và ghi bài học kinh nghiệm |  |  |  | ▒ |
| A-87 Chạy thử nghiệm thu nội bộ |  |  |  | ■ |
| A-88 Trình diễn nghiệm thu với khách hàng |  |  |  | ■ |
| A-92 Viết và rà soát báo cáo quản lý dự án cuối kỳ |  |  |  | ■ găng |
| A-89 Viết báo cáo kết quả nghiệm thu |  |  |  | ■ |
| M-01 Baseline V1.0 nộp và gửi khách hàng duyệt | ◆ 09/11 |  |  |  |
| M-02 Kết thúc increment 1 |  |  | ◆ 24/11 |  |
| M-03 Kết thúc increment 2 |  |  |  | ◆ 30/11 |
| M-04 Nghiệm thu |  |  |  | ◆ 02/12 |
| M-05 Nộp báo cáo cuối kỳ |  |  |  |  |

M-05 (07/12) nằm sau W12, ngày thứ Hai sau tuần cuối.

### 2.11.5 Phân tích mạng và đường găng

> 📐 **SƠ ĐỒ CẦN REVIEW:** `diagrams/05-critical-path.drawio` (xuất ảnh: `diagrams/05-critical-path.png`)
> Kiểm tra: ES/EF/LS/LF khớp bảng dưới; đường găng tô đỏ.

| A-ID | Thời gian (ngày) | ES | EF | LS | LF | Float | Găng |
|---|---|---|---|---|---|---|---|
| A-01 | 4,01 | 0 | 4,01 | 1,6 | 5,61 | 1,6 |  |
| A-09 | 0,75 | 4,01 | 4,76 | 8,32 | 9,07 | 4,31 |  |
| A-13 | 2,38 | 4,01 | 6,38 | 5,61 | 7,99 | 1,6 |  |
| A-20 | 2,71 | 0 | 2,71 | 2,15 | 4,85 | 2,15 |  |
| A-21 | 0,79 | 2,71 | 3,5 | 4,85 | 5,65 | 2,15 |  |
| A-24 | 2,92 | 0 | 2,92 | 0 | 2,92 | 0 | ● |
| A-26 | 2,71 | 2,92 | 5,63 | 2,92 | 5,63 | 0 | ● |
| A-28 | 3 | 5,63 | 8,63 | 5,65 | 8,65 | 0,02 |  |
| A-30 | 2,46 | 8,63 | 11,08 | 8,65 | 11,1 | 0,02 |  |
| A-78 | 1,04 | 5,63 | 6,67 | 5,63 | 6,67 | 0 | ● |
| A-63 | 1,98 | 6,67 | 8,65 | 6,67 | 8,65 | 0 | ● |
| A-66 | 2,46 | 8,65 | 11,1 | 8,65 | 11,1 | 0 | ● |
| A-80 | 1,88 | 4,01 | 5,88 | 7,2 | 9,07 | 3,19 |  |
| A-82 | 1,58 | 5,88 | 7,47 | 9,07 | 10,65 | 3,19 |  |
| A-83 | 1,58 | 5,88 | 7,47 | 9,07 | 10,65 | 3,19 |  |
| A-85 | 0,75 | 7,47 | 8,22 | 10,65 | 11,4 | 3,19 |  |
| A-65 | 1,46 | 8,65 | 10,1 | 8,96 | 10,42 | 0,31 |  |
| A-40 | 2,38 | 0 | 2,38 | 4,27 | 6,65 | 4,27 |  |
| A-42 | 1,88 | 3,5 | 5,38 | 6,65 | 8,52 | 3,15 |  |
| A-47 | 1,13 | 5,63 | 6,75 | 9,29 | 10,42 | 3,67 |  |
| A-79 | 1,04 | 3,5 | 4,54 | 9,38 | 10,42 | 5,88 |  |
| A-22 | 1,21 | 3,5 | 4,71 | 8,71 | 9,92 | 5,21 |  |
| A-23 | 0,5 | 4,76 | 5,26 | 9,92 | 10,42 | 5,16 |  |
| A-67 | 0,69 | 10,1 | 10,79 | 10,42 | 11,1 | 0,31 |  |
| A-95 | 1,08 | 10,79 | 11,88 | 11,4 | 12,49 | 0,61 |  |
| A-43 | 2,08 | 5,38 | 7,46 | 8,52 | 10,6 | 3,15 |  |
| A-45 | 0,5 | 7,46 | 7,96 | 10,6 | 11,1 | 3,15 |  |
| A-68 | 0,79 | 11,1 | 11,9 | 11,1 | 11,9 | 0 | ● |
| A-48 | 3,5 | 6,38 | 9,88 | 7,99 | 11,49 | 1,6 |  |
| A-49 | 1 | 10,79 | 11,79 | 11,49 | 12,49 | 0,7 |  |
| A-31 | 1 | 11,08 | 12,08 | 11,49 | 12,49 | 0,4 |  |
| A-60 | 1,98 | 6,38 | 8,36 | 9,76 | 11,74 | 3,38 |  |
| A-61 | 0,75 | 8,63 | 9,38 | 11,74 | 12,49 | 3,11 |  |
| A-87 | 1,12 | 12,08 | 13,2 | 12,49 | 13,6 | 0,4 |  |
| A-33 | 1 | 7,96 | 8,96 | 12,85 | 13,85 | 4,9 |  |
| A-88 | 0,71 | 13,2 | 13,91 | 13,85 | 14,56 | 0,65 |  |
| A-89 | 0,79 | 13,91 | 14,7 | 14,56 | 15,35 | 0,65 |  |
| A-27 | 0,5 | 5,63 | 6,13 | 14,85 | 15,35 | 9,23 |  |
| A-90 | 1,71 | 11,9 | 13,6 | 11,9 | 13,6 | 0 | ● |
| A-92 | 1,75 | 13,6 | 15,35 | 13,6 | 15,35 | 0 | ● |

| Hạng mục | Kết quả |
|---|---|
| Kỹ thuật | CPM (forward/backward pass) trên mạng lý tưởng, thời gian = effort ÷ (2 giờ/ngày × số người), không giới hạn nguồn lực |
| Đường găng lý tưởng | A-24 → A-26 → A-78 → A-63 → A-66 → A-68 → A-90 → A-92, dài 15,35 ngày làm việc |
| Ảnh hưởng của cân bằng nguồn lực | Lịch thực tế dài 18,24 ngày vì cả nhóm kín việc ở W9-W11. Trì hoãn do nguồn lực chủ yếu ở các hoạt động có float như A-83, A-48, A-85; đường găng logic giữ nguyên |

### 2.11.6 Mô hình chi phí và chi phí baseline

| Hạng mục | Quy định |
|---|---|
| Tiền tệ / cơ sở | VNĐ; nhân công quy đổi theo đơn giá nội bộ, không phải tiền mặt |
| Đơn giá | 50.000 VNĐ/người-giờ cho mọi thành viên (giống M1 1.3.3) |
| Bao gồm / loại trừ | Bao gồm effort W9-W12 và dự phòng làm lại. Loại trừ: công sức W1-W8 (M1, M2), phần cứng (mô phỏng theo AS1), hosting và công cụ (miễn phí theo CN5) |

| Hạng mục chi phí | Khối lượng | Đơn giá | Chi phí | Căn cứ |
|---|---|---|---|---|
| Nhân công: hoạt động cơ sở (trừ ứng phó rủi ro) | 172,38 người-giờ | 50.000 | 8.619.167 | 2.6 |
| Nhân công: hoạt động ứng phó rủi ro A-78, A-79, A-95 | 6,33 người-giờ | 50.000 | 316.667 | 2.9.1 |
| Công cụ và hosting | Git, Google Docs/Sheets, môi trường demo miễn phí | 0 | 0 | CN5 |
| Phần cứng | Mô phỏng (P04) | 0 | 0 | AS1 |
| Dự phòng làm lại | 11,5 người-giờ | 50.000 | 575.000 | 2.9.2, không tính trùng |
| **Tổng chi phí baseline** | | | **9.510.833 VNĐ** | Tại 09/11/2026 |

So với M1: M1 tạm tính 600 người-giờ (30.000.000 VNĐ) cho toàn bộ phạm vi và toàn dự án. Baseline V1.0 chỉ tính phần còn lại W9-W12 với phạm vi Must, nên nhỏ hơn nhiều. Phần hoãn được ước lượng lại khi lập Baseline V2.0.

### 2.11.7 Tổng hợp và đối chiếu baseline

| Chỉ số | Giá trị |
|---|---|
| Tổng effort cơ sở (người-giờ) | 178,72 |
| Trong đó hoạt động ứng phó rủi ro | 6,33 |
| Dự phòng làm lại (Σ phơi nhiễm còn lại) | 11,5 |
| Tổng effort baseline | 190,22 |
| Năng lực W9-W12 | 220 |
| Mức sử dụng năng lực | 86,46% |
| Đường găng (mạng lý tưởng) | A-24 → A-26 → A-78 → A-63 → A-66 → A-68 → A-90 → A-92 = 15,35 ngày |
| Kết thúc theo lịch đã cân bằng nguồn lực | 03/12 (ngày làm việc thứ 18,24 / 20) |
| Chi phí nhân công quy đổi (cơ sở) | 8.935.833 VNĐ |
| Chi phí dự phòng | 575.000 VNĐ |
| Tổng chi phí baseline | 9.510.833 VNĐ |

## 2.12 Bảo đảm chất lượng và phê duyệt baseline

### 2.12.1 Kế hoạch chất lượng và kiểm chứng

| Sản phẩm / yêu cầu | Tiêu chí | Phương pháp QA / QC | Người chịu trách nhiệm | Minh chứng / CP |
|---|---|---|---|---|
| P02 SRS | 7 tiêu chí PD-P02 | Review tài liệu | Nguyễn Tuấn Thành, Nguyễn Võ Đức Sơn | Biên bản / CP-01 |
| P18 Kiến trúc và API | Hợp đồng vào/ra đóng băng; mỗi FR Must có endpoint | Review, bộ kiểm thử hợp đồng A-79 | Đào Xuân Sơn | CP-02 |
| P03 Thiết kế CSDL | T-DB1 đến T-DB10 | Chạy script, ca vi phạm ràng buộc, review | Đào Xuân Sơn | Quality Evidence / CP-03 |
| P04 Bộ mô phỏng | 10 tiêu chí PD-P04 | Chạy kịch bản, so sánh nhật ký | Đào Xuân Sơn | CP-04 |
| P07 Xác thực, P08 Thông tin bãi | Ma trận quyền 3 vai trò; CRUD bãi | Kiểm thử A-31, A-61 | Nguyễn Tuấn Thành, Nguyễn Võ Đức Sơn | Quality Evidence / M-02 |
| P05 Xe ra/vào, P09 Chỗ trống | T05-T13; chỗ trống khớp số đếm tay | Kiểm thử A-68, A-49 trên bộ mô phỏng | Đào Xuân Sơn, Phạm Duy Quý | CP-05 |
| P21 Bộ test nghiệm thu | 9 tiêu chí PD-P21 | Review, khách hàng xác nhận | Phạm Duy Quý, khách hàng | CP-06 |
| Toàn hệ thống | 100% AT Must đạt | Dry run, trình diễn | Đào Xuân Sơn, khách hàng | CP-07, CP-08 |
| Baseline (P01) | ID, tổng giờ, ngày, chi phí đối chiếu được | Script kiểm tra chéo; review nội bộ | PM, QA | 2.13.1 |

### 2.12.2 Rà soát chất lượng kế hoạch

- [x] Phạm vi và mục tiêu M1 được giữ; phần hoãn (P06, P10, P11, P12) có lý do (Q22, năng lực) và chờ khách hàng chấp thuận.
- [x] PBS → PD → PFD → hoạt động → ước lượng → rủi ro → nguồn lực → lịch → kiểm chứng truy vết được (2.13).
- [x] Ngày bắt đầu/kết thúc khả thi với năng lực đã cam kết và phụ thuộc (lịch kết thúc 03/12).
- [x] Rủi ro có người phụ trách, biện pháp giảm và dự phòng; ứng phó nằm trong kế hoạch.
- [x] Effort và chi phí khớp tổng hoạt động; giờ checkpoint và kiểm thử không bị bỏ sót.

### 2.12.3 Vấn đề còn mở

| ID | Việc cần làm / quyết định | Người phụ trách | Hạn | Minh chứng đóng |
|---|---|---|---|---|
| ISS-01 | Gửi câu hỏi vòng 3 (R3-Q1, Q4, Q5, Q6, Q8) | Nguyễn Võ Đức Sơn | 10/11 | Email, Client Interaction Log |
| ISS-02 | Khách hàng chấp thuận phạm vi Baseline V1.0 (hoãn P06, P10, P11, P12) và Baseline V1.0 | Nguyễn Võ Đức Sơn | 16/11 | Email phản hồi |
| ISS-03 | Cả nhóm xác nhận cam kết 12 giờ/tuần ở W10-W12 | Nguyễn Võ Đức Sơn | 09/11 | Biên bản họp chốt baseline |
| ISS-04 | Ghi các ID mới (ENT, SC, AT, T, CP, RES, R-G) vào ID Registry | Đào Xuân Sơn | 11/11 | Workbook |

## 2.12.4 Tuyên bố Project Baseline V1.0

| Hạng mục | Nội dung |
|---|---|
| Mã baseline | Project Baseline V1.0 |
| Dự án / phạm vi | Hệ thống quản lý bãi đỗ xe thông minh; phạm vi Must theo M1 1.4.1 và 2.0.2 |
| Ngày đóng băng | 09/11/2026 |
| Lưu trữ | Báo cáo này (PDF) và tag `baseline-v1.0` trong repository (dữ liệu kế hoạch và script lập lịch) |
| Thành phần | PBS, 5 PD, PFD, mạng hoạt động, checkpoint, ước lượng, sổ rủi ro, phân bổ nguồn lực, lịch Gantt, đường găng, chi phí, kế hoạch chất lượng, truy vết |
| Ngoại lệ / giả định | Phê duyệt của khách hàng đang chờ (2.12.5); câu hỏi vòng 3 theo AS20; hạng mục hoãn theo Q22 |
| Kiểm soát thay đổi | Mọi thay đổi sau V1.0 qua CR trong Change Log, có phân tích ảnh hưởng tới phạm vi, công sức, lịch, chi phí, rủi ro và chất lượng. PM xem xét, khách hàng phê duyệt (M1 1.7.1). Thay đổi được duyệt tạo Baseline V2.0; V1.0 giữ nguyên để so sánh |

### 2.12.5 Thống nhất của nhóm và khách hàng

| Người phê duyệt | Vai trò | Quyết định | Ngày / minh chứng |
|---|---|---|---|
| Nguyễn Võ Đức Sơn | PM | [Chờ họp chốt] | [Biên bản họp 09/11] |
| Đào Xuân Sơn | QA | [Chờ họp chốt] | [Biên bản họp 09/11] |
| Nguyễn Phạm Mạnh Dũng, Phạm Duy Quý, Nguyễn Tuấn Thành | Thành viên | [Chờ họp chốt] | [Biên bản họp 09/11] |
| Thầy Nguyễn Minh Tâm | Khách hàng / nhà tài trợ | Chờ phản hồi | Email gửi 09/11; chưa có phản hồi tại thời điểm nộp |

Nhóm không ghi phê duyệt của khách hàng khi chưa nhận được. Khi có email phản hồi, PM cập nhật bảng này và Client Interaction Log; nếu khách hàng yêu cầu thay đổi, xử lý bằng CR.

### 2.12.6 Nội dung V1.0 cố định để so sánh

| Hạng mục | Giá trị cố định |
|---|---|
| Phạm vi | Nhóm Must (P05, P07, P08, P09) và các sản phẩm hỗ trợ trong 2.1.2; P06, P10, P11, P12 hoãn |
| Effort / chi phí | 178,72 người-giờ cơ sở + 11,5 giờ dự phòng; 9.510.833 VNĐ quy đổi |
| Lịch | 09/11 → 03/12; mốc M-01 đến M-05; Gantt và phụ thuộc ở 2.11 |
| Rủi ro / chất lượng | Sổ rủi ro 2.8.2; hoạt động ứng phó 2.9.1; checkpoint CP-01 đến CP-08; tiêu chí trong 5 PD |

## 2.13 Truy vết và nhất quán

| Mục tiêu | Sản phẩm | Hoạt động | Nguồn lực | Rủi ro | Kiểm chứng | Checkpoint |
|---|---|---|---|---|---|---|
| O1 Biết trước chỗ trống | P09, P05, P03 | A-66, A-24, A-26, A-27, A-48, A-79, A-68, A-78, A-63, A-65, A-67, A-49 | RES-01, RES-02, RES-03, RES-04, RES-05 | R-G2-01, R-G2-02, R-G2-03, R-G3-01, R-G3-02, R-G4-01 | T05, T-DB6, AT-01, AT-02 | CP-05 |
| O2 Số hóa quy trình vào/ra | P05, P04, P22 | A-66, A-40, A-42, A-43, A-45, A-47, A-79, A-68, A-78, A-63, A-65, A-67 | RES-01, RES-02, RES-03, RES-04, RES-05 | R-G2-02, R-G2-03, R-G3-01, R-G3-02, R-G4-01 | T11, AT-100 | CP-05, CP-07 |
| O3 Theo dõi nhu cầu sử dụng | P09 | A-48, A-49 | RES-04, RES-05 | R-G2-01 | AT-01 | CP-05 |
| O4 Xử lý ngoại lệ nhất quán | P05, P21 | A-66, A-79, A-68, A-78, A-63, A-65, A-67, A-82, A-83, A-85, A-95, A-87 | RES-01, RES-02, RES-03, RES-04, RES-05 | R-G2-02, R-G2-03, R-G3-01, R-G3-02, R-G4-01, R-G5-01, R-G5-02, R-G5-03 | AT-EX01, AT-EX02, AT-EX03, AT-EX04, AT-EX05 | CP-06, CP-08 |
| O5 Bàn giao đạt nghiệm thu | P14, P21, P07, P08 | A-30, A-89, A-28, A-61, A-60, A-31, A-82, A-83, A-85, A-95, A-87, A-88 | RES-01, RES-02, RES-03, RES-04, RES-05 | R-G2-03, R-G3-02, R-G5-01, R-G5-02, R-G5-03 | AT-03, AT-04 | CP-07, CP-08 |

O3 chỉ được đo một phần (công suất theo khu vực qua P09) vì báo cáo (P11) và đặt chỗ (P06) hoãn theo Q22. Thước đo độ chính xác tính phí của O4 hoãn cùng P10. Hai điểm này được nêu trong email xin duyệt Baseline.

### 2.13.1 Kiểm tra đối chiếu chéo

| Kiểm tra | Kết quả | Minh chứng |
|---|---|---|
| Mỗi O có sản phẩm và test | Đạt; O3, O4 có ghi chú phần hoãn | Bảng 2.13 |
| Mỗi P đang lập kế hoạch có hoạt động | Đạt (P24 nằm trong P01 và workbook) | Script kiểm tra |
| Mỗi A có ước lượng, người phụ trách, phụ thuộc, ngày | Đạt | 2.4.1, 2.6, 2.11.1 |
| Mỗi R có người phụ trách, ứng phó, ảnh hưởng định lượng | Đạt | 2.8.2, 2.8.3 |
| Mỗi checkpoint có người review / phê duyệt | Đạt | 2.5 |
| Tổng effort, tải nguồn lực và chi phí khớp nhau | Đạt: 178,72 giờ = Σ hoạt động = Σ tải 5 người | 2.10.4, 2.11.7 |

## 2.14 Danh mục hoàn thành Milestone 2

| Nhiệm vụ | Hạng mục | Trạng thái |
|---|---|---|
| 2.1 | PBS, phân biệt sản phẩm bàn giao và trung gian | ✓ 2.1 |
| 2.2 | 5 PD đủ định danh, mô tả, nguồn gốc, thành phần, định dạng, tiêu chuẩn, tiêu chí chất lượng | ✓ 2.2 |
| 2.3 | PFD và phụ thuộc theo thể hiện sản phẩm | ✓ 2.3 |
| 2.4 | Hoạt động suy ra từ sản phẩm và mạng hoạt động lý tưởng | ✓ 2.4 |
| 2.5 | Checkpoint, người review / phê duyệt, đường xử lý khi không đạt | ✓ 2.5 |
| 2.6 | Ước lượng từ dưới lên, giả định, effort và thời gian trôi qua | ✓ 2.6 |
| 2.7 | Tách / gộp hoạt động và bảng chuyển đổi | ✓ 2.7 |
| 2.8 | Rủi ro định lượng, người phụ trách, giảm thiểu, dự phòng | ✓ 2.8 |
| 2.9 | Hoạt động ứng phó rủi ro và ước lượng lại | ✓ 2.9 |
| 2.10 | Năng lực thực tế, phân bổ, giải quyết xung đột, lịch khả thi | ✓ 2.10 |
| 2.11 | Ngày kế hoạch, phụ thuộc, Gantt, mốc, chi phí, đường găng | ✓ 2.11 |
| 2.12 | Kế hoạch chất lượng, rà soát kế hoạch, thống nhất, Baseline V1.0 | ✓ nội bộ; chờ khách hàng (2.12.5) |
| Xuyên suốt | Truy vết mục tiêu / sản phẩm / hoạt động / nguồn lực / rủi ro / test / checkpoint | ✓ 2.13 |
