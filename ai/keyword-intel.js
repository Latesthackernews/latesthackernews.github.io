const fs = require("fs");

const keywords = JSON.parse(fs.readFileSync("./data/keywords.json", "utf8"));

function buildClusters(data) {
  const clusters = {};

  data.forEach(item => {
    if (!clusters[item.cluster]) {
      clusters[item.cluster] = [];
    }
    clusters[item.cluster].push(item);
  });

  return clusters;
}

function suggestExpansions(keyword) {
  return [
    `${keyword} guide`,
    `${keyword} tutorial`,
    `best ${keyword}`,
    `${keyword} strategy`,
    `${keyword} examples`
  ];
}

function run() {
  const clusters = buildClusters(keywords);

  const output = {
    totalKeywords: keywords.length,
    clusters: Object.keys(clusters),
    clusterData: clusters,
    expansions: {}
  };

  keywords.forEach(k => {
    output.expansions[k.keyword] = suggestExpansions(k.keyword);
  });

  fs.writeFileSync(
    "./data/keyword-report.json",
    JSON.stringify(output, null, 2)
  );

  console.log("Keyword intelligence generated");
}

run();
