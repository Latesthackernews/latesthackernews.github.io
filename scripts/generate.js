const fs = require("fs");

const posts = JSON.parse(fs.readFileSync("./content/posts.json", "utf8"));

const template = fs.readFileSync("./blog/template.html", "utf8");

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
