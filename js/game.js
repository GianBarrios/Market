'use strict';

// ─── Constants ───────────────────────────────────────────────────────────────
const MAP_URL       = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const RECRUIT_COST  = 50;
const RECRUIT_AMT   = 5;
const WIN_PCT       = 0.55;   // 55% of territories to win
const AI_PLAYERS    = 10;
const ADJ_TOLERANCE = 2.5;    // degrees for border detection

// ─── State ───────────────────────────────────────────────────────────────────
let canvas, ctx, pickCanvas, pickCtx;
let mapW, mapH;
let zoom = 1, panX = 0, panY = 0;
let isDragging = false, hasDragged = false, lastMX = 0, lastMY = 0;

const G = {
  features:   [],
  countries:  new Map(),   // id -> { id, name, playerId, armies, income }
  adjacency:  new Map(),   // id -> Set<id>
  players:    new Map(),   // playerId -> { id, color, gold, isHuman }
  playerPid:  0,
  myId:       null,        // player's country id
  selectedId: null,
  turn:       1,
  phase:      'loading',   // loading | select | player | ai | ended
  attackMode: false,
};

// ─── Boot ────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  canvas     = document.getElementById('canvas');
  ctx        = canvas.getContext('2d');
  pickCanvas = document.createElement('canvas');
  pickCtx    = pickCanvas.getContext('2d', { willReadFrequently: true });

  resizeCanvas();
  window.addEventListener('resize', () => { resizeCanvas(); renderMap(); });
  bindEvents();

  try {
    setProgress(5);
    const res   = await fetch(MAP_URL);
    const world = await res.json();
    setProgress(40);

    const geojson  = topojson.feature(world, world.objects.countries);
    G.features     = geojson.features.filter(f => f.id && COUNTRY_NAMES[f.id]);
    setProgress(65);

    computeAdjacency();
    setProgress(80);
    initCountries();
    setProgress(100);

    setTimeout(() => {
      document.getElementById('loading').style.display = 'none';
      showPhaseSelect();
    }, 400);
  } catch (e) {
    document.getElementById('load-msg').textContent =
      '⚠ Error al cargar el mapa. Comprueba tu conexión y recarga.';
    console.error(e);
  }
});

// ─── Canvas / Projection ─────────────────────────────────────────────────────
function resizeCanvas() {
  const wrap = document.getElementById('map-wrap');
  canvas.width = pickCanvas.width = mapW = wrap.clientWidth;
  canvas.height = pickCanvas.height = mapH = wrap.clientHeight;
}

function project(lon, lat) {
  const x   = ((lon + 180) / 360) * mapW;
  const rad = Math.max(-85.05, Math.min(85.05, lat)) * Math.PI / 180;
  const mer = Math.log(Math.tan(Math.PI / 4 + rad / 2));
  const y   = (0.5 - mer / (2 * Math.PI)) * mapH;
  return [x * zoom + panX, y * zoom + panY];
}

// ─── Rendering ───────────────────────────────────────────────────────────────
function drawGeometry(c, geo) {
  const polys = geo.type === 'Polygon'      ? [geo.coordinates]
              : geo.type === 'MultiPolygon' ? geo.coordinates : [];
  for (const poly of polys) {
    for (const ring of poly) {
      if (!ring.length) continue;
      const [sx, sy] = project(ring[0][0], ring[0][1]);
      c.moveTo(sx, sy);
      for (let i = 1; i < ring.length; i++) {
        const [x, y] = project(ring[i][0], ring[i][1]);
        c.lineTo(x, y);
      }
      c.closePath();
    }
  }
}

function countryDisplayColor(id) {
  const c = G.countries.get(id);
  if (!c) return '#2a2a2a';
  if (c.playerId === G.playerPid) {
    return id === G.selectedId ? '#2ecc71' : '#27ae60';
  }
  if (c.playerId === -1) {
    return id === G.selectedId ? '#888' : '#555';
  }
  const p = G.players.get(c.playerId);
  const base = p ? p.color : '#777';
  return id === G.selectedId ? lightenHex(base, 40) : base;
}

function lightenHex(hex, amt) {
  const parse = v => Math.min(255, parseInt(v, 16) + amt);
  return '#' + [hex.slice(1,3), hex.slice(3,5), hex.slice(5,7)]
    .map(v => parse(v).toString(16).padStart(2, '0')).join('');
}

function renderMap() {
  if (!ctx) return;

  // Ocean
  ctx.fillStyle = '#1a3a5c';
  ctx.fillRect(0, 0, mapW, mapH);

  // Countries
  for (const f of G.features) {
    ctx.beginPath();
    drawGeometry(ctx, f.geometry);
    ctx.fillStyle = countryDisplayColor(f.id);
    ctx.fill();
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 0.5 / zoom;
    ctx.stroke();
  }

  // Selected highlight
  if (G.selectedId) {
    const sf = G.features.find(f => f.id === G.selectedId);
    if (sf) {
      ctx.beginPath();
      drawGeometry(ctx, sf.geometry);
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 2 / zoom;
      ctx.stroke();
    }
  }

  // Adjacent targets in attack mode
  if (G.attackMode && G.selectedId) {
    const adj = G.adjacency.get(G.selectedId) || new Set();
    for (const tid of adj) {
      const tc = G.countries.get(tid);
      if (!tc || tc.playerId === G.playerPid) continue;
      const tf = G.features.find(f => f.id === tid);
      if (!tf) continue;
      ctx.beginPath();
      drawGeometry(ctx, tf.geometry);
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 2.5 / zoom;
      ctx.stroke();
    }
  }

  // Army labels
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const f of G.features) {
    const c = G.countries.get(f.id);
    if (!c) continue;
    const cen = centroid(f.geometry);
    if (!cen) continue;
    const [px, py] = project(cen[0], cen[1]);
    if (px < -20 || px > mapW + 20 || py < -20 || py > mapH + 20) continue;

    const sz = Math.max(9, Math.min(14, 10 * zoom));
    ctx.font = `bold ${sz}px sans-serif`;
    ctx.fillStyle = '#000';
    ctx.fillText(c.armies, px + 1, py + 1);
    ctx.fillStyle = '#fff';
    ctx.fillText(c.armies, px, py);
  }

  renderPickCanvas();
}

function renderPickCanvas() {
  pickCtx.clearRect(0, 0, mapW, mapH);
  for (const f of G.features) {
    const r = Math.floor(f.id / 256);
    const g = f.id % 256;
    pickCtx.beginPath();
    drawGeometry(pickCtx, f.geometry);
    pickCtx.fillStyle = `rgb(${r},${g},200)`;
    pickCtx.fill();
  }
}

function getIdAt(cx, cy) {
  const px = Math.round(cx), py = Math.round(cy);
  if (px < 0 || py < 0 || px >= mapW || py >= mapH) return null;
  const d = pickCtx.getImageData(px, py, 1, 1).data;
  if (d[2] !== 200) return null;
  const id = d[0] * 256 + d[1];
  return G.countries.has(id) ? id : null;
}

// ─── Geometry helpers ─────────────────────────────────────────────────────────
function centroid(geo) {
  let sx = 0, sy = 0, n = 0;
  const polys = geo.type === 'Polygon'      ? [geo.coordinates]
              : geo.type === 'MultiPolygon' ? geo.coordinates : [];
  for (const poly of polys) {
    for (const ring of poly) {
      for (const [x, y] of ring) { sx += x; sy += y; n++; }
    }
  }
  return n ? [sx / n, sy / n] : null;
}

function bbox(geo) {
  let x0=Infinity, y0=Infinity, x1=-Infinity, y1=-Infinity;
  const polys = geo.type === 'Polygon'      ? [geo.coordinates]
              : geo.type === 'MultiPolygon' ? geo.coordinates : [];
  for (const poly of polys) {
    for (const ring of poly) {
      for (const [x, y] of ring) {
        if (x < x0) x0=x; if (x > x1) x1=x;
        if (y < y0) y0=y; if (y > y1) y1=y;
      }
    }
  }
  return [x0, y0, x1, y1];
}

// ─── Adjacency ───────────────────────────────────────────────────────────────
function computeAdjacency() {
  G.adjacency.clear();
  const bboxes = new Map();
  for (const f of G.features) {
    G.adjacency.set(f.id, new Set());
    bboxes.set(f.id, bbox(f.geometry));
  }
  const T = ADJ_TOLERANCE;
  for (let i = 0; i < G.features.length; i++) {
    const a  = G.features[i];
    const ba = bboxes.get(a.id);
    for (let j = i + 1; j < G.features.length; j++) {
      const b  = G.features[j];
      const bb = bboxes.get(b.id);
      if (ba[0]-T <= bb[2] && ba[2]+T >= bb[0] &&
          ba[1]-T <= bb[3] && ba[3]+T >= bb[1]) {
        G.adjacency.get(a.id).add(b.id);
        G.adjacency.get(b.id).add(a.id);
      }
    }
  }
}

// ─── Init countries ──────────────────────────────────────────────────────────
function initCountries() {
  // Create player
  G.players.set(G.playerPid, { id: G.playerPid, color: '#27ae60', gold: 500, isHuman: true });

  // Create AI players
  for (let i = 1; i <= AI_PLAYERS; i++) {
    G.players.set(i, { id: i, color: PLAYER_COLORS[(i-1) % PLAYER_COLORS.length], gold: 200, isHuman: false });
  }

  // Shuffle features and give AI players starting territories
  const shuffled = [...G.features].sort(() => Math.random() - 0.5);
  let aiIdx = 1;
  let assigned = 0;
  const aiShare = Math.floor(shuffled.length * 0.55); // AI gets 55% of world initially

  for (const f of shuffled) {
    if (assigned >= aiShare) break;
    const pid = aiIdx;
    G.countries.set(f.id, {
      id: f.id,
      name: COUNTRY_NAMES[f.id],
      playerId: pid,
      armies: getStartingArmies(f.id),
      income: getIncome(f.id),
    });
    aiIdx = (aiIdx % AI_PLAYERS) + 1;
    assigned++;
  }

  // Remaining = neutral
  for (const f of G.features) {
    if (!G.countries.has(f.id)) {
      G.countries.set(f.id, {
        id: f.id,
        name: COUNTRY_NAMES[f.id],
        playerId: -1,
        armies: 1 + Math.floor(Math.random() * 5),
        income: getIncome(f.id),
      });
    }
  }
}

// ─── Game phases ─────────────────────────────────────────────────────────────
function showPhaseSelect() {
  G.phase = 'select';
  showOverlay(
    'AGE OF CONQUEST',
    'Elige tu nación: haz clic en cualquier país del mapa para comenzar tu conquista del mundo.',
    []
  );
  renderMap();
  updateUI();
}

function pickPlayerCountry(id) {
  G.myId = id;
  const c = G.countries.get(id);
  c.playerId  = G.playerPid;
  c.armies    = 25;
  G.selectedId = id;
  hideOverlay();
  G.phase = 'player';
  log(`¡Iniciaste como ${c.name}! Conquista el mundo.`, 'info');
  renderMap();
  updateUI();
}

// ─── Turn system ─────────────────────────────────────────────────────────────
function endPlayerTurn() {
  if (G.phase !== 'player') return;
  G.attackMode = false;

  // Collect income
  const player = G.players.get(G.playerPid);
  let totalIncome = 0;
  for (const [, c] of G.countries) {
    if (c.playerId === G.playerPid) { player.gold += c.income; totalIncome += c.income; }
  }
  log(`Ingresos: +${totalIncome} de oro. Total: ${Math.floor(player.gold)}.`, 'info');

  G.turn++;
  G.phase = 'ai';
  runAI();

  if (checkGameOver()) return;
  G.phase = 'player';
  renderMap();
  updateUI();
}

// ─── AI ──────────────────────────────────────────────────────────────────────
function runAI() {
  for (const [pid, player] of G.players) {
    if (pid === G.playerPid) continue;

    const mine = [...G.countries.values()].filter(c => c.playerId === pid);
    if (!mine.length) continue;

    // Collect income
    for (const t of mine) player.gold += t.income;

    // Recruit
    const canRecruit = Math.floor(player.gold / RECRUIT_COST);
    if (canRecruit > 0) {
      const count = Math.min(canRecruit, 2);
      const t = mine[Math.floor(Math.random() * mine.length)];
      t.armies += count * RECRUIT_AMT;
      player.gold -= count * RECRUIT_COST;
    }

    // Attack weakest adjacent enemy
    const shuffled = mine.sort(() => Math.random() - 0.5);
    for (const territory of shuffled) {
      if (territory.armies < 4) continue;
      const adj = G.adjacency.get(territory.id) || new Set();
      const targets = [...adj]
        .map(tid => G.countries.get(tid))
        .filter(t => t && t.playerId !== pid && territory.armies > t.armies * 0.75);
      if (!targets.length) continue;
      targets.sort((a, b) => a.armies - b.armies);
      combat(territory, targets[0], false);
    }
  }
}

// ─── Combat ──────────────────────────────────────────────────────────────────
function combat(attacker, defender, isPlayer) {
  const atkStr = attacker.armies * (0.55 + Math.random() * 0.35);
  const defStr = defender.armies * (0.45 + Math.random() * 0.35);

  const atkLoss = Math.max(1, Math.round(defender.armies * (0.25 + Math.random() * 0.25)));
  const defLoss = Math.max(1, Math.round(attacker.armies * (0.2  + Math.random() * 0.2)));

  if (atkStr > defStr) {
    const moved = Math.max(1, attacker.armies - atkLoss - 1);
    attacker.armies = Math.max(1, attacker.armies - atkLoss);
    const dName   = defender.name;
    const fromPid = attacker.playerId;
    defender.playerId = fromPid;
    defender.armies   = moved;
    if (isPlayer) log(`✓ Conquistaste ${dName} (${moved} ejércitos allí).`, 'victory');
    return true;
  } else {
    attacker.armies = Math.max(1, attacker.armies - atkLoss);
    defender.armies = Math.max(1, defender.armies - defLoss);
    if (isPlayer) log(`✗ Ataque a ${defender.name} rechazado. Perdiste ${atkLoss} ejércitos.`, 'defeat');
    return false;
  }
}

// ─── Player actions ──────────────────────────────────────────────────────────
function playerRecruit() {
  if (G.phase !== 'player') return;
  const player = G.players.get(G.playerPid);
  if (player.gold < RECRUIT_COST) {
    log('Oro insuficiente para reclutar.', 'warn'); return;
  }
  const sel = G.countries.get(G.selectedId);
  if (!sel || sel.playerId !== G.playerPid) {
    log('Selecciona uno de tus territorios.', 'warn'); return;
  }
  player.gold -= RECRUIT_COST;
  sel.armies  += RECRUIT_AMT;
  log(`Reclutaste ${RECRUIT_AMT} ejércitos en ${sel.name}.`, 'info');
  renderMap();
  updateUI();
}

function toggleAttackMode() {
  if (G.phase !== 'player') return;
  const sel = G.countries.get(G.selectedId);
  if (!sel || sel.playerId !== G.playerPid) {
    log('Selecciona uno de tus territorios para atacar desde allí.', 'warn'); return;
  }
  G.attackMode = !G.attackMode;
  renderMap();
  updateUI();
}

function playerAttack(targetId) {
  const from = G.countries.get(G.selectedId);
  const to   = G.countries.get(targetId);
  if (!from || !to) return;
  if (from.playerId !== G.playerPid) return;
  if (to.playerId   === G.playerPid) { log('No puedes atacarte a ti mismo.', 'warn'); return; }

  const adj = G.adjacency.get(G.selectedId) || new Set();
  if (!adj.has(targetId)) {
    log('Ese territorio no es adyacente.', 'warn'); return;
  }
  if (from.armies < 2) {
    log('Necesitas al menos 2 ejércitos para atacar.', 'warn'); return;
  }

  combat(from, to, true);
  G.attackMode = false;

  // Keep selection on the territory we attacked from
  checkGameOver();
  renderMap();
  updateUI();
}

// ─── Win / Lose ──────────────────────────────────────────────────────────────
function checkGameOver() {
  const total  = G.countries.size;
  const mine   = [...G.countries.values()].filter(c => c.playerId === G.playerPid).length;
  if (mine === 0) {
    G.phase = 'ended';
    showOverlay('DERROTA',
      'Tu nación ha sido conquistada. El mundo no fue tuyo.',
      [{ label: 'Jugar de nuevo', action: () => location.reload() }]);
    return true;
  }
  if (mine / total >= WIN_PCT) {
    G.phase = 'ended';
    showOverlay('¡VICTORIA!',
      `¡Conquistaste el ${Math.floor(mine/total*100)}% del mundo! Eres el amo del planeta.`,
      [{ label: 'Jugar de nuevo', action: () => location.reload() }]);
    return true;
  }
  return false;
}

// ─── UI ──────────────────────────────────────────────────────────────────────
function updateUI() {
  const player = G.players.get(G.playerPid);
  const mine   = [...G.countries.values()].filter(c => c.playerId === G.playerPid);
  const totalA = mine.reduce((s, c) => s + c.armies, 0);
  const income = mine.reduce((s, c) => s + c.income, 0);

  qs('#turn-num').textContent    = `Turno ${G.turn}`;
  qs('#gold-val').textContent    = Math.floor(player ? player.gold : 0);
  qs('#income-val').textContent  = `+${income}`;
  qs('#armies-val').textContent  = totalA;
  qs('#terr-val').textContent    = mine.length;

  // End turn button
  const etBtn = qs('#end-turn-btn');
  etBtn.disabled = (G.phase !== 'player');
  etBtn.textContent = G.phase === 'ai' ? 'IA jugando...' : 'Terminar Turno ▶';

  // Selected country panel
  const sel = G.countries.get(G.selectedId);
  if (sel) {
    const own = sel.playerId === G.playerPid ? 'Tuyo' :
                sel.playerId === -1          ? 'Neutral' :
                `IA ${sel.playerId}`;
    const ownColor = sel.playerId === G.playerPid ? '#27ae60' :
                     sel.playerId === -1 ? '#888' :
                     (G.players.get(sel.playerId)||{}).color || '#777';
    qs('#sel-name').textContent  = sel.name;
    qs('#sel-owner').innerHTML   = `<span style="color:${ownColor}">■</span> ${own}`;
    qs('#sel-armies').textContent = sel.armies;
    qs('#sel-income').textContent = `${sel.income}/turno`;
  } else {
    qs('#sel-name').textContent   = 'Ninguno';
    qs('#sel-owner').textContent  = '—';
    qs('#sel-armies').textContent = '—';
    qs('#sel-income').textContent = '—';
  }

  const isMine    = sel && sel.playerId === G.playerPid;
  const isEnemy   = sel && sel.playerId !== G.playerPid;
  const canAct    = G.phase === 'player';

  qs('#recruit-btn').disabled  = !(isMine && canAct);
  qs('#attack-btn').disabled   = !(isMine && canAct);
  qs('#attack-btn').textContent = G.attackMode ? '🔴 Cancelar Ataque' : '⚔ Atacar';
  qs('#attack-btn').classList.toggle('active', G.attackMode);

  updatePowers();
}

function updatePowers() {
  const tally = new Map();
  for (const [, c] of G.countries) {
    tally.set(c.playerId, (tally.get(c.playerId) || 0) + 1);
  }
  const sorted = [...tally.entries()]
    .filter(([pid]) => pid >= 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  qs('#powers-list').innerHTML = sorted.map(([pid, cnt]) => {
    const p = G.players.get(pid);
    const col = pid === G.playerPid ? '#27ae60' : (p ? p.color : '#666');
    const lbl = pid === G.playerPid ? '★ Tú' : `IA ${pid}`;
    return `<div class="power-row">
      <span class="pcolor" style="background:${col}"></span>
      <span class="pname">${lbl}</span>
      <span class="pcnt">${cnt}</span>
    </div>`;
  }).join('');
}

const logLines = [];
function log(msg, type) {
  const el  = document.createElement('div');
  el.className = `log-line ${type}`;
  el.textContent = msg;
  logLines.unshift(el);
  const container = qs('#log-list');
  container.innerHTML = '';
  logLines.slice(0, 20).forEach(e => container.appendChild(e));
}

function showOverlay(title, msg, buttons) {
  qs('#ov-title').textContent   = title;
  qs('#ov-msg').textContent     = msg;
  qs('#ov-btns').innerHTML      = '';
  for (const b of buttons) {
    const btn = document.createElement('button');
    btn.textContent = b.label;
    btn.onclick     = b.action;
    qs('#ov-btns').appendChild(btn);
  }
  qs('#overlay').style.display = 'flex';
}

function hideOverlay() {
  qs('#overlay').style.display = 'none';
}

function qs(sel) { return document.querySelector(sel); }

// ─── Events ──────────────────────────────────────────────────────────────────
function bindEvents() {
  canvas.addEventListener('mousedown', e => {
    isDragging = true; hasDragged = false;
    lastMX = e.clientX; lastMY = e.clientY;
  });

  canvas.addEventListener('mousemove', e => {
    if (isDragging) {
      const dx = e.clientX - lastMX, dy = e.clientY - lastMY;
      if (Math.abs(dx) + Math.abs(dy) > 3) {
        hasDragged = true;
        panX += dx; panY += dy;
        lastMX = e.clientX; lastMY = e.clientY;
        renderMap();
      }
    }

    // Tooltip
    const rect = canvas.getBoundingClientRect();
    const cx   = (e.clientX - rect.left) * (mapW / rect.width);
    const cy   = (e.clientY - rect.top)  * (mapH / rect.height);
    const id   = getIdAt(cx, cy);
    const tip  = qs('#tooltip');
    if (id) {
      const c = G.countries.get(id);
      tip.style.display = 'block';
      tip.style.left    = (e.clientX - rect.left + 12) + 'px';
      tip.style.top     = (e.clientY - rect.top  - 36) + 'px';
      tip.innerHTML     = `<strong>${c.name}</strong><br>⚔ ${c.armies} ejércitos`;
    } else {
      tip.style.display = 'none';
    }
  });

  canvas.addEventListener('mouseup', e => {
    isDragging = false;
    if (hasDragged) return;

    const rect = canvas.getBoundingClientRect();
    const cx   = (e.clientX - rect.left) * (mapW / rect.width);
    const cy   = (e.clientY - rect.top)  * (mapH / rect.height);
    const id   = getIdAt(cx, cy);
    if (!id) return;

    if (G.phase === 'select') {
      pickPlayerCountry(id); return;
    }
    if (G.phase !== 'player') return;

    const c = G.countries.get(id);
    if (G.attackMode) {
      if (c && c.playerId !== G.playerPid) {
        playerAttack(id);
      } else if (id === G.selectedId) {
        G.attackMode = false; renderMap(); updateUI();
      }
    } else {
      G.selectedId = id;
      renderMap();
      updateUI();
    }
  });

  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.88 : 1.14;
    const rect  = canvas.getBoundingClientRect();
    const mx    = e.clientX - rect.left;
    const my    = e.clientY - rect.top;
    panX = mx - (mx - panX) * delta;
    panY = my - (my - panY) * delta;
    zoom = Math.max(0.5, Math.min(10, zoom * delta));
    renderMap();
  }, { passive: false });

  qs('#end-turn-btn').addEventListener('click', endPlayerTurn);
  qs('#recruit-btn').addEventListener('click', playerRecruit);
  qs('#attack-btn').addEventListener('click', toggleAttackMode);

  // Zoom buttons
  qs('#zoom-in').addEventListener('click', () => {
    zoom = Math.min(10, zoom * 1.3);
    panX = mapW/2 - (mapW/2 - panX) * 1.3;
    panY = mapH/2 - (mapH/2 - panY) * 1.3;
    renderMap();
  });
  qs('#zoom-out').addEventListener('click', () => {
    zoom = Math.max(0.5, zoom / 1.3);
    panX = mapW/2 - (mapW/2 - panX) / 1.3;
    panY = mapH/2 - (mapH/2 - panY) / 1.3;
    renderMap();
  });
  qs('#zoom-reset').addEventListener('click', () => {
    zoom = 1; panX = 0; panY = 0; renderMap();
  });
}

function setProgress(pct) {
  const el = qs('#prog-fill');
  if (el) el.style.width = pct + '%';
}
