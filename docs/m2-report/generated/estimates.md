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
