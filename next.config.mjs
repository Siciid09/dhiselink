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
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'qpdipkmbwmyhoerkzjad.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Additional Next.js config options
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
