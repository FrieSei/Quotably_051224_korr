import { NextResponse } from "next/server"
import { auth } from "@/auth"

export default auth((req) => {
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
  
  if (isAuthPage) {
    if (req.auth) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    return null
  }

  if (!req.auth) {
    let from = req.nextUrl.pathname
    if (req.nextUrl.search) {
      from += req.nextUrl.search
    }
    return NextResponse.redirect(
      new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
    )
  }
})

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}