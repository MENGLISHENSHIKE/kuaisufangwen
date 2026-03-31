export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);
  const originUrl = `https://zjyxwj.gamer.gd${url.pathname}${url.search}`;

  // 透传请求头
  const headers = new Headers(request.headers);
  headers.set('x-real-ip', request.ip || '');
  headers.set('x-forwarded-for', request.ip || '');
  headers.set('x-forwarded-proto', 'https');

  try {
    // 反向代理请求源站
    const response = await fetch(originUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
      redirect: 'follow',
    });

    // 给响应添加缓存头
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Cache-Control', 's-maxage=600, stale-while-revalidate=300');

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response('Proxy Error', { status: 500 });
  }
}