// api/news.ts
// Minimal serverless proxy for NewsAPI — no @vercel/node import required.
// This file will be picked up by Vercel as /api/news when deployed.

export default async function handler(req, res) {
  try {
    const {
      country = "us",
      q,
      pageSize = "100",
      from,
      to,
    } = (req.query || {}) as Record<string, string>;

    const key = process.env.NEWSAPI_KEY;
    if (!key)
      return res.status(500).json({ error: "Server missing NEWSAPI_KEY" });

    const endpoint = q ? "everything" : "top-headlines";
    const url = new URL(`https://newsapi.org/v2/${endpoint}`);

    if (q) url.searchParams.set("q", q);
    else url.searchParams.set("country", country);

    url.searchParams.set("pageSize", pageSize);
    if (from) url.searchParams.set("from", from);
    if (to) url.searchParams.set("to", to);

    url.searchParams.set("apiKey", key);

    const r = await fetch(url.toString());
    const text = await r.text();

    // Short cache on Vercel edge to mitigate rate limits
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(r.status).send(text);
  } catch (err: unknown) {
    console.error("api/news error:", err);
    return res && res.status
      ? res.status(500).json({ error: String(err ?? "unknown error") })
      : null;
  }
}
