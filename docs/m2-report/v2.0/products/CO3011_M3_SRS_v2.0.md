# CO3011_M3_SRS_v2.0

**CO3011 - QUẢN LÝ DỰ ÁN PHẦN MỀM**

**P02 - Đặc tả yêu cầu phần mềm (SRS)**

_Hệ thống Quản lý Bãi đỗ xe Thông minh (Smart Parking Management System)_

| **Thông tin** | **Chi tiết** |
| --- | --- |
| Tên file | CO3011\_M3\_SRS\_v2.0 |
| Nhóm | 11 |
| Chủ sở hữu | Phạm Duy Quý |
| Người review | Tech lead (Nguyễn Võ Đức Sơn), QA (Đào Xuân Sơn) |
| Phiên bản | v2.0 (đồng bộ với mã nguồn theo A-70, KB-11) |
| Mục tiêu liên quan | O1, O2, O3, O4, O5 |
| Căn cứ | Báo cáo M1 v0.2 (P23), Client Interaction Log Q01 đến Q35 và Phase 4 (P15), PD-P02, Đặc tả API P18 mục 10 (KB-11, D-41) |

## Kiểm soát tài liệu

| **Phiên bản** | **Ngày** | **Người thực hiện** | **Mục thay đổi** | **Tóm tắt thay đổi** |
| --- | --- | --- | --- | --- |
| v0.1 | 13/11/2026 | Phạm Duy Quý | Toàn bộ | Tạo bản nháp đầu tiên theo PD-P02 |
| v0.2 | 15/11/2026 | Phạm Duy Quý | 2.1, 2.2, 3.5, 3.6, 3.7, 3.8, 3.9, 4.2, 5, 7 | Cập nhật theo phản hồi Phase 4 (Q27 đến Q35): sửa FR-31, FR-32, FR-38, FR-39, FR-41, FR-46 đến FR-48, EX-01 đến EX-03; thêm FR-51, FR-52; thêm AS28; cập nhật trạng thái giả định và vấn đề mở |
| v2.0 | 22/11/2026 | Phạm Duy Quý | 1.2, 3, 3.5, 7, 8, 9 | Đồng bộ phần đặt chỗ với mã nguồn theo A-70 (KB-11): làm rõ khung giờ đặt và quyền sở hữu xe (FR-27); thêm điều kiện từ chối khi xe đã có đặt chỗ đang hiệu lực (FR-28); làm rõ điều kiện hủy, quyền hủy và lý do hủy (FR-29, FR-32, FR-33); thêm FR-53 (từ chối đặt chỗ cho xe đang gửi); thêm AS29; thêm mã lỗi `RESERVATION_LIMIT` (FR-28) và `EARLY_ARRIVAL` (FR-51); thêm mục 9 ghi các điểm mã nguồn chưa đáp ứng yêu cầu đã được khách hàng xác nhận (FR-52, phần hiển thị của FR-51) và các điểm đã xử lý trong mã |

**Mục lục**

# 1\. Giới thiệu

## 1.1 Mục đích

Tài liệu này đặc tả các yêu cầu chức năng và phi chức năng của Hệ thống Quản lý Bãi đỗ xe Thông minh. SRS là căn cứ chung cho thiết kế kiến trúc và API (P18), thiết kế CSDL (P03), thiết kế giao diện (P19), bộ mô phỏng thiết bị (P04), các mô-đun phần mềm (P05 đến P11), kế hoạch kiểm thử (P20), bộ test nghiệm thu (P21) và ma trận truy vết (P24). Nghiệm thu dựa trên các workflow cốt lõi chạy xuyên suốt, xử lý được các ngoại lệ và đáp ứng yêu cầu đã thống nhất (Q11).

## 1.2 Phạm vi

Hệ thống là ứng dụng web responsive phục vụ ba vai trò Customer, Staff và Manager. Phiên bản đầu tiên thí điểm tại một bãi đỗ (3 khu vực, khoảng 300 chỗ xe máy và 30 chỗ ô tô), nhưng thiết kế hỗ trợ nhiều bãi. Dữ liệu thiết bị và thanh toán đều ở mức mô phỏng. Bảng dưới đây đối chiếu các hạng mục trong phạm vi ở M1 mục 1.4.1 với yêu cầu trong SRS.

| **Hạng mục trong phạm vi (M1 1.4.1)** | **Ưu tiên** | **Yêu cầu tương ứng** |
| --- | --- | --- |
| Nền tảng: đăng ký, đăng nhập, đăng xuất, RBAC 3 vai trò | Must | FR-01, FR-02, FR-03, FR-06, FR-07 |
| Quản lý xe vào/ra: ghi nhận lượt, phân loại xe, tính thời gian gửi | Must | FR-09 đến FR-15 |
| Theo dõi trạng thái chỗ đỗ theo loại xe, gần thời gian thực | Must | FR-17 đến FR-21, NFR-05 |
| Quản lý thông tin bãi: tạo/sửa bãi, địa chỉ, sức chứa, giờ hoạt động, bảng giá | Must | FR-22 đến FR-26 |
| Bảo mật dữ liệu: mã hóa mật khẩu, RBAC, che biển số, nhật ký truy cập | Must | FR-06, FR-42 đến FR-45, NFR-01 đến NFR-03 |
| Đặt chỗ trước: tạo, hủy, giữ chỗ, tự hết hạn | Should | FR-27 đến FR-33, FR-51 đến FR-53 |
| Thanh toán mô phỏng: tính phí, xác nhận, lịch sử giao dịch | Should | FR-34 đến FR-37 |
| Phạm vi bãi đỗ: thí điểm một bãi, thiết kế nhiều bãi | Should | NFR-11 |
| Báo cáo cơ bản: công suất, lưu lượng theo giờ/ngày, doanh thu mô phỏng | Could | FR-38 đến FR-41 |

## 1.3 Mục tiêu dự án được truy vết

| **ID** | **Mục tiêu (M1 1.4.3)** |
| --- | --- |
| O1 | Giúp người lái xe biết trước tình trạng chỗ trống để giảm thời gian tìm chỗ đỗ. |
| O2 | Số hóa quy trình xe vào/ra để việc giám sát không còn phụ thuộc ghi chép thủ công. |
| O3 | Tối ưu hiệu suất sử dụng chỗ đỗ và hỗ trợ ban quản lý theo dõi nhu cầu. |
| O4 | Giảm sai sót và tranh chấp trong tính phí và xử lý các trường hợp ngoại lệ. |
| O5 | Bàn giao theo phạm vi đã thống nhất, đạt tiêu chí nghiệm thu của khách hàng. |

## 1.4 Thuật ngữ

| **Thuật ngữ** | **Định nghĩa** |
| --- | --- |
| Lượt gửi | Một lần xe vào bãi tới khi xe ra; "đang mở" khi xe chưa ra, "đã đóng" khi xe đã ra. |
| Khu vực | Phần của bãi có sức chứa riêng cho xe máy và ô tô. |
| Mã lượt gửi | Mã QR hoặc thẻ mô phỏng cấp khi xe vào, dùng để tìm lượt khi xe ra. |
| Khách vãng lai | Xe có biển số chưa gắn với tài khoản nào; tính phí theo nhóm "Khách". |
| Đặt chỗ đang hiệu lực | Đặt chỗ chưa hủy, chưa đến và chưa quá giờ hẹn 30 phút. |
| Không đến (no-show) | Đặt chỗ bị tự hủy vì xe chưa vào sau giờ hẹn 30 phút. |
| Bộ mô phỏng | Phần mềm sinh sự kiện thiết bị vào/ra thay cho QR, RFID, camera thật (P04). |
| MoSCoW | Mức ưu tiên Must, Should, Could, Won't như đã chọn ở M1. |

## 1.5 Quy ước

- Mã yêu cầu: FR-xx (chức năng), NFR-xx (phi chức năng), EX-xx (ngoại lệ), đăng ký trong ID Registry.
- Ưu tiên theo MoSCoW như M1: Must, Should, Could.
- Nguồn: mã câu hỏi khách hàng (Q), giả định (AS), ràng buộc (CN), mục của M1 hoặc khác biệt spec ↔ mã (KB, theo P18 mục 10). Mục tiêu: O1 đến O5.
- Mỗi yêu cầu là một câu bắt đầu bằng "Hệ thống phải..." và có tiêu chí chấp nhận kiểm tra được. Mã lỗi API trong ngoặc (ví dụ `ZONE_FULL`) lấy theo P18 mục 6.1, dùng để đối chiếu với bộ test.
- Câu hỏi Q01 đến Q13 dùng mã theo M1 Phụ lục A; Q14 trở đi theo Client Interaction Log; Q27 đến Q35 ứng với câu 1 đến 9 của Client Interaction Log - Phase 4.

# 2\. Vai trò người dùng

## 2.1 Danh sách vai trò

| **Vai trò** | **Đối tượng** | **Chức năng chính** | **Nguồn** |
| --- | --- | --- | --- |
| Customer | Người gửi xe: sinh viên, giảng viên, nhân viên đã đăng ký tài khoản | Xem chỗ trống và thông tin bãi, quản lý xe của mình, đặt chỗ, xem lịch sử lượt gửi và giao dịch | Q07, AS5, S1 |
| Staff | Nhân viên bãi đỗ | Ghi nhận lượt vào/ra, tra cứu lượt gửi, xác nhận thanh toán mô phỏng, xử lý ngoại lệ, theo dõi chỗ trống; xem thông tin xe, lượt gửi, đặt chỗ và tình trạng bãi cần cho nghiệp vụ | Q07, Q34, AS5, AS22, S2 |
| Manager | Quản lý bãi đỗ, gộp quyền quản trị hệ thống | Quản lý bãi, khu vực, bảng giá, tài khoản; xem báo cáo và nhật ký truy cập | Q07, Q25, AS5, S5 |

Khách vãng lai không có tài khoản: xe được Staff ghi nhận vào/ra và tính phí theo nhóm "Khách" (AS18).

## 2.2 Ma trận phân quyền

| **Chức năng** | **Customer** | **Staff** | **Manager** |
| --- | --- | --- | --- |
| Đăng ký, đăng nhập, quản lý hồ sơ và xe của mình | ✓ | Đăng nhập | Đăng nhập |
| Xem thông tin bãi và chỗ trống | ✓ | ✓ | ✓ |
| Ghi nhận lượt vào/ra, tra cứu lượt, xử lý ngoại lệ tại cổng | | ✓ | |
| Xác nhận thanh toán mô phỏng | | ✓ | |
| Xem đặt chỗ đang hiệu lực và thông tin xe của bãi; tiếp nhận xe đến sớm | | ✓ | |
| Đặt chỗ, hủy đặt chỗ, xem đặt chỗ của mình | ✓ | | |
| Xem lịch sử lượt gửi và giao dịch | Của mình | Của bãi (đang làm) | Toàn bộ |
| Quản lý bãi, khu vực, sức chứa, bảng giá, trạng thái bãi | | | ✓ |
| Quản lý tài khoản và nhóm người dùng | | | ✓ |
| Xem báo cáo | | | ✓ |
| Xem nhật ký truy cập | | | ✓ |

## 2.3 Hiển thị biển số theo vai trò

| **Vai trò** | **Biển số hiển thị** |
| --- | --- |
| Customer | Đầy đủ với xe thuộc tài khoản của mình; không xem được biển số của người khác. |
| Staff | Đầy đủ với lượt gửi đang mở trong bãi (cần để xử lý EX-02, EX-03); đã che với lượt đã đóng. |
| Manager | Đầy đủ; mỗi lần xem biển số đầy đủ được ghi nhật ký (FR-43). |
| Báo cáo | Không hiển thị biển số. |

# 3\. Yêu cầu chức năng

Có 53 yêu cầu chức năng: 32 Must, 17 Should, 4 Could.

## 3.1 Nền tảng (tài khoản, đăng nhập, phân quyền)

_Hạng mục phạm vi: 1.4.1 - Nền tảng (Must)._

| **ID** | **Mô tả** | **Ưu tiên** | **Nguồn (Q/AS)** | **Mục tiêu (O)** | **Tiêu chí chấp nhận** |
| --- | --- | --- | --- | --- | --- |
| FR-01 | Hệ thống phải cho phép người dùng tự đăng ký tài khoản Customer bằng họ tên, email, mật khẩu và nhóm người dùng (Sinh viên hoặc Giảng viên/Nhân viên). | Must | Q08, AS3, AS18 | O1 | Đăng ký với dữ liệu hợp lệ tạo được tài khoản và đăng nhập được ngay; email đã tồn tại hoặc mật khẩu dưới 8 ký tự bị từ chối kèm thông báo lỗi. |
| FR-02 | Hệ thống phải cho phép người dùng đăng nhập bằng email và mật khẩu và chuyển tới màn hình theo vai trò. | Must | Q07, AS5 | O4 | Đăng nhập đúng mở màn hình đúng vai trò (Customer, Staff, Manager); sai email hoặc mật khẩu hiển thị một thông báo chung, không nói rõ sai trường nào. |
| FR-03 | Hệ thống phải cho phép người dùng đăng xuất và tự kết thúc phiên sau 30 phút không thao tác. | Must | CN4, AS25 | O4 | Sau khi đăng xuất hoặc sau 30 phút không thao tác, mọi yêu cầu tới chức năng cần đăng nhập đều bị từ chối và chuyển về màn hình đăng nhập. |
| FR-04 | Hệ thống phải cho phép Customer đăng ký nhiều xe vào tài khoản, mỗi xe gồm biển số và loại xe (xe máy hoặc ô tô). | Must | Q05, Q29, AS17 | O2 | Thêm được ít nhất 3 xe vào một tài khoản; biển số đã thuộc tài khoản khác bị từ chối kèm thông báo; mỗi biển số chỉ tồn tại một lần trong hệ thống. |
| FR-05 | Hệ thống phải gán các lượt gửi trước đó của một biển số vãng lai cho tài khoản khi Customer đăng ký biển số đó. | Should | Q29, AS17 | O2 | Sau khi đăng ký một biển số đã có lượt gửi vãng lai, các lượt này hiện trong lịch sử của Customer. |
| FR-06 | Hệ thống phải kiểm tra quyền của vai trò trước mỗi chức năng theo ma trận phân quyền ở mục 2.2. | Must | Q07, Q25, AS5, AS22 | O4 | Với mỗi ô của ma trận 2.2, gọi chức năng bằng vai trò không có quyền đều bị từ chối (mã lỗi 403) và được ghi vào nhật ký truy cập. |
| FR-07 | Hệ thống phải cho phép Manager xem danh sách tài khoản, tạo tài khoản Staff hoặc Manager, khóa hoặc mở khóa tài khoản và đổi nhóm người dùng của Customer. | Must | Q25, AS22 | O4 | Tài khoản bị khóa không đăng nhập được; tài khoản Staff do Manager tạo đăng nhập được và chỉ thấy chức năng của Staff. |
| FR-08 | Hệ thống phải cho phép Customer xem và sửa họ tên, mật khẩu và nhóm người dùng của mình. | Should | Q08, AS18 | O1 | Thông tin sửa xong hiển thị đúng ở lần đăng nhập sau; đổi mật khẩu yêu cầu nhập mật khẩu cũ. |

## 3.2 Quản lý xe vào/ra

_Hạng mục phạm vi: 1.4.1 - Quản lý xe vào/ra (Must)._

| **ID** | **Mô tả** | **Ưu tiên** | **Nguồn (Q/AS)** | **Mục tiêu (O)** | **Tiêu chí chấp nhận** |
| --- | --- | --- | --- | --- | --- |
| FR-09 | Hệ thống phải ghi nhận lượt xe vào từ sự kiện thiết bị mô phỏng (QR, RFID hoặc biển số), gồm bãi, khu vực, cổng, loại xe, biển số và thời điểm vào. | Must | Q06, AS1 | O2 | Mỗi sự kiện vào hợp lệ từ bộ mô phỏng tạo đúng 1 lượt gửi đang mở với đủ 6 trường dữ liệu. |
| FR-10 | Hệ thống phải cho phép Staff ghi nhận thủ công lượt vào hoặc lượt ra khi thiết bị mô phỏng không gửi được dữ liệu. | Must | Q06, AS1 | O2 | Lượt ghi thủ công có cùng các trường như lượt từ thiết bị và được đánh dấu "thủ công" kèm tài khoản Staff thực hiện. |
| FR-11 | Hệ thống phải xác định chủ xe theo biển số khi xe vào: biển số đã đăng ký thì gắn với tài khoản và nhóm người dùng, biển số chưa đăng ký thì ghi là khách vãng lai. | Must | Q29, Q30, AS17, AS18 | O2 | Xe có biển số đã đăng ký được gắn đúng tài khoản; xe chưa đăng ký được ghi nhóm "Khách". |
| FR-12 | Hệ thống phải cấp cho mỗi lượt vào một mã lượt gửi duy nhất dạng QR hoặc thẻ mô phỏng. | Must | Q06, AS1 | O2 | Hai lượt gửi bất kỳ không có cùng mã; quét mã trả về đúng lượt gửi. |
| FR-13 | Hệ thống phải ghi nhận lượt xe ra bằng cách tìm lượt đang mở theo mã lượt gửi hoặc biển số, rồi đóng lượt với thời điểm ra. | Must | Q06, AS1 | O2 | Sau khi ra, lượt chuyển sang trạng thái đã đóng, có thời điểm ra, và xe không còn lượt đang mở. |
| FR-14 | Hệ thống phải tính thời gian gửi bằng thời điểm ra trừ thời điểm vào và hiển thị cho Staff khi xe ra. | Must | 1.4.1, AS1 | O2 | Với 10 lượt mẫu, thời gian gửi hiển thị khớp phép tính tay tới từng phút. |
| FR-15 | Hệ thống phải cho phép Staff tra cứu lượt gửi đang mở trong bãi theo biển số hoặc mã lượt gửi. | Must | Q21, AS13 | O2 | Tra cứu bằng biển số hoặc mã của một lượt đang mở trả về đúng lượt đó. |
| FR-16 | Hệ thống phải cho phép Staff xem danh sách lượt vào/ra của bãi, lọc theo khoảng thời gian và loại xe. | Should | Q06, AS1 | O2 | Danh sách sau khi lọc chỉ gồm các lượt thỏa điều kiện lọc; số dòng khớp với số lượt trong kịch bản mô phỏng. |

## 3.3 Theo dõi trạng thái chỗ đỗ

_Hạng mục phạm vi: 1.4.1 - Theo dõi trạng thái chỗ đỗ (Must)._

| **ID** | **Mô tả** | **Ưu tiên** | **Nguồn (Q/AS)** | **Mục tiêu (O)** | **Tiêu chí chấp nhận** |
| --- | --- | --- | --- | --- | --- |
| FR-17 | Hệ thống phải tính số chỗ trống của từng khu vực theo từng loại xe bằng sức chứa trừ số lượt đang mở trừ số đặt chỗ đang hiệu lực. | Must | Q05, Q17, AS12, AS19 | O1 | Trong kịch bản 100 lượt, số chỗ trống của mỗi khu vực và loại xe khớp 100% với số đếm tay. |
| FR-18 | Hệ thống phải cập nhật số chỗ trống sau mỗi lượt vào, lượt ra, đặt chỗ, hủy đặt chỗ và đặt chỗ hết hạn. | Must | Q17, AS12 | O1 | Sau mỗi loại sự kiện trong 5 loại trên, số chỗ trống đổi đúng 1 đơn vị ở đúng khu vực và loại xe. |
| FR-19 | Hệ thống phải cho phép Customer xem số chỗ trống theo bãi, khu vực và loại xe, kèm thời điểm cập nhật gần nhất. | Must | Q01, Q05 | O1 | Màn hình hiển thị chỗ trống riêng cho xe máy và ô tô của từng khu vực và thời điểm cập nhật. |
| FR-20 | Hệ thống phải cho phép Staff và Manager xem số chỗ trống và số chỗ đã dùng của từng khu vực trong bãi. | Must | Q01, Q05 | O1, O3 | Tổng chỗ trống và chỗ đã dùng của mỗi khu vực bằng sức chứa của khu vực đó. |
| FR-21 | Hệ thống phải hiển thị trạng thái "Hết chỗ" cho khu vực và loại xe có số chỗ trống bằng 0. | Must | Q21, AS13 | O1, O4 | Khi chỗ trống về 0, cả màn hình Customer và Staff hiển thị "Hết chỗ" cho đúng khu vực và loại xe. |

## 3.4 Quản lý thông tin bãi đỗ

_Hạng mục phạm vi: 1.4.1 - Quản lý thông tin bãi đỗ (Must); Phạm vi bãi đỗ (Should)._

| **ID** | **Mô tả** | **Ưu tiên** | **Nguồn (Q/AS)** | **Mục tiêu (O)** | **Tiêu chí chấp nhận** |
| --- | --- | --- | --- | --- | --- |
| FR-22 | Hệ thống phải cho phép Manager tạo và sửa bãi đỗ gồm tên, địa chỉ, giờ hoạt động và trạng thái hoạt động. | Must | Q01, Q14, AS9 | O1 | Bãi tạo mới hiển thị đủ 4 trường cho Customer; sửa giờ hoạt động có hiệu lực ngay ở màn hình xem bãi. |
| FR-23 | Hệ thống phải cho phép Manager tạo khu vực trong bãi và đặt sức chứa riêng cho xe máy và ô tô của từng khu vực. | Must | Q05, Q14, AS9, AS14 | O1 | Tạo được bãi thí điểm 3 khu vực với tổng 300 chỗ xe máy và 30 chỗ ô tô; sức chứa âm hoặc không phải số nguyên bị từ chối. |
| FR-24 | Hệ thống phải cho phép Manager lập bảng giá theo bãi, loại xe và nhóm người dùng (Sinh viên, Giảng viên/Nhân viên, Khách), mỗi mục chọn cách tính theo lượt hoặc theo giờ. | Must | Q14, Q16, AS11, AS18 | O4 | Lập được đủ 6 mục giá (2 loại xe × 3 nhóm); mục giá thiếu đơn giá hoặc đơn giá âm bị từ chối. |
| FR-25 | Hệ thống phải cho phép Manager chuyển trạng thái bãi giữa "Hoạt động" và "Tạm ngưng". | Must | Q14, Q32, AS9, AS20 | O4 | Đổi trạng thái được ghi vào nhật ký truy cập; trạng thái mới hiển thị ngay cho Customer và Staff. |
| FR-26 | Hệ thống phải cho phép Customer xem thông tin bãi gồm địa chỉ, giờ hoạt động, trạng thái và bảng giá áp dụng cho nhóm của mình. | Must | Q14, AS9 | O1 | Màn hình bãi hiển thị đúng bảng giá theo nhóm của Customer đang đăng nhập. |

## 3.5 Đặt chỗ trước

_Hạng mục phạm vi: 1.4.1 - Đặt chỗ trước (Should)._

| **ID** | **Mô tả** | **Ưu tiên** | **Nguồn (Q/AS)** | **Mục tiêu (O)** | **Tiêu chí chấp nhận** |
| --- | --- | --- | --- | --- | --- |
| FR-27 | Hệ thống phải cho phép Customer đặt chỗ cho một xe thuộc tài khoản của mình tại một khu vực, với giờ hẹn từ thời điểm hiện tại tới hết ngày hiện tại, khi khu vực còn chỗ cho loại xe đó, và giữ chỗ tới 30 phút sau giờ hẹn. | Should | Q02, Q15, AS10, AS19, KB-11 | O3 | Đặt chỗ thành công làm số chỗ trống giảm 1 và chỗ được giữ tới giờ hẹn + 30 phút; giờ hẹn đã qua hoặc thuộc ngày khác bị từ chối (`RESERVATION_WINDOW`); khu vực hết chỗ bị từ chối (`ZONE_FULL`); đặt bằng xe không thuộc tài khoản bị từ chối (`NOT_OWNER`); mỗi trường hợp từ chối đều có thông báo lý do. |
| FR-28 | Hệ thống phải giới hạn mỗi Customer có tối đa 1 đặt chỗ đang hiệu lực, và mỗi xe có tối đa 1 đặt chỗ đang hiệu lực. | Should | Q31, AS19, AS29, KB-11 | O3 | Tạo đặt chỗ thứ hai khi đặt chỗ thứ nhất còn hiệu lực bị từ chối, kể cả khi dùng xe khác của cùng tài khoản (`RESERVATION_LIMIT`); đặt chỗ cho xe đã có đặt chỗ đang hiệu lực bị từ chối với lý do "Xe đã có đặt chỗ" (`VEHICLE_ALREADY_RESERVED`); số chỗ trống không đổi. |
| FR-29 | Hệ thống phải chỉ cho phép Customer hủy đặt chỗ đang hiệu lực của chính mình trước giờ hẹn. | Should | Q15, AS10, KB-11 | O3 | Hủy trước giờ hẹn chuyển đặt chỗ sang "Đã hủy" với lý do "Khách hủy", số chỗ trống tăng 1, và lượt hủy không bị tính là không đến; hủy đặt chỗ không thuộc tài khoản, không còn hiệu lực hoặc đã qua giờ hẹn đều bị từ chối với cùng một thông báo (`NOT_CANCELLABLE`), không cho biết đặt chỗ đó có tồn tại hay không. |
| FR-30 | Hệ thống phải tự hủy đặt chỗ và ghi là "Không đến" khi xe chưa vào sau giờ hẹn 30 phút. | Should | Q15, AS10 | O3 | Ở phút thứ 31 sau giờ hẹn, đặt chỗ chuyển sang "Không đến" và số chỗ trống tăng 1. |
| FR-31 | Hệ thống phải chỉ đánh dấu đặt chỗ là "Đã đến" khi lượt vào của xe đã đặt được tạo tại đúng khu vực trong khoảng từ giờ hẹn tới 30 phút sau giờ hẹn, hoặc khi Staff xác nhận tiếp nhận xe đến sớm theo FR-51. | Should | Q31, AS19 | O3 | Xe vào đúng khu vực trong khoảng giờ hẹn tới +30 phút làm đặt chỗ chuyển sang "Đã đến" và không bị trừ chỗ hai lần; xe đến sớm không tự chuyển sang "Đã đến" khi chưa có xác nhận của Staff. |
| FR-32 | Hệ thống phải hủy đặt chỗ và tiếp nhận xe như khách vãng lai tại khu vực mới, áp dụng mức phí tương ứng, khi xe đã đặt vào khu vực khác với khu vực đã đặt. | Should | Q31, AS19, D-41 | O3 | Xe vào khu vực khác làm đặt chỗ chuyển sang "Đã hủy" với lý do "Vào khu vực khác" kèm khu vực thực tế, chỗ đã giữ được trả lại, và lượt vào được tính ở khu vực thực tế. |
| FR-33 | Hệ thống phải cho phép Customer xem danh sách đặt chỗ của mình, trạng thái của từng đặt chỗ và lý do hủy với đặt chỗ đã hủy. | Should | Q15, AS10, D-41 | O3 | Danh sách hiển thị đúng 4 trạng thái: Đang hiệu lực, Đã đến, Đã hủy, Không đến; mỗi đặt chỗ "Đã hủy" hiển thị lý do (Khách hủy hoặc Vào khu vực khác), và với "Vào khu vực khác" có tên khu vực thực tế. |
| FR-51 | Hệ thống phải hiển thị đặt chỗ đang hiệu lực cho Staff khi xe đã đặt đến trước giờ hẹn và chỉ tạo lượt vào sau khi Staff kiểm tra tình trạng chỗ và xác nhận tiếp nhận. | Should | Q31, AS19 | O3 | Xe đến trước giờ hẹn: Staff thấy thông tin đặt chỗ; chưa xác nhận thì lượt vào bị từ chối (`EARLY_ARRIVAL`), không có lượt vào và đặt chỗ vẫn "Đang hiệu lực"; sau khi xác nhận, lượt vào được tạo và đặt chỗ chuyển sang "Đã đến". |
| FR-52 | Hệ thống phải cho phép Staff xem các đặt chỗ đang hiệu lực của bãi cùng thông tin xe đã đặt. | Should | Q34, AS22 | O3 | Màn hình của Staff liệt kê đúng các đặt chỗ đang hiệu lực của bãi, mỗi dòng có khu vực, giờ hẹn, loại xe và biển số. |
| FR-53 | Hệ thống phải từ chối đặt chỗ cho xe đang có lượt gửi đang mở. | Should | AS29, KB-11 | O3 | Tạo đặt chỗ cho xe đang gửi trong bãi bị từ chối với lý do "Xe đang gửi" (`VEHICLE_PARKED`); không có đặt chỗ mới và số chỗ trống không đổi. |

## 3.6 Thanh toán mô phỏng

_Hạng mục phạm vi: 1.4.1 - Thanh toán mô phỏng (Should)._

| **ID** | **Mô tả** | **Ưu tiên** | **Nguồn (Q/AS)** | **Mục tiêu (O)** | **Tiêu chí chấp nhận** |
| --- | --- | --- | --- | --- | --- |
| FR-34 | Hệ thống phải tính phí khi xe ra theo mục bảng giá của bãi, loại xe và nhóm người dùng: theo lượt thì bằng đơn giá, theo giờ thì bằng đơn giá nhân số giờ gửi làm tròn lên. | Should | Q03, Q16, AS2, AS11, AS26 | O4 | Bộ test tính phí (mọi tổ hợp loại xe × nhóm × cách tính, có ca gửi đúng 60 phút và 61 phút) cho kết quả đúng 100%. |
| FR-35 | Hệ thống phải cho phép Staff xác nhận thanh toán mô phỏng trước khi đóng lượt gửi khi xe ra. | Should | Q03, Q33, AS2, AS21 | O4 | Không đóng được lượt ra khi chưa xác nhận thanh toán; sau khi xác nhận, lượt đóng và giao dịch được tạo; khi lượt đang bị chặn bởi EX-02, nút xác nhận thanh toán không dùng được. |
| FR-36 | Hệ thống phải lưu mỗi giao dịch mô phỏng gồm mã lượt gửi, số tiền, mục giá áp dụng, thời điểm và Staff xác nhận. | Should | Q03, AS2 | O4 | Mỗi lượt đã thanh toán có đúng 1 giao dịch với đủ 5 trường. |
| FR-37 | Hệ thống phải cho phép Customer xem lịch sử lượt gửi và giao dịch của mình, và cho phép Manager xem lịch sử giao dịch của bãi. | Should | Q03, AS2 | O4 | Customer chỉ thấy lượt và giao dịch của xe thuộc tài khoản mình; Manager thấy toàn bộ giao dịch của bãi. |

## 3.7 Báo cáo cơ bản

_Hạng mục phạm vi: 1.4.1 - Báo cáo cơ bản (Could)._

| **ID** | **Mô tả** | **Ưu tiên** | **Nguồn (Q/AS)** | **Mục tiêu (O)** | **Tiêu chí chấp nhận** |
| --- | --- | --- | --- | --- | --- |
| FR-38 | Hệ thống phải cho Manager xem tỷ lệ sử dụng theo giờ, tính riêng cho từng khu vực và loại xe, bằng số chỗ đang dùng trung bình trong giờ chia cho sức chứa tương ứng nhân 100%. | Could | Q20, Q28, AS16 | O3 | Với dữ liệu mô phỏng của một ngày, tỷ lệ (%) của mỗi giờ, mỗi khu vực và loại xe khớp phép tính tay. |
| FR-39 | Hệ thống phải cho Manager xem 3 khung giờ (mỗi khung dài 1 giờ, tính từ đầu giờ) có nhiều lượt vào nhất trong khoảng ngày được chọn. | Could | Q20, Q28, AS16 | O3 | Ba khung giờ hiển thị khớp với 3 khung giờ có nhiều lượt vào nhất khi đếm tay. |
| FR-40 | Hệ thống phải cho Manager xem doanh thu mô phỏng theo ngày, tính bằng tổng các giao dịch đã xác nhận. | Could | Q20, Q28, AS16 | O3, O4 | Doanh thu của mỗi ngày bằng tổng số tiền giao dịch đã xác nhận trong ngày đó. |
| FR-41 | Hệ thống phải cho Manager xem tỷ lệ không đến, tính bằng số đặt chỗ "Không đến" (đã hết thời gian chờ mà xe chưa vào) chia cho (tổng số đặt chỗ trừ số đã hủy) nhân 100%. | Could | Q15, Q20, Q28, AS16 | O3 | Với kịch bản 20 đặt chỗ (có hủy, không đến và đặt chỗ còn hiệu lực), tỷ lệ hiển thị khớp phép tính tay; đặt chỗ còn hiệu lực không được tính là không đến. |

## 3.8 Bảo mật và bảo vệ dữ liệu biển số

_Hạng mục phạm vi: 1.4.1 - Bảo mật dữ liệu (Must)._

| **ID** | **Mô tả** | **Ưu tiên** | **Nguồn (Q/AS)** | **Mục tiêu (O)** | **Tiêu chí chấp nhận** |
| --- | --- | --- | --- | --- | --- |
| FR-42 | Hệ thống phải che một phần biển số (chỉ hiện 3 ký tự cuối) với vai trò không có quyền xem đầy đủ theo mục 2.3. | Must | Q12, CN4, AS5 | O4 | Đăng nhập bằng từng vai trò, các màn hình và API trả về biển số đúng dạng (đầy đủ hoặc đã che) theo bảng 2.3. |
| FR-43 | Hệ thống phải ghi nhật ký truy cập cho đăng nhập (thành công và thất bại), lần xem biển số đầy đủ, lần bị từ chối quyền, thay đổi tài khoản, bảng giá, trạng thái bãi và mọi xác nhận thủ công khi xử lý ngoại lệ. | Must | Q12, CN4 | O4 | Mỗi thao tác trong danh sách tạo 1 dòng nhật ký gồm thời điểm, tài khoản, thao tác và đối tượng. |
| FR-44 | Hệ thống phải cho phép Manager xem và lọc nhật ký truy cập theo tài khoản, loại thao tác và khoảng thời gian. | Must | Q12, CN4 | O4 | Kết quả lọc chỉ gồm các dòng thỏa điều kiện; Staff và Customer không mở được màn hình này. |
| FR-45 | Hệ thống phải tự động xóa biển số khỏi các lượt gửi đã đóng quá 12 tháng, nhưng giữ lại dữ liệu thống kê không gắn biển số. | Must | Q18, Q35, AS15, AS23 | O4 | Chạy tác vụ xóa trên dữ liệu mẫu có lượt cũ hơn 12 tháng: biển số của các lượt đó bị xóa; số lượt gửi, thời gian gửi và doanh thu của các ngày đó không đổi. |

## 3.9 Xử lý ngoại lệ

_Hạng mục phạm vi: 1.4.1 - Quản lý xe vào/ra, Đặt chỗ trước (theo Q11, Q21)._

| **ID** | **Mô tả** | **Ưu tiên** | **Nguồn (Q/AS)** | **Mục tiêu (O)** | **Tiêu chí chấp nhận** |
| --- | --- | --- | --- | --- | --- |
| FR-46 | Hệ thống phải từ chối lượt vào và thông báo tình trạng bãi cho Staff và người dùng khi khu vực đã hết chỗ cho loại xe đó, kể cả khi chỗ còn lại đều đang được giữ cho đặt chỗ còn hiệu lực (EX-01). | Must | Q21, Q31, AS13, AS19 | O4, O5 | Gửi sự kiện vào khi chỗ trống bằng 0: không có lượt mới, Staff nhận thông báo "Hết chỗ". |
| FR-47 | Hệ thống phải không tự động đóng lượt và không cho xác nhận thanh toán, đồng thời cảnh báo Staff, khi biển số đọc được lúc xe ra khác biển số của lượt gửi (EX-02). | Must | Q21, AS13 | O4, O5 | Lượt không tự đóng và chưa thanh toán được; Staff thấy cả hai biển số và chỉ xử lý tiếp sau khi kiểm tra và xác nhận thủ công; thao tác được ghi nhật ký. |
| FR-48 | Hệ thống phải cho phép Staff đóng lượt của xe mất mã QR/thẻ bằng cách tra lượt đang mở theo biển số, xác minh thông tin lượt gửi và xác nhận thủ công, không thu thêm phí phạt (EX-03). | Must | Q21, Q27, AS13 | O4, O5 | Đóng được lượt không cần mã; phí bằng phí gửi thông thường; nhật ký ghi Staff xác nhận và lý do "mất mã". |
| FR-49 | Hệ thống phải từ chối tạo lượt vào mới cho xe đang có lượt gửi đang mở và cảnh báo Staff (EX-04). | Must | Q21, Q27, AS13 | O4, O5 | Gửi sự kiện vào thứ hai cho cùng biển số khi lượt thứ nhất chưa đóng: không có lượt mới, Staff nhận cảnh báo kèm lượt đang mở. |
| FR-50 | Hệ thống phải từ chối lượt vào và đặt chỗ mới, vẫn cho xe đang gửi ra, và hủy các đặt chỗ đang hiệu lực kèm thông báo cho Customer khi bãi ở trạng thái "Tạm ngưng" (EX-05). | Must | Q21, Q27, Q32, AS13, AS20 | O3, O4, O5 | Sau khi tạm ngưng: sự kiện vào và đặt chỗ mới bị từ chối (`LOT_SUSPENDED`), xe đang gửi ra được, đặt chỗ đang hiệu lực chuyển "Đã hủy" (không tính là không đến) và Customer thấy thông báo. |

# 4\. Yêu cầu phi chức năng

Có 13 yêu cầu phi chức năng: 10 Must, 3 Should.

## 4.1 Bảo mật và quyền riêng tư

| **ID** | **Mô tả** | **Ưu tiên** | **Nguồn (Q/AS)** | **Mục tiêu (O)** | **Tiêu chí chấp nhận** |
| --- | --- | --- | --- | --- | --- |
| NFR-01 | Hệ thống phải lưu mật khẩu dưới dạng băm có salt (bcrypt hoặc tương đương), không lưu mật khẩu gốc. | Must | Q12, CN4 | O4 | Kiểm tra trực tiếp CSDL: không có cột nào chứa mật khẩu gốc; hai tài khoản cùng mật khẩu có giá trị băm khác nhau. |
| NFR-02 | Hệ thống phải yêu cầu đăng nhập cho mọi API, trừ đăng ký, đăng nhập, xem thông tin bãi và xem chỗ trống. | Must | Q12, CN4 | O4 | Gọi từng API cần đăng nhập mà không có phiên hợp lệ đều nhận mã lỗi 401. |
| NFR-03 | Hệ thống phải chỉ dùng biển số mô phỏng trong dữ liệu mẫu, kiểm thử và demo. | Must | CN4, 1.7.1 | O4 | Rà dữ liệu mẫu và kịch bản demo: mọi biển số đều sinh từ bộ mô phỏng. |

## 4.2 Hiệu năng và độ chính xác

| **ID** | **Mô tả** | **Ưu tiên** | **Nguồn (Q/AS)** | **Mục tiêu (O)** | **Tiêu chí chấp nhận** |
| --- | --- | --- | --- | --- | --- |
| NFR-04 | Hệ thống phải hoàn tất việc ghi nhận một lượt vào hoặc ra trong tối đa 3 giây kể từ khi nhận sự kiện. | Must | Q28, AS28 | O2 | Trong kịch bản 100 lượt, 100% lượt ghi nhận trong ≤ 3 giây (đo theo log thời gian). |
| NFR-05 | Hệ thống phải cập nhật số chỗ trống trên màn hình đang mở trong tối đa 5 giây sau khi lượt vào/ra được ghi nhận. | Must | Q01, AS24 | O1 | Trong kịch bản 100 lượt, 100% lần cập nhật hiển thị trong ≤ 5 giây, không cần tải lại trang. |
| NFR-06 | Hệ thống phải có số chỗ trống khớp 100% với số đếm tay sau kịch bản mô phỏng 100 lượt vào/ra. | Must | Q28, AS12, AS28 | O1 | So sánh số chỗ trống của từng khu vực và loại xe với bảng đếm tay sau kịch bản: khớp 100%. |
| NFR-07 | Hệ thống phải tạo bản ghi đầy đủ (có thời điểm vào, thời điểm ra, loại xe, khu vực) cho 100% lượt gửi đã đóng. | Must | Q28, AS28 | O2 | Truy vấn sau kịch bản 100 lượt: không có lượt đã đóng nào thiếu một trong 4 trường. |

## 4.3 Khả dụng và giao diện

| **ID** | **Mô tả** | **Ưu tiên** | **Nguồn (Q/AS)** | **Mục tiêu (O)** | **Tiêu chí chấp nhận** |
| --- | --- | --- | --- | --- | --- |
| NFR-08 | Hệ thống phải là ứng dụng web responsive dùng được trên màn hình rộng từ 360 px tới 1920 px trên phiên bản hiện hành của Chrome, Edge và Firefox. | Must | Q12, AS27 | O1 | Chạy các workflow cốt lõi ở 3 độ rộng 360, 768 và 1920 px trên 3 trình duyệt: không có chức năng nào bị che hoặc không bấm được. |
| NFR-09 | Hệ thống phải hiển thị thông báo lỗi bằng tiếng Việt nêu rõ lý do và cách khắc phục cho mỗi thao tác bị từ chối. | Should | Q11, D2 | O5 | Mỗi ca từ chối trong bộ test (dữ liệu sai, thiếu quyền, ngoại lệ EX-01 đến EX-05, từ chối đặt chỗ ở FR-27 đến FR-29 và FR-53) hiển thị thông báo có lý do. |
| NFR-10 | Hệ thống phải cho phép Staff hoàn tất một lượt vào hoặc ra thủ công trong tối đa 3 thao tác bấm sau khi nhập biển số. | Should | Q11, D1, D2 | O2 | Đếm thao tác trong kịch bản nghiệm thu: không quá 3 lần bấm cho mỗi lượt. |

## 4.4 Khả năng mở rộng và quy mô

| **ID** | **Mô tả** | **Ưu tiên** | **Nguồn (Q/AS)** | **Mục tiêu (O)** | **Tiêu chí chấp nhận** |
| --- | --- | --- | --- | --- | --- |
| NFR-11 | Hệ thống phải cho phép thêm bãi thứ hai chỉ bằng cấu hình trên giao diện, không cần sửa mã nguồn hoặc lược đồ CSDL. | Should | Q04, AS4 | O5 | Tạo bãi thứ hai với khu vực, sức chứa, bảng giá; chạy lượt vào/ra ở bãi đó; số liệu hai bãi tách biệt. |
| NFR-12 | Hệ thống phải vận hành đúng với quy mô bãi thí điểm 3 khu vực, 300 chỗ xe máy và 30 chỗ ô tô ở trạng thái đầy. | Must | Q24, AS14 | O1, O2 | Chạy mô phỏng tới khi đầy cả hai loại xe: NFR-04 và NFR-05 vẫn đạt. |
| NFR-13 | Hệ thống phải gắn mọi sự kiện và bản ghi với dấu thời gian theo múi giờ UTC+7. | Must | Q06, AS1 | O2 | Thời điểm vào/ra hiển thị khớp đồng hồ hệ thống của bộ mô phỏng. |

# 5\. Ma trận ngoại lệ

Danh sách theo AS13 (Q21, chờ xác nhận ở Q27). Mỗi ngoại lệ có ít nhất một yêu cầu xử lý ở phần 3 và được kiểm thử trong bộ test nghiệm thu (P21).

| **Mã** | **Tình huống** | **Vai trò xử lý** | **Phản hồi mong đợi của hệ thống** | **FR liên quan** |
| --- | --- | --- | --- | --- |
| EX-01 | Khu vực đã hết chỗ cho loại xe của xe đang vào (gồm cả trường hợp chỗ còn lại đã được đặt trước). | Staff | Từ chối tạo lượt vào; thông báo tình trạng "Hết chỗ" cho Staff và người dùng; màn hình Customer hiển thị "Hết chỗ". | FR-21, FR-46 |
| EX-02 | Biển số đọc được lúc xe ra khác biển số của lượt gửi. | Staff | Không tự động hoàn tất lượt gửi hoặc thanh toán; hiển thị hai biển số; Staff kiểm tra và xác nhận thủ công trước khi xử lý; ghi nhật ký. | FR-35, FR-43, FR-47 |
| EX-03 | Người gửi mất mã QR/thẻ của lượt gửi. | Staff | Staff tra lượt đang mở theo biển số, xác minh thông tin, xác nhận thủ công, ghi nhật ký; thu phí gửi thông thường, không phạt. | FR-15, FR-43, FR-48 |
| EX-04 | Xe đang có lượt gửi đang mở lại phát sinh sự kiện vào. | Staff | Từ chối tạo lượt mới; cảnh báo Staff kèm thông tin lượt đang mở. | FR-49 |
| EX-05 | Bãi chuyển sang trạng thái "Tạm ngưng". | Manager (đổi trạng thái), Staff (xử lý tại cổng) | Từ chối lượt vào và đặt chỗ mới; cho xe đang gửi ra; hủy đặt chỗ đang hiệu lực và thông báo Customer; không tính là không đến. | FR-25, FR-50 |

# 6\. Ngoài phạm vi

| **Hạng mục** | **Nguồn** | **Căn cứ** |
| --- | --- | --- |
| Tích hợp cổng thanh toán thật | Q03 | 1.4.2 |
| Tích hợp phần cứng thực tế (camera, đầu đọc RFID, barrier) | Q06 | 1.4.2 |
| Tích hợp hệ thống SSO/định danh của trường | Q08 | 1.4.2 |
| Triển khai thực tế nhiều bãi đỗ (chỉ thiết kế sẵn sàng, NFR-11) | Q04 | 1.4.2 |
| Ứng dụng native Android/iOS | Q12 | 1.4.2 |
| Vé tháng | AS11 | Giả định của SRS |
| Phí phạt khi mất mã QR/thẻ | AS13 | Giả định của SRS |
| Theo dõi trạng thái từng ô đỗ bằng cảm biến | AS12 | Giả định của SRS |

# 7\. Giả định và vấn đề mở

## 7.1 Giả định đang áp dụng

| **ID** | **Giả định** | **Nguồn** | **Trạng thái** | **Phần SRS** |
| --- | --- | --- | --- | --- |
| AS1 | Dữ liệu thiết bị (QR, RFID, nhận dạng biển số) được mô phỏng bằng phần mềm. | Q06 | Đã xác nhận | 3.2, 4.4 |
| AS2 | Thanh toán dừng ở mức mô phỏng, không tích hợp cổng thanh toán thật. | Q03 | Đã xác nhận | 3.6 |
| AS3 | Người dùng tự đăng ký, không tích hợp SSO. | Q08 | Đã xác nhận | 3.1 |
| AS4 | Thí điểm một bãi; thiết kế hỗ trợ nhiều bãi. | Q04 | Đã xác nhận | 3.4, NFR-11 |
| AS5 | Ba vai trò Customer, Staff, Manager; quyền quản trị gộp vào Manager. | Q07, Q25 | Đã xác nhận | 2, 3.1, 3.8 |
| AS6 | Biển số chỉ hiển thị đầy đủ với vai trò có thẩm quyền; thời hạn lưu được làm rõ ở AS15. | Q12 | Đã xác nhận | 3.8 |
| AS7 | Chưa có dữ liệu baseline; thước đo dùng giá trị ước tính và dữ liệu mô phỏng. | Q10, Q26 | Đã xác nhận | 4.2 |
| AS8 | Không ràng buộc công nghệ hay hosting. | Q12 | Đã xác nhận | 4.3 |
| AS9 | Thông tin bãi gồm tên, địa chỉ, khu vực, sức chứa theo loại xe, giờ hoạt động, trạng thái hoạt động và bảng giá. | Q14 | Đã xác nhận | 3.4 |
| AS10 | Giữ chỗ tối đa 30 phút sau giờ hẹn rồi tự hủy và tính là không đến; được hủy trước giờ hẹn; chỗ đặt lấy từ sức chứa chung của khu vực. | Q15 | Đã xác nhận | 3.5 |
| AS11 | Phí được cấu hình theo loại xe và nhóm người dùng; mỗi mục giá tính theo lượt hoặc theo giờ; vé tháng không thuộc v1.0. | Q16 | Đã xác nhận một phần (cách tính và vé tháng là đề xuất của nhóm) | 3.4, 3.6 |
| AS12 | Số chỗ trống tính theo lượt xe vào/ra tại cổng của từng khu vực, không theo từng ô đỗ. | Q17 | Đã xác nhận | 3.3 |
| AS13 | Năm ngoại lệ bắt buộc: hết chỗ, biển số không khớp khi ra, mất mã QR/thẻ, xe đã có lượt đang mở, bãi tạm ngưng; mất mã thì Staff tra theo biển số, xác minh, xác nhận thủ công, ghi nhật ký, không thu phí phạt. | Q21, Q27 | Đã xác nhận | 3.9, 5 |
| AS14 | Bãi thí điểm có 3 khu vực, khoảng 300 chỗ xe máy và 30 chỗ ô tô. | Q24 | Đã xác nhận | 3.4, NFR-12 |
| AS15 | Biển số gắn với lượt gửi được lưu 12 tháng, sau đó xóa. | Q18 | Đã xác nhận | 3.8 |
| AS16 | Cách tính 4 chỉ số báo cáo: tỷ lệ sử dụng theo giờ (%) tính riêng theo khu vực và loại xe; giờ cao điểm là 3 khung 1 giờ có nhiều lượt vào nhất; doanh thu là tổng giao dịch đã xác nhận trong ngày; tỷ lệ không đến (%) chỉ tính đặt chỗ đã hết thời gian chờ. | Q20, Q28 | Đã xác nhận | 3.7 |
| AS17 | Một tài khoản có nhiều xe, không giới hạn; biển số là duy nhất; xe vãng lai được gán cho tài khoản khi biển số được đăng ký; biển số đã thuộc tài khoản khác thì báo lỗi. | Q29 | Đã xác nhận | 3.1, 3.2 |
| AS18 | Người dùng tự chọn nhóm (Sinh viên hoặc Giảng viên/Nhân viên) khi đăng ký; xe vãng lai tính theo mức "Khách". | Q30 | Đã xác nhận | 3.1, 3.2, 3.4 |
| AS19 | Chỗ đặt trước được giữ ngay khi đặt và không phục vụ đặt chỗ hoặc xe đến trực tiếp khác; chỉ đặt trong ngày; tối đa 1 đặt chỗ đang hiệu lực mỗi tài khoản; xe đến sớm do Staff kiểm tra và tiếp nhận, chỉ tính là đã đến khi được tiếp nhận; vào khu vực khác thì hủy đặt chỗ và tiếp nhận như khách vãng lai tại khu vực mới. | Q31 | Đã xác nhận (khách hàng sửa phần xe đến sớm) | 3.3, 3.5, 3.9 |
| AS20 | Khi bãi tạm ngưng: không tiếp nhận xe mới, cho xe đang gửi ra, từ chối đặt chỗ mới, hủy đặt chỗ đang hiệu lực và thông báo người dùng. | Q32 | Đã xác nhận | 3.4, 3.9 |
| AS21 | Thanh toán mô phỏng do Staff xác nhận khi xe ra. | Q33 | Đã xác nhận | 3.6 |
| AS22 | Chỉ Manager dùng: thông tin bãi, khu vực, sức chứa, bảng giá, tài khoản, nhóm người dùng, báo cáo. Staff ghi nhận xe vào/ra, tra cứu lượt gửi, xác nhận thanh toán, xử lý ngoại lệ, theo dõi chỗ trống và xem thông tin xe, lượt gửi, đặt chỗ, tình trạng bãi cần cho nghiệp vụ. | Q25, Q34 | Đã xác nhận (khách hàng bổ sung quyền xem của Staff) | 2.1, 2.2, 3.1, 3.5 |
| AS23 | Sau 12 tháng, hệ thống tự động xóa biển số trên lượt gửi đã kết thúc, giữ số liệu thống kê (số lượt, thời gian gửi, doanh thu) không gắn biển số. | Q35 | Đã xác nhận | 3.8 |
| AS24 | Số chỗ trống trên màn hình được cập nhật trong tối đa 5 giây sau mỗi lượt vào/ra (định lượng cho "gần thời gian thực"). | Nhóm đề xuất | Chưa gửi khách hàng | NFR-05 |
| AS25 | Phiên đăng nhập tự kết thúc sau 30 phút không thao tác. | Nhóm đề xuất | Chưa gửi khách hàng | FR-03 |
| AS26 | Khi tính phí theo giờ, số giờ gửi được làm tròn lên (61 phút tính 2 giờ). | Nhóm đề xuất | Chưa gửi khách hàng | FR-34 |
| AS27 | Phạm vi responsive: màn hình rộng 360 px tới 1920 px; trình duyệt Chrome, Edge, Firefox bản hiện hành. | Nhóm đề xuất | Chưa gửi khách hàng | NFR-08 |
| AS28 | Ngưỡng nghiệm thu: chỗ trống khớp 100% số đếm tay trong kịch bản 100 lượt; 100% lượt có bản ghi đầy đủ; xử lý đúng 5/5 ngoại lệ; mỗi lượt ghi nhận trong tối đa 3 giây. | Q28, nhóm đề xuất | Chờ xác nhận (khách hàng chưa phản hồi phần ngưỡng) | 4.2 |
| AS29 | Một xe có tối đa 1 đặt chỗ đang hiệu lực và không được đặt chỗ khi đang có lượt gửi đang mở (quy tắc bổ sung theo mã nguồn, KB-11). | Nhóm đề xuất (A-70) | Chưa gửi khách hàng | FR-28, FR-53 |

## 7.2 Câu hỏi đang chờ khách hàng

| **Mã** | **Nội dung chờ** | **Phần SRS bị ảnh hưởng** | **Ảnh hưởng nếu khác giả định** |
| --- | --- | --- | --- |
| Q28 | Ngưỡng nghiệm thu (AS28): khách hàng đã xác nhận công thức báo cáo nhưng chưa phản hồi phần ngưỡng; ngưỡng 3 giây, 100% bản ghi đầy đủ và 5/5 ngoại lệ chưa có trong câu hỏi đã gửi | 4.2 (NFR-04, NFR-06, NFR-07) | Sửa ngưỡng trong NFR-04, NFR-06, NFR-07 và bộ test nghiệm thu P21. |
| Chưa gửi | Các đề xuất của nhóm AS24 đến AS27 và AS29 (độ trễ cập nhật, thời gian phiên, làm tròn giờ tính phí, phạm vi responsive, quy tắc đặt chỗ theo xe) | 3.1, 3.5, 3.6, 4.2, 4.3 (FR-03, FR-28, FR-34, FR-53, NFR-05, NFR-08) | Sửa số liệu hoặc quy tắc trong yêu cầu tương ứng và test. |

# 8\. Truy vết

Mỗi yêu cầu ở phần 3 và 4 đã ghi nguồn (Q/AS) và mục tiêu (O) trong bảng của mình. Bảng tổng hợp theo mục tiêu dưới đây là đầu vào cho ma trận truy vết P24.

## 8.1 Mục tiêu và yêu cầu

| **Mục tiêu** | **Số yêu cầu** | **Yêu cầu** |
| --- | --- | --- |
| O1 | 14 | FR-01, FR-08, FR-17, FR-18, FR-19, FR-20, FR-21, FR-22, FR-23, FR-26, NFR-05, NFR-06, NFR-08, NFR-12 |
| O2 | 15 | FR-04, FR-05, FR-09, FR-10, FR-11, FR-12, FR-13, FR-14, FR-15, FR-16, NFR-04, NFR-07, NFR-10, NFR-12, NFR-13 |
| O3 | 16 | FR-20, FR-27, FR-28, FR-29, FR-30, FR-31, FR-32, FR-33, FR-51, FR-52, FR-53, FR-38, FR-39, FR-40, FR-41, FR-50 |
| O4 | 24 | FR-02, FR-03, FR-06, FR-07, FR-21, FR-24, FR-25, FR-34, FR-35, FR-36, FR-37, FR-40, FR-42, FR-43, FR-44, FR-45, FR-46, FR-47, FR-48, FR-49, FR-50, NFR-01, NFR-02, NFR-03 |
| O5 | 7 | FR-46, FR-47, FR-48, FR-49, FR-50, NFR-09, NFR-11 |

## 8.2 Ngoại lệ và yêu cầu xử lý

| **Ngoại lệ** | **Yêu cầu xử lý** |
| --- | --- |
| EX-01 | FR-21, FR-46 |
| EX-02 | FR-35, FR-43, FR-47 |
| EX-03 | FR-15, FR-43, FR-48 |
| EX-04 | FR-49 |
| EX-05 | FR-25, FR-50 |

## 8.3 Thống kê

| **Loại** | **Must** | **Should** | **Could** | **Tổng** |
| --- | --- | --- | --- | --- |
| Yêu cầu chức năng (FR) | 32 | 17 | 4 | 53 |
| Yêu cầu phi chức năng (NFR) | 10 | 3 | 0 | 13 |
| Ngoại lệ (EX) | | | | 5 |

## 8.4 Ánh xạ mã yêu cầu giữa SRS và Đặc tả API

Đặc tả API P18 dùng bộ mã FR của spec dựng MVP, khác với mã trong SRS này. Với phần đặt chỗ, mã FR-20 và FR-21 trong P18 mục 10 (KB-11) ứng với FR-27, FR-28, FR-29 và FR-53 của SRS v2.0.

# 9\. Khác biệt với mã nguồn chưa xử lý

Khi đồng bộ SRS với mã nguồn (A-70), các yêu cầu dưới đây **giữ nguyên** vì khách hàng đã xác nhận. Mã nguồn hiện tại (nhánh `main`, đối chiếu ngày 22/11/2026) chưa đáp ứng chúng. Mỗi dòng cần RES-01 quyết định ở mức dự án: sửa mã, hoặc mở CR xin khách hàng chấp nhận hành vi hiện tại.

| **Yêu cầu SRS** | **Nguồn đã xác nhận** | **Hành vi của mã nguồn** | **Đề xuất** |
| --- | --- | --- | --- |
| FR-52: Staff xem đặt chỗ đang hiệu lực của bãi | Q34, AS22 | Không có endpoint, service hoặc trang Staff cho danh sách đặt chỗ của bãi: `GET /api/reservations` chỉ cho vai trò Customer và chỉ trả đặt chỗ của chính người đó; menu Staff chỉ có các trang Xe vào, Xe ra, Lượt gửi | Bổ sung endpoint và trang Staff liệt kê đặt chỗ đang hiệu lực (A-65) hoặc CR |
| FR-51: Staff thấy thông tin đặt chỗ khi xe đến sớm | Q31, AS19 (khách hàng sửa) | Bước xác nhận đã có (`EARLY_ARRIVAL`, `confirmEarly`), nhưng hộp xác nhận chỉ hiện cảnh báo chung, không hiện giờ hẹn và khu vực đã đặt | Hiển thị giờ hẹn và khu vực trong hộp xác nhận (có thể làm cùng FR-52) |

Các khác biệt dưới đây từng được ghi nhận theo P18 nhưng **đã được xử lý trong mã nguồn**; P18 v1.1 đã cập nhật tương ứng (KB-11, KB-20). FR-52 ứng với KB-21 trong P18:

| **Yêu cầu SRS** | **Hành vi hiện tại của mã nguồn** |
| --- | --- |
| FR-28: tối đa 1 đặt chỗ đang hiệu lực mỗi tài khoản | `createReservation` kiểm tra cả theo xe (`VEHICLE_ALREADY_RESERVED`) và theo tài khoản (`RESERVATION_LIMIT`, 409). |
| FR-31, FR-51: xe đến sớm chỉ được tiếp nhận sau khi Staff xác nhận | `recordEntry` từ chối xe đến trước giờ hẹn (`EARLY_ARRIVAL`, 409) cho tới khi Staff gửi `confirmEarly`; khi đó mới tạo lượt vào, chuyển đặt chỗ sang FULFILLED, ghi sự kiện `EARLY_ARRIVAL_CONFIRMED` và nhật ký `MANUAL_CONFIRM`. |
| FR-50 (EX-05): hủy đặt chỗ và thông báo Customer khi bãi tạm ngưng | `updateLot` khi chuyển bãi sang SUSPENDED hủy mọi đặt chỗ PENDING của bãi (lý do `LOT_SUSPENDED`, không tính là không đến) và tạo thông báo cho từng Customer, trong cùng transaction. |