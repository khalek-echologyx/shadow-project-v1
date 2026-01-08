const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'websites/tesco-mobile/pdp-page-changing/variation-A/index.js');

function syncLogs() {
  if (!fs.existsSync(targetFile)) {
    console.error(`File not found: ${targetFile}`);
    return;
  }

  let content = fs.readFileSync(targetFile, 'utf8');
  let lines = content.split('\n');
  let modified = false;

  const newLines = lines.map((line, index) => {
    const lineNumber = index + 1;
    // Regex to match console.log(...)
    // It looks for console.log( and tries to identify if a line number string is already there
    const logRegex = /console\.log\((.*)\)/;
    const match = line.match(logRegex);

    if (match) {
      const fullMatch = match[0];
      const args = match[1].trim();
      
      // Check if it already ends with a line number string like "123"
      const lineNumStrRegex = /,\s*["'](\d+)["']\s*$/;
      const hasLineNum = args.match(lineNumStrRegex);

      if (hasLineNum) {
        // If it has a line number but it's WRONG, update it
        if (hasLineNum[1] !== lineNumber.toString()) {
          const newArgs = args.replace(lineNumStrRegex, `, "${lineNumber}"`);
          const newLine = line.replace(fullMatch, `console.log(${newArgs})`);
          if (line !== newLine) {
            modified = true;
            return newLine;
          }
        }
      } else {
        // If it doesn't have a line number string, add it
        // Handle empty console.log() vs console.log(something)
        const newArgs = args === "" ? `"${lineNumber}"` : `${args}, "${lineNumber}"`;
        const newLine = line.replace(fullMatch, `console.log(${newArgs})`);
        modified = true;
        return newLine;
      }
    }
    return line;
  });

  if (modified) {
    fs.writeFileSync(targetFile, newLines.join('\n'), 'utf8');
    console.log(`Successfully updated console.log line numbers in ${targetFile}`);
  } else {
    console.log('No updates needed.');
  }
}

syncLogs();
