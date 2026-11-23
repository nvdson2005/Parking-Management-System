# A-112 Kế hoạch đóng dự án và bàn giao (mục của A-92; Task 4.4)

| Trường | Nội dung |
|---|---|
| Người viết | Nguyễn Phạm Mạnh Dũng (RES-03) |
| Ngày | 23/11/2026 (bản nháp; hoàn thiện sau A-88 ngày 27/11) |
| Dùng cho | Một mục của báo cáo cuối A-92 (phương án C: A-112 viết như một mục, không thành báo cáo riêng) |
| Mốc liên quan | M-04 nghiệm thu 27/11; M-05 nộp bài 29/11 |

## 1. Nghiệm thu và bàn giao

| Bước | Nội dung | Người làm | Hạn | Bằng chứng |
|---|---|---|---|---|
| 1 | Chạy thử nghiệm thu nội bộ A-87 (CP-07): 100% AT Must đạt | RES-02, RES-04 | 26-27/11 | Quality Evidence, biên bản CP-07 |
| 2 | Trình diễn với khách hàng A-88 (CP-08), theo kịch bản trong `docs/P13-huong-dan-cai-dat-va-demo.md` | RES-01, RES-05 | 27/11 | Video demo, email khách hàng xác nhận (Q11, Q23) |
| 3 | Ghi kết quả nghiệm thu A-89 (mục `a-89-acceptance-section.md`) | RES-03, RES-04 | 28/11 | P14 |
| 4 | Gắn tag phiên bản bàn giao trên commit `main` đã nghiệm thu (đề xuất `v1.0-delivery`), cùng với tag `baseline-v1.0` | RES-01 | 28/11 | `git tag` trên remote |
| 5 | Nộp gói bài A-116: PDF báo cáo, link repo, hướng dẫn chạy (P13), Baseline V1.0 + V2.0, weekly log | RES-04 | 29/11 | Biên nhận LMS |

**Sản phẩm bàn giao:**

| Sản phẩm | Vị trí | Trạng thái lúc lập |
|---|---|---|
| Phần mềm (P05-P11) | Repo GitHub, nhánh `main` | Đủ phạm vi V1.0; PR #11 (Q34, Q35) chờ merge |
| P13 Hướng dẫn cài đặt và demo | `docs/P13-huong-dan-cai-dat-va-demo.md`, README | v1.0; chờ người không phải tác giả chạy thử |
| P14 Kết quả nghiệm thu | Báo cáo A-92, mục A-89 | Chờ A-87, A-88 |
| P12 Hướng dẫn sử dụng | — | **Hoãn** theo baseline; P13 thay thế phần thao tác |
| P02 SRS, P03 CSDL, P18 kiến trúc và API | `docs/m2-report/products/`, `docs/m2-report/v2.0/products/` | P03 v0.6 (chờ CP-03 và PR #11, PR #17 merge); P18 v1.0/v1.1 (CP-02 đạt có điều kiện, RES-03); SRS v2.0, v2.1 theo vòng 5 (RES-04, PR #16) |
| Baseline V1.0, V2.0 | Tag `baseline-v1.0`; `docs/m2-report/generated/`, `generated-v2/` | V2.0 chờ RES-01 duyệt (PR #10) |
| Sổ rủi ro, Change Log, Quality Evidence, Task Log | `docs/m3/`; workbook trên Drive (bản chính) | Cần đối chiếu repo với Drive trước khi nộp (R-M3-05) |

## 2. Vấn đề còn mở khi bàn giao

| # | Vấn đề | Ảnh hưởng | Xử lý đề xuất | Nguồn |
|---|---|---|---|---|
| 1 | Yêu cầu chỉ có trong SRS v0.2 bị hoãn, khách hàng đã xác nhận ở vòng 5 (23/11): bảng giá theo bãi và theo giờ (G-02; Q36 chỉ tính theo lượt), mục giá trên giao dịch (G-03), hết phiên sau 30 phút (FR-03; Q39 không bắt buộc). G-04, G-06 ban đầu hoãn, đã làm ngày 23/11 sau review CP-03 (PR #11); G-01 giờ hoạt động ban đầu hoãn, đã làm ngày 24/11 theo Q37 (PR #17) | Không có trong demo | Ghi "Hoãn, khách hàng xác nhận" trong bảng phạm vi A-110; là đầu vào cho giai đoạn sau | CR-03, P03 v0.6 §11.1 |
| 2 | KB-16: đăng xuất không thu hồi token; middleware không kiểm tra tài khoản bị khóa | Token cũ qua được middleware nhưng không lấy được dữ liệu (`requireRole` chặn) | Chấp nhận; giai đoạn sau dùng phiên ngắn hơn và danh sách thu hồi | P18 §10, CR-03 |
| 3 | Chỉ chạy đúng trong một tiến trình: khóa, event bus, bộ hẹn giờ xóa tự động (VM-04) | Không mở rộng sang nhiều tiến trình hoặc nhiều máy | Ghi là ràng buộc triển khai; khi mở rộng thì chuyển sang khóa và lịch chạy ở CSDL | P18 VM-04, P03 §4 |
| 4 | 4 test bộ mô phỏng vượt giới hạn 5 giây mặc định của vitest (cả trên `main`) | `npm test` báo lỗi trên máy chậm | RES-05 tăng timeout cho các test này (A-44) | PR #11 |
| 5 | P18 v1.0 bị sửa đè lên file thuộc Baseline V1.0 | Lệnh kiểm tra đóng băng không còn rỗng | RES-01 khôi phục file V1.0, tách bản v1.0 | `baseline-v1.0-freeze.md` |
| 6 | Ngưỡng nghiệm thu gửi kèm Q28 chưa được khách hàng xác nhận | P21, CP-08 dựa trên ngưỡng nhóm đề xuất | Ghi kết quả của A-88 | R-M3-06 |
| 7 | Giờ thực tế của thành viên chưa đo (A-100); `actuals.md` đang là ước tính | Ảnh hưởng độ tin cậy của so sánh kế hoạch và thực tế (Task 4.2) | Từng thành viên sửa trước 25/11 | `actuals.md` |
| 8 | `.env.example` có sẵn một giá trị `AUTH_SECRET` | Nếu triển khai thật mà giữ nguyên thì ai cũng ký được phiên đăng nhập | Khi bàn giao để triển khai: tạo `AUTH_SECRET` mới (ví dụ `openssl rand -base64 48`) và không dùng giá trị mẫu | `.env.example` |

## 3. Tài liệu và tri thức

- **Mã nguồn**: README (lệnh, tài khoản, API), AGENTS.md và CLAUDE.md (quy tắc làm việc, kiến trúc), `specs/` (spec, plan, tasks cho từng đợt sửa: 001 KB fixes, 002 A-28, 003 A-65).
- **Quản lý dự án**: báo cáo M2 (Baseline V1.0), `docs/m3/` (sổ rủi ro, quyết định CR-01, CR-02, CR-03, V2.0, actuals, Quality Evidence, weekly log).
- **Sử dụng AI**: nhóm dùng Claude Code và Codex để hỗ trợ viết code và tài liệu. Ghi vào sheet AI Usage Log của workbook trước khi nộp. Mỗi thành viên phải giải thích được phần mình phụ trách khi vấn đáp.

## 4. Giải phóng nguồn lực

| Nguồn lực | Hành động | Người làm | Hạn |
|---|---|---|---|
| 5 thành viên (RES-01 đến RES-05) | Kết thúc phân công sau khi nộp bài 29/11; ghi giờ cuối cùng vào Task Log | Từng người | 29/11 |
| Repo GitHub | Đóng hoặc merge các PR còn mở, xóa nhánh đã merge, giữ tag `baseline-v1.0` và tag bàn giao | RES-01 | 29/11 |
| Workbook và thư mục Drive | Khóa chỉnh sửa sau khi nộp; giữ bản xuất kèm bài nộp | RES-04 | 29/11 |
| CSDL trên máy (`dev.db`, `test.db`) | Không chứa dữ liệu thật (toàn bộ là dữ liệu mô phỏng, NFR-03); có thể xóa | Từng người | sau 29/11 |
| Công cụ trên máy (CodeGraph, khóa AI) | Gỡ hoặc giữ tùy cá nhân; không có tài khoản dùng chung cần thu hồi | Từng người | sau 29/11 |

## 5. Rà soát sau dự án

- **Họp tổng kết A-91**, 30 phút cuối buổi họp W14 (phương án C): 5 phút điểm lại mốc thời gian, 10 phút những gì giữ hoặc đổi, 10 phút cải tiến và người phụ trách, 5 phút chốt ghi chép cho mục bài học (A-113, RES-04).
- **Đầu vào đề xuất cho bài học**:
  - Sai lệch ước lượng lớn nhất: kế hoạch tự xây dựng v0.2 cần 178,7 giờ, còn MVP có công cụ AI hỗ trợ xong trong 1 ngày. Baseline phải lập lại quanh việc kiểm chứng (`actuals.md` §2).
  - Không ghi giờ thật từ đầu (A-100), nên Task 3.3 phải dựa vào ước tính.
  - Cổng CP-02 bị trễ khiến code phải làm song song với việc ghi biên bản (ISS-M3-01).
  - Câu trả lời vòng 3 đến sau khi đã có MVP, nên phải xử lý bằng CR (CR-02, CR-03).
- **Sau khi chấm**: ghi nhận xét của giảng viên vào bài học, nếu nhóm còn làm tiếp.
