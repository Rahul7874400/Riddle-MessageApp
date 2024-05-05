import { NextRequest , NextResponse } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

 
export const config = {
  matcher: ['/dashboard/:path*','/sign-in', '/sign-up', '/', '/verify/:path*']
};

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({
      req : request,
      secret : process.env.NEXTAUTH_SECERT,
      cookieName: "next-auth.session-token",
    })
    const url = request.nextUrl

    console.log("Token:::::::::::",token)

    if(token && 
        (url.pathname.startsWith('/sing-in') ||
        url.pathname.startsWith('/sing-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname === '/')
    ){
      console.log("Token exist")
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if(!token && url.pathname == '/dashboard'){
      //console.log("Token does not")
      return NextResponse.redirect(new URL('/sing-in', request.url));
    }
    return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
