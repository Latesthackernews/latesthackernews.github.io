console.log("NEW GEMINI GENERATOR RUNNING");
const fs = require("fs");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

<<<<<<< HEAD
async function expandContent(title, description) {
const model = genAI.getGenerativeModel({
model: "gemini-2.5-flash"
});

const prompt = `
Write a detailed SEO article.

Title: ${title}

Description: ${description}

Requirements:

* Minimum 1200 words.
* Use HTML only.
* Use <h2>, <h3>, <p>, <ul>, <li>.
* Begin with an introduction.
* Add several sections.
* Add a conclusion.
* Write informative and engaging content.
* Do not include <html>, <body>, or markdown fences.
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

let sitemap = `<?xml version="1.0" encoding="UTF-8"?> <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

for (const post of posts) {

```
let html = template;

html = html.replace(/{{title}}/g, post.title);
html = html.replace(/{{description}}/g, post.description);
html = html.replace(/{{slug}}/g, post.slug);
html = html.replace(/{{url}}/g, post.url);

console.log(`Generating article: ${post.title}`);

const articleContent = await expandContent(
  post.title,
  post.description
);

html = html.replace(
  "{{content}}",
  articleContent
);

fs.writeFileSync(
  `./blog/${post.slug}.html`,
  html,
  "utf8"
);

sitemap += `
```

  <url>
    <loc>https://latesthackernews.github.io/blog/${post.slug}.html</loc>
  </url>`;

```
console.log(`Generated: ${post.slug}`);
```

}

sitemap += ` </urlset>`;

fs.writeFileSync(
"./sitemap.xml",
sitemap,
"utf8"
);

console.log("Site generation completed.");
}

buildSite();
=======
posts.forEach(post => {
  let html = template;

  html = html.replace(/{{title}}/g, post.title);
  html = html.replace(/{{description}}/g, post.description);
  html = html.replace(/{{slug}}/g, post.slug);
  html = html.replace(/{{url}}/g, post.url);

  const contentHtml = post.content.map(p => `<p>${p}</p>`).join("\n");
  html = html.replace("{{content}}", contentHtml);

  fs.writeFileSync(`./blog/${post.slug}.html`, html);

  console.log("Generated:", post.slug);
});
>>>>>>> 337d877 (Generate AI articles with Gemini)
