import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@xyflow/react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-tooltip",
      "date-fns",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/admin",
        has: [{ type: "host", value: "admin.xx-shareden-xx.vercel.app" }],
      },
      {
        source: "/:path*",
        destination: "/admin/:path*",
        has: [{ type: "host", value: "admin.xx-shareden-xx.vercel.app" }],
      },
    ]
  },
}

export default nextConfig
