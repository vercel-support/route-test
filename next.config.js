/** @type {import('next').NextConfig} */
const { Buffer } = require('buffer');
const crawlers = require('crawler-user-agents');

const experiments = {
  '/': 'next-test',
};

const botExp = new RegExp(
  crawlers.map((crawler) => crawler.pattern).join('|'),
  'i',
).toString();

module.exports = {
  async rewrites() {
    const cookies = Object.keys(experiments).map((path) => {
      const key = Buffer.from(`${path}^${experiments[path]}`)
        .toString('base64')
        .replace(/=/g, '');

      return {
        source: path,
        has: [
          {
            type: 'cookie',
            key,
            value: '(?<variant>.*)',
          },
        ],
        destination: `/:variant${path}`,
      }
    });

    const afterFiles = [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'user-agent',
            value: botExp,
          },
        ],
        destination: '/original/:path*',
      },
      ...cookies,
    ];

    const fallback = Object.keys(experiments).map((path) => {
      const key = Buffer.from(`${path}^${experiments[path]}`)
        .toString('base64')
        .replace(/=/g, '');

      return {
        source: path,
        destination: `/api/decide?key=${key}`,
      }
    });

    return { afterFiles, fallback };
  },
}
