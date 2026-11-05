---
title: "Camera phát hiện NG rồi PLC loại đúng sản phẩm như thế nào?"
date: 2026-11-05
tag: "Industrial Automation"
color: "#1f9d4d"
cover: "https://img.vision-systems.com/files/base/ebm/vsd/image/2020/04/epic_machine_vision_syrup_bottle_inspection_system.5e9dd709e3b29.png?auto=format%2Ccompress&fit=fill&width=800"
excerpt: "Trigger, result ID, encoder, queue và reject verification: phần khó nhất của trạm vision không nằm ở thuật toán."
translation: vision-camera-plc-reject-tracking
draft: false
---

Camera báo **NG** trong 80 ms, nhưng lúc đó sản phẩm đã đi cách vị trí chụp một đoạn. Nếu PLC kích xy lanh ngay khi nhận tín hiệu NG, cơ cấu gạt có thể đẩy nhầm sản phẩm tiếp theo.

Đó là lý do một trạm vision công nghiệp cần **đồng bộ dữ liệu kiểm tra với vị trí sản phẩm**.

## Case study có dây chuyền thật

[**Vision Systems Design — Cognex In-Sight bottle inspection**](https://www.vision-systems.com/factory/article/14174407/cognex-in-sight-bottle-inspection-vision-system) mô tả hệ thống kiểm tra chai, PLC xử lý recipe theo loại sản phẩm và **encoder theo dõi vị trí đến trạm reject**.

[**addaScan — Where a station sits and how it rejects**](https://addascan.co.za/resources/machine-vision-basics/where-a-station-sits-and-how-it-rejects/) giải thích vị trí đặt trạm, hàng đợi reject và cảm biến xác nhận.

## Sơ đồ luồng tín hiệu

```text
Cảm biến trigger ──> Camera / Vision Controller
       │                     │
       └──> PLC lưu ID      Kết quả OK/NG + ID
                 └───────────┘
                      │
              Queue theo sản phẩm
                      │
               Encoder / vị trí
                      │
               Reject actuator
                      │
              Cảm biến xác nhận
```

## Vì sao chỉ dùng delay timer có thể nguy hiểm?

Nếu băng tải chạy ở tốc độ cố định và sản phẩm cách đều, delay theo thời gian có thể đủ. Nhưng khi biến tần tăng/giảm tốc hoặc băng tải dừng rồi chạy lại, delay cố định không còn tương ứng với vị trí.

**Encoder** cho phép tracking theo quãng đường thực. PLC lưu vị trí xung khi sản phẩm được trigger, gắn kết quả kiểm tra theo ID, rồi kích reject khi đạt khoảng cách đã hiệu chuẩn.

Ví dụ minh họa: khoảng cách camera–reject 600 mm, encoder tương ứng 2 xung/mm → mục tiêu 1.200 xung. Thông số này phải xác định theo cơ cấu thực và tính đến thời gian tác động của xy lanh, slip băng tải và biến động cơ khí.

## Những trạng thái cần xử lý

- Camera timeout / no-result phải đưa sản phẩm vào trạng thái **unknown**, không tự coi là OK.
- Kết quả gửi trễ hoặc sai ID phải bị phát hiện.
- Mất điện hoặc reset PLC phải làm rõ các sản phẩm đang nằm giữa camera và reject.
- Khi reject kích, cần cảm biến xác nhận sản phẩm NG đã rời băng tải; nếu không, dừng hoặc báo lỗi theo đánh giá rủi ro máy.

## Bài toán mở rộng

Nếu băng tải có nhiều lane, sản phẩm sát nhau, sản phẩm trượt hoặc vật có thể đổi thứ tự, cần thêm cơ chế tracking phức tạp thay vì chỉ dùng một shift register đơn giản.

**Nguồn:** [Case Cognex In-Sight bottle inspection](https://www.vision-systems.com/factory/article/14174407/cognex-in-sight-bottle-inspection-vision-system) · [addaScan — Station placement and reject](https://addascan.co.za/resources/machine-vision-basics/where-a-station-sits-and-how-it-rejects/).

*Bài phân tích kỹ thuật độc lập; nội dung demo và hình ảnh thuộc nguồn được dẫn.*



*Ảnh bìa là ảnh dây chuyền camera kiểm tra chai thực tế do Vision Systems Design đăng trong case của EPIC Vision Systems: https://www.vision-systems.com/factory/article/14174407/cognex-in-sight-bottle-inspection-vision-system*
