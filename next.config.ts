import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 정적 사이트로 빌드합니다. 서버가 없으므로 호스팅 비용이 들지 않고,
  // Netlify / Cloudflare Pages 어디든 올릴 수 있습니다.
  //
  // 나중에 Supabase 등 실제 DB로 옮기면서 서버 라우트(Route Handler)가 필요해지면
  // 이 한 줄만 지우면 됩니다. 그 외 코드는 그대로 동작합니다.
  output: "export",

  // 정적 빌드에서는 next/image 최적화 서버를 쓸 수 없습니다.
  images: { unoptimized: true },

  // 정적 호스팅에서 /quote → /quote/index.html 로 안전하게 매칭되도록
  trailingSlash: true,
};

export default nextConfig;
