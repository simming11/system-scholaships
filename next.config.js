/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    async rewrites() {
      return [
        {
          source: '/',
          destination: '/page/scholarships', // Redirect to the scholarships page
        },
        {
          source: '/page/application/create/external',
          destination: '/page/application/create/external', // Redirect to the scholarships page
        },
        {
          source: '/page/scholarships/create/internal',
          destination: '/page/scholarships/create/internal', // Redirect to the create page
        },
        {
          source: '/page/scholarships/create/external',
          destination: '/page/scholarships/create/external', // Redirect to the create page
        },
        {
          source: '/page/scholarships/detail/:id',
          destination: '/scholarships/[id]', // Dynamic route for detail page
        },
        {
            source: '/line-notify/callback',
          destination: '/scholarships/[id]', // Dynamic route for detail page
        },
        {
            source: '/page/application/detail/:id',
            destination: '/application/[id]', // Dynamic route for detail page
        },
        
        
      ];
    },
    async redirects() {
      return [
        {
          source: '/:path*', // Match all paths
          has: [{ type: 'query', key: 'notFound', value: 'true' }], // Only if the path is not found
          permanent: false,
          destination: '/error', // Redirect to custom 404 page
        },
      ];
    },
  };
  
  module.exports = nextConfig;
  