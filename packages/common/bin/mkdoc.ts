#!/usr/bin/env tsx

async function main(snapshot = process.argv.slice(2)[0]) {
  console.log("loading '%s'", snapshot);
  const resp = await import(snapshot);
  //@ts-ignore
  const test = resp.default as Record<string, string>;
  let prev = "";
  let md = "# Examples\n\n";
  let i = 0;

  for (const [key, value] of Object.entries(test)) {
    const title = key.replace(/examples > (.+?) \d{1,}$/, "$1");
    if (prev !== title) {
      md += `\n## ${title}
${value.trim()}

`;
      prev = title;
      i++;
    } else if (i == 1) {
      md += `
 **schema.tsp**     
 \`\`\`tsp
import "@skibididrizz/drizzle";

using Drizzle;

${value}            
 \`\`\`
`;
      i++;
    } else {
      md += `\nGenerates **schema.ts**\n\n\`\`\`tsx
${value}            
\`\`\`\n
`;
      i = 0;
    }
  }
  return md;
}
main().then(console.log, console.error);
