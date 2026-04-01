export const config = {
  runtime: "edge"
};

export default async function handler(req) {
  const url = new URL(req.url);
  let path = url.pathname;

  // ✅ 强制访问根目录时自动转到 index.html
  if (path === "/") {
    path = "/index.html";
  }

  // ✅ 你的真实网站（绝对不会跳后台）
  const target = `https://zjyxwj.gamer.gd${path}${url.search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");

  try {
    const res = await fetch(target, {
      method: req.method,
      headers: headers,
      body: req.body,
      redirect: "follow"
    });

    return new Response(res.body, {
      status: res.status,
      headers: res.headers
    });
  } catch (err) {
    return new Response("Error", { status: 500 });
  }
}
