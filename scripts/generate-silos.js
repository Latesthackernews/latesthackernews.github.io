const fs = require("fs");

const posts = JSON.parse(
  fs.readFileSync("./content/posts.json", "utf8")
);

/* =========================
   GROUP POSTS BY CATEGORY
========================= */
const categories = {};

for (const post of posts) {

  const cat = post.category || "blog";

  if (!categories[cat]) {
    categories[cat] = [];
  }

  categories[cat].push(post);
}

/* =========================
   CREATE SILO PAGES
========================= */
for (const cat in categories) {

  const items = categories[cat];

  let html = `
<!DOCTYPE html>
<html>
<head>
  <title>${cat.toUpperCase()} Articles</title>
  <meta name="description" content="Best ${cat} articles">
  <link rel="stylesheet" href="/css/style.css">
</head>

<body>

<h1>${cat.toUpperCase()} Hub</h1>

<p>All articles in the ${cat} category.</p>

<ul>
`;

  for (const post of items) {
    html += `
      <li>
        <a href="/blog/${post.slug}.html">
          ${post.title}
        </a>
      </li>
    `;
  }

  html += `
</ul>

</body>
</html>
`;

  fs.writeFileSync(
    `./${cat}.html`,
    html,
    "utf8"
  );

  console.log("Silo created:", cat);
}
