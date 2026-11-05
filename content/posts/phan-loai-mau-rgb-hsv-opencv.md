---
title: "RGB vs HSV: phân loại màu sản phẩm thế nào để ít lỗi hơn?"
date: 2026-11-05
tag: "Image Processing"
color: "#e8590c"
cover: ""
excerpt: "Tại sao HSV giúp tách màu trong OpenCV, trường hợp nào HSV vẫn thất bại và cách thử nghiệm với sản phẩm thật."
translation: rgb-vs-hsv-industrial-color-sorting
draft: false
---

Phân loại nắp chai theo màu tưởng là một bài xử lý ảnh đơn giản: chụp ảnh, đọc giá trị màu rồi xuất OK/NG. Nhưng khi ánh sáng nhà xưởng thay đổi hoặc vật thể bóng, cùng một sản phẩm có thể cho kết quả khác nhau.

## Demo kỹ thuật có thể tự chạy

[**OpenCV — Thresholding Operations using inRange**](https://docs.opencv.org/4.x/da/d97/tutorial_threshold_inRange.html) có ví dụ Python/C++ với camera và thanh chỉnh ngưỡng H, S, V.

Đây là **demo thuật toán**, không phải video của một dây chuyền đã nghiệm thu.

## RGB và HSV khác nhau ở đâu?

**RGB** mô tả cường độ đỏ, xanh lá và xanh dương. Đây là dạng biểu diễn quen thuộc của camera/màn hình, nhưng mỗi kênh có thể thay đổi rõ khi chiếu sáng thay đổi.

**HSV** mô tả Hue (sắc màu), Saturation (độ bão hòa), Value (độ sáng). Khi độ bão hòa đủ cao và ánh sáng được kiểm soát, ta thường đặt ngưỡng Hue để phân biệt nhóm màu thuận tiện hơn.

Trong OpenCV với ảnh 8-bit mặc định, **Hue thường được biểu diễn từ 0 đến 179**, không phải 0–360. Màu đỏ nằm gần điểm nối 0/179 nên đôi khi phải dùng **hai khoảng ngưỡng** rồi kết hợp mask.

## Quy trình phân loại theo màu

1. Cố định vị trí sản phẩm và ánh sáng; khóa auto-white-balance và auto-exposure nếu cần.
2. Chuyển ảnh BGR sang HSV bằng `cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)`.
3. Đặt khoảng `cv2.inRange()` cho màu mục tiêu.
4. Loại nhiễu bằng morphology, tìm contour/ROI phù hợp.
5. Chọn ngưỡng diện tích, độ tin cậy và trạng thái unknown để tránh phân loại bừa.

Ví dụ Python:

```python
import cv2
import numpy as np

frame = cv2.imread("sample.jpg")
hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
mask1 = cv2.inRange(hsv, (0, 80, 60), (10, 255, 255))
mask2 = cv2.inRange(hsv, (170, 80, 60), (179, 255, 255))
red_mask = cv2.bitwise_or(mask1, mask2)
```

*Các ngưỡng trên chỉ để minh họa, bắt buộc hiệu chỉnh bằng mẫu thật và hệ thống chiếu sáng thực tế.*

## Khi HSV vẫn thất bại

Khi S quá thấp (gần xám/trắng), Hue không còn ổn định. Phản xạ gương, bóng đổ, ánh sáng nhiều màu, hoặc camera tự thay white balance cũng có thể làm mask sai.

Đối với bài toán yêu cầu màu chuẩn, có thể cần color calibration bằng bảng màu tham chiếu, kiểm soát đèn và cân nhắc không gian màu Lab thay vì chỉ phân loại bằng Hue.

**Nguồn:** [OpenCV — Thresholding Operations using inRange](https://docs.opencv.org/4.x/da/d97/tutorial_threshold_inRange.html).

*Bài phân tích kỹ thuật độc lập; nội dung demo và hình ảnh thuộc nguồn được dẫn.*
