---
title: "Tích hợp robot với PLC: 6 nhóm tín hiệu nên chốt trước khi chạy Auto"
date: 2026-11-09
tag: Robotics
color: "#e8590c"
cover: https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Robot_arm_picks_up_cylindrical_objects_in_a_factory_setting.jpg/960px-Robot_arm_picks_up_cylindrical_objects_in_a_factory_setting.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20260523081047
excerpt: "Robot có thể chạy tốt khi dạy điểm nhưng lỗi khi ghép vào dây chuyền. Cùng xem handshake PLC–robot, PROFINET, interlock và safety cần được thiết kế ra sao."
translation: industrial-robot-plc-integration
draft: false
---

**Robot chạy tốt ở chế độ Teach chưa có nghĩa là cả dây chuyền đã chạy Auto ổn định.** Khi ghép robot với băng tải, máy CNC, đồ gá, cảm biến và HMI, bài toán thường chuyển từ “đi đúng tọa độ” sang **đúng trình tự – đúng điều kiện – đúng phản hồi – đúng an toàn**.

Bài này tổng hợp một cách tiếp cận ở mức kiến trúc điều khiển. Tên tín hiệu và sơ đồ bên dưới là **ví dụ minh họa**, không phải chuẩn mapping của mọi hãng robot.

## 1. Phân vai đúng giữa robot controller và PLC

Trong nhiều dây chuyền, **robot controller** xử lý quỹ đạo, chuyển động và công việc nội bộ của robot; **PLC** xử lý trình tự toàn máy, điều kiện công nghệ, băng tải, cấp phôi và liên động với các trạm khác.

Ví dụ một trạm gắp sản phẩm từ băng tải đặt vào đồ gá:

1. Cảm biến báo có sản phẩm, băng tải dừng hoặc khóa vị trí.
2. PLC xác nhận đồ gá sẵn sàng, không có lỗi công nghệ.
3. PLC gửi yêu cầu chu trình cho robot.
4. Robot báo đã nhận lệnh, di chuyển và thao tác gắp/đặt.
5. Robot xác nhận hoàn thành, PLC mở lại băng tải hoặc chuyển trạm.

Nếu chỉ phát xung Start mà không định nghĩa tín hiệu trả về và timeout, khi mất phôi hoặc robot dừng giữa chừng, PLC rất khó xác định phải phục hồi từ bước nào.

## 2. Sáu nhóm tín hiệu cần thống nhất

| Nhóm | Tín hiệu ví dụ | Câu hỏi kiểm tra |
| --- | --- | --- |
| **Trạng thái robot** | Ready, Auto Mode, Program Running | Robot đã đủ điều kiện nhận chu trình chưa? |
| **Yêu cầu chu trình** | Cycle Request, Job Number | PLC yêu cầu tác vụ nào, lệnh dạng xung hay duy trì? |
| **Xác nhận thực thi** | Command Accepted, Busy | Robot đã nhận lệnh và bắt đầu thực hiện chưa? |
| **Kết quả chu trình** | Cycle Done, Part Present, Gripper OK | Đã hoàn thành công việc thật hay chỉ kết thúc chương trình? |
| **Lỗi và phục hồi** | Fault, Error Code, Reset Acknowledge | Có cảnh báo gì, ai được quyền reset, có cần homing? |
| **Safety / interlock** | E-stop, Guard, Protective Stop, Safe Enable | Chức năng nào bắt buộc đi qua hệ thống an toàn được đánh giá? |

Các tên như *Ready, Busy, Done* là cách gọi phổ biến để trao đổi thiết kế. **Địa chỉ bit, thời gian giữ tín hiệu và ý nghĩa chính xác phải theo tài liệu của robot và PLC đang sử dụng.**

## 3. PROFINET trao đổi dữ liệu khác PROFIsafe

Có thể dùng hardwired I/O hoặc giao thức fieldbus để trao đổi trạng thái và lệnh. Với một số dòng robot Universal Robots, tài liệu của hãng hướng dẫn kết nối **PROFINET** giữa robot và Siemens PLC, bao gồm cấu hình GSDML, vùng thanh ghi và trạng thái kết nối.

Tuy nhiên, **PROFINET dữ liệu thông thường không tự biến tín hiệu thành chức năng an toàn**. Khi kiến trúc dùng safety qua mạng, cần phần cứng/phần mềm hỗ trợ cơ chế an toàn phù hợp, ví dụ **PROFIsafe** với PLC an toàn và phiên bản phần mềm robot tương thích.

Tài liệu tham khảo:
- [Universal Robots — PROFINET How-To Guide (e-Series, cập nhật 31/3/2026)](https://www.universal-robots.com/articles/ur/interface-communication/profinet-how-to-guide-e-series/)
- [Universal Robots — PROFIsafe Technical Guide (cập nhật 30/9/2026)](https://www.universal-robots.com/articles/ur/interface-communication/profisafe-technical-guide-for-e-series/)

Cấu hình phụ thuộc *model, phiên bản phần mềm, giấy phép, tệp GSDML* và kiến trúc safety cụ thể; không nên sao chép trực tiếp từ một dự án sang dự án khác.

## 4. Xây state machine thay cho chuỗi lệnh rời rạc

Một thiết kế dễ kiểm tra có thể mô tả bằng các trạng thái:

**IDLE → CHECK READY → SEND REQUEST → WAIT BUSY → WAIT DONE → VERIFY RESULT → NEXT CYCLE**

Kèm theo đó phải có các nhánh **FAULT**, **TIMEOUT**, **STOP** và **RECOVERY**. Ví dụ:

- Nếu hết thời gian mà robot chưa báo Busy, PLC chuyển sang trạng thái báo lỗi giao tiếp hoặc không nhận lệnh.
- Nếu robot báo Done nhưng cảm biến ở đầu gắp không xác nhận có sản phẩm, không được coi chu trình thành công.
- Sau E-stop, không tự ý chạy lại chỉ vì tín hiệu Ready chuyển ON; phải tuân theo trình tự reset và restart đã được đánh giá.

Đây chỉ là **mẫu tư duy lập trình**, không phải logic an toàn hoàn chỉnh.

## 5. Kịch bản FAT/SAT nên thử trước khi bàn giao

Ngoài chu trình bình thường, nên thử các lỗi khó chịu nhất khi vận hành thực tế:

- Mất sản phẩm hoặc robot gắp hụt.
- PLC gửi lệnh khi robot chưa sẵn sàng.
- Mất truyền thông giữa PLC và robot giữa chu trình.
- Robot dừng do lỗi khi đang mang tải.
- Băng tải chạy sai thời điểm khi robot chưa rút khỏi vùng giao nhau.
- Nhấn dừng khẩn, mở cửa bảo vệ và phục hồi từng tình huống theo quy trình.

Cần ghi rõ **đầu vào thử nghiệm, phản ứng mong đợi, thời gian đáp ứng, điều kiện được phép reset**, thay vì chỉ tick “đã chạy Auto”.

## 6. An toàn robot là vấn đề của toàn cell

**ISO 10218-2:2025** đề cập yêu cầu an toàn đối với ứng dụng và cell robot công nghiệp: tích hợp, vận hành, bảo trì và các giai đoạn khác trong vòng đời. Việc đánh giá rủi ro không thể dựa vào nhãn “cobot” hoặc một tín hiệu E-stop duy nhất.

Các điểm cần xem xét còn gồm đầu gắp, vật mang theo, hành trình có thể va chạm, độ tin cậy của thiết bị bảo vệ, khoảng cách dừng và khả năng con người tiếp cận để vận hành/bảo trì.

Xem: [ISO — Robotics: Safety requirements, Part 2:2025](https://www.iso.org/standard/73934.html).

## Kết luận

Khi triển khai một trạm robot, **cánh tay robot chỉ là một phần của giải pháp**. Cách PLC và robot bắt tay, xử lý sự cố và phối hợp với thiết bị an toàn quyết định lớn đến khả năng chạy ổn định và dễ bảo trì.

Nếu đang khảo sát tích hợp robot cho băng tải, đóng gói hoặc máy hiện hữu, hãy bắt đầu bằng **I/O list, sơ đồ trình tự, bản đồ vùng rủi ro và kịch bản xử lý lỗi** trước khi viết chương trình.

*Nội dung do Kỹ Sư Thập Cẩm biên soạn để chia sẻ kiến thức kỹ thuật, không thay thế đánh giá an toàn hoặc hướng dẫn commissioning của nhà sản xuất.*

*Ảnh bìa là ảnh minh họa robot công nghiệp, **không phải dự án của Kỹ Sư Thập Cẩm**. Ảnh: Nenad Stojković (Shixart1985), [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Robot_arm_picks_up_cylindrical_objects_in_a_factory_setting.jpg), [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), không chỉnh sửa.*
