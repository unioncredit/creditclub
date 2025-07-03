/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // Generate separate source-map files so stack traces point to real code
  productionBrowserSourceMaps: true,
  // Disable JavaScript minification so React error messages stay readable
  swcMinify: false,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  experimental: {
    optimizePackageImports: ["lodash"]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.io",
      }
    ],
  },
  transpilePackages: [
    '@uniswap/conedison',
    '@uniswap/widgets',
    'viem',
  ],
  webpack(config, { isServer }) {
    // Grab the existing rule that handles SVG imports
    // @ts-ignore
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )

    config.resolve.fallback = {
      fs: false,
      path: false,
      Browser: false,
    };

    // Intercept and block Safe connector imports at the webpack resolver level
    const originalResolve = config.resolve;
    config.resolve = {
      ...originalResolve,
      plugins: [
        ...(originalResolve.plugins || []),
        {
          // @ts-ignore
          apply(resolver) {
            // @ts-ignore
            resolver.hooks.beforeResolve.tap('BlockSafeConnector', (request) => {
              if (request.request) {
                // Block any imports related to Safe Global SDK
                if (request.request.includes('@safe-global') ||
                    request.request.includes('safe-apps-sdk') ||
                    request.request.includes('safe-apps-provider') ||
                    (request.request.includes('safe.js') && request.request.includes('@wagmi/connectors'))) {
                  
                  // Return a dummy module instead
                  request.request = 'data:text/javascript,export default {};';
                }
              }
            });
          }
        }
      ]
    };

    // Ignore webpack warnings for modules we're blocking
    config.ignoreWarnings = [
      /Module parse failed.*import\.meta/,
      /Cannot use 'import\.meta' outside a module/,
      /Failed to resolve import/,
      /Module not found/,
      /Critical dependency/,
    ];

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
};
