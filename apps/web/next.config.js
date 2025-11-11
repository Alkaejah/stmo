/** @type {import("next").NextConfig} */
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../../.env"),
});

module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/assets/:path*",
        destination: `https://stmo.s3.ap-southeast-2.amazonaws.com/:path*`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${process.env.API_URL}/api/v1/:path*`,
      },
    ];
  },
  env: {
    API_URL: process.env.API_URL,
    API_AUTH_URL: process.env.API_AUTH_URL,
    WEB_URL: process.env.WEB_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
    CSRF_SIGN_KEY: process.env.CSRF_SIGN_KEY,
    BACKOFFICE_CSRF_SIGN_KEY: process.env.BACKOFFICE_CSRF_SIGN_KEY,
    PASSWORD_ENCRYPT_KEY: process.env.PASSWORD_ENCRYPT_KEY,
    BACKOFFICE_PASSWORD_ENCRYPT_KEY:
      process.env.BACKOFFICE_PASSWORD_ENCRYPT_KEY,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "stmo.s3.ap-southeast-2.amazonaws.com",
        port: "",
        pathname: "/**", // Match all paths for images
      },
    ],
  },
};
