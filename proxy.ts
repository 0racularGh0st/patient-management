import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Next 16 renamed `middleware.ts` -> `proxy.ts` (runs on the Node.js runtime).
// Route protection is done here, on the server, by decoding the Auth.js session
// from the request. The redirect decision is made once before the page renders,
// so a transient client-side session refetch can never bounce the user between
// "/" and "/dashboard". `req.auth` is populated by the Auth.js `auth` wrapper.
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // A signed-in user has no reason to sit on the landing/login page.
  if (isLoggedIn && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Every route other than the public landing page requires a session.
  if (!isLoggedIn && pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/:path*",
    "/add-patient",
    "/add-patient/:path*",
    "/patient",
    "/patient/:path*",
  ],
};
