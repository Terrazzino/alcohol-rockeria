import type { NextAuthConfig } from "next-auth";

export const configuracionAuthBase = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  callbacks: {
    authorized({ auth, request }) {
      if (request.nextUrl.pathname === "/admin/login") {
        return true;
      }

      return Boolean(auth?.user);
    },
  },
  providers: [],
} satisfies NextAuthConfig;
