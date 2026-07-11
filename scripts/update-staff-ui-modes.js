const fs = require('fs');
const file = 'app/components/Tabs/Staff.js';
let content = fs.readFileSync(file, 'utf8');

const oldSelect = `<select name="systemType" required>
                    <option value="">{lang === 'ar' ? '-- نوع النظام --' : '-- System Type --'}</option>
                    <option value="separate">{lang === 'ar' ? 'منفصل (رجالي/حريمي)' : 'Separate (Men/Women)'}</option>
                    <option value="mix">{lang === 'ar' ? 'مختلط (Mixed)' : 'Mixed'}</option>
                </select>`;

const newSelect = `<select name="systemType" required>
                    <option value="">{lang === 'ar' ? '-- صلاحية الوصول للأنظمة --' : '-- System Access --'}</option>
                    <option value="men">{lang === 'ar' ? '♂️ نظام الرجال فقط' : '♂️ Men System Only'}</option>
                    <option value="women">{lang === 'ar' ? '♀️ نظام السيدات فقط' : '♀️ Women System Only'}</option>
                    <option value="mix">{lang === 'ar' ? '⚡ نظام المختلط (Mixed)' : '⚡ Mixed System'}</option>
                    <option value="separate">{lang === 'ar' ? '🏢 كلاهما (رجالي + حريمي)' : '🏢 Both (Men + Women)'}</option>
                </select>`;

content = content.replace(oldSelect, newSelect);

// Update implementation of badge to handle men/women
const badgeLogic = `{s.systemType === 'mix' ? (lang === 'ar' ? '⚡ مختلط' : '⚡ Mixed') : (lang === 'ar' ? '🏢 فرع منفصل' : '🏢 Separate Branch')}`;
const newBadgeLogic = `{s.systemType === 'mix' ? (lang === 'ar' ? '⚡ مختلط' : '⚡ Mixed') : s.systemType === 'men' ? (lang === 'ar' ? '♂️ رجالي' : '♂️ Men') : s.systemType === 'women' ? (lang === 'ar' ? '♀️ نسائي' : '♀️ Women') : (lang === 'ar' ? '🏢 كلاهما' : '🏢 Both')}`;

content = content.replace(badgeLogic, newBadgeLogic);

fs.writeFileSync(file, content);
console.log("Updated Staff UI with specific system access options.");
