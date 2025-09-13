import type { Request, Response } from "express";

export async function handleProxy(req: Request, res: Response) {
  try {
    const base = process.env.BACKEND_BASE_URL;
    if (!base) {
      res.status(500).json({ error: "BACKEND_BASE_URL not set" });
      return;
    }

    const subPath = req.originalUrl.replace(/^\/api\/backend/, "");
    const url = new URL(subPath || "/", base).toString();

    const headers: Record<string, string> = {};
    for (const [k, v] of Object.entries(req.headers)) {
      if (typeof v === "string") headers[k] = v;
    }
    delete headers["host"];
    delete headers["content-length"];

    const method = req.method.toUpperCase();
    const isBodyMethod = !["GET", "HEAD"].includes(method);

    const body = isBodyMethod && req.body ? JSON.stringify(req.body) : undefined;

    const resp = await fetch(url, {
      method,
      headers: {
        ...headers,
        "content-type": headers["content-type"] || (body ? "application/json" : undefined),
      } as any,
      body,
    } as RequestInit);

    res.status(resp.status);
    // Forward headers (avoid hop-by-hop and encoding issues)
    resp.headers.forEach((value, key) => {
      if (["transfer-encoding", "content-encoding"].includes(key)) return;
      res.setHeader(key, value);
    });

    const buffer = Buffer.from(await resp.arrayBuffer());
    res.send(buffer);
  } catch (err: any) {
    res.status(502).json({ error: "Proxy error", details: err?.message ?? String(err) });
  }
}
