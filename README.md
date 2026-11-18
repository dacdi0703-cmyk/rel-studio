# R'EL Studio v0.7 — Recovery Build

Bản phục hồi giao diện Studio 3D từ v0.5, sử dụng R'EL Server Node.js (không cần Firebase). Đây là **BETA kỹ thuật**, KHÔNG phải toàn bộ Roblox Studio, Luau runtime hay multiplayer game đầy đủ.

## 1. Cập nhật lên GitHub/Render đang dùng

1. **Trước khi thay file:** nếu có tài khoản hoặc World quan trọng trên server cũ, sao lưu ngay. Render Free có ổ đĩa tạm; triển khai mới có thể làm mất dữ liệu JSON.
2. Giải nén ZIP bằng WinRAR. **Mở thư mục đã giải nén** và chọn `public`, `server`, `README.md` (chọn những thành phần nằm bên trong, không kéo cả thư mục cha hoặc ZIP lên GitHub).
3. Mở repository GitHub `dacdi0703-cmyk/rel-studio`, vào **Add file → Upload files**, kéo các thành phần ở bước 2 vào, sau đó **Commit changes**. `public/` và `server/` phải nằm ngay bên ngoài cùng, cùng cấp với `README.md`.
4. Vào Render Web Service hiện tại `rel-studio-server` và kiểm tra các ô:
   - Source: repository `dacdi0703-cmyk/rel-studio`, nhánh `main`.
   - Language: Node.
   - Root Directory: `server`.
   - Build Command: `npm install`.
   - Start Command: `npm start`.
   - Instance: Free nếu chỉ kiểm thử.
5. Render sẽ tự deploy nếu Auto-Deploy đang bật; nếu không thì chọn **Manual Deploy → Deploy latest commit**.
6. Mở `https://rel-studio-server.onrender.com` (hoặc link Render đang cấp). V0.5 tại Static Site cũ vẫn là website khác; hãy dùng đường link của **Web Service**.

## 2. Cấu hình bảo mật trên Render

Trong Render → Web Service → Environment, thêm `REL_SESSION_SECRET`: một chuỗi ngẫu nhiên bí mật dài từ 32 ký tự trở lên. Giữ giá trị này **ổn định**, nếu đổi thì các phiên đăng nhập cũ hết hạn. Không đưa giá trị này vào GitHub.

**Tạo tài khoản quản trị Pannau75 lần đầu:**

1. Thêm `REL_ADMIN_SETUP_KEY` với chuỗi bí mật dài **ít nhất 24 ký tự** tại Environment của Web Service, rồi lưu/deploy.
2. Trên website R'EL, tại trang đăng nhập chọn **Thiết lập Admin Pannau75 (lần đầu)**.
3. Nhập khóa vừa đặt và chọn **mật khẩu mới từ 12 ký tự**. KHÔNG dùng mật khẩu đã công khai trong cuộc trò chuyện hoặc GitHub.
4. Nhấn **Tạo Admin mới**. Nếu tên `Pannau75` đã có từ bản server cũ, chọn **Cấp quyền cho Pannau75 đã có**, rồi đăng nhập bằng mật khẩu của tài khoản đó.
5. Khi thành công, **XÓA biến `REL_ADMIN_SETUP_KEY` khỏi Render Environment**. Không cần giữ khóa thiết lập công khai.

Không có mật khẩu admin mặc định trong mã nguồn. Người quản trị cấp Premium qua tên tài khoản, không cần đăng nhập vào tài khoản của người khác.

## 3. Dữ liệu máy chủ — cực kỳ quan trọng

Nếu **không có `DATABASE_URL`**, R'EL lưu bằng JSON trên ổ đĩa server. **Render Free có thể xóa dữ liệu đó sau restart, redeploy hoặc ngủ/khởi động lại**. Vì vậy bản này CHỈ phù hợp thử nghiệm nếu chưa có database bền vững.

Có thể cấu hình `DATABASE_URL` trỏ đến một PostgreSQL phù hợp; máy chủ tự tạo bảng `rel_state` rồi lưu dữ liệu qua PostgreSQL. Chỉ đặt URL trong Render Environment; KHÔNG bao giờ đưa DB URL vào GitHub. Kết nối SSL mặc định được bật (tuỳ chọn `PGSSL=disable` cho Postgres nội bộ có kết nối an toàn).

Tài khoản: chỉ lưu `username`, email chưa xác minh và **mật khẩu dạng băm scrypt có salt**. Không lưu, hiển thị hoặc cho admin xem mật khẩu gốc. Không đưa mật khẩu vào nội dung chuyển khoản.

Tài khoản admin có nút **Tải bản sao lưu dữ liệu** trong Premium; bản JSON đó chứa hash mật khẩu và các mã chưa dùng nên phải cất riêng tư, không tải lên GitHub công khai.

## 4. Cách sử dụng Studio

- Đăng nhập, nhấn **Tạo World mới** → chọn **3D** hoặc **2D**.
- Trong 3D Studio nhấn **+ Thêm đối tượng** hoặc dấu `+` ngay cạnh World/Part/UI/ScreenGui để thêm khối, NPC, Script, ScreenGui, TextButton… và tạo cấp cha–con.
- UI: Nhấn dấu `+` ở **UI** → **ScreenGui** → dấu `+` ở **ScreenGui** → **TextButton**. Chọn TextButton, kéo trực tiếp trên viewport, đổi kích thước bằng ô góc hoặc thanh kéo, chỉnh màu và `Khi nhấn` ở Inspector. Có bật/tắt hiển thị.
- 2D: Chọn 2D, dùng nút **+ Thêm đối tượng** để thêm nền, khối, vùng nguy hiểm, Spawn, chữ và xu; kéo khối trực tiếp bằng chuột.
- Nhấn **Lưu trên server** hoặc Ctrl+S. Có thể xuất dự án `.reluau`, xuất HTML5 độc lập, hoặc **Đăng R'EL** để có link `https://your-service.onrender.com/play/<id>`.
- Trong Studio có Play/Stop và nhân vật Classic. Player trong game xuất ra không cần tạo tài khoản.
- Premium: Admin tạo mã `PRE1-XXXX` đến `PRE30-XXXX` (ngẫu nhiên, dùng **một lần**). Người dùng đổi mã chỉ thấy thông báo thành công/số ngày, **không hiển thị lại mã**. Admin cũng có thể cấp ngày Premium theo username.

## 5. Script/API hiện được hỗ trợ tới đâu?

Tạo và lưu `Script`, `LocalScript`, `ModuleScript` như trước. Trình soạn có nút **Áp dụng API mẫu**: áp dụng một tập lệnh tuyến tính giới hạn (Instance.new/new, Name, Parent, Position, Size, Color3.fromRGB/rgb, Text, Visible, CanCollide, Anchored, Transparency). Trình này **không chạy Luau thực**, không có vòng lặp/function/sự kiện Roblox đầy đủ và không tự chạy script khi Play. Hành động chạm Part → hồi sinh, và UI TextButton → bật/tắt đối tượng, là hành vi native chạy thật khi được cài trong Inspector.

Phòng online có WebSocket chat và trạng thái vị trí mức demo; **chưa có multiplayer đồng bộ mô phỏng, Luau VM, voice chat, xác thực email, thanh toán tự động, build EXE Windows**. Không quảng cáo các tính năng này là hoàn thành.

## 6. Các file

- `public/index.html`, `hub.css`, `hub.js`: Creator Hub, đăng nhập, World, Premium, phòng chat.
- `public/studio.html`, `studio-bridge.js`: Studio 3D v0.5 phục hồi, editor UI, world 2D và lưu server.
- `server/server.js`, `package.json`: API, hash mật khẩu, tạo World/game, Premium một lần, WebSocket.
- `public/icon.svg`: logo website.

## 7. Chạy trên máy tính

Cài Node.js 20 trở lên, mở terminal trong thư mục `server`, chạy:

```bash
npm install
npm start
```

Mở `http://localhost:3000`. Lưu ý để có dữ liệu lâu dài cần database riêng hoặc thường xuyên sao lưu.
