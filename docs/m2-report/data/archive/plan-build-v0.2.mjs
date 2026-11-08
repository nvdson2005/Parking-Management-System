// Single source of truth for the Milestone 2 baseline (Baseline V1.0).
// Every table, schedule and diagram in the report is generated from this file.
// Effort unit: person-hours. PERT: E = (O + 4M + P) / 6, sigma = (P - O) / 6.

export const calendar = {
  projectStart: '2026-09-14',
  baselineStart: '2026-11-09', // M2 deadline = Baseline V1.0 start
  finalDeadline: '2026-12-07',
  weeks: [
    { id: 'W12', start: '2026-11-09', hoursPerPerson: 8 },
    { id: 'W13', start: '2026-11-16', hoursPerPerson: 12 },
    { id: 'W14', start: '2026-11-23', hoursPerPerson: 12 },
    { id: 'W15', start: '2026-11-30', hoursPerPerson: 12 },
  ],
  workdaysPerWeek: 5,
  rateVND: 50000, // same proxy rate as M1 1.3.3
};

export const resources = [
  { id: 'RES-01', name: 'Nguyễn Võ Đức Sơn', role: 'PM, Trưởng nhóm kỹ thuật', skill: 'Điều phối, kiến trúc, backend nghiệp vụ', note: 'Bỏ vai trò QA (chuyển cho RES-02) để giảm tải review' },
  { id: 'RES-02', name: 'Đào Xuân Sơn', role: 'BA, Phụ trách chất lượng (QA)', skill: 'Yêu cầu, kiểm thử nghiệm thu', note: 'Nhận vai trò QA từ M2 (thay đổi so với M1 1.5)' },
  { id: 'RES-03', name: 'Nguyễn Phạm Mạnh Dũng', role: 'Kiến trúc và dữ liệu', skill: 'Thiết kế API, CSDL, xác thực', note: 'Nằm đầu chuỗi phụ thuộc (P18, P03, P07)' },
  { id: 'RES-04', name: 'Phạm Duy Quý', role: 'Yêu cầu và giao diện', skill: 'SRS, wireframe, giao diện web', note: '' },
  { id: 'RES-05', name: 'Nguyễn Tuấn Thành', role: 'Mô phỏng và giám sát', skill: 'Bộ mô phỏng, hiển thị chỗ trống, kiểm thử', note: '' },
];

// type: D = deliverable, I = intermediate. group: PBS branch. status: planned | done | deferred
export const productGroups = [
  { id: 'PG-1', name: 'Phần mềm bàn giao', parent: 'P00' },
  { id: 'PG-2', name: 'Tài liệu bàn giao', parent: 'P00' },
  { id: 'PG-3', name: 'Sản phẩm quản lý dự án', parent: 'P00' },
  { id: 'PG-4', name: 'Sản phẩm trung gian', parent: 'P00' },
];

export const products = [
  { id: 'P00', name: 'Hệ thống quản lý bãi đỗ xe thông minh (dự án)', type: 'D', group: null, status: 'planned', acceptance: 'Workflow cốt lõi chạy xuyên suốt, xử lý 5 ngoại lệ, đạt yêu cầu đã thống nhất (Q11)' },
  { id: 'P07', name: 'Mô-đun xác thực và phân quyền', type: 'D', group: 'PG-1', status: 'planned', inc: 1, acceptance: 'Đăng ký, đăng nhập, RBAC 3 vai trò, che biển số, nhật ký truy cập (CN4)' },
  { id: 'P08', name: 'Mô-đun quản lý thông tin bãi', type: 'D', group: 'PG-1', status: 'planned', inc: 1, acceptance: 'Manager quản lý tên bãi, địa chỉ, khu vực, sức chứa theo loại xe, trạng thái, bảng giá (Q14)' },
  { id: 'P05', name: 'Mô-đun quản lý xe ra/vào', type: 'D', group: 'PG-1', status: 'planned', inc: 2, acceptance: 'Ghi nhận vào/ra, cập nhật chỗ trống, xử lý 5 ngoại lệ (PD-P05)' },
  { id: 'P09', name: 'Mô-đun hiển thị tình trạng chỗ đỗ', type: 'D', group: 'PG-1', status: 'planned', inc: 2, acceptance: 'Số chỗ trống theo khu vực và loại xe khớp số đếm tay (O1)' },
  { id: 'P06', name: 'Mô-đun đặt chỗ', type: 'D', group: 'PG-1', status: 'deferred', inc: 3, acceptance: 'Hoãn theo Q22 (Should); ứng viên Baseline V2.0' },
  { id: 'P10', name: 'Mô-đun thanh toán mô phỏng', type: 'D', group: 'PG-1', status: 'deferred', inc: 3, acceptance: 'Hoãn theo Q22 (Should); ứng viên Baseline V2.0' },
  { id: 'P11', name: 'Mô-đun báo cáo', type: 'D', group: 'PG-1', status: 'deferred', inc: 3, acceptance: 'Hoãn theo Q22 (Could); ứng viên Baseline V2.0' },
  { id: 'P13', name: 'Hướng dẫn cài đặt và chạy demo', type: 'D', group: 'PG-2', status: 'planned', acceptance: 'Người không phải tác giả chạy được demo chỉ bằng hướng dẫn' },
  { id: 'P14', name: 'Báo cáo kết quả kiểm thử nghiệm thu', type: 'D', group: 'PG-2', status: 'planned', acceptance: 'Kết quả 9 AT và kịch bản 100 lượt; số đo O4' },
  { id: 'P12', name: 'Hướng dẫn sử dụng', type: 'D', group: 'PG-2', status: 'deferred', acceptance: 'Hoãn; thay bằng phần hướng dẫn thao tác trong P13' },
  { id: 'P01', name: 'Project Baseline V1.0 (báo cáo M2)', type: 'D', group: 'PG-3', status: 'done', acceptance: 'Được nhóm thống nhất và gửi khách hàng duyệt qua email (Q19)' },
  { id: 'P15', name: 'Client Interaction Log', type: 'D', group: 'PG-3', status: 'planned', acceptance: 'Mọi trao đổi ghi trong 24 giờ (M1 1.7.3)' },
  { id: 'P16', name: 'Nhật ký dự án hằng tuần', type: 'D', group: 'PG-3', status: 'planned', acceptance: 'Mỗi tuần một dòng kế hoạch/thực tế (Task 3.2)' },
  { id: 'P17', name: 'Báo cáo quản lý dự án cuối kỳ', type: 'D', group: 'PG-3', status: 'planned', acceptance: 'So sánh baseline với thực tế, bài học kinh nghiệm (Task 4)' },
  { id: 'P23', name: 'Tài liệu định nghĩa dự án (báo cáo M1)', type: 'D', group: 'PG-3', status: 'done', acceptance: 'Đã nộp M1' },
  { id: 'P24', name: 'Ma trận truy vết', type: 'I', group: 'PG-3', status: 'planned', acceptance: 'Nằm trong P01 mục 2.13 và workbook; cập nhật mỗi checkpoint' },
  { id: 'P02', name: 'Đặc tả yêu cầu phần mềm (SRS)', type: 'I', group: 'PG-4', status: 'planned', acceptance: '7 tiêu chí chất lượng PD-P02' },
  { id: 'P18', name: 'Thiết kế kiến trúc và API', type: 'I', group: 'PG-4', status: 'planned', acceptance: 'Qua review CP-02' },
  { id: 'P03', name: 'Thiết kế CSDL', type: 'I', group: 'PG-4', status: 'planned', acceptance: '11 tiêu chí chất lượng PD-P03' },
  { id: 'P19', name: 'Thiết kế giao diện (wireframe)', type: 'I', group: 'PG-4', status: 'planned', acceptance: 'Đủ màn hình cho luồng cốt lõi theo vai trò' },
  { id: 'P04', name: 'Bộ mô phỏng thiết bị', type: 'I', group: 'PG-4', status: 'planned', acceptance: '10 tiêu chí chất lượng PD-P04' },
  { id: 'P22', name: 'Dữ liệu mô phỏng bãi thí điểm', type: 'I', group: 'PG-4', status: 'planned', acceptance: '3 khu vực, khoảng 300 chỗ xe máy và 30 chỗ ô tô (Q24)' },
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
  ['P02', 'P21'], ['P20', 'P21'], ['P04', 'P21'],
  ['P21', 'P14'], ['P05', 'P14'], ['P07', 'P14'], ['P08', 'P14'], ['P09', 'P14'], ['P13', 'P14'],
  ['P03', 'P13'], ['P04', 'P13'],
  ['P14', 'P17'], ['P16', 'P17'], ['P01', 'P16'], ['P01', 'P24'], ['P24', 'P17'],
];

// boost: scheduling priority bonus for integration enablers (gate the A-67 integration).
// assign: share of the activity's effort per resource (sums to 1).
// fixed: recurring/time-boxed work booked on given weeks instead of scheduled by the leveller.
export const activities = [
  // ---------- G1 Requirements & UI ----------
  { id: 'A-01', name: 'Viết SRS v1.0 phạm vi Must', product: 'P02', pred: [], est: { o: 9, m: 12, p: 17 }, assign: { 'RES-04': 0.65, 'RES-02': 0.35 },
    basis: 'Khung và phần 1-2: 1h; FR nền tảng 6 × 0,25h = 1,5h; FR xe vào/ra 7 × 0,3h = 2,1h; FR chỗ trống 4 × 0,3h = 1,2h; FR thông tin bãi 6 × 0,25h = 1,5h; NFR 8 × 0,25h = 2h; ma trận 5 EX × 0,3h = 1,5h; phần 6-8: 1h' },
  { id: 'A-09', name: 'Review SRS', product: 'P02', pred: ['A-01'], allowance: 3, cp: 'CP-01', assign: { 'RES-04': 0.5, 'RES-05': 1 / 3, 'RES-01': 1 / 6 },
    basis: 'RES-05 đọc toàn bộ 1h; RES-01 đọc phần Must liên quan kiến trúc 0,5h; tác giả sửa sau review 1,5h' },
  { id: 'A-13', name: 'Thiết kế giao diện luồng cốt lõi', product: 'P19', pred: ['A-01'], est: { o: 3.5, m: 4.5, p: 7 }, assign: { 'RES-04': 1 },
    basis: '7 màn hình × 0,5h = 3,5h (đăng nhập/đăng ký, bãi, khu vực và sức chứa, xe vào, xe ra và ngoại lệ, chỗ trống, tài khoản và nhật ký); luồng điều hướng theo vai trò 1h' },
  { id: 'A-16', name: 'Gửi câu hỏi vòng 3 và cập nhật Client Interaction Log', product: 'P15', pred: [], allowance: 2, fixed: { weeks: ['W12', 'W13'], hoursPerWeek: { 'RES-01': 1 } },
    basis: 'Rút gọn câu hỏi vòng 3 còn các câu thuộc phạm vi Must 0,5h; ghi phản hồi 1h; cập nhật giả định SRS 0,5h' },
  { id: 'A-30', name: 'Xây dựng che biển số, nhật ký truy cập và màn hình tài khoản', product: 'P07', pred: ['A-28'], est: { o: 3.5, m: 4.5, p: 8 }, assign: { 'RES-02': 1 },
    basis: 'Che biển số 1h; ghi và xem nhật ký truy cập 1,5h; màn hình quản lý tài khoản của Manager 1,5h; unit test 0,5h' },
  { id: 'A-66', name: 'Xây dựng màn hình ghi nhận xe vào/ra', product: 'P05', pred: ['A-63', 'A-13'], est: { o: 3.5, m: 4.5, p: 8 }, assign: { 'RES-04': 1 },
    basis: 'Màn hình vào 1,5h; màn hình ra 1,5h; thông báo lỗi và cảnh báo ngoại lệ 1h; responsive 0,5h' },
  { id: 'A-89', name: 'Viết báo cáo kết quả nghiệm thu', product: 'P14', pred: ['A-88'], est: { o: 2, m: 3, p: 5 }, assign: { 'RES-04': 0.5, 'RES-03': 0.5 },
    basis: 'Tổng hợp 9 AT và kịch bản 100 lượt 1h; số đo O4 0,5h; lỗi còn mở 0,5h; viết 1h' },

  // ---------- G2 Architecture, data, auth ----------
  { id: 'A-20', name: 'Chọn công nghệ và thiết kế kiến trúc tổng thể', product: 'P18', pred: [], est: { o: 3.5, m: 5, p: 9 }, assign: { 'RES-01': 1 },
    basis: 'So sánh stack 1,5h; sơ đồ thành phần 1,5h; luồng sự kiện vào/ra và cập nhật chỗ trống qua SSE 1h; phân quyền, che biển số, đa bãi 0,5h; cấu trúc repo và linter 0,5h' },
  { id: 'A-21', name: 'Thiết kế quy ước API và hợp đồng sự kiện vào/ra', product: 'P18', pred: ['A-20'], est: { o: 2, m: 3, p: 5 }, assign: { 'RES-01': 0.5, 'RES-05': 0.5 },
    basis: 'Quy ước chung 1h; hợp đồng sự kiện vào/ra cho P04 và P05 1,5h; ví dụ yêu cầu/phản hồi 0,5h' },
  { id: 'A-22', boost: 10, name: 'Đặc tả API mô-đun cốt lõi', product: 'P18', pred: ['A-21'], est: { o: 3, m: 4.5, p: 8 }, assign: { 'RES-01': 0.5, 'RES-03': 0.5 },
    basis: '16 endpoint × 0,25h = 4h (tài khoản 5, bãi 6, vào/ra 3, chỗ trống 2); đối chiếu SRS 0,5h' },
  { id: 'A-23', name: 'Review kiến trúc và API', product: 'P18', pred: ['A-22', 'A-09'], allowance: 2, cp: 'CP-02', assign: { 'RES-02': 0.5, 'RES-03': 0.5 },
    basis: '1 người đọc 1h (QA) + sửa sau review 1h (tác giả)' },
  { id: 'A-24', name: 'Thiết kế ERD và từ điển dữ liệu', product: 'P03', pred: [], est: { o: 4, m: 5.5, p: 9 }, assign: { 'RES-03': 1 },
    basis: '10 thực thể × 0,3h = 3h; quan hệ, khóa, đa bãi 1h; chỗ trống và ràng buộc một lượt mở 0,5h; từ điển dữ liệu 1h' },
  { id: 'A-26', name: 'Viết và kiểm thử script lược đồ, dữ liệu mẫu, script lưu giữ', product: 'P03', pred: ['A-24'], est: { o: 3.5, m: 5, p: 9 }, assign: { 'RES-03': 1 },
    basis: 'Script lược đồ 2h; seed 0,5h; script lưu giữ biển số 12 tháng 1h; kiểm thử T-DB 1,5h' },
  { id: 'A-27', name: 'Review thiết kế CSDL', product: 'P03', pred: ['A-26'], allowance: 1.5, cp: 'CP-03', assign: { 'RES-02': 2 / 3, 'RES-03': 1 / 3 },
    basis: '1 người đọc 1h + sửa 0,5h' },
  { id: 'A-28', name: 'Xây dựng đăng ký, đăng nhập, phiên và RBAC', product: 'P07', pred: ['A-21', 'A-26'], est: { o: 4, m: 5.5, p: 10 }, assign: { 'RES-03': 1 },
    basis: 'Đăng ký và băm mật khẩu 1,5h; đăng nhập, đăng xuất, phiên 1,5h; RBAC dùng chung 2h; unit test 0,5h' },
  { id: 'A-90', name: 'Tổng hợp số liệu thực tế và so sánh với baseline', product: 'P17', pred: ['A-68'], est: { o: 2.5, m: 3.25, p: 5 }, assign: { 'RES-01': 1 },
    basis: 'Thu Task Log 5 × 0,25h = 1,25h; so sánh effort và tiến độ 1,5h; đối chiếu rủi ro 0,5h' },

  // ---------- G3 Simulator & display ----------
  { id: 'A-40', name: 'Xây dựng cấu hình, bộ sinh dữ liệu giả và bộ sinh sự kiện', product: 'P04', pred: [], est: { o: 3.5, m: 4.5, p: 7 }, assign: { 'RES-05': 1 },
    basis: 'Cấu hình và sinh biển số, mã QR/RFID giả có cờ mô phỏng 2h; sinh sự kiện vào/ra có seed 2h; unit test 0,5h' },
  { id: 'A-42', boost: 10, name: 'Xây dựng bộ gửi sự kiện và nhật ký chạy', product: 'P04', pred: ['A-40', 'A-21'], est: { o: 2.5, m: 3.5, p: 6 }, assign: { 'RES-05': 1 },
    basis: 'Client gửi theo hợp đồng và stub P05 2h; nhật ký chạy (seed, cấu hình, kết quả) 1h; unit test 0,5h' },
  { id: 'A-43', boost: 10, name: 'Xây dựng kịch bản mô phỏng và README', product: 'P04', pred: ['A-42'], est: { o: 3, m: 4, p: 6 }, assign: { 'RES-05': 1 },
    basis: '7 kịch bản (1 thường, 5 ngoại lệ, 1 tải ≥ 100 lượt) × 0,4h = 2,8h; README 1h' },
  { id: 'A-45', boost: 10, name: 'Kiểm thử và review bộ mô phỏng', product: 'P04', pred: ['A-43'], allowance: 2, cp: 'CP-04', assign: { 'RES-05': 0.5, 'RES-02': 0.5 },
    basis: 'Chạy tiêu chí 1-5, 7, 8 của PD-P04 1h; review 1h' },
  { id: 'A-47', boost: 10, name: 'Tạo dữ liệu mô phỏng bãi thí điểm', product: 'P22', pred: ['A-26', 'A-42'], est: { o: 1.5, m: 2, p: 4 }, assign: { 'RES-05': 1 },
    basis: 'Cấu hình 3 khu vực, 300 + 30 chỗ 1h; nạp và kiểm tra 1h' },
  { id: 'A-48', name: 'Xây dựng mô-đun hiển thị tình trạng chỗ đỗ', product: 'P09', pred: ['A-21', 'A-26', 'A-13'], est: { o: 5, m: 6.5, p: 11 }, assign: { 'RES-05': 1 },
    basis: 'API chỗ trống theo khu vực và loại xe 2h; màn hình 2,5h; cập nhật trực tiếp qua SSE 1h; unit test 1h' },
  { id: 'A-79', boost: 10, name: 'Xây dựng bộ kiểm thử hợp đồng API vào/ra', product: 'P05', pred: ['A-21'], est: { o: 1.5, m: 2, p: 3 }, assign: { 'RES-05': 1 }, response: ['R-G2-02', 'R-G3-01'],
    basis: 'Ca kiểm thử cho từng endpoint theo hợp đồng 1,5h; chạy với P04 và P05 0,5h' },
  { id: 'A-33', name: 'Viết hướng dẫn cài đặt và chạy demo', product: 'P13', pred: ['A-45'], allowance: 2, assign: { 'RES-03': 1 },
    basis: 'Cài đặt và nạp dữ liệu 1h; chạy bộ mô phỏng và kịch bản demo 1h' },
  { id: 'A-61', name: 'Kiểm thử mô-đun quản lý thông tin bãi', product: 'P08', pred: ['A-60', 'A-28'], allowance: 1.5, assign: { 'RES-01': 1 },
    basis: 'CRUD và phân quyền Manager 1h; ghi Quality Evidence 0,5h' },
  { id: 'A-68', name: 'Kiểm thử mô-đun xe ra/vào', product: 'P05', pred: ['A-66', 'A-67', 'A-30', 'A-45'], est: { o: 2, m: 3, p: 5 }, cp: 'CP-05', assign: { 'RES-05': 0.5, 'RES-02': 0.5 },
    basis: 'Chạy T05-T13 1,5h; kịch bản 100 lượt 1h; ghi Quality Evidence 0,5h' },

  // ---------- G4 Parking operations ----------
  { id: 'A-60', name: 'Xây dựng mô-đun quản lý thông tin bãi', product: 'P08', pred: ['A-21', 'A-26', 'A-13'], est: { o: 5.5, m: 7.5, p: 12 }, assign: { 'RES-04': 0.5, 'RES-01': 0.5 },
    basis: 'CRUD bãi 1,5h; khu vực 1,5h; sức chứa theo loại xe 1,5h; trạng thái hoạt động 0,5h; bảng giá theo loại xe/nhóm người dùng (lưu và hiển thị) 1h; phân quyền Manager 0,5h; unit test 1h' },
  { id: 'A-78', name: 'Thử nghiệm xử lý đồng thời cập nhật chỗ trống', product: 'P05', pred: ['A-26'], est: { o: 1.5, m: 2, p: 3 }, assign: { 'RES-01': 1 }, response: ['R-G4-01'],
    basis: 'Dựng kịch bản nhiều lượt cùng lúc 1h; thử giao dịch/khóa theo khu vực 1h' },
  { id: 'A-63', name: 'Xây dựng API sự kiện vào/ra và cập nhật chỗ trống', product: 'P05', pred: ['A-21', 'A-26', 'A-78'], est: { o: 5.5, m: 7.5, p: 12 }, assign: { 'RES-03': 0.5, 'RES-04': 0.5 },
    basis: 'Endpoint vào 1,5h; endpoint ra 1,5h; kiểm tra dữ liệu 1h; đếm lượt mở và cập nhật 1,5h; giao dịch/khóa 1h; unit test 1h' },
  { id: 'A-65', name: 'Xây dựng xử lý 5 ngoại lệ xe vào/ra', product: 'P05', pred: ['A-63'], est: { o: 4, m: 5.5, p: 9 }, assign: { 'RES-03': 0.5, 'RES-01': 0.5 },
    basis: '5 ngoại lệ (bãi hết chỗ, biển số không khớp, mất QR/thẻ, xe đã có lượt mở, bãi tạm ngưng) × 1h; ghi session_events 0,5h' },
  { id: 'A-67', name: 'Tích hợp mô-đun xe ra/vào với bộ mô phỏng', product: 'P05', pred: ['A-65', 'A-42', 'A-47', 'A-79', 'A-23'], est: { o: 1.5, m: 2.5, p: 5 }, assign: { 'RES-01': 0.5, 'RES-05': 0.5 },
    basis: 'Kết nối theo hợp đồng 1h; chạy kịch bản và sửa lỗi 1,5h' },
  { id: 'A-49', name: 'Kiểm thử mô-đun hiển thị chỗ trống', product: 'P09', pred: ['A-48', 'A-67'], allowance: 2, assign: { 'RES-04': 1 },
    basis: 'So số đếm tay sau kịch bản P04 1h; đo độ trễ cập nhật 0,5h; ghi Quality Evidence 0,5h' },
  { id: 'A-31', name: 'Kiểm thử mô-đun xác thực và phân quyền', product: 'P07', pred: ['A-30'], allowance: 2, assign: { 'RES-05': 1 },
    basis: 'Ma trận quyền 3 vai trò × 5 nhóm chức năng 1h; che biển số và nhật ký 0,5h; ghi Quality Evidence 0,5h' },

  // ---------- G5 Testing & closure ----------
  { id: 'A-80', name: 'Viết kế hoạch kiểm thử', product: 'P20', pred: ['A-01'], est: { o: 2.5, m: 3.5, p: 6 }, assign: { 'RES-02': 1 },
    basis: 'Mức kiểm thử và phạm vi 1h; ánh xạ O1, O2, O4, O5 sang cách đo 1h; môi trường, dữ liệu, tiêu chí vào/ra 1h; quản lý lỗi 0,5h' },
  { id: 'A-82', name: 'Viết kịch bản nghiệm thu chính AT-01 đến AT-04', product: 'P21', pred: ['A-80', 'A-09'], est: { o: 2, m: 3, p: 5 }, assign: { 'RES-02': 1 },
    basis: '4 kịch bản × 0,75h (xe máy vào/ra, ô tô vào/ra, Manager quản lý bãi, RBAC và che biển số)' },
  { id: 'A-83', name: 'Viết kịch bản nghiệm thu ngoại lệ và kịch bản 100 lượt', product: 'P21', pred: ['A-80', 'A-09'], est: { o: 2, m: 3, p: 5 }, assign: { 'RES-02': 1 },
    basis: '5 AT-EX × 0,4h = 2h; kịch bản 100 lượt 1h' },
  { id: 'A-85', name: 'Review bộ test nghiệm thu và gửi khách hàng xác nhận', product: 'P21', pred: ['A-82', 'A-83'], allowance: 2.5, cp: 'CP-06', assign: { 'RES-02': 0.6, 'RES-04': 0.4 },
    basis: 'Review 1h (RES-04); sửa 0,5h; email và ghi log 0,5h; điều phối 0,5h' },
  { id: 'A-95', name: 'Chạy thử sớm AT-01, AT-02 và kịch bản 100 lượt', product: 'P21', pred: ['A-85', 'A-67'], est: { o: 1.5, m: 2, p: 3.5 }, assign: { 'RES-02': 1 }, response: ['R-G5-01', 'R-G5-02'],
    basis: 'Dựng môi trường và script reset 0,5h; chạy AT-01, AT-02 0,5h; 100 lượt 0,5h; ghi lỗi 0,5h' },
  { id: 'A-87', name: 'Chạy thử nghiệm thu nội bộ', product: 'P21', pred: ['A-95', 'A-68', 'A-49', 'A-31', 'A-61'], est: { o: 3, m: 4.2, p: 7 }, cp: 'CP-07', assign: { 'RES-02': 0.5, 'RES-04': 0.5 },
    basis: '9 AT × 0,3h = 2,7h; 100 lượt 0,5h; chỉnh kịch bản 0,5h; ghi Quality Evidence 0,5h' },
  { id: 'A-88', name: 'Trình diễn nghiệm thu với khách hàng', product: 'P14', pred: ['A-87', 'A-33'], est: { o: 2, m: 2.5, p: 5 }, cp: 'CP-08', assign: { 'RES-01': 0.5, 'RES-05': 0.5 },
    basis: 'Chuẩn bị môi trường và kịch bản 1h; quay video demo 1h; gửi email và ghi nhận 0,5h (Q23)' },
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
  { id: 'CP-01', trigger: 'Hoàn thành A-01 (SRS v1.0)', activity: 'A-09', criteria: '7 tiêu chí PD-P02 đạt; 100% hạng mục Must ở M1 1.4.1 có FR; biên bản review', approver: 'RES-01 (Tech lead) duyệt; RES-02 (QA) xác nhận', fail: 'Trả về A-01, sửa trong 2 ngày dùng dự phòng làm lại; A-22, A-80 chờ' },
  { id: 'CP-02', trigger: 'Hoàn thành A-22 (đặc tả API)', activity: 'A-23', criteria: 'Hợp đồng sự kiện vào/ra đóng băng; mỗi FR Must có endpoint; bộ kiểm thử hợp đồng A-79 chạy được', approver: 'RES-02 (QA) review; RES-01 (Tech lead) duyệt', fail: 'Không mở A-28, A-60, A-63, A-48; sửa và review lại trong 1 ngày' },
  { id: 'CP-03', trigger: 'Hoàn thành A-26 (script CSDL)', activity: 'A-27', criteria: 'T-DB1 đến T-DB10 của PD-P03 đạt; script chạy trên CSDL trống', approver: 'RES-01 (Tech lead)', fail: 'Mô-đun nghiệp vụ chờ; sửa bằng migration mới' },
  { id: 'CP-04', trigger: 'Kết thúc increment 1 (P07, P08, P04)', activity: 'A-45', criteria: 'Demo đăng nhập theo vai trò, Manager quản lý bãi, bộ mô phỏng chạy 100 lượt tới stub', approver: 'RES-02 (QA) nội bộ; video demo gửi khách hàng (Q23)', fail: 'Phần chưa đạt chuyển sang đầu increment 2; báo PM theo mức leo thang 1' },
  { id: 'CP-05', trigger: 'Kết thúc increment 2 (P05, P09)', activity: 'A-68', criteria: 'T05-T13 đạt; 100 lượt mô phỏng có bản ghi hợp lệ (O2); chỗ trống khớp số đếm tay (O1)', approver: 'RES-02 (QA); video demo gửi khách hàng (Q23)', fail: 'Dùng dự phòng làm lại; nếu vượt, CR theo M1 1.7.1' },
  { id: 'CP-06', trigger: 'Hoàn thành A-82, A-83 (bộ test nghiệm thu)', activity: 'A-85', criteria: '9 tiêu chí PD-P21; khách hàng xác nhận danh sách qua email', approver: 'RES-04 review; khách hàng xác nhận', fail: 'Chạy với danh sách đề xuất, ghi giả định tạm vào Client Interaction Log' },
  { id: 'CP-07', trigger: 'Hoàn thành dry run A-87', activity: 'A-87', criteria: '100% AT Must đạt hoặc có lỗi mở được PM chấp nhận', approver: 'RES-02 (QA); RES-01 (PM) quyết định demo', fail: 'Sửa lỗi và chạy lại AT không đạt; lùi demo tối đa 2 ngày' },
  { id: 'CP-08', trigger: 'Trình diễn nghiệm thu A-88', activity: 'A-88', criteria: 'Khách hàng xác nhận kết quả theo Q11', approver: 'Khách hàng (thầy Nguyễn Minh Tâm)', fail: 'Ghi lỗi còn mở vào P14; xử lý theo CR' },
];

export const milestones = [
  { id: 'M-01', name: 'Baseline V1.0 nộp và gửi khách hàng duyệt', date: '2026-11-09', after: [] },
  { id: 'M-02', name: 'Kết thúc increment 1', after: ['A-45', 'A-61', 'A-28'] },
  { id: 'M-03', name: 'Kết thúc increment 2', after: ['A-68', 'A-49'] },
  { id: 'M-04', name: 'Nghiệm thu', after: ['A-88'] },
  { id: 'M-05', name: 'Nộp báo cáo cuối kỳ', date: '2026-12-07', after: ['A-92', 'A-89'] },
];

// L and I scales are defined in report 2.8.1. prob in %, hours = extra person-hours if it happens.
// residual = probability after the planned response activity (used for the rework reserve, option A).
export const risks = [
  { id: 'R-G1-01', owner: 'RES-04', acts: ['A-16', 'A-01'], event: 'Khách hàng phản hồi vòng 3 hoặc duyệt Baseline muộn, hoặc trả lời khác giả định (Q19)', prob: 40, hours: 4, delay: 'Không găng', L: 3, I: 1, reduce: 'Gửi câu hỏi vòng 3 ngay đầu W12, chỉ giữ câu thuộc phạm vi Must; ghi giả định bằng mã AS', contingency: 'Đóng băng giả định vào Baseline V1.0; thay đổi sau đó qua CR', residual: 40 },
  { id: 'R-G1-02', owner: 'RES-04', acts: ['A-01', 'A-09'], event: 'SRS mơ hồ hoặc thiếu truy vết nên CP-01 không đạt', prob: 30, hours: 5, delay: '1 ngày trên đường găng', L: 2, I: 3, reduce: 'Đồng tác giả BA (RES-02) viết A-01; tự kiểm 7 tiêu chí trước review', contingency: 'Sửa trong 2 ngày bằng dự phòng làm lại', residual: 30 },
  { id: 'R-G2-01', owner: 'RES-03', acts: ['A-20', 'A-48'], event: 'Cập nhật gần thời gian thực qua SSE không ổn định hoặc trễ, không đạt mục tiêu O1 (R5 ở M1)', prob: 30, hours: 6, delay: 'Không găng', L: 2, I: 2, reduce: 'Chốt cơ chế SSE ở A-20; đo độ trễ ngay trong A-48', contingency: 'Chuyển màn hình chỗ trống sang làm mới theo chu kỳ', residual: 30 },
  { id: 'R-G2-02', owner: 'RES-03', acts: ['A-21', 'A-40', 'A-63'], event: 'Hợp đồng API vào/ra đổi sau khi A-40, A-63 đã bắt đầu', prob: 25, hours: 6, delay: '1 ngày', L: 2, I: 2, reduce: 'Đóng băng hợp đồng tại CP-02; bộ kiểm thử hợp đồng A-79', contingency: 'Lớp chuyển đổi giữa hợp đồng cũ và mới', residual: 10 },
  { id: 'R-G2-03', owner: 'RES-03', acts: ['A-28', 'A-63', 'A-60'], event: 'Mô-đun xác thực (A-28) trễ, chặn mô-đun nghiệp vụ trên đường găng', prob: 40, hours: 3, delay: '2-3 ngày trên đường găng', L: 3, I: 4, reduce: 'Tái cấu trúc mạng: A-60, A-63, A-48 không chờ A-28, dùng phân quyền giả lập; tách A-28/A-30', contingency: 'Gắn P07 vào cuối increment 2 trước A-68', residual: 20 },
  { id: 'R-G3-01', owner: 'RES-05', acts: ['A-40', 'A-67'], event: 'Bộ mô phỏng chạy tốt với stub nhưng lệch khi nối P05 thật', prob: 35, hours: 4, delay: '1 ngày', L: 3, I: 1, reduce: 'Dùng chung bộ kiểm thử hợp đồng A-79', contingency: 'Giữ stub làm đường kiểm thử; chỉnh lớp client, không sửa bộ sinh', residual: 20 },
  { id: 'R-G3-02', owner: 'RES-05', acts: ['A-43', 'A-65', 'A-83'], event: 'Khách hàng thêm hoặc đổi ngoại lệ khi duyệt Baseline hoặc tại CP-06', prob: 25, hours: 4, delay: 'Không găng', L: 2, I: 1, reduce: 'Gửi danh sách 5 ngoại lệ cùng email duyệt Baseline', contingency: 'Ngoại lệ thêm muộn dùng dự phòng hoặc CR', residual: 25 },
  { id: 'R-G4-01', owner: 'RES-01', acts: ['A-63', 'A-67', 'A-68'], event: 'Nhiều lượt vào/ra gần như đồng thời làm lệch số chỗ trống (O1)', prob: 30, hours: 6, delay: '1 ngày trên đường găng', L: 2, I: 3, reduce: 'Thử nghiệm A-78 trước A-63; giao dịch và ràng buộc một lượt mở (T-DB5)', contingency: 'Khóa tuần tự theo khu vực, chấp nhận chậm hơn', residual: 15 },
  { id: 'R-G4-02', owner: 'RES-01', acts: ['W13-W15'], event: 'Thành viên không giữ được 12h/tuần ở W13-W15 do lịch thi và môn học khác', prob: 50, hours: 0, delay: '2-4 ngày trên đường găng', L: 3, I: 4, reduce: 'Đặt việc găng sớm; ghi giờ thực tế hằng tuần (A-94); leo thang mức 1 khi thiếu > 2h/tuần', contingency: 'Dùng dự phòng; nếu vẫn thiếu, CR giảm phạm vi trong nhóm Must với khách hàng duyệt', residual: 50, capacityRisk: true },
  { id: 'R-G5-01', owner: 'RES-02', acts: ['A-87'], event: 'Mô-đun chưa sẵn sàng khi dry run', prob: 45, hours: 2, delay: '2 ngày trên đường găng', L: 3, I: 3, reduce: 'Chạy thử sớm A-95; theo dõi trạng thái trong nhật ký tuần', contingency: 'Chạy A-87 theo đợt; AT chưa chạy ghi lý do vào P14', residual: 25 },
  { id: 'R-G5-02', owner: 'RES-02', acts: ['A-87', 'A-88'], event: 'Dry run phát hiện nhiều lỗi hơn dự kiến', prob: 55, hours: 4, delay: '1-2 ngày trên đường găng', L: 4, I: 3, reduce: 'A-95 lộ lỗi sớm; phân loại lỗi ngay khi gặp', contingency: 'Chỉ chạy lại AT không đạt; lỗi không chặn ghi vào P14', residual: 35 },
  { id: 'R-G5-03', owner: 'RES-02', acts: ['A-85', 'A-88'], event: 'Khách hàng không phản hồi xác nhận kịch bản hoặc demo (Q19)', prob: 40, hours: 2, delay: '2-3 ngày', L: 3, I: 3, reduce: 'Gửi ngay sau review, nhắc sau 2 ngày', contingency: 'Chạy theo danh sách đề xuất, ghi trạng thái chờ xác nhận', residual: 40 },
];

export const objectives = [
  { id: 'O1', name: 'Biết trước chỗ trống', products: ['P09', 'P05', 'P03'], tests: ['T05', 'T-DB6', 'AT-01', 'AT-02'], cps: ['CP-05'] },
  { id: 'O2', name: 'Số hóa quy trình vào/ra', products: ['P05', 'P04', 'P22'], tests: ['T11', 'AT-100'], cps: ['CP-05', 'CP-07'] },
  { id: 'O3', name: 'Theo dõi nhu cầu sử dụng', products: ['P09'], tests: ['AT-01'], cps: ['CP-05'], note: 'Báo cáo (P11) và đặt chỗ (P06) hoãn theo Q22; O3 chỉ đo phần công suất theo khu vực, phần còn lại chờ Baseline V2.0' },
  { id: 'O4', name: 'Xử lý ngoại lệ nhất quán', products: ['P05', 'P21'], tests: ['AT-EX01', 'AT-EX02', 'AT-EX03', 'AT-EX04', 'AT-EX05'], cps: ['CP-06', 'CP-08'], note: 'Đo độ chính xác tính phí hoãn cùng P10' },
  { id: 'O5', name: 'Bàn giao đạt nghiệm thu', products: ['P14', 'P21', 'P07', 'P08'], tests: ['AT-03', 'AT-04'], cps: ['CP-07', 'CP-08'] },
];
