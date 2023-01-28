/**
 * @type {import('next').NextConfig}
 **/

const { i18n } = require('./next-i18next.config.js')

module.exports = {
  i18n,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  reactStrictMode: true,
}
