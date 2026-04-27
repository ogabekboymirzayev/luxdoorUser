// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//         port: '3001',
//         pathname: '/uploads/**',
//       },
//       {
//         protocol: 'http',
//         hostname: '10.115.115.60',
//         port: '3001',
//         pathname: '/uploads/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'luxdoorsadmin.uz',
//         pathname: '/uploads/**',
//       },
//     ],
//   },
// }

// module.exports = nextConfig


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '10.115.115.60',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'luxdoorsadmin.uz',
        pathname: '/uploads/**',
      },
    ],
    unoptimized: true, // 🔥 LOCAL uchun eng muhim
  },
};

module.exports = nextConfig;