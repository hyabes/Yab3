// HECTOR YABES
// yab3.dev

// Command -> page mapping
const routes = {
  resume: 'resume.html',
  sophia: 'sophia.html',
  monkey: 'monkey.html',
};

const commands = new Set(Object.keys(routes));

const input = document.getElementById('key');
const debugSign = document.getElementById('debug-sign');

let debugMode = false;
let resetTimerId = null;

// ---- Dot helpers ----
function hideDebugSign() {
  debugSign.className = 'debug-sign'; // hidden by CSS
}

function showDebugSign(state) {
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

input.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;

  const value = input.value.trim().toLowerCase();

  // Always clear + refocus
  input.value = '';
  input.focus();

  if (!value) return;

  // Toggle debug mode (not a command)
  if (value === 'debug') {
    debugMode = !debugMode;

    if (debugMode) {
      setNeutral(); // grey dot visible
    } else {
      clearTimeout(resetTimerId);
      hideDebugSign();
    }
    return;
  }

  // VALID COMMAND
  if (commands.has(value)) {
    // Diagnostic-only flash
    flash('valid');

    // Always navigate (flash may or may not be visible)
    const target = routes[value];
    setTimeout(() => {
      window.location.href = target;
    }, debugMode ? 250 : 0);

    return;
  }

  // INVALID COMMAND
  flash('invalid');
});
