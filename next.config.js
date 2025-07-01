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
    '@safe-global/safe-apps-sdk',
    '@safe-global/safe-apps-provider',
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

    // Fix viem and Safe Global SDK import.meta issues
    config.resolve.alias = {
      ...config.resolve.alias,
      'viem/_cjs': 'viem',
    };

    // Handle import.meta in modules
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Fix import.meta issues by treating as external expressions
    config.module.rules.push({
      test: /node_modules\/(@safe-global|viem)\/.*\.(js|mjs)$/,
      parser: {
        javascript: {
          importMeta: false,
        },
      },
    });

    // Additional fix for import.meta.webpackHot specifically
    config.module.rules.push({
      test: /\.m?js$/,
      include: /node_modules\/@safe-global/,
      use: {
        loader: 'string-replace-loader',
        options: {
          search: 'import\\.meta\\.webpackHot',
          replace: 'false',
          flags: 'g',
        },
      },
    });

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
