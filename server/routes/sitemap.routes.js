import { Router } from "express";
import { 
  generateSitemap, 
  generateRobotsTxt, 
  getSitemapStats 
} from "../controllers/sitemap.controller.js";

const router = Router();

// Generate sitemap.xml
router.get("/sitemap.xml", generateSitemap);

// Generate robots.txt
router.get("/robots.txt", generateRobotsTxt);

// Get sitemap statistics (for debugging/monitoring)
router.get("/api/sitemap/stats", getSitemapStats);

export default router;