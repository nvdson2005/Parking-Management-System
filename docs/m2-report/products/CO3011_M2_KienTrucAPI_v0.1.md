# P18 – Thiết kế kiến trúc và API

Hệ thống quản lý bãi đỗ xe thông minh (Smart Parking Management System) – CO3011 Quản lý dự án phần mềm

## 1. Định danh

| Thuộc tính | Giá trị |
|---|---|
| Mã và tên | P18 - Thiết kế kiến trúc và API |
| Loại | Sản phẩm trung gian |
| Phiên bản | v0.2 (bản nháp, chờ review CP-02); v1.0 do hoạt động A-22 tạo ra |
| Chủ sở hữu | Nguyễn Võ Đức Sơn (Trưởng nhóm kỹ thuật, RES-01) |
| Người review | Đào Xuân Sơn (QA) |
| Hoạt động tạo / review | A-22 (09–12/11/2026, W12, Nguyễn Võ Đức Sơn) tạo v1.0; A-23 (~13–16/11/2026, W12–W13) review tại CP-02 bởi Đào Xuân Sơn |
| Checkpoint | CP-02 |
| Mục tiêu liên quan | O1, O2, O4, O5 |
| Nguồn | P02 SRS, M1 report, client log, mã nguồn MVP (hoàn thành 08/11/2026) |
| Tiêu chí CP-02 (theo kế hoạch chất lượng 2.12.1) | Mỗi khác biệt KB-01 đến KB-19 có quyết định (sửa mã, sửa spec, chấp nhận); hợp đồng vào/ra đóng băng; mỗi FR có endpoint hoặc thành phần |

**Kiểm soát tài liệu**

| Phiên bản | Ngày | Người thực hiện | Thay đổi |
|---|---|---|---|
| v0.1 | 08/11/2026 | Nguyễn Võ Đức Sơn | Bản nháp đầu tiên, đối chiếu đặc tả MVP với mã nguồn |
| v0.2 | 09/11/2026 | Nguyễn Võ Đức Sơn | Đưa P06, P10, P11 vào phạm vi V1.0; ánh xạ KB-01..KB-19 sang hoạt động sửa của Baseline V1.0 |

**Quy ước trong tài liệu.** Mã FR-xx, EX-xx, D-xx giữ nguyên theo đặc tả thiết kế MVP (`docs/superpowers/specs/2026-11-08-smart-parking-mvp-design.md`). Mọi mô tả hành vi lấy từ đặc tả và mã nguồn hiện tại; đường dẫn mã ghi bằng tiếng Anh.

**Phạm vi Baseline V1.0.** Baseline V1.0 gồm các hạng mục Must cùng đặt chỗ (P06, FR-20..FR-25, Should), thanh toán mô phỏng (P10, FR-26..FR-28, Should, kể cả bước phí/thanh toán của luồng xe ra FR-14) và báo cáo (P11, FR-29, Could). Cột "Phạm vi" trong các bảng ghi mức ưu tiên theo SRS (Must / Should / Could). Câu trả lời Q22 của khách hàng chỉ còn dùng làm thứ tự cắt giảm dự phòng nếu lịch trễ: bỏ báo cáo trước, rồi thanh toán, rồi đặt chỗ.

**Vai trò trong Baseline V1.0.** MVP đã được xây dựng xong (08/11/2026). Tài liệu này là đầu vào cho các hoạt động sửa mã của baseline: mỗi khác biệt spec ↔ mã ở mục 10 được ánh xạ sang một hoạt động sửa. Các hoạt động sửa chỉ bắt đầu sau CP-02 (A-23).

---

## 2. Quyết định công nghệ

### 2.1 Căn cứ

| Quyết định / ràng buộc | Nội dung | Ảnh hưởng đến kiến trúc |
|---|---|---|
| Khách hàng Q12 | Không bắt buộc công nghệ; yêu cầu web responsive, không cần app native | Nhóm tự chọn stack (D-02) |
| D-02 | Next.js (App Router, TypeScript) full-stack, Prisma ORM, SQLite, Tailwind CSS + shadcn/ui | Một ứng dụng duy nhất chứa cả UI và API route handler |
| D-14 | Cập nhật gần thời gian thực bằng Server-Sent Events (SSE) | Endpoint `GET /api/availability/stream` + event bus trong tiến trình |
| D-16 | Demo chạy cục bộ với script seed; kiểm thử tự động cho logic lõi | Một tiến trình Node.js, một file SQLite; khóa và event bus nằm trong bộ nhớ tiến trình |
| CN4 (M1) | Mật khẩu băm, RBAC, che biển số, ghi nhật ký truy cập | Lớp `src/server/auth/*`, `src/lib/plate.ts`, `src/server/services/accessLog.ts` |
| CN5 (M1) | Chỉ dùng công cụ miễn phí / mã nguồn mở | Toàn bộ thư viện bên dưới là mã nguồn mở |

### 2.2 Thư viện và phiên bản (theo `package.json`)

| Nhóm | Thư viện | Phiên bản | Vai trò |
|---|---|---|---|
| Khung ứng dụng | `next` | 15.5.29 | App Router, route handler, middleware, instrumentation |
| | `react`, `react-dom` | 19.1.0 | Giao diện |
| | `typescript` | ^5 | Ngôn ngữ |
| Dữ liệu | `prisma`, `@prisma/client` | ^6.19.3 | ORM, migration, client truy vấn SQLite |
| Xác thực | `jose` | ^5.10.0 | Ký và xác minh JWT HS256 (chạy được cả trên Edge runtime của middleware) |
| | `bcryptjs` | ^3.0.3 | Băm mật khẩu (cost 10) |
| Kiểm tra đầu vào | `zod` | ^3.25.76 | Schema đầu vào ở route và service |
| Giao diện | `tailwindcss`, `@tailwindcss/postcss` | ^4 | CSS responsive |
| | `shadcn` | ^4.23.0 | Bộ component UI |
| | `@base-ui/react` | ^1.9.0 | Primitive UI cho shadcn |
| | `lucide-react` | ^1.70.0 | Biểu tượng |
| | `sonner` | ^2.0.8 | Thông báo toast |
| | `next-themes` | ^0.4.6 | Chủ đề sáng/tối |
| | `qrcode` | ^1.5.4 | Sinh ảnh QR cho xe (D-37) |
| | `recharts` | ^2.15.4 | Biểu đồ báo cáo (P11) |
| Kiểm thử, công cụ | `vitest` | ^3.2.7 | Bộ kiểm thử tự động (`tests/`, README ghi 137 test) |
| | `tsx` | ^4.23.15 | Chạy script seed `prisma/seed.ts` |
| | `eslint`, `eslint-config-next` | ^9, 15.5.29 | Kiểm tra mã |

Biến môi trường bắt buộc: `DATABASE_URL` (SQLite, `prisma/schema.prisma`) và `AUTH_SECRET` (khóa ký JWT, `src/server/auth/session.ts`, `src/middleware.ts`). Chạy cục bộ: `npm i`, `npx prisma migrate reset --force` (migration + seed), `npm run dev` (README, D-16).

---

## 3. Kiến trúc thành phần

### 3.1 Bảng thành phần

| Thành phần | Trách nhiệm | Thư mục / file nguồn | Sản phẩm |
|---|---|---|---|
| Trang Customer | Trang chủ có chỗ trống trực tiếp; quản lý xe + QR; đặt chỗ; lịch sử gửi xe | `src/app/customer/**` | P07, P09; `vehicles` hỗ trợ P05; `reservations` → P06, `history` → P10 |
| Trang Staff | Trang chủ chỗ trống; màn hình xe vào; màn hình xe ra; danh sách và chi tiết lượt gửi | `src/app/staff/**` | P05, P09, P07 (FR-31) |
| Trang Manager | Bãi/khu vực/sức chứa; bảng giá; tài khoản; nhật ký truy cập + purge; bộ mô phỏng; thanh toán; báo cáo | `src/app/manager/**` | P08, P07, P04; `payments` → P10, `reports` → P11 |
| Trang chung | Đăng nhập, đăng ký, điều hướng theo vai trò, khung trang có nút đổi ngôn ngữ | `src/app/login`, `src/app/register`, `src/app/page.tsx`, `src/components/AppShell.tsx`, `src/components/LangToggle.tsx`, `src/lib/nav.ts` | P07, P19 |
| Hiển thị chỗ trống trực tiếp | Mở `EventSource` tới `/api/availability/stream`, vẽ lại khi nhận dữ liệu; hiển thị huy hiệu "Suspended" | `src/components/LiveAvailability.tsx` | P09 |
| Middleware | Chặn route UI `/customer`, `/staff`, `/manager` theo JWT và vai trò | `src/middleware.ts` | P07 |
| API route handler | 28 endpoint REST + 1 luồng SSE; kiểm tra vai trò, đọc body, gọi service | `src/app/api/**/route.ts` | P05, P07, P08, P09, P04, P06, P10, P11 |
| Bộ bọc API | `handle()` tuần tự hóa kết quả JSON và ánh xạ lỗi; `readJsonObject()` kiểm tra body | `src/server/api.ts` | Tất cả |
| Mô-đun lỗi | `DomainError` + bảng mã lỗi → HTTP status | `src/server/errors.ts` | Tất cả |
| Xác thực, phân quyền | Băm mật khẩu; ký/xác minh JWT; lấy người dùng hiện tại; `requireRole` | `src/server/auth/password.ts`, `session.ts`, `rbac.ts` | P07 |
| Service nghiệp vụ | Logic xe vào (`entry`), xe ra (`exit`), chỗ trống (`availability`), xe (`vehicles`), bãi/khu vực (`lots`), bảng giá (`tariffs`), tài khoản (`accounts`, `auth`), nhật ký (`accessLog`), purge (`purge`), mô phỏng (`simulator`); đặt chỗ (`reservations`), phí (`fees`), lịch sử/thanh toán (`history`), báo cáo (`reports`) | `src/server/services/*.ts` | P05, P07, P08, P09, P04; `reservations` → P06, `fees`/`history` → P10, `reports` → P11 |
| Event bus | `EventEmitter` toàn cục, sự kiện `availability:changed` | `src/server/bus.ts` | P09 |
| Khóa tiến trình | `withLock()` tuần tự hóa các thao tác ghi quan trọng bằng chuỗi Promise toàn cục | `src/server/lock.ts` | P05, P09 |
| Bộ hẹn giờ hết hạn đặt chỗ | Mỗi 30 giây chuyển đặt chỗ quá hạn sang NO_SHOW và phát sự kiện | `src/instrumentation.ts` | P06 |
| Thư viện dùng chung | Chuẩn hóa/che biển số, kiểu dữ liệu, xử lý thời gian, liên kết điều hướng | `src/lib/plate.ts`, `types.ts`, `time.ts`, `nav.ts` | P07, P05 |
| Đa ngôn ngữ | Từ điển `vi`/`en`, cookie `lang`, hàm `t()` | `src/i18n/*` | P07 (FR-05) |
| Truy cập dữ liệu | Prisma client dùng chung (singleton trên `globalThis`) | `src/server/db.ts`, `prisma/schema.prisma` | P03 |
| CSDL | SQLite, 13 bảng (`roles`, `vehicle_types`, `users`, `parking_lots`, `zones`, `zone_capacities`, `vehicles`, `parking_sessions`, `session_events`, `reservations`, `tariffs`, `payments`, `access_logs`) | `prisma/schema.prisma`, `prisma/seed.ts` | P03, P22 |
| Bộ mô phỏng | Phát N sự kiện vào/ra, kích hoạt 5 ngoại lệ, sinh dữ liệu quá khứ; gọi đúng các service mà màn hình Staff dùng | `src/server/services/simulator.ts`, `src/app/manager/simulator/*`, `src/app/api/simulator/route.ts` | P04 |

### 3.2 Sơ đồ phụ thuộc

```
 Trình duyệt (Customer / Staff / Manager)
   │  trang React (src/app/**)        EventSource (LiveAvailability)
   │  fetch JSON                       │
   ▼                                   ▼
 src/middleware.ts  ── chỉ bảo vệ route UI /customer, /staff, /manager (JWT + vai trò)
   │
   ├─► Server component (requireRole + gọi service trực tiếp:
   │     staff/sessions, manager/payments, manager/access-log, customer/history, manager/reports ...)
   │
   └─► API route handler src/app/api/**  ── handle() / readJsonObject()  (src/server/api.ts)
          │ requireRole()  (src/server/auth/rbac.ts → session.ts → db)
          ▼
        Service  src/server/services/*
          │  withLock() (src/server/lock.ts) + prisma.$transaction
          │  logAccess() (accessLog.ts)
          │  publishAvailabilityChanged() ──► bus.ts ──► /api/availability/stream ──► EventSource
          ▼
        Prisma client (src/server/db.ts) ──► SQLite (DATABASE_URL)

 Bộ mô phỏng: /api/simulator ─► simulator.ts ─► recordEntry / previewExit / confirmExit (cùng service)
 Hẹn giờ 30 s: instrumentation.ts ─► expireReservations ─► bus   [P06]
```

Nguyên tắc: route handler không chứa logic nghiệp vụ; mọi quy tắc (ngoại lệ, sức chứa, phí) nằm trong service, nên màn hình Staff, bộ mô phỏng và kiểm thử dùng chung một đường xử lý (FR-15, D-05).

---

## 4. Luồng xử lý chính

### 4.1 Xe vào (FR-11, FR-12, FR-13, FR-15) – `recordEntry` trong `src/server/services/entry.ts`

1. `POST /api/events/entry`: `requireRole('STAFF','MANAGER')`, đọc body bằng `readJsonObject`, gắn `staffId` = người dùng hiện tại.
2. Service kiểm tra schema Zod (`method` ∈ PLATE/QR/RFID, `identifier`, `zoneId`, `vehicleType` tùy chọn). Sai → `VALIDATION`.
3. Trong `withLock` + `prisma.$transaction`:
   1. `expireReservations` (đặt chỗ quá hạn → NO_SHOW) [P06].
   2. Tìm khu vực; không có → `NOT_FOUND`. Bãi `SUSPENDED` → `LOT_SUSPENDED` (EX-05).
   3. Tìm xe theo phương thức: PLATE so khớp không phân biệt dấu phân cách (`plateCompareKey`), QR/RFID so khớp mã viết hoa. Không thấy: nếu không phải PLATE → `UNKNOWN_CODE`; nếu PLATE mà thiếu `vehicleType` → `VALIDATION`; ngược lại tạo xe Guest không chủ, sinh mã `QR-…`/`RF-…` (FR-12, D-36, D-32).
   4. Loại xe lấy từ bản ghi xe. Xe đã có lượt gửi OPEN → `ALREADY_OPEN` (EX-04).
   5. Đặt chỗ PENDING còn hạn của xe [P06]: đúng khu vực → dùng chỗ đã giữ (bỏ qua kiểm tra sức chứa); khác khu vực → hủy đặt chỗ với `cancelReason = ENTERED_OTHER_ZONE`, `cancelZoneId` (D-34, D-41) và xử lý như xe vãng lai.
   6. Nếu không dùng chỗ đã giữ: `getFree` (sức chứa − OPEN − PENDING còn hạn) ≤ 0 → `ZONE_FULL` (EX-01, D-21).
   7. `feeGroup` = nhóm của chủ xe hoặc `GUEST`; tạo `parking_sessions` với `plateSnapshot`, `zoneId`, `vehicleTypeCode`, `feeGroup`, `idMethod`, `entryTime`, `entryStaffId`, `status = OPEN`, `reservationId`, `ownerId` (FR-13, D-29).
   8. Nếu dùng chỗ đã giữ: đặt chỗ → FULFILLED (FR-24) [P06].
4. Sau commit: ghi nhật ký `ENTRY` (target = id lượt gửi), phát `availability:changed`. Trả về bản ghi lượt gửi.

### 4.2 Xe ra (FR-14) – `previewExit`, `confirmExit` trong `src/server/services/exit.ts`

| Bước | Endpoint | Hành vi | Phạm vi |
|---|---|---|---|
| 1. Tìm lượt gửi | `POST /api/events/exit/preview` | Tìm xe theo PLATE/QR/RFID; không có xe hoặc không có lượt OPEN → `NO_OPEN_SESSION`. Chỉ đọc, không khóa | Must |
| 2. So biển số | (cùng bước 1) | `plateMismatch = normalizePlate(observedPlate) !== plateSnapshot` (D-26) | Must |
| 3. Hiển thị phí | (cùng bước 1) | `fee = computeFee(vehicleType, feeGroup)` theo bảng giá hiện tại; thiếu bảng giá → `NOT_FOUND` | Should (P10, FR-26) |
| 4. Xác nhận ngoại lệ | `POST /api/events/exit/confirm` | Trong `withLock` + transaction: lượt gửi không OPEN → `NO_OPEN_SESSION`; lệch biển số mà `confirmMismatch = false` → `PLATE_MISMATCH`; lệch và đã xác nhận → `session_events` loại `PLATE_MISMATCH_CONFIRMED` (ghi chú chứa biển quan sát) (EX-02); `lostCard = true` → `session_events` loại `LOST_CARD` (EX-03) | Must |
| 5. Xác nhận thanh toán mô phỏng | (cùng bước 4) | Tính lại phí, tạo `payments` (`amount`, `status = CONFIRMED`, `paidAt`, `confirmedById`) | Should (P10, FR-27) |
| 6. Đóng lượt gửi | (cùng bước 4) | `exitTime`, `exitStaffId`, `status = CLOSED`. Không kiểm tra trạng thái bãi nên xe vẫn ra được khi bãi tạm ngưng (D-27) | Must |
| 7. Sau commit | (cùng bước 4) | Nhật ký `EXIT`; thêm `MANUAL_CONFIRM` nếu đã ghi session event; phát `availability:changed` | Must |

Lưu ý: trong mã hiện tại bước 5 và bước 6 nằm trong cùng một transaction, không có cách đóng lượt gửi mà không tạo bản ghi thanh toán. Thanh toán đã thuộc phạm vi V1.0 nhưng việc ghép "đóng lượt gửi" (Must) với "tạo thanh toán" (Should) vẫn là điểm thiết kế cần chốt tại CP-02 (xem mục 10, KB-03).

### 4.3 Cập nhật chỗ trống qua SSE (FR-17, FR-19, FR-19a)

| Thành phần | Hành vi |
|---|---|
| Công thức | `free = max(0, capacity − open − reserved)`; `reserved` = đặt chỗ PENDING có `holdUntil > now` (`src/server/services/availability.ts`) (FR-25) |
| Ảnh chụp dữ liệu | `getAvailability` trả mảng lô → khu vực → loại xe `{vehicleType, capacity, open, reserved, free}` kèm `status` của bãi. Bãi tạm ngưng vẫn trả số đếm bình thường; UI hiển thị huy hiệu "Suspended" (FR-19a, D-27) |
| Nguồn phát sự kiện | `publishAvailabilityChanged()` sau: xe vào, xe ra, tạo/sửa bãi, tạo/sửa khu vực/sức chứa, đổi bảng giá, sinh dữ liệu mô phỏng; và [P06] tạo/hủy đặt chỗ, đặt chỗ hết hạn (bộ hẹn giờ 30 s, `getAvailability`, `buildReport`) |
| Luồng SSE | `GET /api/availability/stream` (runtime `nodejs`, `force-dynamic`): gửi ngay một khung `data: <JSON>` khi kết nối; gửi lại toàn bộ ảnh chụp mỗi khi bus phát `availability:changed`; gửi chú thích `: ping` mỗi 25 s; hủy đăng ký khi client ngắt (`req.signal` abort) |
| Client | `LiveAvailability` mở `EventSource`, thay toàn bộ state bằng JSON nhận được; trang chủ Customer/Staff/Manager render sẵn dữ liệu ban đầu bằng `getAvailability` ở server |

### 4.4 Xử lý đồng thời (FR-18)

| Cơ chế | Mô tả chính xác theo mã |
|---|---|
| `withLock` (`src/server/lock.ts`) | Một chuỗi Promise lưu ở `globalThis.__lockPromise`. Mỗi lời gọi nối thêm một bước vào chuỗi, nên các khối bên trong chạy tuần tự trong cùng tiến trình Node.js. Khóa không tái nhập (không được lồng). Lỗi của một bước không làm gãy chuỗi |
| Thao tác dùng khóa | `recordEntry`, `confirmExit`, `addVehicle`; [P06] `createReservation`, `cancelReservation` |
| Transaction | Trong khóa, `recordEntry`, `confirmExit`, `createReservation`, `cancelReservation` chạy `prisma.$transaction` tương tác: chuỗi đọc–kiểm tra–ghi (sức chứa, lượt OPEN, trạng thái) là nguyên tử. `createZone`, `updateZone`, `purgeOldData` dùng transaction nhưng không dùng khóa |
| Ngoài khóa | `previewExit` (chỉ đọc); ghi nhật ký và phát sự kiện chạy sau khi commit |
| Phạm vi hiệu lực | Khóa và event bus chỉ đúng khi có một tiến trình (demo cục bộ D-16, SQLite một file). Triển khai nhiều tiến trình cần khóa ở mức CSDL |
| Kiểm chứng | `tests/availability.test.ts`, `tests/entry.test.ts`, `tests/lock.test.ts` |

### 4.5 Xử lý ngoại lệ EX-01..EX-05

| Ngoại lệ | Nơi phát hiện | Điều kiện | Phản hồi API | Ghi nhận |
|---|---|---|---|---|
| EX-01 Khu vực hết chỗ | `recordEntry` (`entry.ts`) | `getFree ≤ 0` và xe không dùng chỗ đã giữ | 409 `{"error":"ZONE_FULL"}` | Không tạo lượt gửi |
| EX-02 Lệch biển số khi ra | `previewExit` (cờ `plateMismatch: true`), `confirmExit` | Biển quan sát (đã chuẩn hóa) ≠ `plateSnapshot` | Preview: 200 kèm `plateMismatch: true`. Confirm chưa xác nhận: 409 `{"error":"PLATE_MISMATCH"}`. Confirm có `confirmMismatch: true`: 200 | `session_events.PLATE_MISMATCH_CONFIRMED`; nhật ký `MANUAL_CONFIRM` |
| EX-03 Mất QR/thẻ | `confirmExit` | `lostCard: true`; UI ép phương thức tìm là PLATE (`ExitForm.tsx`) | 200 như xe ra bình thường | `session_events.LOST_CARD`; nhật ký `MANUAL_CONFIRM` |
| EX-04 Xe đã có lượt mở | `recordEntry` | Có `parking_sessions` OPEN của xe | 409 `{"error":"ALREADY_OPEN"}` | Không tạo lượt gửi |
| EX-05 Bãi tạm ngưng | `recordEntry`; [P06] `createReservation` | `zone.lot.status = SUSPENDED` | 409 `{"error":"LOT_SUSPENDED"}`; xe ra vẫn 200; đặt chỗ PENDING giữ nguyên | Huy hiệu "Suspended" trên chỗ trống |

---

## 5. Bảo mật và bảo vệ dữ liệu

| Hạng mục | Hiện thực | Nguồn |
|---|---|---|
| Xác thực | Email + mật khẩu (`POST /api/auth/login`); email chuyển chữ thường; sai email hoặc mật khẩu → `INVALID_CREDENTIALS` (401); tài khoản khóa → `ACCOUNT_LOCKED` (403), chỉ báo sau khi mật khẩu đúng (FR-02, FR-04) | `src/server/services/auth.ts` |
| Băm mật khẩu | bcryptjs, cost 10; mật khẩu tối thiểu 8 ký tự khi đăng ký và khi Manager tạo tài khoản | `src/server/auth/password.ts` |
| Phiên đăng nhập | JWT HS256 (`jose`), `sub` = id người dùng, claim `role`, hết hạn 7 ngày, khóa `AUTH_SECRET`. Lưu trong cookie `session` (`httpOnly`, `sameSite=lax`, `path=/`, `maxAge` 7 ngày). Đăng ký thành công cũng đặt cookie (tự đăng nhập). Đăng xuất xóa cookie | `src/server/auth/session.ts`, `src/app/api/auth/*` |
| Kiểm tra phiên ở server | `resolveSessionUser` xác minh JWT rồi đọc người dùng từ CSDL; tài khoản không còn hoặc `locked = true` → coi như chưa đăng nhập, nên khóa tài khoản có hiệu lực ngay với API | `src/server/auth/session.ts` |
| RBAC ở route UI | `src/middleware.ts` (Edge runtime) chặn `/customer/*` (CUSTOMER), `/staff/*` (STAFF, MANAGER), `/manager/*` (MANAGER). Không có/sai token → chuyển `/login`; sai vai trò → chuyển `/`. Middleware chỉ xác minh chữ ký JWT, không đọc CSDL. Các trang server gọi thêm `requireRole` | FR-03 |
| RBAC ở API | Mỗi route handler gọi `requireRole(...)` (trừ `auth/login`, `auth/register`, `auth/logout`, `lang`). Chưa đăng nhập → 401 `UNAUTHENTICATED`; sai vai trò → 403 `FORBIDDEN`. Kiểm chứng ở `tests/auth.test.ts` và các test service | FR-03, `src/server/auth/rbac.ts` |
| Kiểm tra quyền sở hữu | Xóa xe của người khác → `NOT_OWNER`; [P06] đặt chỗ bằng xe người khác → `NOT_OWNER`, hủy đặt chỗ người khác → `NOT_CANCELLABLE` | `vehicles.ts`, `reservations.ts` |
| Che biển số (D-13, D-39) | `maskPlate`: giữ tiền tố đến dấu `-` (hoặc 3 ký tự đầu) và 2 ký tự cuối, thay chữ/số ở giữa bằng `*`, giữ dấu phân cách (`51F-123.45` → `51F-***.45`). `presentPlate`: Staff/Manager và chủ xe thấy đầy đủ, người khác thấy bản che; `[purged]` giữ nguyên. Dùng trong `PlateText` và trang lượt gửi | `src/lib/plate.ts`, `src/components/PlateText.tsx`, FR-30 |
| Nhật ký truy cập (D-23, D-31) | Bảng `access_logs` (`userId`, `action`, `target`, `createdAt`). Hành động: `LOGIN`, `LOGOUT`, `VIEW_FULL_PLATE` (khi Staff/Manager mở chi tiết lượt gửi `/staff/sessions/[id]`; danh sách không ghi), `ENTRY`, `EXIT`, `MANUAL_CONFIRM`, `LOT_CHANGE` (bãi và khu vực), `TARIFF_CHANGE`, `ACCOUNT_CHANGE`, `PURGE`. Manager xem 200 dòng mới nhất tại `/manager/access-log` | `src/server/services/accessLog.ts`, `accounts.ts#listAccessLogs`, FR-31 |
| Purge 12 tháng (FR-32, D-15, D-29) | `POST /api/purge` (Manager). Một transaction: (1) lượt gửi không OPEN có `entryTime` trước mốc 12 tháng → `plateSnapshot = '[purged]'`; (2) xe không chủ, không đặt chỗ, không có lượt gửi từ mốc trở đi và không có lượt OPEN → tách khỏi lượt gửi cũ (`vehicleId = null`) rồi xóa. Ghi nhật ký `PURGE` với target `"<n> sessions, <m> vehicles"` | `src/server/services/purge.ts` |
| Kiểm tra đầu vào | Zod ở route và/hoặc service; `readJsonObject` từ chối body không phải đối tượng JSON | `src/server/api.ts` |

---

## 6. Quy ước API

| Hạng mục | Quy ước |
|---|---|
| Đường dẫn gốc | `/api` (Next.js route handler, `src/app/api/**/route.ts`); tham số đường dẫn dạng `[id]` |
| Định dạng | Request và response là JSON (`Content-Type: application/json`), trừ `GET /api/availability/stream` (`text/event-stream`). Thời gian trả về dạng chuỗi ISO 8601. Giá trị liệt kê dùng mã tiếng Anh viết hoa (`MOTORBIKE`, `CAR`, `STUDENT`, `LECTURER_STAFF`, `GUEST`, `PLATE`, `QR`, `RFID`, `OPEN`, `CLOSED`, `ACTIVE`, `SUSPENDED` ...) |
| Thành công | HTTP 200, thân là kết quả của service; không có kết quả → `null` (ví dụ `DELETE /api/vehicles/[id]`) |
| Lỗi | Thân `{"error": "<ErrorCode>"}`; không trả câu thông báo. `DomainError` → status theo bảng dưới; `ZodError` → 400 `VALIDATION`; lỗi khác → để Next.js trả 500 |
| Xác thực | Cookie `session` (JWT) gửi kèm tự động từ trình duyệt; không dùng header Authorization |
| Phương thức | GET đọc; POST tạo hoặc hành động; PATCH sửa một phần; PUT ghi đè/upsert (bảng giá); DELETE xóa |
| Đa ngôn ngữ | API trung lập ngôn ngữ: chỉ trả mã. UI dịch mã lỗi qua khóa `errors.<CODE>` trong `src/i18n/vi.ts`, `en.ts`. Ngôn ngữ lưu ở cookie `lang` (`vi`/`en`, mặc định `vi`, hạn 1 năm) do `POST /api/lang` đặt |

### 6.1 Mã lỗi (`src/server/errors.ts`)

| Mã | HTTP | Ý nghĩa / nơi phát sinh |
|---|---|---|
| `VALIDATION` | 400 | Đầu vào sai schema, body không phải JSON object, hành động/ngoại lệ mô phỏng không hợp lệ, Manager tự khóa mình, ngày báo cáo sai |
| `UNAUTHENTICATED` | 401 | Chưa đăng nhập, token sai/hết hạn, tài khoản bị khóa trong phiên đang mở |
| `FORBIDDEN` | 403 | Sai vai trò (FR-03) |
| `INVALID_CREDENTIALS` | 401 | Sai email hoặc mật khẩu |
| `ACCOUNT_LOCKED` | 403 | Tài khoản bị khóa khi đăng nhập (FR-04) |
| `EMAIL_TAKEN` | 409 | Email đã tồn tại |
| `PLATE_TAKEN` | 409 | Biển số thuộc tài khoản khác (hoặc chính mình) (FR-06a) |
| `NOT_FOUND` | 404 | Không có bãi/khu vực/người dùng; thiếu bảng giá; không có sức chứa để mô phỏng |
| `UNKNOWN_CODE` | 404 | Mã QR/RFID không tồn tại khi xe vào |
| `ZONE_FULL` | 409 | EX-01; [P06] khu vực hết chỗ khi đặt |
| `ALREADY_OPEN` | 409 | EX-04 |
| `LOT_SUSPENDED` | 409 | EX-05 |
| `NO_OPEN_SESSION` | 404 | Xe ra nhưng không có lượt OPEN |
| `PLATE_MISMATCH` | 409 | EX-02 chưa được Staff xác nhận |
| `RESERVATION_WINDOW` | 400 | [P06] giờ đến không nằm trong khoảng từ bây giờ đến hết ngày (D-19) |
| `NOT_CANCELLABLE` | 400 | [P06] không phải của mình, không PENDING hoặc đã qua giờ đến |
| `VEHICLE_ALREADY_RESERVED` | 409 | [P06] xe đã có đặt chỗ PENDING |
| `VEHICLE_PARKED` | 409 | [P06] xe đang có lượt gửi OPEN |
| `NOT_OWNER` | 403 | Thao tác trên xe không thuộc mình |

---

## 7. Hợp đồng sự kiện vào/ra (FR-15)

Màn hình Staff (`src/app/staff/entry/EntryForm.tsx`, `src/app/staff/exit/ExitForm.tsx`) gọi ba endpoint dưới `/api/events`. Bộ mô phỏng (`src/server/services/simulator.ts`) gọi trực tiếp đúng ba hàm service phía sau (`recordEntry`, `previewExit`, `confirmExit`), nên quy tắc và mã lỗi giống hệt (D-05). Vai trò: STAFF hoặc MANAGER.

### 7.1 `POST /api/events/entry`

| Trường request | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `method` | `"PLATE" \| "QR" \| "RFID"` | Có | Cách nhận diện xe (FR-11, D-25, D-32) |
| `identifier` | string ≥ 1 ký tự | Có | Biển số, giá trị QR hoặc mã RFID |
| `zoneId` | string | Có | Khu vực vào |
| `vehicleType` | `"MOTORBIKE" \| "CAR"` | Chỉ khi biển số chưa có trong hệ thống | Xe đã biết lấy loại xe từ bản ghi xe |

Response 200: bản ghi `ParkingSession`.

```json
// Request
{ "method": "PLATE", "identifier": "51F-123.45", "zoneId": "clzoneC001", "vehicleType": "CAR" }

// Response 200
{
  "id": "clsess0001",
  "vehicleId": "clveh0001",
  "plateSnapshot": "51F-123.45",
  "zoneId": "clzoneC001",
  "vehicleTypeCode": "CAR",
  "feeGroup": "GUEST",
  "idMethod": "PLATE",
  "entryTime": "2026-11-08T08:15:00.000Z",
  "exitTime": null,
  "entryStaffId": "clstaff001",
  "exitStaffId": null,
  "status": "OPEN",
  "reservationId": null,
  "ownerId": null
}
```

Lỗi có thể trả: `VALIDATION`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `LOT_SUSPENDED`, `UNKNOWN_CODE`, `ALREADY_OPEN`, `ZONE_FULL`.

### 7.2 `POST /api/events/exit/preview`

| Trường request | Kiểu | Bắt buộc |
|---|---|---|
| `method` | `"PLATE" \| "QR" \| "RFID"` | Có |
| `identifier` | string ≥ 1 | Có |
| `observedPlate` | string ≥ 1 (biển Staff quan sát, D-26) | Có |

Response 200 (`ExitPreview`): `sessionId`, `plateSnapshot`, `zoneName`, `vehicleType`, `feeGroup`, `entryTime`, `fee` (P10, FR-26, Should), `plateMismatch`.

Lỗi: `VALIDATION`, `UNAUTHENTICATED`, `FORBIDDEN`, `NO_OPEN_SESSION`, `NOT_FOUND` (thiếu bảng giá).

### 7.3 `POST /api/events/exit/confirm`

| Trường request | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `sessionId` | string | Có | Lấy từ preview |
| `observedPlate` | string ≥ 1 | Có | So lại với `plateSnapshot` |
| `confirmMismatch` | boolean | Có | `true` = Staff xác nhận thủ công EX-02 |
| `lostCard` | boolean | Có | `true` = EX-03 |
| `note` | string | Không | Ghi vào `session_events.note` |

Response 200: `{ "session": ParkingSession (status CLOSED), "payment": Payment }`. Phần `payment` thuộc P10 (FR-27, Should); việc ghép đóng lượt gửi với tạo thanh toán được chốt tại CP-02 (KB-03).

```json
// Request
{ "sessionId": "clsess0001", "observedPlate": "51F-123.45", "confirmMismatch": false, "lostCard": false }

// Response 200
{
  "session": {
    "id": "clsess0001", "vehicleId": "clveh0001", "plateSnapshot": "51F-123.45",
    "zoneId": "clzoneC001", "vehicleTypeCode": "CAR", "feeGroup": "GUEST", "idMethod": "PLATE",
    "entryTime": "2026-11-08T08:15:00.000Z", "exitTime": "2026-11-08T10:40:00.000Z",
    "entryStaffId": "clstaff001", "exitStaffId": "clstaff001", "status": "CLOSED",
    "reservationId": null, "ownerId": null
  },
  "payment": {
    "id": "clpay0001", "sessionId": "clsess0001", "amount": 10000,
    "status": "CONFIRMED", "paidAt": "2026-11-08T10:40:00.000Z", "confirmedById": "clstaff001"
  }
}
```

Lỗi: `VALIDATION`, `UNAUTHENTICATED`, `FORBIDDEN`, `NO_OPEN_SESSION`, `PLATE_MISMATCH`, `NOT_FOUND` (thiếu bảng giá).

### 7.4 Ví dụ lỗi

```json
// POST /api/events/entry khi Zone C hết chỗ ô tô (EX-01) → HTTP 409
{ "error": "ZONE_FULL" }

// POST /api/events/exit/confirm, biển quan sát khác biển lúc vào, confirmMismatch=false (EX-02) → HTTP 409
{ "error": "PLATE_MISMATCH" }
```

---

## 8. Đặc tả endpoint

Tổng cộng **28 endpoint** (phương thức + đường dẫn) trong 23 file `route.ts`.

| # | Phương thức + đường dẫn | Vai trò được phép | FR / EX liên quan | Đầu vào chính | Đầu ra chính | Lỗi có thể trả | Phạm vi |
|---|---|---|---|---|---|---|---|
| 1 | `POST /api/auth/register` | Công khai | FR-01, D-10, D-35 | `email`, `password` (≥ 8), `name` (1–100), `userGroup` (`STUDENT`/`LECTURER_STAFF`) | `{id, email, name, role}`; đặt cookie `session` | `VALIDATION`, `EMAIL_TAKEN` | Must |
| 2 | `POST /api/auth/login` | Công khai | FR-02, FR-04, D-23 | `email`, `password` | `{id, email, name, role}`; đặt cookie; nhật ký `LOGIN` | `VALIDATION`, `INVALID_CREDENTIALS`, `ACCOUNT_LOCKED` | Must |
| 3 | `POST /api/auth/logout` | Bất kỳ (có phiên thì ghi nhật ký) | FR-02, D-23 | — | `{ok: true}`; xóa cookie; nhật ký `LOGOUT` | — | Must |
| 4 | `POST /api/lang` | Công khai | FR-05, D-11, D-38 | `lang` (`vi`/`en`) | `{lang}`; đặt cookie `lang` | `VALIDATION` | Must |
| 5 | `GET /api/vehicles` | CUSTOMER | FR-06 | — | Danh sách xe của mình (`plate`, `qrCode`, `rfidCode`, `vehicleTypeCode` ...) | `UNAUTHENTICATED`, `FORBIDDEN` | Must (hỗ trợ P05) |
| 6 | `POST /api/vehicles` | CUSTOMER | FR-06, FR-06a, D-12, D-32, D-33 | `plate`, `vehicleType` | Xe mới hoặc xe Guest được nhận | `VALIDATION`, `PLATE_TAKEN` | Must (hỗ trợ P05) |
| 7 | `DELETE /api/vehicles/[id]` | CUSTOMER (chủ xe) | FR-06 | `id` | `null`; xe có lịch sử chỉ bị gỡ chủ, ngược lại bị xóa | `NOT_OWNER` | Must (hỗ trợ P05) |
| 8 | `GET /api/lots` | MANAGER | FR-07, FR-08, FR-10 | — | Các bãi kèm khu vực và sức chứa | `UNAUTHENTICATED`, `FORBIDDEN` | Must |
| 9 | `POST /api/lots` | MANAGER | FR-07, FR-10 | `name`, `address` | Bãi mới (`status = ACTIVE`); nhật ký `LOT_CHANGE`; SSE | `VALIDATION` | Must |
| 10 | `PATCH /api/lots/[id]` | MANAGER | FR-07, EX-05, FR-19a, D-27 | `name?`, `address?`, `status?` (`ACTIVE`/`SUSPENDED`) | Bãi đã sửa; nhật ký `LOT_CHANGE`; SSE | `VALIDATION`, `NOT_FOUND` | Must |
| 11 | `POST /api/zones` | MANAGER | FR-08 | `lotId`, `name`, `capacities` `{MOTORBIKE?, CAR?}` (số nguyên ≥ 0) | Khu vực mới; nhật ký `LOT_CHANGE`; SSE | `VALIDATION`, `NOT_FOUND` | Must |
| 12 | `PATCH /api/zones/[id]` | MANAGER | FR-08, FR-19 | `name?`, `capacities?` | Khu vực đã sửa; nhật ký `LOT_CHANGE`; SSE | `VALIDATION`, `NOT_FOUND` | Must |
| 13 | `GET /api/tariffs` | MANAGER | FR-09 | — | 6 dòng bảng giá (loại xe × nhóm) | `UNAUTHENTICATED`, `FORBIDDEN` | Must |
| 14 | `PUT /api/tariffs` | MANAGER | FR-09, D-03, D-18 | `vehicleType`, `feeGroup` (`STUDENT`/`LECTURER_STAFF`/`GUEST`), `price` (nguyên ≥ 0) | Dòng bảng giá (upsert); nhật ký `TARIFF_CHANGE` | `VALIDATION` | Must |
| 15 | `GET /api/accounts` | MANAGER | D-24 | — | Danh sách người dùng | `UNAUTHENTICATED`, `FORBIDDEN` | Must |
| 16 | `POST /api/accounts` | MANAGER | D-24 | `email`, `password` (≥ 8), `name`, `role` (`STAFF`/`MANAGER`) | Tài khoản mới; nhật ký `ACCOUNT_CHANGE` | `VALIDATION`, `EMAIL_TAKEN` | Must |
| 17 | `PATCH /api/accounts/[id]` | MANAGER | FR-04, D-24 | `locked` (boolean) | Người dùng đã khóa/mở; nhật ký `ACCOUNT_CHANGE` | `VALIDATION` (tự khóa mình), `NOT_FOUND` | Must |
| 18 | `GET /api/availability` | CUSTOMER, STAFF, MANAGER | FR-17, FR-19a, O1 | — | `LotAvailability[]` | `UNAUTHENTICATED`, `FORBIDDEN` | Must |
| 19 | `GET /api/availability/stream` | CUSTOMER, STAFF, MANAGER | FR-19, D-14 | — | Luồng SSE `data: LotAvailability[]`, `: ping` mỗi 25 s | `UNAUTHENTICATED`, `FORBIDDEN` (JSON, trước khi mở luồng) | Must |
| 20 | `POST /api/events/entry` | STAFF, MANAGER | FR-11..FR-13, FR-15, FR-18, EX-01, EX-04, EX-05 | Mục 7.1 | `ParkingSession` OPEN | Mục 7.1 | Must |
| 21 | `POST /api/events/exit/preview` | STAFF, MANAGER | FR-14, FR-15, EX-02 | Mục 7.2 | `ExitPreview` | Mục 7.2 | Must; trường `fee` Should (P10, FR-26) |
| 22 | `POST /api/events/exit/confirm` | STAFF, MANAGER | FR-14, FR-15, FR-27, EX-02, EX-03 | Mục 7.3 | `{session, payment}` | Mục 7.3 | Must (đóng lượt gửi); phần `payment` Should (P10, FR-27) |
| 23 | `POST /api/purge` | MANAGER | FR-32, D-15, D-29 | — | `{sessionsMasked, vehiclesDeleted}`; nhật ký `PURGE` | `UNAUTHENTICATED`, `FORBIDDEN` | Must |
| 24 | `POST /api/simulator` | MANAGER | FR-33, FR-34, D-22, D-28 | `action`: `live` + `n` (1–500); `exception` + `ex` (`EX01`..`EX05`); `history` + `days` (1–60) | `live`: `{entries, exits, rejected}`; `exception`: `{exception, outcome, instructions?}`; `history`: `{sessions, reservations, payments}` | `VALIDATION`, `NOT_FOUND` | Must (P04); action `history` sinh dữ liệu cho P06/P10/P11 |
| 25 | `GET /api/reservations` | CUSTOMER | FR-20, FR-22, D-41 | — | Đặt chỗ của mình kèm `cancelReason`, `cancelZoneName` | `UNAUTHENTICATED`, `FORBIDDEN` | Should |
| 26 | `POST /api/reservations` | CUSTOMER | FR-20, FR-21, FR-23, FR-25, D-19, D-21, EX-05 | `vehicleId`, `zoneId`, `arrivalTime` (ISO) | `Reservation` PENDING, `holdUntil = arrivalTime + 30 phút`; SSE | `VALIDATION`, `NOT_OWNER`, `RESERVATION_WINDOW`, `NOT_FOUND`, `LOT_SUSPENDED`, `VEHICLE_ALREADY_RESERVED`, `VEHICLE_PARKED`, `ZONE_FULL` | Should |
| 27 | `POST /api/reservations/[id]/cancel` | CUSTOMER (chủ đặt chỗ) | FR-22, D-41 | `id` | `Reservation` CANCELLED (`cancelReason = CUSTOMER`); SSE | `VALIDATION`, `NOT_CANCELLABLE` | Should |
| 28 | `GET /api/reports?from=YYYY-MM-DD&to=YYYY-MM-DD` | MANAGER | FR-29, D-20, D-30 | `from`, `to` (mặc định hôm nay) | `{utilisationByHour[24], peakHours[≤3], revenue{total, byDate}, noShowRate}` | `VALIDATION` | Could |

Mọi endpoint có `requireRole` đều có thể trả thêm `UNAUTHENTICATED` (401) và `FORBIDDEN` (403).

**Chức năng không có endpoint riêng** (trang server gọi service trực tiếp, có `requireRole`): danh sách và chi tiết lượt gửi `/staff/sessions` (FR-13, FR-31), nhật ký truy cập `/manager/access-log` (FR-31), lịch sử khách hàng `/customer/history` và thanh toán `/manager/payments` (FR-28, Should), danh sách khu vực cho màn hình xe vào `/staff/entry`.

---

## 9. Truy vết FR → endpoint / thành phần

| FR | Nội dung rút gọn | Endpoint / thành phần | Phạm vi |
|---|---|---|---|
| FR-01 | Đăng ký | `POST /api/auth/register`; `auth.ts#registerCustomer`; `/register` | Must |
| FR-02 | Đăng nhập/đăng xuất, băm mật khẩu | `POST /api/auth/login`, `POST /api/auth/logout`; `password.ts`, `session.ts` | Must |
| FR-03 | RBAC trên UI và API | `src/middleware.ts`; `rbac.ts#requireRole` trong mọi route handler và trang server | Must |
| FR-04 | Tài khoản khóa không đăng nhập được | `POST /api/auth/login` (`ACCOUNT_LOCKED`); `PATCH /api/accounts/[id]`; `resolveSessionUser` | Must |
| FR-05 | Đổi ngôn ngữ VI/EN trên mọi trang | `POST /api/lang`; `src/i18n/*`; `LangToggle` trong `AppShell` | Must |
| FR-06 | Thêm/xóa xe, QR, RFID | `GET/POST /api/vehicles`, `DELETE /api/vehicles/[id]`; `vehicles.ts#generateCode`; `/customer/vehicles` (thư viện `qrcode`) | Must (hỗ trợ P05) |
| FR-06a | Biển số duy nhất, nhận xe Guest | `POST /api/vehicles` (`PLATE_TAKEN`, claim); `vehicles.ts#addVehicle` | Must (hỗ trợ P05) |
| FR-07 | Tạo/sửa bãi | `GET/POST /api/lots`, `PATCH /api/lots/[id]`; `/manager/lots` | Must |
| FR-08 | Khu vực và sức chứa | `POST /api/zones`, `PATCH /api/zones/[id]`; `lots.ts` | Must |
| FR-09 | Bảng giá loại xe × nhóm | `GET/PUT /api/tariffs`; `tariffs.ts`; `/manager/tariffs` | Must |
| FR-10 | Mô hình nhiều bãi, seed một bãi | Lược đồ `parking_lots` 1–n `zones` (`prisma/schema.prisma`); `prisma/seed.ts`; `POST /api/lots` | Must |
| FR-11 | Màn hình xe vào ≤ 3 thao tác, PLATE/QR/RFID | `POST /api/events/entry`; `/staff/entry` (`EntryForm`) | Must |
| FR-12 | Biển lạ → xe Guest | `entry.ts#createGuestVehicle` | Must |
| FR-13 | Nội dung lượt gửi | `parking_sessions`; `entry.ts`; `/staff/sessions`, `/staff/sessions/[id]` | Must |
| FR-14 | Xe ra: tìm lượt, so biển, phí, thanh toán, đóng | `POST /api/events/exit/preview`, `POST /api/events/exit/confirm`; `/staff/exit` | Must (tìm, so biển, đóng); bước phí + xác nhận thanh toán Should (P10) |
| FR-15 | Một API sự kiện chung | `/api/events/*`; `simulator.ts` gọi cùng `recordEntry`/`previewExit`/`confirmExit` | Must |
| FR-16 | Mỗi sự kiện ≤ 2 giây | Thành phần: service + SQLite cục bộ, chỉ số `@@index([status, zoneId])`; đo bằng `POST /api/simulator` (`live`) | Must |
| FR-17 | Công thức chỗ trống | `availability.ts#getFree`, `#getAvailability`; `GET /api/availability` | Must (thành phần `reserved` thuộc P06, Should) |
| FR-18 | Đúng khi đồng thời | `lock.ts#withLock` + `prisma.$transaction` trong `recordEntry`/`confirmExit` | Must |
| FR-19 | Cập nhật trực tiếp qua SSE | `GET /api/availability/stream`; `bus.ts`; `LiveAvailability` | Must (sự kiện đặt chỗ thuộc P06, Should) |
| FR-19a | Huy hiệu "Suspended" | `LotAvailability.status`; `LiveAvailability`; `PATCH /api/lots/[id]` | Must |
| FR-20 | Tạo đặt chỗ | `POST /api/reservations`; `/customer/reservations` | Should |
| FR-21 | Từ chối khi hết chỗ / bãi tạm ngưng | `POST /api/reservations` (`ZONE_FULL`, `LOT_SUSPENDED`) | Should |
| FR-22 | Hủy trước giờ đến | `POST /api/reservations/[id]/cancel` | Should |
| FR-23 | Giữ đến giờ đến + 30 phút, NO_SHOW | `reservations.ts#expireReservations`; `src/instrumentation.ts` (30 s) | Should |
| FR-24 | Hoàn thành / hủy khi vào khu khác | `POST /api/events/entry` (`entry.ts` nhánh đặt chỗ) | Should |
| FR-25 | Chỗ đã giữ tính vào sức chứa | `availability.ts#getFree` (`reserved`) | Should |
| FR-26 | Phí theo loại xe × nhóm/Guest | `fees.ts#computeFee`; `feeGroup` chụp lúc vào (`entry.ts`) | Should |
| FR-27 | Staff xác nhận thanh toán, lưu payment | `POST /api/events/exit/confirm` (phần `payment`) | Should |
| FR-28 | Lịch sử giao dịch | `history.ts#customerHistory` (`/customer/history`), `#allPayments` (`/manager/payments`); không có endpoint | Should |
| FR-29 | Báo cáo 4 chỉ số | `GET /api/reports`; `reports.ts#buildReport`; `/manager/reports` | Could |
| FR-30 | Che biển số | `src/lib/plate.ts#maskPlate`, `#presentPlate`; `PlateText` | Must |
| FR-31 | Nhật ký truy cập, Manager xem | `accessLog.ts#logAccess` (trong các service và `/staff/sessions/[id]`); `/manager/access-log` (`listAccessLogs`) | Must |
| FR-32 | Purge 12 tháng | `POST /api/purge`; `purge.ts` | Must |
| FR-33 | Trang mô phỏng 3 hành động | `POST /api/simulator`; `/manager/simulator` | Must (P04); hành động `history` phục vụ P06/P10/P11 |
| FR-34 | Chạy ≥ 100 lượt, ghi đầy đủ | `POST /api/simulator` `{action:"live", n: 100..500}` | Must |

---

## 10. Khác biệt giữa spec và mã nguồn

| Mã | Mục spec | Spec nói | Mã nguồn làm | Mức / đề xuất | Hoạt động xử lý (Baseline V1.0) |
|---|---|---|---|---|---|
| KB-01 | FR-15, D-05 | Một API sự kiện vào/ra dùng chung cho màn hình Staff và bộ mô phỏng | Ba endpoint (`/api/events/entry`, `/exit/preview`, `/exit/confirm`). Bộ mô phỏng không gọi HTTP mà gọi trực tiếp cùng ba hàm service trong tiến trình | Đáp ứng ý định (cùng quy tắc). Ghi rõ "API dùng chung ở tầng service" khi đóng băng hợp đồng tại CP-02 | A-44 |
| KB-02 | FR-14, FR-26 | Hiển thị phí rồi xác nhận thanh toán | Phí tính theo bảng giá **tại thời điểm xe ra** (cả preview và confirm), chỉ `feeGroup` được chụp lúc vào. Đổi bảng giá giữa preview và confirm làm số tiền khác số đã hiển thị. Chú thích trong `exit.ts` ghi "fee snapshotted at entry", không khớp với mã | Spec không quy định thời điểm áp giá; cần chốt và sửa chú thích (P10, Should) | A-63 |
| KB-03 | FR-14, FR-27 | Đóng lượt gửi là Must; thanh toán mô phỏng (P10) là Should, cùng thuộc V1.0 | `confirmExit` luôn tạo bản ghi `payments` CONFIRMED trong cùng transaction với việc đóng lượt; không có đường đóng lượt mà không thanh toán | Thanh toán đã trong phạm vi, nhưng đóng lượt (Must) và tạo thanh toán (Should) bị ghép chặt; nếu kích hoạt thứ tự cắt giảm Q22 thì luồng Must không tách được. Cần quyết định tại CP-02: giữ ghép hoặc tách | A-63 |
| KB-04 | EX-02, D-26 | Lệch biển số khi biển gõ khác biển lúc vào | Tìm xe dùng khóa so sánh bỏ dấu phân cách, nhưng so lệch dùng `normalizePlate` (chỉ bỏ khoảng trắng, viết hoa). Gõ `51F12345` cho xe `51F-123.45` vẫn tìm được lượt nhưng bị báo lệch | Không nhất quán nội bộ; đề xuất dùng cùng khóa so sánh | A-63 |
| KB-05 | EX-03, D-09 | Staff tra lượt gửi **theo biển số** khi mất thẻ | Server không ép phương thức PLATE khi `lostCard = true`; chỉ UI (`ExitForm.tsx`) ép | Chấp nhận cho demo; ghi chú trong hợp đồng | A-63 |
| KB-06 | D-31, FR-31 | Ghi `VIEW_FULL_PLATE` khi mở chi tiết lượt gửi **hoặc chi tiết xe** | Chỉ có trang chi tiết lượt gửi `/staff/sessions/[id]` ghi nhật ký; không có màn hình chi tiết xe cho Staff/Manager | Thiếu một điểm ghi (do thiếu màn hình); chốt lại phạm vi D-31 | A-22 quyết định tại CP-02 |
| KB-07 | D-23 | Ghi nhật ký đăng nhập | `register` đặt cookie phiên (tự đăng nhập) nhưng không ghi `LOGIN` | Nhỏ; bổ sung nếu QA yêu cầu | A-28 |
| KB-08 | FR-33, D-28 | EX-01, EX-04, EX-05: "bắn trực tiếp sự kiện vào bị từ chối" | EX-01 lấp đầy khu vực bằng các lượt vào vãng lai thật cho đến khi hết chỗ rồi mới bắn lượt bị từ chối (để lại nhiều lượt OPEN). EX-05 chuyển bãi sang SUSPENDED trực tiếp qua Prisma rồi khôi phục trạng thái cũ, không ghi `LOT_CHANGE`, không phát SSE | Ghi vào hướng dẫn demo P04 | A-44 |
| KB-09 | FR-33 | Không giới hạn N | `live`: `n` 1–500; `history`: `days` 1–60; dữ liệu `history` không có đặt chỗ PENDING; lý do hủy sinh ra luôn là `CUSTOMER`. Sự kiện mô phỏng ghi nhật ký dưới tên Manager chạy mô phỏng | Lựa chọn [BUILDER]; đáp ứng FR-34 | A-44 |
| KB-10 | FR-32, D-29 | Che biển trên lượt > 12 tháng; xóa xe Guest không có lượt mới hơn | Thêm điều kiện: bỏ qua lượt OPEN; không xóa xe còn đặt chỗ hoặc còn lượt OPEN; tách `vehicleId` của lượt cũ trước khi xóa xe | Làm chặt hơn spec; giữ nguyên | A-22 quyết định tại CP-02 |
| KB-11 | FR-20, FR-21 | Điều kiện từ chối đặt chỗ: hết chỗ, bãi tạm ngưng | Thêm `VEHICLE_ALREADY_RESERVED` (xe đã có PENDING) và `VEHICLE_PARKED` (xe đang đỗ). Hủy không hợp lệ (kể cả không phải chủ) đều trả `NOT_CANCELLABLE` | Quy tắc bổ sung (P06, Should) | A-70 |
| KB-12 | D-24 | Manager khóa/mở mọi tài khoản | Manager không được tự khóa mình (`VALIDATION`) | Quy tắc bổ sung hợp lý | A-22 quyết định tại CP-02 |
| KB-13 | FR-11 | Staff chọn loại xe và khu vực | Với xe đã có trong hệ thống, `vehicleType` gửi lên bị bỏ qua; loại xe lấy từ bản ghi xe. Chỉ bắt buộc khi biển số mới | Chi tiết [BUILDER]; ghi trong hợp đồng mục 7.1 | A-63 |
| KB-14 | Quy ước API (mục 6) | Lỗi đầu vào → 400 `VALIDATION` | `auth/login`, `auth/register`, `lang`, `POST /api/vehicles` đọc body bằng `req.json()` thay vì `readJsonObject`; body không phải JSON hợp lệ gây lỗi 500 thay vì 400 | Không nhất quán nội bộ; đề xuất dùng `readJsonObject` | A-28 |
| KB-15 | Tiêu chí CP-02 "mỗi FR có endpoint hoặc thành phần" | — | FR-31 (xem nhật ký), FR-13 (xem lượt gửi) và FR-28 không có endpoint; dữ liệu được đọc trong trang server. FR-05, FR-16, FR-18, FR-19a, FR-30 đáp ứng bằng thành phần | Tiêu chí CP-02 đã chấp nhận "endpoint hoặc thành phần"; bổ sung endpoint nếu CP-02 yêu cầu | A-65 |
| KB-16 | FR-02, FR-04 | Đăng xuất, khóa tài khoản | JWT 7 ngày, đăng xuất chỉ xóa cookie (không thu hồi token). Middleware chỉ kiểm chữ ký và vai trò (không đọc CSDL), nên người bị khóa vẫn qua middleware; nhưng mọi API và trang có `requireRole` đều từ chối | Đáp ứng FR-04; ghi nhận rủi ro nhỏ | A-28 |
| KB-17 | §7 thực thể | Danh sách 12 thực thể | Thêm bảng `roles`; `parking_sessions` thêm `fee_group`, `owner_id` (chụp chủ xe lúc vào); `reservations` thêm `cancel_reason`, `cancel_zone_id` (D-41) | [BUILDER] cho phép; P03 cần cập nhật tương ứng | A-22 quyết định tại CP-02 |
| KB-18 | `src/server/services/lots.ts` (chú thích) | D-27: bãi tạm ngưng hiển thị số đếm bình thường | Chú thích `updateLot` ghi "suspension immediately hides the lot's free spots", nhưng mã thực tế vẫn trả số đếm bình thường + `status` | Chỉ sai chú thích; hành vi đúng spec | A-22 quyết định tại CP-02 |
| KB-19 | FR-16 | ≤ 2 giây mỗi sự kiện | Tìm xe theo biển số đọc **toàn bộ** bảng `vehicles` rồi lọc trong bộ nhớ (`findVehicleByCompareKey`) | Đạt ở quy mô thí điểm; rủi ro khi dữ liệu lớn | A-22 quyết định tại CP-02 |

### 10.1 Ánh xạ khác biệt sang hoạt động sửa

MVP đã hoàn thành ngày 08/11/2026; mục 10 là đầu vào cho các hoạt động sửa của Baseline V1.0. Bản v1.0 của tài liệu do A-22 tạo (09–12/11/2026, W12, Nguyễn Võ Đức Sơn) và được Đào Xuân Sơn review tại CP-02 (A-23, ~13–16/11/2026, W12–W13). Tại CP-02 mỗi KB phải có quyết định: sửa mã, sửa spec hoặc chấp nhận. Mọi hoạt động sửa mã dưới đây chỉ bắt đầu sau A-23.

| Hoạt động | Nội dung | Người phụ trách | Khác biệt xử lý |
|---|---|---|---|
| A-44 | Sửa bộ mô phỏng | Nguyễn Tuấn Thành | KB-01, KB-08, KB-09 |
| A-63 | Sửa luồng xe vào/ra | Nguyễn Võ Đức Sơn, Nguyễn Phạm Mạnh Dũng | KB-02, KB-03, KB-04, KB-05, KB-13 |
| A-28 | Sửa xác thực | Nguyễn Phạm Mạnh Dũng | KB-07, KB-14, KB-16 |
| A-70 | Rà soát đặt chỗ | Phạm Duy Quý | KB-11 |
| A-65 | Bổ sung API | Nguyễn Phạm Mạnh Dũng | KB-15 |
| A-22 (quyết định tại CP-02) | Sửa spec/tài liệu hoặc chấp nhận; không dự kiến sửa mã | Nguyễn Võ Đức Sơn | KB-06, KB-10, KB-12, KB-17, KB-18, KB-19 |

Các lựa chọn [BUILDER] khác của spec §8 và mã đã chọn: thư viện xác thực `jose` + `bcryptjs`; i18n tự viết (`src/i18n`, cookie `lang`); test runner `vitest`; ảnh QR `qrcode`; biểu đồ `recharts`; hết hạn đặt chỗ kích hoạt bởi bộ hẹn giờ 30 s và đầu mỗi lần đọc chỗ trống, xe vào, tạo đặt chỗ, báo cáo; SSE gửi toàn bộ ảnh chụp, ping 25 s; mã QR/RFID dạng `QR-`/`RF-` + 10 ký tự base32.

---

## 11. Giả định và vấn đề mở

Các câu hỏi dự kiến cho vòng 3 (spec §10; chưa gửi khách hàng, đến tuần này mới có vòng 1 và vòng 2) có ảnh hưởng đến API. Cột giả định là giả định đang áp dụng của nhóm. Mức ảnh hưởng lấy từ spec §10.2 (Low / Medium / High).

| Câu hỏi | Giả định đang dùng | Phương án khác của khách hàng | Endpoint / thành phần bị ảnh hưởng | Mức |
|---|---|---|---|---|
| R3-Q1 | Nhiều xe, biển số duy nhất, nhận xe Guest | Một xe / giới hạn N | `POST /api/vehicles` | Low |
| | | Biển số không duy nhất | `POST /api/vehicles`, `POST /api/events/entry` (chọn chủ xe), `fees.ts`, bộ mô phỏng | High |
| | | Không tự nhận xe Guest (Manager duyệt) | `POST /api/vehicles` + endpoint duyệt mới, nhật ký | Medium |
| R3-Q2 | Tự chọn nhóm; xe lạ tính giá Guest | Manager xác minh nhóm | `POST /api/auth/register`, `PATCH /api/accounts/[id]` | Medium |
| | | Xe lạ tính giá Student | `PUT /api/tariffs` (bỏ `GUEST`), `fees.ts` | Low |
| | | Không cho xe chưa đăng ký | `POST /api/events/entry` thêm ngoại lệ mới ngoài 5 ngoại lệ | High |
| R3-Q3 | Trừ chỗ ngay; trong ngày; đến sớm được; khác khu thì hủy | Không giữ chỗ / đặt nhiều ngày / không cho đến sớm | `GET /api/availability`, `POST /api/reservations`, `POST /api/events/entry` | Low |
| | | Đặt theo bãi thay vì khu vực | `POST /api/reservations` (`zoneId` → `lotId`), `availability.ts` | Medium |
| R3-Q4 | Bãi tạm ngưng: cho xe ra, từ chối đặt mới, giữ đặt cũ | Hủy đặt chỗ khi tạm ngưng / chặn xe ra | `PATCH /api/lots/[id]`, `POST /api/events/exit/confirm` | Low |
| R3-Q5 | Mất thẻ: tra theo biển, không phạt | Có phí phạt | `PUT /api/tariffs` (thêm mức phạt), `POST /api/events/exit/preview` và `/confirm` (`amount` = phí + phạt) | Medium |
| R3-Q6 | Purge thủ công, chỉ che biển số | Xóa toàn bộ lượt gửi | `POST /api/purge` (xóa dây chuyền `session_events`, `payments`), `GET /api/reports` | Medium |
| | | Purge tự động | Tác vụ định kỳ thay `POST /api/purge` | Low |
| R3-Q7 | Công thức 4 chỉ số theo D-30 | Công thức khác | `GET /api/reports` (P11, Could) | Low |
| R3-Q8 | Song ngữ có nút chuyển | Chỉ một ngôn ngữ | `POST /api/lang`, `src/i18n` (bỏ bớt) | Low |
| R3-Q9 | Staff xác nhận thanh toán khi xe ra | Khách tự thanh toán trên app | `POST /api/events/exit/confirm` không chờ thanh toán; trạng thái "chưa thanh toán"; endpoint thanh toán mới cho Customer | Medium |

**Vấn đề mở cần chốt tại CP-02**

| Mã | Vấn đề | Đề xuất |
|---|---|---|
| VM-01 | Hợp đồng vào/ra đóng băng cả trường `fee` (preview) và `payment` (confirm); đóng lượt gửi (Must) và tạo thanh toán (P10, Should) đang ghép trong một transaction (KB-03) | Đóng băng nguyên hình dạng hiện tại; chốt giữ ghép hay tách để vẫn đóng lượt được nếu áp dụng thứ tự cắt giảm Q22 |
| VM-02 | Thời điểm áp giá (KB-02) | Chốt "giá tại thời điểm xe ra" hoặc chụp giá lúc vào |
| VM-03 | Các FR đáp ứng bằng trang server/thành phần thay vì endpoint (KB-15) | Tiêu chí CP-02 đã là "mỗi FR có endpoint hoặc thành phần"; A-65 bổ sung endpoint nếu CP-02 yêu cầu |
| VM-04 | Khóa và event bus chỉ đúng trong một tiến trình | Giữ nguyên cho demo cục bộ (D-16); ghi là ràng buộc triển khai |
