import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: '/:path*',
};

export default function middleware(request: NextRequest) {
  // 1. 保留原请求头，透传给源站
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-real-ip', request.ip || '');
  requestHeaders.set('x-forwarded-for', request.ip || '');
  requestHeaders.set('x-forwarded-proto', 'https');

  // 2. 发起反代请求
  const url = new URL(request.url);
  const originUrl = `https://zjyxwj.gamer.gd${url.pathname}${url.search}`;
  
  return fetch(originUrl, {
    method: request.method,
    headers: requestHeaders,
    body: request.body,
    redirect: 'follow',
  }).then((response) => {
    // 3. 给响应添加缓存头，加速国内访问
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Cache-Control', 's-maxage=600, stale-while-revalidate=300');
    responseHeaders.set('Vercel-CDN-Cache', 'HIT');
    
    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  });
}