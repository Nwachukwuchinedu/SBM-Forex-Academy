import User from "../models/User.js";
import Admin from "../models/Admin.js";

const FRONTEND_URL = "https://www.sbmforexacademy.com";

// Static routes based on your actual React routes
const staticRoutes = [
  {
    url: "/",
    changefreq: "daily",
    priority: "1.0"
  },
  {
    url: "/about",
    changefreq: "monthly",
    priority: "0.9"
  },
  {
    url: "/services",
    changefreq: "weekly",
    priority: "0.9"
  },
  {
    url: "/faq",
    changefreq: "monthly",
    priority: "0.7"
  },
  {
    url: "/register",
    changefreq: "monthly",
    priority: "0.6"
  },
  {
    url: "/login",
    changefreq: "monthly",
    priority: "0.6"
  },
  {
    url: "/verify-email",
    changefreq: "yearly",
    priority: "0.3"
  }
];

// Service plans based on your actual Services.tsx
const servicePlans = {
  mentorship: [
    {
      id: "standard-mentorship",
      name: "Standard Mentorship",
      price: "$210/month",
      changefreq: "weekly",
      priority: "0.8"
    },
    {
      id: "vip-mentorship",
      name: "VIP Mentorship Package",
      price: "$1000/month",
      changefreq: "weekly",
      priority: "0.9"
    }
  ],
  accountManagement: [
    {
      id: "basic-account-management",
      name: "Basic Account Management",
      price: "$500/month",
      changefreq: "weekly",
      priority: "0.8"
    },
    {
      id: "advanced-account-management",
      name: "Advanced Account Management",
      price: "$1000-$5000/month",
      changefreq: "weekly",
      priority: "0.8"
    },
    {
      id: "premium-account-management",
      name: "Premium Account Management",
      price: "$5000-$10000/month",
      changefreq: "weekly",
      priority: "0.9"
    }
  ],
  signals: [
    {
      id: "signal-provision",
      name: "Signal Provision Service",
      price: "$80/month",
      changefreq: "weekly",
      priority: "0.7"
    }
  ]
};

export const generateSitemap = async (req, res) => {
  try {
    const currentDate = new Date().toISOString();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

    // Add static public routes
    staticRoutes.forEach(route => {
      sitemap += `
  <url>
    <loc>${FRONTEND_URL}${route.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    });

    // Add service category pages
    const serviceCategories = [
      {
        url: "/services/mentorship",
        name: "Mentorship Packages",
        priority: "0.8"
      },
      {
        url: "/services/account-management",
        name: "Account Management Services",
        priority: "0.8"
      },
      {
        url: "/services/signals",
        name: "Signal Provision Service",
        priority: "0.7"
      }
    ];

    serviceCategories.forEach(category => {
      sitemap += `
  <url>
    <loc>${FRONTEND_URL}${category.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${category.priority}</priority>
  </url>`;
    });

    // Add individual service plan pages (if you create dedicated pages for each)
    // Mentorship packages
    servicePlans.mentorship.forEach(plan => {
      sitemap += `
  <url>
    <loc>${FRONTEND_URL}/services/mentorship/${plan.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${plan.changefreq}</changefreq>
    <priority>${plan.priority}</priority>
  </url>`;
    });

    // Account Management packages
    servicePlans.accountManagement.forEach(plan => {
      sitemap += `
  <url>
    <loc>${FRONTEND_URL}/services/account-management/${plan.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${plan.changefreq}</changefreq>
    <priority>${plan.priority}</priority>
  </url>`;
    });

    // Signal provision service
    servicePlans.signals.forEach(plan => {
      sitemap += `
  <url>
    <loc>${FRONTEND_URL}/services/signals/${plan.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${plan.changefreq}</changefreq>
    <priority>${plan.priority}</priority>
  </url>`;
    });

    // Get some statistics for dynamic content
    const [totalUsers, totalAdmins] = await Promise.all([
      User.countDocuments({ isEmailVerified: true }),
      Admin.countDocuments()
    ]);

    // Add additional pages that might exist
    const additionalPages = [
      {
        url: "/pricing",
        name: "Pricing Overview",
        priority: "0.8"
      },
      {
        url: "/testimonials",
        name: "Client Testimonials",
        priority: "0.7"
      },
      {
        url: "/success-stories",
        name: "Success Stories",
        priority: "0.7"
      },
      {
        url: "/contact",
        name: "Contact Us",
        priority: "0.7"
      },
      {
        url: "/blog",
        name: "Trading Blog",
        priority: "0.6"
      }
    ];

    additionalPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${FRONTEND_URL}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Add legal pages (common for trading platforms)
    const legalPages = [
      { url: "/terms-of-service", priority: "0.3" },
      { url: "/privacy-policy", priority: "0.3" },
      { url: "/risk-disclosure", priority: "0.4" },
      { url: "/refund-policy", priority: "0.3" },
      { url: "/disclaimer", priority: "0.3" }
    ];

    legalPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${FRONTEND_URL}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Close the sitemap
    sitemap += `
</urlset>`;

    // Set appropriate headers
    res.set({
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      'X-Robots-Tag': 'noindex' // Don't index the sitemap itself
    });

    // Send the sitemap
    res.status(200).send(sitemap);

  } catch (error) {
    console.error("Error generating sitemap:", error);
    
    // Fallback sitemap with just the homepage
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${FRONTEND_URL}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    res.set({
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300' // Shorter cache on error
    });

    res.status(200).send(fallbackSitemap);
  }
};

// Generate robots.txt
export const generateRobotsTxt = async (req, res) => {
  const robotsTxt = `User-agent: *
Allow: /
Allow: /about
Allow: /services
Allow: /services/
Allow: /faq
Allow: /register
Allow: /login
Allow: /pricing
Allow: /testimonials
Allow: /success-stories
Allow: /contact
Allow: /blog

# Block private/protected areas
Disallow: /dashboard/
Disallow: /admin/
Disallow: /api/

# Block verification pages from being indexed
Disallow: /verify-email

# Sitemap location
Sitemap: https://sbm-forex-academy.onrender.com/sitemap.xml

# Crawl delay (optional - helps prevent server overload)
Crawl-delay: 1`;

  res.set({
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
  });

  res.status(200).send(robotsTxt);
};

// Optional: Get sitemap statistics
export const getSitemapStats = async (req, res) => {
  try {
    const [totalUsers, verifiedUsers, totalAdmins] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isEmailVerified: true }),
      Admin.countDocuments()
    ]);

    const totalServicePlans = 
      servicePlans.mentorship.length + 
      servicePlans.accountManagement.length + 
      servicePlans.signals.length;

    const stats = {
      totalStaticPages: staticRoutes.length,
      totalServiceCategories: 3,
      totalServicePlans: totalServicePlans,
      mentorshipPackages: servicePlans.mentorship.length,
      accountManagementPackages: servicePlans.accountManagement.length,
      signalServices: servicePlans.signals.length,
      totalUsers,
      verifiedUsers,
      totalAdmins,
      lastGenerated: new Date().toISOString(),
      sitemapUrl: "https://sbm-forex-academy.onrender.com/sitemap.xml",
      robotsUrl: "https://sbm-forex-academy.onrender.com/robots.txt",
      serviceBreakdown: {
        mentorship: servicePlans.mentorship.map(p => ({ name: p.name, price: p.price })),
        accountManagement: servicePlans.accountManagement.map(p => ({ name: p.name, price: p.price })),
        signals: servicePlans.signals.map(p => ({ name: p.name, price: p.price }))
      }
    };

    res.json({
      message: "Sitemap statistics for SBM Forex Academy",
      stats
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching sitemap statistics",
      error: error.message
    });
  }
};