/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 1000,
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
