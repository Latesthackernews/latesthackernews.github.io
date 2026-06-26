const fs = require("fs");

const keywords = JSON.parse(fs.readFileSync("./data/keywords.json", "utf8"));

function generateContent(item) {
  return `
<h1>${item.title}</h1>

<p>This page explains the topic: <strong>${item.keyword}</strong>.</p>

<h2>Overview</h2>
<p>
This guide provides structured information about ${item.keyword}. It is designed for clarity, indexing, and educational reference.
</p>

<h2>Key Insights</h2>
<ul>
  <li>Structured content improves SEO visibility</li>
  <li>Search intent alignment is critical</li>
  <li>Internal linking increases crawl depth</li>
</ul>

<h2>Practical Use</h2>
<p>
Understanding ${item.keyword} helps organize digital information more effectively and improves content discoverability.
</p>
`;
}

keywords.forEach(item => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <title>${item.title}</title>
  <meta name="description" content="${item.keyword} explained in a structured guide.">

  <link rel="canonical" href="https://latesthackernews.github.io/content/${item.slug}.html">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${item.title}",
    "description": "${item.keyword}"
  }
  </script>

  <link rel="stylesheet" href="/css/style.css">
</head>

<body>

<a href="/">← Home</a>

${generateContent(item)}

</body>
</html>
`;

  fs.writeFileSync(`./content/${item.slug}.html`, html);
  console.log("Generated:", item.slug);
});
