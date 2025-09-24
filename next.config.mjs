/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
<<<<<<< HEAD
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
=======
    // ✅ Ignore all TS errors during build
    ignoreBuildErrors: true,
>>>>>>> 55fe139b3e819ae9c07bcabd58ac72a47b0d801d
  },
};

export default nextConfig;