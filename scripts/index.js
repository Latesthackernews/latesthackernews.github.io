const fs = require("fs");

const posts = JSON.parse(fs.readFileSync("./content/posts.json"));

let html = `
<h1>SEO Blog</h1>
<ul>
`;

posts.forEach(post => {
  html += `<li><a href="/blog/${post.slug}.html">${post.title}</a></li>`;
});

html += `</ul>`;

fs.writeFileSync("./blog/index.html", html);

console.log("Index generated!");
