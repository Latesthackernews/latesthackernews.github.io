const fs = require("fs");

const keywords = JSON.parse(fs.readFileSync("./data/keywords.json", "utf8"));

if (!fs.existsSync("./content")) {
  fs.mkdirSync("./content");
}

function generateContent(item) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${item.keyword}</title>
  <meta name="description" content="Detailed guide about ${item.keyword}">

  <link rel="canonical" href="https://latesthackernews.github.io/content/${item.slug}.html">
</head>

<body>

<a href="/">Home</a>

<h1>${item.keyword}</h1>

<p>
This page is part of the <b>${item.cluster}</b> cluster. It is generated for SEO indexing and structured topic coverage.
</p>

<h2>What is ${item.keyword}?</h2>
<p>
${item.keyword} is a concept in the SEO/content system. This page exists to provide structured information, internal linking context, and indexable content for search engines.
</p>

<h2>Key Points</h2>
<ul>
  <li>Structured SEO page</li>
  <li>Part of cluster-based architecture</li>
  <li>Internal linking enabled</li>
  <li>Indexable HTML content</li>
</ul>

<h2>Related Pages</h2>
<p>
Visit other pages in the same system for deeper coverage of this topic cluster.
</p>

</body>
</html>
`;
}

keywords.forEach(item => {
  const html = generateContent(item);

  // SAFETY CHECK (prevents empty pages)
  if (!html || html.length < 500) {
    console.log("SKIPPED (too short):", item.slug);
    return;
  }

  fs.writeFileSync(`./content/${item.slug}.html`, html);
  console.log("Generated:", item.slug);
});
