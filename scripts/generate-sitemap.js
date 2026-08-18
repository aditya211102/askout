import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const siteUrl = "https://askout-moments.vercel.app";

// Extract categories from file
const categoriesFile = fs.readFileSync(path.join(rootDir, "src/data/ideas/categories.ts"), "utf-8");
const categorySlugsMatches = [...categoriesFile.matchAll(/slug:\s*"([^"]+)"/g)];
const categorySlugs = categorySlugsMatches.map((m) => m[1]);

// Extract articles from file
const articlesFile = fs.readFileSync(path.join(rootDir, "src/data/ideas/articles.ts"), "utf-8");
const articleMatches = [...articlesFile.matchAll(/slug:\s*"([^"]+)"[\s\S]*?updatedAt:\s*"([^"]+)"/g)];
const articles = articleMatches.map((m) => ({ slug: m[1], lastmod: m[2] }));

const staticPages = [
  { url: "", priority: "1.0" },
  { url: "/askout/create", priority: "0.8" },
  { url: "/bouquet/create", priority: "0.8" },
  { url: "/voice/create", priority: "0.8" },
  { url: "/about", priority: "0.5" },
  { url: "/ideas", priority: "0.9" },
];

const categoryPages = categorySlugs.map((slug) => ({
  url: `/ideas/${slug}`,
  priority: "0.8",
}));

const articlePages = articles.map((article) => ({
  url: `/ideas/${article.slug}`,
  priority: "0.7",
  lastmod: article.lastmod,
}));

const allPages = [...staticPages, ...categoryPages, ...articlePages];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <priority>${page.priority}</priority>${page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>
`;

const sitemapPath = path.join(rootDir, "public/sitemap.xml");
fs.writeFileSync(sitemapPath, sitemapContent, "utf-8");

console.log(`Generated sitemap with ${allPages.length} URLs at ${sitemapPath}`);
