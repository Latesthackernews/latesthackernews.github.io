const fs = require("fs");

const posts = JSON.parse(
  fs.readFileSync("./content/posts.json", "utf8")
);

let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>SEO Blog | Latest Hacker News</title>

<meta name="description" content="Latest SEO articles, digital marketing guides, and optimization tutorials.">

<link rel="canonical" href="https://latesthackernews.github.io/blog/">

<style>
body {
  font-family: Arial, sans-serif;
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  line-height: 1.7;
}

h1 {
  margin-bottom: 30px;
}

.article {
  border-bottom: 1px solid #ddd;
  padding: 20px 0;
}

.article h2 {
  margin-bottom: 10px;
}

.article a {
  text-decoration: none;
}

.article p {
  color: #555;
}
</style>
</head>

<body>

<h1>SEO Blog</h1>

<p>Explore our latest SEO guides, tutorials, and digital marketing resources.</p>
`;

posts.forEach(post => {
  html += `
<div class="article">
  <h2>
    <a href="/blog/${post.slug}.html">
      ${post.title}
    </a>
  </h2>

  <p>${post.description}</p>

  <p>
    <a href="/blog/${post.slug}.html">
      Read Article →
    </a>
  </p>
</div>
`;
});

html += `
</body>
</html>
`;

fs.writeFileSync("./blog/index.html", html, "utf8");

console.log("Blog index generated successfully.");
