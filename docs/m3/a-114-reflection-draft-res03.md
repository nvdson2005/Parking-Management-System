# A-114 Đóng góp cá nhân và tự đánh giá (RES-03)

**Thành viên:** Nguyễn Phạm Mạnh Dũng (RES-03), Kiến trúc và dữ liệu
**Giai đoạn:** W12 đến 29/11/2026

## 1. Đóng góp

| Mảng | Đã làm | Bằng chứng |
|---|---|---|
| Thiết kế CSDL (A-24) | P03 v0.3 và v0.4: đối chiếu 9 câu trả lời vòng 3 với lược đồ và code, viết cách tính 4 chỉ số (Q28), quyền đọc theo vai trò (Q34), chốt phạm vi các khoảng trống so với SRS v0.2, ERD v0.4 | `1b0c77c`, `02072ca` (PR #10) |
| Quản lý rủi ro (A-102, Task 3.4) | Lập sổ rủi ro M3 từ V1.0, chấm lại sau thay đổi hạn nộp (CR-01), thêm 7 rủi ro mới, soạn CR-03 | `docs/m3/risk-register.md` (PR #10) |
| Baseline (A-106, Task 3.7) | Ghi nhận đóng băng V1.0; sinh Baseline V2.0 bằng chính bộ lập lịch của V1.0; chỉ ra kế hoạch mới vượt năng lực (116%) và đưa lựa chọn cho PM | `679946c` (PR #10) |
| Code (A-28) | Tự động xóa biển số sau 12 tháng (Q35); ghi LOGIN khi đăng ký (KB-07); trả lỗi 400 thay vì 500 khi body hỏng (KB-14) | `bc172ce`, `38c7e20`, `2992cb0` (PR #11) |
| Code (A-65) | Trang Staff tra cứu xe và đặt chỗ (Q34); 3 endpoint đọc (KB-15); 4 chỉ mục (G-07) | `49299ac`, `5882e49`, `d64e95f` (PR #11) |
| Theo dõi và chất lượng (A-101, A-103, A-23) | Bảng kế hoạch so với thực tế; review CP-02 | `00a7258`, `b73a818` (PR #12) |
| Bàn giao (A-33, A-112) | Hướng dẫn cài đặt và demo P13; kế hoạch đóng dự án | `901bb2c`, `7c62bcc` (PR #12) |

Effort ước tính: W12 8 giờ (giả định theo năng lực), W13 khoảng 8,25 giờ, W14 đến 23/11 khoảng 15,25 giờ (`docs/m3/actuals.md`).

**Sử dụng AI:** dùng Claude Code để hỗ trợ viết code, test và tài liệu. Tôi đi theo quy trình của repo (spec, plan, tasks trước khi code; test viết trước). Tự kiểm tra kết quả bằng toàn bộ test, lint và build.

<!-- ## 2. Tự đánh giá

**Điều tôi làm được.** Câu trả lời vòng 3 đến sau khi MVP đã xây xong. Tôi không chỉ so câu trả lời với giả định của nhóm mà đối chiếu từng câu với code thật. Nhờ vậy tôi tìm ra hai yêu cầu khách hàng đã chốt nhưng chưa có code: Staff được xem xe và đặt chỗ (Q34), và biển số phải được xóa tự động (Q35). Tôi đưa cả hai vào CR-03 và làm xong trước buổi chạy thử.

**Quyết định tôi sẽ bảo vệ.** Thứ nhất, tôi đề xuất hoãn 6 yêu cầu chỉ có trong SRS v0.2, như giờ hoạt động của bãi, bảng giá theo giờ và hết phiên sau 30 phút. Hạn nộp bị dời lên 29/11, khách hàng không yêu cầu các mục này, và theo câu Q22 thì chức năng cốt lõi phải được ưu tiên. Làm hết sẽ tốn khoảng 22 giờ; chỉ làm phần khách hàng yêu cầu tốn khoảng 5 giờ. Thứ hai, lần xóa tự động được ghi vào nhật ký với người thực hiện để trống. Như vậy nhìn vào là biết đó là thao tác của hệ thống, không cần tạo tài khoản "hệ thống" giả có thể đăng nhập được.

**Điều tôi sẽ làm khác.** Tôi đã không ghi giờ thật từ W12, nên bảng so sánh kế hoạch và thực tế phải dựa vào ước tính. Tôi gửi P03 cho người review muộn, làm CP-03 trễ. Tôi cũng chỉ phát hiện P18 bị sửa đè lên file V1.0 khi chạy lại lệnh kiểm tra vào ngày 23/11, trong khi lẽ ra nên kiểm tra ngay khi đóng băng. Ở W14 tôi bị quá tải; lẽ ra phải báo PM sớm hơn để chia lại việc, theo quy tắc leo thang của nhóm.

**Bài học.** Công cụ AI làm thay đổi hoàn toàn khối lượng việc xây dựng: kế hoạch tự xây dựng ban đầu cần khoảng 179 giờ, còn MVP xong trong một ngày. Từ đó tôi rút ra rằng ước lượng nên tính theo khối lượng kiểm chứng, review và quyết định, không tính theo lượng code phải viết. Tôi cũng thấy giữ truy vết (mã KB, CR, commit) giúp trả lời nhanh câu hỏi "vì sao" khi kế hoạch thay đổi. -->
