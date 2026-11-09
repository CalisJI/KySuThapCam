---
title: "Figure Helix 2.5: robot hình người làm việc ở 30 ngôi nhà chưa từng được huấn luyện"
date: 2026-11-09
tag: Humanoid AI
color: "#e8590c"
cover: https://images.ctfassets.net/qx5k8y1u9drj/4CPKQKu184BLNmPpAgHKuM/04ae48b4a30aaf37bd65a411f2372ef6/OPEN_GRAPH_IMAGE_helix_2.5.jpg
excerpt: "Figure công bố thử nghiệm zero-shot Helix 2.5 ở 30 ngôi nhà lạ: tỷ lệ hoàn thành từ 9% lên 56% nhờ tiền huấn luyện. Kết quả có nghĩa gì?"
draft: false
---

**Điều gì khó hơn việc khiến robot hình người gấp được khăn?** Đó là khiến nó **gấp khăn trong một căn nhà chưa từng nhìn thấy** — không cần thu thập thêm dữ liệu hay huấn luyện lại cho chính căn nhà đó.

Ngày **17/9/2026**, Figure AI công bố **Helix 2.5**, một mô hình điều khiển humanoid tập trung vào khả năng tổng quát hóa thao tác trong môi trường mới. Đây là một bước tiến nghiên cứu đáng chú ý trong hướng **Physical AI**, dù chưa thể coi robot gia dụng đa năng đã trở thành sản phẩm phổ thông.

## Figure thử nghiệm như thế nào?

Theo báo cáo kỹ thuật do Figure tự công bố, công ty sử dụng mô hình được tiền huấn luyện trên **Index**, bộ dữ liệu hành vi con người, rồi thử các tác vụ trong **30 ngôi nhà thật chưa xuất hiện trong dữ liệu đánh giá**.

Ba nhóm thao tác được đưa vào thử nghiệm là:

- Dọn phòng khách, đưa các món đồ vào giỏ;
- Gấp khăn và xếp vào giỏ;
- Chỉnh gối, chăn để dọn giường.

**Zero-shot** trong trường hợp này có nghĩa là không thu thập dữ liệu hay tinh chỉnh mô hình theo **30 căn nhà đánh giá**. Điều này **không có nghĩa robot chưa từng được huấn luyện kỹ năng dọn phòng, gấp khăn hoặc làm giường**: các nhiệm vụ vẫn có dữ liệu chỉ dẫn riêng từ những môi trường khác.

## Con số 56% nói lên điều gì?

Trong thiết kế thử nghiệm so sánh của Figure:

| Cách huấn luyện | Tỷ lệ hoàn thành tác vụ zero-shot |
| --- | ---: |
| Mô hình học từ đầu, không có tiền huấn luyện Index | **9%** |
| Mô hình có tiền huấn luyện Index | **56%** |

Các bài thử yêu cầu **hoàn thành toàn bộ công việc**, không tính điểm cho phần làm được một nửa. Figure nhấn mạnh sự khác biệt đến từ tiền huấn luyện dữ liệu hành vi rộng hơn, trong khi các điều kiện khác của thử nghiệm được giữ cố định.

Đây là kết quả **do Figure công bố trong bộ thử nghiệm của mình**. Không nên diễn giải thành “robot đã làm việc thành công trong mọi gia đình với tỷ lệ 56%” hoặc lấy chỉ số đó dự báo năng lực thực tế của mọi robot humanoid khác.

## Vì sao đây là bước chuyển quan trọng?

Robot truyền thống thường dễ kiểm soát nhất khi **đối tượng, vị trí, quy trình và môi trường** tương đối cố định. Nhưng đời sống thực có đủ kiểu ngẫu nhiên: khăn dày mỏng khác nhau, giường cao thấp khác nhau, đồ vật bị che khuất và không gian di chuyển thay đổi.

Nếu một mô hình có thể chuyển kiến thức hành vi từ các môi trường đã học sang môi trường lạ, thời gian cấu hình cho mỗi ứng dụng có thể giảm. Đây là vấn đề mang tính cốt lõi để humanoid vượt khỏi những video trình diễn được chuẩn bị kỹ.

## Điều gì chưa được chứng minh?

- Thử nghiệm được thực hiện trong 30 nhà với **ba nhóm tác vụ xác định**, không phải mọi việc gia đình.
- Tỷ lệ hoàn thành **56%** vẫn còn khoảng cách lớn so với yêu cầu tin cậy của thiết bị thương mại.
- Chưa có kiểm chứng độc lập về độ ổn định dài hạn, an toàn khi có trẻ em/vật nuôi hay chi phí sử dụng.
- Việc đi lại và thao tác thành công trong nhà ở không tự động chứng minh robot đã phù hợp môi trường sản xuất.

**Góc nhìn Kỹ Sư Thập Cẩm:** tin đáng quan tâm ở đây là **khả năng chuyển kỹ năng sang môi trường mới**, chứ không phải một động tác đẹp. Nếu Physical AI phát triển đúng hướng, tương lai robot có thể dành ít thời gian lập trình tay theo từng vị trí hơn — nhưng vẫn cần quy trình an toàn và đo hiệu suất tại nơi sử dụng.

## Xem thử nghiệm gốc và nguồn

- [Figure — Helix 2.5: Zero-Shot 30-Home Generalization, ngày 17/9/2026](https://www.figure.ai/news/helix-2-5-zero-shot-30-home-generalization)
- [Figure — Helix, nền tảng AI điều khiển humanoid](https://www.figure.ai/helix)
- [Figure — Index, dữ liệu hành vi để tiền huấn luyện, ngày 25/8/2026](https://www.figure.ai/news/introducing-index)

*Bài do Kỹ Sư Thập Cẩm tổng hợp độc lập ngày 9/11/2026 từ báo cáo do Figure AI công bố. **9% và 56% là kết quả do Figure tự báo cáo**, không phải thử nghiệm độc lập.*

*Ảnh: [Figure AI — Helix 2.5](https://www.figure.ai/news/helix-2-5-zero-shot-30-home-generalization); nguồn hình công bố chính thức, bản quyền thuộc Figure AI. Không phải hình ảnh dự án do Kỹ Sư Thập Cẩm thực hiện.*
