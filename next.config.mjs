/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: ['pdf2json'],
      serverComponentsExternalPackages: ["pdf-parse"],
    },
  };

export default nextConfig;
