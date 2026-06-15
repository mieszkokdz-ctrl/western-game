const http = require('http');
const { WebSocketServer } = require('ws');
const fs   = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;

// ── HTTP server (serves game files) ────────────────────────────────────────
const httpServer = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  // safety: stay inside game dir
  if (!filePath.startsWith(__dirname)) { res.writeHead(403); res.end(); return; }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath);
    const mime = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css',
                   '.png':'image/png', '.jpg':'image/jpeg', '.json':'application/json' }[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

// ── WebSocket server (multiplayer) ─────────────────────────────────────────
const wss = new WebSocketServer({ server: httpServer });
let nextId = 1;
const players = new Map();

function broadcast(data, exceptId = null) {
  const msg = JSON.stringify(data);
  for (const [id, p] of players) {
    if (id !== exceptId && p.ws.readyState === 1) p.ws.send(msg);
  }
}

wss.on('connection', ws => {
  const id = nextId++;
  const defaultName = 'Kowboj' + id;
  players.set(id, { ws, state: { id, x:0, z:0, angle:0, hp:100, maxHp:100, name:defaultName } });

  ws.send(JSON.stringify({
    type: 'init', id,
    players: [...players.values()].filter(p => p.state.id !== id).map(p => p.state)
  }));
  broadcast({ type: 'join', player: players.get(id).state }, id);

  ws.on('message', raw => {
    let msg; try { msg = JSON.parse(raw); } catch { return; }
    const p = players.get(id); if (!p) return;
    if (msg.type === 'update') {
      Object.assign(p.state, { x:msg.x, z:msg.z, angle:msg.angle, hp:msg.hp,
        shirt:msg.shirt, hat:msg.hat, pants:msg.pants, boot:msg.boot,
        onHorse:msg.onHorse, horseColor:msg.horseColor });
      broadcast({ type:'update', id, x:msg.x, z:msg.z, angle:msg.angle, hp:msg.hp,
        shirt:msg.shirt, hat:msg.hat, pants:msg.pants, boot:msg.boot,
        onHorse:msg.onHorse, horseColor:msg.horseColor }, id);
    } else if (msg.type === 'shoot') {
      broadcast({ type:'shoot', id, x:msg.x, z:msg.z, vx:msg.vx, vz:msg.vz }, id);
    } else if (msg.type === 'name') {
      p.state.name = String(msg.name).slice(0, 16);
      broadcast({ type:'name', id, name:p.state.name }, id);
    } else if (msg.type === 'hit') {
      broadcast({ type:'hit', targetId:msg.targetId, dmg:msg.dmg }, id);
    } else if (msg.type === 'npc_sync') {
      broadcast({ type:'npc_sync', ns:msg.ns, as:msg.as }, id);
    } else if (msg.type === 'npc_kill') {
      broadcast({ type:'npc_kill', id:msg.id }, id);
    } else if (msg.type === 'npc_spawn') {
      broadcast({ type:'npc_spawn', id:msg.id, x:msg.x, z:msg.z }, id);
    }
  });

  ws.on('close', () => {
    players.delete(id);
    broadcast({ type:'leave', id });
    console.log(`[-] Gracz ${id} (${defaultName}) rozłączony. Online: ${players.size}`);
  });

  console.log(`[+] Gracz ${id} (${defaultName}) dołączył. Online: ${players.size}`);
});

httpServer.listen(PORT, '0.0.0.0', () => {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  let localIp = 'localhost';
  for (const n of Object.values(nets)) {
    for (const iface of n) {
      if (iface.family === 'IPv4' && !iface.internal) { localIp = iface.address; break; }
    }
  }
  console.log(`\n========================================`);
  console.log(`  WESTERN 2 — Serwer multiplayer`);
  console.log(`========================================`);
  console.log(`  Lokalnie:  http://localhost:${PORT}`);
  console.log(`  Sieć LAN:  http://${localIp}:${PORT}`);
  console.log(`  Podziel się tym adresem z graczami!`);
  console.log(`========================================\n`);
});
