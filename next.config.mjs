/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['i.imgur.com', "files.edgestore.dev"], // Autorise le domaine d'images directes d'Imgur
      },
      eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
      },
};

export default nextConfig;
