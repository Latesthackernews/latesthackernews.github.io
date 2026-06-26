const fs = require("fs");

const base = JSON.parse(fs.readFileSync("./content/posts.json"));
const generated = JSON.parse(fs.readFileSync("./content/generated-posts.json"));

const merged = [...base, ...generated];

fs.writeFileSync(
  "./content/posts.json",
  JSON.stringify(merged, null, 2)
);

console.log("Posts merged!");
