const fs = require('fs');
const file = 'app/page.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('}         } catch (err) {', '        } catch (err) {');
fs.writeFileSync(file, content);
console.log("Fixed syntax error in handleLogin catch block.");
