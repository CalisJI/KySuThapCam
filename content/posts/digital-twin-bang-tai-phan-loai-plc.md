---
title: "Chưa có máy thật vẫn kiểm tra được PLC? Demo Digital Twin băng tải phân loại"
date: 2026-11-05
tag: Digital Twin
color: "#1f9d4d"
cover: https://img.youtube.com/vi/Xj_XoUGncQ8/hqdefault.jpg
excerpt: "Video thực tế: TIA Portal, PLCSIM Advanced và NX MCD kết hợp để mô phỏng băng tải phân loại, kiểm tra logic PLC trước khi lắp máy."
translation: digital-twin-transport-conveyor-plc
draft: false
---

**Có thể kiểm tra chương trình PLC của một dây chuyền khi chưa có băng tải, cảm biến hay cơ cấu chấp hành thật hay không?** Có — bằng phương pháp *Virtual Commissioning* (chạy thử, nghiệm thu ảo).

Dưới đây là một video demo do **Domenico Madeo** chia sẻ, dựa trên ví dụ đào tạo Digital Twin với **TIA Portal, S7-PLCSIM Advanced và Siemens NX Mechatronics Concept Designer (MCD)**. Ví dụ gốc xuất bản năm 2021; đây là bài chia sẻ nguyên lý và ý tưởng, **không phải một tin công nghệ mới ra mắt**.

## Video demo: Digital Twin của băng tải phân loại

<div style="position:relative;width:100%;aspect-ratio:16/9;margin:20px 0 12px"><iframe src="https://www.youtube-nocookie.com/embed/Xj_XoUGncQ8" title="Digital Twin of a Transport Conveyor — TIA Portal, PLCSIM Advanced and NX MCD" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="border:0;width:100%;height:100%;border-radius:12px"></iframe></div>

*Nếu trình phát không hiển thị: [xem trực tiếp video trên YouTube](https://www.youtube.com/watch?v=Xj_XoUGncQ8). Video thuộc kênh của tác giả gốc; Kỹ Sư Thập Cẩm chỉ nhúng trình phát và dẫn nguồn.*

## Điều gì đang diễn ra trong demo?

- **NX MCD** mô phỏng phần cơ khí và hành vi của hệ thống băng tải 3D.
- **TIA Portal** được sử dụng để phát triển chương trình PLC và HMI.
- **PLCSIM Advanced** giả lập bộ điều khiển PLC, trao đổi tín hiệu với môi trường ảo.
- Khi tín hiệu cảm biến ảo thay đổi, chương trình PLC phản hồi và điều khiển cơ cấu trong mô hình.

Điểm thú vị không nằm ở đồ họa 3D mà ở **vòng phản hồi điều khiển**: mô hình máy phát tín hiệu → PLC xử lý → cơ cấu ảo chuyển động → tín hiệu mới được cập nhật. Đây là sự khác biệt quan trọng giữa một đoạn hoạt hình máy móc và một mô hình phục vụ chạy thử logic điều khiển.

## Ý tưởng để kỹ sư tự thực hành

Hãy thử xây dựng một **máy phân loại 3 băng tải** gồm cảm biến quang, hai cơ cấu gạt, một PLC S7-1200 và màn hình HMI. Trước khi máy được chế tạo, có thể kiểm tra:

1. Sản phẩm đến sai thời điểm hoặc sát nhau thì logic phân loại xử lý thế nào?
2. Nếu cảm biến kẹt ON hoặc mất tín hiệu, máy có chuyển sang trạng thái lỗi không?
3. Khi nhấn Stop rồi Start lại, băng tải và cơ cấu gạt có chạy theo đúng trình tự không?
4. Có tồn tại tình huống hai cơ cấu được kích hoạt sai thứ tự gây va chạm không?

Đây là các phép thử logic và trình tự mà môi trường ảo có thể hỗ trợ. **Mô phỏng không thay thế hoàn toàn thử nghiệm thực tế**, nhất là khi liên quan quán tính, ma sát, sai lệch cơ khí và an toàn máy.

## Một ứng dụng thực tế cho doanh nghiệp Việt Nam

Với đơn vị chế tạo máy, tích hợp dây chuyền hoặc đào tạo PLC, cách tiếp cận này có thể hỗ trợ trao đổi thiết kế sớm hơn giữa nhóm điện, cơ khí và lập trình. Đặc biệt phù hợp với máy phân loại, cấp phôi, đóng gói và các cell nhiều cơ cấu liên động.

**Nguồn video và tài liệu:**
- [Video gốc trên YouTube](https://www.youtube.com/watch?v=Xj_XoUGncQ8)
- [Bài viết và mô tả demo của Domenico Madeo](https://domenicomadeo.com/demo-application-examples-digital-twin-of-a-transport-conveyor-tia-portal-plcsim-advanced-and-nx-mcd/)
- [Ví dụ tài liệu Digital Twin trong chương trình Siemens SCE](https://www.automation.siemens.com/sce-static/learning-training-documents/tia-portal/digital-twin/application/digitaltwin-at-education-introduction-transport-system-ser-0420-en.pdf)

*Ảnh thumbnail là hình thu nhỏ của video gốc từ YouTube; không phải ảnh do AI tạo. Bài do Kỹ Sư Thập Cẩm biên soạn độc lập, không tải lại video hay tuyên bố sở hữu nội dung gốc.*