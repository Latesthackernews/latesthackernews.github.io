const fs = require("fs");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateKeywords() {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
Generate 20 SEO blog topics about "SEO, digital marketing, and online business".

Return ONLY JSON array like:
[
  {
    "slug": "example-slug",
    "title": "Example Title",
    "description": "Short SEO description"
  }
]
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text();

  text = text.replace(/```json|```/g, "");

  fs.writeFileSync(
    "./content/generated-posts.json",
    text,
    "utf8"
  );

  console.log("Keywords generated!");
}

generateKeywords();
