---
title: "Camera Calibration: vì sao ảnh nét vẫn đo kích thước sai?"
date: 2026-11-05
tag: "Machine Vision"
color: "#1f9d4d"
cover: "https://user-images.githubusercontent.com/62354721/244020119-6f1f7cef-93df-42df-b728-15e5cc0c9f66.PNG"
excerpt: "Hiểu méo ống kính, phối cảnh, pixel/mm, sai số đo và quy trình hiệu chuẩn camera bằng checkerboard."
translation: camera-calibration-for-dimensional-measurement
draft: false
---

Một ảnh chụp rõ nét không đồng nghĩa với một phép đo chính xác. Nếu dùng camera để đo lỗ, kích thước chai hay vị trí chi tiết, câu hỏi quan trọng không chỉ là **có bao nhiêu pixel** mà là **mỗi pixel tương ứng với tọa độ thực nào**.

## Tài liệu thực hành

[**OpenCV — Camera Calibration**](https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html) trình bày ví dụ hiệu chuẩn bằng bảng caro, tính camera matrix, distortion coefficients và hiệu chỉnh ảnh.

[**OpenCV — Camera Calibration with C++**](https://docs.opencv.org/4.x/d4/d94/tutorial_camera_calibration.html) giới thiệu thêm các mẫu checkerboard, ChArUco và circle grid.

## Ba nguồn sai số phổ biến

**Méo ống kính:** Vật ở mép ảnh có thể bị kéo, cong hoặc thay đổi tỷ lệ so với vùng giữa.

**Phối cảnh:** Vật nằm nghiêng với mặt phẳng ảnh sẽ có kích thước chiếu khác nhau. Đổi độ cao vật cũng làm tỷ lệ pixel/mm thay đổi ở hệ camera thường.

**Hệ đo không ổn định:** Camera rung, gá lệch, nét sai, biến dạng vật và thuật toán phát hiện mép đều tạo sai số.

## Quy trình hiệu chuẩn thực dụng

1. Cố định camera, lens, tiêu cự, focus và độ phân giải vận hành.
2. Sử dụng bảng checkerboard hoặc ChArUco có kích thước ô **được đo chính xác**.
3. Chụp nhiều góc và vị trí trong toàn bộ vùng ảnh, không chỉ một ảnh chính giữa.
4. Dùng OpenCV tìm các góc chuẩn và tính tham số nội tại, hệ số méo.
5. Hiệu chỉnh ảnh; với vật trên một mặt phẳng, xác định phép biến đổi từ mặt phẳng ảnh sang tọa độ thực (ví dụ homography).
6. Kiểm tra bằng **vật chuẩn độc lập** ở nhiều vị trí trong vùng đo, tính sai số lớn nhất và độ lặp lại.

## Tại sao pixel/mm chưa đủ?

Một hệ số pixel/mm đơn giản chỉ đáng tin khi mặt phẳng vật, khoảng cách và hình học camera được kiểm soát. Camera nghiêng hoặc vật thay đổi độ cao làm hệ số này không còn phù hợp trên toàn ảnh.

Đo dung sai nhỏ cần ngân sách sai số đầy đủ: pixel resolution, uncertainty do phát hiện cạnh, độ lặp gá, độ phẳng, nhiệt độ và cơ cấu truyền động. Nếu yêu cầu đo nghiêm ngặt và vật thay đổi chiều cao, cân nhắc **ống kính telecentric** và chuẩn đo phù hợp.

## Bài thử cho anh em kỹ sư

Đặt một vật chuẩn ở tâm và bốn góc ảnh. So sánh kết quả **trước và sau calibration**; sau đó nâng vật lên một độ cao nhỏ để thấy sai số do phối cảnh.

**Nguồn:** [OpenCV Camera Calibration](https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html) · [OpenCV Calibration Guide](https://docs.opencv.org/4.x/d4/d94/tutorial_camera_calibration.html).

*Bài phân tích kỹ thuật độc lập; nội dung demo và hình ảnh thuộc nguồn được dẫn.*

**Ảnh bìa:** Các góc chụp bảng checkerboard từ [dự án Camera Calibration with PiCamera2/OpenCV](https://github.com/Petros626/Camera-Calibration-with-PiCamera2-OpenCV).
