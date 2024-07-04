#!/usr/bin/env tsx

async function main() {
  const resp = await import("../test/examples.test.snapshot.cjs");
  //@ts-ignore
  const test = resp.default as Record<string, string>;
  let prev = "";
  let md = "# Examples\n\n";
  for (const [key, value] of Object.entries(test)) {
    const title = key.replace(/examples > (.+?) \d{1,}$/, "$1");
    if (prev !== title) {
      md += `\n## ${title}\n\n
  \`\`\`tsp
  ${value}            
  \`\`\`
  `;
      prev = title;
    } else {
      md += `\nGenerates\n\n\`\`\`tsx
  ${value}            
  \`\`\`\n`;
    }
  }
  return md;
}
main().then(console.log, console.error);
