const fs = require("fs");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function expandContent(title, description) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
Write a detailed SEO article.

Title: ${title}

Description: ${description}

Requirements:
- Minimum 1200 words.
- Use HTML only.
- Use <h2>, <h3>, <p>, <ul>, and <li> tags.
- Begin with an introduction.
- Add practical examples.
- Add a conclusion.
- Do not use Markdown.
- Do not include <html> or <body> tags.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
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
    console.log("Generating article:", post.title);

    let html = template;

    html = html.replace(/{{title}}/g, post.title);
    html = html.replace(/{{description}}/g, post.description);
    html = html.replace(/{{slug}}/g, post.slug);
    html = html.replace(/{{url}}/g, post.url);

    const articleContent = await expandContent(
      post.title,
      post.description
    );

    html = html.replace(
      "{{content}}",
      articleContent
    );

    fs.writeFileSync(
      "./blog/" + post.slug + ".html",
      html,
      "utf8"
    );

    sitemap += `
  <url>
    <loc>https://latesthackernews.github.io/blog/${post.slug}.html</loc>
  </url>
`;

    console.log("Generated:", post.slug);
  }

  sitemap += `
</urlset>`;

  fs.writeFileSync(
    "./sitemap.xml",
    sitemap,
    "utf8"
  );

  console.log("Site generation completed.");
}

buildSite().catch((error) => {
  console.error(error);
});