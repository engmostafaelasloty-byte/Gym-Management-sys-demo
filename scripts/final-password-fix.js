const fs = require('fs');
const file = 'app/page.js';
let content = fs.readFileSync(file, 'utf8');

const buggyInput = `<input
                                id="loginPassword"
                                type="password" autoComplete="new-password"
                                style={{ marginBottom: 0 }}
                            />`;

const fixedInput = `<input
                                type="password"
                                id="loginPassword"
                                placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'} title={lang === 'ar' ? 'أدخل كلمة مرور حسابك' : 'Enter your account password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                                style={{ marginBottom: 0 }}
                            />`;

content = content.replace(buggyInput, fixedInput);
fs.writeFileSync(file, content);
console.log("Properly restored password input attributes in page.js");
