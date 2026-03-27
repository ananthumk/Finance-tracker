import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ['/dashBoard', '/profile']
const authRoutes = ['/login', '/']

export function middleware(request: NextRequest){
    const {pathname} = request.nextUrl

    const token = request.cookies.get('token')?.value

    const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

    const isAuthRoute = authRoutes.includes(pathname)

    if(isProtected && !token){
       return NextResponse.redirect(new URL('/login', request.url))
    }

    if(isAuthRoute && token){
        return NextResponse.redirect(new URL('/dashBoard', request.url))
    }
    
    return NextResponse.next()
}

export const config = {
    matcher: ['/dashBoard/:path*', '/profile/:path*', '/login', '/']
}