const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 5500;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change-me-admin-token';
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'inquiries.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 8;
const ipBucket = new Map();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function sanitizeText(value, maxLen = 500) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLen);
}

function validateInquiry(data) {
  const name = sanitizeText(data.name, 60);
  const company = sanitizeText(data.company, 80);
  const phone = sanitizeText(data.phone, 30);
  const email = sanitizeText(data.email, 120);
  const message = sanitizeText(data.message, 1200);

  if (!name || !company || !phone || !email || !message) {
    return { ok: false, message: '필수 입력값이 누락되었습니다.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { ok: false, message: '이메일 형식이 올바르지 않습니다.' };
  }

  return { ok: true, inquiry: { name, company, phone, email, message } };
}

function isRateLimited(ip) {
  const now = Date.now();
  const history = (ipBucket.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  history.push(now);
  ipBucket.set(ip, history);
  return history.length > RATE_LIMIT_MAX;
}

function loadInquiries() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveInquiry(inquiry) {
  const current = loadInquiries();
  current.unshift(inquiry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(current, null, 2), 'utf8');
}

function serveStatic(req, res, pathname) {
  let target = pathname === '/' ? '/index.html' : pathname;
  target = path.normalize(target).replace(/^\.+/, '');

  const filePath = path.join(__dirname, target);
  if (!filePath.startsWith(__dirname)) {
    sendJson(res, 403, { ok: false, message: 'Forbidden' });
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      sendJson(res, 404, { ok: false, message: 'Not found' });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';

  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJson(res, 200, { ok: true, status: 'up', time: new Date().toISOString() });
  }

  if (pathname === '/api/inquiries' && req.method === 'POST') {
    if (isRateLimited(ip)) return sendJson(res, 429, { ok: false, message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' });

    try {
      const raw = await readBody(req);
      const payload = JSON.parse(raw || '{}');
      const validation = validateInquiry(payload);
      if (!validation.ok) return sendJson(res, 400, validation);

      const item = {
        id: `inq_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        ...validation.inquiry,
        createdAt: new Date().toISOString(),
        ip,
      };
      saveInquiry(item);
      return sendJson(res, 201, { ok: true, message: '문의가 접수되었습니다.', id: item.id });
    } catch (error) {
      return sendJson(res, 400, { ok: false, message: '잘못된 요청입니다.', detail: error.message });
    }
  }

  if (pathname === '/api/inquiries' && req.method === 'GET') {
    const token = req.headers['x-admin-token'];
    if (token !== ADMIN_TOKEN) return sendJson(res, 401, { ok: false, message: 'Unauthorized' });
    return sendJson(res, 200, { ok: true, items: loadInquiries() });
  }

  return serveStatic(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`✅ WEBDOT server started on http://localhost:${PORT}`);
  console.log(`✅ Admin token is set: ${ADMIN_TOKEN !== 'change-me-admin-token' ? 'custom' : 'default (change recommended)'}`);
});
