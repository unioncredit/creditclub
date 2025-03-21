/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  experimental: {
    optimizePackageImports: ["lodash", "viem", "wagmi"]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.io",
      }
    ],
  },
  modularizeImports: {
    "viem": {
      transform: "viem/{{member}}",
    },
    "wagmi": {
      transform: "wagmi/{{member}}",
    },
  },
  transpilePackages: [
    '@uniswap/conedison',
    '@uniswap/widgets',
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
