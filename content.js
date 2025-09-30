// --- Gmail Apology Extension v1.2 ---
// Robust insertion using a floating panel + MutationObserver + safer selectors.

const adjectives = ["sincere", "deep", "genuine", "humble", "profound", "true"];
const adverbs    = ["sincerely", "deeply", "genuinely", "humbly", "profoundly", "truly"];

const templates = [
  "Please accept my {adj} apologies for the delay in getting back to you.",
  "I’m {adv} sorry it took me so long to respond.",
  "I apologize for the {adj} delay in replying — time has been tight on my end.",
  "Thanks for your patience, and my {adj} apologies for the late reply.",
  "I owe you a {adj} apology for not answering sooner.",
  "I’m {adv} sorry this response comes later than I intended.",
  "Please excuse my {adj} slow reply — things have been busier than usual.",
  "I want to {adv} apologize for the wait in hearing back from me.",
  "I regret the {adj} delay in my response and thank you for your understanding.",
  "I should have replied earlier, and I’m {adv} sorry for the lag.",
  "I’m {adv} sorry for the late reply — I appreciate your patience.",
  "Please forgive the {adj} hold-up in this note reaching you.",
  "I regret that it took me this long to reply and I’m {adv} sorry.",
  "My {adj} apologies for taking so much time to get back to you.",
  "I know I should have responded sooner, and I’m {adv} sorry.",
  "I’m {adv} sorry for the wait — your message deserved a quicker response.",
  "Please accept my {adj} apologies for the tardy reply.",
  "I’m {adv} sorry for the time it took me to reply.",
  "Please excuse my {adj} delay in answering your message.",
  "I feel {adv} regretful that it took me so long to get back to you.",
  "I’m {adv} sorry this response comes later than it should have.",
  "My {adj} apologies for the time gap before this reply.",
  "I’m {adv} sorry for the time I took to respond.",
  "I regret the {adj} lateness of this reply.",
  "Please accept my {adj} apologies for being slow to answer.",
  "I’m {adv} sorry for the delay and grateful for your patience.",
  "My {adj} apologies for not writing back more promptly.",
  "I know I should have replied earlier — I’m {adv} sorry for the delay."
];

function randChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function getRandomApology() {
  const template = randChoice(templates);
  if (template.includes("{adj}") {
    const adj = randChoice(adjectives;
    return template.replace("{adj}", adj);
  }
  else {
    const adv = randChoice(adverbs);
    return template.replace("{adv}", adv);
  }
}

// --- Compose body helpers ---
function getAllBodies() {
  // Multiple tolerant selectors; pick all contenteditable bodies that look like Gmail's editor.
  const sel = [
    'div[aria-label="Message Body"][contenteditable="true"]',
    'div[contenteditable="true"][aria-label*="Message Body"]',
    'div[contenteditable="true"][g_editable="true"]'
  ].join(',');
  return Array.from(document.querySelectorAll(sel)).filter(el => el.isContentEditable);
}

function getLatestBody() {
  const bodies = getAllBodies();
  return bodies.length ? bodies[bodies.length - 1] : null;
}

function waitForNewBody(prevCount, timeout = 10000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const bodies = getAllBodies();
      if (bodies.length > prevCount) return resolve(bodies[bodies.length - 1]);
      if (Date.now() - start > timeout) return resolve(getLatestBody());
      setTimeout(check, 120);
    };
    check();
  });
}

function prependApologyTo(box, text) {
  if (!box) return false;
  try {
    box.focus();
    const apologyHTML = `<p>${text}</p><br>`;
    // Insert at the top:
    box.insertAdjacentHTML("afterbegin", apologyHTML);
    return true;
  } catch (e) {
    console.warn("Failed to insert apology:", e);
    return false;
  }
}

// --- Gmail actions ---
async function composeWithApology() {
  // Click Gmail's Compose button, then insert.
  const bodiesBefore = getAllBodies().length;
  const composeBtn = document.querySelector('div[gh="cm"], div[role="button"][gh="cm"]');
  if (composeBtn) composeBtn.click();
  const box = await waitForNewBody(bodiesBefore);
  const apology = getRandomApology();
  if (!prependApologyTo(box, apology)) {
    // Fallback: try again once shortly after.
    setTimeout(() => prependApologyTo(getLatestBody(), apology), 400);
  }
}

async function replyWithApology() {
  // Attempt to click a visible Reply button in thread view.
  const candidates = Array.from(document.querySelectorAll('[role="button"], [data-tooltip], [aria-label]'));
  const replyBtn = candidates.find(el => {
    const t = (el.getAttribute('data-tooltip') || el.getAttribute('aria-label') || '').toLowerCase();
    // Match common "Reply" tooltips/labels
    return t.startsWith('reply') && el.offsetParent !== null;
  });
  const bodiesBefore = getAllBodies().length;
  if (replyBtn) replyBtn.click();
  const box = await waitForNewBody(bodiesBefore);
  const apology = getRandomApology();
  if (!prependApologyTo(box, apology)) {
    setTimeout(() => prependApologyTo(getLatestBody(), apology), 400);
  }
}

// --- Floating panel UI ---
function ensurePanel() {
  if (document.getElementById('apology-floating-panel')) return;
  const panel = document.createElement('div');
  panel.id = 'apology-floating-panel';
  Object.assign(panel.style, {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
    zIndex: 2147483647,
    background: 'white',
    border: '1px solid #dadce0',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    padding: '8px',
    fontFamily: 'Arial, sans-serif'
  });

  const btn = (label, onClick) => {
    const b = document.createElement('button');
    b.textContent = label;
    Object.assign(b.style, {
      margin: '4px',
      padding: '6px 10px',
      borderRadius: '8px',
      border: '1px solid #dadce0',
      cursor: 'pointer',
      background: '#f8f9fa'
    });
    b.addEventListener('click', onClick);
    return b;
  };

  panel.appendChild(btn('Compose w/ Apology', composeWithApology));
  panel.appendChild(btn('Reply w/ Apology', replyWithApology));

  const small = document.createElement('div');
  small.textContent = 'Apology tools';
  small.style.fontSize = '11px';
  small.style.color = '#5f6368';
  small.style.marginTop = '4px';
  small.style.textAlign = 'center';
  panel.appendChild(small);

  document.body.appendChild(panel);
}

function setup() {
  ensurePanel();
  // Re-ensure panel after navigation or heavy DOM changes.
  const mo = new MutationObserver(() => ensurePanel());
  mo.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}

