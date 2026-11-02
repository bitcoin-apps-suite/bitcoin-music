/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Legal ruling 2 Nov 2026: the old proof-of-concept pages below promise holder dividends/APY, sell
  // "shares" in tracks, offer token trading or invite fans to invest. They are retired to the store
  // front page until rewritten. Temporary (307) so they can be restored by deleting a line.
  async redirects() {
    return [
      '/token', '/marketplace', '/exchange', '/community', '/wallet', '/docs',
      '/contracts', '/contributors', '/bitcoin-music', '/bitcoin-music/dark',
    ].map((source) => ({ source, destination: '/', permanent: false }));
  },
  images: {
    domains: ['localhost'],
  },
  // The share-card renderer (lib/bmx/og.tsx) reads its fonts and cover jpgs from disk at request time.
  // Files read with fs are not traced into the serverless bundle on their own, so list them here.
  outputFileTracingIncludes: {
    '/album/**': ['./assets/fonts/**', './public/bmx/og/**', './public/bmx/titles/**', './public/bmx/npgx-logo.png'],
    '/listen/**': ['./assets/fonts/**', './public/bmx/og/**', './public/bmx/titles/**', './public/bmx/npgx-logo.png'],
  },
  async headers() {
    return [
      // bMusic key server API: public, called from other origins (vexvoid.com, bWalletX). Responses are
      // either public or encrypted to one wallet, so any origin may call it.
      {
        source: '/api/bmusic/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      // bMusic stream files: segments are encrypted, so any origin (bWalletX web, desktop, mobile) may fetch them.
      {
        source: '/bmusic/streams/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/((?!api/bmusic/|bmusic/streams/).*)',
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
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
        util: require.resolve('util'),
      };
      
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
    }
    return config;
  },
}

module.exports = nextConfig