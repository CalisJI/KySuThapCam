---
title: "Những lỗi biến tần thường gặp tại xưởng"
date: 2026-11-03
tag: BIẾN TẦN
color: "#e8590c"
cover: /media/article-inverter.jpg
excerpt: "Quá dòng, quá áp, thấp áp, quá tải, quá nhiệt: dấu hiệu, nguyên nhân thường gặp và hướng kiểm tra ban đầu."
draft: false
---
Biến tần dừng đột ngột giữa ca sản xuất là tình huống quen thuộc ở nhiều xưởng. Phần lớn lỗi có thể khoanh vùng nhanh nếu bạn hiểu mã lỗi báo về nhóm nguyên nhân nào. Bài viết này tóm tắt các nhóm lỗi phổ biến và hướng kiểm tra ban đầu.

> **Lưu ý an toàn:** ngắt nguồn và chờ tụ DC bus xả hết (thường vài phút, xem hướng dẫn của hãng) trước khi mở nắp hoặc đo kiểm bên trong. Ký hiệu mã lỗi khác nhau giữa các hãng và dòng máy, nên luôn đối chiếu với sổ tay của đúng model.

## 1. Quá dòng (thường ký hiệu OC, OCn…)

**Dấu hiệu:** biến tần báo lỗi ngay khi tăng tốc, khi giảm tốc hoặc khi đang chạy.

**Nguyên nhân thường gặp**
- Thời gian tăng tốc quá ngắn so với quán tính tải.
- Tải bị kẹt hoặc nặng hơn thiết kế.
- Công suất biến tần nhỏ hơn yêu cầu của motor.
- Cách điện motor hoặc cáp bị suy giảm, gây chạm đất hoặc chạm pha.
- Thông số motor cài đặt chưa đúng.

**Kiểm tra ban đầu:** xem lịch sử lỗi để biết dòng điện tại thời điểm báo lỗi, thử kéo dài thời gian tăng tốc, quay thử tải bằng tay xem có kẹt không, đo cách điện motor và cáp.

## 2. Quá áp DC bus (thường ký hiệu OV, OVn)

**Dấu hiệu:** lỗi xuất hiện khi giảm tốc hoặc dừng nhanh, nhất là với tải có quán tính lớn.

**Nguyên nhân thường gặp**
- Thời gian giảm tốc quá ngắn: motor trả năng lượng về làm tăng điện áp DC bus.
- Tải kéo ngược (băng tải xuống dốc, cẩu, quạt lớn còn quay).
- Điện áp lưới cao hoặc có xung từ thiết bị khác.

**Hướng xử lý:** kéo dài thời gian giảm tốc, dùng **điện trở xả (braking resistor)** hoặc bộ hãm nếu tải thường xuyên hồi năng lượng, kiểm tra điện áp nguồn.

## 3. Thấp áp (thường ký hiệu Uv, LU)

**Dấu hiệu:** biến tần dừng khi có tải khởi động chung nguồn hoặc khi lưới điện sụt áp.

**Nguyên nhân thường gặp:** nguồn cấp yếu, dây dẫn quá nhỏ, tiếp xúc lỏng ở aptomat/contactor, mất pha, hoặc mạch sạc/tụ bên trong biến tần đã yếu.

**Hướng xử lý:** đo điện áp ba pha khi tải chạy, siết lại đầu cốt, kiểm tra tiết diện dây, tách nguồn khỏi các tải khởi động lớn.

## 4. Quá tải và quá nhiệt (OL, OH)

**Dấu hiệu:** biến tần chạy được một lúc rồi báo lỗi, hoặc báo lỗi vào buổi trưa nóng.

**Nguyên nhân thường gặp**
- Quạt làm mát hỏng hoặc kẹt, cánh tản nhiệt đầy bụi.
- Tủ điện kín, thiếu thông gió, nhiệt độ môi trường cao.
- Tải thực tế vượt định mức, chạy lâu ở tốc độ thấp với motor không có quạt làm mát riêng.

**Hướng xử lý:** vệ sinh cánh tản nhiệt và bộ lọc, kiểm tra quạt, cải thiện thông gió hoặc lắp quạt/điều hòa tủ, đối chiếu dòng làm việc với định mức.

## 5. Lỗi chạm đất, mất pha, lỗi truyền thông

- **Chạm đất / lỗi ngõ ra:** đo cách điện motor và cáp, kiểm tra hộp đấu dây motor có ẩm không.
- **Mất pha ngõ vào/ra:** kiểm tra cầu chì, aptomat, đầu cốt lỏng.
- **Lỗi truyền thông:** kiểm tra cáp, điện trở cuối, tốc độ baud và địa chỉ trạm.

## Phòng ngừa tốt hơn sửa

1. Siết lại đầu cốt và kiểm tra bằng mắt định kỳ.
2. Vệ sinh bụi, giữ tủ điện khô và thoáng.
3. Theo dõi nhiệt độ vận hành, thay quạt và các linh kiện hao mòn theo khuyến cáo của hãng.
4. Chọn công suất biến tần phù hợp tải thực tế, có dự phòng.
5. Lưu lại lịch sử lỗi và thông số cài đặt để so sánh khi lỗi tái diễn.

## Cần hỗ trợ chọn biến tần thay thế?

Gửi model biến tần hiện tại, thông số motor (công suất, dòng, điện áp) và mô tả tải. Chúng tôi sẽ cùng bạn xác định phương án phù hợp.

*Tham khảo thêm: tài liệu kỹ thuật về lỗi biến tần của Maxivolt, Hợp Kỹ Automation và sổ tay của các hãng. Nội dung được biên soạn lại, không thay thế hướng dẫn chính thức của nhà sản xuất.*

*Ảnh bìa: [Siemens VFD](https://commons.wikimedia.org/wiki/File:Siemens_VFD.jpg) của Sarah Adrita, giấy phép [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), đã cắt khung, nguồn Wikimedia Commons.*
