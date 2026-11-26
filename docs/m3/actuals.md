# Theo dõi kế hoạch so với thực tế (A-101, A-103; Task 3.3)

| Trường | Nội dung |
|---|---|
| Hoạt động | A-101 ghi bù effort thực tế C-01 đến C-13 (ISS-04); A-103 theo dõi kế hoạch so với thực tế |
| Người lập | Nguyễn Phạm Mạnh Dũng (RES-03) |
| Cập nhật | 26/11/2026 (W14, sau CP-05 và trước A-87, A-88) |
| Kế hoạch gốc | Baseline V1.0 (`docs/m2-report/generated/schedule.json`, `estimates.md`); cột V2.0 lấy từ `docs/m2-report/data/plan-v2.0.mjs` (chờ RES-01 duyệt, F1-03) |
| Dùng cho | A-90 (RES-01), F3-04 so sánh hiệu quả, báo cáo cuối A-92, sheet Planned vs Actual và Task Log của workbook (F3-05) |
| Trạng thái | **Ước tính tái dựng, chưa đo.** Không thành viên nào ghi giờ hằng ngày (A-100). Số tự khai của RES-04 và RES-05 được giữ nguyên. Số của RES-01 W12-W13 lấy từ bảng tự ước tính của RES-01; số của RES-02 và W14 của RES-01 do RES-03 dựng từ bằng chứng. Thành viên nào muốn sửa dòng của mình thì sửa trực tiếp |

## 1. Cách tính

1. **Giờ người, không phải thời gian chạy công cụ.** Mọi con số là số giờ một thành viên cần để làm và tự kiểm tra phần việc đó. Nhiều commit cách nhau vài phút vì có công cụ AI hỗ trợ viết code và tài liệu. Khoảng cách giữa các commit **không** được dùng làm số giờ.
2. **Tổng tuần.** Lấy số thành viên tự khai nếu có: RES-01 (`a-90-planned-vs-actual.md`), RES-04 (`docs/final/res04/a114-reflection.md`, 8 giờ mỗi tuần), RES-05 (các dòng "Effort RES-05" trong `docs/m3/`). Nếu không có thì lấy năng lực như weekly log: 8 giờ ở W12, 10 giờ ở W13, 12 giờ ở W14 (10 + 2 theo phương án C). Khi bằng chứng cho thấy khối lượng vượt năng lực (RES-03 ở W14) thì ghi phần vượt và giải thích, không cắt bớt cho vừa.
3. **Giờ theo hoạt động** chỉ ghi khi có bằng chứng (commit, tài liệu, biên bản review, file trên Drive được nhắc trong repo). Phần còn lại của tổng tuần ghi vào "họp, đọc tài liệu, phối hợp".
4. **RES-01** dùng số Đức Sơn tự ước tính cho W12-W13. Số W14 dựng từ commit.
5. **RES-02** không có tài khoản git. Các review được ghi trong tài liệu của người khác (CP-03 trong P03 v0.5, quyết định CP-05 trong `a-68-cp05-test.md`) lấy theo E của baseline. Các việc khác của RES-02 (A-82, A-85, A-72, A-96) lấy theo E của baseline, chỉnh theo khối lượng thấy được trong tài liệu của người khác.
6. **Các thành viên khác**: lấy E (PERT) trong baseline làm mốc, rồi chỉnh theo khối lượng thấy được (có vòng review, làm lại, phạm vi tăng hoặc giảm). Cột "Căn cứ" ghi rõ cách chỉnh.
7. **Lệch** = (thực tế − kế hoạch V1.0) / kế hoạch V1.0. Các dòng lệch quá **±20%** có giải thích (Task 3.3).

## 2. A-101: effort thực tế của công việc trước baseline (C-01 đến C-13)

C-03 đến C-13 là MVP. Toàn bộ commit là của RES-01 trong ngày 08/11 (`46472f9` đến `eebe8a3`), có công cụ AI hỗ trợ. Theo yêu cầu của nhóm, cột "giờ người tương đương" ghi số giờ nếu làm thủ công. Số này lấy từ kế hoạch tự xây dựng từ đầu v0.2 (`data/archive/plan-build-v0.2.mjs`), hoặc ước tính tương tự khi v0.2 không có hạng mục đó. **Đây không phải số giờ RES-01 thật sự đã bỏ ra**; báo cáo trình bày đúng như vậy.

| C-ID | Công việc | Người làm (git) | Thời gian | Giờ người tương đương | Căn cứ |
|---|---|---|---|---:|---|
| C-01 | Báo cáo M1 và Client Interaction Log vòng 1-2 | Cả nhóm | W4-W11 | ngoài phạm vi | Tài liệu trên Drive, không có commit. Không tính vào A-101 vì xảy ra trước Baseline V1.0 và đã được chấm ở M1 |
| C-02 | Bản nháp PD và kế hoạch M2 | RES-01, RES-02 | W10-W11 | ngoài phạm vi | Như C-01: thuộc M2, đã nộp |
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
| A-01 | SRS v1.0 | RES-04, RES-02 | 09-10/11 | 4,33 | 13/11 | 23/11 (v2.1) | 4,5 | +4% | v0.2 ngày 15/11 (P03 v0.3); v2.0 `07cea70`; v2.1 PR #16, #22 | Trễ: chờ câu trả lời vòng 3 (15/11) và vòng 5 (23/11); effort đúng kế hoạch vì mỗi vòng chỉ sửa các FR bị ảnh hưởng |
| A-09 | Review SRS (CP-01) | RES-04, RES-05, RES-01 | 10-13/11 | 3,0 | — | chưa ghi | 0 | — | Không có biên bản; RES-02 ghi kết quả hoặc lý do bỏ qua ở F2-01 | RES-04 sửa SRS theo góp ý trên Drive (trong 8 giờ W12 của RES-04), nhưng biên bản CP-01 chưa có |
| A-16 | Câu hỏi vòng 3 | RES-01 | W12-W13 | 2,0 | — | 15/11 | 0,5 | **−75%** | `client-round3-questions.md` | Câu hỏi đã soạn sẵn trong C-03; chỉ còn gửi và ghi log |
| A-22 | P18 v1.0, quyết định KB | RES-01 | 09-12/11 | 4,33 | 09/11 | 19/11 | 4,5 | +4% | `3d911b6` | Trễ 7 ngày: chờ quyết định KB-02, KB-03 và ưu tiên thay đổi vòng 3 |
| A-23 | Review P18 (CP-02) | RES-02, RES-03 | 13-16/11 | 2,0 | 13/11 | 24/11 | 2,0 (RES-03 2,0 gồm 1,5 đọc ở W12 + 0,5 biên bản) | 0% | `b73a818` (RES-03), RES-01 review lần hai 24/11 | Trễ 8 ngày (ISS-M3-01): P18 v1.0 xong 19/11. RES-02 không ghi phần review riêng; RES-01 làm lần hai thay |
| A-24 | Thiết kế CSDL v1.0 | RES-03 | 12-13/11 | 2,25 | 17/11 | 24/11 (v0.6, ứng viên v1.0) | 4,75 | **+111%** | P03 v0.3 (17/11, Drive), v0.4 `1b0c77c`, v0.5 và v0.6 (23-24/11) | SRS v0.2 đánh số lại FR, vòng 3 và vòng 5 thêm quy tắc, nên phải làm 4 bản (v0.3-v0.6) và thêm bảng chốt phạm vi 11.1 |
| A-27 | Review CSDL (CP-03) | RES-02, RES-03 | 13/11 | 1,5 | 23/11 | 23/11 | 1,5 (RES-02) | 0% | 2 vòng review của RES-02 ghi ở P03 v0.5 (5 + 4 comment trên Drive) | Trễ 10 ngày vì P03 chưa sẵn; RES-03 sửa theo review được tính trong A-24 |
| A-28 | Sửa xác thực, nhật ký; xóa tự động | RES-03 | 18-20/11 | 3,17 (V2.0: 3,75) | 23/11 | 24/11 | 3,0 | −5% (V2.0: −20%) | PR #11 (`bc172ce`, `38c7e20`, `2992cb0`), Q38 trong PR #17, review lần hai PR #11 | Trễ 3 ngày: chờ chốt phạm vi CR-04. Thêm G-05 (Q35), G-06, Q38; bỏ KB-16. AI viết phần lớn code và test; giờ ghi là thời gian đọc, review và chạy kiểm tra |
| A-65 | Bổ sung API; Staff tra cứu | RES-03 | 23-25/11 | 4,33 (V2.0: 7,33) | 23/11 | 24/11 | 5,5 | **+27%** (V2.0: −25%) | PR #11 (G-04, G-07, G-08, G-09), PR #17 (Q37, Q45, Q46), FR-44 (spec 006) | CR-04 thêm G-04, G-07..G-09, Q37, Q45, Q46 và FR-44. So với V2.0 thì ít hơn, vì AI hỗ trợ và nhiều thay đổi chỉ ở một service |
| A-33 | Hướng dẫn cài đặt và demo | RES-03 | 20-23/11 | 2,0 | 23/11 | 23/11 | 1,0 | **−50%** | `901bb2c` (`docs/P13-huong-dan-cai-dat-va-demo.md`) | README đã có sẵn lệnh cài đặt (`aaa8a8f`), chỉ cần thêm các kịch bản demo vòng 3 |
| A-43 | Rà soát bộ mô phỏng | RES-05 | 09-11/11 | 3,17 | 09/11 | 12/11 (cập nhật 16/11) | 3,5 | +10% | `f643391`, `e9fd5e7` | Cập nhật thêm cho vòng 3 |
| A-44 | Sửa bộ mô phỏng | RES-05 | 16-18/11 | 5,33 | 12/11 | 12/11 | 1,5 (RES-01); RES-05 xác nhận, tính trong A-67 | **−72%** | `68ea467`, `a-67-integration-check.md` | RES-01 làm thay; bộ mô phỏng của MVP đã có gần đủ, chỉ thêm chạy theo seed và chế độ ≥ 100 lượt. RES-05 xác nhận đóng 23/11 |
| A-45 | Kiểm thử bộ mô phỏng (CP-04) | RES-05, RES-02 | 19-20/11 | 2,0 | 20/11 | 24/11 (PR #8 merge) | 3,5 (RES-05) | **+75%** | `144b2a4`, `903e582`, `24f4063`, runner TypeScript 24/11 | Làm lại hai lần sau review: tách CSDL mỗi lần chạy, xuất số chỗ trống, viết lại runner và sinh lại bằng chứng |
| A-49 | Kiểm thử chỗ trống | RES-04 | 23-24/11 | 2,0 | 23/11 | 24/11 (retest sau CR-03) | 2,5 | **+25%** | PR #13, `docs/final/res04/a49-retest.md` | Thêm script đo thời gian cho kịch bản 100 lượt theo review (SC-001) và chạy lại sau CR-03 |
| A-61 | Kiểm thử quản lý bãi | RES-01 | 13-23/11 | 1,5 | 20/11 | 20/11 | 1,5 | 0% | `0faa6cb`, `quality-evidence-A-61.md` | — |
| A-63 | Sửa luồng vào/ra | RES-01, RES-03 | 16-18/11 | 6,33 | 19/11 | 19/11 | 2,0 (RES-01) + 0 (RES-03) | **−68%** | `42b9d98`, `9e07e29` | KB-02, KB-03 được chấp nhận nên không sửa code; chỉ KB-04, KB-05, KB-13 cần code. RES-03 không tham gia (đang làm P03, sổ rủi ro) |
| A-67 | Tích hợp bộ mô phỏng | RES-01, RES-05 | 20/11 | 2,17 | 20/11 | 23/11 (RES-05 xác nhận) | 0,75 (RES-01) + 1,0 (RES-05) | −19% | `a-67-integration-check.md`, PR #14 | Phần lớn đã kiểm qua A-45; RES-05 chạy lại qua giao diện và chuyển các kịch bản còn mở sang A-68 |
| A-68 | Kiểm thử vào/ra (CP-05) | RES-05, RES-02 | 23/11 | 2,5 | 24/11 | 25/11 | 3,0 (RES-05) + 1,0 (RES-02) | **+60%** | `a-68-cp05-test.md`, PR #18, #26 | CP-05 đạt có điều kiện C1-C6; xử lý điều kiện và sửa lỗi D-01 (409 `SIMULATOR_BUSY`) ngày 25/11 |
| A-70 | Rà soát đặt chỗ | RES-04 | 16-18/11 | 3,17 | 18/11 | 22/11 (merge PR #22 ngày 26/11) | 2,5 | **−21%** | `07cea70`, PR #22 | Trễ 4 ngày. Phần code đặt chỗ đã đổi trong CR-02 (RES-01) nên chỉ còn đồng bộ SRS, P18 và mã lỗi KB-11, KB-20, KB-21 |
| A-74 | Rà soát thanh toán | RES-01 | 18-20/11 | 2,25 | 19/11 | 19/11 | 0,75 | **−67%** | Test trong `42b9d98`; P18 §10.3 | Chỉ rà soát và thêm test, không sửa code |
| A-76 | Kiểm thử thanh toán | RES-04 | 20-24/11 | 2,0 (cắt còn test tự động) | 24/11 | 24/11 | 0,5 | **−75%** | `test(fees)`: 6 giá theo loại xe × nhóm | Phương án C cắt xuống test tự động sẵn có cộng một lần kiểm thủ công (F2-02) |
| A-77 | Kiểm thử báo cáo | RES-05 | 11-13/11 | 2,58 | 13/11 | 14/11 | 3,0 | +16% | `69fb9ae`, `a5cff02`, `docs/m3/A-77/` | Một vòng sửa sau review |
| A-79 | Test hợp đồng API vào/ra | RES-05 | 18-19/11 | 2,08 | 19/11 | 20/11 | 2,5 | +20% | `3c4c041`, `f3c0cc2` (PR #6) | Một vòng sửa sau review |
| A-31 | Kiểm thử xác thực, phân quyền | RES-05 | 23-24/11 | 1,5 | 24/11 | 24/11 | 1,5 | 0% | `docs/m3/a-31-auth-test.md` | — |
| A-82, A-83 | Kịch bản nghiệm thu | RES-02, RES-04 | 13-19/11 | 8,67 | 13/11 | chưa có file | 4,0 (RES-02) | **−54%** | Không có file trong repo; AT-01..AT-07 dùng trực tiếp trong SRS v2.1 và A-68 | Kịch bản được viết gộp vào SRS (mục AT) thay vì một tài liệu riêng |
| A-96 | Chạy test tự động lần đầu | RES-02 | 10-11/11 | 2,17 | 10/11 | 11/11 | 2,0 (RES-02) | −8% | Bộ test chạy đạt 181/181 ngày 19/11 (RES-01) | — |
| A-99 | Phân tích tác động thay đổi | RES-01 | W13-W14 | 3,0 | 19/11 | 24/11 | 2,0 | **−33%** | `3e7d822`, ghi CR-03 trong PR #19 | Phân tích CR-01 tái dùng được cho CR-03 |
| A-94 | Weekly log | RES-01 | hằng tuần | 2,0 | 19/11 | — | 0,5 | — | `weekly-log-draft.md` | Bắt đầu trễ (không có log W12); phần còn lại ở F1-01 |

### Hoạt động mới (lower-level plan, Task 3.8) và việc ngoài kế hoạch

| A-ID / việc | Phụ trách | KH (giờ) | TT effort (giờ) | Lệch | Bằng chứng | Giải thích |
|---|---|---:|---:|---:|---|---|
| A-102 Sổ rủi ro (W12-W14) | RES-03 | 1,5 (3 tuần × 0,5) | 2,5 | **+67%** | `risk-register.md` 17/11, 22/11, 24/11 | Lần đầu phải dựng sổ từ V1.0; thêm tác động CR-01, đối chiếu Q27-Q35, rồi CR-04 (+16 giờ) và R-M3-01 sau vòng 5 |
| A-106 Baseline V2.0 | RES-03, RES-01 | 1,0 + 0,5 | 1,5 (RES-03) + 0,25 (RES-01) | **+50%** (RES-03) | `679946c` (23/11), 2 vòng review PR #10 (24/11), `e43c2bf` | Kế hoạch không vừa năng lực, nên phải phân tích thêm và so sánh hai phương án CR-04 (28 giờ và 16 giờ) trên cùng hạng mục. Lần chốt cuối ở F3-02 |
| Ghi nhận đóng băng V1.0 | RES-03 | 0 | 0,75 | ngoài kế hoạch | `baseline-v1.0-freeze.md` | Cần cho Task 3.7 (giữ bản gốc để so sánh) |
| Chốt phạm vi CR-04 (ứng phó R-M3-01) | RES-03 | 0 (đề xuất 1,5) | 1,5 | ngoài kế hoạch | P03 v0.4 §11.1, `risk-register.md` §6 | Hoạt động ứng phó rủi ro mức Cao |
| A-101 + A-103 (tài liệu này) | RES-03 | 1,5 + 2,0 | 2,0 | **−43%** | file này (23/11, 26/11) | Gộp hai hoạt động thành một lần lập, cập nhật một lần trong W14 |
| A-112, A-114 bản nháp | RES-03 | 1,5 + 1,0 | 0,5 | (chưa xong) | `a-112-closure-plan.md`, `a-114-reflection-draft-res03.md` | Khung và bản nháp đầu; hoàn thiện 27/11 |
| CR-03 giao diện (PR #24) | RES-04 | 2,6 (nhóm A + B + C) | 3,0 | +15% | PR #20, #24, spec 006 | Thêm spec, plan và test hiển thị |
| Vòng 3 (CR-02) | RES-01 | 0 | 4,25 | ngoài kế hoạch | `34c9e49`..`360b6ba`, `beda3ad`..`30b5032` | Số của RES-01 |
| Tích hợp PR #11, #17 vào main (PR #21) | RES-01 | 0 | 2,0 | ngoài kế hoạch | PR #21, `fix: require matching request for group approval` | Hai PR chồng nhau không merge được theo thứ tự |
| A-87 chạy kỹ thuật (bản tích hợp) | RES-01 | 0 (A-87 thuộc RES-02) | 2,0 | ngoài kế hoạch | `a87-res01-technical-2026-11-24.md` (PR #19) | Kiểm 100 lượt, 200 sự kiện, 3 khổ màn hình trên Chrome |
| Cài CodeGraph | RES-03 | 0 | 0,25 | ngoài kế hoạch | `39fea67` | Quy định trong AGENTS.md |

## 4. Tổng theo thành viên và tuần

Năng lực: W12 8 giờ, W13 10 giờ, W14 12 giờ (theo baseline; RES-01 ghi cả nhóm cam kết thêm giờ cuối tuần 28-29/11). Cột W14 tính **đến 26/11**; phần 27-29/11 cập nhật sau A-88 và trước F3-05.

| Thành viên | W12 / 8 | W13 / 10 | W14 đến 26/11 / 12 | Nguồn | Ghi chú |
|---|---:|---:|---:|---|---|
| RES-01 Nguyễn Võ Đức Sơn | 8,0 | 10,0 | 11,5 | W12-W13 tự ước tính; W14 dựng từ commit | W14: ghi nhận quyết định giảng viên (A-09) 1,0; CP-02 lần hai và constitution 1,0; hồ sơ Phase 5 (A-90, A-99, A-105) 3,0; PR #21 2,0; A-87 chạy kỹ thuật 2,0; theo dõi CP-05 1,0; phân công cuối 1,0; họp 0,5 |
| RES-02 Đào Xuân Sơn | 8,0 | 10,0 | 4,0 | Năng lực; review ghi trong tài liệu của người khác | W12: A-96 2,0, A-82 4,0, họp và đọc 2,0. W13: A-85 2,0, A-72 2,0, chuẩn bị A-68 và A-87 (SC-01..SC-07, P20) 4,0, họp 2,0. W14: A-27 1,5, A-68 quyết định CP-05 1,0, A-87 chạy thử 26/11 1,5. Còn F2-01..F2-06 |
| RES-03 Nguyễn Phạm Mạnh Dũng | 8,0 | 10,0 | **16,25** | Năng lực W12; bằng chứng W13-W14 | W12 xem bảng dưới. W13: A-24 4,0, A-102 2,0, đóng băng V1.0 0,75, CR-04 1,5, họp và đọc 1,75. W14: A-28 3,0, A-65 5,5, A-24 0,75, A-23 0,5, A-33 1,0, A-106 1,5, A-102 0,5, A-101+A-103 2,0, A-112+A-114 0,5, CodeGraph 0,25, họp 0,75. **Vượt 4,25 giờ** (R-G4-02): phần lớn CR-04 (+16 giờ) rơi vào RES-03 |
| RES-04 Phạm Duy Quý | 8,0 | 8,0 | 8,0 | Tự khai (8 giờ mỗi tuần) | W12: sửa SRS sau review (A-09), A-13. W13: A-70 2,5, SRS v2.0 (A-01) và đồng bộ P18. W14: SRS v2.1, A-49 2,5, A-76 0,5, CR-03 giao diện 3,0, A-114. RES-04 tự ghi tổng 24 giờ cho cả 3 tuần |
| RES-05 Nguyễn Tuấn Thành | 8,0 | 10,0 | 9,0 | Tự khai từng việc; phần còn lại theo năng lực | W12: A-43 3,5, A-77 3,0, họp và đọc 1,5. W13: A-79 2,5, A-45 2,0, A-67 0,5, họp và đọc (chuẩn bị A-68) 5,0. W14: A-67 0,5, A-45 1,5, A-68 3,0, A-31 1,5, F5-01 0,5, F5-02 2,0 |
| **Cả nhóm** | **40,0** | **48,0** | **48,75** | | Đến 26/11: 136,75 giờ / năng lực 150 giờ (W14 tính đủ 12 giờ mỗi người) |

**RES-03, W12 (09-15/11), 8 giờ giả định.** Repo không có bằng chứng cho tuần này. Tổng lấy bằng năng lực theo quy ước của nhóm (mục 1.2). Phân bổ theo các việc Baseline V1.0 giao cho RES-03 trong W12:

| Việc | Giờ | Liên quan |
|---|---:|---|
| Đọc SRS và lược đồ MVP, chuẩn bị A-24 | 3,0 | A-24 (12-13/11) |
| Đọc P18 v0.2 để chuẩn bị review CP-02 | 1,5 | A-23 (13-16/11) |
| Đọc Baseline V1.0 và phân công M3/M4 | 1,5 | A-102, A-103 |
| Chuẩn bị sổ rủi ro từ bảng rủi ro V1.0 | 1,0 | A-102 |
| Họp tuần | 1,0 | A-97 |
| **Tổng** | **8,0** | |

Phần đọc P18 (1,5 giờ) được tính vào A-23 ở mục 3. Các phần còn lại **không** cộng vào dòng hoạt động, để không tính trùng.

## 5. Việc cần làm

- [ ] RES-05 điền "Effort RES-05" cho A-67 trong `a-67-integration-check.md` nếu khác 1,0 giờ tracker đang dùng.
- [ ] Sau A-88 (27/11): thêm giờ 27-29/11 cho cả nhóm, chốt cột W14.
- [ ] 28/11 (F3-05): chép bảng mục 3 vào sheet **Planned vs Actual** và tổng mục 4 vào **Task Log** của workbook.
