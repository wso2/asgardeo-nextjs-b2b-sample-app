/** @type {import('next').NextConfig} */

const withLess = require("next-with-less");

const lessConfig = withLess({
  lessLoaderOptions: {
      lessOptions: {
          strictMath: true
      }
  }
});

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  ...lessConfig
        }

module.exports = nextConfig
