const fs = require('fs');
const file = 'app/components/Tabs/Staff.js';
let content = fs.readFileSync(file, 'utf8');

const roleBadgeEnd = `</span>
                                    </td>`;

const roleBadgeNew = `</span>
                                        <div style={{ fontSize: 10, opacity: 0.5, marginTop: 4, fontWeight: 500 }}>
                                            {s.systemType === 'mix' ? (lang === 'ar' ? '⚡ مختلط' : '⚡ Mixed') : (lang === 'ar' ? '🏢 فرع منفصل' : '🏢 Separate Branch')}
                                        </div>
                                    </td>`;

content = content.replace(roleBadgeEnd, roleBadgeNew);
fs.writeFileSync(file, content);
console.log("Added system type badge to staff list.");
