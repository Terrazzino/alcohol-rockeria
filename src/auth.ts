import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { configuracionAuthBase } from "@/auth.config";
import { autenticarAdministrador } from "@/features/autenticacion/servicio";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...configuracionAuthBase,
  callbacks: {
    ...configuracionAuthBase.callbacks,
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        correo: { label: "Correo", type: "email" },
        contrasena: { label: "Contraseña", type: "password" },
      },
      authorize: autenticarAdministrador,
    }),
  ],
});
