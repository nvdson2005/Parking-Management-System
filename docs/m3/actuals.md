# Theo dõi kế hoạch so với thực tế (A-101, A-103; Task 3.3)

| Trường | Nội dung |
|---|---|
| Hoạt động | A-101 ghi bù effort thực tế C-01 đến C-13 (ISS-04); A-103 theo dõi kế hoạch so với thực tế |
| Người lập | Nguyễn Phạm Mạnh Dũng (RES-03) |
| Cập nhật | 23/11/2026 (đầu W14) |
| Kế hoạch gốc | Baseline V1.0 (`docs/m2-report/generated/schedule.json`, `estimates.md`); cột V2.0 lấy từ `docs/m2-report/data/plan-v2.0.mjs` (PR #10, chưa duyệt) |
| Dùng cho | A-90 (RES-01) và báo cáo cuối A-92 |
| Trạng thái | **Số ước tính.** Chưa thành viên nào ghi giờ thật (A-100). Mỗi thành viên xem dòng của mình và sửa trước 25/11 |

## 1. Cách tính

1. **Giờ người, không phải thời gian chạy công cụ.** Mọi con số là số giờ một thành viên cần để làm và tự kiểm tra phần việc đó. Nhiều commit cách nhau vài phút vì có công cụ AI hỗ trợ viết code và tài liệu. Khoảng cách giữa các commit **không** được dùng làm số giờ.
2. **Tổng mỗi tuần lấy bằng năng lực**, giống weekly log (`weekly-log-draft.md`): 8 giờ mỗi người ở W12, 10 giờ ở W13, 12 giờ ở W14 (10 + 2 theo phương án C). Đây là **giả định**, không phải số đo.
3. **Giờ theo hoạt động** chỉ ghi khi có bằng chứng (commit, tài liệu, file trên Drive được nhắc trong repo). Phần còn lại của tuần ghi là **chưa phân bổ**, không gán cho hoạt động nào.
4. **RES-01** dùng số Đức Sơn đã tự ước tính trong `a-90-planned-vs-actual.md`.
5. **Các thành viên khác**: lấy E (PERT) trong baseline làm mốc, rồi chỉnh theo khối lượng thấy được (có vòng review, làm lại, phạm vi tăng hoặc giảm). Cột "Căn cứ" ghi rõ cách chỉnh.
6. **Lệch** = (thực tế − kế hoạch V1.0) / kế hoạch V1.0. Các dòng lệch quá **±20%** có giải thích (Task 3.3).

## 2. A-101: effort thực tế của công việc trước baseline (C-01 đến C-13)

C-03 đến C-13 là MVP. Toàn bộ commit là của RES-01 trong ngày 08/11 (`46472f9` đến `eebe8a3`), có công cụ AI hỗ trợ. Theo yêu cầu của nhóm, cột "giờ người tương đương" ghi số giờ nếu làm thủ công. Số này lấy từ kế hoạch tự xây dựng từ đầu v0.2 (`data/archive/plan-build-v0.2.mjs`), hoặc ước tính tương tự khi v0.2 không có hạng mục đó. **Đây không phải số giờ RES-01 thật sự đã bỏ ra.** RES-01 cần xác nhận cách ghi này trước khi đưa vào báo cáo.

| C-ID | Công việc | Người làm (git) | Thời gian | Giờ người tương đương | Căn cứ |
|---|---|---|---|---:|---|
| C-01 | Báo cáo M1 và Client Interaction Log vòng 1-2 | Cả nhóm | W4-W11 | `TODO(cả nhóm)` | Tài liệu trên Drive, không có commit; không ước tính được từ repo |
| C-02 | Bản nháp PD và kế hoạch M2 | RES-01, RES-02 | W10-W11 | `TODO(RES-01, RES-02)` | Drafts M2 trên Drive |
| C-03 | Đặc tả thiết kế MVP (D-01 đến D-41), câu hỏi vòng 3 | RES-01 | 08/11 | 9,5 | v0.2 A-20 (5,42) + phần RES-01 của A-21, A-22 (≈ 4) |
| C-04 | Khung ứng dụng, mô hình dữ liệu, dữ liệu mẫu | RES-01 | 08/11 | 8,5 | v0.2 A-26 (5,42) + phần lược đồ của A-24 (≈ 3) |
| C-05 | Xác thực, RBAC, che biển số, nhật ký, giao diện song ngữ | RES-01 | 08/11 | 10,5 | v0.2 A-28 (6,0) + nửa A-30 (2,5) + khung song ngữ (≈ 2) |
| C-06 | Hiển thị chỗ trống qua SSE | RES-01 | 08/11 | 7,0 | v0.2 A-48 |
| C-07 | Quản lý xe, xe vào/ra, 5 ngoại lệ | RES-01 | 08/11 | 20,5 | v0.2 A-66 + A-63 + A-65 (18,67) + quản lý xe (≈ 2) |
| C-08 | Đặt chỗ, lịch sử, thanh toán mô phỏng | RES-01 | 08/11 | 12,0 | Không có trong v0.2 (lúc đó hoãn); ước tính tương tự A-63 (≈ 8) + thanh toán và lịch sử (≈ 4) |
| C-09 | Bãi, khu vực, sức chứa, bảng giá, tài khoản, xóa dữ liệu | RES-01 | 08/11 | 10,3 | v0.2 A-60 (7,92) + nửa A-30 (2,42) |
| C-10 | Báo cáo 4 chỉ số | RES-01 | 08/11 | 5,0 | Không có trong v0.2; ước tính 4 truy vấn và 1 màn hình |
| C-11 | Bộ mô phỏng và dữ liệu thí điểm | RES-01 | 08/11 | 14,9 | v0.2 A-40 + A-42 + A-43 (12,67) + A-47 (2,25) |
| C-12 | 21 file kiểm thử tự động, hướng dẫn E2E thủ công | RES-01 | 08/11 | 10,0 | Ước tính 0,4 giờ mỗi file × 21 + hướng dẫn 1,5 giờ |
| C-13 | Bản nháp P02, P03, P18, P20 | RES-01 | 08/11 | 15,0 | Nửa v0.2 A-01 (6,2) + P03 (≈ 3) + P18 (≈ 4) + nửa A-80 (1,9) |
| | **Tổng C-03 đến C-13** | | | **123,2** | |

**Nhận xét cho A-90 và A-92:** kế hoạch tự xây dựng v0.2 cần 178,7 giờ cho toàn dự án. Thực tế MVP chạy được chỉ sau một ngày nhờ công cụ AI. Vì vậy baseline V1.0 đổi trọng tâm sang kiểm chứng và sửa lỗi (131,15 giờ cơ sở). Đây là sai lệch ước lượng lớn nhất của dự án, nên ghi vào bài học kinh nghiệm (A-113).

## 3. A-103: hoạt động W12 đến W14 so với Baseline V1.0

"Thực tế" là giờ người ước tính theo mục 1. **In đậm** là các dòng lệch quá ±20%.

| A-ID | Hoạt động | Phụ trách | KH V1.0 bắt đầu-kết thúc | KH V1.0 E (giờ) | TT bắt đầu | TT kết thúc | TT effort (giờ) | Lệch | Bằng chứng | Giải thích |
|---|---|---|---|---:|---|---|---:|---:|---|---|
| A-01 | SRS v1.0 | RES-04, RES-02 | 09-10/11 | 4,33 | — | chưa (v0.2 ngày 15/11; v2.0 ngày 22/11) | 4,5 | +4% | P03 v0.3 dẫn "SRS v0.2 (15/11)"; `07cea70` (`docs/A-70-srs-p18-sync`) có `CO3011_M3_SRS_v2.0.md` | Trễ: chờ câu trả lời vòng 3 (15/11) |
| A-09 | Review SRS (CP-01) | RES-04, RES-05, RES-01 | 10-13/11 | 3,0 | — | chưa | 0 | — | Không có biên bản | Chờ |
| A-16 | Câu hỏi vòng 3 | RES-01 | W12-W13 | 2,0 | — | 15/11 | 0,5 | **−75%** | `client-round3-questions.md` | Câu hỏi đã soạn sẵn trong C-03; chỉ còn gửi và ghi log |
| A-22 | P18 v1.0, quyết định KB | RES-01 | 09-12/11 | 4,33 | 09/11 | 19/11 | 4,5 | +4% | `3d911b6` | Trễ 7 ngày: chờ quyết định KB-02, KB-03 và ưu tiên thay đổi vòng 3 |
| A-23 | Review P18 (CP-02) | RES-02, RES-03 | 13-16/11 | 2,0 | — | chưa | 0 | — | Chưa có biên bản (ISS-M3-01) | Chờ |
| A-24 | Thiết kế CSDL v1.0 | RES-03 | 12-13/11 | 2,25 | 17/11 | 22/11 (v0.4; v1.0 chờ CP-03) | 4,0 | **+78%** | P03 v0.3 (17/11, Drive), v0.4 `1b0c77c` | SRS v0.2 đánh số lại FR và vòng 3 thêm quy tắc, nên phải làm 2 bản (v0.3, v0.4) và thêm mục chốt phạm vi 11.1 |
| A-27 | Review CSDL (CP-03) | RES-02, RES-03 | 13/11 | 1,5 | — | chưa | 0 | — | — | Chờ RES-02 |
| A-28 | Sửa xác thực, nhật ký; xóa tự động | RES-03 | 18-20/11 | 3,17 (V2.0: 3,75) | 23/11 | 23/11 | 3,5 | +10% | `bc172ce`, `38c7e20`, `2992cb0` (PR #11) | Trễ 3 ngày: chờ chốt phạm vi CR-03; thêm G-05 (Q35), bỏ KB-16 |
| A-65 | Bổ sung API; Staff tra cứu | RES-03 | 23-25/11 | 4,33 (V2.0: 7,33) | 23/11 | 23/11 | 7,0 | **+62%** (V2.0: −5%) | `49299ac`, `5882e49`, `d64e95f` (PR #11) | CR-03 thêm G-08 (Q34) và G-07; so với V2.0 thì đúng kế hoạch |
| A-33 | Hướng dẫn cài đặt và demo | RES-03 | 20-23/11 | 2,0 | — | chưa | 0 | — | README đã bổ sung lệnh (`aaa8a8f`) | Trễ, làm trong W14 |
| A-43 | Rà soát bộ mô phỏng | RES-05 | 09-11/11 | 3,17 | 09/11 | 12/11 (cập nhật 16/11) | 3,5 | +10% | `f643391`, `e9fd5e7` | Cập nhật thêm cho vòng 3 |
| A-44 | Sửa bộ mô phỏng | RES-05 | 16-18/11 | 5,33 | 12/11 | 12/11 | 1,5 (RES-01) | **−72%** | `68ea467` | RES-01 làm thay; bộ mô phỏng của MVP đã có gần đủ, chỉ thêm chạy theo seed và chế độ ≥ 100 lượt. RES-05 xác nhận đóng |
| A-45 | Kiểm thử bộ mô phỏng (CP-04) | RES-05, RES-02 | 19-20/11 | 2,0 | 20/11 | 23/11 (sửa sau review) | 2,5 (RES-05) | **+25%** | `144b2a4`, `903e582`, `24f4063` | Làm lại sau review: tách CSDL chạy lại, xuất số chỗ trống, sinh lại bằng chứng |
| A-49 | Kiểm thử chỗ trống | RES-04 | 23-24/11 | 2,0 | — | chưa | 0 | — | — | Đang đến hạn |
| A-61 | Kiểm thử quản lý bãi | RES-01 | 13-23/11 | 1,5 | 20/11 | 20/11 | 1,5 | 0% | `0faa6cb`, `quality-evidence-A-61.md` | — |
| A-63 | Sửa luồng vào/ra | RES-01, RES-03 | 16-18/11 | 6,33 | 19/11 | 19/11 | 2,0 (RES-01) + 0 (RES-03) | **−68%** | `42b9d98`, `9e07e29` | KB-02, KB-03 được chấp nhận nên không sửa code; chỉ KB-04, KB-05, KB-13 cần code. RES-03 không tham gia (đang làm P03, sổ rủi ro) |
| A-67 | Tích hợp bộ mô phỏng | RES-01, RES-05 | 20/11 | 2,17 | 20/11 | 20/11 | 0,75 (RES-01) + `TODO(RES-05)` | — | `a-67-integration-check.md` | Chờ giờ của RES-05 |
| A-70 | Rà soát đặt chỗ | RES-04 | 16-18/11 | 3,17 | — | 22/11 (tài liệu) | 2,5 | **−21%** | `07cea70` (`docs/A-70-srs-p18-sync`, chưa merge) | Trễ 4 ngày. Phần code đặt chỗ đã đổi trong CR-02 (RES-01) nên chỉ còn đồng bộ SRS, P18 và mã lỗi KB-11, KB-20, KB-21 |
| A-74 | Rà soát thanh toán | RES-01 | 18-20/11 | 2,25 | 19/11 | 19/11 | 0,75 | **−67%** | Test trong `42b9d98`; P18 §10.3 | Chỉ rà soát và thêm test, không sửa code |
| A-77 | Kiểm thử báo cáo | RES-05 | 11-13/11 | 2,58 | 13/11 | 14/11 | 3,0 | +16% | `69fb9ae`, `a5cff02`, `docs/m3/A-77/` | Một vòng sửa sau review |
| A-79 | Test hợp đồng API vào/ra | RES-05 | 18-19/11 | 2,08 | 19/11 | 20/11 | 2,5 | +20% | `3c4c041`, `f3c0cc2` (PR #6) | Một vòng sửa sau review |
| A-82, A-83 | Kịch bản nghiệm thu | RES-02, RES-04 | 13-19/11 | 8,67 | — | chưa | 0 | — | Không có file trong repo | Chờ; A-85 (review, CP-06) phụ thuộc |
| A-96 | Chạy test tự động lần đầu | RES-02 | 10-11/11 | 2,17 | — | — | `TODO(RES-02)` | — | Bộ test chạy đạt 181/181 ngày 19/11 (RES-01) | RES-02 xác nhận đã chạy chưa |
| A-99 | Phân tích tác động thay đổi | RES-01 | W13-W14 | 3,0 | 19/11 | 19/11 | 1,0 | **−67%** (W13) | `3e7d822` | Còn phần W14 |
| A-94 | Weekly log | RES-01 | hằng tuần | 2,0 | 19/11 | — | 0,5 | — | `weekly-log-draft.md` | Bắt đầu trễ (không có log W12) |

### Hoạt động mới (lower-level plan, Task 3.8) và việc ngoài kế hoạch

| A-ID / việc | Phụ trách | KH (giờ) | TT effort (giờ) | Lệch | Bằng chứng | Giải thích |
|---|---|---:|---:|---:|---|---|
| A-102 Sổ rủi ro (W12-W13) | RES-03 | 1,0 (2 tuần × 0,5) | 2,0 | **+100%** | `risk-register.md` 17/11 và 22/11 | Lần đầu phải dựng sổ từ V1.0; thêm tác động CR-01 và đối chiếu Q27-Q35 |
| A-106 Baseline V2.0 | RES-03, RES-01 | 1,0 + 0,5 | 2,0 (RES-03) + 0,25 (RES-01) | **+100%** (RES-03) | `679946c`, `e43c2bf` | Kế hoạch không vừa năng lực (tải 116%), nên phải phân tích thêm và thử phương án giao lại việc |
| Ghi nhận đóng băng V1.0 | RES-03 | 0 | 0,75 | ngoài kế hoạch | `baseline-v1.0-freeze.md` | Cần cho Task 3.7 (giữ bản gốc để so sánh) |
| Chốt phạm vi CR-03 (ứng phó R-M3-01) | RES-03 | 0 (đề xuất 1,5) | 1,5 | ngoài kế hoạch | P03 v0.4 §11.1, `risk-register.md` §6 | Hoạt động ứng phó rủi ro mức Cao |
| A-101 + A-103 (tài liệu này) | RES-03 | 1,5 + 2,0 | 2,5 | **−29%** | file này | Gộp hai hoạt động thành một lần lập |
| Vòng 3 (CR-02) | RES-01 | 0 | 4,25 | ngoài kế hoạch | `34c9e49`..`360b6ba`, `beda3ad`..`30b5032` | Số của RES-01 |
| Cài CodeGraph | RES-03 | 0 | 0,25 | ngoài kế hoạch | `39fea67` | Quy định trong AGENTS.md |

## 4. Tổng theo thành viên và tuần

Năng lực: W12 8 giờ, W13 10 giờ, W14 12 giờ. "Có bằng chứng" là tổng giờ ở mục 2 và 3 trong tuần đó. "Chưa phân bổ" = năng lực − có bằng chứng, và chỉ là giả định (mục 1.2).

| Thành viên | W12 có bằng chứng / 8 | W13 có bằng chứng / 10 | W14 đến 23/11 có bằng chứng / 12 | Ghi chú |
|---|---:|---:|---:|---|
| RES-01 Nguyễn Võ Đức Sơn | 8,0 | 10,0 | `TODO` | Theo bảng tự ước tính của RES-01 |
| RES-02 Đào Xuân Sơn | 0 | 0 | 0 | Không có commit hay tài liệu trong repo. **Cần RES-02 tự ghi** (A-96, A-80, A-82, A-23, A-27) |
| RES-03 Nguyễn Phạm Mạnh Dũng | 8,0 **(giả định, xem dưới)** | 8,25 (A-24 4,0; A-102 2,0; đóng băng V1.0 0,75; CR-03 1,5) | 15,25 (A-106 2,0; A-28 3,5; A-65 7,0; A-101+A-103 2,5; CodeGraph 0,25) | W12 không có commit hay tài liệu; ghi bằng năng lực như weekly log. W14 đã **vượt** năng lực tuần (R-G4-02, R-G5-04) |
| RES-04 Phạm Duy Quý | ≈ 2,0 (A-01 một phần) | ≈ 5,0 (A-01, A-70) | 0 | Phân bổ A-01 theo tuần là ước tính |
| RES-05 Nguyễn Tuấn Thành | 3,5 (A-43) + 3,0 (A-77) = 6,5 | 2,5 (A-79) + 2,5 (A-45) = 5,0 | — | A-67 chưa có giờ |

**RES-03, W12 (09-15/11), 8 giờ giả định.** Repo không có bằng chứng cho tuần này. Tổng lấy bằng năng lực theo quy ước của nhóm (mục 1.2). Phân bổ theo các việc Baseline V1.0 giao cho RES-03 trong W12:

| Việc (giả định) | Giờ | Liên quan |
|---|---:|---|
| Đọc SRS và lược đồ MVP, chuẩn bị A-24 | 3,0 | A-24 (12-13/11) |
| Đọc P18 v0.2 để chuẩn bị review CP-02 | 2,0 | A-23 (13-16/11) |
| Đọc Baseline V1.0 và phân công M3/M4 | 1,5 | A-102, A-103 |
| Chuẩn bị sổ rủi ro từ bảng rủi ro V1.0 | 1,0 | A-102 |
| Họp tuần | 0,5 | A-97 |
| **Tổng** | **8,0** | |

Các giờ này **không** được cộng vào dòng hoạt động ở mục 3, vì không có bằng chứng.

## 5. Việc cần làm

- [ ] Từng thành viên sửa dòng của mình và thay số ước tính bằng số thật (A-100). Hạn 25/11, để RES-01 làm A-90.
- [ ] RES-01 xác nhận cách ghi "giờ người tương đương" cho MVP (mục 2) trước khi đưa vào báo cáo.
- [ ] RES-02 ghi giờ W12-W13; hiện không có bằng chứng nào trong repo.
- [ ] RES-03 xác nhận hoặc sửa phân bổ W12 giả định ở trên.
- [ ] Chép bảng mục 3 vào sheet **Planned vs Actual** và tổng mục 4 vào **Task Log** của workbook trên Drive.
- [ ] Cập nhật lại sau M-03 (24/11) và sau A-87, A-88 (26-27/11).
