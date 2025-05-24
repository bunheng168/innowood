/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['oxijbkgzqkqsfcerohoz.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oxijbkgzqkqsfcerohoz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig 