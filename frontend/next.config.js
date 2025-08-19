/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.spoonacular.com',
        pathname: '/recipes/**',
      },
      {
        protocol: 'https',
        hostname: 'spoonacular.com',
        pathname: '/recipeImages/**',
      }
    ],
  },
};

module.exports = nextConfig; 