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

    // Ignore webpack import.meta warnings for Safe Global SDK
    config.ignoreWarnings = [
      /Module parse failed.*import\.meta/,
      /Cannot use 'import\.meta' outside a module/,
    ];

    // Use DefinePlugin to replace import.meta.webpackHot with undefined
    const webpack = require('webpack');
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.DefinePlugin({
        'import.meta.webpackHot': 'undefined',
        'import.meta.hot': 'undefined',
      })
    );

    // Handle viem with disabled import.meta parsing
    config.module.rules.push({
      test: /node_modules\/viem\/.*\.(js|mjs)$/,
      type: 'javascript/auto',
      parser: {
        javascript: {
          importMeta: false,
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
