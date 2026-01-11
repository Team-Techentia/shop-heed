import axios from "axios";

const postsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

const Api = {
  // ============================================
  // AUTH ROUTES - FIXED
  // ============================================
  checkMobile: (data) => postsApi.post("/auth-api/check-mobile", data),
  sendOTP: (data) => postsApi.post("/auth-api/send-otp", data),
  verifyOtp: (data) => postsApi.post("/auth-api/verify-otp", data),
  
  // ✅ FIXED: Changed from /user/signUp to /auth-api/user/signup
  signUp: (data) => postsApi.post("/auth-api/user/signup", data),
  
  // ✅ FIXED: Changed from /user/login to /auth-api/user/login
  loginUser: (data) => postsApi.post("/auth-api/user/login", data),
  
  checkIsLogin: (token) => postsApi.get("/auth-api/is-login-check", token),
  
  // Legacy methods (keeping for backward compatibility)
  checkUser: (data) => postsApi.post("/auth-api/check-email-mobile", data),
  loginRegisterForCheckOutPage: (data) => postsApi.post("/auth-api/login-register-forCheck-outPage", data),

  // ============================================
  // USER ROUTES
  // ============================================
  getUserById: (token) => postsApi.get("/all-user-by-id", token),
  profileChange: (data, token) => postsApi.put("/profile-change-by-id", data, token),
  changePassword: (postData, token) => postsApi.post("/change-password", postData, token),
  ChangeNumber: (number, token) => postsApi.get(`/change-number/${number}`, token),

  // ============================================
  // ADDRESS ROUTES
  // ============================================
  getAddresses: (token) => postsApi.get("/user/address", token),
  addAddress: (data, token) => postsApi.post("/user/address", data, token),
  updateAddress: (id, data, token) => postsApi.put(`/user/address/${id}`, data, token),
  deleteAddress: (id, token) => postsApi.delete(`/user/address/${id}`, token),

  // ============================================
  // PRODUCT ROUTES
  // ============================================
  getProductById: (id) => postsApi.get(`/product-api/get-product/${id}`),
  getAllSameProductById: (id) => postsApi.get(`/product-api/get-all-sameProduct-by-id/${id}`),
  getAllProduct: () => postsApi.get("/product-api/get-all-product"),
  getNewProduct: () => postsApi.get("/product-api/get-new-product"),
  filterProduct: (data) => postsApi.get("/product-api/filter-products", { params: data }),
  filterProductV2: (data) => postsApi.get("/product-api/filter-productsV2", { params: data }),
  searchProductsHomePage: (query, currentPage, limit = 10) => 
    postsApi.get(`/product-api/filter-products-sidebar?query=${query}&page=${currentPage}&limit=${limit}`),
  AllBrands: () => postsApi.get("/product-api/all-brands"),
  estimateTimeDelivery: (delivery_postcode) => 
    postsApi.get(`/api/product-api/service/availability?pickup_postcode=110008&delivery_postcode=${delivery_postcode}`),

  // ============================================
  // CART ROUTES
  // ============================================
  addToCart: (data, token) => postsApi.post("/api/add-to-cart", data, token),
  getCart: (token) => postsApi.get(`/api/get-cart/`, token),
  removeFromCart: (token, itemId) => postsApi.delete(`/api/cart-delete/${itemId}`, token),
  deleteCart: (token) => postsApi.delete(`/api/delete-cart/`, token),

  // ============================================
  // ORDER ROUTES
  // ============================================
  createOrder: (data, token) => postsApi.post("/api/orders/create-order", data, token),
  verifyPayment: (data, token) => postsApi.post("/api/orders/verify-payment", data, token),
  webhooksRozorpay: (data) => postsApi.post("/api/webhooks/razorpay", data),
  getOrderByUserId: (token) => postsApi.get("/api/orders/order-List", token),
  getOrderById: (id, token) => postsApi.get(`/api/orders/get/order/${id}`, token),
  returnAndExchange: (data) => postsApi.post('/returnAndExchangeRoutes', data),

  // ============================================
  // REVIEW/COMMENT ROUTES
  // ============================================
  createComments: (data, id, token) => postsApi.post(`/product-api/create-comments/${id}/comments`, data, token),
  getComments: (id) => postsApi.get(`/product-api/get-comments/${id}`),
  checkReviewInListing: (id, token) => postsApi.get(`/product-api/check-user-in-comments/${id}`, token),
  updateReview: (id, data, token) => postsApi.put(`/product-api/update-comments/${id}`, data, token),

  // ============================================
  // CATEGORY ROUTES
  // ============================================
  getCategory: () => postsApi.get("/api/category/get-category"),
  getNavbarCategories: () => postsApi.get("/api/category/navbar-categories"),

  // ============================================
  // BLOG ROUTES
  // ============================================
  get_Blog_Id: (id) => postsApi.get(`/api/blog/get-blog/${id}`),
  get_All_Blog: () => postsApi.get("/api/blog/get-all-blog"),

  // ============================================
  // CONTACT/ENQUIRY ROUTES
  // ============================================
  contactUs: (data) => postsApi.post("/api/contact-us", data),
  BulkEnquiry: (data) => postsApi.post("/api/bulk-enquiry", data),

  // ============================================
  // ANNOUNCEMENT ROUTES
  // ============================================
  getAnnouncement: () => postsApi.get("/announcement/get-latest"),
  updateAnnouncement: (data, token) => 
    postsApi.post("/announcement/create-or-update", data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  toggleAnnouncement: (token) => 
    postsApi.patch("/announcement/toggle", {}, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // ============================================
  // FEATURED SECTION ROUTES
  // ============================================
  getFeaturedSection: () => postsApi.get("/featured-section/get-all-featured-sections"),

  // ============================================
  // BANNER ROUTES
  // ============================================
  getActiveBanners: () => postsApi.get("/banner/public/active-banners"),
  getAllBanners: (token) => postsApi.get("/banner/get-all-banners", token),
  createBanner: (data, token) => postsApi.post("/banner/create-banner", data, token),
  updateBanner: (id, data, token) => postsApi.put(`/banner/update-banner/${id}`, data, token),
  deleteBanner: (id, token) => postsApi.delete(`/banner/delete-banner/${id}`, token),

  // ============================================
  // PROMOCODE ROUTES
  // ============================================
  createPromocode: (data, token) => postsApi.post("/promocode/create-promocode", data, token),
  getAllPromocodes: (token, params) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return postsApi.get(`/promocode/get-all-promocodes`, token);
  },
  getPromocodeById: (id, token) => postsApi.get(`/promocode/get-promocode/${id}`, token),
  updatePromocode: (id, data, token) => postsApi.put(`/promocode/update-promocode/${id}`, data, token),
  deletePromocode: (id, token) => postsApi.delete(`/promocode/delete-promocode/${id}`, token),
  validatePromocode: (data, token) => postsApi.post("/promocode/validate-promocode", data, token),
  applyPromocode: (data, token) => postsApi.post("/promocode/apply-promocode", data, token),
  getActivePromocodes: () => postsApi.get("/promocode/active-promocodes"),
};

export default Api;