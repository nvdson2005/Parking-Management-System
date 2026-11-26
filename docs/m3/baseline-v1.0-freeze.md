# Ghi nhận đóng băng Project Baseline V1.0

| Trường | Nội dung |
|---|---|
| Người thực hiện | Nguyễn Phạm Mạnh Dũng (RES-03) |
| Ngày lập | 17/11/2026 |
| Baseline | Project Baseline V1.0, đóng băng 09/11/2026 (báo cáo M2 mục 2.12.4) |
| Git tag | `baseline-v1.0` (annotated) |
| Commit | `061120c9ab26acdb9c88b365bfd2f7800ef6ef09` (nvdson2005, 09/11/2026 00:02 +0700, "docs(m2): replan baseline around the built MVP") |
| Bản lưu kế hoạch | `docs/m2-report/data/archive/plan-v1.0.mjs` (blob `df8f09d`, trùng `data/plan.mjs` tại tag) |

Báo cáo M2 v1.0 đã nộp ngày 09/11, nên tài liệu này không chép vào phụ lục của báo cáo M2. Theo quy tắc 5 của `docs/m3-m4-work-division.md`, đầu ra V1.0 không được sửa. Báo cáo M3 dẫn chiếu tới file này.

## Cách kiểm tra

```bash
git show baseline-v1.0 --stat                  # commit được đóng băng
git diff --diff-filter=MD --stat baseline-v1.0 -- docs/m2-report   # rỗng nếu không file V1.0 nào bị sửa hoặc xóa
git ls-tree -r baseline-v1.0 -- docs/m2-report                     # so mã blob với bảng dưới
```

Phiên bản mới của sản phẩm được thêm dưới dạng file mới (ví dụ `CO3011_M2_ThietKeCSDL_v0.4.md`), không ghi đè file V1.0, nên lệnh kiểm tra chỉ xét file bị sửa (M) hoặc bị xóa (D). Tại ngày lập (17/11), không có commit nào trên `main` sửa hay xóa file V1.0 sau ngày 09/11.

**Kiểm tra lại ngày 23/11: có một file V1.0 bị sửa.** Lệnh thứ hai ở trên trả về `products/CO3011_M2_KienTrucAPI_v0.1.md` (P18, +47 / −22 dòng), do hai commit:

| Commit | Ngày | Nội dung |
|---|---|---|
| `3d911b6` | 19/11 | "docs(p18): v1.0 with KB-01..KB-19 decisions, contract notes, CP-02 record (A-22, A-74)" |
| `a55f6a8` | 20/11 | "docs(m3): workshop 20/11, CP-02 and A-09 recorded as pending with owners" |

P18 v1.0 được ghi đè lên file của V1.0 thay vì thêm file mới, nên trái quy tắc 5. Nội dung V1.0 **không bị mất**: vẫn lấy lại được bằng `git show baseline-v1.0:docs/m2-report/products/CO3011_M2_KienTrucAPI_v0.1.md` (blob `809c6e3`). Đề xuất cho RES-01 (chủ P18): chép nội dung hiện tại sang file mới `CO3011_M2_KienTrucAPI_v1.0.md`, rồi khôi phục `CO3011_M2_KienTrucAPI_v0.1.md` về blob `809c6e3`, để lệnh kiểm tra trả về rỗng như trước. Cho đến khi làm xong, báo cáo M3 ghi đây là một sai lệch đã biết, kèm lệnh lấy lại bản V1.0.

## Danh sách file V1.0

Mã blob Git tại `baseline-v1.0`, viết tắt 7 ký tự. Các ảnh xuất `.png` của sơ đồ cũng thuộc tag nhưng không liệt kê ở đây.

| Nhóm | File | Blob |
|---|---|---|
| Báo cáo | `CO3011_M2_Report_v0.1.md` | `ac2cc76` |
| Báo cáo | `CO3011_M2_Report_v1.0.docx` | `8951137` |
| Báo cáo | `report.src.md` | `520b589` |
| Kế hoạch (nguồn) | `data/plan.mjs` | `df8f09d` |
| Sơ đồ | `diagrams/01-pbs.drawio` | `5afd17c` |
| Sơ đồ | `diagrams/02-pfd.drawio` | `87ee16e` |
| Sơ đồ | `diagrams/03-activity-network.drawio` | `ff6027e` |
| Sơ đồ | `diagrams/04-gantt.drawio` | `de67ad0` |
| Sơ đồ | `diagrams/05-critical-path.drawio` | `aab798b` |
| Sơ đồ | `diagrams/06-risk-matrix.drawio` | `7c6d700` |
| Sơ đồ | `diagrams/07-erd.drawio` | `3a44c67` |
| Bảng sinh tự động | `generated/activities.md` | `22b2f6d` |
| Bảng sinh tự động | `generated/cpm.md` | `fed0a5d` |
| Bảng sinh tự động | `generated/estimates.md` | `9690006` |
| Bảng sinh tự động | `generated/gantt.md` | `23b6f71` |
| Bảng sinh tự động | `generated/milestones.md` | `eb9d5ff` |
| Bảng sinh tự động | `generated/risks.md` | `c963c5d` |
| Bảng sinh tự động | `generated/schedule.json` | `0de7cca` |
| Bảng sinh tự động | `generated/totals.md` | `dddb39b` |
| Bảng sinh tự động | `generated/traceability.md` | `e99cdb1` |
| Sản phẩm | `products/CO3011_M2_SRS_v0.1.md` | `01d24c0` |
| Sản phẩm | `products/CO3011_M2_ThietKeCSDL_v0.1.md` | `54689e5` |
| Sản phẩm | `products/CO3011_M2_KienTrucAPI_v0.1.md` | `809c6e3` |
| Sản phẩm | `products/CO3011_M2_KeHoachKiemThu_v0.1.md` | `baff8d7` |

Các bảng sinh tự động còn lại (`allocation`, `allowances`, `checkpoints`, `completed`, `duration`, `products`, `reserve`, `resource-capacity`, `resource-load`, `schedule.md`) cũng thuộc tag và kiểm tra được bằng `git ls-tree`.

## Giá trị cố định để so sánh (trích báo cáo M2 mục 2.12.6)

| Hạng mục | Giá trị V1.0 |
|---|---|
| Phạm vi | M1 1.4.1 (P05 đến P11) và các sản phẩm hỗ trợ trong 2.1.2; P12 hoãn |
| Điểm xuất phát | MVP tại commit trước 09/11 và 19 khác biệt KB-01 đến KB-19 |
| Effort / chi phí | 131,15 người-giờ cơ sở + 8,45 giờ dự phòng; 6.980.000 VNĐ quy đổi |
| Lịch | 09/11 → 01/12; mốc M-01 đến M-05 |
| Rủi ro / chất lượng | Sổ rủi ro 2.8.2; hoạt động ứng phó 2.9.1; checkpoint CP-01 đến CP-08 |

## Việc còn mở

| Việc | Trạng thái | Điều kiện |
|---|---|---|
| Đánh v1.0 cho P02, P03, P18, P20 | **Cập nhật 23/11:** P18 đã lên v1.0 (19/11, A-22) nhưng ghi đè lên file V1.0 (xem mục trên). P03 ở v0.4 (22/11), chờ CP-03. P02, P20 chưa có thông tin mới | Review CP-01 (P02), CP-02 (P18), CP-03 (P03) đạt. Biên bản CP-02 (hẹn 20/11) chưa được ghi |
| Push tag `baseline-v1.0` lên remote | Chờ. **Tag hiện chỉ có trên máy RES-03**, nên các lệnh kiểm tra ở trên chưa chạy được trên máy thành viên khác | Nhóm đồng ý (RES-01) |
| Bảng phê duyệt 2.12.5 (đang là placeholder) | Chờ | Biên bản họp nhóm và email duyệt của khách hàng (RES-01) |
| Baseline V2.0 (A-106) | **Đã kích hoạt (19/11)** do CR-01: hạn nộp dời từ 07/12 lên 29/11 (`docs/m3/baseline-v2-handoff.md`). CR-03 (chờ duyệt) cũng là một mục thay đổi của V2.0 | RES-03 sinh lại trước 24/11; RES-01 duyệt. V2.0 sinh bộ file mới, giữ nguyên `plan-v1.0.mjs` |
