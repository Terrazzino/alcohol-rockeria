import NextAuth from "next-auth";

import { configuracionAuthBase } from "@/auth.config";

export default NextAuth(configuracionAuthBase).auth;

export const config = {
  matcher: ["/admin/:path*"],
};
