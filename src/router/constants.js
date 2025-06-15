export const ROUTES = {
  // Public routes
  HOME: "/",
  NOW_SHOWING: "/phim-dang-chieu",
  UPCOMING: "/phim-sap-chieu",
  MOVIE_DETAIL: "/phim/:slug",
  MOVIE_GENRE: "/dien-anh",
  MOVIE_ACTOR: "/dien-vien",
  MOVIE_DIRECTOR: "/dao-dien",
  MOVIE_REVIEW: "/binh-luan-phim",
  MOVIE_BLOG: "/blog-dien-anh",
  TICKET: "/mua-ve",
  EVENT: "/uu-dai",
  EVENT_DETAIL: "/uu-dai/:slug",

  // Private routes
  PROFILE: "/thong-tin-ca-nhan",
  TICKET_INFO: "/thong-tin-ve",

  // Admin routes
  DASHBOARD: "/thong-ke",
  USER_MANAGEMENT: "/admin/quan-ly-nguoi-dung",
  MOVIE_MANAGEMENT: "/admin/quan-ly-phim",
  CINEMA_MANAGEMENT: "/admin/quan-ly-rap",
  SCHEDULE_MANAGEMENT: "/admin/quan-ly-lich-chieu",
  BLOG_MANAGEMENT: "/admin/quan-ly-blog",
  GENRE_MANAGEMENT: "/admin/quan-ly-loai-phim",
  PERSON_MANAGEMENT: "/admin/quan-ly-dao-dien-dien-vien",
  COUNTRY_MANAGEMENT: "/admin/quan-ly-quoc-gia",
  LOGIN_ADMIN: "/admin",
};
