/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript settings
  typescript: {
    ignoreBuildErrors: true, // Continue build even if TS errors exist
  },

  // Images settings
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/8.x/initials/svg/**',
      },
      // Add other domains here in the future if needed
    ],
  },

  // Additional Next.js config options can be added here
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
