/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: ['pdf2json','pdf-parse'],
    },
  };

export default nextConfig;
