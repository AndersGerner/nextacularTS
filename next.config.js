/**
 * @type {import('next').NextConfig}
 **/

const { i18n } = require('./next-i18next.config.js')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  i18n,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  reactStrictMode: true,
})
