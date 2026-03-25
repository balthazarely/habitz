import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/home", "/my-habits", "/settings", "/history"];
const publicRoutes = ["/"];

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Only check whether a session cookie exists — never refresh tokens here.
  // Server-side token refresh (getUser) causes the middleware to update the
  // cookie while the browser client is also initialising, producing two
  // concurrent _recoverAndRefresh calls that steal each other's Web Lock and
  // break all subsequent Supabase queries. All token refresh is left entirely
  // to createBrowserClient on the client side.
  const hasSession = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token") && c.value);

  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (publicRoutes.includes(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
