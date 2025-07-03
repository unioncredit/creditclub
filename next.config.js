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
  webpack(config) {
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

    // Add webpack alias to block Safe Global SDK modules
    config.resolve.alias = {
      ...config.resolve.alias,
      '@safe-global/safe-apps-sdk': false,
      '@safe-global/safe-apps-provider': false,
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
