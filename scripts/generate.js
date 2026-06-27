const fs = require("fs");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

/* ==========================
   GENERATE ARTICLE WITH AI
========================== */
async function generateArticle(title, description) {

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
You are an expert SEO content writer.

Write a comprehensive SEO article.

TITLE: ${title}

DESCRIPTION:
${description}

RULES:
- Minimum 2000 words
- Output ONLY HTML
- Use <h2>, <h3>, <p>, <ul>, <li>
- Add an introduction
- Add practical examples
- Add FAQ section
- Add conclusion
- Optimize for SEO
- Do NOT use markdown
`;

  try {

    const result = await model.generateContent(prompt);

    let text = result.response.text();

    // Remove markdown code fences if Gemini adds them
    text = text.replace(/```html|```/g, "");

    return text;

  } catch (error) {

    console.log(
      "Gemini failed for:",
      title
    );

    console.log(error.message);

    return `
      <h2>${title}</h2>

      <p>${description}</p>

      <p>
      This article is currently being updated.
      Please check back soon.
      </p>
    `;
  }
}

/* ==========================
   INTERNAL LINKING SYSTEM
========================== */
function generateInternalLinks(
  posts,
  currentSlug,
  currentCategory
) {

  const related = posts
    .filter(post =>
      post.slug !== currentSlug &&
      post.category === currentCategory
    )
    .slice(0, 5);

  if (related.length === 0) return "";

  let html = `
<section class="related-posts">

<h2>Related Articles</h2>

<ul>
`;

  related.forEach(post => {

    html += `
<li>
<a href="/blog/${post.slug}.html">
${post.title}
</a>
</li>
`;

  });

  html += `
</ul>

</section>
`;

  return html;
}

/* ==========================
   BUILD WEBSITE
========================== */
async function buildSite() {

  const posts = JSON.parse(
    fs.readFileSync(
      "./content/posts.json",
      "utf8"
    )
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

    const internalLinks =
      generateInternalLinks(
        posts,
        post.slug,
        post.category
      );

    let html = template;

    html = html.replace(
      /{{title}}/g,
      post.title
    );

    html = html.replace(
      /{{description}}/g,
      post.description
    );

    html = html.replace(
      /{{slug}}/g,
      post.slug
    );

    html = html.replace(
      /{{url}}/g,
      post.url || "#"
    );

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
<loc>
https://latesthackernews.github.io/blog/${post.slug}.html
</loc>
</url>
`;

    console.log(
      "Generated:",
      post.slug
    );
  }

  sitemap += `
</urlset>
`;

  fs.writeFileSync(
    "./sitemap.xml",
    sitemap,
    "utf8"
  );

  console.log(
    "🚀 Site generation completed successfully"
  );
}

buildSite().catch(console.error);
