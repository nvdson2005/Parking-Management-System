# Review CP-02 (A-23): phần của RES-03

| Trường | Nội dung |
|---|---|
| Checkpoint | CP-02, review kiến trúc và API (A-23) |
| Người review | Nguyễn Phạm Mạnh Dũng (RES-03, Kiến trúc và dữ liệu) |
| Người review thứ hai | Đào Xuân Sơn (RES-02, QA): **chưa ghi** |
| Người duyệt | Nguyễn Võ Đức Sơn (RES-01) |
| Ngày review | 23/11/2026 (kế hoạch V1.0: 13-16/11; dời 20/11; xem ISS-M3-01) |
| Tài liệu được review | P18 v1.0, `docs/m2-report/products/CO3011_M2_KienTrucAPI_v0.1.md` trên `main` (A-22, 19/11). P18 v1.1, `docs/m2-report/v2.0/products/CO3011_M3_KienTrucAPI_v1.1.md` trên nhánh `docs/A-70-srs-p18-sync` (A-70, RES-04, 22/11, **chưa merge**) |
| Đối chiếu với | Mã nguồn `main` (`4c8fde2`), PR #11 (A-28, A-65), câu trả lời vòng 3 Q27-Q35, P03 v0.4 (PR #10) |
| Tiêu chí (kế hoạch chất lượng 2.12.1) | (1) Mỗi khác biệt KB-01 đến KB-19 có quyết định; (2) hợp đồng vào/ra đóng băng; (3) mỗi FR có endpoint hoặc thành phần |

## 1. Kết quả theo tiêu chí

| # | Tiêu chí | Kết quả | Căn cứ |
|---|---|---|---|
| 1 | Mỗi KB có quyết định | **Đạt** | P18 v1.0 §10: đủ 19/19 quyết định (sửa mã, sửa spec hoặc chấp nhận), kèm hoạt động và người phụ trách ở §10.1. v1.1 thêm KB-20, KB-21 cũng có quyết định. Trạng thái các KB giao cho RES-03: KB-07, KB-14 **đã sửa** (PR #11, `38c7e20`, `2992cb0`); KB-16 **chấp nhận không sửa** (P03 v0.4 §11.1, CR-03); KB-15 **đã bổ sung endpoint** (`5882e49`); KB-21 **đã làm** dưới tên G-08 (`49299ac`) |
| 2 | Hợp đồng vào/ra đóng băng | **Đạt** | v1.0 §7 đóng băng với 2 thay đổi đã biết (`method` cho exit/confirm do KB-05; quy tắc so biển KB-04). v1.1 thêm trường tùy chọn `confirmEarly` và mã lỗi `EARLY_ARRIVAL` cho entry (Q31). Thay đổi này đi qua CR-02 và tương thích ngược (client cũ không gửi trường này vẫn chạy). `tests/contract-inout.test.ts` (A-79) kiểm tra hợp đồng; A-67 chạy 25 kiểm tra HTTP và 120 sự kiện mô phỏng không lỗi |
| 3 | Mỗi FR có endpoint hoặc thành phần | **Đạt có điều kiện** | v1.0 §9 phủ FR-01 đến FR-34; FR-13, FR-28, FR-31 chỉ có thành phần (đã chấp nhận ở KB-15). PR #11 bổ sung endpoint cho cả ba. **Điều kiện:** P18 phải ghi các endpoint mới (mục 2, K-01) và cập nhật R3-Q6 (K-02) |

**Đề xuất kết luận của RES-03: CP-02 đạt có điều kiện.** Hai điều kiện K-01 và K-02 chỉ là sửa tài liệu, không chặn code hay các hoạt động sau. Cần RES-02 ghi phần review và RES-01 ký duyệt.

## 2. Phát hiện

| Mã | Mức | Phát hiện | Đề xuất | Phụ trách |
|---|---|---|---|---|
| K-01 | Điều kiện | P18 (cả v1.0 và v1.1) chưa có 5 endpoint mới của A-65 (`/api/staff/lookup`, `/api/staff/reservations`, `/api/sessions`, `/api/access-logs`, `/api/payments`), chưa ghi trang `/staff/lookup`, và §9 vẫn ghi FR-28 "không có endpoint" | Chép đặc tả từ `specs/003-a65-staff-lookup-api/contracts/read-apis.md` vào §8, §9 của bản P18 mới (v1.1 hoặc v1.2) sau khi PR #11 merge | RES-01 (RES-03 đã soạn sẵn) |
| K-02 | Điều kiện | §11 R3-Q6 (v1.0 và v1.1) vẫn ghi giả định "purge thủ công". Q35 đã chốt là **tự động**, và PR #11 đã làm (`bc172ce`) | Sửa R3-Q6: tự động hằng ngày, nút Manager giữ nguyên. Đồng thời đánh dấu mục 11 là câu hỏi đã có trả lời (đầu mục vẫn ghi "chưa gửi khách hàng") | RES-01 / RES-04 |
| K-03 | Lưu ý | P18 v1.0 bị sửa đè lên file thuộc Baseline V1.0 (`3d911b6`, `a55f6a8`; `docs/m3/baseline-v1.0-freeze.md`). v1.1 làm đúng cách (file mới) | Khôi phục `CO3011_M2_KienTrucAPI_v0.1.md` về blob `809c6e3`; coi v1.0 là bản trong lịch sử git hoặc tách ra file `..._v1.0.md` | RES-01 |
| K-04 | Lưu ý | P18 dùng mã FR của đặc tả MVP (SRS v0.1), trong khi P03 v0.4 và SRS v2.0 dùng mã của SRS v0.2/v2.0 (R-M3-02) | Thêm bảng ánh xạ FR vào P18, hoặc tham chiếu bảng của P24 (RES-04) | RES-04 |
| K-05 | Lưu ý | VM-04 (khóa và event bus chỉ đúng trong một tiến trình) được chấp nhận cho demo. Bộ hẹn giờ xóa tự động mới (G-05) cũng chạy trong tiến trình, nên có cùng ràng buộc | Ghi chung vào VM-04 | RES-01 |
| K-06 | Lưu ý | Có hai thư mục cho các bản V2.0: `docs/m2-report/v2.0/products/` (RES-04) và `data/plan-v2.0.mjs` + `generated-v2/` (RES-03, PR #10) | Nhóm thống nhất một chỗ (đề xuất `docs/m2-report/v2.0/` cho cả sản phẩm và bảng sinh tự động) | RES-01 |

## 3. Phần chưa review

- Bảo mật (P18 §5) chỉ được đối chiếu với các thay đổi của A-28 (KB-07, KB-14) và quyết định KB-16. Phần còn lại thuộc phạm vi review của RES-02 (QA).
- Phần rà soát A-74 (§10.3) do RES-01 làm, không review lại.

## 4. Chữ ký

| Vai trò | Người | Kết quả | Ngày |
|---|---|---|---|
| Review (Kiến trúc và dữ liệu) | Nguyễn Phạm Mạnh Dũng (RES-03) | Đạt có điều kiện (K-01, K-02) | 23/11/2026 |
| Review (QA) | Đào Xuân Sơn (RES-02) | `TODO(RES-02)` | |
| Duyệt | Nguyễn Võ Đức Sơn (RES-01) | `TODO(RES-01)` | |

Khi RES-02 ghi xong và RES-01 duyệt, chép kết luận vào P18 §10.2 của bản mới và vào sheet Quality Evidence. Đóng ISS-M3-01 trong sổ rủi ro.
