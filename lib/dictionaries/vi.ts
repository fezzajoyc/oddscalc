// vi — từ điển tiếng Việt. Hình dạng khóa phải khớp en chính xác (tests/seo.test.ts).
// Giữ nguyên "Oddscalc", các placeholder {n}/{count}/{query}/{category} và token kỹ thuật.
const vi = {
  brand: "Oddscalc",
  tagline: "Mọi xác suất đều chính xác, ngay trong trình duyệt.",
  metaDesc:
    "Máy tính xác suất chính xác: tổng xúc xắc, tung đồng xu, xác suất trúng số và nghịch lý ngày sinh — công thức hiển thị rõ, phân số chính xác. Miễn phí, chạy trong trình duyệt, không tải lên gì.",

  nav: {
    tools: "Tất cả công cụ",
    categories: "Danh mục",
    about: "Giới thiệu",
    menu: "Menu",
    language: "Ngôn ngữ",
  },

  home: {
    heroTitle: "Xác suất chính xác, không phỏng đoán — xúc xắc, đồng xu, số trúng",
    heroSub:
      "Oddscalc là bộ máy tính xác suất cho thấy cách tính: tổng xúc xắc bằng đếm tổ hợp, đồng xu bằng công thức nhị thức, số trúng bằng phân bố siêu bội, nghịch lý ngày sinh bằng tích lặp. Mỗi số đi kèm phân số chính xác của nó — không mô phỏng, không làm tròn, không gửi đi đâu.",
    browseAll: "Xem tất cả công cụ",
    categoriesTitle: "Danh mục",
    featuredTitle: "Công cụ phổ biến",
    trustLocal: "File luôn ở lại thiết bị của bạn",
    trustFree: "Miễn phí, không cần tài khoản",
    trustFast: "Tức thì, dùng được cả khi offline",
    rotating: [
      "2d6 ra tổng 7 trong 6 trên 36 cách — bảng chứng minh luôn",
      "3 lần tung, 2 mặt ngửa: đúng 3/8, không phải «khoảng»",
      "6 chọn từ 49? Jackpot 1 trên 13.983.816, trúng 3: 1 trên 57",
      "23 người là đã quá 50% cho một ngày sinh trùng nhau",
    ],
    statsLabels: { tools: "công cụ", languages: "ngôn ngữ", uploads: "lượt tải lên", accounts: "tài khoản" },
    eyebrow: "Miễn phí mãi mãi",
    heroCtaSecondary: "Cách hoạt động",
    statsTools: "{n} công cụ",
    statsLanguages: "{n} ngôn ngữ",
    statsUploads: "0 lượt tải lên",
    statsAccounts: "0 tài khoản",
    categoriesSub: "Một họ máy tính xác suất — chính xác hết, chạy trên thiết bị của bạn.",
    popularSub: "Những công cụ được mở nhiều nhất.",
    privacyTitle: "Số của bạn không bao giờ rời thiết bị của bạn.",
    privacySub:
      "Không có bước tải lên. Các công cụ là JavaScript chạy trong trình duyệt của bạn — đó không phải lời hứa về chính sách, mà là cách chúng được xây dựng.",
    privacyPoint1T: "Xử lý cục bộ",
    privacyPoint1D:
      "File được đọc bằng File API của chính trình duyệt và xử lý trong bộ nhớ. Không có gì được truyền đi bất cứ đâu.",
    privacyPoint2T: "Không cần tài khoản",
    privacyPoint2D: "Không đăng ký, không email, không lưu lịch sử. Mở công cụ lên và dùng ngay.",
    privacyPoint3T: "Trung thực từ thiết kế",
    privacyPoint3D:
      "Nếu có gì đó thực sự không thể làm trong trình duyệt, chúng tôi nói thẳng thay vì giả vờ được.",
    privacyLink: "Đọc ghi chú riêng tư đầy đủ",
    endTitle: "Chọn một công cụ. Nó chỉ đơn giản là hoạt động.",
    endSub: "Bốn máy tính, mười lăm ngôn ngữ, không một lượt tải lên.",
  },

  tools: {
    title: "Tất cả công cụ",
    subtitle: "Tìm kiếm trong {count} công cụ trình duyệt miễn phí. Không tải lên, không đăng ký.",
    filterPlaceholder: "Tìm công cụ…",
    count: "{count} công cụ",
    empty: "Không có công cụ nào khớp với “{query}”.",
  },

  categories: {
    pdf: { name: "PDF", desc: "Gộp, tách, chuyển đổi và chỉnh sửa file PDF mà không cần tải lên bất cứ đâu." },
    image: { name: "Ảnh", desc: "Nén, đổi kích thước, cắt và chuyển đổi ảnh ngay trong trình duyệt của bạn." },
    text: { name: "Văn bản", desc: "Đếm, làm sạch, sắp xếp và biến đổi văn bản tức thì khi bạn gõ." },
    developer: { name: "Lập trình viên", desc: "Trình định dạng, bộ mã hóa, bộ giải mã và trình tạo cho công việc dev hằng ngày." },
    seo: { name: "SEO", desc: "Thẻ meta, dữ liệu có cấu trúc, xem trước SERP và các trợ thủ SEO trên trang." },
    security: { name: "Bảo mật", desc: "Mật khẩu, hàm băm và tra cứu — tạo và kiểm tra ngay trên thiết bị của bạn." },
    utility: { name: "Tiện ích", desc: "Xúc xắc, đồng xu, số trúng và ngày sinh — xác suất với công thức hiển thị." },
  },

  tool: {
    howTo: "Cách sử dụng",
    faq: "Câu hỏi thường gặp",
    related: "Công cụ liên quan",
    privacyNote:
      "Công cụ này chạy hoàn toàn trong trình duyệt của bạn. Dữ liệu không bao giờ rời khỏi thiết bị — không được tải lên bất kỳ máy chủ nào.",
    inCategory: "Xem thêm trong {category}",
    backToCategory: "Tất cả công cụ {category}",
  },

  common: {
    openTool: "Mở công cụ",
    copy: "Sao chép",
    copied: "Đã sao chép",
    download: "Tải xuống",
    reset: "Đặt lại",
    swap: "Đảo chiều",
    clear: "Xóa",
    error: "Đã xảy ra lỗi. Kiểm tra dữ liệu nhập và thử lại.",
    input: "Đầu vào",
    output: "Kết quả",
    settings: "Tùy chọn",
    dropFiles: "Kéo thả file vào đây hoặc bấm để chọn",
    dropFile: "Kéo thả file vào đây hoặc bấm để chọn",
    processing: "Đang xử lý…",
    fileSize: "Dung lượng",
    sample: "Dùng thử ví dụ",
    uppercase: "CHỮ IN HOA",
  },

  unit: {
    from: "Từ",
    to: "Sang",
    amount: "Số lượng",
    result: "Kết quả",
    common: "Chuyển đổi thường dùng",
    formula: "Công thức",
    allUnits: "Tất cả đơn vị",
  },

  text: {
    stats: {
      words: "Từ",
      characters: "Ký tự",
      charsNoSpaces: "Không khoảng trắng",
      sentences: "Câu",
      paragraphs: "Đoạn",
      lines: "Dòng",
      readingTime: "Thời gian đọc",
      readingMinutes: "{n} phút đọc",
    },
  },

  footer: {
    line: "Máy tính xác suất chính xác. Mọi thứ chạy trong trình duyệt của bạn.",
    privacy: "Quyền riêng tư",
    terms: "Điều khoản",
    about: "Giới thiệu",
    badges: "Huy hiệu",
    language: "Ngôn ngữ",
  },

  badge: {
    title: "Huy hiệu Oddscalc",
    desc: "Gắn huy hiệu Oddscalc lên trang web, README hay tài liệu của bạn. Nó dẫn về đây và cho mọi người biết các xác suất phía sau được tính chính xác ngay trong trình duyệt.",
    voluntary: "Việc nhúng hoàn toàn tự nguyện — chọn một huy hiệu nếu bạn thích dự án này. Không cần xin phép ai.",
    md: "Markdown (README)",
    html: "HTML (trang web)",
    thanks: "Cảm ơn bạn đã lan tỏa — mỗi lượt nhúng giúp nhiều người hơn khám phá những công cụ tôn trọng file của họ.",
  },

  embed: {
    title: "Nhúng công cụ này",
    desc: "Đưa công cụ này vào trang của bạn bằng một dòng — nó chạy trong trình duyệt của khách.",
  },

    mcp: {
    title: "Máy chủ MCP — công cụ cho AI gọi trực tiếp",
    desc1: "Oddscalc đi kèm máy chủ MCP (Model Context Protocol): các trợ lý AI như Claude hay Cursor có thể chạy chính các máy tính xác suất trên site này — cùng logic đã kiểm thử, không viết lại.",
    desc2: "Các công cụ chạy chính hàm thuần của site: phân bố xúc xắc, thống kê nhị thức đồng xu, xác suất trúng số siêu bội, và tích ngày sinh. Việc thực thi diễn ra qua npx trên máy của AI client — không gửi gì tới máy chủ của chúng tôi.",
    toolsTitle: "Công cụ chạy được ({n})",
    requiresNode: "Cần Node.js 18+. Máy chủ chạy cục bộ qua stdio; chỉ các lệnh bạn gọi được tính trên máy của bạn.",
    privacy: "Cần Node.js 18+. Máy chủ chạy cục bộ qua stdio; chỉ các lệnh bạn gọi được tính trên máy của bạn.",
  },

    notFound: {
    title: "Không tìm thấy trang",
    body: "Công cụ bạn tìm không tồn tại. Hãy xem tất cả công cụ thay thế.",
    home: "Về trang chủ",
  },
};

export default vi;
