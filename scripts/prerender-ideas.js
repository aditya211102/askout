import fs from "fs";
import path from "path";
import vm from "vm";
import ts from "typescript";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), "..");
const distDir = path.join(rootDir, "dist");
const siteUrl = "https://askout-moments.vercel.app";

const loadTsModule = (relativePath) => {
  const source = fs.readFileSync(path.join(rootDir, relativePath), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, { module, exports: module.exports });
  return module.exports;
};

const { ARTICLES } = loadTsModule("src/data/ideas/articles.ts");
const { CATEGORIES } = loadTsModule("src/data/ideas/categories.ts");
const assetFiles = fs.readdirSync(path.join(distDir, "assets"));
const cssAsset = assetFiles.find((file) => /^index-.*\.css$/.test(file));
const jsAsset = assetFiles.find((file) => /^index-.*\.js$/.test(file));

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const link = (href, text) => `<a href="${href}">${escapeHtml(text)}</a>`;

const layout = ({ title, description, canonicalPath, schema, content }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index,follow" />
    <link rel="canonical" href="${siteUrl}${canonicalPath}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${siteUrl}${canonicalPath}" />
    <meta property="og:image" content="${siteUrl}/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="stylesheet" href="/assets/${cssAsset}" />
    <style>body{margin:0}.ideas-static{max-width:880px;margin:auto;padding:2rem 1.5rem 5rem;line-height:1.65}.ideas-static a{color:#7d2945;text-decoration:underline}.ideas-static nav{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:3rem}.ideas-static h1{line-height:1.12}.ideas-static h2{margin-top:2.5rem;line-height:1.25}.ideas-static li{margin:.5rem 0}.ideas-static .meta,.ideas-static .label{color:#6b6670;font-size:.9rem}.ideas-static .cta{margin:2.5rem 0;padding:1.25rem;border-left:4px solid #7d2945;background:#fff6f0}.ideas-static footer{border-top:1px solid #ddd;margin-top:4rem;padding-top:1.5rem}</style>
    ${schema.map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`).join("\n")}
  </head>
  <body><div id="root"><main class="ideas-static">${content}</main></div><script type="module" src="/assets/${jsAsset}"></script></body>
</html>`;

const breadcrumbs = (items) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: `${siteUrl}${item.path}` })),
});

const writePage = (urlPath, html) => {
  const pageDir = path.join(distDir, urlPath.replace(/^\//, ""));
  fs.mkdirSync(pageDir, { recursive: true });
  fs.writeFileSync(path.join(pageDir, "index.html"), html);
};

const footer = () => `<footer><p><strong>AskOut Ideas</strong> — practical ways to make someone feel seen.</p><p>${link("/ideas", "All ideas")} · ${link("/about", "About AskOut Editorial")}</p></footer>`;

const homeContent = `<nav>${link("/", "AskOut")} ${link("/ideas", "Ideas")}</nav>
<p class="label">ASKOUT IDEAS</p><h1>Ideas for making someone feel special</h1>
<p>Practical, personal ideas for birthdays, anniversaries, long-distance relationships, messages, and meaningful gifts.</p>
<h2>Explore by moment</h2><ul>${CATEGORIES.map((category) => `<li>${link(`/ideas/${category.slug}`, category.title)}</li>`).join("")}</ul>
<h2>Latest guides</h2><ul>${ARTICLES.map((article) => `<li>${link(`/ideas/${article.slug}`, article.title)} — ${escapeHtml(article.description)}</li>`).join("")}</ul>${footer()}`;

writePage("/ideas", layout({ title: "Ideas for Making Someone Feel Special | AskOut Ideas", description: "Thoughtful ideas, romantic surprises, love letters, messages, and gifts for special moments.", canonicalPath: "/ideas", schema: [{ "@context": "https://schema.org", "@type": "CollectionPage", name: "AskOut Ideas", url: `${siteUrl}/ideas` }], content: homeContent }));

writePage("/about", layout({ title: "About AskOut Editorial | AskOut Moments", description: "How AskOut creates and reviews practical ideas for meaningful digital surprises, dates, messages, and celebrations.", canonicalPath: "/about", schema: [{ "@context": "https://schema.org", "@type": "AboutPage", name: "About AskOut Editorial", url: `${siteUrl}/about` }], content: `<nav>${link("/", "AskOut")} ${link("/ideas", "Ideas")}</nav><p class="label">ABOUT ASKOUT EDITORIAL</p><h1>Ideas should feel like they came from someone who knows you.</h1><p>AskOut makes shareable digital moments for people who want to say something thoughtful, even when they cannot be there in person. Our guides focus on ideas that are practical, personal, and adaptable to different budgets and relationships.</p><p>Articles are planned and reviewed by the AskOut editorial team. We update a guide when we make a meaningful improvement, rather than changing dates simply to make it appear new.</p><p>We mention AskOut products only where they are relevant to a reader's goal. A useful idea should still work whether or not you use AskOut.</p>${footer()}` }));

for (const category of CATEGORIES) {
  const articles = ARTICLES.filter((article) => article.category === category.slug);
  const content = `<nav>${link("/", "AskOut")} ${link("/ideas", "Ideas")}</nav><p class="label">CATEGORY</p><h1>${escapeHtml(category.title)}</h1><p>${escapeHtml(category.description)}</p><h2>Guides</h2>${articles.length ? `<ul>${articles.map((article) => `<li>${link(`/ideas/${article.slug}`, article.title)} — ${escapeHtml(article.description)}</li>`).join("")}</ul>` : "<p>New guides are being prepared for this category.</p>"}${footer()}`;
  writePage(`/ideas/${category.slug}`, layout({ title: `${category.title} | AskOut Ideas`, description: category.description, canonicalPath: `/ideas/${category.slug}`, schema: [breadcrumbs([{ name: "Home", path: "/" }, { name: "Ideas", path: "/ideas" }, { name: category.name, path: `/ideas/${category.slug}` }])], content }));
}

for (const article of ARTICLES) {
  const category = CATEGORIES.find((item) => item.slug === article.category);
  const canonicalPath = `/ideas/${article.slug}`;
  const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, image: [`${siteUrl}${article.heroImage}`], datePublished: article.publishedAt, dateModified: article.updatedAt, author: { "@type": "Organization", name: article.author, url: `${siteUrl}/about` }, publisher: { "@type": "Organization", name: "AskOut Moments", url: siteUrl }, mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}${canonicalPath}` } };
  const faqSchema = article.faq?.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: article.faq.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) } : null;
  const content = `<nav>${link("/", "AskOut")} ${link("/ideas", "Ideas")} ${category ? link(`/ideas/${category.slug}`, category.name) : ""}</nav><p class="label">${escapeHtml(category?.name || article.category)}</p><h1>${escapeHtml(article.title)}</h1><p class="meta">By ${escapeHtml(article.author)} · Published ${escapeHtml(article.publishedAt)} · Updated ${escapeHtml(article.updatedAt)} · ${escapeHtml(article.readingTime)}</p><p><em>${escapeHtml(article.intro)}</em></p>${article.sections.map((section) => `<section id="${escapeHtml(section.id)}"><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.content)}</p>${section.items?.length ? `<ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}${section.callout ? `<aside class="cta"><p>${escapeHtml(section.callout.text)}</p>${link(section.callout.ctaLink, section.callout.ctaLabel)}</aside>` : ""}</section>`).join("")}${article.faq?.length ? `<section><h2>Frequently asked questions</h2>${article.faq.map((faq) => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`).join("")}</section>` : ""}<aside class="cta"><h2>${escapeHtml(article.askOutCta?.title || "Turn this idea into a real moment")}</h2><p>${escapeHtml(article.askOutCta?.description || "Create a personal digital surprise with AskOut.")}</p>${link(article.askOutCta?.link || "/bouquet/create", article.askOutCta?.buttonText || "Create your surprise")}</aside>${footer()}`;
  writePage(canonicalPath, layout({ title: `${article.title} | AskOut Ideas`, description: article.description, canonicalPath, schema: [articleSchema, breadcrumbs([{ name: "Home", path: "/" }, { name: "Ideas", path: "/ideas" }, { name: category?.name || article.category, path: `/ideas/${article.category}` }, { name: article.title, path: canonicalPath }]), ...(faqSchema ? [faqSchema] : [])], content }));
}

console.log(`Pre-rendered ${ARTICLES.length + CATEGORIES.length + 2} Ideas and trust pages.`);
