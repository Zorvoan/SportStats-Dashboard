const http    = require('http');
const fs      = require('fs');
const path    = require('path');
const bcrypt  = require('bcryptjs');
const { randomUUID: uuid } = require('crypto');

const PORT    = 3000;
const DB_FILE = path.join(__dirname, 'db.json');
const PUBLIC  = path.join(__dirname, 'public');

// ── Database (JSON file) ───────────────────────────────────────────────────────
function loadDB() {
  if (!fs.existsSync(DB_FILE))
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], sessions: [] }));
  return JSON.parse(fs.readFileSync(DB_FILE));
}
function saveDB(db) { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }

const db = {
  findUser:    (field, val) => loadDB().users.find(u => u[field] === val) ?? null,
  createUser:  (data)       => { const d = loadDB(); d.users.push(data);    saveDB(d); return data; },
  findSession: (token)      => loadDB().sessions.find(s => s.token === token) ?? null,
  createSession: (data)     => { const d = loadDB(); d.sessions.push(data); saveDB(d); return data; },
  deleteSession: (token)    => { const d = loadDB(); d.sessions = d.sessions.filter(s => s.token !== token); saveDB(d); }
};

// ── Auth helpers ───────────────────────────────────────────────────────────────
const COOKIE = 'session';

function parseCookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || '').split(';').map(c => c.trim().split('='))
  );
}

function getUser(req) {
  const token = parseCookies(req)[COOKIE];
  if (!token) return null;
  const session = db.findSession(token);
  if (!session || new Date(session.expires) < new Date()) return null;
  return db.findUser('id', session.userId);
}

function setCookie(res, token) {
  const exp = new Date(Date.now() + 24 * 3600 * 1000).toUTCString();
  res.setHeader('Set-Cookie', `${COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Expires=${exp}`);
}

function clearCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
}

// ── HTTP helpers ───────────────────────────────────────────────────────────────
function readBody(req) {
  return new Promise(resolve => {
    let b = '';
    req.on('data', c => b += c);
    req.on('end', () => resolve(b));
  });
}

function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(body);
}

// ── MIME types ─────────────────────────────────────────────────────────────────
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' };

// ── Server ─────────────────────────────────────────────────────────────────────
http.createServer(async (req, res) => {
  const url    = new URL(req.url, `http://localhost`);
  const route  = url.pathname;
  const method = req.method;

  // API routes
  if (route === '/api/register' && method === 'POST') {
    const { username, email, password } = JSON.parse(await readBody(req));

    if (!username || username.length < 3) return json(res, 422, { error: 'Username must be 3+ characters.' });
    if (!email || !email.includes('@'))   return json(res, 422, { error: 'Valid email required.' });
    if (!password || password.length < 8) return json(res, 422, { error: 'Password must be 8+ characters.' });
    if (db.findUser('email', email.toLowerCase()))    return json(res, 409, { error: 'Email already registered.' });
    if (db.findUser('username', username.toLowerCase())) return json(res, 409, { error: 'Username taken.' });

    const user = db.createUser({
      id: uuid(),
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 12),
      createdAt: new Date().toISOString()
    });

    const token = uuid();
    db.createSession({ token, userId: user.id, expires: new Date(Date.now() + 24 * 3600 * 1000).toISOString() });
    setCookie(res, token);
    return json(res, 201, { ok: true });
  }

  if (route === '/api/login' && method === 'POST') {
    const { email, password } = JSON.parse(await readBody(req));
    const user = db.findUser('email', (email || '').toLowerCase());
    if (!user || !(await bcrypt.compare(password || '', user.password)))
      return json(res, 401, { error: 'Invalid email or password.' });

    const token = uuid();
    db.createSession({ token, userId: user.id, expires: new Date(Date.now() + 24 * 3600 * 1000).toISOString() });
    setCookie(res, token);
    return json(res, 200, { ok: true });
  }

  if (route === '/api/logout' && method === 'POST') {
    db.deleteSession(parseCookies(req)[COOKIE]);
    clearCookie(res);
    return json(res, 200, { ok: true });
  }

  if (route === '/api/me' && method === 'GET') {
    const user = getUser(req);
    if (!user) return json(res, 401, { error: 'Not logged in.' });
    return json(res, 200, { username: user.username, email: user.email, createdAt: user.createdAt });
  }

  // Static files
  let file = route === '/' ? '/login.html' : route;
  const filePath = path.join(PUBLIC, path.normalize(file));
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'text/plain' });
    res.end(data);
  });

}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
