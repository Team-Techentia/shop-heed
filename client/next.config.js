/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: "", // update if you want
  },

  reactStrictMode: true,

  images: {
    domains: [
      "res.cloudinary.com",
      "localhost",
      "shopheed.com", // ✅ added here
    ],
  },
};

module.exports = nextConfig;
