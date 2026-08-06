export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/week/:path*",
    "/add/:path*",
    "/queue/:path*",
    "/history/:path*",
    "/ranking/:path*",
    "/profile/:path*",
    "/members/:path*",
    "/member/:path*",
    "/movie/:path*",
  ],
};
