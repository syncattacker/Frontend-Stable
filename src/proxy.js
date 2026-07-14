import { NextResponse } from "next/server";

const PRIVATE_PREFIXES = ["/dashboard", "/season-studio", "/season/"];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  if (PRIVATE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/season-studio/:path*", "/season/:path*"],
};
