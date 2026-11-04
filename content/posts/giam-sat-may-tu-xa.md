---
title: "Bắt đầu giám sát máy từ xa"
date: 2026-11-02
tag: IoT
color: "#1f9d4d"
cover: /media/article-hmi-monitoring.jpg
excerpt: "Từ cảm biến, gateway đến dashboard: các thành phần cơ bản để theo dõi máy từ xa mà không cần thay máy cũ."
draft: false
---
Nhiều máy trong xưởng đã chạy ổn nhiều năm nhưng không cho biết lúc nào nó dừng, dừng bao lâu hay đang nóng bất thường. Giám sát từ xa không đòi hỏi thay máy: bạn gắn thêm cảm biến bên ngoài, đưa dữ liệu về một gateway nhỏ rồi hiển thị lên dashboard.

## Bốn lớp của một hệ thống giám sát

1. **Cảm biến:** đọc tín hiệu vật lý từ máy.
2. **Gateway (thiết bị biên):** thu thập, lọc và lưu đệm dữ liệu.
3. **Kênh truyền dữ liệu:** thường dùng MQTT hoặc Modbus TCP về máy chủ.
4. **Lưu trữ và dashboard:** biểu đồ, báo cáo thời gian dừng, cảnh báo.

Mỗi lớp có thể thay riêng, nên bạn không bị phụ thuộc vào một nhà cung cấp.

## Bước 1: Chọn cảm biến không cần can thiệp vào hệ thống điều khiển

- **Cảm biến dòng điện (CT kẹp):** kẹp quanh một dây cấp nguồn của máy. Không có dòng là máy tắt; dòng thấp, ổn định là máy chờ; dòng cao là đang chạy. Chỉ một tín hiệu này đã đủ tính thời gian chạy, thời gian chờ và số chu kỳ.
- **Cảm biến nhiệt độ:** gắn lên motor, hộp số, bộ thủy lực để phát hiện quá nhiệt sớm.
- **Cảm biến rung:** gắn lên vỏ motor hoặc gối đỡ, giúp phát hiện sớm mòn bi, lệch tâm.
- **Cảm biến áp suất, lưu lượng:** theo dõi hệ khí nén, thủy lực, phát hiện rò rỉ.

## Bước 2: Đọc dữ liệu từ PLC hoặc đồng hồ điện sẵn có

Nếu máy đã có PLC, biến tần hoặc đồng hồ đo điện có cổng RS-485 hoặc Ethernet, thường đọc được dữ liệu qua **Modbus RTU/TCP** mà không phải thay đổi chương trình. Chỉ nên **đọc**, không ghi vào thanh ghi của máy đang sản xuất trừ khi đã được thử nghiệm và phê duyệt.

## Bước 3: Gateway xử lý ngay tại hiện trường

Gateway tốt nên:
- **lấy mẫu nhanh, gửi chậm:** tổng hợp dữ liệu thành vài giá trị mỗi phút thay vì gửi từng mẫu;
- **phát hiện thay đổi trạng thái tại chỗ** để báo dừng máy trong vài giây;
- **lưu đệm khi mất mạng** và gửi lại sau, không mất lịch sử;
- **tách mạng xưởng khỏi mạng văn phòng** để giảm rủi ro an toàn thông tin.

## Bước 4: Dashboard và cảnh báo

Bắt đầu bằng vài chỉ số dễ hiểu:
- máy đang chạy, chờ hay dừng,
- thời gian chạy theo ca/ngày,
- nhiệt độ, dòng điện so với ngưỡng,
- cảnh báo qua ứng dụng nhắn tin hoặc email khi vượt ngưỡng.

Đừng cố hiển thị mọi thứ ngay. Hãy giữ dashboard đơn giản để người vận hành thực sự dùng nó.

## Lưu ý về an toàn và bảo mật

- Việc đấu nối bên trong tủ điện cần kỹ thuật viên điện có chuyên môn, và ngắt nguồn máy khi thao tác.
- Không mở cổng trực tiếp từ máy ra internet; dùng VPN hoặc kết nối ra ngoài được mã hóa.
- Đặt mật khẩu riêng cho từng thiết bị và cập nhật phần mềm định kỳ.

## Nên bắt đầu thế nào?

Chọn **một máy** hay gây dừng hoặc là nút thắt của dây chuyền, gắn cảm biến dòng và nhiệt độ, chạy thử vài tuần. Khi đã thấy thời gian dừng nằm ở đâu, việc mở rộng sang các máy khác sẽ dễ thuyết phục hơn.

## Cần chọn cảm biến và gateway?

Gửi cho chúng tôi loại máy, thiết bị điều khiển hiện có và thông số cần theo dõi, chúng tôi sẽ cùng bạn chọn cảm biến, gateway phù hợp.

*Tham khảo thêm: hướng dẫn retrofit IoT cho máy cũ của CrimsonEdge Systems và các tài liệu về MQTT, Modbus. Nội dung được biên soạn lại theo kinh nghiệm thực tế.*

*Ảnh bìa: [PLC displej](https://commons.wikimedia.org/wiki/File:PLC_displej.jpg) của Quist161, giấy phép [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), đã cắt khung, nguồn Wikimedia Commons.*
