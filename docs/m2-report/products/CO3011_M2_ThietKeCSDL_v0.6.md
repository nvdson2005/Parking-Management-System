# P03 - Thiết kế cơ sở dữ liệu

## Hệ thống quản lý bãi đỗ xe thông minh

| Trường | Nội dung |
|---|---|
| Mã và tên | P03 - Thiết kế CSDL |
| Loại | Sản phẩm trung gian |
| Tên file | CO3011_M2_ThietKeCSDL_v0.6 (tài liệu); thư mục `prisma/` trong repo (lược đồ, migration, seed) |
| Phiên bản | v0.6 (ứng viên v1.0; đã xử lý 2 vòng review CP-03 / A-27 của RES-02, review PR #10 của RES-01 và câu trả lời vòng 5 của khách hàng, 23-24/11) |
| Chủ sở hữu | Nguyễn Phạm Mạnh Dũng |
| Người review | Đào Xuân Sơn (QA) |
| Mục tiêu liên quan | O1, O2, O3, O4, O5 |
| Nguồn | P02 SRS v0.2 (15/11/2026, Phạm Duy Quý) và SRS v2.0 (RES-04, PR #9); Client Interaction Log Q27-Q35 (vòng 3) và Q36-Q46 (vòng 5, 23/11, ghi trong SRS v2.1 của RES-04); CR-02 (`docs/m3/decision-record.md`); PD-P03 (báo cáo M2 mục 2.2); P18 (loại CSDL) |
| Hoạt động | A-24 Hoàn thiện thiết kế CSDL v1.0 |

## Kiểm soát tài liệu

| Phiên bản | Ngày | Người thực hiện | Thay đổi |
|---|---|---|---|
| v0.1 | 08/11/2026 | Nguyễn Phạm Mạnh Dũng | Bản nháp đầu, đối chiếu lược đồ MVP |
| v0.2 | 09/11/2026 | Nguyễn Phạm Mạnh Dũng | Đưa reservations, payments vào phạm vi V1.0 (bản thuộc tag `baseline-v1.0`, file `CO3011_M2_ThietKeCSDL_v0.1.md`) |
| v0.3 | 17/11/2026 | Nguyễn Phạm Mạnh Dũng | Đổi mã FR theo SRS v0.2. Thêm bảng `notifications` và giá trị `LOT_SUSPENDED`. Ghi các quy tắc mới từ vòng 3 (Q31, Q32, Q35). Thêm mục 11 về các khoảng trống so với SRS v0.2 (cần CR). Cập nhật mục 10 và phần tự kiểm |
| v0.4 | 22/11/2026 | Nguyễn Phạm Mạnh Dũng | Đối chiếu lại toàn bộ câu trả lời vòng 3 (Q27-Q35). Nhánh round3 đã merge vào `main` (PR #4, `8fd4926`, 19/11) và có CR-02, nên lược đồ `main` có 14 bảng. Thêm mục 4.1 cách tính 4 chỉ số báo cáo (Q28), mục 6.1 quyền đọc dữ liệu theo vai trò (Q34), G-08 (Staff tra cứu xe và đặt chỗ). Ghi rõ Q35: xóa tự động là yêu cầu đã chốt (G-05). Thêm `EARLY_ARRIVAL_CONFIRMED`, chỉ mục `reservations(customer_id, status)`. Sơ đồ ERD bản mới `07-erd-v0.4.mmd` có `notifications`. Chốt phạm vi khoảng trống (mục 11.1), FR-03, KB-16 và các tiêu chí PD-P03 (mục 10 #2-#4, #11) |
| v0.5 | 23/11/2026 | Nguyễn Phạm Mạnh Dũng | Xử lý review CP-03 của RES-02 (5 comment trên Drive). Thêm G-09: cột cổng `entry_gate`, `exit_gate` (FR-09, AT-01 bước 3), đã làm. G-06 chuyển từ Hoãn sang **Đã làm** (AT-03 bước 7, AT-04 bước 2). Ghi rõ `[purged]` là giá trị thay thế, cột `plate_snapshot` không bao giờ trống. Ghi rõ cách xác định mục giá đã áp dụng (G-03 vẫn hoãn). Ghi lý do không dùng chỉ mục duy nhất có điều kiện. AT-03 bước 1 (giờ hoạt động) ngoài phạm vi theo CR-04. Vòng review thứ hai của RES-02 (4 comment, 23/11): `exit_source` được phép NULL; quy tắc G-02 ghi tại mục 3.7; mục 3.4 chỉ nêu phạm vi; bảng 11.1 dựng lại 9 dòng có CR, commit, người quyết, ngày; vị trí G-05 ghi thống nhất. G-04 chuyển từ Hoãn sang **Đã làm** (`68abc69`, PR #11) theo đề nghị trong vòng review thứ hai |
| v0.6 | 24/11/2026 | Nguyễn Phạm Mạnh Dũng | Câu trả lời vòng 5 của khách hàng (Q36-Q46, 23/11): **G-01 chuyển từ Hoãn sang Đã làm** theo Q37 (giờ hoạt động chỉ để thông báo); thêm `users.requested_user_group` (Q38); mốc xóa 12 tháng tính **từ giờ ra** (Q44); Staff chỉ xem biển số đã che với lượt đã đóng (Q46); Customer xem bảng giá của nhóm mình (Q45). Q36, Q39, Q40 xác nhận việc hoãn G-02, G-03, FR-03. Review PR #10 của RES-01 (4 comment): tiêu chí 8 có ngoại lệ đăng nhập thất bại với email không tồn tại (mục 10 #3); ERD tách bội số theo khóa ngoại cho phép trống và bổ sung 2 quan hệ còn thiếu (`07-erd-v0.6.mmd`). Sửa mục 10 #5: chỉ luồng trực tiếp của bộ mô phỏng gọi hàm dịch vụ. Vòng review thứ hai của RES-01 (PR #10): so sánh phương án CR-04 cùng phạm vi (29,5h làm hết, 17,5h đã chọn, tiết kiệm 12h); thêm FR-44 lọc nhật ký vào mục 11.1 vì AT-04 bước 8 kiểm tra |

**Trạng thái mã nguồn của các thay đổi.** Mỗi thay đổi trong tài liệu này được gắn một trong ba nhãn:
- **[main]**: đã có trên nhánh `main` từ trước vòng 3.
- **[round3]**: thay đổi theo câu trả lời vòng 3 (CR-02). Ban đầu làm trên nhánh `refactor/round3-lecturer-alignment` (RES-01, 15/11), **đã merge vào `main`** qua PR #4 (`8fd4926`, 19/11). Nhãn được giữ để truy vết nguồn gốc thay đổi.
- **[đề xuất]**: chưa có code; cần CR trước khi làm (mục 11).

## 1. Mô hình thực thể - quan hệ

> 📐 **SƠ ĐỒ CẦN REVIEW:** `diagrams/07-erd-v0.6.mmd` (nguồn Mermaid, 14 bảng, 24 quan hệ, khớp từng `@relation` trong `prisma/schema.prisma`). Khóa ngoại cho phép trống vẽ bội số 0..1 (`|o`): `vehicles.owner_id` (xe vãng lai), `parking_sessions.vehicle_id`, `exit_staff_id` (lượt còn mở), `reservation_id`, `reservations.cancel_zone_id`, `access_logs.user_id`. `entry_staff_id` (bắt buộc) và `exit_staff_id` là hai quan hệ riêng.
> `diagrams/07-erd.drawio`, `07-erd.png`, `07-erd.mmd` là bản Baseline V1.0 (13 bảng) và không được sửa (`docs/m3/baseline-v1.0-freeze.md`). Cần xuất ảnh mới từ `07-erd-v0.6.mmd` để đưa vào bản Word. Kiểm tra: khóa chính, khóa ngoại và bội số quan hệ khớp mục 3, đúng với ràng buộc NULL/UNIQUE.

Loại CSDL: quan hệ, SQLite (một file), truy cập qua Prisma ORM. Lựa chọn này thuộc quyết định kiến trúc ở P18 (D-02): miễn phí (CN5), chạy cục bộ cho demo (D-16), hỗ trợ khóa ngoại và giao dịch.

## 2. Danh sách thực thể

Mã FR theo SRS v0.2.

| Mã | Bảng | Nội dung | Nguồn | Trạng thái |
|---|---|---|---|---|
| ENT-01 | users | Tài khoản: email, mật khẩu băm, họ tên, vai trò, nhóm người dùng, nhóm Customer xin đổi sang (Q38), cờ khóa | FR-01 đến FR-03, FR-06 đến FR-08 | [main] |
| ENT-02 | roles | CUSTOMER, STAFF, MANAGER | FR-06, AS5 | [main] |
| ENT-03 | parking_lots | Bãi: tên, địa chỉ, trạng thái, giờ hoạt động (G-01, Q37, chỉ để thông báo) | FR-22, FR-25, FR-26, FR-50, NFR-11 | [main]; giờ hoạt động PR #17 |
| ENT-04 | zones | Khu vực trong bãi | FR-23 | [main] |
| ENT-05 | vehicle_types | MOTORBIKE, CAR (tên tiếng Việt và tiếng Anh) | FR-04, FR-23 | [main] |
| ENT-06 | zone_capacities | Sức chứa theo khu vực × loại xe | FR-17, FR-23 | [main] |
| ENT-07 | vehicles | Xe: biển số, mã QR, mã RFID mô phỏng, loại xe, chủ xe (trống = xe vãng lai) | FR-04, FR-05, FR-11, FR-12 | [main] |
| ENT-08 | parking_sessions | Lượt gửi: xe, ảnh chụp biển số, khu vực, loại xe, nhóm tính phí, phương thức nhận diện, thời điểm vào/ra, nhân viên vào/ra, trạng thái, đặt chỗ, chủ xe lúc vào, cổng vào/ra (G-09), nguồn ghi nhận vào/ra (G-04) | FR-09 đến FR-16, FR-37, FR-45 | [main] |
| ENT-09 | session_events | Sự kiện của lượt: xác nhận biển số không khớp, mất thẻ | FR-47, FR-48 | [main] |
| ENT-10 | reservations | Đặt chỗ: khách, xe, khu vực, loại xe, giờ đến, hạn giữ, trạng thái, lý do hủy | FR-27 đến FR-33, FR-50 đến FR-52 | [main]; giá trị `LOT_SUSPENDED` [round3] |
| ENT-11 | tariffs | Giá theo lượt cho loại xe × nhóm tính phí. Không theo bãi, không tính theo giờ; Q36 xác nhận tính theo lượt là đủ cho bàn giao (mục 11 G-02) | FR-24, FR-26, FR-34 | [main] |
| ENT-12 | payments | Giao dịch thanh toán mô phỏng của một lượt | FR-35 đến FR-37, FR-40 | [main] |
| ENT-13 | access_logs | Nhật ký truy cập | FR-43, FR-44 | [main] |
| ENT-15 | notifications | Thông báo trong ứng dụng cho người dùng (chuông thông báo) | FR-50, AS20 | [round3] |

ENT-14 parking_slots **không tạo**: chỗ trống tính theo lượt vào/ra của khu vực (Q17, AS12). Cột liên kết tới đặt chỗ (`parking_sessions.reservation_id`) được phép trống vì phần lớn lượt gửi là xe vãng lai hoặc không đặt trước.

## 3. Từ điển dữ liệu

Quy ước: tên bảng và cột tiếng Anh dạng snake_case; khóa chính `id` (chuỗi cuid) hoặc khóa tự nhiên/khóa ghép như ghi bên dưới; khóa ngoại `<tên bảng số ít>_id`. SQLite không có kiểu enum nên trạng thái và loại là chuỗi, tập giá trị hợp lệ được kiểm tra ở tầng ứng dụng (`src/lib/types.ts`).

### 3.1 roles (ENT-02)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| code | TEXT | PK | CUSTOMER, STAFF, MANAGER | FR-06 |

### 3.2 users (ENT-01)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã tài khoản | — |
| email | TEXT | NOT NULL, UNIQUE | Tên đăng nhập | FR-01, FR-02 |
| password_hash | TEXT | NOT NULL | Mật khẩu băm bcrypt | FR-02, NFR-01 |
| name | TEXT | NOT NULL | Họ tên | FR-01, FR-08 |
| role_code | TEXT | NOT NULL, FK → roles.code | Vai trò | FR-06, FR-07 |
| user_group | TEXT | NULL | STUDENT hoặc LECTURER_STAFF; trống với Staff, Manager. Customer không tự đổi; Manager đổi (Q38) | FR-01, FR-07, FR-08, AS18 |
| requested_user_group | TEXT | NULL | Nhóm Customer xin đổi sang, chờ Manager cập nhật; Manager đổi nhóm thì cột về trống. Migration `20261124100000_q38_group_request`, PR #17 | FR-07, FR-08, Q38 |
| locked | BOOLEAN | NOT NULL, mặc định false | Tài khoản bị khóa | FR-07 |
| created_at | DATETIME | NOT NULL, mặc định now | Thời điểm tạo | — |

### 3.3 vehicle_types (ENT-05)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| code | TEXT | PK | MOTORBIKE, CAR | FR-04, FR-23 |
| name_vi | TEXT | NOT NULL | Tên tiếng Việt | D-11 (giao diện song ngữ) |
| name_en | TEXT | NOT NULL | Tên tiếng Anh | D-11 |

### 3.4 parking_lots (ENT-03)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã bãi | NFR-11 |
| name | TEXT | NOT NULL | Tên bãi | FR-22 |
| address | TEXT | NOT NULL | Địa chỉ | FR-22, FR-26 |
| status | TEXT | NOT NULL, mặc định ACTIVE | ACTIVE hoặc SUSPENDED | FR-25, FR-50 (EX-05) |
| open_time, close_time | TEXT | NULL, dạng HH:mm; cả hai cùng có hoặc cùng trống | Giờ hoạt động, **chỉ để thông báo**: không chặn xe vào, không chặn đặt chỗ (Q37). Giờ đóng nhỏ hơn giờ mở được phép (bãi mở qua đêm). Migration `20261124090000_g01_lot_hours`, PR #17 | FR-22, FR-26 |

**G-01:** Đã làm theo Q37 (23/11), xem mục 11.1. Bãi có sẵn trước migration có hai cột trống; Customer thấy "Chưa cập nhật" cho tới khi Manager nhập giờ.

### 3.5 zones (ENT-04)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã khu vực | — |
| lot_id | TEXT | NOT NULL, FK → parking_lots.id | Bãi chứa khu vực | FR-23, NFR-11 |
| name | TEXT | NOT NULL | Tên khu vực (A, B, C) | FR-23 |

### 3.6 zone_capacities (ENT-06)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| zone_id | TEXT | PK (ghép), FK → zones.id | Khu vực | FR-23 |
| vehicle_type_code | TEXT | PK (ghép), FK → vehicle_types.code | Loại xe | FR-23 |
| capacity | INTEGER | NOT NULL | Sức chứa | FR-17, FR-23, FR-38 |

### 3.7 tariffs (ENT-11)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| vehicle_type_code | TEXT | PK (ghép), FK → vehicle_types.code | Loại xe | FR-24 |
| fee_group | TEXT | PK (ghép) | STUDENT, LECTURER_STAFF hoặc GUEST | FR-24, AS18 |
| price | INTEGER | NOT NULL | Đơn giá (VNĐ). Hiện chỉ dùng làm giá mỗi lượt | FR-24, FR-34 |
| *lot_id* | *TEXT* | *PK (ghép), FK → parking_lots.id* | *Bảng giá theo bãi. [đề xuất] G-02* | *FR-24* |
| *pricing_method* | *TEXT* | *NOT NULL, mặc định PER_ENTRY* | *PER_ENTRY hoặc PER_HOUR. [đề xuất] G-02* | *FR-24, FR-34, AS26* |

**Quy tắc của thiết kế G-02 (đề xuất, chưa có hiệu lực).** Khóa chính đổi thành (`lot_id`, `vehicle_type_code`, `fee_group`). Số tiền: `amount = price` nếu PER_ENTRY; `amount = price × ceil(số giờ gửi)` nếu PER_HOUR (AS26, ví dụ 60 phút tính 1 giờ, 61 phút tính 2 giờ). **Hoãn theo CR-04.** Nếu CR-04 được duyệt thì các ca 60 và 61 phút của AT-06 không thuộc nghiệm thu v1.0. Trong v1.0 mọi giá là giá theo lượt.

### 3.8 vehicles (ENT-07)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã xe | — |
| plate | TEXT | NOT NULL, UNIQUE | Biển số đầy đủ | FR-04, AS17 |
| qr_code | TEXT | NOT NULL, UNIQUE | Giá trị mã QR | FR-09, FR-12 |
| rfid_code | TEXT | NOT NULL, UNIQUE | Mã RFID mô phỏng do hệ thống sinh | FR-09, D-32 |
| vehicle_type_code | TEXT | NOT NULL, FK → vehicle_types.code | Loại xe | FR-04 |
| owner_id | TEXT | NULL, FK → users.id | Chủ xe; trống = xe vãng lai | FR-04, FR-05, FR-11 |
| created_at | DATETIME | NOT NULL, mặc định now | Thời điểm tạo | — |

### 3.9 parking_sessions (ENT-08)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã lượt gửi | — |
| vehicle_id | TEXT | NULL, FK → vehicles.id | Xe. Chỉ bị đặt thành trống khi **xe vãng lai** bị xóa lúc xóa dữ liệu quá hạn; xe của Customer vẫn giữ liên kết (biển số trên lượt đã thay bằng `[purged]`) | FR-09, FR-45 |
| plate_snapshot | TEXT | NOT NULL | Biển số sao chép lúc vào. Sau khi xóa dữ liệu quá hạn (12 tháng), cột được ghi giá trị thay thế cố định `'[purged]'` (hằng `PURGED` trong `src/server/services/purge.ts`), **không** đặt NULL, nên ràng buộc NOT NULL luôn đúng | FR-09, FR-42, FR-45, FR-47, D-29 |
| zone_id | TEXT | NOT NULL, FK → zones.id | Khu vực | FR-09, FR-17 |
| vehicle_type_code | TEXT | NOT NULL, FK → vehicle_types.code | Loại xe | FR-09, FR-17, FR-38 |
| fee_group | TEXT | NOT NULL | Nhóm tính phí chốt lúc vào | FR-11, FR-34 |
| id_method | TEXT | NOT NULL | PLATE, QR hoặc RFID | FR-09, FR-13 |
| entry_time | DATETIME | NOT NULL | Thời điểm vào | FR-09, FR-14, FR-39 |
| exit_time | DATETIME | NULL | Thời điểm ra | FR-13, FR-14 |
| entry_staff_id | TEXT | NOT NULL, FK → users.id | Nhân viên ghi nhận vào | FR-10 |
| exit_staff_id | TEXT | NULL, FK → users.id | Nhân viên ghi nhận ra | FR-10, FR-13 |
| status | TEXT | NOT NULL | OPEN hoặc CLOSED | FR-13, FR-17, FR-49 |
| reservation_id | TEXT | NULL, UNIQUE, FK → reservations.id | Đặt chỗ được dùng | FR-31, FR-51 |
| owner_id | TEXT | NULL | Chủ xe tại thời điểm vào (trống = khách); không đổi về sau | FR-37 |
| entry_gate | TEXT | NOT NULL, mặc định `GATE-1` | Cổng vào: `GATE-1` hoặc `GATE-2` (cổng mô phỏng của bãi thí điểm, danh sách `GATES` trong `src/lib/types.ts`). Bộ mô phỏng dùng mặc định. [G-09, A-65] | FR-09 |
| exit_gate | TEXT | NULL | Cổng ra; trống khi lượt còn mở. [G-09, A-65] | FR-09, FR-13 |
| entry_source | TEXT | NOT NULL, mặc định `DEVICE` | Nguồn ghi nhận vào: `DEVICE` (bộ mô phỏng, sự kiện thiết bị) hoặc `MANUAL` (Staff nhập trên form). [G-04, A-65] | FR-10 |
| exit_source | TEXT | NULL | Nguồn ghi nhận ra, cùng tập giá trị; trống khi lượt còn mở (giống `exit_gate`). [G-04, A-65] | FR-10 |

### 3.10 session_events (ENT-09)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã sự kiện | — |
| session_id | TEXT | NOT NULL, FK → parking_sessions.id | Lượt gửi | FR-47, FR-48 |
| type | TEXT | NOT NULL | PLATE_MISMATCH_CONFIRMED, LOST_CARD [main]; EARLY_ARRIVAL_CONFIRMED (Staff tiếp nhận xe đến sớm, Q31) [round3] | FR-47, FR-48, FR-51 |
| staff_id | TEXT | NOT NULL, FK → users.id | Nhân viên xác nhận | FR-43, FR-47, FR-48 |
| note | TEXT | NULL | Ghi chú. Với PLATE_MISMATCH_CONFIRMED (EX-02), hệ thống ghi `Observed plate: <biển số đọc được lúc ra>`, sau đó là ghi chú của Staff. Biển số trong ghi chú này được che và xóa như `plate_snapshot` (mục 6, Q44, Q46) | FR-42, FR-45, FR-47 |
| created_at | DATETIME | NOT NULL, mặc định now | Thời điểm | — |

### 3.11 access_logs (ENT-13)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã dòng nhật ký | — |
| user_id | TEXT | NULL, FK → users.id | Tài khoản thực hiện; trống với thao tác của hệ thống (ví dụ xóa tự động, mục 6) | FR-43, FR-44 |
| action | TEXT | NOT NULL | LOGIN, LOGOUT, VIEW_FULL_PLATE, ENTRY, EXIT, MANUAL_CONFIRM, LOT_CHANGE, TARIFF_CHANGE, ACCOUNT_CHANGE, PURGE; LOGIN_FAILED, ACCESS_DENIED [G-06, A-28] | FR-43, D-23 |
| target | TEXT | NULL | Đối tượng tác động | FR-43 |
| created_at | DATETIME | NOT NULL, mặc định now | Thời điểm | FR-43, FR-44 |

SRS v0.2 FR-43 yêu cầu ghi cả **đăng nhập thất bại** và **lần bị từ chối quyền** (G-06, đã làm 23/11, `6ef8862`, PR #11):

- **LOGIN_FAILED**: `target` là lý do `reason:BAD_PASSWORD`, `reason:LOCKED` (gắn `user_id` của tài khoản) hoặc `reason:UNKNOWN_EMAIL` (`user_id` trống, **không lưu email** đã nhập, để không ghi dữ liệu cá nhân của người không có tài khoản).
- **ACCESS_DENIED**: ghi khi người **đã đăng nhập** bị từ chối vì sai vai trò. Gọi API: `requireRole` ghi `target = roles:<vai trò cần>` rồi trả 403. Mở trang: middleware chỉ kiểm tra đăng nhập; layout của từng khu vực (`requireSection`) kiểm tra vai trò trên Node, ghi `target = page:/manager` (hoặc `/staff`, `/customer`) **một lần cho mỗi request** rồi chuyển sang `/denied`. Nếu kiểm tra `requireRole` của chính trang chạy trước layout, dòng đó có `target = roles:<vai trò cần>`; mỗi request vẫn chỉ một dòng. Trang `/denied` chỉ hiển thị, không ghi (sửa sau review PR #11 của RES-01).

Mọi dòng nhật ký mà FR-43 yêu cầu được ghi **trong cùng transaction** với thay đổi nó ghi lại (đăng ký, PURGE, EXIT, MANUAL_CONFIRM, LOT_CHANGE, TARIFF_CHANGE, ACCOUNT_CHANGE; `2ad2170`, PR #11): nếu không ghi được dòng nhật ký thì thay đổi cũng không được lưu.
- **Không ghi lỗi 401** (chưa đăng nhập): middleware chạy trên Edge, không ghi được CSDL; yêu cầu ẩn danh không có tài khoản để gắn, nếu ghi sẽ làm đầy nhật ký. Đây là ngoại lệ có chủ đích của mục 10 #3.

### 3.12 reservations (ENT-10)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã đặt chỗ | — |
| customer_id | TEXT | NOT NULL, FK → users.id | Người đặt | FR-27, FR-28 |
| vehicle_id | TEXT | NOT NULL, FK → vehicles.id | Xe | FR-27 |
| zone_id | TEXT | NOT NULL, FK → zones.id | Khu vực | FR-27, FR-52 |
| vehicle_type_code | TEXT | NOT NULL, FK → vehicle_types.code | Loại xe | FR-27, FR-52 |
| arrival_time | DATETIME | NOT NULL | Giờ hẹn | FR-27, FR-31, FR-51 |
| hold_until | DATETIME | NOT NULL | Giờ hẹn + 30 phút | FR-30, AS10 |
| status | TEXT | NOT NULL | PENDING, CANCELLED, NO_SHOW, FULFILLED | FR-29 đến FR-33 |
| created_at | DATETIME | NOT NULL, mặc định now | Thời điểm đặt | — |
| cancel_reason | TEXT | NULL | CUSTOMER, ENTERED_OTHER_ZONE [main]; LOT_SUSPENDED [round3] | FR-29, FR-32, FR-50, D-41 |
| cancel_zone_id | TEXT | NULL, FK → zones.id | Khu vực xe thực sự vào | FR-32 |

Ánh xạ trạng thái sang SRS v0.2 FR-33: PENDING = "Đang hiệu lực", FULFILLED = "Đã đến", CANCELLED = "Đã hủy", NO_SHOW = "Không đến".

### 3.13 payments (ENT-12)

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã giao dịch | — |
| session_id | TEXT | NOT NULL, UNIQUE, FK → parking_sessions.id | Lượt gửi (mỗi lượt tối đa 1 giao dịch) | FR-35, FR-36 |
| amount | INTEGER | NOT NULL | Số tiền (VNĐ) | FR-34, FR-36, FR-40 |
| status | TEXT | NOT NULL, mặc định CONFIRMED | Trạng thái | FR-35, FR-40 |
| paid_at | DATETIME | NOT NULL | Thời điểm thanh toán | FR-36, FR-40 |
| confirmed_by_id | TEXT | NOT NULL, FK → users.id | Nhân viên xác nhận | FR-35, FR-36 |
| *pricing_method, unit_price* | *TEXT, INTEGER* | *NOT NULL* | *Ảnh chụp mục giá đã áp dụng lúc thanh toán. [đề xuất] G-03* | *FR-36* |

**Mục giá đã áp dụng trong v1.0 (review CP-03, 23/11).** G-03 vẫn hoãn vì phụ thuộc G-02. Trong v1.0 chỉ có giá theo lượt, và bảng giá có khóa (loại xe, nhóm tính phí). Lượt gửi đã chốt hai giá trị này lúc xe vào (`vehicle_type_code`, `fee_group`), nên mục giá áp dụng của một giao dịch xác định được bằng **(loại xe, nhóm tính phí) của lượt cùng `amount`**, với `amount` chính là đơn giá. AT-06 kiểm tra mục giá theo cách này. Khi có giá theo giờ (G-02) thì mới cần ảnh chụp riêng (G-03).

### 3.14 notifications (ENT-15) [round3]

| Cột | Kiểu | Ràng buộc | Mô tả | FR |
|---|---|---|---|---|
| id | TEXT | PK | Mã thông báo | — |
| user_id | TEXT | NOT NULL, FK → users.id | Người nhận | FR-50 |
| type | TEXT | NOT NULL | Loại thông báo, chọn khóa i18n; hiện có LOT_SUSPENDED | FR-50, AS20 |
| params | TEXT | NOT NULL, mặc định `{}` | Tham số của thông báo (JSON dạng chuỗi) | FR-50 |
| created_at | DATETIME | NOT NULL, mặc định now | Thời điểm tạo | FR-50 |
| read_at | DATETIME | NULL | Thời điểm đã đọc; trống = chưa đọc | FR-50 |

Migration: `prisma/migrations/20261115160000_notifications` (làm trên nhánh round3, đã merge vào `main` qua PR #4, CR-02). Chỉ mục `(user_id, read_at, created_at)` phục vụ đếm thông báo chưa đọc và liệt kê theo thời gian.

## 4. Quy tắc toàn vẹn và cách tính chỗ trống

| Quy tắc | Bảo đảm ở | Cách bảo đảm | FR |
|---|---|---|---|
| Khóa chính, khóa ngoại, duy nhất (email, biển số, QR, RFID, session_id của payment, reservation_id của lượt) | CSDL | Ràng buộc PK, FK, UNIQUE trong migration | FR-04, FR-12, FR-36 |
| Loại xe, vai trò thuộc danh mục | CSDL | Khóa ngoại tới vehicle_types, roles | FR-04, FR-06 |
| Giá trị trạng thái, nhóm, phương thức hợp lệ | Ứng dụng | Kiểu union trong `src/lib/types.ts`; SQLite không có enum hay CHECK trong lược đồ hiện tại | — |
| Mỗi xe chỉ có một lượt đang mở (EX-04) | Ứng dụng | Dịch vụ ghi nhận xe vào kiểm tra lượt OPEN rồi tạo lượt mới trong cùng một khóa tuần tự (`withLock`) và giao dịch | FR-49 |
| Không vượt sức chứa khi sự kiện đồng thời | Ứng dụng | Đọc chỗ trống và ghi lượt trong cùng `withLock` + giao dịch | FR-17, FR-46 |
| Giờ ra không trước giờ vào | Ứng dụng | Giờ ra lấy thời điểm xử lý trên máy chủ; riêng bộ mô phỏng khi sinh dữ liệu quá khứ truyền thời điểm vào/ra theo thứ tự. Không có ràng buộc CSDL riêng | FR-14 |
| Mỗi **tài khoản** tối đa 1 đặt chỗ đang hiệu lực (Q31) | Ứng dụng | Trong `withLock`: nếu tài khoản đã có đặt chỗ PENDING thì từ chối với `RESERVATION_LIMIT` (409). Kiểm tra theo **xe** (`VEHICLE_ALREADY_RESERVED`) vẫn giữ. Không dùng UNIQUE ở CSDL vì SQLite trong Prisma không khai báo được chỉ mục duy nhất có điều kiện (`WHERE status = 'PENDING'`); xem ghi chú dưới bảng. [round3] | FR-28, AS19 |
| Xe đến sớm chỉ được tính là đã đến khi Staff tiếp nhận (Q31) | Ứng dụng | Lượt vào trước `arrival_time` bị từ chối với `EARLY_ARRIVAL` cho đến khi Staff kiểm tra chỗ và gửi `confirmEarly`; sau đó lượt được tạo, đặt chỗ chuyển sang FULFILLED, ghi `session_events` loại `EARLY_ARRIVAL_CONFIRMED` và `access_logs` loại `MANUAL_CONFIRM`. Không tự động check-in. [round3] | FR-31, FR-51 |
| Xe vào khu vực khác khu vực đã đặt (Q31) | Ứng dụng | Đặt chỗ cũ chuyển sang CANCELLED với `cancel_reason = ENTERED_OTHER_ZONE`, `cancel_zone_id` = khu vực mới; lượt gửi tạo như xe vãng lai tại khu vực mới, áp phí theo khu vực đó. Khách hàng đồng ý giả định [main] | FR-32 |
| Xe vãng lai không dùng chỗ đã giữ (Q31) | Ứng dụng | Chỗ trống của xe đến trực tiếp đã trừ đặt chỗ PENDING còn hạn (công thức bên dưới) [main] | FR-17, FR-19 |
| Bãi tạm ngưng thì hủy đặt chỗ đang hiệu lực (Q32) | Ứng dụng | Trong cùng thao tác đổi trạng thái: chuyển đặt chỗ quá hạn sang NO_SHOW trước, sau đó chuyển đặt chỗ PENDING còn hạn sang CANCELLED với `cancel_reason = LOT_SUSPENDED` và tạo một `notifications` cho mỗi Customer. Các đặt chỗ này không tính là không đến. Xe đang gửi vẫn được ra; không nhận xe mới, không nhận đặt chỗ mới (Q27, Q32). [round3] | FR-50, AS20 |

**Vì sao không dùng chỉ mục duy nhất có điều kiện** (review CP-03 đề nghị cho "1 đặt chỗ PENDING mỗi khách" và "1 lượt OPEN mỗi xe"). SQLite hỗ trợ `CREATE UNIQUE INDEX ... WHERE`, nhưng `schema.prisma` không khai báo được loại chỉ mục này, nên nó chỉ tồn tại nếu viết tay trong migration. Khi đó (1) CSDL kiểm thử tạo bằng `prisma db push` từ `schema.prisma` sẽ **không có** chỉ mục, nên test không kiểm được nó; (2) migration sinh tự động về sau có thể xóa chỉ mục mà không ai thấy. Về chạy song song: mọi lệnh ghi đặt chỗ và lượt vào đi qua `withLock` trong một tiến trình (D-16), nên hai yêu cầu đồng thời không thể cùng vượt qua bước kiểm tra. EX-04 và RESERVATION_LIMIT đều có test. Nếu triển khai nhiều tiến trình thì phải bổ sung chỉ mục này cùng khóa ở CSDL (mục 10 #6).

**Cách tính chỗ trống** (FR-17, D-21): với mỗi khu vực × loại xe, chỗ trống = sức chứa − số lượt có `status = OPEN` − số đặt chỗ `PENDING` có `hold_until > hiện tại`, chặn dưới ở 0 (trường hợp Manager giảm sức chứa xuống dưới số xe đang đỗ). Giá trị được tính khi truy vấn, không lưu thành cột. Trước mỗi lần đọc, đặt chỗ quá hạn được chuyển sang NO_SHOW (FR-30) để chỗ được giải phóng đúng lúc.

Khóa `withLock` là khóa trong một tiến trình. Nó đủ cho demo chạy một tiến trình cục bộ (D-16). Nếu triển khai nhiều tiến trình thì phải thay bằng ràng buộc hoặc khóa ở CSDL. Đây là giới hạn đã biết, ghi ở mục 10.

### 4.1 Cách tính 4 chỉ số báo cáo (Q28)

Các chỉ số được tính khi truy vấn (`src/server/services/reports.ts`), không lưu bảng tổng hợp. API trả về tỷ lệ dạng phân số làm tròn 4 chữ số; giao diện hiển thị dạng phần trăm (× 100%, theo cách viết của khách hàng).

| Chỉ số | Công thức đã chốt (Q28) | Dữ liệu dùng | Trạng thái |
|---|---|---|---|
| Tỷ lệ sử dụng theo giờ | Số chỗ đang dùng trung bình trong giờ ÷ sức chứa tương ứng × 100%. **Tính riêng theo từng khu vực × loại xe** vì sức chứa được chia theo `zone_capacities`; vẫn giữ một chuỗi tổng | `parking_sessions(entry_time, exit_time, zone_id, vehicle_type_code)`, `zone_capacities` | [round3] (`utilisationBySlice`) |
| Giờ cao điểm | 3 khung giờ có nhiều lượt vào nhất. **Khoảng thống kê: theo giờ đồng hồ (0-23 giờ)**, giờ địa phương của máy chủ | `parking_sessions.entry_time` | [main] |
| Doanh thu | Tổng `payments.amount` có `status = CONFIRMED` theo ngày của `paid_at` | `payments` | [main] |
| Tỷ lệ không đến | Số đặt chỗ NO_SHOW ÷ (tổng đặt chỗ − số CANCELLED) × 100%. NO_SHOW **chỉ** được gán bởi bộ hết hạn khi `hold_until` đã qua mà xe chưa đến, nên chỉ đếm đặt chỗ hết thời gian chờ. Đặt chỗ bị hủy do bãi tạm ngưng là CANCELLED, không tính là không đến | `reservations(status, hold_until)` | [main] |

Ngưỡng nghiệm thu nhóm gửi kèm Q28 (chỗ trống khớp 100% số đếm tay trong kịch bản 100 lượt; 100% lượt có bản ghi đầy đủ; 5/5 ngoại lệ; tối đa 3 giây mỗi lượt) **chưa được khách hàng trả lời**. Xem mục 10 #11 và R-M3-06 trong sổ rủi ro.

## 5. Hỗ trợ nhiều bãi

Mọi dữ liệu theo bãi gắn với bãi qua `zones.lot_id`: sức chứa (qua khu vực), lượt gửi (qua `zone_id`), đặt chỗ (qua `zone_id`). Thêm bãi mới chỉ cần thêm dòng vào `parking_lots`, `zones`, `zone_capacities`; không đổi lược đồ (NFR-11, Q04).

**Khoảng trống:** bảng giá hiện dùng chung cho mọi bãi, trong khi SRS v0.2 FR-24 yêu cầu bảng giá theo bãi. Phép thử của NFR-11 ("tạo bãi thứ hai với … bảng giá") vì vậy chưa đạt. Xem mục 11 G-02.

## 6. Bảo vệ dữ liệu cá nhân và lưu giữ

| Biện pháp | Thực hiện | Nguồn |
|---|---|---|
| Mật khẩu | Chỉ lưu `password_hash` (bcrypt) | NFR-01 |
| Biển số đầy đủ | Lưu ở `vehicles.plate` và ảnh chụp `parking_sessions.plate_snapshot` (cần cho đối chiếu EX-02 và lịch sử khi xe đổi chủ); che khi hiển thị cho người không có quyền. Ai thấy đầy đủ (Q46): Manager luôn thấy; chủ xe thấy xe và lịch sử của mình; Staff chỉ thấy khi lượt **đang mở**, lượt đã đóng thì Staff thấy biển số đã che theo định dạng của SRS FR-42, chỉ hiện 3 chữ hoặc số cuối (`51F-123.45` → `***-**3.45`, `5fabb1f`), kể cả trong ghi chú EX-02. Mỗi lần hiện biển số đầy đủ ở chi tiết lượt ghi VIEW_FULL_PLATE | FR-42, D-29, Q46 |
| Nhật ký truy cập | `access_logs` ghi các hành động ở D-23 | FR-43, FR-44 |
| Lưu giữ 12 tháng: thao tác xóa | Một giao dịch: đặt `plate_snapshot = '[purged]'` cho lượt đã đóng có **giờ ra** trước mốc 12 tháng (Q44: tính từ khi xe ra và lượt được đóng; bản trước tính theo giờ vào, sửa ở `a755fae`, PR #11); thay biển số trong ghi chú EX-02 của các lượt đó bằng `[purged]`; xóa xe vãng lai không có lượt nào ra sau mốc, không có lượt đang mở và không có đặt chỗ (gỡ `vehicle_id` khỏi lượt cũ trước khi xóa); ghi nhật ký PURGE. Số lượt, thời gian gửi và giao dịch không bị xóa, nên báo cáo FR-38 đến FR-40 không đổi. Cách xóa này khớp câu trả lời Q35 ("xóa hoặc ẩn biển số khỏi các lượt gửi đã kết thúc, giữ số lượt, thời gian gửi và doanh thu") [main] | FR-45, Q18, Q35, Q44 |
| Lưu giữ 12 tháng: kích hoạt | **Tự động** theo Q35: bộ hẹn giờ `src/server/purgeSchedule.ts` (đăng ký trong `src/instrumentation.ts`) chạy 60 giây sau khi khởi động, sau đó mỗi 24 giờ; ghi PURGE với `user_id` trống (thao tác hệ thống). Nút của Manager (`/api/purge`) vẫn chạy ngay khi cần. MVP ban đầu chỉ có nút; tự động làm trong A-28 (G-05, `bc172ce`, PR #11, chờ merge; sau khi merge đổi nhãn thành [main]) | FR-45, AS23 |
| Dữ liệu kiểm thử | Chỉ dữ liệu từ seed và bộ mô phỏng | NFR-03 |

### 6.1 Quyền đọc dữ liệu theo vai trò (Q34)

Q34 chốt: Quản lý (khách hàng gọi là **Admin**, trong hệ thống là `MANAGER`) quản lý bãi, khu vực, sức chứa, bảng giá, tài khoản, nhóm người dùng và xem báo cáo. Nhân viên (`STAFF`) ghi nhận xe vào/ra, tra cứu lượt gửi, xác nhận thanh toán, xử lý ngoại lệ, theo dõi chỗ trống, và **được xem thông tin xe, lượt gửi, đặt chỗ, tình trạng bãi** cần cho nghiệp vụ. Lược đồ không cần đổi; quyền kiểm tra ở tầng ứng dụng (`requireRole`).

| Bảng | Customer | Staff (Q34) | Manager | Hiện trạng code | Khoảng trống |
|---|---|---|---|---|---|
| parking_sessions | Lượt của mình (`owner_id`) | Đọc, ghi vào/ra; biển số lượt đã đóng bị che (Q46) | Đọc, biển số đầy đủ | Staff có `/staff/sessions`, `/staff/sessions/[id]` (ghi VIEW_FULL_PLATE khi hiện biển số đầy đủ) | Đã làm Q46 (`8b59333`, `e19f356`, PR #11) |
| payments | Của mình | Tạo khi xác nhận ra | Đọc | Đúng | — |
| parking_lots, zones, zone_capacities (tình trạng bãi) | Đọc chỗ trống | Đọc chỗ trống và trạng thái bãi | Đọc, ghi | `/api/availability` cho cả 3 vai trò; `/api/lots`, `/api/zones` chỉ MANAGER | Staff chưa có màn hình chi tiết bãi; chỗ trống và trạng thái đã đủ cho nghiệp vụ |
| vehicles | Xe của mình | **Đọc (tra cứu theo biển số, QR, RFID)** | Đọc | `GET /api/vehicles` chỉ CUSTOMER | **G-08 đã làm** (A-65, `49299ac`, PR #11) |
| reservations | Của mình | **Đọc (đặt chỗ đang hiệu lực theo khu vực, theo biển số)** | Đọc | `GET /api/reservations` chỉ CUSTOMER; Staff chỉ thấy đặt chỗ gián tiếp khi xe vào | **G-08 đã làm** (A-65, `49299ac`, PR #11) |
| tariffs | Đọc giá của nhóm mình (Q45) | — | Đọc, ghi | Trang chủ Customer hiện giá mỗi lượt theo loại xe cho nhóm của Customer | Đã làm Q45 (PR #17) |
| users | Đọc nhóm của mình; gửi yêu cầu đổi nhóm (Q38) | — | Đọc, ghi; đổi nhóm của Customer (Q38) | API tài khoản không trả `password_hash` | Đã làm Q38 (PR #17) |
| access_logs | — | — | Đọc | Đúng | — |

Biển số hiển thị cho Staff khi tra cứu xe phải theo quy tắc che biển số (FR-42) và ghi `VIEW_FULL_PLATE` khi mở chi tiết (D-31, KB-06).

## 7. Chỉ mục và truy vấn chính

| Chỉ mục | Phục vụ | Trạng thái |
|---|---|---|
| `parking_sessions(status, zone_id)` | Đếm lượt đang mở theo khu vực (FR-17); tìm lượt đang mở | [main] |
| `reservations(status, zone_id)` | Đếm đặt chỗ đang hiệu lực (FR-17, FR-52) | [main] |
| `parking_sessions(owner_id)` | Lịch sử của Customer (FR-37) | [main] |
| UNIQUE `vehicles(plate)`, `vehicles(qr_code)`, `vehicles(rfid_code)` | Tìm xe theo biển số, QR, RFID khi vào/ra (FR-09, FR-13) | [main] |
| UNIQUE `users(email)` | Đăng nhập (FR-02) | [main] |
| `notifications(user_id, read_at, created_at)` | Đếm và liệt kê thông báo (FR-50) | [round3] |
| `reservations(customer_id, status)` | Kiểm tra 1 đặt chỗ đang hiệu lực mỗi tài khoản (Q31); danh sách đặt chỗ của Customer | G-07 **đã làm** (A-65, `d64e95f`, PR #11) |
| `parking_sessions(entry_time)` | Lọc lượt theo khoảng thời gian (FR-16), báo cáo theo giờ (FR-38, FR-39) | G-07 **đã làm** (A-65, `d64e95f`, PR #11) |
| `access_logs(created_at)`, `access_logs(user_id)` | Lọc nhật ký theo thời gian và tài khoản (FR-44) | G-07 **đã làm** (A-65, `d64e95f`, PR #11) |

Ở quy mô thí điểm (330 chỗ, dữ liệu 60 ngày từ bộ mô phỏng) truy vấn chưa cần các chỉ mục G-07. Chúng là biện pháp phòng ngừa, không bắt buộc cho CP-03.

## 8. Script lược đồ và dữ liệu mẫu

| Thành phần | Vị trí | Nội dung |
|---|---|---|
| Lược đồ | `prisma/schema.prisma` | 14 model trên `main` (13 model của V1.0 + `Notification` [round3]); ánh xạ sang tên bảng snake_case |
| Migration | `prisma/migrations/20261108042044_init` | Tạo toàn bộ bảng và chỉ mục |
| Migration | `prisma/migrations/20261108120000_session_owner` | Thêm `parking_sessions.owner_id` và chỉ mục |
| Migration | `prisma/migrations/20261108140000_reservation_cancel_reason` | Thêm `cancel_reason`, `cancel_zone_id` (D-41) |
| Migration | `prisma/migrations/20261115160000_notifications` [round3] | Tạo `notifications` và chỉ mục |
| Dữ liệu mẫu | `prisma/seed.ts` | 3 vai trò; 2 loại xe; bãi thí điểm với khu vực A (150 xe máy), B (150 xe máy), C (30 ô tô); bảng giá xe máy 2.000 VNĐ, ô tô 10.000 VNĐ cho cả 3 nhóm; 2 Manager, 2 Staff, ít nhất 15 Customer (D-17, D-18, D-40). Có bước xóa `notifications` khi seed lại [round3] |
| Lệnh | `package.json` | `npm run db:reset` tạo lại CSDL theo migration; `npm run db:seed` nạp dữ liệu mẫu |

Thay đổi lược đồ sau Baseline V1.0 được thực hiện bằng migration mới, không sửa migration cũ, và phải có CR. Migration `notifications` cũng thuộc quy tắc này; CR tương ứng là CR-02 (câu trả lời vòng 3, 15/11), ghi trong Change Log (`docs/m3/decision-record.md`).

## 9. Truy vết yêu cầu → thực thể (SRS v0.2)

| Yêu cầu | Thực thể | Yêu cầu | Thực thể |
|---|---|---|---|
| FR-01, FR-02, FR-08 | users | FR-27, FR-28 | reservations (customer_id, vehicle_id, zone_id) |
| FR-03 | — (phiên JWT, không lưu CSDL) | FR-29, FR-30, FR-33 | reservations (status, hold_until, cancel_reason) |
| FR-04, FR-05 | vehicles, vehicle_types | FR-31, FR-51 | reservations, parking_sessions.reservation_id |
| FR-06, FR-07 | users (user_group, requested_user_group Q38), roles | FR-32 | reservations.cancel_reason, cancel_zone_id |
| FR-09, FR-12 | parking_sessions, vehicles | FR-34 | tariffs, parking_sessions.fee_group |
| FR-10 | parking_sessions (entry/exit_staff_id, entry/exit_source G-04) | FR-35, FR-36 | payments |
| FR-11 | vehicles.owner_id, parking_sessions.fee_group, owner_id | FR-37 | parking_sessions.owner_id, payments |
| FR-13, FR-14, FR-15, FR-16 | parking_sessions | FR-38 | parking_sessions, zone_capacities |
| FR-17, FR-18 | zone_capacities, parking_sessions, reservations | FR-39 | parking_sessions.entry_time |
| FR-19, FR-20, FR-21 | zone_capacities (đọc), parking_sessions, reservations | FR-40 | payments |
| FR-22, FR-26 | parking_lots (open_time, close_time G-01), tariffs (Q45) | FR-41 | reservations |
| FR-23 | zones, zone_capacities, vehicle_types | FR-42 | vehicles.owner_id (quyền xem), plate_snapshot |
| FR-24 | tariffs; theo bãi và cách tính G-02 | FR-43, FR-44 | access_logs |
| FR-25 | parking_lots.status, access_logs | FR-45 | parking_sessions.plate_snapshot, vehicles, access_logs |
| FR-46 | zone_capacities, parking_sessions, reservations | FR-47, FR-48 | session_events, access_logs |
| FR-49 | parking_sessions.status | FR-50 | parking_lots.status, reservations, notifications |
| FR-52 | reservations, vehicles | NFR-01 | users.password_hash |

Mọi FR có lưu dữ liệu đều có ít nhất một thực thể. FR-03 (hết phiên) không lưu dữ liệu. FR-24 và FR-36 có thực thể nhưng không có cột theo bãi, theo giờ và mục giá; khách hàng xác nhận chỉ tính theo lượt (Q36), nên hai mục này hoãn qua CR-04 (mục 11.1).

**Ánh xạ mã FR từ SRS v0.1 (bản P03 v0.2 dùng) sang SRS v0.2**, cho các mã đổi nghĩa thường gặp: xóa dữ liệu FR-32 → FR-45; lịch sử Customer FR-28 → FR-37; nhật ký FR-31 → FR-43, FR-44; đặt chỗ FR-20…FR-25 → FR-27…FR-33; thanh toán FR-26, FR-27 → FR-34, FR-35, FR-36; chỗ trống FR-17 giữ nguyên. Bảng ánh xạ đầy đủ thuộc P24 (RES-04), xem R-M3-02.

## 10. Giả định, khác biệt và vấn đề mở

| # | Nội dung | Ảnh hưởng | Xử lý |
|---|---|---|---|
| 1 | PD-P03 dự kiến thư mục `database/`; thực tế dùng `prisma/` theo quy ước của Prisma | Không | Cập nhật PD-P03 mục Format |
| 2 | PD-P03 tiêu chí 8 yêu cầu biển số đầy đủ chỉ ở `vehicles`; thiết kế lưu thêm `plate_snapshot` trên lượt gửi (D-29) | Biển số xuất hiện ở hai bảng | **Chốt (22/11): giữ `plate_snapshot`.** Ảnh chụp cần cho EX-02 và lịch sử; được che khi hiển thị và xóa sau 12 tháng (Q35). Tiêu chí 8 đọc là "biển số đầy đủ chỉ ở `vehicles` và ảnh chụp có thời hạn trên lượt gửi" |
| 3 | PD-P03 tiêu chí 8 yêu cầu cột của `access_logs` không trống; `user_id` cho phép trống | Dòng nhật ký có thể không gắn tài khoản | **Chốt (22/11, sửa 24/11 theo review PR #10):** `action`, `created_at` luôn bắt buộc. `user_id` chỉ được trống trong hai trường hợp: (a) thao tác của hệ thống (xóa tự động G-05, `action = PURGE`); (b) đăng nhập thất bại với email không tồn tại (`action = LOGIN_FAILED`, `target = reason:UNKNOWN_EMAIL`, mục 3.11), vì không có tài khoản để gắn và không lưu email. Mọi thao tác khác của người dùng phải có `user_id`. Kiểm tra: `SELECT action, target FROM access_logs WHERE user_id IS NULL` chỉ trả về hai loại dòng trên |
| 4 | PD-P03 tiêu chí 10 yêu cầu cờ "dữ liệu mô phỏng"; lược đồ không có cột này | Không lọc riêng được dữ liệu mô phỏng | **Chốt (22/11): bỏ tiêu chí, không thêm cột.** Toàn bộ dữ liệu là mô phỏng (NFR-03, Q02, Q26). Không có dữ liệu thật nào để tách riêng |
| 5 | "Một lượt mở mỗi xe" và "giờ ra sau giờ vào" bảo đảm ở ứng dụng, không bằng ràng buộc CSDL | Phụ thuộc mọi đường ghi đi qua dịch vụ | Luồng trực tiếp và luồng ngoại lệ của bộ mô phỏng gọi cùng hàm dịch vụ (KB-01). **Riêng luồng sinh lịch sử** (`addClosedSession` trong `simulator.ts`) ghi thẳng lượt đã đóng bằng `createMany`, nên mọi cột hoặc quy tắc mới của `parking_sessions`, `payments` phải đặt cả ở đó (ví dụ cổng và nguồn, `178289c`). Có kiểm thử tự động cho cả hai luồng |
| 6 | Khóa `withLock` chỉ trong một tiến trình | Không đủ nếu chạy nhiều tiến trình | Phù hợp demo cục bộ (D-16) |
| 7 | ~~Biển số duy nhất và cách xóa dữ liệu là giả định chờ vòng 3~~ | — | **Đóng.** Q29: khách hàng đồng ý biển số duy nhất, nhiều xe mỗi tài khoản, xe vãng lai được gán khi đăng ký (AS17), giữ UNIQUE `vehicles.plate`. Q30: đồng ý nhóm tự chọn khi đăng ký và mức "Khách" (`fee_group = GUEST`). Q35: xóa hoặc ẩn biển số trên lượt đã đóng, giữ thống kê, **tự động**; mục 6 và G-05 |
| 8 | ~~Các thay đổi vòng 3 đang ở nhánh round3, chưa merge và chưa có CR~~ | — | **Đóng.** PR #4 merge vào `main` ngày 19/11 (`8fd4926`); CR-02 ghi trong Change Log. P03 v0.4 mô tả lược đồ `main` 14 bảng |
| 9 | SRS v0.2 đánh số lại FR | Truy vết cũ trong P18, P24, test, chú thích code trỏ sai | P03 đã chuyển sang mã v0.2 (mục 9). R-M3-02 |
| 10 | Khách hàng gọi vai trò quản lý là "Admin" (Q34); hệ thống và tài liệu dùng `MANAGER` / "Quản lý" | Dễ nhầm khi đối chiếu với CIL | Giữ `MANAGER` trong lược đồ; tài liệu ghi "Quản lý (Admin)" lần đầu nhắc tới |
| 11 | Ngưỡng nghiệm thu gửi kèm Q28 chưa được khách hàng xác nhận | P21 và CP-08 dựa trên ngưỡng do nhóm đề xuất | **Chốt (22/11):** dùng ngưỡng của nhóm làm ngưỡng chính thức của P21; RES-01 nêu lại ngưỡng trong email gửi kịch bản (A-85); không có trả lời thì ghi trong P14 "khách hàng không phản đối". R-M3-06 |
| 12 | Bãi hết chỗ phải "thông báo tình trạng bãi cho người dùng" (Q27) | Không cần cột mới | Xe vào bị từ chối với `ZONE_FULL` ("Khu vực đã hết chỗ"); chỗ trống từng khu vực hiển thị trực tiếp qua `/api/availability` (SSE). Không lưu vào `notifications` |

## 11. Khoảng trống so với SRS v0.2 (cần CR)

Các mục dưới là yêu cầu dữ liệu của SRS v0.2 và vòng 3 mà lược đồ và code trên `main` chưa đáp ứng. Mỗi mục là đề xuất thiết kế của P03. Mục nào được làm thì phải có CR, migration mới và test. Ước lượng là con số của RES-03 và được ghi trong R-M3-01.

| G-ID | FR (ưu tiên) | Khoảng trống | Đề xuất thay đổi lược đồ | Ảnh hưởng ngoài CSDL | Ước lượng |
|---|---|---|---|---|---|
| G-01 | FR-22, FR-26 (Must), Q37 | Bãi không có giờ hoạt động | `parking_lots.open_time`, `close_time` TEXT NULL (HH:mm); migration `20261124090000_g01_lot_hours` | Form bãi của Manager; thẻ thông tin bãi của Customer; i18n. Chỉ để thông báo (Q37) | 1,5h |
| G-02 | FR-24 (Must), FR-34 (Should) | Bảng giá dùng chung mọi bãi, chỉ có giá theo lượt | `tariffs` thêm `lot_id` (FK) và `pricing_method` (PER_ENTRY, PER_HOUR); khóa chính thành `(lot_id, vehicle_type_code, fee_group)`; migration chép bảng giá hiện tại cho bãi thí điểm với PER_ENTRY | `computeFee` nhận thêm bãi và thời gian gửi (theo giờ: đơn giá × số giờ làm tròn lên, AS26); `exit.ts`, bộ mô phỏng, màn hình bảng giá, test phí | 8h |
| G-03 | FR-36 (Should) | Giao dịch không lưu mục giá đã áp dụng | `payments.pricing_method`, `unit_price`: ảnh chụp lúc xác nhận, không dùng FK vì bảng giá có thể bị sửa sau đó | `confirmExit`; lịch sử giao dịch | 1,5h |
| G-04 | FR-10 (Must) | Không phân biệt lượt từ thiết bị và lượt ghi thủ công | `parking_sessions.entry_source` TEXT NOT NULL mặc định DEVICE, `exit_source` TEXT NULL (DEVICE, MANUAL); migration `20261123190000_g04_session_source` | Form Staff gửi MANUAL; bộ mô phỏng gửi DEVICE; danh sách lượt | 1,5h |
| G-05 | FR-45 (Must), **Q35** | Xóa dữ liệu quá hạn chỉ chạy khi Manager bấm; Q35 chốt là tự động | Không đổi lược đồ | Bộ hẹn giờ hằng ngày trong `instrumentation.ts` gọi `purgeOldData` với người thực hiện là hệ thống (`user_id` trống) | 1,5h |
| G-06 | FR-43 (Must) | Nhật ký chưa ghi đăng nhập thất bại và lần bị từ chối quyền | Không đổi lược đồ; thêm giá trị `action` LOGIN_FAILED, ACCESS_DENIED (`user_id` có thể trống) | `auth/login`, `requireRole`; màn hình lọc nhật ký | 1,5h |
| G-07 | FR-16, FR-38, FR-39, FR-44, Q31 | Chưa có chỉ mục cho lọc theo thời gian và kiểm tra đặt chỗ theo tài khoản | `parking_sessions(entry_time)`, `access_logs(created_at)`, `access_logs(user_id)`, `reservations(customer_id, status)` | Không | 0,5h |
| G-08 | **Q34** | Staff chưa tra cứu được xe và đặt chỗ | Không đổi lược đồ | Endpoint đọc cho STAFF (xe theo biển số/QR/RFID, đặt chỗ đang hiệu lực theo khu vực hoặc biển số), màn hình tra cứu của Staff, che biển số và ghi VIEW_FULL_PLATE, test phân quyền. Gộp với A-65 (KB-15) | 3h |
| G-09 | FR-09 (Must) | Lượt gửi không lưu **cổng** vào/ra; FR-09 yêu cầu 6 trường gồm cổng, nên AT-01 bước 3 không đạt. Phát hiện ở review CP-03 (RES-02, 23/11) | `parking_sessions.entry_gate` TEXT NOT NULL mặc định `GATE-1`, `exit_gate` TEXT NULL; migration `20261123180000_g09_session_gate` | `recordEntry`, `confirmExit`, API vào/ra nhận `gate`; form Staff chọn cổng; trang chi tiết lượt hiện cổng | 2h |

FR-03 (hết phiên sau 30 phút không thao tác) không đổi lược đồ. Đây là thay đổi ở xác thực (JWT hiện sống 7 ngày, `src/server/auth/session.ts`).

Tổng ước lượng G-01 đến G-09: 21h (G-09 thêm 2h ở v0.5; G-01 còn 1,5h vì chỉ để thông báo, v0.6).

### 11.1 Quyết định phạm vi (RES-03, 22/11/2026)

Nguyên tắc: hạn nộp 29/11 (CR-01) còn ≈ 11,5h chưa có nguồn bù, nên chỉ làm (1) yêu cầu đến từ **câu trả lời của khách hàng** và (2) việc rất nhỏ. Yêu cầu chỉ đến từ SRS v0.2 mà khách hàng chưa đặt ra và không có trong Baseline V1.0 thì hoãn, ghi là khác biệt đã biết trong P14. Cách chọn này theo Q22: ưu tiên chức năng cốt lõi đã thống nhất. Các mục hoãn cần CR (CR-04, dòng soạn sẵn trong `docs/m3/risk-register.md` mục 6). Kết quả được xác nhận lại tại CP-03.

| Gap | FR | Trạng thái | CR-ID / commit | Người quyết | Ngày | Làm trong, giờ | Lý do |
|---|---|---|---|---|---|---|---|
| G-01 giờ hoạt động bãi | FR-22, FR-26 (Must) | **Đã làm**, chờ merge | CR-04; `41e1c08`, PR #17 | RES-03, theo Q37 của khách hàng | 22/11 hoãn, 24/11 làm | A-65, 1,5h | Đổi từ Hoãn: lý do hoãn ngày 22/11 (khách hàng chưa đặt ra, Q14 không có giờ) đúng tại thời điểm đó; Q37 (23/11) yêu cầu có giờ hoạt động, chỉ để thông báo |
| G-02 bảng giá theo bãi, theo giờ | FR-24 (Must), FR-34 (Should) | **Hoãn**, khách hàng xác nhận | CR-04 | RES-03 đề xuất; Q36 và Q40 khách hàng xác nhận (23/11); RES-01 đã duyệt CR-04 ngày 24/11 | 22/11 | — | Q36: bàn giao chỉ cần tính phí theo lượt; Q40: chạy một bãi thí điểm. 8h, rủi ro hồi quy cao ở phí và luồng xe ra (đường găng). Q16 chỉ yêu cầu giá cấu hình được theo loại xe hoặc nhóm, đã đáp ứng. Thí điểm một bãi (Q03) |
| G-03 mục giá trên giao dịch | FR-36 (Should) | **Hoãn**, khách hàng xác nhận | CR-04 | RES-03 đề xuất; Q36 (23/11); RES-01 đã duyệt CR-04 ngày 24/11 | 22/11 | — | Phụ thuộc G-02. Trong v1.0 mục giá xác định được qua loại xe, nhóm phí của lượt và `amount` (mục 3.13) |
| G-04 cờ lượt thủ công | FR-10 (Must) | **Đã làm**, chờ merge | CR-04; `68abc69`, PR #11 | RES-03, sau vòng review thứ hai của RES-02 | 23/11 | A-65, 1,5h | Đổi từ Hoãn: FR-10 là Must và AT-01 bước 5 cần nhãn thủ công. Form Staff ghi MANUAL, bộ mô phỏng ghi DEVICE; `exit_source` trống khi lượt còn mở |
| G-05 xóa tự động | FR-45 (Must), Q35 | **Đã làm**, chờ merge | CR-04; `bc172ce`, PR #11 | RES-03 (theo Q35 của khách hàng) | 22/11 quyết, 23/11 làm | A-28, 1,5h | Q35 khách hàng chốt; bảo vệ dữ liệu (CN4) |
| G-06 nhật ký đăng nhập thất bại, từ chối quyền | FR-43 (Must) | **Đã làm**, chờ merge | CR-04; `6ef8862`, PR #11 | RES-03, sau review CP-03 của RES-02 | 23/11 | A-28, 1,5h | Đổi từ Hoãn: AT-03 bước 7 và AT-04 bước 2 kiểm tra đúng các dòng nhật ký này |
| G-07 chỉ mục | FR-16, FR-38, FR-39, FR-44, Q31 | **Đã làm**, chờ merge | CR-04; `d64e95f`, PR #11 | RES-03 | 22/11 quyết, 23/11 làm | A-65, 0,5h | Rất nhỏ; phục vụ kiểm tra Q31 |
| G-08 Staff tra cứu xe, đặt chỗ | Q34 | **Đã làm**, chờ merge | CR-04; `49299ac`, PR #11 | RES-03 (theo Q34 của khách hàng) | 22/11 quyết, 23/11 làm | A-65, 3h | Q34 khách hàng chốt; A-65 đã có trong baseline |
| G-09 cổng vào/ra | FR-09 (Must) | **Đã làm**, chờ merge | CR-04; `6ef8862`, PR #11 | RES-03, sau review CP-03 của RES-02 | 23/11 | A-65, 2h | Thiếu cổng thì AT-01 bước 3 không đạt |

Các mục từ câu trả lời vòng 5 của khách hàng (Q36-Q46, 23/11), cũng thuộc CR-04:

| Mục | FR | Trạng thái | Commit | Ngày | Làm trong, giờ | Ghi chú |
|---|---|---|---|---|---|---|
| Q38 đổi nhóm người dùng | FR-07, FR-08 (Must) | **Đã làm**, chờ merge | `cb755c7`, `e732938`, PR #17 | 24/11 | A-28, 2h | Customer gửi yêu cầu, Manager cập nhật; cột `users.requested_user_group` |
| Q45 Customer xem bảng giá nhóm mình | FR-26 (Must) | **Đã làm**, chờ merge | `e7c9753`, PR #17 | 24/11 | A-65, 1h | Không đổi lược đồ |
| Q44 mốc xóa tính từ giờ ra | FR-45 (Must) | **Đã sửa**, chờ merge | `a755fae`, PR #11 | 24/11 | A-28, 0,5h | Giả định cũ của nhóm (tính theo giờ vào) được khách hàng làm rõ là sai; không đổi lược đồ |
| FR-44 lọc nhật ký theo tài khoản, thao tác, thời gian | FR-44 (Must, SRS v0.2) | **Đã làm**, chưa mở PR | `230f7a1`, `eacf71a`, `659352f` (nhánh `feat/res03-fr44-access-log-api`), `ef98fb7` (nhánh `feat/res03-fr44-access-log-page`) | 24/11 | A-65, 1,5h | Không có trong baseline (SRS v0.1 FR-31 chỉ yêu cầu xem nhật ký); làm vì AT-04 bước 8 (mức Must) kiểm tra; không đổi lược đồ |
| Q46 Staff chỉ xem biển số đã che với lượt đã đóng | FR-42 (Must) | **Đã sửa**, chờ merge | `8b59333`, `e19f356`, `977a46b`, `5fabb1f`, PR #11 | 24/11 | A-65, 1h | Giả định cũ của nhóm (Staff xem đầy đủ mọi lượt, theo quy tắc hiển thị `presentPlate` của MVP) được làm rõ; không đổi lược đồ |
| Q36, Q39, Q40, Q42 | — | Xác nhận việc hoãn hoặc bỏ | — | 23/11 | — | Chỉ tính theo lượt (G-02, G-03); không bắt buộc hết phiên 30 phút (FR-03); một bãi thí điểm; không bắt buộc khảo sát |

Hai mục ngoài G-ID, cũng thuộc CR-04:

| Mục | Trạng thái | Người quyết | Ngày | Lý do |
|---|---|---|---|---|
| FR-03 hết phiên 30 phút | **Hoãn**, khách hàng xác nhận | RES-03 đề xuất; Q39 (23/11): không phải tiêu chí nghiệm thu; RES-01 đã duyệt CR-04 ngày 24/11 | 22/11 | Chỉ đến từ SRS v0.2. Làm đúng nghĩa "không thao tác" phải cấp lại JWT ở middleware Edge (2,5h) và đụng mọi trang |
| KB-16 thu hồi token, tài khoản bị khóa | **Chấp nhận, không sửa** | RES-03; RES-01 đã duyệt CR-04 ngày 24/11 | 22/11 | Mọi API và trang có `requireRole` đã đọc CSDL và từ chối tài khoản bị khóa (FR-07 đạt). Middleware Edge không đọc được CSDL (kiến trúc P18). Rủi ro còn lại: token cũ qua được middleware nhưng không lấy được dữ liệu; ghi trong P14 |

Tổng giờ thêm vào A-28 và A-65 (giờ khả dĩ nhất M của các mục, trùng với các mục trong `plan-v2.0.mjs`): **17,5h** (5h ở v0.4: G-05 1,5h, G-07 0,5h, G-08 3h; ở v0.5 cộng G-06 1,5h, G-09 2h, G-04 1,5h; ở v0.6 cộng vòng 5: G-01 1,5h, Q38 2h, Q45 1h, Q44 0,5h, Q46 1h, và FR-44 1,5h). So sánh cùng phạm vi (sửa theo review PR #10 của RES-01): làm hết là **29,5h** (G-01 đến G-09 21h, FR-03 2,5h, Q38 2h, Q45 1h, Q44 0,5h, Q46 1h, FR-44 1,5h); phương án đã chọn tiết kiệm **12h** (G-02 8h, G-03 1,5h, FR-03 2,5h, khách hàng đã xác nhận hoãn ở Q36, Q39). Baseline V2.0 đã tính các giờ này (A-28 7,75h, A-65 15,83h theo PERT; mức tăng PERT của hai hoạt động so với V1.0 là 16,08h vì gồm cả KB-07, KB-14 và việc bỏ KB-16). Các mục hoãn đưa vào bảng phạm vi P14 (A-110) với trạng thái "Hoãn", kèm lý do ở bảng trên.

## 12. Tự kiểm theo tiêu chí chất lượng PD-P03

| Mã | Tiêu chí | Kết quả v0.6 |
|---|---|---|
| T-DB1 | Mỗi FR lưu dữ liệu có thực thể | Đạt có điều kiện: mọi FR có thực thể (mục 9); FR-09, FR-10, FR-22 đã đủ cột (G-09, G-04, G-01). FR-24, FR-36 không có cột theo bãi, theo giờ, đã hoãn qua CR-04 với xác nhận Q36 của khách hàng (mục 11.1) |
| T-DB2 | Khóa chính, khóa ngoại, 3NF | Đạt; `plate_snapshot`, `fee_group`, `owner_id` trên lượt gửi là dữ liệu chốt theo thời điểm (D-29, FR-34, FR-37). Đề xuất G-03 cũng là ảnh chụp có chủ đích, không phải phi chuẩn hóa thừa |
| T-DB3 | Script tạo lược đồ chạy trên CSDL trống, đủ bảng | Đạt: 14 bảng theo 9 migration (4 trên `main`, cộng `a65_indexes`, `g09_session_gate`, `g04_session_source` trong PR #11, `g01_lot_hours`, `q38_group_request` trong PR #17). Người review chạy lại `npx prisma migrate reset --force` khi review CP-03 |
| T-DB4 | Dữ liệu vi phạm ràng buộc bị từ chối | Một phần: PK, FK, UNIQUE ở CSDL; giá trị trạng thái và giờ ra ở ứng dụng (mục 4) |
| T-DB5 | Không có hai lượt mở cho cùng xe | Đạt ở tầng ứng dụng (mục 4, mục 10 #5) |
| T-DB6 | Truy vấn chỗ trống khớp số đếm tay, dùng chỉ mục | Đạt về thiết kế (chỉ mục `status, zone_id`); kiểm thử ở P20 |
| T-DB7 | Thêm bãi thứ hai không sửa lược đồ | Một phần: thêm bãi không sửa lược đồ, nhưng bãi thứ hai không có bảng giá riêng (mục 5, G-02) |
| T-DB8 | Mật khẩu băm; biển số đầy đủ một bảng; nhật ký đủ cột | Đạt theo tiêu chí đã chốt (mục 10 #2, #3). Mật khẩu băm không rời máy chủ: API tài khoản không trả `password_hash` (PR #17) |
| T-DB9 | Xóa dữ liệu quá hạn đúng bản ghi | Đạt: tự động hằng ngày (G-05, `bc172ce`), mốc tính từ giờ ra (Q44, `a755fae`), kể cả biển số trong ghi chú EX-02 (`e19f356`); PR #11, chờ merge; có test `tests/purge.test.ts`, `tests/purge-schedule.test.ts` |
| T-DB10 | Tên, kiểu khớp P02, P05; cờ mô phỏng | Một phần: đã khớp mã FR của P02 v0.2; cờ mô phỏng (mục 10 #4) |
| — | Ít nhất 2 thành viên review | RES-02 đã review 2 vòng (9 comment, 23/11), đã xử lý ở v0.5; RES-01 review P03 trong PR #10 (2 comment về P03 và ERD, 23/11), đã xử lý ở v0.6; chờ RES-02 xác nhận và thành viên thứ hai (CP-03, A-27) |

**Các câu hỏi CP-03 đã được chủ tài liệu chốt (22/11).** Người review CP-03 (RES-02 và một thành viên khác, A-27) chỉ cần xác nhận hoặc phản đối, không phải quyết định lại:
1. Phạm vi G-01 đến G-09, FR-03, KB-16 và vòng 5: mục 11.1 (làm G-01, G-04 đến G-09, Q38, Q44, Q45, Q46; hoãn G-02, G-03 và FR-03 qua CR-04, khách hàng đã xác nhận ở Q36, Q39).
2. Tiêu chí PD-P03: mục 10 #2, #3, #4 đã chốt. Đây là thay đổi tiêu chí của sản phẩm trong baseline nên được ghi vào CR-04 và Baseline V2.0.
3. Lược đồ mô tả: lược đồ `main` 14 bảng (nhánh round3 đã merge).

Khi CP-03 đạt, PR #11 và PR #17 đã merge, đánh v1.0 cho P03.
