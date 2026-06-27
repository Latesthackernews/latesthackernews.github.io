const fs = require("fs");
require("dotenv").config();

async function generateArticle(title, description) {

  const prompt = `
You are an expert SEO content writer.

Write a HIGH QUALITY SEO article.

TITLE: ${title}

DESCRIPTION: ${description}

RULES:
- Minimum 2000 words
- Output ONLY HTML
- Use <h1>, <h2>, <h3>, <p>, <ul>, <li>
- Add introduction
- Add practical examples
- Add FAQ section
- Add conclusion
- SEO optimized
- No markdown
- Do not use \`\`\`
`;

  try {

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",

          messages: [
            {
              role: "user",
              content: prompt
            }
          ],

          temperature: 0.7,
          max_tokens: 6000
        })
      }
    );

    const data = await response.json();

    if (!data.choices) {
      console.log(data);
      throw new Error("Groq API error");
    }

    let article = data.choices[0].message.content;

    // Remove markdown fences if present
    article = article.replace(/```html|```/g, "");

    return article;

  } catch (error) {

    console.log("Generation failed:", error.message);

    return `
      <h1>${title}</h1>

      <p>${description}</p>

      <p>Content generation failed.</p>
    `;
  }
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
<urlset
