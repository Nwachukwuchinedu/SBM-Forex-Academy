export default async (req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      "https://sbm-forex-academy.onrender.com/sitemap.xml",
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const sitemap = await response.text();
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Sitemap proxy error:", error);
    res.status(500).send(`Failed to fetch sitemap: ${error.message}`);
  }
};
