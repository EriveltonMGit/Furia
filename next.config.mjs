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

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
      eslint: { ignoreDuringBuilds: true },
      typescript: { ignoreBuildErrors: true },
      images: {
        domains: ['furia-backend-8tck.onrender.com'],
      },
      env: {
        NEXT_PUBLIC_API_URL: 'https://furia-backend-8tck.onrender.com',
      },
      // Adicionado de volta a configuração de headers
      async headers() {
        return [
          {
            source: '/(.*)', // Aplica a todas as rotas
            headers: [
              // Permite interações com pop-ups de outras origens, necessário para signInWithPopup
              { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
               // Configurações CORS - Idealmente, estas devem ser gerenciadas no backend
               // Mas mantê-las aqui pode ajudar em certos cenários de desenvolvimento/proxy
              { key: 'Access-Control-Allow-Credentials', value: 'true' },
               // Ajuste o valor abaixo para a origem do seu frontend em produção, se aplicável
              { key: 'Access-Control-Allow-Origin', value: 'http://localhost:3000' }, // Para desenvolvimento local
              { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
              { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          ],
        },
      ];
      },
      // Removido a seção rewrites, pois você está usando a URL direta do backend via env var
      // async rewrites() {
      //     return [
      //       {
      //         source: '/api/:path*',
      //         destination: 'http://localhost:5000/api/:path*',
      //       },
      //     ];
      // },
  };
  
  export default nextConfig;
  