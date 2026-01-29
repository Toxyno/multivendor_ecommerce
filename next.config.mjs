/** @type {import('next').NextConfig} */

console.log("Loaded next.config.mjs");

const nextConfig = {
  allowedDevOrigins: [
    "https://brantley-troublous-galvanometrically.ngrok-free.dev",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;
