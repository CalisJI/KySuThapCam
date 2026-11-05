---
title: "Vì sao ánh sáng quan trọng hơn camera đắt tiền trong xử lý ảnh công nghiệp?"
date: 2026-11-05
tag: "Machine Vision"
color: "#e8590c"
cover: "https://www.planistar.de/fileadmin/_processed_/d/2/csm_Unternehmen_Loesungen_3611f85be8.jpg"
excerpt: "Backlight, dark field, ring light hay coaxial? Cùng một camera, đổi ánh sáng có thể làm khuyết tật hiện rõ hoặc biến mất."
translation: machine-vision-lighting-explained
draft: false
---

Một vết xước trên kim loại có thể hoàn toàn biến mất trong ảnh dù camera có độ phân giải cao. Thay đổi góc chiếu sáng, vết xước ấy bỗng nổi bật. Đó là lý do **thiết kế ánh sáng thường phải đi trước việc chọn thuật toán** trong machine vision.

## Demo có hình chụp thực tế

[**KEYENCE — Machine Vision Lighting Selection Guide**](https://www.keyence.com/products/vision/resources/vision-resources/basics-of-lighting-selection.jsp) có ví dụ so sánh trước/sau với mép kính, gioăng cao su và biên dạng linh kiện kim loại. Đây là tài liệu minh họa thực tế chứ không phải video do Kỹ Sư Thập Cẩm tự quay.

[**CCS — Machine Vision Lighting Applications**](https://www.ccs-grp.com/product/vision/index.html) giới thiệu các bộ đèn thực tế để kỹ sư đối chiếu cách lắp.

## 4 cách chiếu sáng nên biết

| Kiểu chiếu | Nguyên lý | Ứng dụng phù hợp |
|---|---|---|
| **Backlight** | Đèn phía sau vật, tạo hình bóng tương phản cao | Đo biên dạng, kiểm tra lỗ, độ rộng, khe |
| **Low-angle / dark field** | Ánh sáng xiên; vết xước tán xạ ánh sáng vào camera | Bavia, xước, vết dập trên bề mặt |
| **Ring / direct** | Đèn vòng quanh ống kính | Nhận dạng có/không, nhãn, chi tiết thông thường |
| **Coaxial / dome** | Ánh sáng đồng trục hoặc khuếch tán | Mặt phẳng phản xạ, chi tiết bóng, giảm chói |

Không có loại đèn tốt nhất cho mọi vật. Bề mặt bóng, cong hoặc trong suốt có thể cần thử nhiều góc và bước sóng.

## Ví dụ triển khai cho xưởng nhỏ

Muốn kiểm tra **chai có nắp hay không**: cố định chai trước camera, chọn nguồn sáng để biên dạng nắp nổi rõ, khóa exposure và gain; sau đó thử threshold/contour. Nếu yêu cầu chỉ là có/không và vị trí đủ ổn định, cách này có thể phù hợp hơn huấn luyện AI.

Muốn tìm **vết xước trên tấm kim loại**: thử đèn low-angle; chụp ảnh so sánh cùng một mẫu ở các hướng đèn khác nhau. Đừng vội thay camera.

## Checklist thử nghiệm

1. Chụp một sản phẩm đạt và các mẫu lỗi thật dưới ít nhất hai cấu hình đèn.
2. Quan sát **độ tương phản giữa đặc trưng cần kiểm tra và nền**, không chỉ độ đẹp của ảnh.
3. Khóa thông số camera; cân nhắc đèn strobe khi vật chạy nhanh.
4. Kiểm tra thay đổi theo độ cao sản phẩm, lão hóa đèn và ánh sáng môi trường.

**Kết luận:** Hệ thống vision tốt phải tạo ra ảnh *dễ phân tích và ổn định*, chứ không chỉ ảnh sắc nét.

**Tham khảo:** [KEYENCE — Lighting Selection Guide](https://www.keyence.com/products/vision/resources/vision-resources/basics-of-lighting-selection.jsp) · [CCS — Lighting Applications](https://www.ccs-grp.com/product/vision/index.html).

*Bài phân tích kỹ thuật độc lập; nội dung demo và hình ảnh thuộc nguồn được dẫn.*

**Ảnh bìa:** Hệ thống camera/chiếu sáng kiểm tra PCB từ [planistar Lichttechnik](https://www.planistar.de/en/company), dùng minh họa kỹ thuật chiếu sáng.
