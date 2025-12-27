const nextConfig = {
  /* config options here */
  // Chỉ bật standalone khi không phải Windows hoặc khi build cho Docker
  // Trên Windows, standalone cần Developer Mode hoặc quyền admin
  // Docker builds chạy trên Linux nên sẽ tự động bật standalone
  ...(process.platform !== 'win32' || process.env.DOCKER_BUILD ? { output: "standalone" } : {}),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
