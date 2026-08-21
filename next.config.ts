import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Para Vercel, removemos "standalone" (Vercel gerirá o build automaticamente)
  // Mantemos apenas para compatibilidade com o sandbox local
  ...(process.env.NODE_ENV === "production" && !process.env.VERCEL ? { output: "standalone" } : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Permitir imagens externas (Unsplash, Supabase, etc.)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "media.base44.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "**.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
