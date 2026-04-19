/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/execution-os',
  images: { unoptimized: true },
  trailingSlash: true,
}

module.exports = nextConfig