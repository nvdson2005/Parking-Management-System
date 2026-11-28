// Single source of truth for the Milestone 2 baseline (Baseline V1.0).
// Every table, schedule and diagram in the report is generated from this file.
// Effort unit: person-hours. PERT: E = (O + 4M + P) / 6, sigma = (P - O) / 6.
// Week ids follow the university academic calendar (week 1 starts 24/08/2026).
// The original build-from-scratch plan (v0.2) is kept in data/archive/plan-build-v0.2.mjs.

export const calendar = {
  projectStart: '2026-09-14', // academic week 4
  baselineStart: '2026-11-09', // M2 deadline = Baseline V1.0 start (academic week 12)
  finalDeadline: '2026-12-07', // academic week 16
  weeks: [
    { id: 'W12', start: '2026-11-09', hoursPerPerson: 8 },
    { id: 'W13', start: '2026-11-16', hoursPerPerson: 10 },
    { id: 'W14', start: '2026-11-23', hoursPerPerson: 10 },
    { id: 'W15', start: '2026-11-30', hoursPerPerson: 10 },
  ],
  workdaysPerWeek: 5,
  rateVND: 50000, // same proxy rate as M1 1.3.3
};

export const resources = [
  { id: 'RES-01', name: 'Nguyễn Võ Đức Sơn', role: 'PM, Trưởng nhóm kỹ thuật', skill: 'Điều phối, kiến trúc, backend nghiệp vụ', note: 'Bỏ vai trò QA (chuyển cho RES-02) để giảm tải review' },
  { id: 'RES-02', name: 'Đào Xuân Sơn', role: 'BA, Phụ trách chất lượng (QA)', skill: 'Yêu cầu, kiểm thử nghiệm thu', note: 'Nhận vai trò QA từ M2 (thay đổi so với M1 1.5)' },
  { id: 'RES-03', name: 'Nguyễn Phạm Mạnh Dũng', role: 'Kiến trúc và dữ liệu', skill: 'Thiết kế API, CSDL, xác thực', note: '' },
  { id: 'RES-04', name: 'Phạm Duy Quý', role: 'Yêu cầu và giao diện', skill: 'SRS, giao diện web', note: '' },
  { id: 'RES-05', name: 'Nguyễn Tuấn Thành', role: 'Mô phỏng và giám sát', skill: 'Bộ mô phỏng, hiển thị chỗ trống, kiểm thử', note: '' },
];

// Work completed before the baseline cut-off (actual, not planned). Dates come from the git history.
export const completedBeforeBaseline = [
  { id: 'C-01', name: 'Báo cáo M1 và Client Interaction Log vòng 1-2', products: ['P23', 'P15'], dates: 'W4-W11', evidence: 'Báo cáo M1 v0.3 (31/10); workbook' },
  { id: 'C-02', name: 'Bản nháp PD và kế hoạch M2 (báo cáo này)', products: ['P01'], dates: 'W10-W11', evidence: 'Drafts M2 (31/10); báo cáo M2' },
  { id: 'C-03', name: 'Đặc tả thiết kế MVP (quyết định D-01 đến D-41) và câu hỏi vòng 3 dự kiến', products: ['P02', 'P18'], dates: '08/11 (W11)', evidence: 'docs/superpowers/specs/2026-11-08-smart-parking-mvp-design.md' },
  { id: 'C-04', name: 'Dựng khung ứng dụng, mô hình dữ liệu, dữ liệu mẫu', products: ['P03', 'P22'], dates: '08/11 (W11)', evidence: 'commit 46472f9, f963c1e' },
  { id: 'C-05', name: 'Xác thực, RBAC, che biển số, nhật ký truy cập, giao diện song ngữ', products: ['P07'], dates: '08/11 (W11)', evidence: 'commit 291b668, eb49dd6' },
  { id: 'C-06', name: 'Hiển thị chỗ trống qua SSE', products: ['P09'], dates: '08/11 (W11)', evidence: 'commit 72ea1c8' },
  { id: 'C-07', name: 'Quản lý xe, xe vào/ra, 5 ngoại lệ', products: ['P05'], dates: '08/11 (W11)', evidence: 'commit 9a82c94, ab5b789, 343c6a3' },
  { id: 'C-08', name: 'Đặt chỗ, lịch sử và thanh toán mô phỏng', products: ['P06', 'P10'], dates: '08/11 (W11)', evidence: 'commit d7720f9, 4424033' },
  { id: 'C-09', name: 'Quản lý bãi, khu vực, sức chứa, bảng giá, tài khoản, xóa dữ liệu quá hạn', products: ['P08', 'P07'], dates: '08/11 (W11)', evidence: 'commit 8cd3ffe, a7368c5' },
  { id: 'C-10', name: 'Báo cáo 4 chỉ số', products: ['P11'], dates: '08/11 (W11)', evidence: 'commit 48fb244' },
  { id: 'C-11', name: 'Bộ mô phỏng (sự kiện, 5 ngoại lệ, dữ liệu quá khứ)', products: ['P04', 'P22'], dates: '08/11 (W11)', evidence: 'commit c8ae479, 14b29b0' },
  { id: 'C-12', name: 'Kiểm thử tự động (21 file) và hướng dẫn kiểm thử E2E thủ công', products: ['P20'], dates: '08/11 (W11)', evidence: 'tests/, docs/manual-e2e-test-guide.md' },
  { id: 'C-13', name: 'Bản nháp P02 SRS, P03 CSDL, P18 kiến trúc và API, P20 kế hoạch kiểm thử', products: ['P02', 'P03', 'P18', 'P20'], dates: '08/11 (W11)', evidence: 'docs/m2-report/products/' },
];

// type: D = deliverable, I = intermediate. group: PBS branch.
// status: planned | built (có trong MVP, cần kiểm chứng ở V1.0) | done | deferred
export const productGroups = [
  { id: 'PG-1', name: 'Phần mềm bàn giao', parent: 'P00' },
  { id: 'PG-2', name: 'Tài liệu bàn giao', parent: 'P00' },
  { id: 'PG-3', name: 'Sản phẩm quản lý dự án', parent: 'P00' },
  { id: 'PG-4', name: 'Sản phẩm trung gian', parent: 'P00' },
];

export const products = [
  { id: 'P00', name: 'Hệ thống quản lý bãi đỗ xe thông minh (dự án)', type: 'D', group: null, status: 'planned', acceptance: 'Workflow cốt lõi chạy xuyên suốt, xử lý 5 ngoại lệ, đạt yêu cầu đã thống nhất (Q11)' },
  { id: 'P07', name: 'Mô-đun xác thực và phân quyền', type: 'D', group: 'PG-1', status: 'built', acceptance: 'Đăng ký, đăng nhập, RBAC 3 vai trò, che biển số, nhật ký truy cập (CN4)' },
  { id: 'P08', name: 'Mô-đun quản lý thông tin bãi', type: 'D', group: 'PG-1', status: 'built', acceptance: 'Manager quản lý tên bãi, địa chỉ, khu vực, sức chứa theo loại xe, trạng thái, bảng giá (Q14)' },
  { id: 'P05', name: 'Mô-đun quản lý xe ra/vào', type: 'D', group: 'PG-1', status: 'built', acceptance: 'Ghi nhận vào/ra, cập nhật chỗ trống, xử lý 5 ngoại lệ (PD-P05)' },
  { id: 'P09', name: 'Mô-đun hiển thị tình trạng chỗ đỗ', type: 'D', group: 'PG-1', status: 'built', acceptance: 'Số chỗ trống theo khu vực và loại xe khớp số đếm tay; cập nhật trực tiếp (O1)' },
  { id: 'P06', name: 'Mô-đun đặt chỗ', type: 'D', group: 'PG-1', status: 'built', acceptance: 'Đặt, hủy, giữ chỗ 30 phút, tự hủy khi không đến (Q15)' },
  { id: 'P10', name: 'Mô-đun thanh toán mô phỏng', type: 'D', group: 'PG-1', status: 'built', acceptance: 'Phí theo lượt đúng cho 6 tổ hợp loại xe × nhóm; lịch sử giao dịch (Q16)' },
  { id: 'P11', name: 'Mô-đun báo cáo', type: 'D', group: 'PG-1', status: 'built', acceptance: '4 chỉ số khớp số tính tay (Q20)' },
  { id: 'P13', name: 'Hướng dẫn cài đặt và chạy demo', type: 'D', group: 'PG-2', status: 'planned', acceptance: 'Người không phải tác giả chạy được demo chỉ bằng hướng dẫn' },
  { id: 'P14', name: 'Báo cáo kết quả kiểm thử nghiệm thu', type: 'D', group: 'PG-2', status: 'planned', acceptance: 'Kết quả 12 AT và kịch bản 100 lượt; số đo O3, O4' },
  { id: 'P12', name: 'Hướng dẫn sử dụng', type: 'D', group: 'PG-2', status: 'deferred', acceptance: 'Hoãn; thay bằng phần hướng dẫn thao tác trong P13' },
  { id: 'P01', name: 'Project Baseline V1.0 (báo cáo M2)', type: 'D', group: 'PG-3', status: 'done', acceptance: 'Được nhóm thống nhất và gửi khách hàng duyệt qua email (Q19)' },
  { id: 'P15', name: 'Client Interaction Log', type: 'D', group: 'PG-3', status: 'planned', acceptance: 'Mọi trao đổi ghi trong 24 giờ (M1 1.7.3)' },
  { id: 'P16', name: 'Nhật ký dự án hằng tuần', type: 'D', group: 'PG-3', status: 'planned', acceptance: 'Mỗi tuần một dòng kế hoạch/thực tế (Task 3.2)' },
  { id: 'P17', name: 'Báo cáo quản lý dự án cuối kỳ', type: 'D', group: 'PG-3', status: 'planned', acceptance: 'So sánh baseline với thực tế, bài học kinh nghiệm (Task 4)' },
  { id: 'P23', name: 'Tài liệu định nghĩa dự án (báo cáo M1)', type: 'D', group: 'PG-3', status: 'done', acceptance: 'Đã nộp M1' },
  { id: 'P24', name: 'Ma trận truy vết', type: 'I', group: 'PG-3', status: 'planned', acceptance: 'Nằm trong P01 mục 2.13 và workbook; cập nhật mỗi checkpoint' },
  { id: 'P02', name: 'Đặc tả yêu cầu phần mềm (SRS)', type: 'I', group: 'PG-4', status: 'planned', acceptance: '7 tiêu chí chất lượng PD-P02' },
  { id: 'P18', name: 'Thiết kế kiến trúc và API', type: 'I', group: 'PG-4', status: 'planned', acceptance: 'Qua review CP-02' },
  { id: 'P03', name: 'Thiết kế CSDL', type: 'I', group: 'PG-4', status: 'planned', acceptance: 'Tiêu chí chất lượng PD-P03' },
  { id: 'P19', name: 'Thiết kế giao diện', type: 'I', group: 'PG-4', status: 'planned', acceptance: 'Đủ màn hình và luồng điều hướng theo vai trò' },
  { id: 'P04', name: 'Bộ mô phỏng thiết bị', type: 'I', group: 'PG-4', status: 'built', acceptance: '10 tiêu chí chất lượng PD-P04' },
  { id: 'P22', name: 'Dữ liệu mô phỏng bãi thí điểm', type: 'I', group: 'PG-4', status: 'built', acceptance: '3 khu vực, khoảng 300 chỗ xe máy và 30 chỗ ô tô (Q24)' },
  { id: 'P20', name: 'Kế hoạch kiểm thử', type: 'I', group: 'PG-4', status: 'planned', acceptance: 'Mỗi yêu cầu Must có ít nhất 1 test (M1 1.7.1)' },
  { id: 'P21', name: 'Bộ test nghiệm thu', type: 'I', group: 'PG-4', status: 'planned', acceptance: '9 tiêu chí PD-P21' },
];

// Product flow (input -> output), used for the PFD.
export const productFlows = [
  ['P23', 'P02'], ['P15', 'P02'],
  ['P02', 'P18'], ['P02', 'P19'], ['P02', 'P20'], ['P18', 'P03'], ['P18', 'P04'],
  ['P03', 'P22'], ['P04', 'P22'],
  ['P18', 'P07'], ['P03', 'P07'], ['P19', 'P07'],
  ['P18', 'P08'], ['P03', 'P08'], ['P19', 'P08'],
  ['P18', 'P05'], ['P03', 'P05'], ['P19', 'P05'], ['P08', 'P05'], ['P07', 'P05'], ['P04', 'P05'], ['P22', 'P05'],
  ['P18', 'P09'], ['P03', 'P09'], ['P19', 'P09'], ['P05', 'P09'],
  ['P18', 'P06'], ['P03', 'P06'], ['P09', 'P06'], ['P05', 'P10'], ['P08', 'P10'], ['P05', 'P11'], ['P06', 'P11'], ['P10', 'P11'],
  ['P02', 'P21'], ['P20', 'P21'], ['P04', 'P21'],
  ['P21', 'P14'], ['P05', 'P14'], ['P06', 'P14'], ['P07', 'P14'], ['P08', 'P14'], ['P09', 'P14'], ['P10', 'P14'], ['P11', 'P14'], ['P13', 'P14'],
  ['P03', 'P13'], ['P04', 'P13'],
  ['P14', 'P17'], ['P16', 'P17'], ['P01', 'P16'], ['P01', 'P24'], ['P24', 'P17'],
];

// Remaining work from 09/11 (W12). The MVP is already built (completedBeforeBaseline), so the
// activities are verification, fixes against the design review findings (KB-xx in P18 §10),
// documentation, testing and acceptance.
// boost: scheduling priority bonus. assign: share of effort per resource (sums to 1).
// fixed: recurring/time-boxed work booked on given weeks instead of scheduled by the leveller.
export const activities = [
  // ---------- G1 Requirements & UI ----------
  { id: 'A-01', name: 'Hoàn thiện SRS v1.0 từ bản nháp', product: 'P02', pred: [], est: { o: 3, m: 4, p: 7 }, assign: { 'RES-04': 0.65, 'RES-02': 0.35 },
    basis: 'Đối chiếu 36 FR với MVP 36 × 0,05h = 1,8h; rà soát phạm vi và ưu tiên MoSCoW 0,7h; hoàn thiện tiêu chí chấp nhận 1h; truy vết 0,5h' },
  { id: 'A-09', name: 'Review SRS', product: 'P02', pred: ['A-01'], allowance: 3, cp: 'CP-01', assign: { 'RES-04': 0.5, 'RES-05': 1 / 3, 'RES-01': 1 / 6 },
    basis: 'RES-05 đọc toàn bộ 1h; RES-01 đọc phần liên quan kiến trúc 0,5h; tác giả sửa sau review 1,5h' },
  { id: 'A-13', name: 'Lập tài liệu thiết kế giao diện từ màn hình đã có', product: 'P19', pred: ['A-01'], est: { o: 3.5, m: 4.5, p: 7 }, assign: { 'RES-04': 1 },
    basis: '18 màn hình × 0,2h = 3,6h (chụp, mô tả trường và thao tác); sơ đồ điều hướng theo 3 vai trò 1h' },
  { id: 'A-16', name: 'Gửi câu hỏi vòng 3 và cập nhật Client Interaction Log', product: 'P15', pred: [], allowance: 2, fixed: { weeks: ['W12', 'W13'], hoursPerWeek: { 'RES-01': 1 } },
    basis: 'Soạn và gửi 9 câu R3-Q1 đến R3-Q9 0,5h; ghi phản hồi 1h; cập nhật giả định SRS 0,5h' },

  // ---------- G2 Architecture, data, auth ----------
  { id: 'A-22', name: 'Hoàn thiện P18 v1.0 và chốt hướng xử lý các khác biệt KB-01 đến KB-19', product: 'P18', pred: [], est: { o: 3, m: 4, p: 7 }, assign: { 'RES-01': 1 },
    basis: '19 khác biệt × 0,15h = 2,9h (sửa mã, sửa spec hoặc chấp nhận); cập nhật đặc tả endpoint 1h' },
  { id: 'A-23', name: 'Review kiến trúc và API', product: 'P18', pred: ['A-22', 'A-09'], allowance: 2, cp: 'CP-02', assign: { 'RES-02': 0.5, 'RES-03': 0.5 },
    basis: '1 người đọc 1h (QA) + sửa sau review 1h' },
  { id: 'A-24', name: 'Hoàn thiện thiết kế CSDL v1.0', product: 'P03', pred: ['A-22'], boost: 20, est: { o: 1.5, m: 2, p: 4 }, assign: { 'RES-03': 1 },
    basis: 'Cập nhật tiêu chí PD-P03 theo khác biệt đã chốt 1h; ERD và từ điển dữ liệu 1h' },
  { id: 'A-27', name: 'Review thiết kế CSDL', product: 'P03', pred: ['A-24'], allowance: 1.5, cp: 'CP-03', assign: { 'RES-02': 2 / 3, 'RES-03': 1 / 3 },
    basis: '1 người đọc 1h + sửa 0,5h' },
  { id: 'A-28', name: 'Sửa xác thực và nhật ký truy cập theo review', product: 'P07', pred: ['A-23'], est: { o: 2, m: 3, p: 5 }, assign: { 'RES-03': 1 },
    basis: 'Ghi LOGIN khi đăng ký (KB-07) 0,5h; trả 400 cho JSON lỗi (KB-14) 1h; chặn tài khoản khóa ở middleware (KB-16) 1h; test 0,5h' },
  { id: 'A-65', name: 'Bổ sung API cho nhật ký truy cập, lượt gửi và lịch sử thanh toán', product: 'P05', pred: ['A-23', 'A-27'], est: { o: 3, m: 4, p: 7 }, assign: { 'RES-03': 1 },
    basis: '3 endpoint × 1h (KB-15); kiểm tra quyền và test 1h' },
  { id: 'A-33', name: 'Viết hướng dẫn cài đặt và chạy demo', product: 'P13', pred: ['A-44'], allowance: 2, assign: { 'RES-03': 1 },
    basis: 'Cài đặt, migrate, seed 1h; chạy bộ mô phỏng và kịch bản demo 1h (cập nhật từ README)' },

  // ---------- G3 Simulator & availability ----------
  { id: 'A-43', name: 'Rà soát bộ mô phỏng theo PD-P04 và lập danh mục kịch bản SC-01 đến SC-07', product: 'P04', pred: [], est: { o: 2, m: 3, p: 5 }, assign: { 'RES-05': 1 },
    basis: 'Đối chiếu 10 tiêu chí PD-P04 1,5h; mô tả 7 kịch bản × 0,2h = 1,4h' },
  { id: 'A-44', name: 'Sửa bộ mô phỏng theo review', product: 'P04', pred: ['A-43', 'A-23'], est: { o: 3, m: 5, p: 9 }, assign: { 'RES-05': 1 }, boost: 10,
    basis: 'Gửi sự kiện qua API vào/ra (KB-01) 2h; ghi nhật ký và phát SSE khi kích hoạt EX-05 (KB-08) 1h; kiểm tra đủ ≥ 100 lượt được tạo (FR-34) 1h; test 1h' },
  { id: 'A-79', name: 'Xây dựng bộ kiểm thử hợp đồng API vào/ra', product: 'P05', pred: ['A-23'], est: { o: 1.5, m: 2, p: 3 }, assign: { 'RES-05': 1 }, response: ['R-G2-02'],
    basis: 'Ca kiểm thử cho từng endpoint theo hợp đồng 1,5h; chạy với bộ mô phỏng 0,5h' },
  { id: 'A-45', name: 'Kiểm thử và review bộ mô phỏng', product: 'P04', pred: ['A-44', 'A-79'], allowance: 2, cp: 'CP-04', assign: { 'RES-05': 0.5, 'RES-02': 0.5 },
    basis: 'Chạy tiêu chí 1-8 của PD-P04 1h; review 1h' },
  { id: 'A-47', name: 'Lập tài liệu dữ liệu mô phỏng bãi thí điểm', product: 'P22', pred: ['A-43'], allowance: 1.5, assign: { 'RES-05': 1 },
    basis: 'Mô tả seed (3 khu vực, 300 + 30 chỗ, tài khoản) và dữ liệu quá khứ do bộ mô phỏng sinh 1,5h' },
  { id: 'A-49', name: 'Kiểm thử mô-đun hiển thị chỗ trống', product: 'P09', pred: ['A-67'], allowance: 2, assign: { 'RES-04': 1 },
    basis: 'So số đếm tay sau kịch bản 100 lượt 1h; kiểm tra cập nhật trực tiếp qua SSE (TC-AV) 0,5h; ghi Quality Evidence 0,5h' },

  // ---------- G4 Parking operations, reservations, payment, reports ----------
  { id: 'A-96', name: 'Chạy bộ kiểm thử tự động lần đầu và ghi Quality Evidence', product: 'P20', pred: [], est: { o: 1, m: 2, p: 4 }, assign: { 'RES-02': 1 }, response: ['R-G4-03'],
    basis: 'Chạy npm test trên CSDL test 0,5h; phân loại lỗi 1h; ghi Quality Evidence 0,5h' },
  { id: 'A-63', name: 'Sửa luồng xe vào/ra theo review', product: 'P05', pred: ['A-23', 'A-27', 'A-96'], est: { o: 4, m: 6, p: 10 }, assign: { 'RES-01': 0.5, 'RES-03': 0.5 }, boost: 10,
    basis: 'Chốt thời điểm tính phí (KB-02) 1h; tách đóng lượt khỏi tạo giao dịch (KB-03) 1,5h; chuẩn hóa biển số khi so khớp (KB-04) 1h; kiểm tra mất thẻ ở máy chủ (KB-05) 1h; test hồi quy 1,5h' },
  { id: 'A-61', name: 'Kiểm thử mô-đun quản lý thông tin bãi', product: 'P08', pred: ['A-96'], allowance: 1.5, assign: { 'RES-01': 1 },
    basis: 'CRUD bãi, khu vực, sức chứa, bảng giá và phân quyền Manager 1h; ghi Quality Evidence 0,5h' },
  { id: 'A-31', name: 'Kiểm thử mô-đun xác thực và phân quyền', product: 'P07', pred: ['A-28'], allowance: 2, assign: { 'RES-05': 1 },
    basis: 'Ma trận quyền 3 vai trò × 5 nhóm chức năng 1h; che biển số và nhật ký 0,5h; ghi Quality Evidence 0,5h' },
  { id: 'A-67', name: 'Tích hợp bộ mô phỏng với luồng vào/ra đã sửa', product: 'P05', pred: ['A-63', 'A-45'], est: { o: 1, m: 2, p: 4 }, assign: { 'RES-01': 0.5, 'RES-05': 0.5 },
    basis: 'Chạy lại 7 kịch bản qua API 1h; sửa lỗi 1h' },
  { id: 'A-68', name: 'Kiểm thử mô-đun xe ra/vào', product: 'P05', pred: ['A-67'], est: { o: 2, m: 3, p: 5 }, cp: 'CP-05', assign: { 'RES-05': 0.5, 'RES-02': 0.5 },
    basis: 'Chạy T05-T13 1,5h; kịch bản 100 lượt 1h; ghi Quality Evidence 0,5h' },
  { id: 'A-70', name: 'Rà soát và sửa mô-đun đặt chỗ', product: 'P06', pred: ['A-23'], est: { o: 2, m: 3, p: 5 }, assign: { 'RES-04': 1 },
    basis: 'Đối chiếu FR-20 đến FR-25 1h; thống nhất mã lỗi (KB-11) 1h; test 1h' },
  { id: 'A-72', name: 'Kiểm thử mô-đun đặt chỗ', product: 'P06', pred: ['A-70'], est: { o: 2, m: 3, p: 5 }, assign: { 'RES-02': 1 },
    basis: 'Hết hạn và không đến, hủy, đến sớm, vào khu khác: 4 tình huống × 0,5h; ghi Quality Evidence 1h' },
  { id: 'A-74', name: 'Rà soát mô-đun thanh toán mô phỏng', product: 'P10', pred: ['A-63'], est: { o: 1.5, m: 2, p: 4 }, assign: { 'RES-01': 1 },
    basis: 'Đối chiếu FR-26 đến FR-28 sau khi sửa KB-02, KB-03 1h; lịch sử Customer và Manager 1h' },
  { id: 'A-76', name: 'Kiểm thử thanh toán mô phỏng', product: 'P10', pred: ['A-74'], allowance: 2, assign: { 'RES-04': 1 },
    basis: 'Độ chính xác phí 6 tổ hợp loại xe × nhóm (O4) 1h; giao dịch và lịch sử 0,5h; ghi Quality Evidence 0,5h' },
  { id: 'A-77', name: 'Rà soát và kiểm thử mô-đun báo cáo', product: 'P11', pred: ['A-96'], est: { o: 1.5, m: 2.5, p: 4 }, assign: { 'RES-05': 1 },
    basis: 'Đối chiếu 4 công thức D-30 với số tính tay trên dữ liệu mẫu 2h; ghi Quality Evidence 0,5h' },

  // ---------- G5 Testing & closure ----------
  { id: 'A-80', name: 'Hoàn thiện kế hoạch kiểm thử v1.0', product: 'P20', pred: ['A-96'], allowance: 2, assign: { 'RES-02': 1 },
    basis: 'Rà soát phạm vi và tiêu chí vào/ra cho P06, P10, P11 1h; ghi kết quả chạy lần đầu 1h' },
  { id: 'A-82', name: 'Viết kịch bản nghiệm thu chính AT-01 đến AT-07', product: 'P21', pred: ['A-80', 'A-09'], est: { o: 4, m: 5.25, p: 8 }, assign: { 'RES-02': 1 },
    basis: '7 kịch bản × 0,75h (xe máy, ô tô, quản lý bãi, RBAC và che biển số, đặt chỗ, thanh toán, báo cáo)' },
  { id: 'A-83', name: 'Viết kịch bản nghiệm thu ngoại lệ và kịch bản 100 lượt', product: 'P21', pred: ['A-80', 'A-09'], est: { o: 2, m: 3, p: 5 }, assign: { 'RES-04': 1 },
    basis: '5 AT-EX × 0,4h = 2h; kịch bản 100 lượt 1h' },
  { id: 'A-85', name: 'Review bộ test nghiệm thu và gửi khách hàng xác nhận', product: 'P21', pred: ['A-82', 'A-83'], allowance: 2.5, cp: 'CP-06', assign: { 'RES-02': 0.6, 'RES-03': 0.4 },
    basis: 'Review 1h; sửa 0,5h; email và ghi log 0,5h; điều phối 0,5h' },
  { id: 'A-95', name: 'Chạy thử sớm AT-01, AT-02 và kịch bản 100 lượt', product: 'P21', pred: ['A-85', 'A-67'], est: { o: 1.5, m: 2, p: 3.5 }, assign: { 'RES-02': 1 }, response: ['R-G5-01', 'R-G5-02'],
    basis: 'Dựng môi trường và reset dữ liệu 0,5h; chạy AT-01, AT-02 0,5h; 100 lượt 0,5h; ghi lỗi 0,5h' },
  { id: 'A-87', name: 'Chạy thử nghiệm thu nội bộ', product: 'P21', pred: ['A-95', 'A-68', 'A-49', 'A-31', 'A-61', 'A-72', 'A-76', 'A-77'], est: { o: 3.5, m: 5.1, p: 8 }, cp: 'CP-07', assign: { 'RES-02': 0.5, 'RES-04': 0.5 },
    basis: '12 AT × 0,3h = 3,6h; 100 lượt 0,5h; chỉnh kịch bản 0,5h; ghi Quality Evidence 0,5h' },
  { id: 'A-88', name: 'Trình diễn nghiệm thu với khách hàng', product: 'P14', pred: ['A-87', 'A-33'], est: { o: 2, m: 2.5, p: 5 }, cp: 'CP-08', assign: { 'RES-01': 0.5, 'RES-05': 0.5 },
    basis: 'Chuẩn bị môi trường và kịch bản 1h; quay video demo 1h; gửi email và ghi nhận 0,5h (Q23)' },
  { id: 'A-89', name: 'Viết báo cáo kết quả nghiệm thu', product: 'P14', pred: ['A-88'], est: { o: 2, m: 3, p: 5 }, assign: { 'RES-04': 0.5, 'RES-03': 0.5 },
    basis: 'Tổng hợp 12 AT và kịch bản 100 lượt 1h; số đo O3, O4 0,5h; lỗi còn mở 0,5h; viết 1h' },
  { id: 'A-90', name: 'Tổng hợp số liệu thực tế và so sánh với baseline', product: 'P17', pred: ['A-68'], est: { o: 2.5, m: 3.25, p: 5 }, assign: { 'RES-01': 1 },
    basis: 'Thu Task Log 5 × 0,25h = 1,25h; so sánh effort và tiến độ 1,5h; đối chiếu rủi ro 0,5h' },
  { id: 'A-92', name: 'Viết và rà soát báo cáo quản lý dự án cuối kỳ', product: 'P17', pred: ['A-90', 'A-87'], est: { o: 4, m: 5.5, p: 9 }, assign: { 'RES-03': 0.6, 'RES-02': 0.4 },
    basis: 'Phân tích kết quả theo O1-O5 1,5h; viết và định dạng 3h; review 2 người × 0,5h' },

  // ---------- Management (fixed / recurring) ----------
  { id: 'A-94', name: 'Ghi nhật ký dự án hằng tuần', product: 'P16', pred: [], allowance: 2, fixed: { weeks: ['W12', 'W13', 'W14', 'W15'], hoursPerWeek: { 'RES-01': 0.5 } },
    basis: '4 tuần × 0,5h' },
  { id: 'A-97', name: 'Họp tiến độ hằng tuần', product: 'P16', pred: [], allowance: 7.5, fixed: { weeks: ['W12', 'W13', 'W14'], hoursPerWeek: { 'RES-01': 0.5, 'RES-02': 0.5, 'RES-03': 0.5, 'RES-04': 0.5, 'RES-05': 0.5 } },
    basis: '3 tuần × 5 người × 0,5h; tuần 15 thay bằng A-91' },
  { id: 'A-91', name: 'Họp tổng kết và ghi bài học kinh nghiệm', product: 'P17', pred: [], allowance: 2.5, fixed: { weeks: ['W15'], hoursPerWeek: { 'RES-01': 0.5, 'RES-02': 0.5, 'RES-03': 0.5, 'RES-04': 0.5, 'RES-05': 0.5 } },
    basis: '5 người × 0,5h, thay họp tuần 15' },
  { id: 'A-99', name: 'Phân tích tác động sự kiện thay đổi và cập nhật baseline', product: 'P01', pred: [], allowance: 3, fixed: { weeks: ['W13', 'W14'], hoursPerWeek: { 'RES-01': 1.5 } },
    basis: 'Task 3.6: phân tích tác động 1,5h; phương án và CR, Baseline V2.0 nếu cần 1,5h' },
];

export const checkpoints = [
  { id: 'CP-01', trigger: 'Hoàn thành A-01 (SRS v1.0)', activity: 'A-09', criteria: '7 tiêu chí PD-P02 đạt; 100% hạng mục ở M1 1.4.1 có FR; biên bản review', approver: 'RES-01 (Tech lead) duyệt; RES-05 review', fail: 'Trả về A-01, sửa trong 2 ngày bằng dự phòng làm lại; A-82, A-83 chờ' },
  { id: 'CP-02', trigger: 'Hoàn thành A-22 (P18 v1.0 và hướng xử lý KB-xx)', activity: 'A-23', criteria: 'Mỗi khác biệt KB-01 đến KB-19 có quyết định (sửa mã, sửa spec, chấp nhận); hợp đồng vào/ra đóng băng; mỗi FR có endpoint hoặc thành phần', approver: 'RES-02 (QA) review; RES-01 (Tech lead) duyệt', fail: 'Không mở các hoạt động sửa mã A-28, A-44, A-63, A-65, A-70; sửa và review lại trong 1 ngày' },
  { id: 'CP-03', trigger: 'Hoàn thành A-24 (P03 v1.0)', activity: 'A-27', criteria: 'T-DB1 đến T-DB10 của PD-P03 đạt hoặc có ngoại lệ được duyệt', approver: 'RES-02 (QA)', fail: 'Sửa bằng migration mới hoặc cập nhật tiêu chí' },
  { id: 'CP-04', trigger: 'Bộ mô phỏng đã sửa (A-44)', activity: 'A-45', criteria: 'Bộ mô phỏng gửi sự kiện qua API; 100 lượt được tạo đủ; 5 ngoại lệ kích hoạt được', approver: 'RES-02 (QA)', fail: 'A-67 chờ; dùng dự phòng làm lại' },
  { id: 'CP-05', trigger: 'Luồng vào/ra đã sửa và tích hợp (A-67)', activity: 'A-68', criteria: 'T05-T13 đạt; 100 lượt mô phỏng có bản ghi hợp lệ (O2); chỗ trống khớp số đếm tay (O1)', approver: 'RES-02 (QA); video demo gửi khách hàng (Q23)', fail: 'Dùng dự phòng làm lại; nếu vượt, CR theo M1 1.7.1' },
  { id: 'CP-06', trigger: 'Hoàn thành A-82, A-83 (bộ test nghiệm thu)', activity: 'A-85', criteria: '9 tiêu chí PD-P21; khách hàng xác nhận danh sách qua email', approver: 'RES-03 review; khách hàng xác nhận', fail: 'Chạy với danh sách đề xuất, ghi giả định tạm vào Client Interaction Log' },
  { id: 'CP-07', trigger: 'Hoàn thành dry run A-87', activity: 'A-87', criteria: '100% AT Must đạt; AT Should/Could đạt hoặc có lỗi mở được PM chấp nhận', approver: 'RES-02 (QA); RES-01 (PM) quyết định demo', fail: 'Sửa lỗi và chạy lại AT không đạt; nếu thiếu thời gian, lùi theo Q22 (báo cáo, thanh toán, đặt chỗ)' },
  { id: 'CP-08', trigger: 'Trình diễn nghiệm thu A-88', activity: 'A-88', criteria: 'Khách hàng xác nhận kết quả theo Q11', approver: 'Khách hàng (thầy Nguyễn Minh Tâm)', fail: 'Ghi lỗi còn mở vào P14; xử lý theo CR' },
];

export const milestones = [
  { id: 'M-01', name: 'Baseline V1.0 nộp và gửi khách hàng duyệt', date: '2026-11-09', after: [], evidence: 'Email gửi khách hàng (Q19)' },
  { id: 'M-02', name: 'Hoàn tất review thiết kế (CP-01 đến CP-03)', after: ['A-09', 'A-23', 'A-27'], evidence: 'Biên bản review CP-01, CP-02, CP-03' },
  { id: 'M-03', name: 'Hoàn tất sửa và kiểm thử mô-đun', after: ['A-68', 'A-49', 'A-72', 'A-76', 'A-77'], evidence: 'Quality Evidence; video demo gửi khách hàng (Q23)' },
  { id: 'M-04', name: 'Nghiệm thu', after: ['A-88'], evidence: 'Video demo và email xác nhận của khách hàng (Q23, Q11)' },
  { id: 'M-05', name: 'Nộp báo cáo cuối kỳ', date: '2026-12-07', after: ['A-92', 'A-89'], evidence: 'Nộp LMS' },
];

// L and I scales are defined in report 2.8.1. prob in %, hours = extra person-hours if it happens.
// residual = probability after the planned response activity (used for the rework reserve, option A).
export const risks = [
  { id: 'R-G1-01', owner: 'RES-04', acts: ['A-16', 'A-01'], event: 'Khách hàng phản hồi vòng 3 hoặc duyệt Baseline muộn, hoặc trả lời khác giả định (Q19)', prob: 40, hours: 4, delay: 'Không găng', L: 3, I: 1, reduce: 'Gửi câu hỏi vòng 3 ngay đầu W12; ghi giả định bằng mã AS', contingency: 'Đóng băng giả định vào Baseline V1.0; thay đổi sau đó qua CR', residual: 40 },
  { id: 'R-G2-01', owner: 'RES-03', acts: ['A-49'], event: 'Cập nhật chỗ trống qua SSE không ổn định khi kiểm thử, không đạt O1', prob: 25, hours: 4, delay: 'Không găng', L: 2, I: 1, reduce: 'Kiểm thử thủ công TC-AV sớm trong A-49', contingency: 'Chuyển màn hình chỗ trống sang làm mới theo chu kỳ', residual: 25 },
  { id: 'R-G2-02', owner: 'RES-03', acts: ['A-22', 'A-44', 'A-63'], event: 'Sửa hợp đồng API vào/ra (KB-01) làm hỏng bộ mô phỏng hoặc màn hình Staff', prob: 35, hours: 5, delay: '1 ngày trên đường găng', L: 3, I: 2, reduce: 'Đóng băng hợp đồng tại CP-02; bộ kiểm thử hợp đồng A-79', contingency: 'Giữ endpoint cũ song song đến khi hai phía đã chuyển', residual: 15 },
  { id: 'R-G4-01', owner: 'RES-01', acts: ['A-63', 'A-67', 'A-68'], event: 'Sửa luồng vào/ra (KB-02 đến KB-05) gây lỗi hồi quy ở chỗ trống hoặc ngoại lệ', prob: 35, hours: 6, delay: '1 ngày trên đường găng', L: 3, I: 2, reduce: 'Chạy bộ kiểm thử tự động sau mỗi thay đổi; kiểm thử đồng thời có sẵn', contingency: 'Hoàn tác thay đổi gây lỗi, ghi khác biệt là ngoại lệ chấp nhận', residual: 20 },
  { id: 'R-G4-03', owner: 'RES-02', acts: ['A-96'], event: 'Lần chạy kiểm thử tự động đầu tiên lỗi nhiều (bộ test chưa từng chạy trên máy nhóm)', prob: 40, hours: 6, delay: '1-2 ngày', L: 3, I: 3, reduce: 'Chạy A-96 ngay ngày đầu W12, trước mọi hoạt động sửa mã', contingency: 'Ưu tiên sửa lỗi của mô-đun Must; lỗi Should/Could vào danh sách lỗi mở', residual: 25 },
  { id: 'R-G4-02', owner: 'RES-01', acts: ['W12-W15'], event: 'Thành viên không giữ được 8h/tuần ở W12-W15 do lịch thi và môn học khác', prob: 30, hours: 0, delay: '1-2 ngày', L: 2, I: 3, reduce: 'Ghi giờ thực tế hằng tuần (A-94); leo thang mức 1 khi thiếu > 2h/tuần', contingency: 'Dùng float cuối lịch; nếu vẫn thiếu, lùi theo Q22 (báo cáo, thanh toán, đặt chỗ)', residual: 30, capacityRisk: true },
  { id: 'R-G5-01', owner: 'RES-02', acts: ['A-87'], event: 'Mô-đun chưa sửa xong khi dry run', prob: 35, hours: 2, delay: '1-2 ngày trên đường găng', L: 3, I: 3, reduce: 'Chạy thử sớm A-95; theo dõi trạng thái trong nhật ký tuần', contingency: 'Chạy A-87 theo đợt; AT chưa chạy ghi lý do vào P14', residual: 20 },
  { id: 'R-G5-02', owner: 'RES-02', acts: ['A-87', 'A-88'], event: 'Dry run phát hiện nhiều lỗi hơn dự kiến', prob: 45, hours: 4, delay: '1-2 ngày trên đường găng', L: 3, I: 3, reduce: 'A-95 lộ lỗi sớm; phân loại lỗi ngay khi gặp', contingency: 'Chỉ chạy lại AT không đạt; lỗi không chặn ghi vào P14', residual: 30 },
  { id: 'R-G5-03', owner: 'RES-02', acts: ['A-85', 'A-88'], event: 'Khách hàng không phản hồi xác nhận kịch bản hoặc demo (Q19)', prob: 40, hours: 2, delay: '2-3 ngày', L: 3, I: 3, reduce: 'Gửi ngay sau review, nhắc sau 2 ngày', contingency: 'Chạy theo danh sách đề xuất, ghi trạng thái chờ xác nhận', residual: 40 },
];

export const objectives = [
  { id: 'O1', name: 'Biết trước chỗ trống', products: ['P09', 'P05', 'P03'], tests: ['T05', 'T-DB6', 'AT-01', 'AT-02'], cps: ['CP-05'] },
  { id: 'O2', name: 'Số hóa quy trình vào/ra', products: ['P05', 'P04', 'P22'], tests: ['T11', 'AT-100'], cps: ['CP-04', 'CP-05'] },
  { id: 'O3', name: 'Theo dõi nhu cầu sử dụng', products: ['P06', 'P11', 'P09'], tests: ['AT-05', 'AT-07'], cps: ['CP-07'] },
  { id: 'O4', name: 'Tính phí và xử lý ngoại lệ nhất quán', products: ['P05', 'P10', 'P21'], tests: ['AT-06', 'AT-EX01', 'AT-EX02', 'AT-EX03', 'AT-EX04', 'AT-EX05'], cps: ['CP-06', 'CP-08'] },
  { id: 'O5', name: 'Bàn giao đạt nghiệm thu', products: ['P14', 'P21', 'P07', 'P08'], tests: ['AT-03', 'AT-04'], cps: ['CP-07', 'CP-08'] },
];
