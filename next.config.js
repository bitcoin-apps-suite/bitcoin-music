/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' *.bitcoin-os.* localhost:* 127.0.0.1:*",
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://bitcoin-os.com https://www.bitcoin-os.com http://localhost:3000 http://localhost:3001 http://localhost:3002 http://localhost:3003 http://localhost:3004 http://localhost:3005',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        buffer: require.resolve('buffer/'),
      };
    }
    return config;
  },
}

module.exports = nextConfig