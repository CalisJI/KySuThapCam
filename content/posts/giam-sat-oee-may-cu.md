---
title: "Giám sát OEE cho máy cũ: bắt đầu từ dữ liệu chạy và dừng máy"
date: 2026-11-05
tag: "IIoT"
color: "#1f9d4d"
cover: "/media/article-hmi-monitoring.jpg"
excerpt: "Demo Zapsi MES và ý tưởng nâng cấp giám sát máy đang vận hành, từ trạng thái máy đến phân tích downtime và OEE."
translation: oee-monitoring-existing-machines
draft: false
---

Một nhà xưởng có thể có nhiều máy vẫn chạy tốt nhưng không biết **máy đang chạy, chờ hay dừng bao lâu**. Không nhất thiết phải thay máy hoặc PLC để bắt đầu thu thập dữ liệu.

## Demo đáng xem

[**Xem video demo hệ thống Zapsi MES tại trang chính thức**](https://arcelormittal.zapsi.eu/en/info)

Video giới thiệu tổng quan máy đang giám sát, sản lượng theo kỳ, downtime, điện năng và chỉ số OEE.

## Cách triển khai phiên bản nhỏ

Với một nhóm máy CNC, máy ép hoặc máy đóng gói, có thể thu tín hiệu RUN/STOP từ PLC hoặc nguồn tín hiệu phù hợp, bổ sung bộ đếm sản phẩm và một gateway. Dữ liệu được lưu kèm mốc thời gian, rồi tính trạng thái máy theo ca. Nguyên nhân dừng máy thường cần thêm thao tác nhập của người vận hành hoặc tích hợp mã lỗi từ PLC.

OEE thường được phân tích theo **Availability × Performance × Quality**. Chỉ có tín hiệu chạy/dừng thì chưa đủ để tính OEE đầy đủ và đáng tin cậy.

## Điều cần kiểm thử

Xác thực thời gian dừng với nhật ký vận hành; phân biệt máy dừng có kế hoạch, thiếu nguyên liệu và sự cố; bảo vệ kết nối OT khỏi truy cập không được phép.

**Nguồn:** [Zapsi — MES System demonstration](https://arcelormittal.zapsi.eu/en/info). Đây là bài phân tích độc lập, không phải dự án do Kỹ Sư Thập Cẩm thực hiện.

*Video và hình ảnh thuộc tác giả hoặc chủ sở hữu nguồn; Kỹ Sư Thập Cẩm không sao chép hoặc lưu trữ lại file video của họ.*

*Ảnh bìa sử dụng ảnh minh họa HMI có sẵn của Kỹ Sư Thập Cẩm, không phải ảnh giao diện Zapsi.*
