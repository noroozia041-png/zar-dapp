import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith("/admin-")) {
    const token = url.searchParams.get("token");
    const expectedToken = process.env.ADMIN_TOKEN;

    if (token !== expectedToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin-:path*",
};