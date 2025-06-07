import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import connectDB from "./config/db.js";
import sitemapRoutes from "./routes/sitemap.routes.js";

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/", sitemapRoutes); // This handles /sitemap.xml and /robots.txt

// Basic route
app.get("/", (req, res) => {
    res.json({ 
      message: "SBM Forex Academy API is running!",
      endpoints: {
        sitemap: "https://sbm-forex-academy.onrender.com/sitemap.xml",
        robots: "https://sbm-forex-academy.onrender.com/robots.txt",
        stats: "https://sbm-forex-academy.onrender.com/api/sitemap/stats"
      }
    });
  });

export default app;
