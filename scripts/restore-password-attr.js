const fs = require('fs');
const file = 'app/page.js';
let content = fs.readFileSync(file, 'utf8');

const buggyInput = `<input
                                id="loginPassword"
                                type="text" className="secure-input" autoComplete="new-password"
                                style={{ marginBottom: 0 }}
                            />`;

const fixedInput = `<input
                                type="text" className="secure-input" autoComplete="new-password"
                                id="loginPassword"
                                placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'} title={lang === 'ar' ? 'أدخل كلمة مرور حسابك' : 'Enter your account password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ marginBottom: 0 }}
                            />`;

content = content.replace(buggyInput, fixedInput);
fs.writeFileSync(file, content);
console.log("Restored missing attributes to password input");
