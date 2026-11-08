# P02 - Đặc tả yêu cầu phần mềm (SRS)

## Hệ thống quản lý bãi đỗ xe thông minh

| Trường | Nội dung |
|---|---|
| Mã và tên | P02 - Đặc tả yêu cầu phần mềm (SRS) |
| Loại | Sản phẩm trung gian |
| Tên file | CO3011_M2_SRS_v0.1 (bản nháp); v1.0 khi qua CP-01 và đóng băng cùng Baseline V1.0 |
| Chủ sở hữu | Phạm Duy Quý; đồng tác giả Đào Xuân Sơn (BA) |
| Người review | Nguyễn Tuấn Thành, Nguyễn Võ Đức Sơn (CP-01, hoạt động A-09) |
| Mục tiêu liên quan | O1, O2, O3, O4, O5 |
| Nguồn | Client Interaction Log Q01-Q26 (P15); báo cáo M1 mục 1.2-1.4 (P23); quyết định thiết kế D-01 đến D-41 |

### Lịch sử phiên bản

| Phiên bản | Ngày | Người thực hiện | Thay đổi |
|---|---|---|---|
| v0.1 | 08/11/2026 | Phạm Duy Quý, Đào Xuân Sơn | Bản nháp đầy đủ theo cấu trúc PD-P02 |
| v0.2 | 09/11/2026 | Phạm Duy Quý | Đưa FR-20 đến FR-29 vào phạm vi Baseline V1.0 (Should/Could); Q22 chỉ còn là thứ tự lùi |

## 1. Giới thiệu

### 1.1 Mục đích

Tài liệu liệt kê yêu cầu chức năng và phi chức năng của Hệ thống quản lý bãi đỗ xe thông minh. Đây là căn cứ chung cho thiết kế (P18, P03, P19), kiểm thử (P20, P21) và nghiệm thu theo tiêu chí khách hàng nêu ở Q11: workflow cốt lõi chạy xuyên suốt, xử lý được các ngoại lệ, đáp ứng yêu cầu đã thống nhất.

### 1.2 Phạm vi

Một trường đại học cần hệ thống hỗ trợ quản lý bãi đỗ xe cho sinh viên, giảng viên và nhân viên. Hiện nay bãi xe được quản lý thủ công: người dùng không biết trước tình trạng chỗ đỗ, đơn vị quản lý khó theo dõi nhu cầu (đề bài). Mục tiêu của khách hàng là số hóa vận hành, tối ưu việc sử dụng chỗ đỗ và cải thiện trải nghiệm người dùng (Q09).

Ba chức năng ưu tiên cao nhất là quản lý xe ra/vào, theo dõi tình trạng chỗ đỗ và quản lý thông tin bãi đỗ (Q01). Khi thiếu thời gian, ba chức năng này được bảo vệ trước; các chức năng khác lùi theo thứ tự báo cáo, thanh toán mô phỏng, đặt chỗ trước (Q22).

**Phạm vi theo Baseline V1.0.** Tài liệu mô tả toàn bộ yêu cầu ở M1 mục 1.4.1. Toàn bộ 36 yêu cầu chức năng thuộc Baseline V1.0, gồm cả đặt chỗ trước (P06), thanh toán mô phỏng (P10) và báo cáo (P11) với mức ưu tiên Should/Could. Thứ tự lùi Q22 (báo cáo, thanh toán mô phỏng, đặt chỗ trước) chỉ áp dụng nếu lịch trễ, theo quyết định tại CP-07 của kế hoạch.

### 1.3 Thuật ngữ

| Thuật ngữ | Ý nghĩa |
|---|---|
| Lượt gửi (session) | Một lần xe vào bãi, từ lúc ghi nhận vào đến lúc ghi nhận ra |
| Lượt đang mở | Lượt gửi đã vào nhưng chưa ra (trạng thái OPEN) |
| Chỗ trống | Sức chứa − số lượt đang mở − số đặt chỗ đang chờ, tính theo bãi × khu vực × loại xe |
| Khách vãng lai (Guest) | Xe không gắn với tài khoản nào; tính phí theo mức Guest |
| Nhóm người dùng | Sinh viên hoặc Giảng viên/Nhân viên, tự chọn khi đăng ký |
| Mã QR / mã RFID mô phỏng | Mã định danh xe do hệ thống sinh, thay cho thẻ/thiết bị thật (Q02) |
| Ảnh chụp biển số (plate snapshot) | Biển số được sao chép vào lượt gửi lúc xe vào |
| Bộ mô phỏng | Trang của Manager sinh sự kiện vào/ra giả thay cho phần cứng (P04) |
| Che biển số | Hiển thị dạng `51F-***.45`: giữ tiền tố và 2 ký tự cuối |

## 2. Vai trò người dùng

Hệ thống có ba vai trò (Q07, Q25, AS5). Chức năng quản trị gộp vào Manager.

| Chức năng | Customer (người gửi xe) | Staff (nhân viên bãi) | Manager (quản lý) |
|---|---|---|---|
| Tự đăng ký tài khoản | ✔ | — | — |
| Đăng nhập / đăng xuất | ✔ | ✔ | ✔ |
| Quản lý xe của mình, xem mã QR | ✔ | — | — |
| Xem tình trạng chỗ trống | ✔ | ✔ | ✔ |
| Tạo / hủy đặt chỗ của mình | ✔ | — | — |
| Xem lịch sử gửi xe và thanh toán của mình | ✔ | — | — |
| Ghi nhận xe vào/ra, xử lý ngoại lệ, xác nhận thanh toán | — | ✔ | ✔ |
| Xem biển số đầy đủ | Chỉ xe của mình | ✔ | ✔ |
| Quản lý bãi, khu vực, sức chứa, trạng thái, bảng giá | — | — | ✔ |
| Quản lý tài khoản | — | — | ✔ |
| Xem báo cáo | — | — | ✔ |
| Xem nhật ký truy cập, xóa dữ liệu quá hạn | — | — | ✔ |
| Dùng bộ mô phỏng | — | — | ✔ |

## 3. Yêu cầu chức năng

Cột: **Ưu tiên** theo MoSCoW ở M1 1.4.1; **Phạm vi V1.0** = Trong baseline (mọi yêu cầu; một số còn chờ xác nhận giả định ở vòng 3); **Nguồn** = câu hỏi khách hàng (Q), giả định (AS), ràng buộc (CN) hoặc quyết định (D); **O** = mục tiêu.

### 3.1 Nền tảng và tài khoản (P07)

| ID | Mô tả | Ưu tiên | Phạm vi V1.0 | Nguồn | O | Tiêu chí chấp nhận |
|---|---|---|---|---|---|---|
| FR-01 | Hệ thống phải cho người dùng tự đăng ký tài khoản Customer với email, mật khẩu, họ tên và nhóm người dùng (Sinh viên hoặc Giảng viên/Nhân viên). | Must | Trong baseline | Q06, D-10, D-35 | O5 | Đăng ký với email mới thì đăng nhập được; email đã tồn tại thì bị từ chối kèm thông báo |
| FR-02 | Hệ thống phải cho phép đăng nhập, đăng xuất và chỉ lưu mật khẩu dạng băm. | Must | Trong baseline | CN4 | O5 | Không có cột lưu mật khẩu rõ; sai mật khẩu thì không đăng nhập được |
| FR-03 | Hệ thống phải kiểm tra quyền theo bảng vai trò ở mục 2 trên cả giao diện và API. | Must | Trong baseline | CN4 | O5 | Customer gọi chức năng của Staff/Manager (qua giao diện hoặc API) đều bị từ chối |
| FR-04 | Hệ thống phải chặn đăng nhập đối với tài khoản bị khóa. | Must | Trong baseline | D-24 | O5 | Tài khoản bị Manager khóa không đăng nhập được; mở khóa thì đăng nhập lại được |
| FR-05 | Hệ thống phải có nút chuyển ngôn ngữ Việt/Anh trên mọi trang. | Must | Trong baseline (giả định nhóm, dự kiến hỏi R3-Q8) | D-11, D-38 | O5 | Bấm nút thì nhãn trên trang hiện tại đổi ngôn ngữ; lựa chọn giữ khi chuyển trang |

### 3.2 Xe (hỗ trợ xe vào/ra)

| ID | Mô tả | Ưu tiên | Phạm vi V1.0 | Nguồn | O | Tiêu chí chấp nhận |
|---|---|---|---|---|---|---|
| FR-06 | Hệ thống phải cho Customer thêm và xóa xe của mình (biển số, loại xe xe máy/ô tô); mỗi xe có mã QR duy nhất hiển thị dạng ảnh kèm giá trị chữ và một mã RFID mô phỏng do hệ thống sinh. | Must | Trong baseline (giả định nhóm, dự kiến hỏi R3-Q1) | D-12, D-32, D-37 | O2 | Xe mới có QR và RFID khác mọi xe khác; QR hiển thị được và sao chép được giá trị |
| FR-06a | Hệ thống phải bảo đảm biển số là duy nhất; nếu biển số đã tồn tại dưới dạng xe vãng lai thì gán xe đó cho Customer, nếu thuộc Customer khác thì báo lỗi. | Must | Trong baseline (giả định nhóm, dự kiến hỏi R3-Q1) | D-33 | O2 | Đăng ký biển số của xe vãng lai thì xe chuyển sang tài khoản; biển số của người khác thì bị từ chối |

### 3.3 Quản lý thông tin bãi đỗ (P08)

| ID | Mô tả | Ưu tiên | Phạm vi V1.0 | Nguồn | O | Tiêu chí chấp nhận |
|---|---|---|---|---|---|---|
| FR-07 | Hệ thống phải cho Manager tạo và sửa bãi đỗ: tên, địa chỉ, trạng thái (đang hoạt động / tạm ngưng). | Must | Trong baseline | Q14, D-04 | O1, O5 | Thay đổi lưu lại và hiển thị ngay; không có trường giờ hoạt động |
| FR-08 | Hệ thống phải cho Manager tạo và sửa khu vực trong bãi và sức chứa theo từng loại xe của mỗi khu vực. | Must | Trong baseline | Q08, Q14 | O1 | Đổi sức chứa thì số chỗ trống đổi tương ứng |
| FR-09 | Hệ thống phải cho Manager sửa bảng giá theo lượt cho từng cặp loại xe × nhóm người dùng (Sinh viên, Giảng viên/Nhân viên, Khách). | Must | Trong baseline | Q14, Q16, D-03, D-10 | O4 | Bảng giá có đủ 6 ô (2 loại xe × 3 nhóm); giá mới lưu lại được |
| FR-10 | Hệ thống phải hỗ trợ nhiều bãi trong mô hình dữ liệu; bản demo nạp một bãi thí điểm. | Should | Trong baseline | Q04, D-17 | O5 | Thêm bãi thứ hai bằng dữ liệu, không sửa lược đồ; số liệu hai bãi không lẫn nhau |

### 3.4 Quản lý xe vào/ra (P05)

| ID | Mô tả | Ưu tiên | Phạm vi V1.0 | Nguồn | O | Tiêu chí chấp nhận |
|---|---|---|---|---|---|---|
| FR-11 | Hệ thống phải cho Staff ghi nhận xe vào bằng biển số, hoặc giá trị mã QR (gõ/dán, không dùng camera), hoặc mã RFID mô phỏng; chọn loại xe và khu vực; hoàn tất trong tối đa 3 thao tác. | Must | Trong baseline | Q02, D-25, D-32 | O2 | Ghi nhận được bằng cả 3 phương thức; đếm ≤ 3 thao tác |
| FR-12 | Hệ thống phải tạo bản ghi xe vãng lai khi biển số chưa có trong hệ thống. | Must | Trong baseline (giả định nhóm, dự kiến hỏi R3-Q2) | D-10, D-36 | O2 | Biển số lạ vào bãi thì có bản ghi xe không gắn tài khoản |
| FR-13 | Hệ thống phải lưu cho mỗi lượt gửi: thời điểm vào, thời điểm ra, ảnh chụp biển số, loại xe, khu vực, phương thức nhận diện, nhân viên thực hiện, trạng thái. | Must | Trong baseline | PD-P05, D-29 | O2 | 100% lượt trong kịch bản ≥ 100 lượt có đủ các trường |
| FR-14 | Hệ thống phải cho Staff ghi nhận xe ra: tìm lượt đang mở theo biển số, QR hoặc RFID; nhập biển số quan sát được để so với ảnh chụp biển số (khác thì xử lý EX-02); đóng lượt. Xe vẫn ra được khi bãi tạm ngưng. Phần hiển thị phí và xác nhận thanh toán thuộc FR-26, FR-27. | Must | Trong baseline | D-06, D-26, D-27 | O2, O4 | Lượt đóng có thời điểm ra và nhân viên ra; biển số khác thì phải xác nhận trước khi đóng |
| FR-15 | Hệ thống phải dùng một API sự kiện vào/ra chung cho màn hình Staff và bộ mô phỏng. | Must | Trong baseline | AS1, D-05 | O2 | Bộ mô phỏng không truy cập CSDL trực tiếp mà gọi cùng API |
| FR-16 | Hệ thống phải hoàn tất mỗi lượt ghi nhận vào/ra trong tối đa 2 giây với dữ liệu quy mô thí điểm. | Must | Trong baseline | PD-P05 | O2 | Đo trong kịch bản 100 lượt: mọi lượt ≤ 2 giây |

### 3.5 Theo dõi tình trạng chỗ đỗ (P09)

| ID | Mô tả | Ưu tiên | Phạm vi V1.0 | Nguồn | O | Tiêu chí chấp nhận |
|---|---|---|---|---|---|---|
| FR-17 | Hệ thống phải tính số chỗ trống theo bãi × khu vực × loại xe bằng sức chứa − số lượt đang mở − số đặt chỗ đang chờ. | Must | Trong baseline | Q17, D-21 | O1 | Khớp số đếm tay trên dữ liệu có cả lượt mở, lượt đóng và đặt chỗ |
| FR-18 | Hệ thống phải giữ số chỗ trống đúng sau mọi sự kiện, kể cả các sự kiện gần như đồng thời. | Must | Trong baseline | PD-P05 | O1 | Gửi nhiều sự kiện đồng thời vào khu vực gần đầy: không vượt sức chứa, số đếm khớp |
| FR-19 | Hệ thống phải cập nhật màn hình chỗ trống ngay khi có xe vào/ra, đặt chỗ tạo/hủy/hết hạn, đổi sức chứa hoặc trạng thái bãi, không cần tải lại trang. | Must | Trong baseline | D-14, O1 | O1 | Mở màn hình chỗ trống ở cửa sổ khác, ghi nhận xe vào: số liệu đổi mà không tải lại trang |
| FR-19a | Hệ thống phải hiển thị nhãn "Tạm ngưng" cho bãi tạm ngưng, kèm số liệu bình thường. | Must | Trong baseline | D-27 | O1 | Tạm ngưng bãi thì nhãn xuất hiện; số chỗ trống vẫn hiển thị |

### 3.6 Đặt chỗ trước (P06)

| ID | Mô tả | Ưu tiên | Phạm vi V1.0 | Nguồn | O | Tiêu chí chấp nhận |
|---|---|---|---|---|---|---|
| FR-20 | Hệ thống phải cho Customer đặt chỗ cho một xe của mình theo khu vực, loại xe (theo xe) và giờ đến trong ngày. | Should | Trong baseline | D-07, D-19 | O3 | Chỉ chọn được giờ từ hiện tại đến hết ngày |
| FR-21 | Hệ thống phải từ chối đặt chỗ khi khu vực hết chỗ cho loại xe đó hoặc bãi tạm ngưng; đặt chỗ đang chờ được giữ khi bãi tạm ngưng. | Should | Trong baseline | D-21, D-27 | O3 | Hai trường hợp đều bị từ chối kèm thông báo |
| FR-22 | Hệ thống phải cho Customer hủy đặt chỗ trước giờ đến và ghi lý do hủy. | Should | Trong baseline | Q15, D-41 | O3 | Hủy xong thì chỗ trống tăng lại; danh sách hiển thị lý do |
| FR-23 | Hệ thống phải giữ chỗ đến giờ đến + 30 phút; quá hạn thì tự chuyển sang NO_SHOW và giải phóng chỗ. | Should | Trong baseline | Q15 | O3 | Sau giờ giữ, đặt chỗ là NO_SHOW và chỗ trống tăng lại |
| FR-24 | Hệ thống phải đánh dấu FULFILLED khi xe đã đặt vào đúng khu vực trước hạn giữ (cho phép đến sớm); vào khu vực khác thì tính như xe vãng lai và tự hủy đặt chỗ. | Should | Trong baseline | D-07, D-34 | O3 | Hai trường hợp cho đúng trạng thái và lý do hủy |
| FR-25 | Hệ thống phải tính chỗ đã đặt vào sức chứa chung của khu vực. | Should | Trong baseline | Q15 | O1, O3 | Đặt chỗ làm giảm chỗ trống; xe vãng lai không chiếm được chỗ đã đặt |

### 3.7 Thanh toán mô phỏng (P10)

| ID | Mô tả | Ưu tiên | Phạm vi V1.0 | Nguồn | O | Tiêu chí chấp nhận |
|---|---|---|---|---|---|---|
| FR-26 | Hệ thống phải tính phí mỗi lượt theo bảng giá của (loại xe, nhóm người dùng của chủ xe, hoặc Khách nếu không có chủ). | Should | Trong baseline | Q16, D-03, D-10 | O4 | Phí đúng cho cả 6 tổ hợp loại xe × nhóm |
| FR-27 | Hệ thống phải cho Staff xác nhận thanh toán mô phỏng khi xe ra và lưu giao dịch (số tiền, trạng thái, thời điểm, người xác nhận). | Should | Trong baseline | Q05, D-06 | O4 | Mỗi lượt đóng có đúng một giao dịch |
| FR-28 | Hệ thống phải cho Customer xem lịch sử giao dịch của mình và Manager xem toàn bộ. | Should | Trong baseline | M1 1.4.1 | O4 | Customer chỉ thấy giao dịch của mình |

### 3.8 Báo cáo (P11)

| ID | Mô tả | Ưu tiên | Phạm vi V1.0 | Nguồn | O | Tiêu chí chấp nhận |
|---|---|---|---|---|---|---|
| FR-29 | Hệ thống phải có dashboard 4 chỉ số trong khoảng ngày chọn (mặc định hôm nay): tỷ lệ sử dụng theo giờ (trung bình chỗ đang dùng ÷ sức chứa), 3 giờ cao điểm theo số lượt vào, doanh thu theo ngày thanh toán, tỷ lệ không đến = NO_SHOW ÷ (tổng đặt chỗ − đã hủy). | Could | Trong baseline | Q20, D-20, D-30 | O3 | 4 chỉ số khớp số tính tay trên dữ liệu mẫu |

### 3.9 Bảo vệ dữ liệu

| ID | Mô tả | Ưu tiên | Phạm vi V1.0 | Nguồn | O | Tiêu chí chấp nhận |
|---|---|---|---|---|---|---|
| FR-30 | Hệ thống phải che biển số theo dạng `51F-***.45` với người xem không có quyền xem biển số đầy đủ. | Must | Trong baseline | CN4, D-13, D-39 | O5 | Customer thấy biển số người khác bị che, biển số xe mình đầy đủ |
| FR-31 | Hệ thống phải ghi nhật ký truy cập (tài khoản, hành động, đối tượng, thời điểm) cho đăng nhập/đăng xuất, xem chi tiết biển số đầy đủ, xe vào/ra và xác nhận thủ công, thay đổi bãi/bảng giá/tài khoản, xóa dữ liệu; Manager xem được nhật ký. | Must | Trong baseline | CN4, D-23, D-31 | O5 | Mỗi hành động trong danh sách tạo đúng một dòng nhật ký |
| FR-32 | Hệ thống phải có thao tác "xóa dữ liệu quá hạn" của Manager: thay biển số trên lượt gửi cũ hơn 12 tháng bằng `[purged]`, xóa xe vãng lai không còn lượt mới hơn, và ghi nhật ký thao tác. | Must | Trong baseline (giả định nhóm, dự kiến hỏi R3-Q6) | Q18, D-15, D-29 | O5 | Lượt cũ hơn 12 tháng bị che biển số; lượt mới giữ nguyên |

### 3.10 Bộ mô phỏng (P04)

| ID | Mô tả | Ưu tiên | Phạm vi V1.0 | Nguồn | O | Tiêu chí chấp nhận |
|---|---|---|---|---|---|---|
| FR-33 | Hệ thống phải có trang mô phỏng cho Manager với 3 thao tác: phát N sự kiện vào/ra ngẫu nhiên qua API của FR-15; kích hoạt từng ngoại lệ EX-01 đến EX-05; sinh dữ liệu N ngày trước (gồm lượt cũ khoảng 13 tháng). | Must | Trong baseline | AS1, D-22, D-28 | O1, O2 | Mỗi thao tác chạy được và kết quả hiện trên màn hình chỗ trống / lịch sử |
| FR-34 | Hệ thống phải chạy được kịch bản ≥ 100 lượt gửi với mọi lượt được ghi nhận đầy đủ. | Must | Trong baseline | O2 | O2 | 100% lượt có bản ghi hợp lệ |

Tổng: 36 yêu cầu chức năng, tất cả trong Baseline V1.0: 25 Must, 10 Should (FR-10, FR-20 đến FR-28), 1 Could (FR-29).

## 4. Yêu cầu phi chức năng

| ID | Nhóm | Mô tả | Nguồn | O | Tiêu chí chấp nhận |
|---|---|---|---|---|---|
| NFR-01 | Bảo mật | Hệ thống phải băm mật khẩu bằng thuật toán có salt (bcrypt hoặc tương đương). | CN4 | O5 | Rà soát lược đồ và mã: không có mật khẩu rõ |
| NFR-02 | Bảo mật | Hệ thống phải kiểm tra quyền ở phía máy chủ cho mọi API; ẩn chức năng trên giao diện không thay thế kiểm tra phía máy chủ. | CN4 | O5 | Gọi API trực tiếp bằng tài khoản Customer vào chức năng Staff/Manager đều bị từ chối |
| NFR-03 | Quyền riêng tư | Hệ thống phải tuân thủ thu thập tối thiểu, phân quyền, che biển số và ghi nhật ký truy cập theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15. | CN4, M1 1.7.1 | O5 | Đạt FR-30, FR-31 |
| NFR-04 | Lưu giữ | Hệ thống phải lưu biển số gắn lượt gửi không quá 12 tháng (thực hiện bằng FR-32). | Q18, AS6 | O5 | Sau thao tác xóa không còn biển số trên lượt cũ hơn 12 tháng |
| NFR-05 | Hiệu năng | Hệ thống phải xử lý mỗi sự kiện vào/ra trong ≤ 2 giây với dữ liệu thí điểm (3 khu vực, khoảng 330 chỗ). | PD-P05, Q24 | O2 | Đo trong kịch bản 100 lượt |
| NFR-06 | Đúng đắn khi đồng thời | Hệ thống phải xử lý các sự kiện vào/ra gần đồng thời mà không vượt sức chứa và không tạo hai lượt mở cho cùng một xe. | PD-P05, R-G4-01 | O1 | Kiểm thử đồng thời đạt |
| NFR-07 | Khả dụng | Hệ thống phải là web responsive dùng được trên máy tính và điện thoại; không cần ứng dụng native. | Q12 | O5 | Các luồng demo thao tác được ở độ rộng điện thoại |
| NFR-08 | Mở rộng | Mô hình dữ liệu phải hỗ trợ nhiều bãi; thêm bãi chỉ bằng dữ liệu. | Q04 | O5 | Như FR-10 |
| NFR-09 | Ràng buộc chi phí | Hệ thống chỉ dùng công cụ, thư viện miễn phí hoặc mã nguồn mở. | CN5 | — | Rà soát danh sách thư viện |
| NFR-10 | Dữ liệu kiểm thử | Kiểm thử và demo chỉ dùng dữ liệu mô phỏng, không dùng biển số thật. | CN4, AS1 | — | Dữ liệu nạp từ seed và bộ mô phỏng |
| NFR-11 | Bảo trì | Mã nguồn phải có kiểm thử tự động cho logic cốt lõi (phí, chỗ trống, 5 ngoại lệ, phân quyền) và chạy được bằng một lệnh. | M1 1.7.1 | O5 | Lệnh kiểm thử chạy hết không lỗi |

## 5. Ma trận ngoại lệ

Danh sách gồm đúng 5 ngoại lệ cốt lõi (Q21, M1 O4, D-08).

| ID | Tình huống | Vai trò xử lý | Phản hồi mong đợi của hệ thống | FR liên quan |
|---|---|---|---|---|
| EX-01 | Khu vực hết chỗ cho loại xe đó | Staff | Từ chối ghi nhận xe vào, thông báo rõ | FR-11, FR-17 |
| EX-02 | Biển số Staff nhập khi xe ra khác ảnh chụp biển số của lượt gửi | Staff | Cảnh báo; Staff phải xác nhận thủ công trước khi đóng lượt; xác nhận được ghi thành sự kiện của lượt | FR-14, FR-31 |
| EX-03 | Mất mã QR/thẻ | Staff | Staff tìm lượt đang mở theo biển số và xác nhận thủ công; ghi sự kiện LOST_CARD; xe ra bình thường; không thu phí phạt | FR-14, FR-31 |
| EX-04 | Xe đã có lượt gửi đang mở | Staff | Từ chối ghi nhận xe vào lần thứ hai | FR-11, FR-13 |
| EX-05 | Bãi tạm ngưng hoạt động | Staff, Manager | Từ chối xe vào, thông báo rõ; xe vẫn ra được; từ chối đặt chỗ mới, giữ đặt chỗ đang chờ; màn hình chỗ trống hiện nhãn "Tạm ngưng" | FR-07, FR-11, FR-14, FR-19a, FR-21 |

Mỗi ngoại lệ có ít nhất 1 yêu cầu xử lý ở mục 3 và một kịch bản kích hoạt trong bộ mô phỏng (FR-33).

## 6. Ngoài phạm vi

| Hạng mục | Loại | Lý do / nguồn |
|---|---|---|
| Tích hợp cổng thanh toán thật | Ngoài phạm vi | Q05 |
| Tích hợp phần cứng thật (camera, đầu đọc RFID, barie) | Ngoài phạm vi | Q02, Q06 |
| Tích hợp SSO của trường | Ngoài phạm vi | Q06 |
| Triển khai thực tế nhiều bãi | Ngoài phạm vi | Q04 (mô hình dữ liệu vẫn hỗ trợ) |
| Ứng dụng native Android/iOS | Ngoài phạm vi | Q12 |
| Giờ hoạt động của bãi | Ngoài phạm vi | M1 1.4.2, D-04 |
| Phí theo giờ, vé tháng | Ngoài phạm vi | M1 1.4.2, D-03 |
| Theo dõi từng ô đỗ riêng lẻ | Ngoài phạm vi | Q17 |
| Vai trò quản trị viên riêng | Ngoài phạm vi | Q25 |
| Triển khai trực tuyến | Ngoài phạm vi | D-16 (demo chạy cục bộ) |

## 7. Giả định và vấn đề mở

### 7.1 Giả định đang áp dụng

| ID | Giả định | Nguồn |
|---|---|---|
| AS1 | Dữ liệu thiết bị được mô phỏng bằng phần mềm | Q06 |
| AS2 | Thanh toán dừng ở mức mô phỏng | Q05 |
| AS3 | Người dùng tự đăng ký, không SSO | Q06 |
| AS4 | Thí điểm một bãi | Q04 |
| AS5 | Ba vai trò; quản trị gộp vào Manager | Q07, Q25 |
| AS6 | Lưu biển số 12 tháng rồi xóa | Q18 |
| AS7 | Giá trị nền là ước tính, đánh giá bằng dữ liệu mô phỏng | Q10, Q26 |
| AS8 | Không ràng buộc công nghệ, hosting | Q12 |
| AS12 | Chỗ trống tính theo lượt vào/ra của khu vực | Q17 |
| AS13 | 5 ngoại lệ cốt lõi | Q21 |
| AS14 | Bãi thí điểm 3 khu vực, khoảng 300 chỗ xe máy và 30 chỗ ô tô | Q24 |
| AS20 | Các giả định của nhóm ở mục 7.2 được dùng cho đến khi khách hàng trả lời. Đến tuần này nhóm mới gửi câu hỏi vòng 1 và vòng 2; các câu ở 7.2 chưa gửi | Danh sách câu hỏi dự kiến cho vòng 3 (A-16) |

### 7.2 Câu hỏi dự kiến cho vòng 3 (chưa gửi khách hàng)

| Câu hỏi | Giả định của nhóm | Yêu cầu bị ảnh hưởng | Mức ảnh hưởng nếu trả lời khác |
|---|---|---|---|
| R3-Q1 | Một tài khoản nhiều xe, không giới hạn; biển số duy nhất; xe vãng lai được gán khi đăng ký | FR-06, FR-06a | Thấp đến Cao (nếu biển số không duy nhất) |
| R3-Q2 | Nhóm tự chọn khi đăng ký; xe vãng lai tính mức Khách | FR-01, FR-12, FR-26 | Thấp đến Cao (nếu không cho xe chưa đăng ký vào) |
| R3-Q3 | Đặt chỗ trừ chỗ ngay; chỉ trong ngày; đến sớm vẫn tính; vào khu vực khác thì hủy | FR-20 đến FR-25 | Thấp đến Vừa |
| R3-Q4 | Bãi tạm ngưng vẫn cho xe ra; từ chối đặt chỗ mới; giữ đặt chỗ đang chờ | FR-14, FR-21, EX-05 | Thấp |
| R3-Q5 | Mất QR/thẻ: tra theo biển số, xác nhận thủ công, không phạt | FR-14, EX-03 | Vừa (nếu có phí phạt) |
| R3-Q6 | Che biển số trên lượt cũ, giữ số liệu; Manager bấm xóa thủ công | FR-32 | Thấp đến Vừa |
| R3-Q7 | Công thức 4 chỉ số như FR-29 | FR-29 | Thấp |
| R3-Q8 | Giao diện song ngữ Việt/Anh có nút chuyển | FR-05 | Thấp |
| R3-Q9 | Staff xác nhận thanh toán khi xe ra | FR-14, FR-27 | Vừa |

Các câu này sẽ được gửi trong hoạt động A-16. Câu trả lời khác giả định sau khi đóng băng Baseline V1.0 được xử lý bằng yêu cầu thay đổi (CR) trong Change Log.

## 8. Truy vết

### 8.1 Mục tiêu → yêu cầu

| Mục tiêu | Yêu cầu Must | Yêu cầu Should / Could |
|---|---|---|
| O1 Biết trước chỗ trống | FR-07, FR-08, FR-17, FR-18, FR-19, FR-19a, FR-33, NFR-06 | FR-25 |
| O2 Số hóa quy trình vào/ra | FR-06, FR-06a, FR-11 đến FR-16, FR-33, FR-34, NFR-05 | — |
| O3 Theo dõi nhu cầu | FR-17, FR-19 | FR-20 đến FR-25, FR-29 |
| O4 Xử lý ngoại lệ, tính phí nhất quán | EX-01 đến EX-05, FR-09, FR-14 | FR-26 đến FR-28 |
| O5 Bàn giao đạt nghiệm thu, bảo vệ dữ liệu | FR-01 đến FR-05, FR-10, FR-30 đến FR-32, NFR-01 đến NFR-04, NFR-07, NFR-08, NFR-11 | — |

### 8.2 Yêu cầu → sản phẩm

| Sản phẩm | Yêu cầu |
|---|---|
| P07 Xác thực và phân quyền | FR-01 đến FR-05, FR-30, FR-31, FR-32, NFR-01 đến NFR-04 |
| P08 Thông tin bãi | FR-07 đến FR-10 |
| P05 Xe ra/vào | FR-06, FR-06a, FR-11 đến FR-16, EX-01 đến EX-05, NFR-05, NFR-06 |
| P09 Chỗ trống | FR-17 đến FR-19a |
| P04 Bộ mô phỏng | FR-33, FR-34 |
| P06 Đặt chỗ | FR-20 đến FR-25 |
| P10 Thanh toán mô phỏng | FR-26 đến FR-28 |
| P11 Báo cáo | FR-29 |

Bản truy vết tổng hợp đến hoạt động, nguồn lực, rủi ro, kiểm thử và checkpoint nằm ở báo cáo M2 mục 2.13 (P24).

## 9. Tự kiểm theo tiêu chí chất lượng PD-P02

| # | Tiêu chí | Kết quả tự kiểm |
|---|---|---|
| 1 | 100% hạng mục Must ở M1 1.4.1 có ít nhất 1 FR | Đạt: nền tảng (FR-01 đến FR-05), xe vào/ra (FR-11 đến FR-16), chỗ trống (FR-17 đến FR-19a), thông tin bãi (FR-07 đến FR-09), bảo mật (FR-30 đến FR-32) |
| 2 | Mỗi yêu cầu có tiêu chí chấp nhận kiểm tra được | Đạt: cột "Tiêu chí chấp nhận" của mục 3, 4 |
| 3 | Mỗi yêu cầu có nguồn và mục tiêu | Đạt; NFR-09, NFR-10 là ràng buộc, không gắn O |
| 4 | Không có yêu cầu thuộc danh sách ngoài phạm vi | Đạt |
| 5 | Mỗi ngoại lệ có ít nhất 1 FR xử lý | Đạt (mục 5) |
| 6 | Không mâu thuẫn; số liệu khớp báo cáo M2 mục 2.0.2 | Đạt |
| 7 | Ít nhất 2 thành viên khác review | Chờ CP-01 (A-09) |
