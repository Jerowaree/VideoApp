import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const allowedPath =
    pathname === "/" ||
    pathname === "/control-9f3a7c1e" ||
    pathname.startsWith("/api/superadmin/") ||
    pathname.startsWith("/api/registration/");
  if (!allowedPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
