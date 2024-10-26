import { transform } from "./app";
import { SingleQueue } from "./queue";
import './mod';

const transformQueue = new SingleQueue();

Bun.serve({
  port: 3000,
  async fetch(request, server) {
    const token = request.headers.get("Authorization") ?? undefined;
    const url = new URL(request.url);
    if (url.pathname === "/transform" && request.method == "POST") {
      const data = (await request.json()) as TransformArgument;
      transformQueue.push(transform.bind(null, ({ ...data, token })));
      return new Response("Home page!");
    }
    if (url.pathname === "/downloadDraw") {
      return new Response("Blog!");
    }
    return new Response("404!");
  },
});
