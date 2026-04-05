/** @type {import('next').NextConfig} */
const nextConfig = {
  serverActions: {
    allowedOrigins: [
      "localhost:3000",
      "*.app.github.dev",
      "miniature-space-bassoon-7j7p59jg7ww3r6j4-3000.app.github.dev",
    ],
  },
  transpilePackages: ["lucide-react", "framer-motion"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.instagram.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
