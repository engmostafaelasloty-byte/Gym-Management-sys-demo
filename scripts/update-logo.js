const fs = require('fs');
const path = require('path');

// 1. Update page.js
const pagePath = path.join(__dirname, '..', 'app', 'page.js');
let pageContent = fs.readFileSync(pagePath, 'utf8');

pageContent = pageContent.replace(
    '<div className="auth-logo-icon">🏋️</div>',
    '<div className="gms-logo-container"><div className="gms-logo-text">GMS</div></div>'
);

fs.writeFileSync(pagePath, pageContent, 'utf8');

// 2. Add CSS to globals.css
const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const newCSS = `

/* ==================== New Glassmorphism GMS Logo ====================*/
.gms-logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 15px 40px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(14, 230, 183, 0.05);
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.gms-logo-text {
  font-family: 'Anton', 'Inter', sans-serif;
  font-size: 58px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: 5px;
  margin-right: -5px; /* adjust for tracking */
  
  /* Glowing sweep effect */
  background: linear-gradient(
    120deg,
    rgba(255,255,255, 0.6) 20%,
    rgba(255,255,255, 0.6) 40%,
    #ffffff 45%,
    #ffffff 55%,
    rgba(255,255,255, 0.6) 60%,
    rgba(255,255,255, 0.6) 80%
  );
  background-size: 200% auto;
  color: #fff;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: lightSweep 3s linear infinite;
  text-shadow: 0 0 20px rgba(14, 230, 183, 0.2);
}

@keyframes lightSweep {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}
/* ====================================================================*/
`;

// Append to the end or before a specific marker. We can just append to the end.
if (!cssContent.includes('.gms-logo-container')) {
    cssContent += newCSS;
    fs.writeFileSync(cssPath, cssContent, 'utf8');
}

console.log('Logo and CSS updated successfully.');
