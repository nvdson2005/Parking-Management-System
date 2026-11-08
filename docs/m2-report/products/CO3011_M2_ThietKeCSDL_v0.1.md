# P03 - Thiết kế cơ sở dữ liệu

## Hệ thống quản lý bãi đỗ xe thông minh

| Trường | Nội dung |
|---|---|
| Mã và tên | P03 - Thiết kế CSDL |
| Loại | Sản phẩm trung gian |
| Tên file | CO3011_M2_ThietKeCSDL_v0.1 (tài liệu); thư mục `prisma/` trong repo (lược đồ, migration, seed) |
| Phiên bản | v0.2 (bản nháp, chờ review CP-03); 09/11/2026: đưa reservations, payments vào phạm vi V1.0 |
| Chủ sở hữu | Nguyễn Phạm Mạnh Dũng |
| Người review | Đào Xuân Sơn (QA) |
| Mục tiêu liên quan | O1, O2, O4, O5 |
| Nguồn | P02 SRS v0.1; PD-P03 (báo cáo M2 mục 2.2); P18 (loại CSDL) |

## 1. Mô hình thực thể - quan hệ

> 📐 **SƠ ĐỒ CẦN REVIEW:** `diagrams/07-erd.drawio` (xuất ảnh: `diagrams/07-erd.png`, nguồn Mermaid: `diagrams/07-erd.mmd`)
> Kiểm tra: 13 bảng, khóa chính, khóa ngoại và bội số quan hệ khớp mục 3; bội số quan hệ đúng với ràng buộc NULL/UNIQUE.

Loại CSDL: quan hệ, SQLite (một file), truy cập qua Prisma ORM. Lựa chọn này thuộc quyết định kiến trúc ở P18 (D-02): miễn phí (CN5), chạy cục bộ cho demo (D-16), hỗ trợ khóa ngoại và giao dịch.

## 2. Danh sách thực thể

| Mã | Bảng | Nội dung | Nguồn | Phạm vi V1.0 |
|---|---|---|---|---|
| ENT-01 | users | Tài khoản: email, mật khẩu băm, họ tên, vai trò, nhóm người dùng, cờ khóa | FR-01 đến FR-04, D-10, D-24 | Trong baseline |
| ENT-02 | roles | CUSTOMER, STAFF, MANAGER | Q07, Q25 | Trong baseline |
| ENT-03 | parking_lots | Bãi: tên, địa chỉ, trạng thái. Không có giờ hoạt động | FR-07, D-04 | Trong baseline |
| ENT-04 | zones | Khu vực trong bãi | FR-08 | Trong baseline |
| ENT-05 | vehicle_types | MOTORBIKE, CAR (tên tiếng Việt và tiếng Anh) | Q08 | Trong baseline |
| ENT-06 | zone_capacities | Sức chứa theo khu vực × loại xe | FR-08 | Trong baseline |
| ENT-07 | vehicles | Xe: biển số, mã QR, mã RFID mô phỏng, loại xe, chủ xe (có thể trống = xe vãng lai) | FR-06, FR-06a, FR-12 | Trong baseline |
| ENT-08 | parking_sessions | Lượt gửi: xe, ảnh chụp biển số, khu vực, loại xe, nhóm tính phí, phương thức nhận diện, thời điểm vào/ra, nhân viên vào/ra, trạng thái, đặt chỗ, chủ xe lúc vào | FR-13, D-29 | Trong baseline |
| ENT-09 | session_events | Sự kiện của lượt: xác nhận biển số không khớp, mất thẻ | EX-02, EX-03 | Trong baseline |
| ENT-11 | tariffs | Giá theo lượt cho loại xe × nhóm tính phí | FR-09 | Trong baseline (lưu, sửa và tính phí FR-26) |
| ENT-13 | access_logs | Nhật ký truy cập | FR-31 | Trong baseline |
| ENT-10 | reservations | Đặt chỗ: khách, xe, khu vực, loại xe, giờ đến, hạn giữ, trạng thái, lý do hủy | FR-20 đến FR-25 | Trong baseline |
| ENT-12 | payments | Giao dịch thanh toán mô phỏng của một lượt | FR-26 đến FR-28 | Trong baseline |

ENT-14 parking_slots **không tạo**: chỗ trống tính theo lượt vào/ra của khu vực (Q17). Cột liên kết tới đặt chỗ (`parking_sessions.reservation_id`) được phép trống vì phần lớn lượt gửi là xe vãng lai hoặc không đặt trước.

## 3. Từ điển dữ liệu

Quy ước: tên bảng và cột tiếng Anh dạng snake_case; khóa chính `id` (chuỗi cuid) hoặc khóa tự nhiên/khóa ghép như ghi bên dưới; khóa ngoại `<tên bảng số ít>_id`. SQLite không có kiểu enum nên trạng thái và loại là chuỗi, tập giá trị hợp lệ được kiểm tra ở tầng ứng dụng (`src/lib/types.ts`).

### 3.1 roles (ENT-02)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| code | TEXT | PK | CUSTOMER, STAFF, MANAGER | FR-03 |

### 3.2 users (ENT-01)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã tài khoản | — |
| email | TEXT | NOT NULL, UNIQUE | Tên đăng nhập | FR-01, FR-02 |
| password_hash | TEXT | NOT NULL | Mật khẩu băm bcrypt | FR-02, NFR-01 |
| name | TEXT | NOT NULL | Họ tên | FR-01 |
| role_code | TEXT | NOT NULL, FK → roles.code | Vai trò | FR-03 |
| user_group | TEXT | NULL | STUDENT hoặc LECTURER_STAFF; trống với Staff, Manager | FR-01, D-10 |
| locked | BOOLEAN | NOT NULL, mặc định false | Tài khoản bị khóa | FR-04 |
| created_at | DATETIME | NOT NULL, mặc định now | Thời điểm tạo | — |

### 3.3 vehicle_types (ENT-05)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| code | TEXT | PK | MOTORBIKE, CAR | FR-06, FR-08 |
| name_vi | TEXT | NOT NULL | Tên tiếng Việt | FR-05 |
| name_en | TEXT | NOT NULL | Tên tiếng Anh | FR-05 |

### 3.4 parking_lots (ENT-03)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã bãi | FR-10 |
| name | TEXT | NOT NULL | Tên bãi | FR-07 |
| address | TEXT | NOT NULL | Địa chỉ | FR-07 |
| status | TEXT | NOT NULL, mặc định ACTIVE | ACTIVE hoặc SUSPENDED | FR-07, EX-05 |

### 3.5 zones (ENT-04)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã khu vực | — |
| lot_id | TEXT | NOT NULL, FK → parking_lots.id | Bãi chứa khu vực | FR-08, FR-10 |
| name | TEXT | NOT NULL | Tên khu vực (A, B, C) | FR-08 |

### 3.6 zone_capacities (ENT-06)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| zone_id | TEXT | PK (ghép), FK → zones.id | Khu vực | FR-08 |
| vehicle_type_code | TEXT | PK (ghép), FK → vehicle_types.code | Loại xe | FR-08 |
| capacity | INTEGER | NOT NULL | Sức chứa | FR-08, FR-17 |

### 3.7 tariffs (ENT-11)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| vehicle_type_code | TEXT | PK (ghép), FK → vehicle_types.code | Loại xe | FR-09 |
| fee_group | TEXT | PK (ghép) | STUDENT, LECTURER_STAFF hoặc GUEST | FR-09, D-10 |
| price | INTEGER | NOT NULL | Giá mỗi lượt (VNĐ) | FR-09 |

### 3.8 vehicles (ENT-07)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã xe | — |
| plate | TEXT | NOT NULL, UNIQUE | Biển số đầy đủ | FR-06a |
| qr_code | TEXT | NOT NULL, UNIQUE | Giá trị mã QR | FR-06, FR-11 |
| rfid_code | TEXT | NOT NULL, UNIQUE | Mã RFID mô phỏng do hệ thống sinh | FR-06, D-32 |
| vehicle_type_code | TEXT | NOT NULL, FK → vehicle_types.code | Loại xe | FR-06 |
| owner_id | TEXT | NULL, FK → users.id | Chủ xe; trống = xe vãng lai | FR-06a, FR-12 |
| created_at | DATETIME | NOT NULL, mặc định now | Thời điểm tạo | — |

### 3.9 parking_sessions (ENT-08)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã lượt gửi | — |
| vehicle_id | TEXT | NULL, FK → vehicles.id | Xe; đặt thành trống khi xe vãng lai bị xóa lúc xóa dữ liệu quá hạn | FR-13, FR-32 |
| plate_snapshot | TEXT | NOT NULL | Biển số sao chép lúc vào; `[purged]` sau khi xóa dữ liệu quá hạn | FR-13, FR-14, FR-32, D-29 |
| zone_id | TEXT | NOT NULL, FK → zones.id | Khu vực | FR-13, FR-17 |
| vehicle_type_code | TEXT | NOT NULL, FK → vehicle_types.code | Loại xe | FR-13, FR-17 |
| fee_group | TEXT | NOT NULL | Nhóm tính phí chốt lúc vào | FR-26 |
| id_method | TEXT | NOT NULL | PLATE, QR hoặc RFID | FR-11, FR-13 |
| entry_time | DATETIME | NOT NULL | Thời điểm vào | FR-13 |
| exit_time | DATETIME | NULL | Thời điểm ra | FR-13, FR-14 |
| entry_staff_id | TEXT | NOT NULL, FK → users.id | Nhân viên ghi nhận vào | FR-13 |
| exit_staff_id | TEXT | NULL, FK → users.id | Nhân viên ghi nhận ra | FR-13, FR-14 |
| status | TEXT | NOT NULL | OPEN hoặc CLOSED | FR-13, FR-17 |
| reservation_id | TEXT | NULL, UNIQUE, FK → reservations.id | Đặt chỗ được dùng | FR-24 |
| owner_id | TEXT | NULL | Chủ xe tại thời điểm vào (trống = khách); không đổi về sau | FR-28 |

### 3.10 session_events (ENT-09)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã sự kiện | — |
| session_id | TEXT | NOT NULL, FK → parking_sessions.id | Lượt gửi | EX-02, EX-03 |
| type | TEXT | NOT NULL | PLATE_MISMATCH_CONFIRMED hoặc LOST_CARD | EX-02, EX-03 |
| staff_id | TEXT | NOT NULL, FK → users.id | Nhân viên xác nhận | EX-02, EX-03 |
| note | TEXT | NULL | Ghi chú | — |
| created_at | DATETIME | NOT NULL, mặc định now | Thời điểm | — |

### 3.11 access_logs (ENT-13)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã dòng nhật ký | — |
| user_id | TEXT | NULL, FK → users.id | Tài khoản thực hiện | FR-31 |
| action | TEXT | NOT NULL | LOGIN, LOGOUT, VIEW_FULL_PLATE, ENTRY, EXIT, MANUAL_CONFIRM, LOT_CHANGE, TARIFF_CHANGE, ACCOUNT_CHANGE, PURGE | FR-31, D-23 |
| target | TEXT | NULL | Đối tượng tác động | FR-31 |
| created_at | DATETIME | NOT NULL, mặc định now | Thời điểm | FR-31 |

### 3.12 reservations (ENT-10)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã đặt chỗ | — |
| customer_id | TEXT | NOT NULL, FK → users.id | Người đặt | FR-20 |
| vehicle_id | TEXT | NOT NULL, FK → vehicles.id | Xe | FR-20 |
| zone_id | TEXT | NOT NULL, FK → zones.id | Khu vực | FR-20 |
| vehicle_type_code | TEXT | NOT NULL, FK → vehicle_types.code | Loại xe | FR-20 |
| arrival_time | DATETIME | NOT NULL | Giờ đến | FR-20 |
| hold_until | DATETIME | NOT NULL | Giờ đến + 30 phút | FR-23 |
| status | TEXT | NOT NULL | PENDING, CANCELLED, NO_SHOW, FULFILLED | FR-22 đến FR-24 |
| created_at | DATETIME | NOT NULL, mặc định now | Thời điểm đặt | — |
| cancel_reason | TEXT | NULL | CUSTOMER hoặc ENTERED_OTHER_ZONE | FR-22, FR-24, D-41 |
| cancel_zone_id | TEXT | NULL, FK → zones.id | Khu vực xe thực sự vào | FR-24 |

### 3.13 payments (ENT-12)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã giao dịch | — |
| session_id | TEXT | NOT NULL, UNIQUE, FK → parking_sessions.id | Lượt gửi (mỗi lượt tối đa 1 giao dịch) | FR-27 |
| amount | INTEGER | NOT NULL | Số tiền (VNĐ) | FR-26 |
| status | TEXT | NOT NULL, mặc định CONFIRMED | Trạng thái | FR-27 |
| paid_at | DATETIME | NOT NULL | Thời điểm thanh toán | FR-27, FR-29 |
| confirmed_by_id | TEXT | NOT NULL, FK → users.id | Nhân viên xác nhận | FR-27 |

## 4. Quy tắc toàn vẹn và cách tính chỗ trống

| Quy tắc | Bảo đảm ở | Cách bảo đảm |
|---|---|---|
| Khóa chính, khóa ngoại, duy nhất (email, biển số, QR, RFID, session_id của payment, reservation_id của lượt) | CSDL | Ràng buộc PK, FK, UNIQUE trong migration |
| Loại xe, vai trò thuộc danh mục | CSDL | Khóa ngoại tới vehicle_types, roles |
| Giá trị trạng thái, nhóm, phương thức hợp lệ | Ứng dụng | Kiểu union trong `src/lib/types.ts`; SQLite không có enum hay CHECK trong lược đồ hiện tại |
| Mỗi xe chỉ có một lượt đang mở (EX-04) | Ứng dụng | Dịch vụ ghi nhận xe vào kiểm tra lượt OPEN rồi tạo lượt mới trong cùng một khóa tuần tự (`withLock`) và giao dịch |
| Không vượt sức chứa khi sự kiện đồng thời (FR-18) | Ứng dụng | Đọc chỗ trống và ghi lượt trong cùng `withLock` + giao dịch |
| Giờ ra không trước giờ vào | Ứng dụng | Giờ ra lấy thời điểm xử lý trên máy chủ; riêng bộ mô phỏng khi sinh dữ liệu quá khứ truyền thời điểm vào/ra theo thứ tự. Không có ràng buộc CSDL riêng |

**Cách tính chỗ trống** (FR-17, D-21): với mỗi khu vực × loại xe, chỗ trống = sức chứa − số lượt có `status = OPEN` − số đặt chỗ `PENDING` có `hold_until > hiện tại`, chặn dưới ở 0 (trường hợp Manager giảm sức chứa xuống dưới số xe đang đỗ). Giá trị được tính khi truy vấn, không lưu thành cột. Trước mỗi lần đọc, đặt chỗ quá hạn được chuyển sang NO_SHOW (FR-23) để chỗ được giải phóng đúng lúc.

Khóa `withLock` là khóa trong một tiến trình. Nó đủ cho demo chạy một tiến trình cục bộ (D-16); nếu triển khai nhiều tiến trình phải thay bằng ràng buộc hoặc khóa ở CSDL. Đây là giới hạn đã biết, ghi ở mục 10.

## 5. Hỗ trợ nhiều bãi

Mọi dữ liệu theo bãi gắn với bãi qua `zones.lot_id`: sức chứa (qua khu vực), lượt gửi (qua `zone_id`), đặt chỗ (qua `zone_id`). Thêm bãi mới chỉ cần thêm dòng vào `parking_lots`, `zones`, `zone_capacities`; không đổi lược đồ (FR-10, Q04). Bảng giá hiện dùng chung cho mọi bãi.

## 6. Bảo vệ dữ liệu cá nhân và lưu giữ

| Biện pháp | Thực hiện | Nguồn |
|---|---|---|
| Mật khẩu | Chỉ lưu `password_hash` (bcrypt) | NFR-01 |
| Biển số đầy đủ | Lưu ở `vehicles.plate` và ảnh chụp `parking_sessions.plate_snapshot` (cần cho đối chiếu EX-02 và lịch sử khi xe đổi chủ); che khi hiển thị cho người không có quyền | FR-30, D-29 |
| Nhật ký truy cập | `access_logs` ghi các hành động ở D-23 | FR-31 |
| Lưu giữ 12 tháng | Thao tác xóa của Manager (một giao dịch): đặt `plate_snapshot = '[purged]'` cho lượt đã đóng có giờ vào trước mốc 12 tháng; xóa xe vãng lai không có lượt mới hơn mốc, không có lượt đang mở và không có đặt chỗ (gỡ `vehicle_id` khỏi lượt cũ trước khi xóa); ghi nhật ký PURGE | FR-32, Q18 |
| Dữ liệu kiểm thử | Chỉ dữ liệu từ seed và bộ mô phỏng | NFR-10 |

## 7. Chỉ mục và truy vấn chính

| Chỉ mục | Phục vụ |
|---|---|
| `parking_sessions(status, zone_id)` | Đếm lượt đang mở theo khu vực (FR-17); tìm lượt đang mở |
| `reservations(status, zone_id)` | Đếm đặt chỗ đang chờ (FR-17, FR-25) |
| `parking_sessions(owner_id)` | Lịch sử của Customer (FR-28) |
| UNIQUE `vehicles(plate)`, `vehicles(qr_code)`, `vehicles(rfid_code)` | Tìm xe theo biển số, QR, RFID khi vào/ra (FR-11, FR-14) |
| UNIQUE `users(email)` | Đăng nhập |

## 8. Script lược đồ và dữ liệu mẫu

| Thành phần | Vị trí | Nội dung |
|---|---|---|
| Lược đồ | `prisma/schema.prisma` | 13 model, ánh xạ sang tên bảng snake_case |
| Migration | `prisma/migrations/20261108042044_init` | Tạo toàn bộ bảng và chỉ mục |
| Migration | `prisma/migrations/20261108120000_session_owner` | Thêm `parking_sessions.owner_id` và chỉ mục |
| Migration | `prisma/migrations/20261108140000_reservation_cancel_reason` | Thêm `cancel_reason`, `cancel_zone_id` (D-41) |
| Dữ liệu mẫu | `prisma/seed.ts` | 3 vai trò; 2 loại xe; bãi thí điểm với khu vực A (150 xe máy), B (150 xe máy), C (30 ô tô); bảng giá xe máy 2.000 VNĐ, ô tô 10.000 VNĐ cho cả 3 nhóm; 2 Manager, 2 Staff, ít nhất 15 Customer (D-17, D-18, D-40) |
| Lệnh | `package.json` | `npm run db:reset` tạo lại CSDL theo migration; `npm run db:seed` nạp dữ liệu mẫu |

Thay đổi lược đồ sau Baseline V1.0 được thực hiện bằng migration mới, không sửa migration cũ, và phải có CR.

## 9. Truy vết yêu cầu → thực thể

| Yêu cầu | Thực thể | Yêu cầu | Thực thể |
|---|---|---|---|
| FR-01 đến FR-04 | users, roles | FR-17, FR-18 | zone_capacities, parking_sessions, reservations |
| FR-05 | vehicle_types (tên song ngữ) | FR-19, FR-19a | parking_lots, zone_capacities (đọc) |
| FR-06, FR-06a | vehicles | FR-20 đến FR-25 | reservations, parking_sessions.reservation_id |
| FR-07 | parking_lots | FR-26 | tariffs, parking_sessions.fee_group |
| FR-08 | zones, zone_capacities | FR-27, FR-28 | payments, parking_sessions.owner_id |
| FR-09 | tariffs | FR-29 | parking_sessions, payments, reservations |
| FR-10 | parking_lots, zones | FR-30 | vehicles.owner_id (quyền xem), plate_snapshot |
| FR-11, FR-12 | vehicles, parking_sessions | FR-31 | access_logs |
| FR-13 | parking_sessions | FR-32 | parking_sessions.plate_snapshot, vehicles, access_logs |
| FR-14 | parking_sessions, session_events | FR-33, FR-34 | toàn bộ bảng nghiệp vụ (qua API) |
| FR-15, FR-16 | parking_sessions | EX-02, EX-03 | session_events |

Mọi FR có lưu dữ liệu đều có ít nhất một thực thể; FR-16 là yêu cầu hiệu năng, không lưu dữ liệu riêng.

## 10. Giả định, khác biệt và vấn đề mở

| # | Nội dung | Ảnh hưởng | Xử lý |
|---|---|---|---|
| 1 | PD-P03 dự kiến thư mục `database/`; thực tế dùng `prisma/` theo quy ước của Prisma | Không | Cập nhật PD-P03 mục Format |
| 2 | PD-P03 tiêu chí 8 yêu cầu biển số đầy đủ chỉ ở `vehicles`; thiết kế lưu thêm `plate_snapshot` trên lượt gửi (D-29) | Biển số xuất hiện ở hai bảng | Ảnh chụp cần cho EX-02 và lịch sử; được che khi hiển thị và xóa sau 12 tháng. Đề xuất sửa tiêu chí 8 |
| 3 | PD-P03 tiêu chí 8 yêu cầu cột của `access_logs` không trống; `user_id` cho phép trống | Dòng nhật ký có thể không gắn tài khoản | Đề xuất sửa tiêu chí: `action`, `created_at` bắt buộc; `user_id` trống chỉ cho thao tác hệ thống |
| 4 | PD-P03 tiêu chí 10 yêu cầu cờ "dữ liệu mô phỏng"; lược đồ không có cột này | Không lọc riêng được dữ liệu mô phỏng | Toàn bộ dữ liệu trong demo là mô phỏng (NFR-10); đề xuất bỏ tiêu chí (quyết định ở A-24, CP-03) |
| 5 | "Một lượt mở mỗi xe" và "giờ ra sau giờ vào" bảo đảm ở ứng dụng, không bằng ràng buộc CSDL | Phụ thuộc mọi đường ghi đi qua dịch vụ | Bộ mô phỏng cũng đi qua API (FR-15); có kiểm thử tự động |
| 6 | Khóa `withLock` chỉ trong một tiến trình | Không đủ nếu chạy nhiều tiến trình | Phù hợp demo cục bộ (D-16) |
| 7 | Biển số duy nhất (R3-Q1) và cách xóa dữ liệu (R3-Q6) là giả định của nhóm, dự kiến hỏi ở vòng 3 (chưa gửi) | Có thể đổi UNIQUE của `vehicles.plate`, phạm vi xóa | Xử lý bằng CR và migration mới |

## 11. Tự kiểm theo tiêu chí chất lượng PD-P03

| Mã | Tiêu chí | Kết quả |
|---|---|---|
| T-DB1 | Mỗi FR lưu dữ liệu có thực thể | Đạt (mục 9) |
| T-DB2 | Khóa chính, khóa ngoại, 3NF | Đạt; `plate_snapshot`, `fee_group`, `owner_id` trên lượt gửi là dữ liệu chốt theo thời điểm (có lý do ở D-29, FR-26, FR-28), không phải phi chuẩn hóa thừa |
| T-DB3 | Script tạo lược đồ chạy trên CSDL trống, đủ bảng | Đạt: 13 bảng theo migration |
| T-DB4 | Dữ liệu vi phạm ràng buộc bị từ chối | Một phần: PK, FK, UNIQUE ở CSDL; giá trị trạng thái và giờ ra ở ứng dụng (mục 4) |
| T-DB5 | Không có hai lượt mở cho cùng xe | Đạt ở tầng ứng dụng (mục 4, mục 10 #5) |
| T-DB6 | Truy vấn chỗ trống khớp số đếm tay, dùng chỉ mục | Đạt về thiết kế (chỉ mục `status, zone_id`); kiểm thử ở P20 |
| T-DB7 | Thêm bãi thứ hai không sửa lược đồ | Đạt (mục 5) |
| T-DB8 | Mật khẩu băm; biển số đầy đủ một bảng; nhật ký đủ cột | Một phần (mục 10 #2, #3) |
| T-DB9 | Xóa dữ liệu quá hạn đúng bản ghi | Đạt về thiết kế (mục 6); kiểm thử ở P20 |
| T-DB10 | Tên, kiểu khớp P02, P05; cờ mô phỏng | Một phần (mục 10 #4) |
| — | Ít nhất 2 thành viên review | Chờ CP-03 (A-27) |
