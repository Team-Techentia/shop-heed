import axios from "axios";
const postsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});


const Api = {
  checkUser: (data) => postsApi.post("/auth-api/check-email-mobile", data),
  checkMobile: (data) => postsApi.post("/auth-api/check-mobile", data),
  signUp: (data) => postsApi.post("/auth-api/signUp", data),
  loginUser: (data) => postsApi.post("/auth-api/login", data),
  loginRegisterForCheckOutPage: (data) =>
    postsApi.post("/auth-api/login-register-forCheck-outPage", data),
  checkIsLogin: (token) => postsApi.get("/auth-api/is-login-check", token),
  getProductById: (id) => postsApi.get(`/product-api/get-product/${id}`),
  getAllSameProductById: (id) =>
    postsApi.get(`/product-api/get-all-sameProduct-by-id/${id}`),
  addToCart: (data, token) => postsApi.post("/api/add-to-cart", data, token),
  getCart: (token) => postsApi.get(`/api/get-cart/`, token),
  removeFromCart: (token, itemId) =>
    postsApi.delete(`/api/cart-delete/${itemId}`, token),
  deleteCart: (toekn) => postsApi.delete(`/api/delete-cart/`, toekn),
  getAllProduct: () => postsApi.get("/product-api/get-all-product"),
  filterProduct: (data) =>
    postsApi.get("/product-api/filter-products", { params: data }),

  filterProductV2: (data) =>
    postsApi.get("/product-api/filter-productsV2", { params: data }),


  returnAndExchange: (data) => postsApi.post('/returnAndExchangeRoutes', data),
  searchProductsHomePage: (query, currentPage, limit = 10) =>
    postsApi.get(
      `/product-api/filter-products-sidebar?query=${query}&page=${currentPage}&limit=${limit}`
    ),
  AllBrands: () => postsApi.get("/product-api/all-brands"),
  createOrder: (data, token) =>
    postsApi.post("/api/orders/create-order", data, token),
  verifyPayment: (data, token) =>
    postsApi.post("/api/orders/verify-payment", data, token),
  webhooksRozorpay: (data) => postsApi.post("/api/webhooks/razorpay", data),
  sendOTP: (postData) => postsApi.post("/auth-api/send-otp", postData),
  verifyOtp: (postData) => postsApi.post("/auth-api/verify-otp", postData),
  getCategory: () => postsApi.get("/api/category/get-category"),
  getOrderByUserId: (token) => postsApi.get("/api/orders/order-List", token),

  getOrderById: (id, token) =>
    postsApi.get(`/api/orders/get/order/${id}`, token),

  getUserById: (token) => postsApi.get("/auth-api/get-user-by-id", token),
  profileChange: (data, token) =>
    postsApi.put("/auth-api/profile-change-by-id", data, token),
  changePassword: (postData, token) =>
    postsApi.post("/auth-api/change-password", postData, token),
  ChangeNumber: (number, token) =>
    postsApi.get(`/auth-api/change-number/${number}`, token),
  createComments: (data, id, token) =>
    postsApi.post(`/product-api/create-comments/${id}/comments`, data, token),
  getComments: (id) => postsApi.get(`/product-api/get-comments/${id}`),
  checkReviewInListing: (id, token) =>
    postsApi.get(`/product-api/check-user-in-comments/${id}`, token),
  updateReview: (id, data, token) =>
    postsApi.put(`/product-api/update-comments/${id}`, data, token),
  get_Blog_Id: (id) => postsApi.get(`/api/blog/get-blog/${id}`),
  get_All_Blog: () => postsApi.get("/api/blog/get-all-blog"),
  contactUs: (data) => postsApi.post("/api/contact-us", data),
  BulkEnquiry: (data) => postsApi.post("/api/bulk-enquiry", data),
  estimateTimeDelivery: (delivery_postcode) => postsApi.get(`/api/product-api/service/availability?pickup_postcode=110008&delivery_postcode=${delivery_postcode}`)
};

export default Api;
