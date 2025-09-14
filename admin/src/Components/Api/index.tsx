import axios from "axios";

const postsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

const Api = {
  uploadSingleImage: (data: any) => postsApi.post("/api/upload-single-image", data),

  // Product APIs
  createProduct: (data: any, token: any) => postsApi.post("/product-api/create-product", data, token),
  getAllProductAdmin: () => postsApi.get(`/product-api/get-all-product-admin`),
  get_Product_By_Id: (id: any) => postsApi.get(`/product-api/get-product/${id}`),
  getProductAdminById: (id: any, token: any) => postsApi.get(`/product-api/get-all-product-admin-by-id/${id}`, token),
  deleteProduct: (id: any, token: any) => postsApi.put(`/product-api/delete-product/${id}`, {}, token),
  updateMainProduct: (id: any, data: any, token: any) => postsApi.put(`/product-api/update-product/${id}`, data, token),
  deleteSubProduct: (id: any, data: any, token: any) => postsApi.put(`/product-api/update-sub-product/${id}`, data, token),
  updateSubProduct: (id: any, data: any, token: any) => postsApi.put(`/product-api/update-sub-product/${id}`, data, token),

  // Category APIs
  createcategory: (data: any, token: any) => postsApi.post("/api/category/create-category", data, token),
  createsubCategory: (data: any, token: any) => postsApi.post("/api/category/create-subcategory", data, token),
  getCategory: () => postsApi.get("/api/category/get-category"),
  getsubCategory: () => postsApi.get("/api/category/get-subcategory"),
  getSubCategoryById: (id: any, token: any) => postsApi.get(`/api/category/get-sub-category/${id}`, token),
  getSubCategoryByCategoryName: (category: any) => postsApi.get(`/api/category/get-subcategory-by-name/${category}`),
  deteletCategory: (id: any, token: any) => postsApi.delete(`/api/category/delete-category/${id}`, token),
  deteletSubCategory: (id: any, token: any) => postsApi.delete(`/api/category/delete-subcategory/${id}`, token),
  getCategoryById: (id: any, token: any) => postsApi.get(`/api/category/get-category/${id}`, token),
  editSubcategory: (id: any, data: any, token: any) => postsApi.put(`/api/category/edit-sub-category/${id}`, data, token),
  editCategory: (id: any, data: any, token: any) => postsApi.put(`/api/category/edit-category/${id}`, data, token),

  // Orders & Payments
  getOrdersByAdmin: (token: any, status: any, orderStatus: any) => postsApi.get(`/admin-api/get-order?status=${status}&orderStatus=${orderStatus}`, token),
  getOrderByIdAdmin: (id: any, token: any) => postsApi.get(`/admin-api/get-order/${id}`, token),
  getAllPayment: (token: any, status: any, startDate: any, endDate: any) => {
    const params = new URLSearchParams({
      status: status || "null",
      startDate: startDate || "",
      endDate: endDate || ""
    }).toString();
    return postsApi.get(`/admin-api/get-all-payment?${params}`, token);
  },
  updateOrder: (id: any, data: any, token: any) => postsApi.put(`/admin-api/update-order/${id}`, data, token),
  updateOrderStatus: (data: any, token: any) => postsApi.post("/api/orders/update-order-status", data, token),
  deleteOrder: (id: any, token: any) => postsApi.put(`/api/orders/delete/order/${id}`, {}, token),
  get_All_Orders: (token: any, status: any, orderStatus: any) => postsApi.get(`/admin-api/get-all/orders?status=${status} `, token),
  generateInvoicing: (token: any, orderId: any) => postsApi.get(`/api/orders/generate-invoicing/${orderId} `, token),

  // Reviews
  deleteReview: (productId: any, commentId: any, token: any) => postsApi.get(`/product-api/delete/products/comments/${productId}/${commentId}`, token),
  getCommentByProductId: (id: any, token: any) => postsApi.get(`/product-api/get/product/comments/${id}`, token),

  // Admin APIs
  adminPannel: (token: any) => postsApi.get("/admin-api/admin-panel", token),
  getAllUser: (token: any) => postsApi.get("/admin-api/all-user", token),
  loginUser: (data: any) => postsApi.post("/auth-api/login", data),
  deleteUser: (id: any, token: any) => postsApi.put(`/auth-api/delete/user/${id}`, {}, token),

  // Blog APIs
  createBlogs: (data: any, token: any) => postsApi.post("/api/blog/create-blog", data, token),
  get_All_Blog: () => postsApi.get("/api/blog/get-all-blog"),
  Delete_Blog: (id: any, token: any) => postsApi.get(`/api/blog/delete-blog/${id}`, token),
  get_Blog_Id: (id: any) => postsApi.get(`/api/blog/get-blog/${id}`),
  Update_Blog: (id: any, data: any, token: any) => postsApi.put(`/api/blog/edit-blog/${id}`, data, token),

  // Promocode APIs
  createPromocode: (data: any, token: any) => postsApi.post("/promocode/create-promocode", data, token),
  getAllPromocodes: (token: any, params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return postsApi.get(`/promocode/get-all-promocodes`, token);
  },
  getPromocodeById: (id: any, token: any) => postsApi.get(`/promocode/get-promocode/${id}`, token),
  updatePromocode: (id: any, data: any, token: any) => postsApi.put(`/promocode/update-promocode/${id}`, data, token),
  deletePromocode: (id: any, token: any) => postsApi.delete(`/promocode/delete-promocode/${id}`, token),
  validatePromocode: (data: any) => postsApi.post("/promocode/validate-promocode", data),
  applyPromocode: (data: any, token: any) => postsApi.post("/promocode/apply-promocode", data, token),
  getActivePromocodes: () => postsApi.get("/promocode/active-promocodes"),

  // Banner APIs
  createBanner: (data: any, token: any) => postsApi.post("banner/create-banner", { ...data, bannerType: "home" }, token),
  getAllBanners: (token: any) => postsApi.get("banner/get-all-banners", token),
  getBannerById: (id: any, token: any) => postsApi.get(`banner/get-banner/${id}`, token),
  updateBanner: (id: any, data: any, token: any) => postsApi.put(`banner/update-banner/${id}`, { ...data, bannerType: "home" }, token),
  deleteBanner: (id: any, token: any) => postsApi.delete(`banner/delete-banner/${id}`,token),
  updateBannerStatus: (id: any, data: any, token: any) => postsApi.put(`banner/update-banner/${id}`, data, token), // Reuse update for status

  // ✅ Announcement APIs
  getAnnouncement: () => 
  postsApi.get("/announcement/get-latest"),

// Admin routes
updateAnnouncement: (data: any, token: any) =>
  postsApi.post("/announcement/create-or-update", data, token),

toggleAnnouncement: (token: any) =>
  postsApi.patch("/announcement/toggle", {}, token),


}



export default Api;
