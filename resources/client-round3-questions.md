# Client Interaction Log — Round 3 (draft, to send by email)

- Prepared: 2026-11-08
- Source: `docs/superpowers/specs/2026-11-08-smart-parking-mvp-design.md` §10
- Status: Draft, not yet sent
- Channel: batched email, per client request (CIL Q13, Q19)

The MVP is built on the team assumptions below. Each question asks the client to confirm one assumption. Questions are in priority order: R3-Q1 and R3-Q2 come first because a different answer would change the core entry/exit workflow (CIL Q22).

## Questions

| ID | Câu hỏi | Giả định của nhóm | Lý do / ảnh hưởng | Follow-up of | Decisions (spec) |
|---|---|---|---|---|---|
| R3-Q1 | Một tài khoản có được đăng ký nhiều xe không, có giới hạn số xe không? Biển số có là duy nhất trong hệ thống không? Khi người dùng đăng ký một biển số đã từng gửi xe dưới dạng khách vãng lai, xe đó có được gán cho tài khoản không? | Nhiều xe, không giới hạn; biển số duy nhất; xe vãng lai được gán cho tài khoản đăng ký; biển số đã thuộc tài khoản khác thì báo lỗi | Quyết định mô hình dữ liệu xe và quy trình nhận diện xe khi vào/ra (High nếu biển số không duy nhất) | draft Q38 | D-12, D-33 |
| R3-Q2 | Nhóm người dùng (sinh viên / giảng viên-nhân viên) được xác định thế nào? Xe không gắn với tài khoản nào (khách vãng lai) được tính phí theo mức nào? | Người dùng tự chọn nhóm khi đăng ký; xe vãng lai tính theo mức "Khách" riêng | Ảnh hưởng tính phí theo nhóm và việc cho phép xe chưa đăng ký vào bãi (High nếu không cho phép) | Q16 | D-10, D-36 |
| R3-Q3 | Đặt chỗ: chỗ đã đặt có bị trừ khỏi số chỗ trống ngay khi đặt không, và xe vãng lai có bị từ chối nếu chiếm vào chỗ đã đặt không? Được đặt trước tối đa bao lâu? Nếu xe đến sớm hơn giờ hẹn, hoặc vào khu vực khác với khu vực đã đặt, thì xử lý thế nào? | Trừ ngay, từ chối xe vãng lai chiếm chỗ đã đặt; chỉ đặt trong ngày; đến sớm vẫn được tính là đã đến; vào khu vực khác thì hủy đặt chỗ và tính như xe vãng lai | Ảnh hưởng công thức tính chỗ trống (O1) và tỷ lệ không đến (O3) | Q15 | D-07, D-19, D-21, D-34 |
| R3-Q4 | Khi bãi tạm ngưng hoạt động: xe đang gửi có được ra không? Đặt chỗ mới và đặt chỗ đang chờ xử lý thế nào? | Cho xe ra; từ chối đặt chỗ mới; giữ các đặt chỗ đang chờ | Hoàn thiện xử lý ngoại lệ "bãi tạm ngưng" (O4) | Q14 | D-27 |
| R3-Q5 | Khi người gửi xe mất mã QR/thẻ, quy trình xử lý là gì? Có thu phí phạt không? | Nhân viên tra cứu lượt gửi theo biển số, xác nhận thủ công, ghi nhật ký; không thu phí phạt | Hoàn thiện xử lý ngoại lệ "mất mã QR/thẻ" (O4) và cách tính phí | Q21 | D-09 |
| R3-Q6 | "Sau 12 tháng thì xóa" nghĩa là xóa biển số khỏi lượt gửi (giữ lại số liệu thống kê) hay xóa toàn bộ lượt gửi? Xóa thủ công bởi quản lý hay tự động? | Che/xóa biển số trên lượt gửi cũ, giữ số liệu; quản lý bấm xóa thủ công | Ảnh hưởng bảo vệ dữ liệu cá nhân (CN4) và dữ liệu báo cáo dài hạn | Q18 | D-15, D-29 |
| R3-Q7 | Cách tính 4 chỉ số báo cáo nhóm đề xuất như sau, thầy có đồng ý không: tỷ lệ sử dụng theo giờ = số chỗ đang dùng trung bình ÷ sức chứa; giờ cao điểm = 3 khung giờ có nhiều lượt vào nhất; doanh thu = tổng thanh toán đã xác nhận theo ngày; tỷ lệ không đến = số không đến ÷ (tổng đặt chỗ − số đã hủy) | Như câu hỏi | Cơ sở đo O3 | Q20 | D-30 |
| R3-Q8 | Giao diện cần tiếng Việt, tiếng Anh hay cả hai? | Cả hai, có nút chuyển ngôn ngữ | Ảnh hưởng khối lượng giao diện | draft Q45 | D-11 |
| R3-Q9 | Thanh toán mô phỏng do nhân viên xác nhận khi xe ra, hay người gửi xe tự thanh toán trên ứng dụng? | Nhân viên xác nhận khi xe ra | Ảnh hưởng quy trình xe ra và màn hình thanh toán | Q5 | D-06 |

## Regression impact if the client decides differently

Levels: **Low** = only logic, validation or UI; no schema change. **Medium** = schema change or a new screen; one module. **High** = changes the core entry/exit or availability workflow across several modules.

A different answer after the baseline goes to the Change Log as a change request with impact analysis (Assignment Task 3.6, 3.7). Schema changes are made with a new migration (M2 PD-P03 §6).

| Q | Alternative answer | Affected spec items | Affected code / data / tests | Level |
|---|---|---|---|---|
| R3-Q1 | One vehicle per account, or a limit N | FR-06 | Vehicle add validation, Customer vehicle UI, seed data, 1 test | Low |
| R3-Q1 | Plates not unique (one plate shared by several accounts) | FR-06a, FR-12, FR-26, D-33 | `vehicles` uniqueness removed; vehicle–owner becomes many-to-many; entry by plate must choose owner; fee logic, entry screen, simulator, fee/entry tests | High |
| R3-Q1 | Guest plate not claimed automatically (Manager approval) | FR-06a | Pending-claim state, Manager approval screen, access-log entry, tests | Medium |
| R3-Q2 | Group verified/assigned by Manager | FR-01, D-10, D-24 | `users` verification status; Manager group edit; sign-up form; fee tests | Medium |
| R3-Q2 | Unlinked vehicles charged Student rate (no Guest group) | FR-09, FR-26, D-36 | Guest column removed from `tariffs`; tariff screen; fee tests; seed | Low |
| R3-Q2 | Unregistered vehicles not allowed | FR-12, EX list | Entry rejects unknown plates, a new exception beyond the agreed 5 (M1 O4); simulator, entry screen, tests, traceability | High |
| R3-Q3 | Reservations do not hold a spot | FR-17, FR-21, FR-25, D-21 | Availability formula, reservation check, SSE triggers, availability tests | Low |
| R3-Q3 | Longer booking window | FR-20, D-19 | Date validation, reservation form, expiry test data, simulator history | Low |
| R3-Q3 | Early arrival not allowed / different zone keeps reservation | FR-24, D-34 | Fulfilment logic in entry handler, tests | Low |
| R3-Q3 | Reservation at lot level instead of zone | FR-20, FR-24, D-07 | `reservations` zone→lot migration, availability per lot, reservation form, tests | Medium |
| R3-Q4 | Pending reservations cancelled on suspension | FR-21, D-27 | Status-change handler cancels reservations; SSE event; test | Low |
| R3-Q4 | Exits blocked while suspended | FR-14, EX-05 | Exit handler check, message, test; demo step 7 changes | Low |
| R3-Q5 | Lost-card penalty fee | FR-09, FR-26, FR-27, EX-03 | Penalty amount stored; payment = fee + penalty; tariff screen; fee + EX-03 tests | Medium |
| R3-Q6 | Delete whole sessions after 12 months | FR-32, D-29 | Purge cascades to `session_events`, `payments`; reports lose data older than 12 months; purge test; simulator history | Medium |
| R3-Q6 | Automatic purge instead of Manager action | FR-32, D-15 | Scheduled/startup job, system access-log entry, test | Low |
| R3-Q7 | Different metric formulas | FR-29, D-30 | Report queries, simulator history data, report tests/demo | Low |
| R3-Q8 | Vietnamese only or English only | FR-05, D-11, D-38 | Remove toggle and second language (less work) | Low |
| R3-Q9 | Customer pays in the app | FR-14, FR-27, D-06 | Customer payment screen, unpaid state, exit flow change, payment tests, demo step 5 | Medium |

## Client responses

| ID | Date answered | Client response | Impact on project | CR raised |
|---|---|---|---|---|
| R3-Q1 | | | | |
| R3-Q2 | | | | |
| R3-Q3 | | | | |
| R3-Q4 | | | | |
| R3-Q5 | | | | |
| R3-Q6 | | | | |
| R3-Q7 | | | | |
| R3-Q8 | | | | |
| R3-Q9 | | | | |
