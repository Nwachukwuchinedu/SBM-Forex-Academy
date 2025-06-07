export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://sbm-forex-academy.onrender.com/sitemap.xml"
    );
    const sitemap = await response.text();

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    res.status(500).send("Failed to fetch sitemap");
  }
}
