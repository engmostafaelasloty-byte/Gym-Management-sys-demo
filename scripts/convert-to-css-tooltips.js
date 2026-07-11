const fs = require('fs');
const path = require('path');

// Convert title={...} attributes on inputs/selects to parent wrapper with data-tooltip
// Pattern: anything that has title={lang === 'ar' ? 'X' : 'Y'}
// This wraps the entire tag in <span className="tooltip-field" data-tooltip={...}>...</span>

const tabFiles = [
    'Expenses.js', 'Classes.js', 'Staff.js', 'Goods.js', 'Payments.js',
    'Attendance.js', 'Settings.js', 'StockDashboard.js', 'Measurements.js', 'Equipment.js'
];

let totalConverted = 0;

for (const fileName of tabFiles) {
    const filePath = path.join(__dirname, '..', 'app', 'components', 'Tabs', fileName);
    let content = fs.readFileSync(filePath, 'utf8');
    let count = 0;

    // Match: title={lang === 'ar' ? 'ARABIC_TIP' : 'ENGLISH_TIP'}
    // We need to find the <input or <select that contains this, remove the title, 
    // and wrap with tooltip-field div

    // Strategy: Find each title={...} and transform the line
    const titleRegex = / title=\{lang === 'ar' \? '([^']+)' : '([^']+)'\}/g;

    // First, collect all title attributes
    const matches = [];
    let m;
    while ((m = titleRegex.exec(content)) !== null) {
        matches.push({
            fullMatch: m[0],
            arTip: m[1],
            enTip: m[2],
            index: m.index
        });
    }

    // Process in reverse to maintain indices
    for (const match of matches.reverse()) {
        // Get the line containing this title attribute
        const lineStart = content.lastIndexOf('\n', match.index) + 1;
        const lineEnd = content.indexOf('\n', match.index + match.fullMatch.length);
        const line = content.substring(lineStart, lineEnd === -1 ? content.length : lineEnd);
        const trimmedLine = line.trimStart();
        const indent = line.substring(0, line.length - trimmedLine.length);

        // Check if this line is already inside a tooltip-field
        const prevLines = content.substring(Math.max(0, lineStart - 200), lineStart);
        if (prevLines.includes('tooltip-field')) continue;

        // Remove the title attribute from the line
        const cleanedLine = line.replace(match.fullMatch, '');
        
        // Self-closing tag? wrap with div
        const isSelfClosing = cleanedLine.trimEnd().endsWith('/>');
        const isOpenTag = !isSelfClosing;

        // Create the tooltip data attribute
        const tooltipAttr = `{lang === 'ar' ? '${match.arTip}' : '${match.enTip}'}`;

        let newLine;
        if (isSelfClosing) {
            newLine = `${indent}<div className="tooltip-field" data-tooltip=${tooltipAttr}>${cleanedLine.trim()}</div>`;
        } else {
            // Just add the title back, we can't easily wrap multi-line tags
            // Instead, convert title to data-tooltip on the nearest wrapping element
            newLine = line; // keep as-is if we can't wrap
            continue;
        }

        content = content.substring(0, lineStart) + newLine + content.substring(lineEnd === -1 ? content.length : lineEnd);
        count++;
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`${fileName}: ${count} fields converted to CSS tooltips`);
    totalConverted += count;
}

// Also handle page.js login form
{
    const filePath = path.join(__dirname, '..', 'app', 'page.js');
    let content = fs.readFileSync(filePath, 'utf8');
    let count = 0;
    
    // These were added as separate lines by v2 script
    // Find patterns: placeholder={...}\n                                title={...}
    const regex = /(placeholder=\{lang === 'ar' \? '[^']+' : '[^']+'\})\n\s+title=\{lang === 'ar' \? '([^']+)' : '([^']+)'\}/g;
    let mm;
    while ((mm = regex.exec(content)) !== null) {
        // Just keep as title= for login (not wrappable easily)
        // Convert the title to inline
    }
    
    console.log(`page.js: ${count} fields converted`);
    totalConverted += count;
}

console.log(`\n✅ Converted ${totalConverted} fields to CSS tooltips`);
