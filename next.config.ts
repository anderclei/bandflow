import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "@prisma/adapter-libsql", "@libsql/client", "pg"],
};

export default nextConfig;
