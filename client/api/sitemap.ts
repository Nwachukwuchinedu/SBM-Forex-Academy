import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await fetch(
      "https://sbm-forex-academy.onrender.com/sitemap.xml",
      {
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const sitemap = await response.text();
    res.setHeader("Content-Type", "application/xml").status(200).send(sitemap);
  } catch (error: unknown) {
    console.error("Sitemap proxy error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).send(`Failed to fetch sitemap: ${message}`);
  }
}
