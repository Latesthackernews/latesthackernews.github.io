const fs = require("fs");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
- 2000+ words minimum
- Output ONLY HTML (no markdown)
- Use <h1>, <h2>, <h3>, <p>, <ul>, <li>
- Add introduction
- Add step-by-step sections
- Add real examples
- Add FAQ section
- Add conclusion
- SEO optimized
`;

  const result = await model.generateContent(prompt);

  let text = result.response.text();

  // remove markdown fences if Gemini adds them
  text = text.replace(/```html|```/g, "");

  return text;
}

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

    let html = template;

    html = html.replace(/{{title}}/g, post.title);
    html = html.replace(/{{description}}/g, post.description);
    html = html.replace(/{{slug}}/g, post.slug);
    html = html.replace(/{{url}}/g, post.url);
    html = html.replace("{{content}}", article);

    fs.writeFileSync(
      "./blog/" + post.slug + ".html",
      html,
      "utf8"
    );

    sitemap += `
  <url>
    <loc>https://latesthackernews.github.io/blog/${post.slug}.html</loc>
  </url>`;
  }

  sitemap += `
</urlset>`;

  fs.writeFileSync("./sitemap.xml", sitemap, "utf8");

  console.log("DONE: Site generated successfully");
}

buildSite().catch(console.error);
function generateInternalLinks(posts) {
  return posts.map(p => {
    return `<li><a href="/blog/${p.slug}.html">${p.title}</a></li>`;
  }).join("\n");
}
