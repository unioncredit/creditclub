import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add cache-control header for club address pages
  if (request.nextUrl.pathname.startsWith('/funds/')) {
    const response = NextResponse.next()

    // Cache successful requests for 1 hour at the edge
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    )

    return response
  }
}

export const config = {
  matcher: '/funds/:clubAddress*',
}
