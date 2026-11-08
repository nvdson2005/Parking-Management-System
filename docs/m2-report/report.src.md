# CO3011 - QUẢN LÝ DỰ ÁN PHẦN MỀM

## Báo cáo Milestone 2: Lập kế hoạch theo sản phẩm và Project Baseline V1.0

### Hệ thống quản lý bãi đỗ xe thông minh (Smart Parking Management System)

| Thông tin | Chi tiết |
|---|---|
| Nhóm | 11 |
| Thành viên | Đào Xuân Sơn - 2312954; Nguyễn Phạm Mạnh Dũng - 2310559; Nguyễn Tuấn Thành - 2313132; Nguyễn Võ Đức Sơn - 2312974; Phạm Duy Quý - 2312900 |
| Khách hàng / nhà tài trợ | Thầy Nguyễn Minh Tâm (đại diện nhà trường) |
| Quản lý dự án | Nguyễn Võ Đức Sơn |
| Mốc lập kế hoạch (planning cut-off) | 09/11/2026, tuần 12 (hạn nộp Milestone 2) |
| Năm học | 2026-2027 |
| Trạng thái tài liệu | v1.0 - Project Baseline V1.0 (đóng băng 09/11/2026; chờ khách hàng duyệt) |

<!-- REVIEW-INDEX-START -->
## Danh mục cần review (xóa trước khi xuất bản DOCX)

| # | Mục | Nội dung cần review | Loại |
|---|---|---|---|
| 1 | 2.1.1 | `diagrams/01-pbs.drawio`: đủ P00-P24, nhánh PG-1 đến PG-4 | Sơ đồ |
| 2 | 2.3 | `diagrams/02-pfd.drawio`: mũi tên khớp bảng 2.3.1, không có chu trình | Sơ đồ |
| 3 | 2.4.2 | `diagrams/03-activity-network.drawio`: mạng khớp cột "Hoạt động trước" của 2.4.1 | Sơ đồ |
| 4 | 2.11.4 | `diagrams/04-gantt.drawio`: lịch khớp bảng 2.11.1 | Sơ đồ |
| 5 | 2.11.5 | `diagrams/05-critical-path.drawio`: đường găng A-22 → A-23 → A-44 → A-45 → A-67 → A-68 → A-90 → A-92 | Sơ đồ |
| 6 | 2.8.1 | `diagrams/06-risk-matrix.drawio`: vị trí R-ID trên ma trận L × I | Sơ đồ |
| 7 | 2.0.5 | Effort thực tế của MVP chưa ghi trong Task Log; nhóm điền khi có số liệu | Chờ số liệu |
| 8 | 2.10.1 | Nhóm xác nhận cam kết 8 giờ ở W12 và 10 giờ/tuần ở W13-W15 | Quyết định |
| 9 | 2.12.5 | Phê duyệt của khách hàng đang ở trạng thái chờ; cập nhật khi có email | Chờ khách hàng |
<!-- REVIEW-INDEX-END -->

## Kiểm soát tài liệu

| Phiên bản | Ngày | Người thực hiện | Mục thay đổi | Tóm tắt thay đổi |
|---|---|---|---|---|
| v0.1 | 31/10/2026 | Các chủ PD | 2.2, 2.6, 2.8 | Bản nháp PD-P02, P03, P04, P05, P21; ước lượng và rủi ro theo nhóm |
| v0.2 | 08/11/2026 | Nguyễn Võ Đức Sơn | Toàn bộ | Hợp nhất bản nháp; thống nhất ID; bổ sung 2.5, 2.10-2.14; lập lịch theo nguồn lực cho kế hoạch xây dựng từ đầu |
| 1.0 | 09/11/2026 | Nguyễn Võ Đức Sơn | Toàn bộ | Ghi nhận MVP đã xây dựng (2.0.5); lập lại kế hoạch W12-W15 cho phần việc còn lại; đưa P06, P10, P11 trở lại phạm vi; dùng số tuần theo lịch học kỳ; đóng băng Project Baseline V1.0 và gửi khách hàng duyệt |

### Vai trò thành viên ở Milestone 2

| Thành viên | MSSV | Vai trò dự án | Nhóm sản phẩm phụ trách | Mã nguồn lực |
|---|---|---|---|---|
| Nguyễn Võ Đức Sơn | 2312974 | Quản lý dự án (PM), Trưởng nhóm kỹ thuật | Kiến trúc và API (P18), xe ra/vào (P05), thanh toán (P10), báo cáo cuối kỳ | RES-01 |
| Đào Xuân Sơn | 2312954 | Phân tích nghiệp vụ (BA), Phụ trách chất lượng (QA) | Kế hoạch kiểm thử, bộ test nghiệm thu (P20, P21) | RES-02 |
| Nguyễn Phạm Mạnh Dũng | 2310559 | Kiến trúc và dữ liệu | Thiết kế CSDL (P03), xác thực và phân quyền (P07), hướng dẫn cài đặt (P13) | RES-03 |
| Phạm Duy Quý | 2312900 | Yêu cầu và giao diện | SRS (P02), thiết kế giao diện (P19), đặt chỗ (P06), báo cáo nghiệm thu (P14) | RES-04 |
| Nguyễn Tuấn Thành | 2313132 | Mô phỏng và giám sát | Bộ mô phỏng (P04), dữ liệu mô phỏng (P22), hiển thị chỗ trống (P09), báo cáo (P11) | RES-05 |

Thay đổi so với M1 mục 1.5: vai trò Phụ trách chất lượng chuyển từ Nguyễn Võ Đức Sơn sang Đào Xuân Sơn. Lý do: ở M1, một người giữ cả ba vai trò PM, Trưởng nhóm kỹ thuật và QA nên phải review gần như mọi checkpoint. Khi lập lịch theo nguồn lực (2.10), người này trở thành điểm nghẽn. Tách QA cũng bảo đảm người review khác người viết.

### Khai báo sử dụng AI tạo sinh

| Công cụ AI | Mục đích sử dụng | Mục bị ảnh hưởng | Cách kiểm chứng / điều chỉnh đầu ra |
|---|---|---|---|
| Claude | Rà soát mâu thuẫn giữa các bản nháp PD, ước lượng và rủi ro; đối chiếu với Client Interaction Log và báo cáo M1 | 2.2, 2.6, 2.8 | Nhóm quyết định từng điểm sửa; mọi số liệu nghiệp vụ lấy từ câu trả lời của khách hàng (Q01-Q26) |
| Claude | Hỗ trợ lập trình MVP và bản nháp tài liệu P02, P03, P18, P20 từ đặc tả thiết kế | 2.0.5, 2.2 | Nhóm duyệt đặc tả (D-01 đến D-41) trước khi lập trình; kiểm thử tự động và kiểm thử thủ công theo hướng dẫn E2E |
| Claude | Viết script tính đường găng và cân bằng nguồn lực từ dữ liệu kế hoạch | 2.4, 2.10, 2.11 | PM kiểm tra kết quả với bảng hoạt động; các quyết định phạm vi và giờ làm do nhóm chọn |

### Ký hiệu viết tắt

| Ký hiệu | Ý nghĩa |
|---|---|
| P / PG | Sản phẩm / nhóm sản phẩm trong PBS |
| PD | Mô tả sản phẩm (Product Description) |
| A | Hoạt động (activity) |
| C | Công việc đã hoàn thành trước mốc lập kế hoạch |
| CP | Checkpoint (cổng review / phê duyệt) |
| M | Mốc (milestone) |
| R | Rủi ro mức hoạt động; R-Gn là rủi ro của nhóm sản phẩm n |
| RES | Nguồn lực (thành viên) |
| KB | Khác biệt giữa đặc tả và mã nguồn, phát hiện khi review thiết kế (P18 mục 10) |
| T, AT, AT-EX | Test; kịch bản nghiệm thu chính; kịch bản nghiệm thu ngoại lệ |
| EX | Ngoại lệ trong ma trận ngoại lệ của SRS |
| O, Q, AS, CN, D | Mục tiêu, câu hỏi khách hàng, giả định, ràng buộc (kế thừa M1); quyết định thiết kế |
| W | Tuần theo lịch học kỳ của trường (tuần 1 bắt đầu 24/08/2026) |
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
| Đặt chỗ trước | Giữ chỗ tối đa 30 phút sau giờ hẹn; quá hạn tự hủy và tính là không đến; được hủy trước giờ hẹn; tính trong sức chứa chung | Q15 |
| Phí gửi xe | Theo lượt, đơn giá cấu hình theo loại xe và nhóm người dùng. Không có phí theo giờ, vé tháng | Q16; M1 1.4.1, 1.4.2 |
| Báo cáo | 4 chỉ số: tỷ lệ sử dụng theo giờ, giờ cao điểm, doanh thu, tỷ lệ không đến | Q20 |
| Vai trò | Customer, Staff, Manager; chức năng quản trị chỉ Manager truy cập | Q07, Q25 (AS5) |
| Lưu giữ biển số | 12 tháng, sau đó xóa | Q18 (AS6) |
| Quy mô bãi thí điểm | 3 khu vực, khoảng 300 chỗ xe máy và 30 chỗ ô tô | Q24 (AS14) |
| Phê duyệt và demo | Qua email, không có thời gian phản hồi cố định; demo gửi qua email | Q19, Q23 |
| Thứ tự lùi phạm vi | Báo cáo, sau đó thanh toán mô phỏng, sau đó đặt chỗ trước | Q22 |

**Phạm vi của Baseline V1.0.** Baseline V1.0 gồm toàn bộ hạng mục ở M1 1.4.1 (Must, Should, Could): nền tảng và RBAC, quản lý xe vào/ra, theo dõi chỗ đỗ, thông tin bãi, bảo mật dữ liệu, đặt chỗ trước (P06), thanh toán mô phỏng (P10) và báo cáo (P11). Các mô-đun này đã có trong MVP (2.0.5), nên phần việc còn lại là kiểm chứng, sửa theo review, kiểm thử và nghiệm thu, vừa với năng lực W12-W15 (2.10). Hướng dẫn sử dụng riêng (P12) hoãn và thay bằng phần hướng dẫn thao tác trong P13. Thứ tự lùi Q22 được giữ làm phương án dự phòng nếu lịch trễ (CP-07, R-G4-02).

### 2.0.3 Giả định và ràng buộc lập kế hoạch

Mã AS1-AS15 kế thừa M1 và các bản nháp PD. Các giả định mới đánh tiếp từ AS16.

| ID | Giả định / ràng buộc | Nguồn hoặc cách kiểm chứng | Ảnh hưởng tới kế hoạch |
|---|---|---|---|
| AS16 | Lịch dự án 14/09/2026 (W4) đến 07/12/2026 (W16); cả nhóm nghỉ tuần 12/10 (W8); Baseline V1.0 bắt đầu 09/11 (W12) | Lịch học kỳ của trường | Cửa sổ thực hiện còn W12-W15, 20 ngày làm việc |
| AS17 | Mỗi thành viên làm 8 giờ ở W12 và 10 giờ/tuần ở W13-W15, 5 ngày làm việc mỗi tuần | Nhóm cam kết tại buổi chốt baseline (2.10) | Năng lực 190 người-giờ; theo dõi bằng R-G4-02 |
| AS18 | Dùng công cụ và dịch vụ miễn phí (Git, Google Docs/Sheets, demo chạy cục bộ) | CN5, D-16 | Chi phí tiền mặt bằng 0 |
| AS19 | Khách hàng trả lời câu hỏi vòng 3 và duyệt Baseline qua email trong khoảng 1 tuần; nếu chưa trả lời, nhóm tiếp tục theo giả định đã ghi | Q19, CN3 | Rủi ro R-G1-01, R-G5-03 |
| AS20 | Đến mốc lập kế hoạch, nhóm mới gửi câu hỏi vòng 1 và vòng 2. Các điểm dưới đây chưa hỏi khách hàng và được giữ theo giả định của nhóm (đã áp dụng trong MVP), dự kiến gửi ở vòng 3 (A-16): nhiều xe mỗi tài khoản, biển số duy nhất (R3-Q1); nhóm người dùng tự chọn, xe vãng lai tính mức Khách (R3-Q2); quy tắc đặt chỗ chi tiết (R3-Q3); bãi tạm ngưng vẫn cho xe ra (R3-Q4); mất mã QR/thẻ thì tra theo biển số, không phạt (R3-Q5); quá 12 tháng thì che biển số trên lượt gửi, giữ số liệu (R3-Q6); công thức 4 chỉ số báo cáo (R3-Q7); giao diện song ngữ có nút chuyển (R3-Q8); Staff xác nhận thanh toán khi xe ra (R3-Q9) | Danh sách câu hỏi dự kiến cho vòng 3 | Nếu khách hàng trả lời khác, xử lý bằng CR |
| AS21 | MVP đã xây dựng (2.0.5) là điểm xuất phát của Baseline V1.0; mọi thay đổi mã sau 09/11 đi qua pull request và gắn mã hoạt động | Git, M1 1.7.1 | Hoạt động W12-W15 là kiểm chứng và sửa, không xây dựng lại |

### 2.0.4 Lịch làm việc và đơn vị

| Hạng mục | Quy định |
|---|---|
| Bắt đầu / hạn | Baseline V1.0 bắt đầu 09/11/2026 (W12); công việc kế hoạch kết thúc trước 04/12/2026 (W15); nộp báo cáo cuối kỳ 07/12/2026 (W16) |
| Lịch làm việc | Thứ Hai đến thứ Sáu. Số tuần theo lịch học kỳ của trường (tuần 1 bắt đầu 24/08/2026): W12 = 09/11-13/11, W13 = 16/11-20/11, W14 = 23/11-27/11, W15 = 30/11-04/12 |
| Đơn vị | Effort tính bằng người-giờ; thời gian tính bằng ngày làm việc; tiền tệ VNĐ |
| Đơn giá quy đổi | 50.000 VNĐ/người-giờ, giống M1 1.3.3; là đơn giá quy ước, không phải chi phí tiền mặt |
| Câu hỏi còn mở | Chưa gửi; dự kiến gửi ở vòng 3: R3-Q1 đến R3-Q9 (phụ trách: Nguyễn Võ Đức Sơn, A-16) |

### 2.0.5 Công việc đã hoàn thành trước mốc lập kế hoạch

Trước 09/11 nhóm đã hoàn thành báo cáo M1, các vòng hỏi đáp và một MVP chạy được, gồm toàn bộ mô-đun ở M1 1.4.1. Bảng dưới ghi công việc thực tế theo lịch sử Git và tài liệu; đây là số liệu thực tế, không phải kế hoạch. Effort thực tế chưa được ghi trong Task Log ở thời điểm này; nhóm bổ sung từ Weekly Project Log khi so sánh kế hoạch với thực tế ở Milestone 3.

<!-- include: generated/completed.md -->

MVP được xây dựng từ đặc tả thiết kế đã được nhóm duyệt (41 quyết định D-01 đến D-41), có 21 file kiểm thử tự động và hướng dẫn kiểm thử E2E thủ công. Khi viết bản nháp P18, nhóm phát hiện 19 điểm khác biệt giữa đặc tả và mã nguồn (KB-01 đến KB-19, P18 mục 10). Các điểm này trở thành đầu vào của các hoạt động sửa ở W13-W14. Bộ kiểm thử tự động chưa chạy trên máy của nhóm, nên A-96 chạy lần đầu ngay đầu W12.

## 2.1 Cấu trúc phân rã sản phẩm (PBS)

### 2.1.1 Cây sản phẩm

> 📐 **SƠ ĐỒ CẦN REVIEW:** `diagrams/01-pbs.drawio` (xuất ảnh: `diagrams/01-pbs.png`)
> Kiểm tra: đủ P00-P24, bốn nhánh PG-1 đến PG-4, nhãn có mã P.

### 2.1.2 Danh mục sản phẩm

<!-- include: generated/products.md -->

### 2.1.3 Cơ sở phân loại

| Hạng mục | Giải thích |
|---|---|
| Sản phẩm bàn giao | Những gì khách hàng nhận và nghiệm thu (các mô-đun phần mềm, hướng dẫn cài đặt, báo cáo nghiệm thu) hoặc nộp theo yêu cầu học phần (Baseline, Client Interaction Log, nhật ký tuần, báo cáo cuối kỳ) |
| Sản phẩm trung gian | Tạo ra để làm sản phẩm khác và không bàn giao riêng: SRS, thiết kế kiến trúc và API, thiết kế CSDL, thiết kế giao diện, bộ mô phỏng thiết bị, dữ liệu mô phỏng, kế hoạch kiểm thử, bộ test nghiệm thu, ma trận truy vết. Bộ mô phỏng P04 là trung gian vì nó thay thế phần cứng, không phải chức năng nghiệp vụ |
| Trạng thái "Có trong MVP" | Sản phẩm đã có bản chạy được trước 09/11. Ở Baseline V1.0 sản phẩm chỉ được coi là xong khi qua kiểm thử và checkpoint tương ứng |
| Kiểm tra đầy đủ | Mọi hạng mục ở M1 1.4.1 có sản phẩm: nền tảng và bảo mật (P07), xe vào/ra (P05), trạng thái chỗ đỗ (P09), thông tin bãi (P08), đặt chỗ (P06), thanh toán mô phỏng (P10), báo cáo (P11). P23 và P01 đã hoàn thành trước mốc lập kế hoạch |

## 2.2 Mô tả sản phẩm (PD)

Nhóm viết PD cho năm sản phẩm quan trọng nhất: SRS (P02) là đầu vào của hầu hết sản phẩm khác; thiết kế CSDL (P03) quyết định độ chính xác chỗ trống (O1); bộ mô phỏng (P04) thay thế phần cứng; mô-đun xe ra/vào (P05) là chức năng cốt lõi số một; bộ test nghiệm thu (P21) là căn cứ nghiệm thu (Q11). Bản nháp của P02, P03 và kế hoạch kiểm thử P20, cùng thiết kế P18, đã có trong thư mục `products/`; hoạt động ở 2.4 hoàn thiện chúng lên v1.0.

### PD-P02. Đặc tả yêu cầu phần mềm (SRS)

| Trường | Nội dung |
|---|---|
| Định danh | P02 - Đặc tả yêu cầu phần mềm; sản phẩm trung gian; file CO3011_M2_SRS (v0.1 bản nháp, v1.0 sau CP-01) |
| Chủ sở hữu / người review | Phạm Duy Quý, đồng tác giả Đào Xuân Sơn (BA) / Nguyễn Tuấn Thành, Nguyễn Võ Đức Sơn |
| Mục tiêu liên quan | O1, O2, O3, O4, O5 |
| Mô tả và mục đích | Liệt kê yêu cầu chức năng và phi chức năng. Mỗi yêu cầu có mã, mức ưu tiên MoSCoW, nguồn (Q, AS hoặc D), mục tiêu (O) và tiêu chí chấp nhận kiểm tra được. Chứa ma trận 5 ngoại lệ. Là căn cứ cho thiết kế, kiểm thử và nghiệm thu theo Q11 |
| Sinh ra từ | P15 Client Interaction Log (Q01-Q26, AS20); P23 báo cáo M1 (phạm vi 1.4.1, 1.4.2; mục tiêu 1.4.3; ràng buộc CN1-CN5); quyết định thiết kế D-01 đến D-41 |
| Cung cấp cho | P18, P19, P03, P04 (sự kiện và ngoại lệ cần mô phỏng), P05 đến P11, P20 và P21 (mỗi yêu cầu Must có ít nhất 1 test), P24 |
| Thành phần | 1. Giới thiệu, phạm vi, thuật ngữ; 2. Vai trò Customer, Staff, Manager; 3. 36 yêu cầu chức năng FR-01 đến FR-34 (gồm FR-06a, FR-19a) theo nhóm Nền tảng, Xe, Thông tin bãi, Xe vào/ra, Chỗ trống, Đặt chỗ, Thanh toán, Báo cáo, Bảo vệ dữ liệu, Bộ mô phỏng; 4. 11 yêu cầu phi chức năng NFR-01 đến NFR-11; 5. Ma trận ngoại lệ EX-01 đến EX-05; 6. Ngoài phạm vi; 7. Giả định và câu hỏi dự kiến cho vòng 3; 8. Truy vết yêu cầu → O và sản phẩm |
| Định dạng / vị trí | Markdown trong repo, xuất DOCX; bảng 7 cột ID, Mô tả, Ưu tiên, Phạm vi, Nguồn, Mục tiêu, Tiêu chí chấp nhận; mã FR-xx, NFR-xx, EX-xx đăng ký trong ID Registry; mỗi yêu cầu một câu dạng "Hệ thống phải..." |
| Tiêu chuẩn áp dụng | ISO/IEC/IEEE 29148 (tham khảo cách viết yêu cầu); MoSCoW; quy tắc đặt tên và ID Registry (M1 1.7.1); sửa sau baseline phải có CR |
| Tiêu chí chất lượng | (1) 100% hạng mục ở M1 1.4.1 có ít nhất 1 FR; (2) mỗi yêu cầu có tiêu chí chấp nhận đo được, không dùng từ mơ hồ khi chưa có số; (3) mỗi yêu cầu có cột Nguồn và Mục tiêu không trống; (4) không có yêu cầu thuộc danh sách ngoài phạm vi; (5) mỗi EX có ít nhất 1 FR xử lý; (6) không có hai yêu cầu mâu thuẫn, số liệu khớp 2.0.2; (7) ít nhất 2 thành viên không phải tác giả review |
| Kiểm chứng / trách nhiệm | Tác giả tự kiểm 7 tiêu chí; review tại CP-01 (A-09); biên bản review lưu cùng tài liệu |

### PD-P03. Thiết kế CSDL

| Trường | Nội dung |
|---|---|
| Định danh | P03 - Thiết kế CSDL; sản phẩm trung gian; tài liệu CO3011_M2_ThietKeCSDL và thư mục `prisma/` trong repo |
| Chủ sở hữu / người review | Nguyễn Phạm Mạnh Dũng / Đào Xuân Sơn (QA) |
| Mục tiêu liên quan | O1, O2, O3, O4 |
| Mô tả và mục đích | Thực thể, thuộc tính, khóa, ràng buộc toàn vẹn, chỉ mục và cách bảo vệ dữ liệu cá nhân. Bảo đảm số chỗ trống tính ra khớp số lượt thực tế (O1), mọi lượt vào/ra có bản ghi truy vết được (O2), đủ dữ liệu cho báo cáo và tỷ lệ không đến (O3), tính phí và xử lý ngoại lệ (O4). Tách sức chứa theo loại xe (Q05); thêm bãi mới chỉ bằng dữ liệu (Q04); che biển số khi hiển thị (CN4) |
| Sinh ra từ | P02 (yêu cầu dữ liệu); P18 (loại CSDL quan hệ, SQLite); M1 (AS4-AS8, CN4) |
| Cung cấp cho | P05 đến P11 (bảng và truy vấn nền), P22 (cấu trúc dữ liệu mô phỏng), P13 (lệnh tạo CSDL), P20, P21 (dữ liệu kiểm thử) |
| Thành phần | 1. ERD; 2. 13 thực thể: users, roles, parking_lots, zones, vehicle_types, zone_capacities, tariffs, vehicles, parking_sessions, session_events, reservations, payments, access_logs (không tạo parking_slots theo Q17); 3. Từ điển dữ liệu; 4. Quy tắc toàn vẹn: mỗi xe chỉ có một lượt đang mở; chỗ trống = sức chứa − số lượt đang mở − số đặt chỗ đang chờ, tính từ dữ liệu; 5. Hỗ trợ nhiều bãi; 6. Bảo vệ dữ liệu: mật khẩu băm, nhật ký truy cập, thao tác xóa dữ liệu quá 12 tháng; 7. Chỉ mục; 8. Lược đồ, migration và dữ liệu mẫu; 9. Truy vết FR → thực thể |
| Định dạng / vị trí | Markdown trong repo, ERD dạng draw.io; `prisma/schema.prisma`, `prisma/migrations` (đánh số theo thời gian), `prisma/seed.ts`; bảng và cột tiếng Anh snake_case |
| Tiêu chuẩn áp dụng | Dạng chuẩn 3 (chỉ phi chuẩn hóa khi có lý do ghi rõ); ID Registry (ENT-xx); Git và pull request có review; sau baseline đổi lược đồ bằng migration mới; Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 |
| Tiêu chí chất lượng | T-DB1 mỗi FR lưu dữ liệu có thực thể; T-DB2 khóa chính, khóa ngoại, 3NF; T-DB3 lược đồ tạo được trên CSDL trống; T-DB4 dữ liệu vi phạm ràng buộc bị từ chối; T-DB5 không tạo được lượt mở thứ hai cho cùng xe; T-DB6 truy vấn chỗ trống khớp số đếm tay và dùng chỉ mục; T-DB7 thêm bãi thứ hai không sửa lược đồ; T-DB8 không có mật khẩu rõ, biển số đầy đủ chỉ hiển thị cho người có quyền; T-DB9 thao tác xóa dữ liệu quá hạn đúng bản ghi; T-DB10 tên và kiểu khớp P02, P05; ít nhất 2 thành viên review |
| Kiểm chứng / trách nhiệm | Tự kiểm trong A-24 (bản nháp ghi các tiêu chí chỉ đạt một phần); review tại CP-03 (A-27) |

### PD-P04. Bộ mô phỏng thiết bị

| Trường | Nội dung |
|---|---|
| Định danh | P04 - Bộ mô phỏng thiết bị; sản phẩm trung gian; trang mô phỏng của Manager và dịch vụ `src/server/services/simulator.ts` trong repo |
| Chủ sở hữu / người review | Nguyễn Tuấn Thành / Đào Xuân Sơn (QA) |
| Mục tiêu liên quan | O1, O2, O3, O4 |
| Mô tả và mục đích | Thay thế camera biển số, đầu đọc QR/RFID và barie mà khách hàng xác nhận không cần tích hợp (Q06). Sinh sự kiện xe vào/ra giả, kích hoạt từng ngoại lệ và sinh dữ liệu quá khứ cho báo cáo. Không chứa logic nghiệp vụ riêng: sự kiện đi qua cùng luồng xử lý với màn hình Staff |
| Sinh ra từ | P15 (Q06, Q17, Q24); P18 (hợp đồng sự kiện vào/ra); danh sách 5 ngoại lệ (2.0.2) |
| Cung cấp cho | P05, P06 (nguồn sự kiện để kiểm thử), P09 (biến động chỗ trống), P11 (dữ liệu quá khứ), P22, P21 (kịch bản 100 lượt và kích hoạt ngoại lệ), P13 |
| Thành phần | 1. Phát N sự kiện vào/ra ngẫu nhiên; 2. Kích hoạt EX-01 đến EX-05 (EX-02, EX-03 dựng sẵn tình huống để Staff xử lý trên màn hình xe ra); 3. Sinh dữ liệu N ngày trước, gồm đặt chỗ, thanh toán và lượt khoảng 13 tháng trước để kiểm tra xóa dữ liệu; 4. 7 kịch bản SC-01 đến SC-07 (1 luồng thường, 5 ngoại lệ, 1 tải ≥ 100 lượt) |
| Định dạng / vị trí | Mã nguồn trong repo; điều khiển qua trang `/manager/simulator`; mã SC-xx trong ID Registry |
| Tiêu chuẩn áp dụng | Quy chuẩn mã nguồn và quy tắc nhánh (M1 1.7.1); chỉ dùng biển số và thẻ giả (CN4); sửa sau baseline phải có CR |
| Tiêu chí chất lượng | (1) Sinh sự kiện vào/ra cho xe máy và ô tô theo từng phương thức; (2) một lần chạy tạo đủ ≥ 100 lượt; (3) cùng cấu hình cho kết quả tái lập được; (4) mỗi EX-01 đến EX-05 kích hoạt được; (5) đổi tham số không sửa mã; (6) sự kiện đi qua API vào/ra (FR-15); (7) dữ liệu là dữ liệu mô phỏng; (8) kết quả đủ để đối chiếu số đếm tay (O1); (9) người không phải tác giả chạy được theo P13; (10) ít nhất 2 thành viên review |
| Kiểm chứng / trách nhiệm | Rà soát A-43; sửa A-44 (gửi qua API theo KB-01, ghi nhật ký EX-05 theo KB-08, kiểm tra ≥ 100 lượt); kiểm thử và review tại CP-04 (A-45) |

### PD-P05. Mô-đun quản lý xe ra/vào

| Trường | Nội dung |
|---|---|
| Định danh | P05 - Mô-đun quản lý xe ra/vào; sản phẩm bàn giao; mã nguồn trên nhánh main |
| Chủ sở hữu / người review | Nguyễn Võ Đức Sơn, cùng Nguyễn Phạm Mạnh Dũng / Đào Xuân Sơn (QA) |
| Mục tiêu liên quan | O1, O2, O4 |
| Mô tả và mục đích | Cho nhân viên bãi ghi nhận lượt xe vào và ra, đối chiếu lượt ra với lượt vào, cập nhật số chỗ trống theo khu vực và loại xe ngay sau mỗi lượt. Mỗi lượt được lưu cho truy vết, tính phí (P10) và báo cáo (P11). Là chức năng ưu tiên số một ở Q01 |
| Sinh ra từ | P02 (yêu cầu xe vào/ra, ma trận ngoại lệ), P03, P04 và P22, P07 (vai trò Staff, Manager), P08 (khu vực, sức chứa, trạng thái bãi), P18 (hợp đồng API), P19 (màn hình) |
| Cung cấp cho | P09 (số chỗ trống sau mỗi lượt), P06 (hoàn tất đặt chỗ khi xe vào), P10 (lượt đã đóng để tính phí), P11, P14 |
| Thành phần | 1. Màn hình ghi nhận xe vào (biển số, giá trị QR hoặc mã RFID mô phỏng; loại xe; khu vực); 2. Màn hình ghi nhận xe ra; 3. API sự kiện vào/ra dùng chung cho màn hình và bộ mô phỏng; 4. Logic cập nhật chỗ trống có khóa tuần tự và giao dịch; 5. Xử lý EX-01 đến EX-05; 6. Bản ghi lượt gửi; 7. Kiểm thử tự động |
| Định dạng / vị trí | Mã nguồn trên main, giao diện web responsive, song ngữ; tài liệu API ở P18; kiểm thử trong `tests/` |
| Tiêu chuẩn áp dụng | Pull request có review (M1 1.7.1); Definition of Done; RBAC chỉ Staff và Manager (CN4); biển số đầy đủ chỉ hiển thị cho Staff và Manager (Luật 91/2025/QH15); sửa sau baseline có CR |
| Tiêu chí chất lượng | T05 sau mọi lượt, chỗ trống = sức chứa − lượt đang mở − đặt chỗ đang chờ, kể cả lượt gần như đồng thời (O1); T06 từ chối xe vào khi hết chỗ (EX-01); T07 biển số không khớp thì cảnh báo và yêu cầu xác nhận thủ công (EX-02); T08 mất QR/thẻ thì tra theo biển số và xác nhận thủ công (EX-03); T09 không mở lượt thứ hai cho cùng biển số (EX-04); T10 từ chối xe vào khi bãi tạm ngưng, vẫn cho xe ra (EX-05); T11 mỗi lượt lưu đủ trường (O2); T12 chỉ Staff và Manager thao tác được; T13 ghi nhận xe vào trong tối đa 3 thao tác và ≤ 2 giây với dữ liệu thí điểm |
| Kiểm chứng / trách nhiệm | Sửa theo review A-63 (KB-02 đến KB-05); kiểm thử A-68 trên bộ mô phỏng (kịch bản 100 lượt); kết quả tại CP-05 |

### PD-P21. Bộ test nghiệm thu

| Trường | Nội dung |
|---|---|
| Định danh | P21 - Bộ test nghiệm thu; sản phẩm trung gian, chạy khi nghiệm thu, kết quả nộp trong P14; file CO3011_M2_AcceptanceTests |
| Chủ sở hữu / người review | Đào Xuân Sơn, cùng Phạm Duy Quý / Nguyễn Phạm Mạnh Dũng; khách hàng xác nhận danh sách |
| Mục tiêu liên quan | O1, O2, O3, O4, O5 |
| Mô tả và mục đích | Kịch bản nghiệm thu mức hệ thống viết bằng ngôn ngữ nghiệp vụ. Mỗi kịch bản có tiền điều kiện, bước, dữ liệu và kết quả mong đợi cụ thể, chạy trên môi trường demo với dữ liệu từ bộ mô phỏng. Chứng minh ba điều khách hàng nêu ở Q11: workflow chạy xuyên suốt, ngoại lệ được xử lý, hệ thống đáp ứng yêu cầu đã thống nhất |
| Sinh ra từ | P02 (FR/NFR, tiêu chí chấp nhận, ma trận ngoại lệ); P20 (môi trường, dữ liệu, tiêu chí bắt đầu và kết thúc); P04 (kịch bản 100 lượt); P15 (Q11, Q15, Q16, Q20, Q21, Q24) |
| Cung cấp cho | P14 (kết quả và biên bản nghiệm thu), P24 (truy vết AT ↔ FR), P17 (bằng chứng nghiệm thu) |
| Thành phần | 1. Giới thiệu và quy ước ID; 2. Điều kiện tiên quyết (môi trường demo, dữ liệu theo Q24, tài khoản 3 vai trò, đưa bãi về trạng thái ban đầu); 3. Kịch bản chính AT-01 xe máy vào/ra và chỗ trống, AT-02 ô tô vào/ra, AT-03 Manager quản lý thông tin bãi (Q14), AT-04 RBAC, che biển số và xóa dữ liệu 12 tháng (Q18, Q25), AT-05 đặt chỗ, hủy và không đến (Q15), AT-06 tính phí và thanh toán mô phỏng (Q16), AT-07 báo cáo 4 chỉ số (Q20); 4. Kịch bản ngoại lệ AT-EX01 đến AT-EX05; 5. Kịch bản khối lượng AT-100 (≥ 100 lượt, mọi lượt có bản ghi hợp lệ); 6. Cấu trúc mỗi test; 7. Mẫu biên bản nghiệm thu; 8. Truy vết |
| Định dạng / vị trí | Tài liệu dạng bảng; bản chạy có cột kết quả; kết quả ghi tab Quality Evidence; mã AT-xx, AT-EXxx trong ID Registry |
| Tiêu chuẩn áp dụng | Quy định kiểm thử M1 1.7.1; ISO/IEC/IEEE 29119-3 (tham khảo cấu trúc test case); chỉ dùng dữ liệu mô phỏng; sửa sau baseline có CR |
| Tiêu chí chất lượng | (1) 100% yêu cầu Must có ít nhất 1 AT; (2) 100% EX-01 đến EX-05 có AT-EX; (3) mỗi AT có tiền điều kiện, bước, dữ liệu, kết quả mong đợi bằng giá trị cụ thể; (4) mỗi mục tiêu O1-O5 có ít nhất 1 AT có ngưỡng bằng số; (5) chạy trọn bộ không sửa CSDL bằng tay, có log; (6) có AT-100; (7) khách hàng xác nhận danh sách qua email trước nghiệm thu; (8) không có AT cho hạng mục ngoài phạm vi; (9) ít nhất 2 thành viên review |
| Kiểm chứng / trách nhiệm | Review và gửi khách hàng tại CP-06 (A-85); chạy thử sớm A-95; dry run tại CP-07 (A-87); nghiệm thu tại CP-08 (A-88) |

### 2.2.1 Phạm vi và trách nhiệm PD

| PD | P-ID | Chủ sở hữu | Người review | Checkpoint |
|---|---|---|---|---|
| PD-P02 | P02 | Phạm Duy Quý | Nguyễn Tuấn Thành, Nguyễn Võ Đức Sơn | CP-01 |
| PD-P03 | P03 | Nguyễn Phạm Mạnh Dũng | Đào Xuân Sơn | CP-03 |
| PD-P04 | P04 | Nguyễn Tuấn Thành | Đào Xuân Sơn | CP-04 |
| PD-P05 | P05 | Nguyễn Võ Đức Sơn | Đào Xuân Sơn | CP-05 |
| PD-P21 | P21 | Đào Xuân Sơn | Nguyễn Phạm Mạnh Dũng; khách hàng | CP-06 |

## 2.3 Sơ đồ luồng sản phẩm (PFD)

> 📐 **SƠ ĐỒ CẦN REVIEW:** `diagrams/02-pfd.drawio` (xuất ảnh: `diagrams/02-pfd.png`)
> Kiểm tra: mũi tên đi từ sản phẩm đầu vào tới sản phẩm phụ thuộc, khớp bảng 2.3.1.

### 2.3.1 Phụ thuộc và thể hiện sản phẩm

| Sản phẩm đầu ra / thể hiện | Đầu vào bắt buộc | Lý do phụ thuộc |
|---|---|---|
| P02 SRS v1.0 | P15, P23 | Yêu cầu rút từ câu trả lời của khách hàng và phạm vi M1 |
| P18 Thiết kế kiến trúc và API | P02 | Endpoint bám theo yêu cầu |
| P03 Thiết kế CSDL | P18 (loại CSDL), P02 | Lược đồ phụ thuộc loại CSDL và yêu cầu dữ liệu |
| P19 Thiết kế giao diện | P02 | Màn hình theo vai trò và luồng nghiệp vụ |
| P04 Bộ mô phỏng | P18 (hợp đồng sự kiện vào/ra) | Sự kiện phải đúng hợp đồng |
| P22 Dữ liệu mô phỏng bãi thí điểm | P03, P04 | Dữ liệu theo cấu trúc P03, sinh bằng seed và P04 |
| P07, P08 | P18, P03, P19 | Mô-đun dựng trên API, lược đồ và giao diện |
| P05, P09 | P18, P03, P19, P07, P08, P04, P22 | Xe ra/vào cần vai trò, khu vực, sức chứa và nguồn sự kiện; P09 hiển thị kết quả của P05 |
| P06 Đặt chỗ | P18, P03, P09 | Đặt chỗ dựa trên chỗ trống và làm giảm chỗ trống |
| P10 Thanh toán mô phỏng | P05, P08 | Tính phí cho lượt đã đóng theo bảng giá |
| P11 Báo cáo | P05, P06, P10 | Số liệu từ lượt gửi, đặt chỗ, thanh toán |
| P20 Kế hoạch kiểm thử | P02 | Phạm vi kiểm thử theo yêu cầu |
| P21 Bộ test nghiệm thu | P02, P20, P04 | Kịch bản theo yêu cầu, kế hoạch và dữ liệu mô phỏng |
| P13 Hướng dẫn cài đặt | P03, P04 | Hướng dẫn tạo CSDL và chạy bộ mô phỏng |
| P14 Báo cáo nghiệm thu (thể hiện: dry run, trình diễn) | P21, P05 đến P11, P13 | Ghi kết quả chạy bộ test trên các mô-đun |
| P16 Nhật ký tuần (4 thể hiện W12-W15) | P01 | So sánh kế hoạch với thực tế mỗi tuần |
| P17 Báo cáo cuối kỳ | P14, P16, P24 | So sánh baseline với thực tế, truy vết |

### 2.3.2 Kiểm tra luồng sản phẩm

- [x] Mọi sản phẩm đang lập kế hoạch trong PBS có trong PFD, kể cả sản phẩm trung gian.
- [x] Mũi tên thể hiện điều kiện tiên quyết thật; các thể hiện lặp (P14, P16) được ghi rõ.
- [x] Không có chu trình (kiểm tra tự động trong script lập lịch).

## 2.4 Hoạt động và mạng hoạt động lý tưởng

### 2.4.1 Danh mục hoạt động

Hoạt động được suy ra từ sản phẩm, đặt tên dạng động từ + danh từ. Vì các mô-đun đã có trong MVP, hoạt động từ W12 là hoàn thiện tài liệu, sửa theo review thiết kế (KB-xx), kiểm thử và nghiệm thu, không phải xây dựng lại. Mã đánh theo dải của nhóm sản phẩm: A-01..19 yêu cầu và giao diện, A-20..39 kiến trúc, dữ liệu, xác thực, A-40..59 mô phỏng và chỗ trống, A-60..79 nghiệp vụ gửi xe, đặt chỗ, thanh toán, báo cáo, A-80..99 kiểm thử, đóng dự án và quản lý.

<!-- include: generated/activities.md -->

### 2.4.2 Mạng hoạt động lý tưởng

> 📐 **SƠ ĐỒ CẦN REVIEW:** `diagrams/03-activity-network.drawio` (xuất ảnh: `diagrams/03-activity-network.png`)
> Kiểm tra: hộp = A-ID và tên; mũi tên = hoạt động trước ở 2.4.1; checkpoint đánh dấu.

### 2.4.3 Giả định của mạng

| Hạng mục | Quy định |
|---|---|
| Kiểu phụ thuộc | Finish-to-start |
| Cổng thiết kế | Mọi hoạt động sửa mã (A-28, A-44, A-63, A-65, A-70) chờ CP-02 (A-23), nơi mỗi khác biệt KB-xx được quyết định sửa mã, sửa đặc tả hay chấp nhận. Sửa có ảnh hưởng dữ liệu (A-63, A-65) chờ thêm CP-03 (A-27) |
| Việc làm ngay W12 | Chạy bộ kiểm thử tự động lần đầu (A-96), hoàn thiện SRS (A-01), P18 (A-22), rà soát bộ mô phỏng (A-43) và báo cáo (A-77) không phụ thuộc nhau nên chạy song song |
| Đầu vào bên ngoài | Phản hồi vòng 3 (A-16), xác nhận danh sách kịch bản (A-85) và nghiệm thu (A-88) phụ thuộc khách hàng; nhóm tiếp tục theo giả định nếu chưa có phản hồi (AS19) |
| Hoạt động định kỳ | A-16, A-94, A-97, A-91, A-99 đặt theo tuần, không nằm trên mạng logic |

## 2.5 Checkpoint và cổng review

<!-- include: generated/checkpoints.md -->

### 2.5.1 Quy tắc ra quyết định

| Hạng mục | Quy định |
|---|---|
| Thẩm quyền | Checkpoint nội bộ: QA (Đào Xuân Sơn) xác nhận đạt/không đạt; Trưởng nhóm kỹ thuật duyệt checkpoint kỹ thuật. Checkpoint có khách hàng (CP-06, CP-08 và video demo ở CP-05) theo M1 1.5 |
| Lưu minh chứng | Biên bản review trong thư mục tài liệu milestone; kết quả test ở tab Quality Evidence; email khách hàng trong Client Interaction Log |
| Làm lại và kiểm lại | Checkpoint không đạt trả sản phẩm về hoạt động sở hữu. Sửa xong, người review kiểm lại các tiêu chí không đạt. Không đạt lần hai thì leo thang mức 1 (M1 1.5.1) |
| Ảnh hưởng lịch và chi phí | Giờ review đã tính trong hoạt động review. Giờ làm lại lấy từ dự phòng làm lại (2.9.2), không cộng vào ước lượng cơ sở |

### 2.5.2 Kiểm tra vị trí checkpoint

- [x] Checkpoint đặt ở sản phẩm rủi ro cao và điểm bàn giao: SRS, kiến trúc và API, CSDL, bộ mô phỏng, xe ra/vào, bộ test, dry run, nghiệm thu.
- [x] Mỗi checkpoint có hoạt động và giờ review trong ước lượng và trong mạng.
- [x] Đường xử lý khi không đạt và người phê duyệt được ghi rõ.

## 2.6 Ước lượng effort từ dưới lên

### 2.6.1 Phương pháp và giả định

| Hạng mục | Quy định |
|---|---|
| Phương pháp | Phân rã từ dưới lên: mỗi hoạt động chia thành sub-task có số lượng × giờ đơn vị, tạo ra giá trị M. Hoạt động có độ bất định dùng ước lượng ba điểm PERT, E = (O + 4M + P) / 6. Hoạt động nhỏ, lặp lại (review, kiểm thử ngắn, họp) dùng mức chuẩn (standard allowance) |
| Đơn vị | Người-giờ. Năng lực mỗi người: 1,6 giờ/ngày ở W12 và 2 giờ/ngày ở W13-W15 (8 và 10 giờ/tuần, 5 ngày) |
| Căn cứ và độ tin cậy | Số lượng đếm từ sản phẩm có sẵn: 36 FR trong bản nháp SRS, 19 khác biệt KB trong P18, 18 màn hình, 21 file kiểm thử, 12 kịch bản AT; kinh nghiệm từ lúc xây dựng MVP. σ cho biết độ bất định; hoạt động có σ lớn được đưa vào sổ rủi ro |
| Phạm vi ước lượng | Chỉ tính thời gian làm việc tập trung, gồm cả test và review pull request trong hoạt động. Dự phòng làm lại tách riêng (2.9) |
| Đã làm trước mốc lập kế hoạch | Công việc ở 2.0.5 là thực tế, không nằm trong ước lượng |

### 2.6.2 Ước lượng ba điểm

<!-- include: generated/estimates.md -->

### 2.6.3 Mức chuẩn cho hoạt động nhỏ và định kỳ

<!-- include: generated/allowances.md -->

### 2.6.4 Effort và thời gian trôi qua

Effort là số người-giờ. Thời gian tối thiểu là effort chia cho năng lực của những người được giao, giả định họ dành toàn bộ thời gian khả dụng (2 giờ/ngày danh nghĩa). Thời gian theo lịch dài hơn khi người làm bận việc khác hoặc phải chờ hoạt động trước.

<!-- include: generated/duration.md -->

## 2.7 Rà soát khả năng kiểm soát hoạt động

### 2.7.1 Từ kế hoạch xây dựng sang kế hoạch kiểm chứng

Bản v0.2 của báo cáo lập kế hoạch xây dựng toàn bộ hệ thống từ đầu (lưu trong `data/archive/plan-build-v0.2.mjs`). Khi MVP đã có (2.0.5), các hoạt động xây dựng được thay bằng hoạt động kiểm chứng và sửa. Bảng sau là bảng chuyển đổi.

| Hoạt động trong kế hoạch xây dựng v0.2 | Thay bằng ở Baseline V1.0 | Lý do |
|---|---|---|
| A-01 viết SRS (12,3 giờ) | A-01 hoàn thiện SRS từ bản nháp (4,3 giờ) | Bản nháp đã có 36 FR, 11 NFR |
| A-20, A-21, A-22 thiết kế kiến trúc, hợp đồng, đặc tả API | A-22 hoàn thiện P18 và chốt hướng xử lý KB-01 đến KB-19 | Kiến trúc đã hiện thực; việc còn lại là quyết định cho các khác biệt |
| A-24, A-26 thiết kế và script CSDL | A-24 hoàn thiện P03 | Lược đồ, migration, seed đã có |
| A-13 thiết kế giao diện | A-13 lập tài liệu giao diện từ 18 màn hình đã có | Giao diện đã có; cần tài liệu P19 |
| A-28, A-30 xây dựng xác thực | A-28 sửa KB-07, KB-14, KB-16 | Mô-đun đã có |
| A-40, A-42, A-43 xây dựng bộ mô phỏng | A-43 rà soát, A-44 sửa KB-01, KB-08 | Bộ mô phỏng đã có, nhưng chưa gửi qua API |
| A-60, A-63, A-65, A-66, A-78 xây dựng P08, P05 | A-63 sửa KB-02 đến KB-05; A-65 bổ sung API (KB-15) | Mô-đun đã có; thử nghiệm đồng thời A-78 thay bằng kiểm thử đồng thời có sẵn |
| A-48 xây dựng P09 | A-49 kiểm thử | Mô-đun đã có |
| A-70 đến A-77 (đặt chỗ, thanh toán, báo cáo; đã hoãn ở v0.2) | A-70, A-72, A-74, A-76, A-77 rà soát và kiểm thử | Đưa trở lại phạm vi vì đã có trong MVP |
| — | A-96 chạy bộ kiểm thử tự động lần đầu (mới) | 21 file kiểm thử chưa chạy trên máy nhóm |

### 2.7.2 Tách và gộp

Ngưỡng kiểm soát: mỗi hoạt động ≤ 24 người-giờ và thường kết thúc trong ≤ 5 ngày làm việc; không dưới khoảng 1,5 người-giờ (trừ việc định kỳ). Hoạt động lớn nhất là A-63 (6,3 giờ), không cần tách. Kiểm thử P07, P08 được giữ thành hoạt động riêng (A-31, A-61) dù chỉ 1,5-2 giờ, vì chúng là bằng chứng kiểm chứng độc lập (người kiểm khác người sửa). Kiểm thử mô phỏng và review mô phỏng được gộp thành A-45 vì cùng người, cùng lần chạy.

| Hạng mục | Quy định |
|---|---|
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

<!-- include: generated/risks.md -->

Rủi ro của kế hoạch xây dựng v0.2 gắn với việc xây mô-đun (xác thực trễ, bộ mô phỏng lệch hợp đồng, tranh chấp đồng thời khi viết mới) đã được đóng vì mô-đun đã có. Rủi ro mới tập trung vào hồi quy khi sửa (R-G2-02, R-G4-01) và lần chạy kiểm thử đầu tiên (R-G4-03). Không còn rủi ro nào ở mức Cao.

### 2.8.3 Ưu tiên và ảnh hưởng định lượng

| Rủi ro | Ảnh hưởng lịch (ngày) | Ảnh hưởng chi phí (VNĐ, quy đổi) | Ngày rà soát | Mức còn lại sau ứng phó |
|---|---|---|---|---|
| R-G4-03 | 1-2 | 300.000 | Sau A-96 (11/11) | L 2 × I 2 = 4, nhờ chạy kiểm thử ngay ngày đầu |
| R-G5-02 | 1-2 | 200.000 | CP-07 (27/11) | L 2 × I 2 = 4, nhờ A-95 |
| R-G5-01 | 1-2 | 100.000 | CP-07 | L 2 × I 2 = 4, nhờ A-95 |
| R-G4-01 | 1 | 300.000 | CP-05 (23/11) | L 2 × I 2 = 4, nhờ kiểm thử hồi quy |
| R-G2-02 | 1 | 250.000 | CP-02 (16/11) | L 2 × I 2 = 4, nhờ A-79 |
| R-G4-02 | 1-2 | Không quy đổi (rủi ro năng lực) | Mỗi tuần (A-94) | L 2 × I 3 = 6; khoảng 3 ngày float cuối lịch là vùng đệm |

Chi phí quy đổi = số giờ thêm × 50.000 VNĐ. Không cộng ảnh hưởng này vào cả lịch lẫn chi phí: phần giờ đã nằm trong dự phòng làm lại (2.9.2).

## 2.9 Điều chỉnh kế hoạch theo ứng phó rủi ro

### 2.9.1 Hoạt động thêm hoặc thay đổi

| R-ID | Quyết định ứng phó | Hoạt động | Effort thêm (giờ) | Phụ thuộc / tác dụng |
|---|---|---|---|---|
| R-G4-03 | Làm sớm | A-96 chạy bộ kiểm thử tự động lần đầu | 2,17 | Ngày đầu W12, trước mọi hoạt động sửa mã |
| R-G2-02 | Phòng ngừa | A-79 bộ kiểm thử hợp đồng API vào/ra | 2,08 | A-23 → A-79 → A-45 |
| R-G5-01, R-G5-02 | Chạy thử sớm | A-95 smoke run AT-01, AT-02, AT-100 | 2,17 | A-85, A-67 → A-95 → A-87 |
| R-G4-01 | Phòng ngừa (không thêm giờ) | Chạy lại bộ kiểm thử tự động sau mỗi sửa đổi trong A-63 | 0 | Đã tính trong "test hồi quy" của A-63 |
| R-G2-01 | Chấp nhận, đo sớm | Kiểm thử thủ công cập nhật trực tiếp trong A-49 | 0 | Dự phòng: làm mới theo chu kỳ |
| R-G4-02 | Chấp nhận, theo dõi | Ghi giờ thực tế hằng tuần (A-94); float cuối lịch | 0 | Leo thang khi thiếu > 2 giờ/tuần; lùi theo Q22 nếu cần |
| Các rủi ro còn lại | Chỉ dự phòng | Dự phòng làm lại | — | Kích hoạt khi rủi ro xảy ra, PM duyệt |

### 2.9.2 Dự phòng làm lại

Dự phòng bằng tổng phơi nhiễm còn lại sau ứng phó của các rủi ro tốn giờ công. Không dùng thêm tỷ lệ cố định 15% (workbook Estimates V1) để tránh tính trùng cùng một bất định. Dự phòng không phân cho hoạt động nào; PM duyệt khi dùng và ghi vào nhật ký tuần.

<!-- include: generated/reserve.md -->

### 2.9.3 Đối chiếu trước và sau ứng phó

| Chỉ số | Trước ứng phó | Sau ứng phó | Giải thích |
|---|---|---|---|
| Tổng effort cơ sở (người-giờ) | 124,73 | 131,15 | Thêm A-79, A-95, A-96 (6,42 giờ) |
| Dự phòng làm lại (người-giờ) | 12,15 (phơi nhiễm ban đầu) | 8,45 | Xác suất của R-G2-02, R-G4-01, R-G4-03, R-G5-01, R-G5-02 giảm |
| Thời gian theo lịch | — | Kết thúc 01/12 | Lịch cân bằng nguồn lực (2.11.1) |
| Chi phí quy đổi (VNĐ) | 6.844.167 | 6.980.000 | (effort cơ sở + dự phòng) × 50.000 |
| Rủi ro cao nhất | 9 (Trung bình) | 9 (Trung bình) | Không có rủi ro mức Cao |

- [x] Mọi hoạt động ứng phó có trong danh mục, phân bổ, lịch và chi phí.
- [x] Biện pháp phòng ngừa và dự phòng tách riêng; dự phòng không được tính là việc chắc chắn làm.

## 2.10 Nguồn lực và phân bổ khả thi

### 2.10.1 Năng lực nguồn lực

<!-- include: generated/resource-capacity.md -->

Năng lực được xác định qua ba bước. (1) Mỗi thành viên cam kết 8 giờ/tuần, tổng 440 người-giờ cho cả dự án (11 tuần làm việc W4-W15, trừ W8). (2) Đến mốc lập kế hoạch chỉ còn W12-W15. Kế hoạch xây dựng v0.2 cần khoảng 179 người-giờ cho phạm vi Must và hơn 750 người-giờ cho toàn bộ phạm vi, nên ở v0.2 nhóm đã phải hoãn P06, P10, P11 và tính làm thêm 12 giờ/tuần. (3) Khi ghi nhận MVP đã xây dựng (2.0.5), phần việc còn lại cho toàn bộ phạm vi là 131,15 người-giờ cộng 8,45 giờ dự phòng. Nhóm chọn 8 giờ ở W12 và 10 giờ/tuần ở W13-W15 (190 người-giờ, tải 73%): ở 8 giờ/tuần lịch chỉ vừa kịp 04/12 với khoảng nửa ngày dư, còn 10 giờ/tuần để lại khoảng 3 ngày đệm cho lịch thi và sự kiện thay đổi của giảng viên.

### 2.10.2 Phân bổ theo hoạt động

<!-- include: generated/allocation.md -->

### 2.10.3 Giải quyết xung đột nguồn lực

| Xung đột | Vấn đề | Cách giải quyết và đánh đổi | Thay đổi lịch |
|---|---|---|---|
| C-01 Năng lực tổng (kế hoạch v0.2) | Kế hoạch xây dựng từ đầu vượt năng lực còn lại nhiều lần | Ghi nhận MVP là công việc đã hoàn thành; lập lại kế hoạch cho phần kiểm chứng và sửa | Từ không khả thi xuống 139,6 giờ trên 190 giờ |
| C-02 Phạm vi | P06, P10, P11 bị hoãn ở v0.2 vì thiếu năng lực | Đưa trở lại phạm vi vì đã có trong MVP; giữ Q22 làm thứ tự lùi | Thêm 5 hoạt động rà soát và kiểm thử (khoảng 13 giờ) |
| C-03 PM kiêm Tech lead và QA | Nguyễn Võ Đức Sơn là người review gần như mọi checkpoint | Chuyển QA sang Đào Xuân Sơn; review CSDL, mô phỏng, API do QA làm | Checkpoint không còn chờ PM |
| C-04 Cổng thiết kế đầu W12 | Mọi hoạt động sửa mã chờ CP-02 | Ưu tiên A-22, A-24 ở W12; review CP-01 đến CP-03 xong trong W12-W13 | Sửa mã bắt đầu 16/11 |
| C-05 Dồn kiểm thử về QA | Đào Xuân Sơn có tải cao nhất (29,6 giờ) | Chia kiểm thử độc lập: A-31 cho Nguyễn Tuấn Thành, A-49, A-76 cho Phạm Duy Quý, A-61 cho Nguyễn Võ Đức Sơn, A-77 cho Nguyễn Tuấn Thành | Dry run 26-27/11 |

### 2.10.4 Tải nguồn lực theo tuần

<!-- include: generated/resource-load.md -->

## 2.11 Lịch và chi phí baseline

### 2.11.1 Lịch hoạt động đã cân bằng nguồn lực

Lịch được lập bằng phương pháp lập lịch nối tiếp (serial schedule generation) theo ngày: hoạt động sẵn sàng được xếp theo độ ưu tiên LS nhỏ nhất (checkpoint ưu tiên trước), mỗi người chỉ dùng phần năng lực còn lại trong ngày. Thứ tự ưu tiên được thử nhiều lần với nhiễu ngẫu nhiên có seed cố định, và giữ lịch ngắn nhất. Script và dữ liệu đầu vào lưu trong repo để tái lập. Một số hoạt động có float lớn (A-13, A-47, A-61) được xếp rải rác trong khoảng trống của người làm nên khoảng thời gian dài hơn effort.

<!-- include: generated/schedule.md -->

### 2.11.2 Mốc và điều kiện nghiệm thu

<!-- include: generated/milestones.md -->

### 2.11.3 Ràng buộc lịch

| Hạng mục | Quy định |
|---|---|
| Mốc cố định | 09/11 (W12) nộp M2; 07/12 (W16) nộp báo cáo cuối kỳ (LMS) |
| Lịch làm việc | 8 giờ/người ở W12; 10 giờ/người/tuần ở W13-W15; thứ Hai đến thứ Sáu |
| Vùng đệm lịch | Lịch kết thúc 01/12; khoảng 3 ngày làm việc (02/12-04/12) là vùng đệm, PM sở hữu. Tách biệt với dự phòng làm lại |
| File lịch | `docs/m2-report/data/plan.mjs` (dữ liệu) và `docs/m2-report/scripts/schedule.mjs` (tính toán) trong repo |

### 2.11.4 Biểu đồ Gantt

> 📐 **SƠ ĐỒ CẦN REVIEW:** `diagrams/04-gantt.drawio` (xuất ảnh: `diagrams/04-gantt.png`)
> Kiểm tra: thanh ngày khớp bảng 2.11.1; hoạt động găng tô đỏ; mốc ◆ đúng ngày.

Bảng theo tuần (■ = có làm trong tuần, ▒ = việc định kỳ, ◆ = mốc):

<!-- include: generated/gantt.md -->

M-05 (07/12) là thứ Hai của W16, sau tuần cuối của kế hoạch.

### 2.11.5 Phân tích mạng và đường găng

> 📐 **SƠ ĐỒ CẦN REVIEW:** `diagrams/05-critical-path.drawio` (xuất ảnh: `diagrams/05-critical-path.png`)
> Kiểm tra: ES/EF/LS/LF khớp bảng dưới; đường găng tô đỏ.

<!-- include: generated/cpm.md -->

| Hạng mục | Kết quả |
|---|---|
| Kỹ thuật | CPM (forward/backward pass) trên mạng lý tưởng, thời gian = effort ÷ (2 giờ/ngày × số người), không giới hạn nguồn lực |
| Đường găng lý tưởng | A-22 → A-23 → A-44 → A-45 → A-67 → A-68 → A-90 → A-92, dài 10,63 ngày làm việc |
| Ảnh hưởng của cân bằng nguồn lực | Lịch thực tế dài 16,69 ngày vì nhiều hoạt động dùng chung 5 người và W12 chỉ có 8 giờ. Đường găng logic giữ nguyên: chuỗi P18 → bộ mô phỏng → tích hợp → kiểm thử xe ra/vào → báo cáo cuối kỳ |

### 2.11.6 Mô hình chi phí và chi phí baseline

| Hạng mục | Quy định |
|---|---|
| Tiền tệ / cơ sở | VNĐ; nhân công quy đổi theo đơn giá nội bộ, không phải tiền mặt |
| Đơn giá | 50.000 VNĐ/người-giờ cho mọi thành viên (giống M1 1.3.3) |
| Bao gồm / loại trừ | Bao gồm effort W12-W15 và dự phòng làm lại. Loại trừ: công việc đã hoàn thành trước 09/11 (2.0.5; effort thực tế bổ sung ở M3), phần cứng (mô phỏng theo AS1), hosting và công cụ (miễn phí theo CN5) |

| Hạng mục chi phí | Khối lượng | Đơn giá | Chi phí | Căn cứ |
|---|---|---|---|---|
| Nhân công: hoạt động cơ sở (trừ ứng phó rủi ro) | 124,73 người-giờ | 50.000 | 6.236.667 | 2.6 |
| Nhân công: hoạt động ứng phó rủi ro A-79, A-95, A-96 | 6,42 người-giờ | 50.000 | 320.833 | 2.9.1 |
| Công cụ và hosting | Git, Google Docs/Sheets, demo chạy cục bộ | 0 | 0 | CN5 |
| Phần cứng | Mô phỏng (P04) | 0 | 0 | AS1 |
| Dự phòng làm lại | 8,45 người-giờ | 50.000 | 422.500 | 2.9.2, không tính trùng |
| **Tổng chi phí baseline** | | | **6.980.000 VNĐ** | Tại 09/11/2026 |

So với M1: M1 tạm tính 600 người-giờ (30.000.000 VNĐ) cho toàn bộ dự án. Baseline V1.0 chỉ tính phần còn lại từ W12. Phần đã làm trước 09/11 được so sánh ở Milestone 3 khi có số liệu Task Log.

### 2.11.7 Tổng hợp và đối chiếu baseline

<!-- include: generated/totals.md -->

## 2.12 Bảo đảm chất lượng và phê duyệt baseline

### 2.12.1 Kế hoạch chất lượng và kiểm chứng

| Sản phẩm / yêu cầu | Tiêu chí | Phương pháp QA / QC | Người chịu trách nhiệm | Minh chứng / CP |
|---|---|---|---|---|
| Toàn bộ mã MVP | Bộ kiểm thử tự động chạy được | Chạy lần đầu A-96, sau đó chạy lại sau mỗi sửa đổi | Đào Xuân Sơn | Quality Evidence |
| P02 SRS | 7 tiêu chí PD-P02 | Review tài liệu | Nguyễn Tuấn Thành, Nguyễn Võ Đức Sơn | Biên bản / CP-01 |
| P18 Kiến trúc và API | Mỗi KB có quyết định; hợp đồng vào/ra đóng băng | Review, bộ kiểm thử hợp đồng A-79 | Đào Xuân Sơn | CP-02 |
| P03 Thiết kế CSDL | T-DB1 đến T-DB10 | Review lược đồ, kiểm thử | Đào Xuân Sơn | CP-03 |
| P04 Bộ mô phỏng | 10 tiêu chí PD-P04 | Chạy kịch bản, đối chiếu kết quả | Đào Xuân Sơn | CP-04 |
| P07, P08 | Ma trận quyền 3 vai trò; CRUD bãi và bảng giá | Kiểm thử A-31, A-61 | Nguyễn Tuấn Thành, Nguyễn Võ Đức Sơn | Quality Evidence |
| P05, P09 | T05-T13; chỗ trống khớp số đếm tay; cập nhật trực tiếp | Kiểm thử A-68, A-49 trên bộ mô phỏng | Đào Xuân Sơn, Phạm Duy Quý | CP-05 |
| P06, P10, P11 | FR-20 đến FR-29; phí đúng 6 tổ hợp; 4 chỉ số khớp số tính tay | Kiểm thử A-72, A-76, A-77 | Đào Xuân Sơn, Phạm Duy Quý, Nguyễn Tuấn Thành | Quality Evidence / M-03 |
| P21 Bộ test nghiệm thu | 9 tiêu chí PD-P21 | Review, khách hàng xác nhận | Nguyễn Phạm Mạnh Dũng, khách hàng | CP-06 |
| Toàn hệ thống | 100% AT Must đạt | Dry run, trình diễn | Đào Xuân Sơn, khách hàng | CP-07, CP-08 |
| Baseline (P01) | ID, tổng giờ, ngày, chi phí đối chiếu được | Script kiểm tra chéo; review nội bộ | PM, QA | 2.13.1 |

### 2.12.2 Rà soát chất lượng kế hoạch

- [x] Phạm vi và mục tiêu M1 được giữ đầy đủ; chỉ P12 hoãn và có lý do.
- [x] Công việc đã hoàn thành trước mốc lập kế hoạch được ghi riêng là thực tế (2.0.5), không trộn với kế hoạch.
- [x] PBS → PD → PFD → hoạt động → ước lượng → rủi ro → nguồn lực → lịch → kiểm chứng truy vết được (2.13).
- [x] Ngày bắt đầu/kết thúc khả thi với năng lực đã cam kết và phụ thuộc (lịch kết thúc 01/12).
- [x] Rủi ro có người phụ trách, biện pháp giảm và dự phòng; ứng phó nằm trong kế hoạch.
- [x] Effort và chi phí khớp tổng hoạt động; giờ checkpoint và kiểm thử không bị bỏ sót.

### 2.12.3 Vấn đề còn mở

| ID | Việc cần làm / quyết định | Người phụ trách | Hạn | Minh chứng đóng |
|---|---|---|---|---|
| ISS-01 | Gửi câu hỏi vòng 3 (R3-Q1 đến R3-Q9) | Nguyễn Võ Đức Sơn | 10/11 | Email, Client Interaction Log |
| ISS-02 | Khách hàng duyệt Baseline V1.0 | Nguyễn Võ Đức Sơn | 16/11 | Email phản hồi |
| ISS-03 | Cả nhóm xác nhận cam kết 10 giờ/tuần ở W13-W15 | Nguyễn Võ Đức Sơn | 09/11 | Biên bản họp chốt baseline |
| ISS-04 | Ghi effort thực tế của công việc C-01 đến C-13 vào Task Log | Từng thành viên | 13/11 | Workbook |
| ISS-05 | Ghi các ID mới (ENT, SC, AT, T, CP, RES, R-G, KB, C) vào ID Registry | Đào Xuân Sơn | 11/11 | Workbook |

### 2.12.4 Tuyên bố Project Baseline V1.0

| Hạng mục | Nội dung |
|---|---|
| Mã baseline | Project Baseline V1.0 |
| Dự án / phạm vi | Hệ thống quản lý bãi đỗ xe thông minh; toàn bộ phạm vi M1 1.4.1 theo 2.0.2 (trừ P12) |
| Ngày đóng băng | 09/11/2026 (W12) |
| Lưu trữ | Báo cáo này (PDF) và tag `baseline-v1.0` trong repository (mã MVP, dữ liệu kế hoạch và script lập lịch) |
| Thành phần | PBS, 5 PD, PFD, mạng hoạt động, checkpoint, ước lượng, sổ rủi ro, phân bổ nguồn lực, lịch Gantt, đường găng, chi phí, kế hoạch chất lượng, truy vết; ghi nhận công việc đã hoàn thành |
| Ngoại lệ / giả định | Phê duyệt của khách hàng đang chờ (2.12.5); câu hỏi vòng 3 theo AS20; effort thực tế của MVP chờ Task Log (ISS-04) |
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
| Phạm vi | Toàn bộ M1 1.4.1 (P05 đến P11) và các sản phẩm hỗ trợ trong 2.1.2; P12 hoãn |
| Điểm xuất phát | MVP tại commit trước 09/11 (2.0.5) và 19 khác biệt KB-01 đến KB-19 |
| Effort / chi phí | 131,15 người-giờ cơ sở + 8,45 giờ dự phòng; 6.980.000 VNĐ quy đổi |
| Lịch | 09/11 → 01/12; mốc M-01 đến M-05; Gantt và phụ thuộc ở 2.11 |
| Rủi ro / chất lượng | Sổ rủi ro 2.8.2; hoạt động ứng phó 2.9.1; checkpoint CP-01 đến CP-08; tiêu chí trong 5 PD |

## 2.13 Truy vết và nhất quán

<!-- include: generated/traceability.md -->

### 2.13.1 Kiểm tra đối chiếu chéo

| Kiểm tra | Kết quả | Minh chứng |
|---|---|---|
| Mỗi O có sản phẩm và test | Đạt | Bảng 2.13 |
| Mỗi P đang lập kế hoạch hoặc có trong MVP có hoạt động | Đạt (P24 nằm trong P01 và workbook) | Script kiểm tra |
| Mỗi A có ước lượng, người phụ trách, phụ thuộc, ngày | Đạt | 2.4.1, 2.6, 2.11.1 |
| Mỗi R có người phụ trách, ứng phó, ảnh hưởng định lượng | Đạt | 2.8.2, 2.8.3 |
| Mỗi checkpoint có người review / phê duyệt | Đạt | 2.5 |
| Tổng effort, tải nguồn lực và chi phí khớp nhau | Đạt: 131,15 giờ = Σ hoạt động = Σ tải 5 người | 2.10.4, 2.11.7 |

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
