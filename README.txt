R'EL STUDIO BETA v0.4 — GÓI ĐĂNG RENDER (STATIC SITE)
===================================================

Đây là bản editor HTML5 tĩnh, không có máy chủ game, không có runtime Luau.
Bạn KHÔNG cần Firebase cho bản này. Ảnh/media nội bộ và world có thể lưu trong trình duyệt hoặc xuất file thủ công.

BƯỚC 1: GIẢI NÉN ZIP
Bạn sẽ thấy các file index.html, sw.js, manifest.webmanifest, icon.svg,
firebase-config.json (để trống), và README.txt.
KHÔNG tải nguyên ZIP lên GitHub rồi kỳ vọng Render tự giải nén.

BƯỚC 2: ĐƯA FILE LÊN GITHUB
1. Vào https://github.com/new và đăng nhập GitHub.
2. Tên Repository: rel-studio-beta
3. Chọn Public rồi Create repository.
4. Trên trang repo, chọn uploading an existing file (hoặc Add file > Upload files).
5. Kéo THẢ CÁC FILE ĐÃ GIẢI NÉN, đặc biệt là index.html, vào GitHub.
   Giữ các file ở THƯ MỤC GỐC, không nằm sâu trong thư mục khác.
6. Chọn Commit changes.

BƯỚC 3: ĐĂNG LÊN RENDER
1. Vào https://dashboard.render.com > + New > Static Site.
2. Chọn GitHub, cấp quyền và tìm repo rel-studio-beta.
3. Name: rel-studio-beta (hoặc tên bạn thích, nếu còn trống).
4. Branch: main
5. Build Command: echo ready
6. Publish Directory: .  (chỉ một dấu chấm)
7. Chọn gói free nếu Render hiển thị lựa chọn này, sau đó Deploy/Create Static Site.
8. Sau khi deploy thành công, Render cấp link https://<TEN_SITE>.onrender.com.

LƯU Ý
- Trên Render này không có cơ sở dữ liệu, hệ thống tài khoản, chia sẻ world trên cloud hay multiplayer.
- File firebase-config.json trong gói này không chứa cấu hình, Cloud sẽ không kết nối.
- Các Script/LocalScript/ModuleScript vẫn chỉ có thể nhập/lưu, chưa có Luau VM.
- Để cập nhật site sau này: tải file mới lên repo GitHub, Render sẽ tự build lại (nếu auto-deploy bật).
- Tên miền cấp bởi Render có thể thay đổi theo tên service và tính khả dụng.
