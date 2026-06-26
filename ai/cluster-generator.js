const fs = require("fs");

const keywords = JSON.parse(fs.readFileSync("./data/keywords.json", "utf8"));

function groupByCluster(data) {
  const clusters = {};

  data.forEach(item => {
    if (!clusters[item.cluster]) {
      clusters[item.cluster] = [];
    }
    clusters[item.cluster].push(item);
  });

  return clusters;
}

function generateHTML(item, clusterItems) {
  const relatedLinks = clusterItems
    .filter(i => i.slug !== item.slug)
    .map(i => `<li><a href="/content/${i.slug}.html">${i.keyword}</a></li>`)
    .join("\n");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${item.keyword}</title>
  <meta name="description" content="${item.keyword} explained in detail">

  <link rel="canonical" href="https://latesthackernews.github.io/content/${item.slug}.html">

  <link rel="stylesheet" href="/css/style.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${item.keyword}"
  }
  </script>
</head>

<body>

<a href="/">← Home</a>

<h1>${item.keyword}</h1>

<p>This article is part of the <strong>${item.cluster}</strong> cluster.</p>

<h2>Overview</h2>
<p>
This page explains ${item.keyword} in a structured SEO format designed for indexing and topic relevance.
</p>

<h2>Key Points</h2>
<ul>
  <li>Structured content improves search visibility</li>
  <li>Cluster-based SEO builds authority</li>
  <li>Internal linking strengthens ranking signals</li>
</ul>

<h2>Related Articles in This Cluster</h2>
<ul>
${relatedLinks}
</ul>

<p><a href="/blog/">← Back to Blog</a></p>

</body>
</html>
`;
}

function run() {
  const clusters = groupByCluster(keywords);

  if (!fs.existsSync("./content")) {
    fs.mkdirSync("./content");
  }

  Object.keys(clusters).forEach(clusterName => {
    const clusterItems = clusters[clusterName];

    clusterItems.forEach(item => {
      const html = generateHTML(item, clusterItems);

      fs.writeFileSync(`./content/${item.slug}.html`, html);

      console.log(`Generated: ${item.slug} (${clusterName})`);
    });
  });
}

run();
