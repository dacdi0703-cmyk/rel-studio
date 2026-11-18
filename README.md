# R'EL Studio 0.6 — Self-hosted Beta

## Chạy trên máy
Node.js 20+: `cd server && npm install && npm start`. Mở http://localhost:3000.

## Triển khai Render
1. Tải toàn bộ thư mục lên GitHub (giữ `server/` và `public/` trong root).
2. Render > New > Web Service (KHÔNG phải Static Site).
3. Root Directory: `server`.
4. Build Command: `npm install`.
5. Start Command: `npm start`.
6. Environment: `REL_ADMIN_SETUP_KEY` = chuỗi ngẫu nhiên dài, bí mật.
7. Muốn dữ liệu bền vững, gắn persistent disk (Render free Web Service không hỗ trợ disk bền vững). Chỉ định `DATA_FILE` tới đường dẫn trên disk. Nếu không, tài khoản/game/mã có thể mất sau redeploy/restart.

## Thiết lập admin an toàn
1. Đăng ký tên Pannau75 bằng giao diện web với mật khẩu mới do bạn tự chọn (không đặt trong mã nguồn).
2. Gọi POST /api/admin/bootstrap với JSON `{ "username": "Pannau75", "setupKey": "GIÁ_TRỊ_REL_ADMIN_SETUP_KEY" }` một lần từ công cụ API của bạn.
3. XÓA REL_ADMIN_SETUP_KEY khỏi biến môi trường sau khi cấp quyền.

## Lưu ý
- Game 2D hỗ trợ editor, play-test, xuất HTML độc lập, đăng link. Game 3D hiện là viewport minh họa dạng 2.5D; chưa có vật lý 3D hoặc runtime Luau.
- Lua/Luau chỉ lưu và chỉnh sửa mã; không thực thi. Không quảng cáo như engine Roblox hoàn chỉnh.
- Phòng WebSocket có chat, chưa có đồng bộ game hoàn chỉnh/voice.
- Tài khoản email chưa được xác minh; cần nhà cung cấp email SMTP để xác minh thật.
- Máy chủ này là MVP, lưu JSON, token chỉ trong RAM, chưa có rate limit và bảo vệ production đầy đủ. Không dùng cho thu tiền tự động hoặc dữ liệu nhạy cảm.
- Không bao giờ ghi mật khẩu vào nội dung chuyển khoản ngân hàng.
