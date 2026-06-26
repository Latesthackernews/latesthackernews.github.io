const fs = require("fs");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
process.env.GEMINI_API_KEY
);

async function createContent(keyword, title, description) {

const model = genAI.getGenerativeModel({
model: "gemini-2.5-flash"
});

const prompt = `
Write a high-converting affiliate article.

Target keyword: ${keyword}

Title: ${title}

Description: ${description}

Requirements:

* Minimum 2500 words.
* Output HTML only.
* Include:

  * Introduction
  * Comparison table
  * Top recommendations
  * Pros and cons
  * Buying guide
  * FAQs
  * Conclusion
* Use H2 and H3 headings.
* Write for SEO and conversions.
  `;

  try {
  const result = await model.generateContent(prompt);

  return result.response.text()
  .replace(/`html|`/g, "");

  } catch (err) {

  console.log("Quota/API issue:", err.message);

  return `     <h2>${title}</h2>     <p>Content temporarily unavailable.</p>
    `;
  }
  }

async function buildMoneyPages() {

const pages = JSON.parse(
fs.readFileSync(
"./content/money-pages.json",
"utf8"
)
);

const template = fs.readFileSync(
"./money/template.html",
"utf8"
);

for (const page of pages) {

```
console.log("Generating:", page.title);

const article = await createContent(
  page.keyword,
  page.title,
  page.description
);

let html = template;

html = html.replace(/{{title}}/g, page.title);
html = html.replace(/{{description}}/g, page.description);
html = html.replace(/{{slug}}/g, page.slug);
html = html.replace("{{content}}", article);

fs.writeFileSync(
  `./money/${page.slug}.html`,
  html,
  "utf8"
);
```

}

console.log("Money pages generated.");
}

buildMoneyPages().catch(console.error);
