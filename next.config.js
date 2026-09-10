/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Increase static page generation timeout for Three.js-heavy pages
  staticPageGenerationTimeout: 180,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;