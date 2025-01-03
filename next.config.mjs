/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_FLESPI_TOKEN: process.env.NEXT_PUBLIC_FLESPI_TOKEN,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
