// Relative to the site root; pages prefix it with siteUrl() so it works under a base path.
const stage = (data) => ({ ...data, path: `stages/${data.id}.html` });

export const LEVEL_LABELS = { beginner: 'Cơ bản', intermediate: 'Trung cấp', advanced: 'Nâng cao' };

export const PRACTICE_METHOD =
  'Với mỗi bài: mỗi lần chỉ đổi một thứ. So sánh các ảnh cạnh nhau trong darktable. Ghi một dòng cho mỗi ảnh: thông số, kết quả, lý do. Hôm sau chụp lại tấm yếu nhất.';

export const STAGES = [
  stage({
    id: 'exposure', number: '1', title: 'Phơi sáng: kiểm soát ánh sáng', level: 'beginner', weeks: '1–2', group: 'core',
    summary: 'Hiểu cách khẩu độ, tốc độ màn trập và ISO làm ảnh sáng hay tối.',
    learn: ['Cài đặt máy từ con số 0', 'Dùng stop để so sánh ánh sáng', 'Cân bằng khẩu độ, tốc độ màn trập và ISO', 'Đọc histogram và sửa phơi sáng'],
    assignments: [
      { id: 'aperture-ladder', title: 'Thang khẩu độ', task: 'Ở chế độ A, chụp một vật đứng yên bằng ống 35mm ở f/1.4, 2, 2.8, 4, 5.6, 8, 11 và 16.', check: 'Bạn chỉ ra được tấm mà hậu cảnh bắt đầu nét.' },
      { id: 'shutter-ladder', title: 'Thang tốc độ', task: 'Ở chế độ S, chụp nước chảy hoặc xe cộ từ 1/1000 giây xuống 1/4 giây, mỗi lần một stop.', check: 'Bạn nói được tốc độ chậm nhất vẫn còn "đóng băng" được chuyển động.' },
      { id: 'iso-test', title: 'Thử ISO', task: 'Trong phòng tối, chụp một cảnh ở ISO 100, 400, 1600, 6400 và 25600. Xem từng ảnh ở 100% trong darktable.', check: 'Bạn chọn được mức ISO cao nhất mà bạn thấy ảnh vẫn đủ sạch.' },
      { id: 'histogram-fix', title: 'Sửa bằng histogram', task: 'Chụp 30 tấm ở chế độ A. Sau mỗi tấm, đọc histogram và sửa phơi sáng bằng vòng bù trừ phơi sáng.', check: 'Không có vùng sáng quan trọng nào chạm mép phải histogram.' },
      { id: 'sunny-16', title: 'Quy tắc Sunny 16', task: 'Vào ngày nắng, đặt chế độ M, ISO 100, f/16 và 1/125 giây mà không nhìn đồng hồ đo sáng. Sau đó thử các mức cho trời mây và bóng râm.', check: 'Các ảnh của bạn lệch không quá một stop so với phơi sáng đúng.' },
    ],
  }),
  stage({
    id: 'focus', number: '2', title: 'Lấy nét và độ sắc nét', level: 'beginner', weeks: '3', group: 'core',
    summary: 'Làm nét đúng phần cần nét trong ảnh, lần nào cũng vậy.',
    learn: ['Chọn đúng chế độ và vùng lấy nét', 'Dùng Eye AF và lấy nét bằng nút sau', 'Kiểm soát độ sâu trường ảnh', 'Tìm giới hạn cầm tay của bạn'],
    assignments: [
      { id: 'nearest-eye', title: 'Mắt gần nhất', task: 'Với ống 85mm ở khoảng 2 m, chụp một người bạn hơi quay sang một bên ở f/1.8 và f/4. Dùng Eye AF ở AF-S.', check: 'Xem ở 100%, mắt gần bạn nhất nét ở cả hai tấm.' },
      { id: 'track-walker', title: 'Bám theo người đi bộ', task: 'Đặt AF-C. Nhờ một người bạn đi về phía bạn và chụp liên tiếp 10 tấm.', check: 'Ít nhất 7 trong 10 tấm nét ở khuôn mặt.' },
      { id: 'handheld-limit', title: 'Giới hạn cầm tay', task: 'Chụp một vật đứng yên bằng từng ống kính, từ 1/60 giây xuống 1/4 giây, mỗi tốc độ ba tấm.', check: 'Bạn biết tốc độ chậm nhất còn nét của ống 35mm và ống 85mm.' },
      { id: 'manual-peaking', title: 'Lấy nét tay với peaking', task: 'Đặt Peaking Level là Mid. Lấy nét tay 10 vật đứng yên.', check: '8 trong 10 tấm nét đúng chỗ bạn muốn.' },
    ],
  }),
  stage({
    id: 'composition', number: '3', title: 'Bố cục', level: 'intermediate', weeks: '4–5', group: 'core',
    summary: 'Sắp xếp khung hình để bức ảnh rõ ràng và mạnh mẽ.',
    learn: ['Làm khung hình gọn gàng', 'Dùng một phần ba, đường dẫn, khung và lớp', 'Điều khiển phối cảnh bằng khoảng cách', 'Khai thác một cảnh'],
    assignments: [
      { id: 'twenty-ways', title: '20 bố cục', task: 'Chọn một chủ thể. Chụp 20 tấm khác nhau trong 20 phút: di chuyển, ngồi xuống, đứng cao lên, đổi hậu cảnh.', check: 'Bạn chọn được 3 tấm đẹp vì 3 lý do khác nhau.' },
      { id: 'lens-swap', title: '35mm và 85mm', task: 'Chụp một người từ đầu đến eo bằng ống 35mm. Sau đó lùi lại và chụp đúng khung đó bằng ống 85mm.', check: 'Bạn mô tả được hậu cảnh đã thay đổi thế nào.' },
      { id: 'lines-walk', title: 'Dạo phố tìm đường dẫn', task: 'Trong một lần đi dạo, chỉ chụp những ảnh có một đường dẫn mắt tới chủ thể.', check: 'Bạn có 5 tấm mà đường dẫn kết thúc ở chủ thể.' },
      { id: 'three-heights', title: 'Ba độ cao', task: 'Chụp một cảnh từ sát mặt đất, ngang tầm mắt và từ trên cao.', check: 'Bạn nói được độ cao nào kể chuyện tốt nhất và vì sao.' },
    ],
  }),
  stage({
    id: 'light', number: '4', title: 'Ánh sáng và màu sắc', level: 'intermediate', weeks: '6–7', group: 'core',
    summary: 'Nhìn ánh sáng như nhiếp ảnh gia và chỉnh màu cho đúng.',
    learn: ['Phân biệt ánh sáng cứng và mềm', 'Dùng hướng sáng cho khuôn mặt', 'Lên kế hoạch cho giờ vàng và giờ xanh', 'Đặt cân bằng trắng'],
    assignments: [
      { id: 'four-times', title: 'Bốn thời điểm trong ngày', task: 'Chụp cùng một nơi lúc bình minh, giữa trưa, giờ vàng và giờ xanh.', check: 'Bạn mô tả được bóng đổ và màu sắc trong từng tấm.' },
      { id: 'window-turn', title: 'Xoay người bên cửa sổ', task: 'Cho một người đứng cạnh cửa sổ. Chụp khi họ nhìn thẳng ra cửa, rồi xoay 45°, 90°, 135° và 180°.', check: 'Bạn chọn được hướng sáng bạn thích nhất cho khuôn mặt.' },
      { id: 'wb-sunset', title: 'Cân bằng trắng lúc hoàng hôn', task: 'Lúc hoàng hôn, chụp một cảnh với cân bằng trắng Auto, Daylight và Shade.', check: 'Bạn giải thích được vì sao Shade cho ảnh ấm nhất.' },
      { id: 'complementary', title: 'Màu bổ túc', task: 'Tìm và chụp 5 cảnh có cam cạnh xanh dương, hoặc đỏ cạnh xanh lá.', check: 'Trong mỗi tấm, hai màu đều dễ nhận ra.' },
    ],
  }),
  stage({
    id: 'editing', number: '5', title: 'Quy trình chỉnh ảnh (darktable)', level: 'intermediate', weeks: '8', group: 'core',
    summary: 'Biến file RAW thành ảnh hoàn chỉnh trong darktable.',
    learn: ['Sắp xếp và lọc ảnh một buổi chụp', 'Chỉnh file RAW theo một thứ tự cố định', 'Chỉnh cả bộ ảnh cùng lúc', 'Xuất ảnh và sao lưu'],
    assignments: [
      { id: 'cull-ten', title: 'Lọc còn 10 tấm', task: 'Nhập một buổi chụp bằng add to library. Loại ảnh hỏng bằng phím R, rồi chấm sao cho đến khi còn 10 tấm từ 3 sao trở lên.', check: 'Bạn có đúng 10 tấm được chọn.' },
      { id: 'edit-ten', title: 'Chỉnh 10 tấm theo thứ tự', task: 'Chỉnh 10 tấm đã chọn theo thứ tự làm việc của chặng này. Lưu một snapshot trước khi bắt đầu mỗi tấm.', check: 'Mỗi tấm sau khi chỉnh đều đẹp hơn snapshot của nó.' },
      { id: 'export-web', title: 'Xuất bộ ảnh cho web', task: 'Xuất 10 tấm dạng JPEG, sRGB, chất lượng 90, kích thước tối đa 2048 × 2048.', check: 'Cả 10 file mở được trên điện thoại và trông giống như trên máy tính.' },
      { id: 'backup-321', title: 'Sao lưu', task: 'Thiết lập quy tắc 3-2-1: máy tính, một ổ cứng ngoài và một bản ở nơi khác. Nhớ chép cả file .xmp.', check: 'Bạn tìm thấy cùng một tấm ảnh trên cả 3 bản sao.' },
    ],
  }),
  stage({
    id: 'advanced-editing', number: '6', title: 'Chỉnh ảnh nâng cao (darktable và GIMP)', level: 'advanced', weeks: '9–10', group: 'core',
    summary: 'Chỉnh từng vùng ảnh, chỉnh màu và chỉnh sửa chi tiết (retouch) trong darktable và GIMP.',
    learn: ['Chỉnh từng phần ảnh bằng mặt nạ', 'Làm sáng, làm tối cục bộ và tạo tương phản', 'Chỉnh màu theo vùng sáng tối và tạo style', 'Chỉnh sửa da và vết bẩn trong GIMP'],
    assignments: [
      { id: 'graduated-sky', title: 'Bầu trời chuyển sắc', task: 'Làm tối bầu trời trong một ảnh phong cảnh bằng mặt nạ gradient trong module exposure.', check: 'Bạn không nhìn ra chỗ mặt nạ kết thúc.' },
      { id: 'portrait-retouch', title: 'Chỉnh sửa chân dung', task: 'Trong GIMP, xóa 5 vết mụn bằng Heal và làm đều da bằng Wavelet decompose.', check: 'Xem ở 100%, lỗ chân lông và kết cấu da vẫn còn.' },
      { id: 'set-style', title: 'Một style cho sáu tấm', task: 'Tạo một style từ bản chỉnh đẹp nhất và áp dụng cho một bộ 6 tấm.', check: '6 tấm trông như cùng một loạt ảnh.' },
      { id: 'hdr-merge', title: 'Ghép HDR', task: 'Chụp bù trừ 3 tấm trên chân máy và ghép bằng create HDR.', check: 'Cả bầu trời sáng lẫn vùng tối đều giữ được chi tiết.' },
    ],
  }),
  stage({
    id: 'portrait', number: '7a', title: 'Chân dung (85mm)', level: 'advanced', weeks: '11', group: 'track',
    summary: 'Chụp chân dung đẹp với ống 85mm.',
    learn: ['Chọn khoảng cách và thông số chụp chân dung', 'Tách người khỏi hậu cảnh', 'Tìm ánh sáng đẹp cho khuôn mặt', 'Hướng dẫn người mẫu bằng hành động'],
    assignments: [
      { id: 'five-frame-set', title: 'Bộ chân dung năm tấm', task: 'Chụp một người: cận mặt, ngang eo, toàn thân, chân dung môi trường bằng ống 35mm và một tấm tự nhiên.', check: '5 tấm cùng kể một câu chuyện về người đó.' },
      { id: 'three-lights', title: 'Ba kiểu ánh sáng', task: 'Chụp cùng một người trong bóng râm mở, bên cửa sổ ở góc 45° và ngược sáng có tấm hắt sáng.', check: 'Bạn nói được kiểu sáng nào hợp nhất với khuôn mặt này.' },
      { id: 'direct-actions', title: 'Hướng dẫn bằng hành động', task: 'Hướng dẫn một người bạn qua 5 hành động: đi, quay người, nhìn ra xa, cười, ngồi. Đừng bảo họ tạo dáng.', check: 'Ít nhất 3 tấm trông tự nhiên, không gượng.' },
    ],
  }),
  stage({
    id: 'street', number: '7b', title: 'Đường phố và phóng sự (35mm)', level: 'advanced', weeks: '12', group: 'track',
    summary: 'Bắt khoảnh khắc thật và kể chuyện với ống 35mm.',
    learn: ['Lấy nét vùng với ống 35mm', 'Nhìn ra ánh sáng, các lớp và cử chỉ', 'Chụp đúng mực và đúng luật', 'Kể chuyện bằng một phóng sự ảnh'],
    assignments: [
      { id: 'one-hour-theme', title: 'Một giờ, một chủ đề', task: 'Đi bộ một giờ chỉ với ống 35mm. Chọn một chủ đề, ví dụ bàn tay hay bóng đổ.', check: 'Bạn có 5 tấm đúng chủ đề.' },
      { id: 'fishing', title: 'Ngồi chờ khoảnh khắc', task: 'Tìm chỗ có ánh sáng đẹp và hậu cảnh gọn. Chờ 20 phút ở đó cho đến khi đúng người bước vào.', check: 'Một tấm có người đứng đúng chỗ bạn đã chọn.' },
      { id: 'photo-essay', title: 'Phóng sự ảnh', task: 'Chụp một câu chuyện 8 tấm về một nơi hay một sự kiện: toàn cảnh, trung cảnh, chi tiết, chân dung, khoảnh khắc, kết thúc.', check: 'Một người không có mặt ở đó kể lại được câu chuyện từ 8 tấm ảnh.' },
    ],
  }),
  stage({
    id: 'landscape', number: '7c', title: 'Phong cảnh và du lịch', level: 'advanced', weeks: '13', group: 'track',
    summary: 'Lên kế hoạch, chụp và chia sẻ những nơi bạn đến, với chiều sâu và ánh sáng đẹp.',
    learn: ['Lên kế hoạch theo ánh sáng và thời tiết', 'Giữ nét từ gần đến xa', 'Chụp phơi sáng lâu và chụp bù trừ', 'Kể một câu chuyện du lịch'],
    assignments: [
      { id: 'golden-plan', title: 'Lên kế hoạch giờ vàng', task: 'Dùng SunCalc.org để lên kế hoạch một buổi chụp bình minh hoặc hoàng hôn. Đến sớm 30 phút.', check: 'Bạn đã sẵn sàng trước khi ánh sáng đẹp nhất bắt đầu.' },
      { id: 'long-exposure', title: 'Phơi sáng lâu', task: 'Dùng chân máy và kính lọc ND, hoặc chụp lúc giờ xanh, để chụp nước hay mây chuyển động trong 1 giây trở lên.', check: 'Phần chuyển động trông mượt, phần đứng yên vẫn nét.' },
      { id: 'travel-story', title: 'Câu chuyện du lịch', task: 'Làm một câu chuyện du lịch 6 tấm: toàn cảnh, con người, chi tiết, món ăn, phương tiện, buổi tối.', check: '6 tấm cho thấy một vùng đất, không chỉ các điểm tham quan nổi tiếng.' },
    ],
  }),
  stage({
    id: 'night', number: '7d', title: 'Chụp đêm và thiếu sáng', level: 'advanced', weeks: '14', group: 'track',
    summary: 'Chụp ảnh nét và sạch khi ánh sáng yếu.',
    learn: ['Chụp ảnh nét khi cầm tay vào ban đêm', 'Chọn nhiễu hạt thay vì bị mờ', 'Chụp vệt sáng và ánh đèn thành phố', 'Thử chụp sao lần đầu'],
    assignments: [
      { id: 'night-street', title: 'Đường phố đêm, cầm tay', task: 'Chụp 20 tấm trên một con phố có đèn, cầm tay, với ống 35mm ở f/1.4.', check: 'Ít nhất 10 tấm nét khi xem ở 100%.' },
      { id: 'light-trails', title: 'Vệt sáng', task: 'Vào giờ xanh, đặt máy lên chân máy. Chụp xe cộ ở ISO 100, f/8 đến f/11, trong 5 đến 30 giây.', check: 'Vệt sáng dài và không có đèn nào cháy thành mảng trắng lớn.' },
      { id: 'first-stars', title: 'Tấm ảnh sao đầu tiên', task: 'Vào đêm không trăng, xa ánh đèn thành phố, chụp sao bằng ống 35mm theo thời gian NPF.', check: 'Xem ở 100%, sao là những chấm tròn, không phải vệt.' },
    ],
  }),
  stage({
    id: 'your-eye', number: '8', title: 'Con mắt riêng và portfolio', level: 'advanced', weeks: '15–16', group: 'final',
    summary: 'Phát triển phong cách riêng và xây dựng portfolio.',
    learn: ['Học từ các bậc thầy', 'Đọc và nhận xét ảnh', 'Xây dựng portfolio 12 tấm', 'In và chia sẻ ảnh của bạn'],
    assignments: [
      { id: 'study-three', title: 'Nghiên cứu ba bậc thầy', task: 'Chọn 3 tấm ảnh của các bậc thầy trong trang này. Với mỗi tấm, viết bạn thấy gì, ảnh được chụp thế nào và ảnh có ý nghĩa gì.', check: 'Bạn viết ít nhất 3 câu cho mỗi tấm.' },
      { id: 'portfolio-12', title: 'Xây dựng portfolio 12 tấm', task: 'Chọn 12 tấm đẹp nhất. Chỉnh chúng theo một phong cách thống nhất và sắp xếp thứ tự.', check: 'Tấm nào cũng xứng đáng có mặt; bạn không muốn bỏ tấm nào.' },
      { id: 'feedback-three', title: 'Xin nhận xét', task: 'Cho 3 người xem portfolio. Hỏi họ tấm nào đọng lại trong tâm trí và tấm nào họ sẽ bỏ.', check: 'Bạn đã thay đổi ít nhất một điều nhờ nhận xét.' },
      { id: 'print-five', title: 'In năm tấm', task: 'In 5 tấm ảnh, khổ ít nhất 13 × 18 cm.', check: 'Ảnh in đẹp như khi xem trên màn hình.' },
    ],
  }),
];

export function getStage(id) {
  return STAGES.find((s) => s.id === id);
}

export function stageNeighbors(id) {
  const index = STAGES.findIndex((s) => s.id === id);
  if (index < 0) return { prev: null, next: null };
  return {
    prev: index > 0 ? STAGES[index - 1] : null,
    next: index < STAGES.length - 1 ? STAGES[index + 1] : null,
  };
}

export function weeksLabel(weeks) {
  return `Tuần ${weeks}`;
}
