import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // When hitting the admin subdomain root, serve /admin
      {
        source: "/",
        destination: "/admin",
        has: [{ type: "host", value: "admin.xx-shareden-xx.vercel.app" }],
      },
      // Pass through other paths on the admin subdomain to /admin/*
      {
        source: "/:path*",
        destination: "/admin/:path*",
        has: [{ type: "host", value: "admin.xx-shareden-xx.vercel.app" }],
      },
    ]
  },
}

export default nextConfig
