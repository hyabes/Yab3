// HECTOR YABES
// yab3.dev

// --------------------
// ROUTES / COMMANDS
// --------------------
const routes = {
  resume: 'resume.html',
  sophia: 'sophia.html',
  monkey: 'monkey.html',
  help: 'help.txt',
  grod: 'https://www.youtube.com/watch?v=ruPeRyCOBpY&list=PLcYVWcYmaW2I0D37-MMFEqjKyFUma30qo',
};

// --------------------
// ELEMENTS
// --------------------
const input = document.getElementById('key');
const debugSign = document.getElementById('debug-sign');
const logo = document.getElementById('logo');

// --------------------
// DEBUG SIGN STATE
// --------------------
let debugMode = false;
let resetTimerId = null;

function hideDebugSign() {
  debugSign.className = 'debug-sign';
}

function showDebugSign(state) {
  // state: neutral | valid | invalid
  debugSign.className = 'debug-sign ' + state;
}

function setNeutral() {
  if (debugMode) showDebugSign('neutral');
}

function flash(state, ms = 200) {
  if (!debugMode) return;

  showDebugSign(state);

  clearTimeout(resetTimerId);
  resetTimerId = setTimeout(() => {
    setNeutral();
  }, ms);
}

// Start hidden
hideDebugSign();

// --------------------
// INPUT WOBBLE
// --------------------
function wobbleInput() {
  input.classList.remove('wobble-hor-bottom');
  void input.offsetWidth; // force reflow
  input.classList.add('wobble-hor-bottom');

  setTimeout(() => {
    input.classList.remove('wobble-hor-bottom');
  }, 800); // matches CSS animation duration
}

// --------------------
// COMMAND HANDLER
// --------------------
input.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;

  const value = input.value.trim().toLowerCase();

  // Always clear + refocus
  input.value = '';
  input.focus();

  if (!value) return;

  // 1) CONTROL: debug toggle
  if (value === 'debug') {
    debugMode = !debugMode;

    if (debugMode) {
      setNeutral();
    } else {
      clearTimeout(resetTimerId);
      hideDebugSign();
    }
    return;
  }

  // 2) COMMAND: route lookup
  const target = routes[value];

  if (target) {
    flash('valid');

    setTimeout(() => {
      if (value === 'help') {
        // small tool window
        window.open(
          target,
          'helpWindow',
          'width=420,height=320,resizable=yes,scrollbars=yes'
        );
      } else if (value === 'grod') {
        // external link in new tab
        window.open(target, '_blank');
      } else {
        // normal navigation
        window.location.href = target;
      }
    }, debugMode ? 250 : 0);

    return;
  }

  // 3) INVALID COMMAND
  flash('invalid');
  wobbleInput();
});

// --------------------
// VHS / DVD LOGO BOUNCE
// --------------------
let x;
let y;

function randomVelocity(min = 0.8, max = 1.8) {
  const speed = Math.random() * (max - min) + min;
  return Math.random() < 0.5 ? speed : -speed;
}

let dx = randomVelocity();
let dy = randomVelocity();

function initLogoPosition() {
  const inputRect = input.getBoundingClientRect();
  const logoRect = logo.getBoundingClientRect();

  // Start centered above the input
  x = inputRect.left + inputRect.width / 2 - logoRect.width / 2;
  y = inputRect.top - logoRect.height - 12;

  logo.style.left = `${x}px`;
  logo.style.top = `${y}px`;
}

function moveLogo() {
  const logoRect = logo.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  x += dx;
  y += dy;

  // bounce off edges
  if (x <= 0 || x + logoRect.width >= vw) dx *= -1;
  if (y <= 0 || y + logoRect.height >= vh) dy *= -1;

  logo.style.left = `${x}px`;
  logo.style.top = `${y}px`;

  requestAnimationFrame(moveLogo);
}

// Initialize logo immediately (static)
initLogoPosition();

// ⏱️ Wait 1 minute before starting motion
setTimeout(() => {
  moveLogo();
}, 60000);

// Re-center on resize (does not restart motion timer)
window.addEventListener('resize', initLogoPosition);
