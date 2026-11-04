# Kỹ Sư Thập Cẩm — ZIP v2 + CMS

Trang được dựng theo `Ky Su Thap Cam v2.dc.html` trong ZIP người dùng gửi, giữ phong cách/khung bố cục đó. Nội dung cập nhật được tách sang `content/site.json`; Pages CMS cung cấp giao diện web để sửa nội dung và ghi thay đổi vào GitHub.

## Cập nhật nội dung không sửa code

1. Mở Pages CMS (`app.pagescms.org`) và đăng nhập bằng GitHub.
2. Cho phép Pages CMS truy cập repository `CalisJI/KySuThapCam`.
3. Chọn **Nội dung trang** để sửa tiêu đề, mô tả, thông tin liên hệ, lĩnh vực dịch vụ, thiết bị, quy trình, bài viết nổi bật và FAQ.
4. Lưu/commit trong CMS. GitHub nhận commit; sau khi nối repo với Cloudflare Pages, Cloudflare tự build và publish.

Không sửa HTML khi cập nhật các trường đã cấu hình. Thêm loại nội dung hoặc bố cục mới vẫn cần thay đổi code một lần.

## Đăng nội dung mới trong Pages CMS
* **Nội dung trang → Thiết bị / Dự án**: mỗi mục có ô *Ảnh* (tải ảnh lên, lưu vào `site/media/`).
* **Bài viết chia sẻ** (mục riêng): bấm *Add an entry*, nhập tiêu đề, ngày, chủ đề, ảnh đại diện, mô tả ngắn và nội dung (có chèn ảnh trong bài). Bài lưu ở `content/posts/*.md`, build tự tạo trang `/bai-viet/<tên-file>/`, danh sách `/bai-viet/` và hiện lên trang chủ. Bật *Nháp* để chưa hiển thị.
* Khi chưa đủ 3 bài thật, trang chủ vẫn hiện các ô "Sắp đăng" trong *Nội dung trang → Bài viết trên trang chủ*.

## Cấu trúc

- `site/index.html` — bản HTML nguồn theo ZIP v2, đã thay các nội dung CMS bằng binding.
- `site/support.js` — runtime có trong ZIP để render giao diện v2.
- `content/site.json` — nội dung CMS.
- `.pages.yml` — cấu hình các trường CMS.
- `scripts/build.mjs` — tạo `dist/` từ nội dung và trang.
- `zip-reference/` — bản giải nén tham khảo, không đẩy lên GitHub.

## Xem/build tại máy

Cần Node.js. Từ thư mục dự án chạy:

```bash
npm run build
```

Mở `dist/index.html` sau khi build. Build không cần cài dependency ngoài.

## Cloudflare Pages + GitHub

Trong Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**, chọn repository `CalisJI/KySuThapCam` và cấu hình:

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`

Mỗi commit từ Pages CMS lên `main` sẽ kích hoạt Cloudflare Pages build và publish. Chưa có URL live cho đến khi repo được nối với Cloudflare Pages.

## Pages CMS lần đầu

Sau khi repository có trên GitHub, vào `app.pagescms.org`, đăng nhập bằng GitHub, cài/cho phép GitHub App trên repository `KySuThapCam`, rồi mở repo. CMS đọc `.pages.yml` để hiện form biên tập. Chủ tài khoản cần tự xác nhận quyền truy cập GitHub App; không nhập mật khẩu/token vào chat.

## Lưu ý

- Repository GitHub hiện là **public**. Email và số điện thoại trong nội dung sẽ hiển thị công khai như trên website.
- Các bài viết hiện là teaser mẫu; chưa có trang bài viết chi tiết.
- Kiểm tra/cập nhật URL Fanpage trong CMS trước khi public.
- Code ở thư mục D: là bản làm việc; sau khi đẩy, GitHub là nguồn chuẩn.
