/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },

  // 1) Proxy todas as /api para seu Express no 5000
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },

  // 2) Cabeçalhos CORS + COOP
  async headers() {
    return [
      {
        source: '/(.*)',    // **aplica a TODO** (inclui popups)
        headers: [
          { key: 'Cross-Origin-Opener-Policy',   value: 'same-origin-allow-popups' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin',      value: 'http://localhost:3000' },
          { key: 'Access-Control-Allow-Methods',     value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers',     value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },

  webpack: (config) => {
    config.infrastructureLogging = { level: 'error' };
    return config;
  },
};

export default nextConfig;
