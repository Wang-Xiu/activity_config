import path from 'path';
/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'http://172.18.26.11:3000'
  ],
  distDir: process.env.NODE_ENV === "production" ? ".next-prod" : ".next",
  typescript: {
    ignoreBuildErrors: true
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS,HEAD,PATCH' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin, Cache-Control' },
          { key: 'Access-Control-Max-Age', value: '86400' }
        ],
      },
    ];
  },
  async rewrites() {
    return process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/api/:path*',
            destination: 'https://testmqgitfrontend.meequ.cn/index.php?r=:path*',
          },
        ]
      : [];
  },
};
export default nextConfig;