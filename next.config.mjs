/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.31.153', 'localhost'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
