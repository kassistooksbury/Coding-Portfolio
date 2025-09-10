/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for @react-three/fiber
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource'
    });
    return config;
  },
};

export default nextConfig;
