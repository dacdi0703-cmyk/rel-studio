R'EL Studio Beta v0.5 - REngineLUAU

QUAN TRONG:
- Đây là công cụ web Beta, chưa phải Roblox Studio tương đương.
- Luau có trình soạn nguồn; chưa có Luau VM thực thi Script/LocalScript/ModuleScript.
- Online Beta = Firebase Authentication, Firestore lưu 1 World công khai/UID,
  2 slot phòng/UID, phòng chat/danh sách thành viên realtime.
  Chưa có multiplayer mô phỏng vật lý đồng bộ, WebRTC voice hoặc dedicated game server.
- Đăng ký tài khoản phải dùng email hợp lệ, mật khẩu do Firebase Authentication quản lý.
- Chỉ định admin/premium bằng Firebase Admin SDK ở môi trường đáng tin cậy.
  KHÔNG NHÚNG PASSWORD ADMIN VÀO HTML/JAVASCRIPT.
- Không ghi mật khẩu vào nội dung chuyển khoản.

A. THAY FILE TRÊN GITHUB + RENDER
1. Vào repo GitHub rel-studio và xóa hoặc thay thế các file cũ ở THƯ MỤC GỐC.
2. Upload: index.html, firebase-config.json, icon.svg, manifest.webmanifest,
   sw.js, premium-qr.jpg, firestore.rules, firebase.json và README này.
   (Hai file rel-upgrade.js/css và các fragment chỉ là nguồn hỗ trợ, có thể bỏ)
3. Commit changes.
4. Render Static Site: Root Directory = trống; Build Command = echo ready;
   Publish Directory = . ; Branch = main.
5. Render auto deploy sau GitHub commit, mở đường dẫn onrender.com để kiểm tra.
6. Khi giao diện mới không hiện: Ctrl+Shift+R xóa cache, hoặc xóa dữ liệu PWA cũ.

B. FIREBASE
- firebase-config.json đã điền Web SDK PUBLIC config từ ảnh bạn đưa
  của dự án Firebase rel-studio-4f39a. Hãy đối chiếu trực tiếp với Firebase Console.
- Trên https://console.firebase.google.com/ chọn dự án rel-studio-4f39a.
- Authentication > Sign-in method > Enable Email/Password.
- Authentication > Settings > Authorized domains: thêm domain Render (vd rel-studio.onrender.com).
- Firestore Database > Create database (nếu chưa có), để ở Production mode.
- Firestore > Rules: DÁN NỘI DUNG file firestore.rules và Publish.
  (hoặc cài Firebase CLI rồi firebase deploy --only firestore:rules --project rel-studio-4f39a)
- Bật xác nhận email/khôi phục mật khẩu và chống lạm dụng theo nhu cầu.
- Firebase Web SDK cần Internet để đăng nhập/xuất bản/online.
- Nếu chưa bật 3 dịch vụ trên, xem thử offline bằng nút trong trang đăng nhập.

C. 1 GAME, 2 SERVER
- World công khai lưu trong Firestore path rel_worlds/<Firebase UID>; luôn thay thế,
  nên không thể vượt 1 game công khai bằng client thường.
- Hai server có ID rel_rooms/<UID>_1 và rel_rooms/<UID>_2; quyền tạo server thứ ba bị rules từ chối.
- Đây là 2 slot phòng chat thử nghiệm, KHÔNG phải 2 dedicated online game servers.
- Người chơi vào phòng thử phải đăng nhập (Firebase Auth), phòng cần được bật.
- Chỉ cần nhấp tên World và vào Studio để chỉnh sửa; bản nháp lưu trên thiết bị.
- Sao lưu bằng nút Lưu (.reluau) để đề phòng xóa dữ liệu trình duyệt.

D. PREMIUM VÀ ADMIN
- Ảnh QR do bạn cung cấp nằm ở premium-qr.jpg và được công bố công khai.
- Có gói 10.000đ / 10 ngày, 30.000đ / 30 ngày trong UI chỉ để giới thiệu.
- KHÔNG tự cấp premium khi người dùng nhấn thanh toán, chưa tích hợp cổng giao dịch.
- Quản trị viên phải kiểm tra giao dịch và cấp custom claim premiumUntil
  (Unix seconds) hoặc admin:true từ Firebase Admin SDK trong môi trường bảo mật.
- Không cài đặt sẵn hay nhúng thông tin đăng nhập của tài khoản Pannau75.
- Nếu mật khẩu admin đã gửi trong cuộc hội thoại, HÃY ĐỔI MẬT KHẨU trước khi triển khai.
- Tuyệt đối không yêu cầu người dùng ghi mật khẩu hay OTP trong nội dung chuyển khoản.

E. KHẢ NĂNG
- Home dashboard / tạo world 2D-3D / tùy chỉnh màu; 3D editor có hierarchy,
  folder, Script/LocalScript/ModuleScript editor, Part, NPC R6, Sound, Decal,
  Light, Spawn, bật/tắt va chạm/hiển thị, Sky, import OBJ (wireframe Beta).
- 2D canvas editor: thêm nền/khối/spawn/text/xu/hazard, kéo, sửa và chơi thử.
- UI Designer: label/button/health bar kéo thả, chỉnh màu, vị trí, độ rộng/cao.
- Export HTML5 gameplay cơ bản / xuất .reluau / PWA ZIP.
- Chưa có Luau runtime, GLB/FBX native renderer, audio 3D chuyên sâu,
  voice chat P2P, multiplayer authoritative, native Windows .exe biên dịch.
- Windows: dùng Chrome/Edge > Install app nếu được hỗ trợ trên HTTPS.
- Android: Chrome > menu > Add to Home Screen.
- iOS: Safari > Share > Add to Home Screen.

THƯ VIỆN: HTML5 tự chứa (trình editor không cần CDN), Firebase SDK dùng CDN
khi kết nối Internet. Nếu không sử dụng Firebase, vẫn có thể tạo World offline.
