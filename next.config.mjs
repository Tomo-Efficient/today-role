/** @type {import('next').NextConfig} */
const basePath = process.env.PAGES_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
