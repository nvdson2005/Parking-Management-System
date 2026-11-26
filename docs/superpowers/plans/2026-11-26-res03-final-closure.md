# Kế hoạch RES-03: đóng M3/M4 (26/11 – 28/11/2026)

| Trường | Nội dung |
|---|---|
| Người làm | Nguyễn Phạm Mạnh Dũng (RES-03) |
| Căn cứ | `docs/m3-m4-final-work-division.md` (F3-01..F3-05), PR #12, các việc PR #19 giao cho RES-03 |
| Hạn | 28/11: mọi phần đã merge, đóng băng báo cáo. 29/11: nộp bài |
| Tổng | F3 khoảng 8 h, cộng phần còn lại của PR #12 khoảng 2,5 h |

## 1. Đã xác nhận xong, không làm lại

PR #19 vẫn giao 5 lỗi code cho RES-03. Cả 5 đều đã có trên `main` (kiểm tra ngày 26/11):

| Phát hiện trong PR #19 | Nơi đã sửa |
|---|---|
| `maskPlate` để lộ biển số ngắn | `src/lib/plate.ts` (`maskPlate`, luôn che, chừa tối đa 3 ký tự cuối) |
| `confirmExit` trả biển số đầy đủ cho Staff | `src/app/api/events/exit/confirm/route.ts` (`presentPlate`) |
| Purge sửa nhầm ghi chú không phải EX-02 | `src/server/services/purge.ts` (lọc theo `PLATE_MISMATCH_EVENT`) |
| FR-002 tính thời hạn lưu từ lúc xe vào | `specs/002-a28-auth-log-purge/spec.md` (tính từ lúc xe ra, Q44) |
| `setUserGroup` duyệt khi chưa có yêu cầu | `src/server/services/accounts.ts` (PR #21) |

Việc cần làm: nhắn RES-01 đánh dấu các mục này là đã xong trong PR #19.

## 2. Quy tắc ghi giờ thực tế

Không ai ghi giờ hằng ngày (A-100), nên mọi số đều **ước tính tái dựng** từ commit, tài liệu và số các thành viên tự khai. Quy tắc:

1. **Tổng tuần.** Nếu thành viên đã tự khai thì lấy số tự khai: RES-01 lấy từ `a-90-planned-vs-actual.md` (PR #19), RES-04 từ `docs/final/res04/a114-reflection.md` (PR #25), RES-05 từ các dòng "Effort RES-05" trong `docs/m3/`. Nếu chưa khai thì lấy năng lực: W12 8 h, W13 10 h, W14 12 h. Riêng W14 có thể cộng thêm phần làm cuối tuần 28–29/11, vì RES-01 đã ghi cả nhóm cam kết làm thêm (`weekly-log-draft.md`). Nếu bằng chứng cho thấy khối lượng vượt năng lực (RES-03 ở W14: 16,25 h tính đến 26/11) thì ghi đúng phần vượt và giải thích bằng R-G4-02, không cắt cho vừa.
2. **Chia theo hoạt động.** Giờ của từng hoạt động phải có commit, file hoặc biên bản làm bằng chứng. Nếu có hỗ trợ AI thì ghi giờ người bỏ ra, không ghi khối lượng code AI viết. Tổng các hoạt động không vượt tổng tuần. Phần còn lại ghi vào "họp, đọc tài liệu, phối hợp".
3. **RES-02.** Không có tài khoản git, nhưng có làm review (CP-03 ở P03 v0.5, quyết định CP-05 ở PR #18). Ghi các review đó theo E của baseline và đánh dấu "RES-02 xác nhận".
4. **Nhãn.** Mỗi bảng ghi "ước tính, chưa đo". Lý do: workbook và báo cáo phải khớp với điều nhóm nói ở buổi bảo vệ (viva).
5. **Lệch > ±20%** so với V1.0 phải có giải thích (Task 3.3).

## 3. Các bước

| # | Ngày | Việc | Output | h | Phụ thuộc |
|---|---|---|---|---:|---|
| B0 ✅ | 26/11 | Merge `main` vào nhánh PR #12 (đã xong ở máy, chưa push) | nhánh `docs/res03-m3-closure` | 0,1 | — |
| B1 ✅ | 26/11 | Ghi giờ theo mục 2 vào tracker: thêm các dòng W14 đến 26/11, điền tổng cho cả 5 người, bỏ các `TODO` | `docs/m3/actuals.md` | 1,0 | B0 |
| B2 ✅ | 26/11 | **F3-01** rà soát rủi ro lần cuối: trạng thái từng rủi ro, các rủi ro đã xảy ra (R-G4-02, R-G5-04, R-M3-01), ảnh hưởng tới lịch, chi phí, phạm vi, cùng mức đánh giá lại | `docs/final/res03/risk-register-final.md` | 2,0 | — |
| B3 ✅ | 26/11 | **F3-03** kế hoạch cấp thấp (Task 3.8): với A-97..A-117, giải thích vì sao lúc lập baseline chưa thể chi tiết | `docs/final/res03/lower-level-plans.md` | 1,0 | — |
| B4 | 27/11 | **F3-02** chốt V2.0: sinh lại sau CR-04 (phạm vi P03), CR-03 (RES-04, phương án 2) và quyết định giữ A-72/A-76 (Q22 không kích hoạt); dự báo lại phần việc còn lại và đề xuất cách bù; kiểm tra V1.0 không bị sửa; xử lý P18 `v0.1` theo `baseline-v1.0-freeze.md` | `plan-v2.0.mjs`, `generated-v2/`, `baseline-v2.0.md` | 1,5 | F1-02 (nếu chưa có thì dẫn PR #19 và ghi "pending") |
| B5 | 27/11 | Mục A-89: điền kết quả demo A-88 từ RES-01 và kết quả A-87 từ RES-02 | `docs/m3/a-89-acceptance-section.md` | 0,5 | demo 27/11 |
| B6 | 27/11 | Hoàn thiện A-114 (bỏ ẩn phần reflection), cập nhật A-112 | `a-114-reflection-draft-res03.md`, `a-112-closure-plan.md` | 0,5 | — |
| B7 | 27/11 | `review-implementation` cho PR #12 trong subagent độc lập; **xin phép rồi mới push**, chuyển PR khỏi draft | PR #12 | 0,3 | B1, B5, B6 |
| B8 | 27–28/11 | **F3-04** so sánh kế hoạch và thực tế theo 7 chiều (effort, thời gian, lịch, chi phí, phạm vi, chất lượng, rủi ro), các sai lệch ước lượng lớn (MVP 1 ngày so với 123,3 h; CR-01; CR-03; CR-04) và quyết định đã đưa ra | `docs/final/res03/performance-comparison.md` | 2,5 | B1; PR #12 merge (trước đó ghi "pending #12") |
| B9 | 28/11 | **F3-05** dán vào workbook (chỉ mình RES-03 sửa file) các dòng do từng người viết sẵn: Risk Register, Change Log, Planned vs Actual, Task Log, Quality Evidence | `resources/CO3011_Project_Tracking_Workbook (1).xlsx` | 1,0 | các phần còn lại đã merge |

## 4. Cách chia PR

- **PR #12** (đã có): B1, B5, B6. Merge trước, vì F3-04 dựa vào nó.
- **PR mới `docs/res03-final`**: B2, B3, B4, B8. Mỗi task một commit, ghi A-ID: F3-01 (A-102), F3-03 (Task 3.8), F3-02 (A-106), F3-04 (A-90, A-92).
- B9 là file nhị phân: commit riêng ngày 28/11, sau khi các PR khác đã merge.
- Không push, không sửa PR khi chưa được RES-03 đồng ý.

## 5. Rủi ro của kế hoạch này

| Rủi ro | Ứng phó |
|---|---|
| F1-02 (quyết định M-03) chưa có trước 27/11 | B4 dùng quyết định đã ghi trong PR #19 (24/11) và ghi rõ "pending F1-02" |
| PR #12 merge muộn, chặn F3-04 | Viết F3-04 song song, dẫn PR #12 và ghi "pending #12" (quy tắc 4) |
| Các thành viên không gửi số giờ | Dùng mục 2 (số tự khai hoặc năng lực), ghi "ước tính", để B9 không bị chặn |
