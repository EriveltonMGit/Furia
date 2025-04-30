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
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    domains: ['furia-backend-8tck.onrender.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { 
            key: 'Access-Control-Allow-Origin', 
            value: 'https://furia-wheat.vercel.app' 
          },
          { 
            key: 'Access-Control-Allow-Credentials', 
            value: 'true' 
          },
        ],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://furia-backend-8tck.onrender.com',
  },
};

export default nextConfig;