/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // continue build and show all TS errors
  },
  // --- Add this 'images' block ---
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/8.x/initials/svg/**',
      },
      // You can add other domains here in the future
    ],
  },
};

export default nextConfig;