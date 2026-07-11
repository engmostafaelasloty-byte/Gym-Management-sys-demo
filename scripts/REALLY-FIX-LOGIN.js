const fs = require('fs');
const file = 'app/page.js';
let content = fs.readFileSync(file, 'utf8');

const buggyPasswordBlock = `                        {/* 3. Password */}
                        <div className="input-group" style={{ marginBottom: 18 }}>
                            <span className="input-group-icon">🔒</span>
                            <input
                                id="loginPassword"
                                type="password" autoComplete="new-password"
                                style={{ marginBottom: 0 }}
                            />
                        </div>`;

const fixedPasswordBlock = `                        {/* 3. Password */}
                        <div className="input-group" style={{ marginBottom: 18 }}>
                            <span className="input-group-icon">🔒</span>
                            <input
                                type="password"
                                id="loginPassword"
                                placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                style={{ marginBottom: 0 }}
                            />
                        </div>`;

if (content.includes(buggyPasswordBlock)) {
    content = content.replace(buggyPasswordBlock, fixedPasswordBlock);
    fs.writeFileSync(file, content);
    console.log("SUCCESS: Restored password input states and handlers.");
} else {
    // If exact match fails, try a more generic replacement
    const regex = /<input\s+id="loginPassword"[\s\S]*?\/>/;
    const fixedInput = `<input
                                type="password"
                                id="loginPassword"
                                placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                style={{ marginBottom: 0 }}
                            />`;
    
    if (regex.test(content)) {
        content = content.replace(regex, fixedInput);
        fs.writeFileSync(file, content);
        console.log("SUCCESS: Replaced password input using regex.");
    } else {
        console.log("ERROR: Could not find password input to fix.");
    }
}
