// // next.config.js
// /** @type {import('next').NextConfig} */
// const nextConfig = {
  

//   eslint: { ignoreDuringBuilds: true },
//   typescript: { ignoreBuildErrors: true },
//   images: {
//     unoptimized: true,
//     domains: ['localhost'],
//   },
//   webpack: (config) => {
//     config.infrastructureLogging = { level: 'error' };
//     return config;
//   },
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: 'http://localhost:5000/api/:path*',
//       },
//     ];
//   },
//   async headers() {
//     return [
//       {
//         source: '/(.*)',
//         headers: [
//           { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
//           { key: 'Access-Control-Allow-Credentials', value: 'true' },
//           { key: 'Access-Control-Allow-Origin', value: 'http://localhost:3000' },
//           { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
//           { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
//         ],
//       },
//     ];
//   },
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignorar erros de ESLint e TypeScript no build
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Configuração de imagens (opcional)
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },

  // Logging só de erros
  webpack: (config) => {
    config.infrastructureLogging = { level: 'error' };
    return config;
  },

  // Expor a variável ao browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;

