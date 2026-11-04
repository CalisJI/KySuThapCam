---
title: "Chọn PLC cho máy: cần cân nhắc gì"
date: 2026-11-04
tag: PLC
color: "#e8590c"
excerpt: Số I/O, kiểu ngõ ra, truyền thông và khả năng mở rộng — những điều cần
  chốt trước khi chọn model PLC cho máy nhỏ.
draft: false
---
Với một máy đơn lẻ, PLC thường chỉ là một hộp nhỏ trong tủ điện. Nhưng chọn sai model có thể khiến bạn phải đi dây lại, mua thêm module hoặc đổi cả phần mềm lập trình sau vài tháng. Dưới đây là những điểm nên chốt trước khi đặt hàng.

## 1. Đếm I/O thật chính xác

Liệt kê toàn bộ tín hiệu của máy, chia thành bốn nhóm:

- **Ngõ vào số (DI):** nút nhấn, công tắc hành trình, cảm biến tiệm cận, cảm biến quang.
- **Ngõ ra số (DO):** cuộn hút contactor, van điện từ, đèn báo, còi.
- **Ngõ vào tương tự (AI):** cảm biến nhiệt độ, áp suất, loadcell, tín hiệu 4–20 mA hoặc 0–10 V.
- **Ngõ ra tương tự (AO):** tín hiệu tốc độ cho biến tần, điều khiển van tỉ lệ.

Sau khi đếm, **cộng thêm khoảng 20–30% dự phòng** cho tín hiệu phát sinh khi chạy thử. Nếu danh sách chưa chốt, hãy chọn dòng PLC có thể gắn thêm module mở rộng thay vì mua model lớn nhất ngay từ đầu.

## 2. Chọn kiểu ngõ ra phù hợp tải

- **Ngõ ra relay:** đóng cắt được nhiều loại tải (AC/DC), tiện khi tải đa dạng, nhưng tốc độ chậm và tuổi thọ tiếp điểm có giới hạn.
- **Ngõ ra transistor:** nhanh, bền khi đóng cắt thường xuyên, cần thiết cho phát xung điều khiển servo/step; thường chỉ dùng cho tải DC và dòng nhỏ.

Đóng cắt van hoặc cuộn dây liên tục mỗi vài giây thì nên ưu tiên transistor (kèm rơ-le trung gian nếu tải lớn). Cũng cần kiểm tra điện áp cấp: phần lớn máy nhỏ dùng 24 VDC.

## 3. Xem các chức năng đặc biệt

Một số máy cần nhiều hơn logic bật/tắt:

- **Bộ đếm tốc độ cao (HSC)** để đọc encoder.
- **Ngõ ra xung** để điều khiển servo hoặc động cơ bước.
- **Điều khiển PID** cho nhiệt độ, áp suất.
- **Đồng hồ thời gian thực**, lưu công thức (recipe) hoặc ghi dữ liệu.

Hãy đối chiếu từng yêu cầu với thông số của model cụ thể, vì cùng một dòng PLC nhưng các phiên bản có thể khác nhau về số ngõ vào tốc độ cao hay số trục xung.

## 4. Truyền thông: nghĩ trước về HMI, biến tần và giám sát

Một máy nhỏ ngày nay thường kết nối với:

- màn hình HMI,
- biến tần hoặc servo,
- thiết bị đo, đồng hồ điện,
- hệ thống giám sát từ xa.

Kiểm tra PLC có sẵn cổng **RS-485 (Modbus RTU)**, **Ethernet (Modbus TCP hoặc giao thức hãng)** hay không, và có đủ số cổng cho các thiết bị trên. Cổng truyền thông đủ dùng ngay từ đầu giúp sau này thêm giám sát từ xa mà không phải thay PLC.

## 5. Khả năng mở rộng và vòng đời

- Dòng PLC có module mở rộng cùng hãng giúp bạn tăng I/O mà không thay CPU.
- Hỏi về **tình trạng cung cấp và thời gian giao hàng** của cả CPU lẫn module.
- Cân nhắc **phần mềm lập trình** (bản quyền, ngôn ngữ hỗ trợ) và kỹ thuật viên của bạn đã quen hãng nào, vì đây là chi phí dài hạn thường bị bỏ qua.

## Danh sách kiểm tra nhanh

1. Đã đếm DI/DO/AI/AO và cộng 20–30% dự phòng chưa?
2. Ngõ ra relay hay transistor, điện áp cấp là bao nhiêu?
3. Có cần HSC, xuất xung, PID hay lưu dữ liệu không?
4. Cổng truyền thông có đủ cho HMI, biến tần và giám sát không?
5. Có thể mở rộng thêm module về sau không?

## Cần tư vấn chọn model?

Gửi cho chúng tôi danh sách tín hiệu của máy, loại tải, thiết bị cần kết nối và số lượng, chúng tôi sẽ cùng bạn xác định cấu hình PLC phù hợp.

*Tham khảo thêm: hướng dẫn chọn PLC của Industrial Monitor Direct, Moreval và các tài liệu kỹ thuật của hãng. Nội dung trên được biên soạn lại theo kinh nghiệm thực tế.*