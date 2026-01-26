import axios from "axios";

const postsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

const Api = {
  uploadSingleImage: (data: any) => postsApi.post("/upload-single-image", data),

  // ============================================
  // 🔐 USER AUTHENTICATION (Mobile OTP Based)
  // ============================================
  
  // Step 1: Check if mobile exists
  checkMobile: (data: any) => postsApi.post("/auth-api/user/check-mobile", data),
  
  // Step 2a: Send OTP
  sendOtp: (data: any) => postsApi.post("/auth-api/user/send-otp", data),
  
  // Step 2b: Verify OTP
  verifyOtp: (data: any) => postsApi.post("/auth-api/user/verify-otp", data),
  
  // Step 3a: Signup (for new users after OTP)
  userSignup: (data: any) => postsApi.post("/auth-api/user/signup", data),
  
  // Step 3b: Login (for existing users after OTP)
  userLogin: (data: any) => postsApi.post("/auth-api/user/login", data),

  // ============================================
  // 🔐 ADMIN AUTHENTICATION (Email + Password)
  // ============================================
  
  // Admin Login
  adminLogin: (data: any) => postsApi.post("/auth-api/admin/login", data),
  
  // Create Admin (Protected - requires admin token)
  createAdmin: (data: any, token: any) => postsApi.post("/auth-api/admin/create", data, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // ============================================
  // 🔐 COMMON AUTH ROUTES
  // ============================================
  
  // Check if logged in
  checkIsLogin: (token: any) => postsApi.get("/auth-api/is-login-check", {
    headers: { Authorization: `Bearer ${token}` }
  }),
  
  // Get user profile
  getUserProfile: (token: any) => postsApi.get("/auth-api/profile", {
    headers: { Authorization: `Bearer ${token}` }
  }),
  
  // Update profile
  updateProfile: (data: any, token: any) => postsApi.put("/auth-api/profile", data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  
  // Change password
  changePassword: (data: any, token: any) => postsApi.post("/auth-api/change-password", data, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // ============================================
  // Featured Section APIs
  // ============================================
  createFeaturedSection: (data: any, token: any) => postsApi.post("/featured-section/create-featured-section", data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getAllFeaturedSections: (token: any) => postsApi.get("/featured-section/get-all-featured-sections", {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getFeaturedSectionById: (id: any, token: any) => postsApi.get(`/featured-section/get-featured-section/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateFeaturedSection: (id: any, data: any, token: any) => postsApi.put(`/featured-section/update-featured-section/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  deleteFeaturedSection: (id: any, token: any) => postsApi.delete(`/featured-section/delete-featured-section/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getActiveFeaturedSections: () => postsApi.get("/featured-section/active-featured-sections"),

  // ============================================
  // Product APIs
  // ============================================
  createProduct: (data: any, token: any) => postsApi.post("/product-api/create-product", data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getAllProductAdmin: () => postsApi.get(`/product-api/get-all-product-admin`),
  get_Product_By_Id: (id: any) => postsApi.get(`/product-api/get-product/${id}`),
  getProductAdminById: (id: any, token: any) => postsApi.get(`/product-api/get-all-product-admin-by-id/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  deleteProduct: (id: any, token: any) => postsApi.put(`/product-api/delete-product/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateMainProduct: (id: any, data: any, token: any) => postsApi.put(`/product-api/update-product/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  deleteSubProduct: (id: any, data: any, token: any) => postsApi.put(`/product-api/update-sub-product/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateSubProduct: (id: any, data: any, token: any) => postsApi.put(`/product-api/update-sub-product/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // ============================================
  // Category APIs
  // ============================================
  createcategory: (data: any, token: any) => postsApi.post("/api/category/create-category", data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  createsubCategory: (data: any, token: any) => postsApi.post("/api/category/create-subcategory", data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getCategory: () => postsApi.get("/api/category/get-category"),
  getsubCategory: () => postsApi.get("/api/category/get-subcategory"),
  getSubCategoryById: (id: any, token: any) => postsApi.get(`/api/category/get-sub-category/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getSubCategoryByCategoryName: (category: any) => postsApi.get(`/api/category/get-subcategory-by-name/${category}`),
  deteletCategory: (id: any, token: any) => postsApi.delete(`/api/category/delete-category/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  deteletSubCategory: (id: any, token: any) => postsApi.delete(`/api/category/delete-subcategory/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getCategoryById: (id: any, token: any) => postsApi.get(`/api/category/get-category/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  editSubcategory: (id: any, data: any, token: any) => postsApi.put(`/api/category/edit-sub-category/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  editCategory: (id: any, data: any, token: any) => postsApi.put(`/api/category/edit-category/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // ============================================
  // Orders & Payments
  // ============================================
  getOrdersByAdmin: (token: any, status: any, orderStatus: any) => postsApi.get(`/admin-api/get-order?status=${status}&orderStatus=${orderStatus}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getOrderByIdAdmin: (id: any, token: any) => postsApi.get(`/admin-api/get-order/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getAllPayment: (token: any, status: any, startDate: any, endDate: any) => {
    const params = new URLSearchParams({
      status: status || "null",
      startDate: startDate || "",
      endDate: endDate || ""
    }).toString();
    return postsApi.get(`/admin-api/get-all-payment?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  updateOrder: (id: any, data: any, token: any) => postsApi.put(`/admin-api/update-order/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateOrderStatus: (data: any, token: any) => postsApi.post("/api/orders/update-order-status", data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  deleteOrder: (id: any, token: any) => postsApi.put(`/api/orders/delete/order/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  get_All_Orders: (token: any, status: any, orderStatus: any) => postsApi.get(`/admin-api/get-all/orders?status=${status}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  generateInvoicing: (token: any, orderId: any) => postsApi.get(`/api/orders/generate-invoicing/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // ============================================
  // Reviews
  // ============================================
  getCommentByProductId: (id: any, token: any) => postsApi.get(`/product-api/get/product/comments/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // ============================================
  // Admin APIs
  // ============================================
  adminPannel: (token: any) => postsApi.get("/admin-api/admin-panel", {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getAllUser: (token: any) => postsApi.get("/admin-api/all-user", {
    headers: { Authorization: `Bearer ${token}` }
  }),
  deleteUser: (id: any, token: any) => postsApi.put(`/auth-api/delete/user/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // ============================================
  // Blog APIs
  // ============================================
  createBlogs: (data: any, token: any) => postsApi.post("/api/blog/create-blog", data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  get_All_Blog: () => postsApi.get("/api/blog/get-all-blog"),
  Delete_Blog: (id: any, token: any) => postsApi.get(`/api/blog/delete-blog/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  get_Blog_Id: (id: any) => postsApi.get(`/api/blog/get-blog/${id}`),
  Update_Blog: (id: any, data: any, token: any) => postsApi.put(`/api/blog/edit-blog/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // ============================================
  // Promocode APIs
  // ============================================
  createPromocode: (data: any, token: any) => postsApi.post("/promocode/create-promocode", data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getAllPromocodes: (token: any, params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return postsApi.get(`/promocode/get-all-promocodes${queryString ? `?${queryString}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getPromocodeById: (id: any, token: any) => postsApi.get(`/promocode/get-promocode/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updatePromocode: (id: any, data: any, token: any) => postsApi.put(`/promocode/update-promocode/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  deletePromocode: (id: any, token: any) => postsApi.delete(`/promocode/delete-promocode/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  validatePromocode: (data: any) => postsApi.post("/promocode/validate-promocode", data),
  applyPromocode: (data: any, token: any) => postsApi.post("/promocode/apply-promocode", data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getActivePromocodes: () => postsApi.get("/promocode/active-promocodes"),

  // ============================================
  // Banner APIs
  // ============================================
  createBanner: (data: any, token: any) => postsApi.post("banner/create-banner", { ...data, bannerType: "home" }, {
    headers: { Authorization: `Bearer ${token}` }
  }),
 getAllBanners: (token: any) =>
  postsApi.get("/banner/get-all-banners", {
  headers: token ? { Authorization: `Bearer ${token}` } : {},
}),

  getBannerById: (id: any, token: any) => postsApi.get(`banner/get-banner/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateBanner: (id: any, data: any, token: any) => postsApi.put(`banner/update-banner/${id}`, { ...data, bannerType: "home" }, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  deleteBanner: (id: any, token: any) => postsApi.delete(`banner/delete-banner/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateBannerStatus: (id: any, data: any, token: any) => postsApi.put(`banner/update-banner/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // ============================================
  // Announcement APIs
  // ============================================
  getAnnouncement: () => postsApi.get("/announcement/get-latest"),
  updateAnnouncement: (data: any, token: any) => postsApi.post("/announcement/create-or-update", data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  toggleAnnouncement: (token: any) => postsApi.patch("/announcement/toggle", {}, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // ============================================
  // Review APIs
  // ============================================
  // Public routes
  submitReview: (data: any) => postsApi.post("/review/submit-review", data),
  getPublishedReviews: () => postsApi.get("/review/public/published-reviews"),

  // Admin routes (protected)
  getAllReviews: (token: any, params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return postsApi.get(`/review/get-all-reviews${queryString ? `?${queryString}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getReviewById: (id: any, token: any) => postsApi.get(`/review/get-review/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateReview: (id: any, data: any, token: any) => postsApi.put(`/review/update-review/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  deleteReview: (id: any, token: any) => postsApi.delete(`/review/delete-review/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  sendReviewEmail: (id: any, data: any, token: any) => postsApi.post(`/review/send-email/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  approveReview: (id: any, data: any, token: any) => postsApi.patch(`/review/approve-review/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
}

export default Api;