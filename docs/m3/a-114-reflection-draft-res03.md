# A-114 Đóng góp cá nhân và tự đánh giá: BẢN NHÁP (RES-03)

Bản nháp này lập từ lịch sử repo. **Phần tự đánh giá phải viết lại bằng lời của chính bạn**, đúng với những gì bạn giải thích được khi vấn đáp. Sửa thoải mái trước khi nộp.

**Thành viên:** Nguyễn Phạm Mạnh Dũng (RES-03), Kiến trúc và dữ liệu
**Giai đoạn:** W12 đến 23/11/2026 (cập nhật vào cuối W14)

## Đóng góp (có bằng chứng)

| Mảng | Việc đã làm | Bằng chứng |
|---|---|---|
| Thiết kế CSDL (A-24) | P03 v0.3 (17/11) và v0.4 (22/11): đối chiếu đủ 9 câu trả lời vòng 3, cách tính 4 chỉ số (Q28), quyền đọc theo vai trò (Q34), chốt phạm vi khoảng trống (mục 11.1), ERD v0.4 | `1b0c77c`, `02072ca` (PR #10) |
| Rủi ro (A-102, Task 3.4) | Lập sổ rủi ro M3 từ V1.0; chấm lại theo CR-01; thêm R-M3-01 đến R-M3-07; đối chiếu Q27-Q35; soạn CR-03 | `risk-register.md` (PR #10) |
| Baseline (A-106, Task 3.7) | Ghi nhận đóng băng V1.0 (phát hiện P18 bị sửa đè lên file V1.0); sinh Baseline V2.0 bằng chính bộ lập lịch của V1.0; phát hiện kế hoạch vượt năng lực (116%, vượt khoảng 4 ngày làm việc) và đưa ra các lựa chọn | `1b0c77c`, `679946c` (PR #10) |
| Code (A-28) | Xóa biển số tự động sau 12 tháng (Q35); ghi LOGIN khi đăng ký (KB-07); trả 400 cho body hỏng (KB-14) | `bc172ce`, `38c7e20`, `2992cb0` (PR #11) |
| Code (A-65) | Staff tra cứu xe và đặt chỗ (Q34); 3 endpoint đọc (KB-15); 4 chỉ mục (G-07) | `49299ac`, `5882e49`, `d64e95f` (PR #11) |
| Theo dõi (A-101, A-103, Task 3.3) | Bảng kế hoạch so với thực tế, có giải thích các dòng lệch quá 20% | `00a7258` (PR #12) |
| Chất lượng (A-23, Task 3.5) | Review CP-02: đạt có điều kiện, 2 điều kiện về tài liệu | `b73a818` (PR #12) |
| Bàn giao (A-33, A-112) | P13 hướng dẫn cài đặt và demo; kế hoạch đóng dự án | `901bb2c` (PR #12) |
| Sử dụng AI | Dùng Claude Code để hỗ trợ viết code, test và tài liệu, theo quy trình speckit (spec, plan, tasks) và hiến chương của repo. Tự kiểm tra kết quả: chạy toàn bộ test, lint, build; so sánh với `main` khi có test hỏng | Cần ghi vào AI Usage Log của workbook |

Giờ ước tính: W13 khoảng 8,25 giờ; W14 đến 23/11 khoảng 15,25 giờ (`actuals.md` §4). W12 `TODO`.

## Gợi ý ý cho phần tự đánh giá (viết lại bằng lời của bạn)

- **Điều làm được:** câu trả lời vòng 3 đến sau khi đã có MVP. Mình đối chiếu từng câu với code thay vì chỉ với giả định, nhờ vậy tìm ra Q34 và Q35 chưa có code. Hai việc này được đưa vào A-65 và A-28, kèm CR-03.
- **Quyết định phải bảo vệ khi vấn đáp:** hoãn 6 yêu cầu chỉ có trong SRS v0.2. Lý do: hạn nộp dời lên 29/11, khách hàng không yêu cầu các mục này, và theo Q22 thì chức năng cốt lõi được ưu tiên. Thứ hai: dữ liệu bị xóa tự động được ghi nhật ký với người thực hiện để trống, nghĩa là thao tác của hệ thống.
- **Điều sẽ làm khác:** ghi giờ thật hằng ngày ngay từ W12. Gửi P03 cho người review sớm hơn để CP-03 không bị trễ. Kiểm tra việc giữ nguyên file V1.0 ngay khi đóng băng, thay vì phát hiện muộn.
- **Rủi ro tự nhận:** W14 bị quá tải (khoảng 15 giờ trong một ngày đầu tuần). Lẽ ra nên báo RES-01 để chia lại việc sớm hơn, theo quy tắc 3.
- **Bài học về ước lượng:** công cụ AI làm thay đổi hoàn toàn khối lượng xây dựng, nên ước lượng phải dựa vào việc kiểm chứng và review chứ không dựa vào số dòng code.

**Sản phẩm để vấn đáp thử (A-115):** chọn một sản phẩm không phải của mình, ví dụ A-77 kiểm thử báo cáo (RES-05) hoặc P18 (RES-01).
