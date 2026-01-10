module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,svg,ico,json}'
  ],
  swDest: 'build/service-worker.js',
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\./,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 300
        },
        networkTimeoutSeconds: 10
      }
    },
    {
      urlPattern: /\/api\/market\/prices/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'prices-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 3600
        }
      }
    },
    {
      urlPattern: /\/api\/weather/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'weather-cache',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 1800
        }
      }
    },
    {
      urlPattern: /\/uploads\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 86400 * 7
        }
      }
    },
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'font-cache',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 86400 * 365
        }
      }
    }
  ]
};
