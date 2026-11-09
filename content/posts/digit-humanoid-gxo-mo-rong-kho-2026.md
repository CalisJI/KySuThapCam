---
title: "Robot hình người Digit chuẩn bị vào thêm hai kho GXO: từ demo đến triển khai thực tế"
date: 2026-11-09
tag: Humanoid Robotics
color: "#1f9d4d"
cover: https://cdn.prod.website-files.com/6980c63561bbbeb67b4b7ab5/6adec09733608046a13bde69_Press-Release_251026_01.png
excerpt: "Ngày 26/10/2026, GXO và Agility công bố mở rộng robot Digit sang hai kho mới ở Mỹ từ đầu 2027. Humanoid đang làm công việc gì trong logistics?"
draft: false
---

**Một tin về robot hình người đáng chú ý không nhất thiết phải là màn nhào lộn đẹp mắt.** Ngày **26/10/2026**, nhà vận hành logistics GXO và Agility Robotics công bố kế hoạch đưa robot hình người **Digit** đến thêm **hai cơ sở tại Mỹ**.

Đáng chú ý nhất là đây là bước mở rộng sau một chương trình làm việc thực tế, thay vì chỉ thử nghiệm một robot đơn lẻ trong phòng lab.

## Digit sẽ được đưa tới đâu?

Theo thông cáo chung của hai doanh nghiệp, GXO dự kiến triển khai Digit tại:

- **Statesville, North Carolina**
- **Lebanon, Tennessee**

Thời điểm triển khai dự kiến bắt đầu **đầu năm 2027**, ban đầu sử dụng **Digit 4**, sau đó chuyển sang **Digit 5** khi thế hệ mới sẵn sàng về mặt thương mại.

Vì vậy, cách viết chính xác vào tháng 11/2026 là **“đã công bố kế hoạch mở rộng”**, **không phải “đã đưa Digit 5 vào hai kho mới”**.

## Robot hình người làm gì trong kho hàng?

Trong quy trình kho, Digit được định hướng xử lý **thao tác chuyển và sắp đặt các thùng chứa (tote)**, liên kết các khâu vận chuyển và xử lý hàng. Đây là những thao tác vật lý lặp đi lặp lại mà con người thường phải cúi, nâng, xoay người hoặc di chuyển giữa các điểm.

Điểm quan trọng không nằm ở việc robot trông giống người. Digit được phát triển để làm việc trong **môi trường hạ tầng đã thiết kế cho con người** — nhưng muốn triển khai thương mại vẫn phải đánh giá lối đi, vị trí chất hàng, sàn, sự giao cắt với con người và cách phối hợp với robot vận chuyển tự hành.

## Lý do GXO mở rộng sau cơ sở đầu tiên

Đôi bên đã hợp tác tại cơ sở GXO ở **Flowery Branch, Georgia** từ năm **2024** theo mô hình **Robots-as-a-Service (RaaS)**. Thay vì chỉ mua robot như một tài sản cố định, mô hình này hướng tới cung cấp năng lực robot theo thỏa thuận dịch vụ.

Theo Agility, các chương trình thương mại và khách hàng của Digit đã tích lũy hơn **65.000 giờ vận hành trong môi trường thực tế**. Đây là con số tổng do hãng công bố; không nên hiểu thành thời gian hoạt động tại riêng một kho.

Việc mở rộng có thể cho thấy khách hàng nhìn thấy giá trị đủ lớn để triển khai bước tiếp theo. Tuy nhiên, công bố không đưa ra đầy đủ số liệu độc lập về **thời gian hoàn vốn, tỷ lệ lỗi và giá dịch vụ** tại hai kho sắp tới.

## Từ góc nhìn kỹ thuật, bài toán khó nhất ở đâu?

Với một kho sử dụng humanoid, những vấn đề cần đo thực tế gồm:

1. **Đầu vào không đồng nhất:** thùng khác kích thước/trọng lượng, vị trí lệch, lô hàng thay đổi.
2. **Tác vụ kéo dài:** chạy liên tục qua nhiều giờ, chịu được lỗi cảm biến, mất kết nối, kẹt cơ cấu.
3. **Tích hợp:** WMS/WCS, băng tải, AMR, scanner, hạ tầng mạng và luồng giao việc.
4. **An toàn:** tốc độ di chuyển, khu vực có người, nâng/hạ tải, dừng và khởi động lại.
5. **Vận hành:** sạc pin, bảo trì, phục hồi khi không gắp được hàng, thời gian chờ giữa các nhiệm vụ.

Với nhà máy Việt Nam, đây là một trường hợp đáng theo dõi về **ứng dụng humanoid vào xử lý vật liệu**, nhưng chưa đủ dữ liệu để kết luận robot hình người đã tối ưu chi phí hơn AMR kết hợp băng tải hay hệ thống tự động cố định trong mọi bài toán.

## Nguồn

- [GXO & Agility — thông cáo mở rộng hợp tác ngày 26/10/2026](https://www.agilityrobotics.com/content/gxo-and-agility-robotics-expand-partnership-to-accelerate-deployment-of-humanoids-in-u-s-operations)
- [Agility — cập nhật tiến độ thương mại ngày 26/10/2026](https://www.agilityrobotics.com/content/agility-robotics-highlights-commercial-momentum-and-growing-enterprise-demand-for-digit-humanoid-robot)
- [Agility — giới thiệu Digit 5 ngày 15/9/2026](https://www.agilityrobotics.com/content/agility-unveils-digit-5-humanoid-robot-built-for-cooperatively-safe-work-at-scale)

*Bài do Kỹ Sư Thập Cẩm biên tập độc lập ngày 9/11/2026. Phân biệt rõ **đã ký/mở rộng hợp tác** và **triển khai dự kiến trong năm 2027**; chưa có xác nhận robot đã đi vào hai kho mới.*

*Ảnh: [Agility Robotics/GXO, thông cáo ngày 26/10/2026](https://www.agilityrobotics.com/content/gxo-and-agility-robotics-expand-partnership-to-accelerate-deployment-of-humanoids-in-u-s-operations). Ảnh minh họa chính thức từ nguồn tin; không phải hình ảnh dự án của Kỹ Sư Thập Cẩm.*
