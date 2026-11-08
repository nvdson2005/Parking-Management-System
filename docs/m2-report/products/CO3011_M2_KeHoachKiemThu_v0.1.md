# P20 - Kế hoạch kiểm thử

**Hệ thống quản lý bãi đỗ xe thông minh (Smart Parking Management System) - CO3011 Quản lý dự án phần mềm**

Phiên bản v0.1 (bản nháp) - 08/11/2026

---

## Kiểm soát tài liệu

| Phiên bản | Ngày | Người thực hiện | Tóm tắt thay đổi |
|---|---|---|---|
| v0.1 | 08/11/2026 | Đào Xuân Sơn | Bản nháp đầu: phạm vi, chiến lược, ánh xạ mục tiêu, danh mục T05-T13 và T-DB1-T-DB10, truy vết FR/EX → kiểm thử |

### Tài liệu tham chiếu

| Mã | Tài liệu | Dùng cho |
|---|---|---|
| SPEC | `docs/superpowers/specs/2026-11-08-smart-parking-mvp-design.md` | Mục tiêu O1-O5 (§1.1), vai trò (§4), FR-01..FR-34 (§5), EX-01..EX-05 (§6), seed (§7.1), danh sách test (§8), workflow demo và truy vết (§9) |
| BL | `docs/m2-report/report.src.md` (Báo cáo M2, Project Baseline V1.0) | Phạm vi V1.0 (2.0.2), PD-P03, PD-P05, PD-P21, checkpoint (2.5), rủi ro (2.8), truy vết (2.13) |
| SCH | `docs/m2-report/generated/schedule.md`, `activities.md`, `checkpoints.md`, `risks.md` | Ngày, người phụ trách hoạt động kiểm thử, checkpoint, rủi ro |
| E2E | `docs/manual-e2e-test-guide.md` | Ca kiểm thử thủ công TC-xxx (Part C), truy vết (Part D), hạn chế đã biết (Part E) |
| CODE | `tests/**`, `vitest.config.ts`, `package.json` | Bộ kiểm thử tự động |

---

## 1. Định danh

| Trường | Nội dung |
|---|---|
| Định danh | P20 - Kế hoạch kiểm thử |
| Loại sản phẩm | Sản phẩm trung gian |
| Phiên bản / trạng thái | v0.1 (bản nháp) |
| Chủ sở hữu | Đào Xuân Sơn (BA, QA, RES-02) |
| Người review | Nguyễn Võ Đức Sơn (Tech lead) |
| Hoạt động tạo ra | A-80 Viết kế hoạch kiểm thử (lịch baseline 16/11-18/11, sau A-01) |
| Mục tiêu liên quan | O1, O2, O4, O5 |
| Nguồn (sinh ra từ) | P02 SRS (yêu cầu và tiêu chí chấp nhận); P18 Kiến trúc và API (hợp đồng sự kiện vào/ra) |
| Cung cấp cho | P21 Bộ test nghiệm thu (môi trường, dữ liệu, tiêu chí bắt đầu và kết thúc) - BL PD-P21 "Sinh ra từ" |

Ghi chú: bản v0.1 viết trước lịch A-80 và dựa trên đặc tả SPEC cùng mã nguồn, bộ test hiện có trong repo. Khi P02 SRS v1.0 qua CP-01, bảng truy vết ở mục 7 phải được đối chiếu lại với mã yêu cầu chính thức của SRS.

---

## 2. Phạm vi và mục tiêu kiểm thử

### 2.1 Mục tiêu kiểm thử

1. Chứng minh các workflow cốt lõi chạy xuyên suốt, 5 ngoại lệ được xử lý, yêu cầu đã thống nhất được đáp ứng (tiêu chí nghiệm thu Q11, SPEC §1).
2. Cung cấp số đo cho O1, O2, O4, O5 (mục 4).
3. Bảo đảm mỗi yêu cầu Must có ít nhất một ca kiểm thử đạt trước dry run CP-07.

### 2.2 Phạm vi

| Nhóm | Nội dung | Trạng thái trong V1.0 |
|---|---|---|
| Trong phạm vi | FR Must: Nền tảng và RBAC FR-01..FR-05 (P07); Thông tin bãi FR-07..FR-10 (P08); Xe vào/ra FR-11..FR-16 (P05); Chỗ trống FR-17..FR-19a (P09); Bảo vệ dữ liệu FR-30..FR-32 | Must |
| Trong phạm vi (hỗ trợ) | Xe của khách hàng FR-06, FR-06a (cung cấp QR/RFID cho FR-11); bộ mô phỏng FR-33, FR-34 (P04, thay phần cứng, phục vụ O1/O2) | Hỗ trợ Must |
| Trong phạm vi | Ngoại lệ EX-01..EX-05 | Must |
| Trong phạm vi (phi chức năng) | Bảo mật: mật khẩu băm, RBAC, che biển số, nhật ký truy cập (CN4); hiệu năng: mỗi lượt vào/ra ≤ 2 giây với dữ liệu thí điểm (FR-16, T13) | Must |
| Chỉ kiểm thử hồi quy | Đặt chỗ P06 (FR-20..FR-25); thanh toán mô phỏng P10 (FR-26..FR-28, bước tính phí và xác nhận thanh toán trong FR-14); báo cáo P11 (FR-29); phần đặt chỗ của EX-05 và thành phần "pending reservations" của FR-17 | **Hoãn theo Q22 – ứng viên Baseline V2.0** |
| Ngoài phạm vi | Phần cứng thật (camera, đầu đọc RFID, barie); cổng thanh toán thật; SSO của trường; tải vượt quy mô bãi thí điểm (3 khu vực, ~300 chỗ xe máy, 30 chỗ ô tô, Q24); triển khai online; nhiều tiến trình server (E2E Part E-7) | Không kiểm thử |

Quy tắc cho nhóm "Hoãn theo Q22": mã nguồn và test đã có trong repo nên vẫn chạy trong `npm test` để phát hiện hồi quy. Kết quả của chúng **không** tính vào nghiệm thu V1.0, không có AT trong P21 (tiêu chí 8 của PD-P21). Nếu một test hoãn thất bại, lỗi được ghi nhưng không chặn CP-05, CP-07.

Hệ quả cho mục tiêu: O3 chỉ được đo một phần (công suất theo khu vực qua P09) vì P06, P11 hoãn; thước đo độ chính xác tính phí của O4 hoãn cùng P10 (BL 2.13).

---

## 3. Chiến lược và mức kiểm thử

| Mức | Đối tượng | Công cụ | Người phụ trách | Tiêu chí bắt đầu | Tiêu chí kết thúc |
|---|---|---|---|---|---|
| L1 Unit | Hàm thuần không dùng CSDL: `tests/plate.test.ts`, `errors.test.ts`, `api.test.ts`, `i18n.test.ts`, `lock.test.ts`, `nav.test.ts`, `smoke.test.ts` (7 file) | Vitest 3 (`npm test` = `vitest run`) | Lập trình viên của mô-đun (Definition of Done, review pull request) | Mã nguồn biên dịch được; test viết cùng thay đổi | 100% test của file liên quan đạt trước khi merge |
| L2 Integration (service + CSDL) | Service gọi Prisma trên SQLite `test.db`: `accounts`, `auth`, `availability`, `entry`, `exit`, `fees`, `history`, `lots`, `purge`, `reports`, `reservations`, `schema`, `simulator`, `vehicles` (14 file) | Vitest, Prisma, SQLite; `tests/global-setup.ts`, `tests/helpers/db.ts` | Lập trình viên mô-đun; kiểm thử độc lập A-31 (P07), A-49 (P09), A-61 (P08), A-68 (P05) | Script CSDL qua CP-03; hợp đồng vào/ra đóng băng tại CP-02 | 100% test Must đạt; test hoãn chạy và ghi kết quả; kết quả ghi tab Quality Evidence |
| L3 Tích hợp bộ mô phỏng | Chuỗi sự kiện vào/ra qua cùng service với màn hình Staff (FR-15): `simulateLive`, kích hoạt EX-01..EX-05, `generateHistory` | `tests/simulator.test.ts`; trang Simulator (E2E C.9, C.10) | Nguyễn Tuấn Thành (P04), Đào Xuân Sơn (QA) trong A-45, A-68 | P04 qua tiêu chí 1-8 PD-P04 (A-45); P05 tích hợp (A-67) | Một lần chạy ≥ 100 lượt hoàn tất, mọi lượt có bản ghi đủ trường; chỗ trống không âm và khớp số đếm tay; 5/5 kích hoạt ngoại lệ cho kết quả mong đợi |
| L4 E2E thủ công | Ứng dụng chạy local, 3 vai trò trên 3 phiên trình duyệt | `docs/manual-e2e-test-guide.md` Part A-C; DevTools (đo thời gian, gọi API) | Người kiểm thử độc lập của A-31, A-49, A-61, A-68; QA | `npx prisma migrate reset --force` thành công; L2 đạt | Mọi ca C.1-C.5, C.9-C.12 (Must) có kết quả Pass/Fail/Blocked; Part F ký; lỗi ghi theo mục 9 |
| L5 Nghiệm thu | Kịch bản AT-01..AT-04, AT-EX01..AT-EX05, AT-100 (nội dung thuộc **P21**, không lặp lại ở đây) | P21 (Google Docs có cột kết quả) | Đào Xuân Sơn (chủ P21); Phạm Duy Quý review; khách hàng xác nhận | P21 qua CP-06; L2-L4 đạt cho phần Must | CP-07: 100% AT Must đạt hoặc lỗi mở được PM chấp nhận; CP-08: khách hàng xác nhận theo Q11 |

Nguyên tắc chung:
- Mỗi thay đổi sau baseline chạy lại toàn bộ `npm test` (hồi quy), kể cả test của nhóm hoãn.
- Bộ test chạy tuần tự (`fileParallelism: false`) vì mọi file dùng chung `test.db`.
- Kiểm thử hợp đồng API vào/ra A-79 (23/11-24/11) là đầu vào của A-67; nằm ngoài P20 nhưng được tham chiếu cho tiêu chí bắt đầu L3.

---

## 4. Ánh xạ mục tiêu → cách đo → ngưỡng

| Mục tiêu | Cách đo | Ngưỡng (nguồn) | Kiểm thử cung cấp số đo | Ghi chú |
|---|---|---|---|---|
| O1 Biết trước chỗ trống | So số chỗ trống hệ thống với số đếm tay sau mỗi sự kiện, kể cả sự kiện gần như đồng thời; quan sát cập nhật live trên 2 cửa sổ | Chỗ trống = sức chứa − lượt đang mở sau **mọi** lượt (T05, T-DB6); 20 lượt vào đồng thời vào khu vực sức chứa 2 → đúng 2 thành công | `availability.test.ts`; `entry.test.ts` › "20 concurrent entries…"; `simulator.test.ts` › "availability free never negative…"; E2E TC-AV-01..07; A-49 so số đếm tay sau kịch bản P04 | **Độ trễ cập nhật SSE chưa có ngưỡng bằng số trong nguồn.** A-49 có bước "đo độ trễ cập nhật" (0,5 h) nhưng không có giá trị đích. Cần P02 SRS chốt ngưỡng trước A-49 (xem mục 11) |
| O2 Số hóa vào/ra | Chạy bộ mô phỏng ≥ 100 lượt; đếm tỷ lệ phiên có bản ghi đủ trường; đo thời gian mỗi lượt vào/ra | 100% phiên của lần chạy ≥ 100 lượt có bản ghi đầy đủ (T11, CP-05, AT-100); mỗi lượt vào/ra ≤ 2 giây với dữ liệu thí điểm (FR-16, T13) | `simulator.test.ts` › "simulateLive(120)…every session has plateSnapshot, zone, entryStaffId, idMethod"; "FR-16: … < 2000 ms …"; E2E TC-SIM-01, TC-EXIT-07; AT-100 (P21) | Test tự động đếm **120 sự kiện** (vào + ra + bị từ chối), không khẳng định ≥ 100 **phiên**; đo thời gian ở mức service, không qua HTTP. Ngưỡng ≥ 100 phiên và ≤ 2 s qua HTTP được đo ở TC-SIM-01, TC-EXIT-07, AT-100 |
| O4 Xử lý ngoại lệ nhất quán | Số ngoại lệ xử lý đúng / 5 | **5/5** (EX-01..EX-05 đạt; số đo O4 theo PD-P21) | `entry.test.ts`, `exit.test.ts`, `simulator.test.ts` (mục 6, T06-T10); E2E C.10; AT-EX01..AT-EX05 (P21) | Thước đo độ chính xác tính phí (`fees.test.ts`, FR-26) **hoãn cùng P10** |
| O5 Bàn giao đạt nghiệm thu | Tỷ lệ yêu cầu Must có ≥ 1 ca kiểm thử đạt | **100%** yêu cầu Must có ≥ 1 test đạt (PD-P21 tiêu chí 1; CP-07 100% AT Must đạt) | Bảng truy vết mục 7; AT-03, AT-04 (P21) | Hiện 100% Must có ít nhất 1 ca (tự động hoặc thủ công) nhưng **chưa có kết quả đạt được ghi nhận** (mục 8); một số chỉ có ca thủ công (mục 7.3) |
| O3 (tham khảo) | Công suất theo khu vực qua P09 | — | Không đo trong V1.0 ngoài P09 | Đo một phần; báo cáo và đặt chỗ hoãn theo Q22 |

---

## 5. Môi trường và dữ liệu kiểm thử

### 5.1 Môi trường

| Hạng mục | Kiểm thử tự động | Kiểm thử thủ công / nghiệm thu |
|---|---|---|
| Nơi chạy | Máy cá nhân, local (D-16) | Máy cá nhân, `npm run dev` (hoặc `npm start`) cổng 3000, một tiến trình server (E2E E-7) |
| Phần mềm | Node.js ≥ 20, Next.js, Prisma, SQLite, Vitest 3 | Như bên trái; Chrome hoặc Chromium, 3 phiên trình duyệt cho 3 vai trò (E2E A.4) |
| CSDL | `file:./test.db` (đặt trong `vitest.config.ts`); `tests/global-setup.ts` chạy `npx prisma db push --force-reset --skip-generate` một lần trước bộ test | `prisma/dev.db`; tạo và đưa về trạng thái ban đầu bằng `npx prisma migrate reset --force` (áp dụng mọi migration rồi chạy `prisma/seed.ts`) |
| Biến môi trường | `AUTH_SECRET` cố định trong `vitest.config.ts` | `.env` từ `.env.example`, `AUTH_SECRET` ≥ 32 ký tự |
| Cô lập dữ liệu | Mỗi test gọi `resetDb()` (xóa bảng theo thứ tự con trước cha, tạo lại role và vehicle type) rồi `makeFixture()`; file chạy tuần tự | Reset DB sau các ca làm thay đổi lâu dài: EX-01 qua simulator, Purge, sinh lịch sử (E2E A.9) |

### 5.2 Dữ liệu kiểm thử

| Bộ dữ liệu | Nội dung | Nguồn |
|---|---|---|
| Fixture tự động (`tests/helpers/db.ts`) | 1 bãi "Test Lot" ACTIVE; khu A, B xe máy sức chứa 2 (tham số `motoCapA`), khu C ô tô sức chứa 1 (`carCapC`); bảng giá xe máy 2.000, ô tô 10.000 cho 3 nhóm; tài khoản theo vai trò | Code |
| Fixture mô phỏng (`simulator.test.ts`) | Sức chứa bằng seed A150 / B150 / C30 cho đo FR-16 và chạy 100-120 sự kiện | D-17 |
| Seed demo (`prisma/seed.ts`) | 1 bãi thí điểm ACTIVE; A = 150 xe máy, B = 150 xe máy, C = 30 ô tô (D-17); giá xe máy 2.000 VNĐ, ô tô 10.000 VNĐ mỗi lượt cho mọi nhóm (D-18); 2 Manager, 2 Staff, 15 Customer, mỗi Customer 1 xe máy, số lẻ Student, số chẵn Lecturer/Staff (D-40, E2E A.5) | SPEC §7.1 |
| Dữ liệu sinh bởi bộ mô phỏng (FR-33) | (1) N sự kiện vào/ra ngẫu nhiên qua cùng API sự kiện; (2) kích hoạt từng EX-01..EX-05; (3) lịch sử N ngày, gồm phiên cách ~13 tháng để kiểm thử purge | SPEC FR-33, D-22, D-28, D-29 |

Quy tắc dữ liệu: chỉ dùng dữ liệu mô phỏng (CN4, Q26). Biển số do bộ mô phỏng sinh theo mẫu `^\d{2}[A-Z]-\d{3}\.\d{2}$` (`simulator.test.ts` › "randomPlate matches…"); biển số trong seed và ca thủ công là biển số demo. Không dùng biển số thật.

---

## 6. Danh mục ca kiểm thử theo mã (T05-T13, T-DB1-T-DB10)

Ký hiệu đánh giá: **Đủ** = có test tự động kiểm đúng tiêu chí; **Một phần** = test tự động chỉ kiểm một phần, phần còn lại cần ca thủ công hoặc review; **Thiếu** = chưa có ca kiểm thử.

### 6.1 Tiêu chí PD-P05 (T05-T13)

| Mã | Tiêu chí (PD-P05) | Test tự động (file › test) | E2E thủ công | Đánh giá |
|---|---|---|---|---|
| T05 | Sau mọi lượt, chỗ trống = sức chứa − lượt đang mở, kể cả lượt gần như đồng thời (O1) | `availability.test.ts` › "free = capacity - open - pending reservations", "ignores CLOSED sessions and non-PENDING / expired reservations", "never returns negative free when capacity lowered below occupancy"; `entry.test.ts` › "20 concurrent entries into zone with cap 2 -> exactly 2 succeed"; `simulator.test.ts` › "availability free never negative after simulateLive" | TC-AV-01, TC-AV-04, TC-AV-05 | Đủ (so số đếm tay sau kịch bản P04 vẫn làm ở A-49) |
| T06 | Từ chối xe vào khi hết chỗ (EX-01) | `entry.test.ts` › "EX-01 ZONE_FULL when zone A (cap 2) has 2 open sessions"; `simulator.test.ts` › "EX01 -> ZONE_FULL, EX04 -> ALREADY_OPEN, EX05 -> LOT_SUSPENDED and lot ACTIVE afterwards" | TC-EX-01a, TC-EX-01b | Đủ |
| T07 | Biển số không khớp → cảnh báo, yêu cầu xác nhận thủ công (EX-02) | `exit.test.ts` › "preview flags plateMismatch when observed plate differs", "EX-02 confirm without confirmMismatch -> PLATE_MISMATCH; with it -> closed + PLATE_MISMATCH_CONFIRMED event"; `simulator.test.ts` › "EX02 instructions lead previewExit to plateMismatch true" | TC-EX-02a, b, c | Đủ |
| T08 | Mất QR/thẻ → tra theo biển số, xác nhận thủ công (EX-03) | `exit.test.ts` › "EX-03 lostCard via PLATE -> LOST_CARD event + payment + closed"; `simulator.test.ts` › "EX03 opens a session and returns lost-card instructions", "EX03 opens a session even when one zone for the vehicle type is full (no ZONE_FULL crash)" | TC-EX-03a, b | Đủ |
| T09 | Không mở lượt thứ hai cho cùng biển số (EX-04) | `entry.test.ts` › "EX-04 ALREADY_OPEN on second entry of same vehicle"; `simulator.test.ts` › "EX01 -> ZONE_FULL, EX04 -> ALREADY_OPEN, …" | TC-EX-04a, b | Đủ |
| T10 | Từ chối xe vào khi bãi tạm ngưng, vẫn cho xe ra (EX-05) | `entry.test.ts` › "EX-05 LOT_SUSPENDED when lot suspended"; `exit.test.ts` › "exit allowed while lot SUSPENDED"; `lots.test.ts` › "suspend then reactivate lot toggles status; entry allowed again after reactivation"; `simulator.test.ts` › "EX05 on a lot the manager already suspended keeps it SUSPENDED" | TC-EX-05a, b, d, e | Đủ |
| T11 | Mỗi lượt lưu đủ trường (O2) | `simulator.test.ts` › "simulateLive(120) records entries+exits+rejected = 120; every session has plateSnapshot, zone, entryStaffId, idMethod"; `entry.test.ts` › "opens session for registered vehicle by QR with owner feeGroup and plate snapshot" | TC-ENT-05, TC-SIM-01 | Đủ (test tự động kiểm 4 trường; thời điểm vào/ra, loại xe, trạng thái kiểm ở TC-ENT-05) |
| T12 | Chỉ Staff và Manager thao tác được | `auth.test.ts` › "assertRole: customer on staff action -> FORBIDDEN, null -> UNAUTHENTICATED, manager on staff action -> ok"; `nav.test.ts` › "every role reaches all of its pages" | TC-AUTH-06..TC-AUTH-10 | Một phần: chưa có test tự động gọi route UI và API sự kiện với vai trò Customer; dựa vào ca thủ công |
| T13 | Ghi nhận xe vào trong ≤ 3 thao tác và ≤ 2 giây với dữ liệu thí điểm | `simulator.test.ts` › "FR-16: with seed-size capacities (A150/B150/C30) each recordEntry/confirmExit call takes < 2000 ms (measure max over simulateLive(100))" | TC-ENT-01 (≤ 3 thao tác), TC-EXIT-07 (< 2 s qua HTTP) | Một phần: thời gian đo ở mức service; "≤ 3 thao tác" chỉ kiểm thủ công |

### 6.2 Tiêu chí PD-P03 (T-DB1-T-DB10)

| Mã | Tiêu chí (PD-P03) | Test tự động / cách kiểm | E2E thủ công | Đánh giá |
|---|---|---|---|---|
| T-DB1 | Mỗi FR lưu dữ liệu có thực thể | Không có test; kiểm bằng review truy vết FR → thực thể của P03 tại CP-03 | — | Thiếu (cần review) |
| T-DB2 | Khóa chính, khóa ngoại, 3NF | Không có test; review ERD và `prisma/schema.prisma` | — | Thiếu (cần review) |
| T-DB3 | Script chạy trên CSDL trống tạo đủ bảng | `tests/global-setup.ts` tạo lược đồ trên `test.db` trống bằng `prisma db push --force-reset`; `schema.test.ts` › "fixture has 3 zones with capacities" | E2E A.2: `npx prisma migrate reset --force` áp dụng mọi migration | Một phần: test tự động dùng `db push`, không chạy chuỗi migration; kiểm chuỗi migration bằng bước A.2 |
| T-DB4 | Dữ liệu vi phạm ràng buộc bị từ chối 100% | `schema.test.ts` › "enforces unique plate"; `lots.test.ts` › "rejects negative capacity/price with VALIDATION", "rejects non-integer capacity/price with VALIDATION"; `vehicles.test.ts` › "rejects plate owned by another customer with PLATE_TAKEN" | TC-LOT-07 | Một phần: chỉ ràng buộc unique biển số được kiểm ở mức CSDL; các ràng buộc khác kiểm ở mức service; chưa có danh sách ràng buộc để chứng minh "100%" |
| T-DB5 | Không tạo được lượt mở thứ hai cho cùng xe | `entry.test.ts` › "EX-04 ALREADY_OPEN on second entry of same vehicle" | TC-EX-04a | Đủ ở mức service. Ghi chú: migration hiện tại không có ràng buộc CSDL cho "một lượt mở mỗi xe"; quy tắc nằm ở service có khóa trong tiến trình (E2E E-7) |
| T-DB6 | Truy vấn chỗ trống khớp số đếm tay và dùng chỉ mục | `availability.test.ts` (như T05) | TC-AV-04, A-49 | Một phần: phần "khớp" có test; phần "dùng chỉ mục" chưa có test (migration có chỉ mục `parking_sessions_status_zone_id_idx`) |
| T-DB7 | Thêm bãi thứ hai không sửa lược đồ | `lots.test.ts` › "creates second lot and zone; getAvailability returns 2 lots" | TC-LOT-01, TC-LOT-09 | Đủ |
| T-DB8 | Không có mật khẩu rõ; biển số đầy đủ chỉ ở `vehicles`; `access_logs` không cho trống | Không có test kiểm mật khẩu được băm hay ràng buộc not-null của `access_logs` | — | Thiếu. **Mâu thuẫn cần xử lý:** SPEC D-29, FR-13 lưu bản sao biển số (`plate_snapshot`) trong `parking_sessions`, trái với vế "biển số đầy đủ chỉ ở vehicles" |
| T-DB9 | Script lưu giữ xóa đúng bản ghi quá hạn | `purge.test.ts` › "masks sessions older than 12 months, keeps newer ones", "deletes unowned vehicle with only old sessions; keeps owned and unowned-with-recent", "keeps an unowned vehicle whose old session is still OPEN, so it can still exit", "logs PURGE with counts", "second purge reports 0 sessionsMasked" | TC-DP-06..TC-DP-09 | Đủ |
| T-DB10 | Tên và kiểu khớp P02, P05 | Không có test; review đối chiếu tại CP-03 | — | Thiếu (cần review) |

Ghi chú: bảng checkpoint CP-03 ghi "T-DB1 đến T-DB11", trong khi PD-P03 chỉ định nghĩa T-DB1..T-DB10 (vế "ít nhất 2 thành viên review" không có mã). Cần thống nhất trong báo cáo M2.

### 6.3 Tổng hợp

| Kết quả | Số mã | Mã |
|---|---|---|
| Đủ (tự động) | 10 | T05, T06, T07, T08, T09, T10, T11, T-DB5, T-DB7, T-DB9 |
| Một phần (tự động + thủ công/review) | 5 | T12, T13, T-DB3, T-DB4, T-DB6 |
| Thiếu (chưa có ca kiểm thử, chỉ review) | 4 | T-DB1, T-DB2, T-DB8, T-DB10 |
| Tổng | 19 | |

---

## 7. Truy vết yêu cầu → kiểm thử

### 7.1 Yêu cầu chức năng

| ID | Phạm vi | Test tự động (file › test) | E2E thủ công | Đánh giá |
|---|---|---|---|---|
| FR-01 Đăng ký | Must | `auth.test.ts` › "registers and authenticates a customer", "rejects duplicate email" | TC-AUTH-01..03 | Đủ |
| FR-02 Đăng nhập/đăng xuất, mật khẩu băm | Must | `auth.test.ts` › "rejects wrong password with INVALID_CREDENTIALS", "registers and authenticates a customer" | TC-AUTH-04, 05 | Một phần: đăng xuất và việc lưu mật khẩu dạng băm chưa có test tự động |
| FR-03 RBAC trên route UI và API | Must | `auth.test.ts` › "assertRole: …"; `nav.test.ts` › "every role reaches all of its pages", "every link points at an existing page and has a label in both languages" | TC-AUTH-06..10, 14 | Một phần: chưa có test tự động ở mức route/API |
| FR-04 Tài khoản bị khóa | Must | `auth.test.ts` › "rejects locked account with ACCOUNT_LOCKED", "resolveSessionUser returns null for locked user with valid token"; `accounts.test.ts` › "locking an account makes authenticate throw ACCOUNT_LOCKED and logs ACCOUNT_CHANGE" | TC-AUTH-11 | Đủ |
| FR-05 Chuyển VI/EN mọi trang | Must | `i18n.test.ts` › "vi and en declare the exact same set of keys", "both dictionaries have an errors.<code> key for every ErrorCode" | TC-AUTH-12 | Một phần: tự động chỉ kiểm khớp khóa từ điển; nút chuyển trên mọi trang kiểm thủ công |
| FR-06 Xe, QR, RFID | Hỗ trợ Must | `vehicles.test.ts` › "adds vehicle with QR- and RF- codes", "generates distinct codes across calls", "allows multiple vehicles per customer", "removeVehicle: …" (3 test) | TC-VEH-01..03 | Đủ (ảnh QR kiểm thủ công) |
| FR-06a Biển số duy nhất, nhận xe Guest | Hỗ trợ Must | `vehicles.test.ts` › "claims existing guest vehicle…", "rejects plate owned by another customer with PLATE_TAKEN", "treats hyphen/spacing variants…", "serializes concurrent claims of the same Guest vehicle to a single winner"; `schema.test.ts` › "enforces unique plate" | TC-VEH-04..06 | Đủ |
| FR-07 Bãi: tên, địa chỉ, trạng thái | Must | `lots.test.ts` › "edits lot name/address and zone name…", "suspend then reactivate lot…", "createLot logs LOT_CHANGE" | TC-LOT-01..03 | Đủ |
| FR-08 Khu vực, sức chứa | Must | `lots.test.ts` › "updating capacity changes free count and logs LOT_CHANGE", "rejects negative…", "rejects non-integer…" | TC-LOT-04..07 | Đủ |
| FR-09 Bảng giá | Must (P08) | `lots.test.ts` › "setTariff changes computeFee result and logs TARIFF_CHANGE", "listTariffs returns all configured tariffs" | TC-LOT-08 | Đủ. Ghi chú: việc áp giá vào phí khi xe ra thuộc P10 (hoãn) |
| FR-10 Nhiều bãi | Must | `lots.test.ts` › "creates second lot and zone; getAvailability returns 2 lots" | TC-LOT-09 | Đủ |
| FR-11 Màn hình xe vào, nhận diện plate/QR/RFID, ≤ 3 thao tác | Must | `entry.test.ts` › "opens session for registered vehicle by QR…", "UNKNOWN_CODE for unknown QR", "VALIDATION…" (2 test); `vehicles.test.ts` › "findVehicleByIdentifier finds by plate case-insensitively, by QR and by RFID" | TC-ENT-01..04 | Một phần: "≤ 3 thao tác" chỉ kiểm thủ công |
| FR-12 Biển số lạ → xe Guest | Must | `entry.test.ts` › "creates guest vehicle for unknown plate with feeGroup GUEST", "requires vehicleType for an unknown plate" | TC-ENT-03 | Đủ |
| FR-13 Bản ghi phiên | Must | `entry.test.ts` › "opens session … plate snapshot"; `simulator.test.ts` › "simulateLive(120) … every session has plateSnapshot, zone, entryStaffId, idMethod" | TC-ENT-05 | Đủ |
| FR-14 Màn hình xe ra | Must (bước phí/thanh toán: Hoãn theo Q22 – ứng viên Baseline V2.0) | `exit.test.ts` › "closes session and creates CONFIRMED payment with group fee", "preview flags plateMismatch…", "NO_OPEN_SESSION when vehicle has no open session", "exit allowed while lot SUSPENDED" | TC-EXIT-01, 02, 05; TC-EX-05b | Đủ |
| FR-15 Một API sự kiện cho màn hình và bộ mô phỏng | Must | `simulator.test.ts` (gián tiếp: `simulateLive` gọi `recordEntry`/`confirmExit`, xem test FR-16) | TC-EXIT-06 | Một phần: chưa có test mức HTTP cho endpoint sự kiện; A-79 (kiểm thử hợp đồng) bổ sung |
| FR-16 ≤ 2 giây | Must | `simulator.test.ts` › "FR-16: … < 2000 ms …" | TC-EXIT-07 | Đủ ở mức service; qua HTTP kiểm thủ công |
| FR-17 Công thức chỗ trống | Must (vế "pending reservations": Hoãn theo Q22) | `availability.test.ts` › "free = capacity - open - pending reservations", "ignores CLOSED sessions…", "never returns negative free…" | TC-AV-01, 04 | Đủ |
| FR-18 Đúng khi đồng thời | Must | `entry.test.ts` › "20 concurrent entries into zone with cap 2 -> exactly 2 succeed"; `lock.test.ts` › "should serialize concurrent operations" | TC-AV-05 | Đủ |
| FR-19 Cập nhật live qua SSE | Must | Không có test tự động cho SSE khi vào/ra, đổi sức chứa, đổi trạng thái. (`availability.test.ts` › "publishes availability:changed when the read expires a hold, and only then" chỉ phủ trường hợp hết hạn đặt chỗ, thuộc phần hoãn) | TC-AV-01..03, 06 | **Khoảng trống:** chỉ có ca thủ công; chưa có ngưỡng độ trễ |
| FR-19a Huy hiệu "Suspended" | Must | `availability.test.ts` › "reports SUSPENDED lot status with normal counts" | TC-AV-07, TC-LOT-03 | Đủ |
| FR-20 Đặt chỗ | Hoãn theo Q22 – ứng viên Baseline V2.0 | `reservations.test.ts` › "creates PENDING with holdUntil = arrival + 30 min and reduces free by 1", "NOT_OWNER…", "RESERVATION_WINDOW…" | TC-RES-01..03 | Hồi quy |
| FR-21 Từ chối đặt chỗ | Hoãn theo Q22 – ứng viên Baseline V2.0 | `reservations.test.ts` › "LOT_SUSPENDED when lot suspended; existing PENDING kept on suspend", "ZONE_FULL when no free spot", "VEHICLE_ALREADY_RESERVED…", "VEHICLE_PARKED…" | TC-RES-04..06, 11; TC-EX-05c | Hồi quy |
| FR-22 Hủy đặt chỗ | Hoãn theo Q22 – ứng viên Baseline V2.0 | `reservations.test.ts` › "cancel before arrival -> CANCELLED; at/after arrival -> NOT_CANCELLABLE", "NOT_CANCELLABLE when another customer attempts the cancel" | TC-RES-07, 08 | Hồi quy |
| FR-23 Giữ chỗ, NO_SHOW | Hoãn theo Q22 – ứng viên Baseline V2.0 | `reservations.test.ts` › "marks NO_SHOW at holdUntil and frees the spot"; `availability.test.ts` › "expires stale PENDING reservations before reporting availability"; `entry.test.ts` › "expires a stale reservation before the capacity check…" | TC-RES-12 | Hồi quy |
| FR-24 Hoàn tất / vào khu khác | Hoãn theo Q22 – ứng viên Baseline V2.0 | `entry.test.ts` › "fulfils own pending reservation even when free is 0", "early arrival … still fulfils", "entry into other zone cancels reservation and counts as walk-in" | TC-RES-09, 10 | Hồi quy |
| FR-25 Chỗ đặt trừ vào sức chứa | Hoãn theo Q22 – ứng viên Baseline V2.0 | `reservations.test.ts` › "walk-in rejected when last free spot is reserved (ZONE_FULL)" | TC-AV-02, TC-RES-11 | Hồi quy |
| FR-26 Phí theo lượt | Hoãn theo Q22 – ứng viên Baseline V2.0 | `fees.test.ts` › "returns the tariff price for each vehicle type and fee group", "throws NOT_FOUND when the tariff is missing"; `exit.test.ts` › "fee uses feeGroup snapshotted at entry…" | TC-EXIT-03, 04; TC-PAY-01 | Hồi quy |
| FR-27 Xác nhận thanh toán | Hoãn theo Q22 – ứng viên Baseline V2.0 | `exit.test.ts` › "closes session and creates CONFIRMED payment with group fee" | TC-EXIT-02, TC-PAY-02 | Hồi quy |
| FR-28 Lịch sử giao dịch | Hoãn theo Q22 – ứng viên Baseline V2.0 | `history.test.ts` (5 test: `customerHistory`, `allPayments`) | TC-PAY-03..05 | Hồi quy |
| FR-29 Báo cáo | Hoãn theo Q22 – ứng viên Baseline V2.0 | `reports.test.ts` (7 test `buildReport`) | TC-REP-01..05 | Hồi quy |
| FR-30 Che biển số | Must | `plate.test.ts` › `maskPlate` (3 test), `presentPlate` (6 test) | TC-DP-01..03 | Đủ (định dạng che chỉ kiểm được bằng test tự động, E2E E-1) |
| FR-31 Nhật ký truy cập | Must | `auth.test.ts` (LOGIN được ghi); `accounts.test.ts` › "listAccessLogs returns newest first with userName", ACCOUNT_CHANGE; `lots.test.ts` (LOT_CHANGE, TARIFF_CHANGE); `exit.test.ts` (EXIT, MANUAL_CONFIRM); `purge.test.ts` › "logs PURGE with counts" | TC-DP-04, 05 | Một phần: "xem biển số đầy đủ" ở trang chi tiết và việc không ghi ở trang danh sách chỉ kiểm thủ công |
| FR-32 Purge 12 tháng | Must | `purge.test.ts` (5 test, xem T-DB9) | TC-DP-06..09, TC-SIM-03 | Đủ |
| FR-33 Bộ mô phỏng 3 chức năng | Hỗ trợ Must (P04) | `simulator.test.ts` › "simulateLive(120)…", các test EX01..EX05, "generateHistory(3) creates payments and NO_SHOW reservations and >= 20 sessions older than 12 months" | TC-SIM-01..04, TC-EX-01b..05e | Đủ (phần sinh đặt chỗ, thanh toán trong lịch sử phục vụ chức năng hoãn) |
| FR-34 ≥ 100 phiên ghi đầy đủ | Hỗ trợ Must (P04) | `simulator.test.ts` › "simulateLive(120) …" | TC-SIM-01; AT-100 (P21) | Một phần: test đếm 120 sự kiện, không khẳng định ≥ 100 phiên |

### 7.2 Ngoại lệ

| ID | Phạm vi | Test tự động | E2E thủ công | Đánh giá |
|---|---|---|---|---|
| EX-01 Hết chỗ | Must | Xem T06 | TC-EX-01a, b | Đủ |
| EX-02 Biển số không khớp | Must | Xem T07 | TC-EX-02a, b, c | Đủ |
| EX-03 Mất QR/thẻ | Must | Xem T08 | TC-EX-03a, b | Đủ |
| EX-04 Đã có lượt mở | Must | Xem T09 | TC-EX-04a, b | Đủ |
| EX-05 Bãi tạm ngưng | Must (vế đặt chỗ: Hoãn theo Q22) | Xem T10; vế đặt chỗ: `reservations.test.ts` › "LOT_SUSPENDED when lot suspended…" | TC-EX-05a..e; TC-RES-05 | Đủ |

### 7.3 Khoảng trống

- **Yêu cầu Must không có ca kiểm thử nào:** không có. Mọi FR Must và EX-01..EX-05 có ít nhất một ca (tự động hoặc thủ công).
- **Yêu cầu Must không có test tự động:** FR-19 (cập nhật live qua SSE).
- **Yêu cầu Must chỉ được test tự động một phần** (phần còn lại dựa vào ca thủ công): FR-02, FR-03, FR-05, FR-11, FR-15, FR-31, FR-34.
- **Chưa có kết quả đạt được ghi nhận** cho bất kỳ ca nào (mục 8; cột Result của E2E Part C còn trống). O5 chưa thể kết luận.
- **Chưa có ngưỡng bằng số** cho độ trễ cập nhật chỗ trống (O1).

Đề xuất xử lý (thực hiện trong hoạt động đã có lịch, không thêm hoạt động mới): bổ sung test tự động cho FR-19 (sự kiện `availability:changed` khi vào/ra và đổi sức chứa) và FR-34 (khẳng định ≥ 100 phiên) trong A-49, A-68; test RBAC mức route/API trong A-31; chốt ngưỡng độ trễ trong P02 trước A-49.

---

## 8. Kết quả chạy hiện tại (ảnh chụp)

| Hạng mục | Giá trị |
|---|---|
| Ngày | 08/11/2026 |
| Lệnh | `npx vitest run` tại thư mục gốc repo |
| Kết quả | **Không chạy được.** Bước `tests/global-setup.ts` gọi `npx prisma db push --force-reset --skip-generate`; Prisma CLI dừng lệnh vì thao tác xóa dữ liệu cần người dùng xác nhận trực tiếp. Vitest báo "No test files found, exiting with code 1" sau lỗi global setup |
| Số file test (đếm tĩnh) | 21 file `*.test.ts` (7 unit, 14 integration) cộng `global-setup.ts`, `helpers/db.ts` |
| Số ca (đếm tĩnh, `it(...)`) | 137 |
| Đạt / không đạt | Chưa có số liệu |

Đây là ảnh chụp tại thời điểm viết v0.1, không phải kết quả kiểm thử. Thành viên nhóm cần chạy `npm test` trên máy của mình (lệnh sẽ xóa và tạo lại `test.db`, không ảnh hưởng `dev.db`) và ghi số file, số ca, đạt, không đạt, mã commit vào tab Quality Evidence trước CP-03.

---

## 9. Quản lý lỗi

### 9.1 Mức độ nghiêm trọng (quy ước đề xuất của P20 v0.1, cần review)

| Mức | Định nghĩa | Ví dụ | Ảnh hưởng tới checkpoint |
|---|---|---|---|
| S1 Chặn | Một yêu cầu Must hoặc một EX không đạt; sai số chỗ trống (O1); mất bản ghi phiên (O2); lộ biển số hoặc vượt quyền | Vi phạm T05, T11 hoặc T12 | Không qua CP-05, CP-07 nếu chưa sửa hoặc chưa được PM chấp nhận |
| S2 Nặng | Yêu cầu Must đạt một phần, có cách làm tạm | Một ca "Một phần" ở mục 7 không đạt phần thủ công | Được mở qua CP-07 nếu PM chấp nhận; ghi vào P14 |
| S3 Nhẹ | Lỗi chữ, giao diện, không đổi hành vi | E2E E-3 (câu thông báo EX-05 của bộ mô phỏng) | Không chặn; ghi vào P14 (theo R-G5-02 "lỗi không chặn ghi vào P14") |

Lỗi ở test nhóm "Hoãn theo Q22" được ghi nhận nhưng không chặn checkpoint V1.0.

### 9.2 Quy trình

| Bước | Quy định | Nguồn |
|---|---|---|
| Ghi lỗi | Tab **Quality Evidence** của workbook theo dõi: mã ca (T/T-DB/TC/AT), mô tả, mức, người phát hiện, ngày, commit | BL 2.5.1 |
| Phân loại | Ngay khi gặp lỗi (ứng phó R-G5-02) | BL risks |
| Sửa | Trả về hoạt động sở hữu sản phẩm; giờ sửa lấy từ dự phòng làm lại 11,5 giờ | BL 2.5.1 |
| Kiểm lại | Người review kiểm lại tiêu chí không đạt; chạy lại ca không đạt và toàn bộ `npm test` (hồi quy). Trong dry run chỉ chạy lại AT không đạt | BL 2.5.1, R-G5-02 |
| Không đạt lần hai | Leo thang mức 1 (M1 1.5.1) | BL 2.5.1 |
| Thay đổi phạm vi | Nếu sửa lỗi đòi đổi yêu cầu hoặc phạm vi đã baseline: lập CR trong **Change Log**, PM xem xét, khách hàng phê duyệt | BL 2.12 |
| Quyết định | QA (Đào Xuân Sơn) xác nhận đạt/không đạt; Tech lead duyệt checkpoint kỹ thuật; PM (Nguyễn Võ Đức Sơn) quyết định chấp nhận lỗi mở và demo tại CP-07; khách hàng xác nhận tại CP-08 | BL 2.5.1, CP-07, CP-08 |

---

## 10. Lịch và trách nhiệm

Mã nguồn lực: RES-01 Nguyễn Võ Đức Sơn, RES-02 Đào Xuân Sơn, RES-03 Nguyễn Phạm Mạnh Dũng, RES-04 Phạm Duy Quý, RES-05 Nguyễn Tuấn Thành.

### 10.1 Hoạt động kiểm thử

| Hoạt động | Nội dung | Sản phẩm | Phụ trách | Bắt đầu | Kết thúc | Checkpoint |
|---|---|---|---|---|---|---|
| A-80 | Viết kế hoạch kiểm thử (tài liệu này) | P20 | RES-02 | 16/11 | 18/11 | — |
| A-61 | Kiểm thử mô-đun quản lý thông tin bãi: CRUD và phân quyền Manager; ghi Quality Evidence | P08 | RES-01 | 24/11 | 24/11 | — |
| A-49 | Kiểm thử mô-đun hiển thị chỗ trống: so số đếm tay sau kịch bản P04; đo độ trễ cập nhật; ghi Quality Evidence | P09 | RES-04 | 27/11 | 30/11 | — |
| A-68 | Kiểm thử mô-đun xe ra/vào trên bộ mô phỏng (kịch bản 100 lượt), T05-T13 | P05 | RES-05, RES-02 | 27/11 | 30/11 | CP-05 |
| A-95 | Chạy thử sớm AT-01, AT-02 và kịch bản 100 lượt | P21 | RES-02 | 27/11 | 30/11 | — |
| A-31 | Kiểm thử mô-đun xác thực và phân quyền: ma trận quyền 3 vai trò × 5 nhóm chức năng; che biển số và nhật ký | P07 | RES-05 | 30/11 | 01/12 | — |
| A-87 | Chạy thử nghiệm thu nội bộ (dry run) | P21 | RES-02, RES-04 | 01/12 | 01/12 | CP-07 |
| A-88 | Trình diễn nghiệm thu với khách hàng | P14 | RES-01, RES-05 | 01/12 | 02/12 | CP-08 |

Hoạt động liên quan (tham chiếu): A-26 script CSDL và kiểm thử T-DB (12/11-17/11); A-78 thử nghiệm xử lý đồng thời (18/11-19/11); A-45 kiểm tiêu chí 1-8 PD-P04 (19/11-20/11); A-79 bộ kiểm thử hợp đồng API vào/ra (23/11-24/11); A-82, A-83, A-85 viết và review P21 (18/11-27/11).

### 10.2 Checkpoint

| CP | Kích hoạt | Tiêu chí đạt liên quan đến kiểm thử | Người review / phê duyệt |
|---|---|---|---|
| CP-03 | A-27 (17/11), sau A-26 | T-DB của PD-P03 đạt; script chạy trên CSDL trống | RES-01 (Tech lead) |
| CP-04 | A-45 (19/11-20/11), kết thúc increment 1 | Demo đăng nhập theo vai trò, Manager quản lý bãi, bộ mô phỏng chạy 100 lượt | RES-02 (QA); video demo gửi khách hàng |
| CP-05 | A-68 (27/11-30/11), kết thúc increment 2 | T05-T13 đạt; 100 lượt mô phỏng có bản ghi hợp lệ (O2); chỗ trống khớp số đếm tay (O1) | RES-02 (QA); video demo gửi khách hàng |
| CP-07 | A-87 (01/12) | 100% AT Must đạt hoặc lỗi mở được PM chấp nhận | RES-02 (QA); RES-01 (PM) quyết định demo |
| CP-08 | A-88 (01/12-02/12) | Khách hàng xác nhận kết quả theo Q11 | Khách hàng |

---

## 11. Rủi ro kiểm thử

| Rủi ro | Mô tả | Điểm (L × I) | Phụ trách | Ứng phó trong kế hoạch kiểm thử |
|---|---|---|---|---|
| R-G4-01 | Nhiều lượt vào/ra gần như đồng thời làm lệch số chỗ trống (O1) | 2 × 3 = 6 | RES-01 | A-78 trước A-63; test `entry.test.ts` › "20 concurrent entries…"; giới hạn đã biết: khóa trong tiến trình chỉ đúng với một tiến trình server trên SQLite (E2E E-7), nên dry run và nghiệm thu chạy đúng một tiến trình |
| R-G5-01 | Mô-đun chưa sẵn sàng khi dry run | 3 × 3 = 9 | RES-02 | A-95 chạy thử sớm; nếu xảy ra, chạy A-87 theo đợt, AT chưa chạy ghi lý do vào P14 |
| R-G5-02 | Dry run phát hiện nhiều lỗi hơn dự kiến | 4 × 3 = 12 | RES-02 | A-95 lộ lỗi sớm; phân loại lỗi ngay (mục 9); chỉ chạy lại AT không đạt; lỗi không chặn ghi vào P14 |
| RT-01 (từ mục 7) | FR-19 không có test tự động và O1 không có ngưỡng độ trễ: hồi quy SSE chỉ phát hiện được khi kiểm thủ công | — | RES-02 | Chốt ngưỡng trong P02; thêm test tự động trong A-49 |
| RT-02 (từ mục 6-7) | Ngưỡng O2 "≥ 100 phiên" và "≤ 2 s" chỉ được kiểm gần đúng bởi test tự động (120 sự kiện; đo ở mức service) | — | RES-05 | Khẳng định số phiên trong test; đo HTTP trong TC-EXIT-07 và AT-100 |
| RT-03 (từ mục 6) | T-DB1, T-DB2, T-DB8, T-DB10 chưa có ca kiểm thử; T-DB8 mâu thuẫn với D-29 (bản sao biển số trong `parking_sessions`) | — | RES-03 | Review tại CP-03; sửa tiêu chí T-DB8 hoặc ghi lý do phi chuẩn hóa trong P03 |
| RT-04 (từ mục 8) | Bộ test tự động chưa có kết quả được ghi nhận | — | RES-02 | Chạy `npm test` và ghi Quality Evidence trước CP-03 |

Điểm rủi ro R-G4-01, R-G5-01, R-G5-02 lấy từ sổ rủi ro baseline; RT-01..RT-04 là rủi ro do P20 phát hiện, chưa có trong sổ rủi ro, đề xuất PM xem xét đưa vào.
