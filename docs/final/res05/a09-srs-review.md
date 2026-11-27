# A-09 / CP-01 · SRS review by RES-05

| Field | Value |
|---|---|
| Activity / checkpoint | A-09 / CP-01 |
| Reviewer | Nguyễn Tuấn Thành (RES-05). Second reviewer and approver per baseline: Nguyễn Võ Đức Sơn (RES-01) |
| Review date | 16/11/2026, SRS v0.2. Record kept in the team project workspace and committed here on 26/11 so CP-01 has evidence in the repository |
| Effort | 1 h (estimated; plan 1 h for RES-05) |
| Used by | F2-01 (RES-02) `docs/final/res02/cp01-srs-review.md`; F2-03 gate log |

## Status on 26/11 (read this first)

- **Review 1 (16/11): not passed**, 14 findings (6 High, 8 Medium); the full record is below, unchanged.
- **How the findings were closed:** not by a separate re-check meeting. The SRS was revised through v1.0, the A-70 sync with the code and **v2.1 (23/11)**, which applied the client's Phase 5 answers Q36–Q46. The two scope findings are resolved by the client's decisions:
  - R09-20 (hourly fee): **closed.** Fee is per visit only (Q36); FR-24, FR-34, FR-36 rewritten, AS26 dropped.
  - R09-19 (operating hours): **closed by client decision.** The client asked to keep operating hours as information only (Q37); FR-22, FR-26, AS9 say so, and SRS v2.1 section 6 excludes blocking entry or reservations outside the hours.
  - The other findings (R09-01..R09-18) are superseded by v1.0/v2.1 and the code sync; remaining SRS–code gaps are listed in SRS v2.1 section 9 for RES-01 to decide. **No new SRS work is raised by this record.**
- **Deviation:** the 18/11 re-check (section 6 checklist) and RES-01's approval were not recorded. A-82/A-83 and CP-02 went ahead on the client decisions (`specs/002-lecturer-acceptance-alignment/`). RES-02 records the CP-01 outcome in F2-01.

---

## Review record 16/11 (original)

### A-09. Review SRS (P02) v0.2 theo 7 tiêu chí PD-P02 – phần của reviewer RES-05

| Trường | Nội dung |
|---|---|
| Hoạt động / checkpoint | A-09 / CP-01 (trước khi A-10 chốt SRS v1.0) |
| Tài liệu được review | `CO3011_M2_SRS_v0.2` (Phạm Duy Quý, 15/11/2026): 52 FR, 13 NFR, 5 EX |
| Reviewer | Nguyễn Tuấn Thành (RES-05). Reviewer thứ hai và người duyệt: Nguyễn Võ Đức Sơn (RES-01) |
| Ngày review | 16/11/2026 |
| Effort thực tế | khoảng 1 giờ (ước lượng; kế hoạch RES-05: 1 h) |
| Căn cứ | PD-P02 mục 7 (7 tiêu chí); M1 v0.3 mục 1.4.1, 1.4.2; M2 mục 2.0.2, 2.2, 2.5 (CP-01), 2.12.1; Client Interaction Log Q27–Q35 (phản hồi vòng 3 của thầy); A-43 review bộ mô phỏng |

## 1. Kết luận

**Đề xuất: CHƯA ĐẠT ở lần review 1.** Đạt 3/7 tiêu chí (1, 3, 5). Tiêu chí 2 đạt một phần. Tiêu chí 4 không đạt: SRS vẫn có giờ hoạt động và tính phí theo giờ, cả hai đã bị loại ở M1 1.4.2. Tiêu chí 6 không đạt: có 6 cặp yêu cầu mâu thuẫn và SRS lệch với M2 2.0.2. Tiêu chí 7 sẽ hoàn tất khi có biên bản này và RES-01 duyệt.

Không có lỗi về cấu trúc. Truy vết O ở mục 8.1 và thống kê 8.3 đã được đếm lại và khớp 100%. Nội dung bám đúng phản hồi Q27–Q35. Phần cần sửa nằm trong 14 phát hiện ở mục 3 (6 mức Cao, 8 mức TB), ước tính 5–6 giờ sửa: 4 giờ sửa sau review đã có trong A-09, phần còn lại lấy từ dự phòng làm lại.

Đối chiếu phạm vi với M1 v0.3 mục 1.4.1 và 1.4.2 (bản cập nhật sau vòng 2, ngày 31/10).

Theo CP-01: trả về chủ sở hữu, sửa trong 2 ngày (hạn **18/11**), lấy giờ từ dự phòng làm lại. Sau đó reviewer chỉ kiểm lại các mục ở mục 6. A-82 và A-83 chờ CP-01. Các hoạt động sửa mã vẫn chỉ phụ thuộc CP-02.

## 2. Đối chiếu 7 tiêu chí PD-P02

| # | Tiêu chí | Kết quả | Nhận xét | Phát hiện |
|---|---|---|---|---|
| 1 | 100% hạng mục ở M1 1.4.1 có ít nhất 1 yêu cầu | Đạt | 9/9 hạng mục của M1 1.4.1 đều có FR. Bộ mô phỏng không phải hạng mục riêng ở 1.4.1 (nằm trong "Quản lý xe vào/ra – dữ liệu mô phỏng"). Lỗi nhỏ: bảng 1.2 chép sai nội dung 1.4.1 (thêm "giờ hoạt động", xem R09-19) và chưa ánh xạ FR-46..FR-50, NFR-12 | R09-15, R09-19 |
| 2 | Tiêu chí chấp nhận kiểm tra được, không mơ hồ | Một phần | Phần lớn có số cụ thể. FR-20, FR-38, FR-41 chưa đủ để tính tay ra một kết quả duy nhất | R09-07, R09-08, R09-09 |
| 3 | Mỗi yêu cầu có ≥ 1 mục tiêu O và ≥ 1 nguồn | Đạt | 65/65 yêu cầu có cả hai cột. Mã D1, D2 (NFR-09, NFR-10) chưa được định nghĩa ở mục 1.5 | R09-14 |
| 4 | Không có yêu cầu ngoài phạm vi (M1 1.4.2) | **Không đạt** | M1 1.4.2 loại "Giờ hoạt động của bãi" (Q14) và "Tính phí theo giờ" (Q16). SRS v0.2 vẫn có giờ hoạt động (FR-22, FR-26, AS9, bảng 1.2) và tính phí theo giờ (FR-24, FR-34, AS11, AS26). Mục 6 của SRS cũng thiếu 3 dòng loại trừ của M1: giờ hoạt động, tính phí theo giờ, vai trò quản trị viên riêng. Không có vé tháng, phí phạt, cảm biến ô đỗ, cổng thanh toán thật, SSO hay phần cứng thật | R09-19, R09-20 |
| 5 | Mỗi ngoại lệ có ≥ 1 yêu cầu xử lý | Đạt | EX-01..EX-05 đều có FR (bảng 8.2 khớp mục 5). Câu dẫn mục 5 còn ghi "chờ xác nhận ở Q27" dù Q27 đã được xác nhận | R09-13 |
| 6 | Không có yêu cầu mâu thuẫn; số liệu khớp M1, M2 2.0.2, PBS | **Không đạt** | 6 cặp mâu thuẫn (R09-02..R09-07). SRS trái với M2 2.0.2 ("Không quản lý giờ hoạt động"; phí "theo lượt… không có phí theo giờ"). Số yêu cầu và mã FR lệch so với PD-P02, M2 2.12.1 và A-43 | R09-02..R09-07, R09-10, R09-11, R09-19, R09-20 |
| 7 | ≥ 2 thành viên khác review trước v1.0 | Đang thực hiện | Có biên bản này. Còn chờ RES-01. Trang bìa ghi sai reviewer | R09-12 |

**Kiểm tra số liệu:** Đã đếm lại theo từng bảng. FR có 32 Must, 16 Should, 4 Could (= 52). NFR có 10 Must, 3 Should (= 13). Mục tiêu O1 có 14 yêu cầu, O2 có 15, O3 có 15, O4 có 24, O5 có 7. Tất cả khớp với mục 8.1 và 8.3.

**Đối chiếu phản hồi vòng 3:** Q27 (5 ngoại lệ), Q28 (công thức 4 chỉ số), Q29, Q30, Q31 (gồm phần thầy sửa về xe đến sớm), Q32–Q35 đều đã vào SRS đúng nội dung. Ngưỡng nghiệm thu (AS28) được ghi đúng là "chờ xác nhận".

## 3. Phát hiện chi tiết

Mức độ: **Cao** = phải sửa để qua CP-01; **TB** = nên sửa trong v1.0; **Thấp** = sửa nếu kịp.

| ID | Mức | Vị trí | Vấn đề | Đề xuất sửa |
|---|---|---|---|---|
| R09-19 | Cao | FR-22, FR-26, AS9, bảng 1.2 | Giờ hoạt động bị M1 1.4.2 loại khỏi phạm vi (Q14: thầy không liệt kê) và M2 2.0.2 ghi "Không quản lý giờ hoạt động". SRS vẫn yêu cầu tạo/sửa và hiển thị giờ hoạt động. Bảng 1.2 còn chép sai dòng "Quản lý thông tin bãi" của M1 1.4.1 | Bỏ giờ hoạt động khỏi FR-22 (còn 3 trường: tên, địa chỉ, trạng thái), FR-26 và AS9. Sửa dòng bảng 1.2 theo đúng M1 1.4.1. Thêm "Giờ hoạt động của bãi – Q14 – 1.4.2" vào mục 6. Nếu nhóm muốn giữ thì phải mở CR, không tự đưa vào SRS |
| R09-20 | Cao | FR-24, FR-34, AS11, AS26 | Tính phí theo giờ bị M1 1.4.2 loại (Q16: nhóm chỉ tính theo lượt), M1 1.4.1 ghi "Tính phí theo lượt", M2 2.0.2 ghi "Không có phí theo giờ". SRS cho mỗi mục giá chọn theo lượt hoặc theo giờ, có làm tròn giờ (AS26) | FR-24: bỏ "chọn cách tính theo lượt hoặc theo giờ". FR-34: phí = đơn giá theo lượt của mục giá; bộ test còn 6 tổ hợp (2 loại xe × 3 nhóm), bỏ ca 60/61 phút. Bỏ AS26; sửa AS11 thành "chỉ theo lượt; giờ và vé tháng ngoài phạm vi (Q16, M1 1.4.2)". Thêm "Tính phí theo giờ – Q16 – 1.4.2" và "Vai trò quản trị viên riêng – Q25 – 1.4.2" vào mục 6; đổi nguồn "Vé tháng" thành Q16 |
| R09-01 | TB | Mục 3 (thiếu) | Không phải lỗi phạm vi (M1 1.4.1 không có hạng mục bộ mô phỏng riêng). Nhưng PD-P02 (M2 2.2, mục Thành phần) liệt kê nhóm FR "Bộ mô phỏng", và CP-04, AT-100, NFR-06 cần biết bộ mô phỏng phải làm gì. Hiện P04 không có yêu cầu gốc để truy vết | Chọn một: (a) thêm mục 3.10 như đề xuất ở mục 4; hoặc (b) giữ nguyên SRS, ghi rõ yêu cầu bộ mô phỏng nằm ở PD-P04 và sửa câu Thành phần của PD-P02 khi lập Baseline V2.0 |
| R09-02 | Cao | FR-46 ↔ FR-31, FR-17 | FR-46 từ chối mọi xe vào khi chỗ trống bằng 0, "kể cả khi chỗ còn lại đang được giữ". Nhưng FR-17 đã trừ đặt chỗ ra khỏi chỗ trống. Vì vậy khi chỗ trống bằng 0, xe **đã đặt** đến đúng khung giờ cũng bị từ chối. Điều này trái với FR-31 và Q31 ("chỗ được giữ lại") | FR-46: thêm "trừ xe có đặt chỗ đang hiệu lực tại khu vực đó vào trong khung giờ hẹn tới +30 phút". Tiêu chí chấp nhận thêm 1 ca: chỗ trống = 0, xe đã đặt vẫn vào được |
| R09-03 | Cao | FR-09 ↔ FR-51 | FR-09 yêu cầu mỗi sự kiện vào hợp lệ tạo đúng 1 lượt. FR-51 yêu cầu xe đã đặt đến **trước** giờ hẹn thì chưa tạo lượt khi Staff chưa xác nhận. Với sự kiện từ bộ mô phỏng, hai yêu cầu cho hai kết quả khác nhau | FR-09: thêm "trừ trường hợp ở FR-51". Ghi rõ hệ thống làm gì với sự kiện đó: chuyển cho Staff chờ xác nhận, không trả lỗi. Việc này cũng ảnh hưởng tới hợp đồng API vào/ra ở CP-02 |
| R09-04 | Cao | FR-18 ↔ FR-31, FR-32 | FR-18 yêu cầu sau mỗi lượt vào, chỗ trống đổi đúng 1 đơn vị. Nhưng khi xe đã đặt vào đúng khu vực, chỗ trống **không đổi** (đặt chỗ chuyển thành lượt đang mở; FR-31 ghi "không bị trừ chỗ hai lần"). Khi vào khác khu vực (FR-32), hai khu vực cùng đổi. Nếu test theo đúng FR-18 thì sẽ báo lỗi sai | FR-18: liệt kê 7 loại sự kiện kèm mức thay đổi: vào (−1), ra (+1), đặt (−1), hủy (+1), hết hạn/không đến (+1), xe đã đặt vào đúng khu vực (0), xe đã đặt vào khu vực khác (khu cũ +1, khu mới −1). Thêm hủy do tạm ngưng (FR-50: +1) |
| R09-05 | Cao | FR-32 ↔ FR-11, FR-34 | FR-32 ghi "tiếp nhận như khách vãng lai, áp dụng mức phí tương ứng". FR-11 thì gắn xe có biển số đã đăng ký với nhóm của tài khoản. Chưa rõ xe này tính giá nhóm "Khách" hay giá nhóm Sinh viên/GV. Thầy chỉ chấp nhận giả định của nhóm, không định nghĩa "mức phí tương ứng" | Chọn một cách hiểu và ghi vào FR-32 và tiêu chí chấp nhận. Đề xuất: lượt vẫn gắn tài khoản, tính theo nhóm của tài khoản; "như khách vãng lai" chỉ có nghĩa là không còn đặt chỗ. Ghi thành AS29 và gửi thầy cùng AS24–AS27 |
| R09-06 | TB | Bảng 2.2 ↔ FR-37 | Ma trận cho Staff xem "lịch sử lượt gửi và giao dịch – Của bãi (đang làm)", nhưng FR-37 chỉ cấp quyền xem giao dịch cho Customer và Manager. "(đang làm)" cũng không rõ nghĩa: ca đang làm, ngày hôm nay hay bãi đang làm. FR-06 kiểm thử theo từng ô của ma trận nên ô này sẽ không có kết quả mong đợi | Chọn một: (a) thêm Staff vào FR-37 và định nghĩa "đang làm"; hoặc (b) sửa ô thành "Lượt gửi của bãi (FR-16)" và bỏ chữ "giao dịch" |
| R09-07 | TB | FR-20 | Tiêu chí "chỗ trống + chỗ đã dùng = sức chứa" sai khi có đặt chỗ, vì chỗ đang giữ không thuộc nhóm nào | Tách 3 số: đang dùng, đang giữ, trống. Tiêu chí: tổng 3 số = sức chứa |
| R09-08 | TB | FR-38 | "Số chỗ đang dùng trung bình trong giờ" chưa có cách tính, ví dụ trung bình có trọng số theo thời gian hay lấy mẫu mỗi phút. Hai cách cho kết quả khác nhau nên tiêu chí "khớp phép tính tay" không kiểm được. Cũng chưa rõ chỗ đang giữ có được tính là đang dùng không | Ghi công thức cụ thể. Đề xuất: tổng số phút-xe trong giờ / 60 / sức chứa × 100%, chỉ tính lượt đang mở, không tính đặt chỗ. Thêm 1 ví dụ số |
| R09-09 | TB | FR-41 | Mẫu số (tổng đặt chỗ − đã hủy) vẫn gồm các đặt chỗ đang hiệu lực, nên tỷ lệ bị kéo xuống trong ngày. Thầy ghi "chỉ tính các lượt đã hết thời gian chờ". Chưa xử lý trường hợp mẫu số bằng 0 | Mẫu số = số đặt chỗ đã kết thúc (Đã đến + Không đến). Khi mẫu số bằng 0 thì hiển thị "—". Cập nhật ví dụ 20 đặt chỗ trong tiêu chí |
| R09-10 | TB | FR-35 (Should) ↔ FR-47, FR-48 (Must) | Xử lý EX-02 và EX-03 (Must) đang dựa vào FR-35 và FR-34 (Should). Nếu áp dụng thứ tự lùi Q22 và bỏ thanh toán, hai ngoại lệ bắt buộc mất phần "chặn thanh toán" và "phí thông thường" | Viết FR-47 theo hướng "không tự đóng lượt" độc lập với thanh toán; phần chặn thanh toán ghi "nếu có FR-35". FR-48 cũng làm tương tự với phần phí |
| R09-11 | TB | Toàn tài liệu ↔ sản phẩm khác | Số lượng và mã yêu cầu đã đổi: PD-P02 và M2 2.6.1 ghi 36 FR / 11 NFR, giờ là 52 / 13. M2 2.12.1 ghi "FR-20 đến FR-29" cho P06, P10, P11 và "phí đúng 6 tổ hợp" (FR-34 hiện có 12, sẽ về 6 khi sửa R09-20). A-43 (SC-07, tiêu chí 2, 6) dùng FR-15, FR-34 theo mã cũ, và ngưỡng "≤ 2 s" khác NFR-04 (3 s) | Thêm vào SRS bảng ánh xạ mã cũ → mã mới. Không sửa Baseline V1.0; ghi chênh lệch vào A-103 và nhật ký tuần. RES-05 tự sửa A-43 (mục 5) |
| R09-12 | TB | Trang bìa | Trang bìa ghi reviewer là Tech lead và QA (Đào Xuân Sơn). PD-P02, M2 2.2.1 và CP-01 ghi reviewer là Nguyễn Tuấn Thành và Nguyễn Võ Đức Sơn. Đào Xuân Sơn là đồng tác giả (BA) nên không tính là reviewer độc lập cho tiêu chí 7 | Sửa trang bìa theo PD-P02 |
| R09-13 | Thấp | Mục 5, mục 6 | Câu dẫn mục 5 còn ghi "chờ xác nhận ở Q27". Mục 6 ghi nguồn "Phí phạt" là AS13 dù thầy đã xác nhận ở Q27 | Sửa thành "đã xác nhận ở Q27"; nguồn ghi Q27 |
| R09-14 | Thấp | Mục 1.5; NFR-09, NFR-10 | Mã nguồn D1, D2 chưa được định nghĩa trong quy ước nguồn | Thêm "D = quyết định thiết kế (D-01..D-41)" vào 1.5, thống nhất cách viết D-01 |
| R09-15 | Thấp | Bảng 1.2 | Chưa có FR-04, FR-05, FR-08 (Nền tảng), FR-16 (Xe vào/ra), FR-46..FR-50 (ngoại lệ), NFR-12 (quy mô thí điểm) | Bổ sung vào các dòng tương ứng để bảng phủ đủ 65 yêu cầu |
| R09-16 | Thấp | Bảng 2.3 ↔ FR-52, FR-51 | Bảng hiển thị biển số chỉ quy định cho lượt gửi. FR-52 cho Staff xem biển số của **đặt chỗ**, nhưng chưa rõ đầy đủ hay đã che. Staff cần biển đầy đủ để đối chiếu xe đến sớm | Thêm dòng vào 2.3: "Staff – đặt chỗ đang hiệu lực của bãi: đầy đủ" |
| R09-17 | Thấp | FR-45 ↔ FR-43 | Nhật ký "xem biển số đầy đủ" lưu đối tượng (có thể chứa biển số) nhưng không bị xóa sau 12 tháng | Ghi rõ nhật ký lưu mã lượt gửi thay vì biển số, hoặc đưa nhật ký vào phạm vi FR-45 |
| R09-18 | Thấp | FR-27, FR-29 | Chưa từ chối giờ hẹn đã qua. Chưa rõ có được hủy trong khoảng từ giờ hẹn tới +30 phút không | Thêm vào tiêu chí FR-27. FR-29 ghi rõ "trước giờ hẹn" hay "trước khi hết thời gian chờ" |

Ghi nhận thêm, không phải lỗi: FR-08 cho Customer tự đổi nhóm người dùng, nên có thể tự chuyển sang nhóm giá thấp hơn. Cách này đúng với AS18 và Q30 (thầy đồng ý). Nên ghi rủi ro này vào R-G4 hoặc hỏi thầy khi gửi AS24–AS27.

## 4. Đề xuất (không bắt buộc cho CP-01) – mục 3.10 Bộ mô phỏng (R09-01)

Chỉ áp dụng nếu nhóm chọn phương án (a) ở R09-01. Chủ sở hữu SRS quyết định nội dung cuối. Các FR dưới đây bám PD-P04 và các kịch bản SC-01..SC-07 ở A-43.

| ID | Mô tả | Ưu tiên | Nguồn | O | Tiêu chí chấp nhận |
|---|---|---|---|---|---|
| FR-53 | Hệ thống phải có bộ mô phỏng sinh sự kiện vào/ra cho xe máy và ô tô theo 3 phương thức QR, RFID và biển số, gửi qua cùng API vào/ra với thiết bị thật. | Must | Q06, AS1 | O2 | Mỗi tổ hợp loại xe × phương thức tạo được lượt vào và lượt ra hợp lệ; log server cho thấy sự kiện đi qua API vào/ra |
| FR-54 | Hệ thống phải cho phép Manager chạy kịch bản mô phỏng tới khi đủ số lượt gửi đã đóng được chọn (mặc định 100), với seed để chạy lại cho cùng kết quả. | Must | Q28, AS28 | O1, O2 | Chạy với N = 100: có ≥ 100 lượt đã đóng. Chạy lại cùng seed trên CSDL vừa reset: cùng chuỗi sự kiện và cùng số chỗ trống cuối |
| FR-55 | Hệ thống phải cho phép Manager kích hoạt riêng từng ngoại lệ EX-01 đến EX-05 từ bộ mô phỏng. | Must | Q21, Q27, AS13 | O4, O5 | Mỗi nút EX tạo đúng tình huống ở mục 5 và hệ thống phản hồi theo FR tương ứng (8.2) |
| FR-56 | Hệ thống phải cho phép đưa dữ liệu mô phỏng về trạng thái ban đầu của bãi thí điểm mà không sửa CSDL bằng tay. | Should | AS14, PD-P21 tiêu chí 5 | O5 | Sau thao tác reset, sức chứa và chỗ trống về đúng 300 xe máy / 30 ô tô; không còn lượt đang mở |

Khi thêm 4 FR này: cập nhật 8.1 (O1 +1, O2 +2, O4 +1, O5 +2), 8.3 (FR 56 = 35 Must, 17 Should, 4 Could) và bảng 1.2 (thêm dòng "Bộ mô phỏng thiết bị (thay phần cứng, M1 1.4.2)").

## 5. Ảnh hưởng tới sản phẩm và hoạt động khác

| Sản phẩm / hoạt động | Ảnh hưởng | Người làm |
|---|---|---|
| A-43 review bộ mô phỏng (của RES-05) | Đổi SC-07 "≤ 2 s" thành "≤ 3 s" (NFR-04). Đổi mã FR-11, FR-15, FR-34 theo mã mới. Thêm FR-53..FR-55 vào cột Truy vết nếu được duyệt | RES-05 |
| P18 / CP-02 (A-22, A-23) | R09-03: hợp đồng API vào/ra cần trạng thái "chờ Staff xác nhận" cho xe đến sớm. R09-02: kiểm tra chỗ trống phải xét đặt chỗ của chính xe đó | RES-01 |
| P03 / CP-03 | R09-07: cần tách được số chỗ "đang giữ". R09-17: nhật ký lưu mã lượt thay cho biển số | RES-03 |
| P21 (A-82, A-83) | AT-05 thêm ca chỗ trống = 0 nhưng xe đã đặt vẫn vào được. AT-07 dùng công thức FR-38 và FR-41 đã sửa. Chờ CP-01 theo baseline | RES-02, RES-04 |
| A-103, nhật ký tuần | Ghi chênh lệch: A-09 chạy 16/11 (baseline W12); SRS tăng từ 36 lên 52–56 FR so với căn cứ ước lượng ở M2 2.6.1 | RES-03 |
| Email thầy | Gửi AS24, AS25, AS27 và AS29 mới (R09-05) cùng lúc, để khép Q28. AS26 bỏ theo R09-20 | RES-01 |
| Mã nguồn MVP (P08, P10) | Nếu MVP đã có trường giờ hoạt động hoặc tính phí theo giờ thì đưa vào danh sách KB ở CP-02 để quyết định gỡ hay mở CR | RES-01, RES-04 |

## 6. Danh sách kiểm lại (sau khi sửa, hạn 18/11)

- [ ] R09-19, R09-20: không còn giờ hoạt động và tính phí theo giờ; mục 6 có đủ 10 dòng loại trừ của M1 1.4.2; bảng 1.2 chép đúng M1 1.4.1
- [ ] R09-01: đã chọn phương án (a) hoặc (b)
- [ ] R09-02, R09-03, R09-04, R09-05: đọc lại FR-09, FR-18, FR-31, FR-32, FR-46, FR-51 cùng nhau, không còn mâu thuẫn
- [ ] R09-06..R09-10: tiêu chí chấp nhận của FR-20, FR-37, FR-38, FR-41, FR-47, FR-48 tính tay ra được một kết quả
- [ ] R09-11: có bảng ánh xạ mã cũ → mã mới
- [ ] R09-12: trang bìa đúng reviewer
- [ ] Đếm lại 8.1 và 8.3 bằng script hoặc đếm tay
- [ ] RES-01 duyệt; tiêu chí 7 đạt; chuyển A-10 chốt v1.0

| Vai trò | Họ tên | Kết luận | Ngày |
|---|---|---|---|
| Reviewer | Nguyễn Tuấn Thành (RES-05) | Chưa đạt lần 1 – sửa theo mục 3 | 16/11/2026 |
| Reviewer / người duyệt | Nguyễn Võ Đức Sơn (RES-01) | | |
| Chủ sở hữu | Phạm Duy Quý (RES-04) | Đã nhận | |
