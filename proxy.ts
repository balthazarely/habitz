import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/home", "/my-habits", "/settings", "/history"];
const publicRoutes = ["/"];

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (publicRoutes.includes(pathname) && session) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
