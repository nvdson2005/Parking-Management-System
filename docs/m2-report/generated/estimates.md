| A-ID | Hoạt động | Căn cứ (sub-task) | O | M | P | E (giờ) | σ |
|---|---|---|---|---|---|---|---|
| A-01 | Hoàn thiện SRS v1.0 từ bản nháp | Đối chiếu 36 FR với MVP 36 × 0,05h = 1,8h; rà soát phạm vi và ưu tiên MoSCoW 0,7h; hoàn thiện tiêu chí chấp nhận 1h; truy vết 0,5h | 3 | 4 | 7 | 4,33 | 0,67 |
| A-13 | Lập tài liệu thiết kế giao diện từ màn hình đã có | 18 màn hình × 0,2h = 3,6h (chụp, mô tả trường và thao tác); sơ đồ điều hướng theo 3 vai trò 1h | 3,5 | 4,5 | 7 | 4,75 | 0,58 |
| A-22 | Hoàn thiện P18 v1.0 và chốt hướng xử lý các khác biệt KB-01 đến KB-19 | 19 khác biệt × 0,15h = 2,9h (sửa mã, sửa spec hoặc chấp nhận); cập nhật đặc tả endpoint 1h | 3 | 4 | 7 | 4,33 | 0,67 |
| A-24 | Hoàn thiện thiết kế CSDL v1.0 | Cập nhật tiêu chí PD-P03 theo khác biệt đã chốt 1h; ERD và từ điển dữ liệu 1h | 1,5 | 2 | 4 | 2,25 | 0,42 |
| A-28 | Sửa xác thực và nhật ký truy cập theo review | Ghi LOGIN khi đăng ký (KB-07) 0,5h; trả 400 cho JSON lỗi (KB-14) 1h; chặn tài khoản khóa ở middleware (KB-16) 1h; test 0,5h | 2 | 3 | 5 | 3,17 | 0,5 |
| A-65 | Bổ sung API cho nhật ký truy cập, lượt gửi và lịch sử thanh toán | 3 endpoint × 1h (KB-15); kiểm tra quyền và test 1h | 3 | 4 | 7 | 4,33 | 0,67 |
| A-43 | Rà soát bộ mô phỏng theo PD-P04 và lập danh mục kịch bản SC-01 đến SC-07 | Đối chiếu 10 tiêu chí PD-P04 1,5h; mô tả 7 kịch bản × 0,2h = 1,4h | 2 | 3 | 5 | 3,17 | 0,5 |
| A-44 | Sửa bộ mô phỏng theo review | Gửi sự kiện qua API vào/ra (KB-01) 2h; ghi nhật ký và phát SSE khi kích hoạt EX-05 (KB-08) 1h; kiểm tra đủ ≥ 100 lượt được tạo (FR-34) 1h; test 1h | 3 | 5 | 9 | 5,33 | 1 |
| A-79 | Xây dựng bộ kiểm thử hợp đồng API vào/ra | Ca kiểm thử cho từng endpoint theo hợp đồng 1,5h; chạy với bộ mô phỏng 0,5h | 1,5 | 2 | 3 | 2,08 | 0,25 |
| A-96 | Chạy bộ kiểm thử tự động lần đầu và ghi Quality Evidence | Chạy npm test trên CSDL test 0,5h; phân loại lỗi 1h; ghi Quality Evidence 0,5h | 1 | 2 | 4 | 2,17 | 0,5 |
| A-63 | Sửa luồng xe vào/ra theo review | Chốt thời điểm tính phí (KB-02) 1h; tách đóng lượt khỏi tạo giao dịch (KB-03) 1,5h; chuẩn hóa biển số khi so khớp (KB-04) 1h; kiểm tra mất thẻ ở máy chủ (KB-05) 1h; test hồi quy 1,5h | 4 | 6 | 10 | 6,33 | 1 |
| A-67 | Tích hợp bộ mô phỏng với luồng vào/ra đã sửa | Chạy lại 7 kịch bản qua API 1h; sửa lỗi 1h | 1 | 2 | 4 | 2,17 | 0,5 |
| A-68 | Kiểm thử mô-đun xe ra/vào | Chạy T05-T13 1,5h; kịch bản 100 lượt 1h; ghi Quality Evidence 0,5h | 2 | 3 | 5 | 3,17 | 0,5 |
| A-70 | Rà soát và sửa mô-đun đặt chỗ | Đối chiếu FR-20 đến FR-25 1h; thống nhất mã lỗi (KB-11) 1h; test 1h | 2 | 3 | 5 | 3,17 | 0,5 |
| A-72 | Kiểm thử mô-đun đặt chỗ | Hết hạn và không đến, hủy, đến sớm, vào khu khác: 4 tình huống × 0,5h; ghi Quality Evidence 1h | 2 | 3 | 5 | 3,17 | 0,5 |
| A-74 | Rà soát mô-đun thanh toán mô phỏng | Đối chiếu FR-26 đến FR-28 sau khi sửa KB-02, KB-03 1h; lịch sử Customer và Manager 1h | 1,5 | 2 | 4 | 2,25 | 0,42 |
| A-77 | Rà soát và kiểm thử mô-đun báo cáo | Đối chiếu 4 công thức D-30 với số tính tay trên dữ liệu mẫu 2h; ghi Quality Evidence 0,5h | 1,5 | 2,5 | 4 | 2,58 | 0,42 |
| A-82 | Viết kịch bản nghiệm thu chính AT-01 đến AT-07 | 7 kịch bản × 0,75h (xe máy, ô tô, quản lý bãi, RBAC và che biển số, đặt chỗ, thanh toán, báo cáo) | 4 | 5,25 | 8 | 5,5 | 0,67 |
| A-83 | Viết kịch bản nghiệm thu ngoại lệ và kịch bản 100 lượt | 5 AT-EX × 0,4h = 2h; kịch bản 100 lượt 1h | 2 | 3 | 5 | 3,17 | 0,5 |
| A-95 | Chạy thử sớm AT-01, AT-02 và kịch bản 100 lượt | Dựng môi trường và reset dữ liệu 0,5h; chạy AT-01, AT-02 0,5h; 100 lượt 0,5h; ghi lỗi 0,5h | 1,5 | 2 | 3,5 | 2,17 | 0,33 |
| A-87 | Chạy thử nghiệm thu nội bộ | 12 AT × 0,3h = 3,6h; 100 lượt 0,5h; chỉnh kịch bản 0,5h; ghi Quality Evidence 0,5h | 3,5 | 5,1 | 8 | 5,32 | 0,75 |
| A-88 | Trình diễn nghiệm thu với khách hàng | Chuẩn bị môi trường và kịch bản 1h; quay video demo 1h; gửi email và ghi nhận 0,5h (Q23) | 2 | 2,5 | 5 | 2,83 | 0,5 |
| A-89 | Viết báo cáo kết quả nghiệm thu | Tổng hợp 12 AT và kịch bản 100 lượt 1h; số đo O3, O4 0,5h; lỗi còn mở 0,5h; viết 1h | 2 | 3 | 5 | 3,17 | 0,5 |
| A-90 | Tổng hợp số liệu thực tế và so sánh với baseline | Thu Task Log 5 × 0,25h = 1,25h; so sánh effort và tiến độ 1,5h; đối chiếu rủi ro 0,5h | 2,5 | 3,25 | 5 | 3,42 | 0,42 |
| A-92 | Viết và rà soát báo cáo quản lý dự án cuối kỳ | Phân tích kết quả theo O1-O5 1,5h; viết và định dạng 3h; review 2 người × 0,5h | 4 | 5,5 | 9 | 5,83 | 0,83 |
|  | **Tổng** |  |  |  |  | **90,15** |  |
