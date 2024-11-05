/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['i.imgur.com', "files.edgestore.dev"], // Autorise le domaine d'images directes d'Imgur
      },
};

export default nextConfig;
