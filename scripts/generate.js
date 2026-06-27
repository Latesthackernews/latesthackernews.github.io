const fs = require("fs");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* =========================
   AI ARTICLE GENERATION
========================= */
async function generateArticle(title, description) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
You are an expert SEO content writer.

Write a HIGH QUALITY SEO article.

TITLE: ${title}
DESCRIPTION: ${description}

RULES:
- Minimum 2000 words
- Output ONLY HTML
- Use <h2>, <h3>, <p>, <ul>, <li>
- Add introduction
- Add step-by-step sections
- Add real examples
- Add FAQ section
- Add conclusion
- SEO optimized
`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // clean possible markdown
    text = text.replace(/```html|```/g, "");

    return text;

  } catch (err) {
    console.log("⚠️ AI failed, using fallback for:", title);

    return `
      <h2>${title}</h2>
      <p>${description}</p>
      <p>Content temporarily unavailable due to API limits.</p>
    `;
  }
}

/* =========================
   INTERNAL LINKING (SEO SILO)
========================= */
function generateInternalLinks(posts, currentSlug, category = null) {

  let pool = posts.filter(p => p.slug !== currentSlug);

  // OPTIONAL: silo filtering if category exists
  if (category) {
    pool = pool.filter(p => p.category === category);
  }

  const related = pool
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  return `
    <section class="related-posts">
      <h2>Related Articles</h2>
      <ul>
        ${related.map(post => `
          <li>
            <a href="/blog/${post.slug}.html">
              ${post.title}
            </a>
          </li>
        `).join("")}
      </ul>
    </section>
  `;
}

/* =========================
   MAIN BUILD SYSTEM
========================= */
async function buildSite() {

  const posts = JSON.parse(
    fs.readFileSync("./content/posts.json", "utf8")
  );

  const template = fs.readFileSync(
    "./blog/template.html",
    "utf8"
  );

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://latesthackernews.github.io/</loc>
  </url>

  <url>
    <loc>https://latesthackernews.github.io/blog/</loc>
  </url>
`;

  for (const post of posts) {

    console.log("Generating:", post.title);

    const article = await generateArticle(
      post.title,
      post.description
    );

    const internalLinks = generateInternalLinks(
      posts,
      post.slug,
      post.category
    );

    let html = template;

    html = html.replace(/{{title}}/g, post.title);
    html = html.replace(/{{description}}/g, post.description);
    html = html.replace(/{{slug}}/g, post.slug);
    html = html.replace(/{{url}}/g, post.url);

    html = html.replace(
      "{{content}}",
      article + internalLinks
    );

    fs.writeFileSync(
      `./blog/${post.slug}.html`,
      html,
      "utf8"
    );

    sitemap += `
  <url>
    <loc>https://latesthackernews.github.io/blog/${post.slug}.html</loc>
  </url>`;

    console.log("Generated:", post.slug);
  }

  sitemap += `
</urlset>`;

  fs.writeFileSync("./sitemap.xml", sitemap, "utf8");

  console.log("🚀 SITE GENERATED SUCCESSFULLY");
}

buildSite().catch(console.error);
