/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    API_URL: "",
  },

  reactStrictMode: true,

  images: {
    domains: ['shopheed.com' ], 
  },
};

module.exports = nextConfig;
