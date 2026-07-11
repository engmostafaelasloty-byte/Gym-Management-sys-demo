const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const regex = /\/\* ==================== New Glassmorphism GMS Logo ====================\*\/[\s\S]*?\/\* ====================================================================\*\//;

const updatedCSS = `/* ==================== New Glassmorphism GMS Logo ====================*/
.gms-logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 20px 45px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.08); /* Brighter base */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3), inset 0 0 15px rgba(255, 255, 255, 0.05);
  margin-bottom: 25px;
  position: relative;
  overflow: hidden;
}

/* Light sweep effect across the container */
.gms-logo-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-25deg);
  animation: glassSweep 4s infinite;
}

@keyframes glassSweep {
  0% {
    left: -100%;
  }
  20% {
    left: 200%;
  }
  100% {
    left: 200%;
  }
}

.gms-logo-text {
  font-family: 'Anton', 'Inter', sans-serif;
  font-size: 64px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: 6px;
  margin-right: -6px;
  
  /* Bright white core with icy blue hints */
  background: linear-gradient(
    110deg,
    #ffffff 20%,
    #a8f0ff 40%,
    #ffffff 50%,
    #a8f0ff 60%,
    #ffffff 80%
  );
  background-size: 200% auto;
  color: #fff;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: lightSweep 3s linear infinite;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

@keyframes lightSweep {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}
/* ====================================================================*/`;

cssContent = cssContent.replace(regex, updatedCSS);
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log('CSS updated');
