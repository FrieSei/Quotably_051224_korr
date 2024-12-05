import NextAuth from "next-auth"
import { NextAuthConfig } from "next-auth"

export const config = {
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      return !!auth?.user
    },
  },
} satisfies NextAuthConfig

export const { auth, handlers } = NextAuth(config)