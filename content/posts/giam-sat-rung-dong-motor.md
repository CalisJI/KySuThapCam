---
title: "Giám sát rung động motor bằng Industrial Raspberry Pi và FFT"
date: 2026-11-05
tag: "Maintenance"
color: "#1f9d4d"
cover: ""
excerpt: "Demo PiLink dùng cảm biến gia tốc, Industrial Raspberry Pi và phổ FFT để theo dõi dấu hiệu bất thường."
translation: motor-vibration-condition-monitoring
draft: false
---

Một số lỗi cơ khí có thể làm thay đổi rung động trước khi motor hoặc bơm dừng hoàn toàn. Theo dõi tín hiệu theo thời gian giúp đội bảo trì phát hiện sớm sự thay đổi.

## Xem video demo

[**PiLink — Failure Prediction System Demonstration (Vibration)**](https://pilink.jp/en/condition-monitoring_demo1/)

PiLink giới thiệu Industrial Raspberry Pi PL-R4 kết nối cảm biến gia tốc theo cấu hình không dây. Giao diện có dạng sóng gia tốc, đồ thị FFT, xu hướng, trigger đo và cảnh báo.

## Dự án quy mô nhỏ có giá trị gì?

Chọn trước một hoặc hai motor/bơm quan trọng; lắp cảm biến rung đúng vị trí, thu dữ liệu nền theo từng mức tải và tốc độ, rồi so sánh xu hướng qua nhiều tuần.

FFT chuyển tín hiệu rung từ miền thời gian sang thành phần tần số, giúp kỹ sư quan sát các thay đổi có tính chu kỳ. Tuy nhiên, cần kết hợp thông số máy và kiểm tra thực địa mới có thể chẩn đoán nguyên nhân.

## Điều cần lưu ý

Cách gá cảm biến, tần số lấy mẫu, nhiễu và tốc độ quay ảnh hưởng trực tiếp đến chất lượng dữ liệu. **Giám sát tình trạng không đồng nghĩa dự đoán chính xác thời điểm hỏng.**

**Nguồn:** [PiLink — Failure Prediction System Demonstration (Vibration), 04/02/2025](https://pilink.jp/en/condition-monitoring_demo1/).

*Video và hình ảnh thuộc tác giả hoặc chủ sở hữu nguồn; Kỹ Sư Thập Cẩm không sao chép hoặc lưu trữ lại file video của họ.*
