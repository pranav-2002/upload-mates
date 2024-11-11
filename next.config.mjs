/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d22mbxqf7j2v8x.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
