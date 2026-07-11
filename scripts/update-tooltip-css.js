const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'globals.css');
let content = fs.readFileSync(filePath, 'utf8');

const marker = '/* ==================== Tooltip Animations ====================*/';
const idx = content.indexOf(marker);

if (idx >= 0) {
    content = content.substring(0, idx);
}

content += `/* ==================== Tooltip System ====================*/
.tooltip-field {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.tooltip-field[data-tooltip]:hover::after,
.tooltip-field[data-tooltip]:focus-within::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #0b5a75, #0e8aad);
  color: #fff;
  font-size: 11.5px;
  font-weight: 500;
  line-height: 1.5;
  padding: 7px 12px;
  border-radius: 8px;
  max-width: 280px;
  white-space: normal;
  text-align: center;
  z-index: 9999;
  pointer-events: none;
  box-shadow: 0 6px 20px rgba(0,0,0,0.4);
  animation: tooltipIn 0.2s ease-out;
}
.tooltip-field[data-tooltip]:hover::before,
.tooltip-field[data-tooltip]:focus-within::before {
  content: '';
  position: absolute;
  bottom: calc(100% + 2px);
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #0b5a75;
  z-index: 9999;
  pointer-events: none;
  animation: tooltipIn 0.2s ease-out;
}
@keyframes tooltipIn {
  from { opacity: 0; transform: translateX(-50%) translateY(4px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
.form-group { display: flex; flex-direction: column; gap: 3px; }
.field-label { display: flex; align-items: center; gap: 5px; font-size: 12px; opacity: 0.55; margin-bottom: 4px; }
`;

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done! Tooltip CSS updated.');
