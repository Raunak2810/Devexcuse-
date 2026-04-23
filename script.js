const EXCUSES = {
  git: [
    { text: "Bhai, <em>git merge conflict</em> tha — ek branch alag, dusra colleague timeout pe.", bs: 62 },
    { text: "Main push karne wala tha lekin <em>force push</em> se uski poori history ud gayi.", bs: 78 },
    { text: "<em>Rebase</em> karte waqt commit messages gaayab ho gaye. History rewrite ho gayi — apne aap.", bs: 85 },
    { text: "Merge toh hua lekin <em>squash nahi kiya</em> — 247 commits ek saath aaye. Koi kya padhe?", bs: 55 },
  ],
  prod: [
    { text: "Production mein <em>memory leak</em> tha. Server ne khud restart maanga. Main kya karoonga?", bs: 70 },
    { text: "Woh feature <em>staging pe bilkul theek tha</em>. Prod ka environment hi alag hai bhai.", bs: 91 },
    { text: "Deploying tha aur <em>load balancer ne roundrobin miss kar diya</em>. Ops ki zimmedari hai.", bs: 88 },
    { text: "Cache invalidate nahi hua. <em>CDN ki galti hai</em> — main bol raha tha clear karo.", bs: 74 },
  ],
  ai: [
    { text: "<em>ChatGPT ne yeh code suggest kiya tha</em>. Mujhe kya pata tha ki hallucinate karega?", bs: 80 },
    { text: "AI-generated code tha. <em>Model ka context window bhar gaya tha</em> — uski galti hai.", bs: 83 },
    { text: "Copilot ne <em>tab autocomplete kiya</em> aur maine accept kar diya. Aankhein toh hoti hain.", bs: 77 },
    { text: "Maine AI se optimize karwaya lekin <em>'production-safe' likhna bhool gaya</em> prompt mein.", bs: 69 },
  ],
  boss: [
    { text: "Sir aapne khud bola tha <em>'jaldi release karo'</em>. Testing ke liye time kahan tha?", bs: 95 },
    { text: "Requirement itni baar change hui ki <em>mera brain RAM hi full ho gaya</em> sab store karte karte.", bs: 88 },
    { text: "Sprint mein yeh task <em>2 story points mein estimate hua tha</em>. Technical debt kaun bharta hai?", bs: 72 },
    { text: "Standup mein sab okay tha. <em>QA ne last minute pe bug dhundha</em> — planning ki failure hai.", bs: 65 },
  ],
  infra: [
    { text: "Bhai <em>Jio down tha</em>. Main API test karta toh kaise? Bandwidth tha hi nahi.", bs: 58 },
    { text: "SSH tunnel drop ho gaya <em>mid-deployment pe</em>. Server hung. Network ki galti — meri nahi.", bs: 76 },
    { text: "AWS us-east-1 pe <em>partial outage tha</em>. Status page dekho — mera koi kasoor nahi.", bs: 60 },
    { text: "Docker image pull nahi ho rahi thi. <em>Registry rate limit hit ho gaya</em>. DevOps se baat karo.", bs: 71 },
  ],
  env: [
    { text: "Mere machine pe <em>Node v18 tha lekin server pe v16</em>. Koi batata kyun nahi yeh cheezein?", bs: 67 },
    { text: "Bhai .env file <em>gitignore mein tha hi nahi</em>. Yeh onboarding ka issue hai.", bs: 82 },
    { text: "Docker compose mein <em>volume mismatch tha</em>. Local alag behave karta hai — sab jaante hain.", bs: 74 },
    { text: "Windows pe develop kiya, Linux pe deploy kiya. <em>CRLF vs LF</em> — OS ki problem hai.", bs: 78 },
  ],
};
EXCUSES.all = Object.values(EXCUSES).flat();
let currentCat = 'all';
let lastExcuse = null;
let history = [];
document.getElementById('categories').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  currentCat = chip.dataset.cat;
});
function generate() {
  const pool = EXCUSES[currentCat] || EXCUSES.all;
  let pick;
  let tries = 0;
  do { pick = pool[Math.floor(Math.random() * pool.length)]; tries++; }
  while (pick === lastExcuse && tries < 10);
  lastExcuse = pick;
  const textEl = document.getElementById('excuseText');
  const bar    = document.getElementById('bsBar');
  const pct    = document.getElementById('bsPct');
  const card   = document.getElementById('excuseCard');
  textEl.classList.add('fade');
  bar.style.width = '0%';
  pct.textContent = '–';
  setTimeout(() => {
    textEl.innerHTML = pick.text;
    textEl.classList.remove('fade');
    setTimeout(() => { bar.style.width = pick.bs + '%'; pct.textContent = pick.bs + '%'; }, 80);
  }, 200);
  card.classList.remove('shake');
  void card.offsetWidth;
  card.classList.add('shake');
  addHistory(pick.text.replace(/<[^>]+>/g, ''));
}
function addHistory(text) {
  history.unshift(text);
  if (history.length > 5) history.pop();
  document.getElementById('historyList').innerHTML =
    history.map(h => `<div class="hist-item"><span class="dot"></span>${h}</div>`).join('');
}
function copyIt() {
  if (!lastExcuse) return toast('// Pehle generate toh karo!');
  navigator.clipboard.writeText(lastExcuse.text.replace(/<[^>]+>/g, ''))
    .then(() => toast('// COPIED ✓'))
    .catch(() => toast('// Copy failed'));
}
function shareIt() {
  if (!lastExcuse) return toast('// Pehle generate toh karo!');
  const msg = encodeURIComponent(`Aaj ka developer excuse:\n\n"${lastExcuse.text.replace(/<[^>]+>/g, '')}"\n\n— DevExcuse.exe`);
  window.open('https://wa.me/?text=' + msg, '_blank');
}
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2400);
}
document.addEventListener('keydown', e => {
  if (e.code === 'Space' && e.target.tagName !== 'BUTTON') { e.preventDefault(); generate(); }
});
