const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const url = require('url');

const PORT = 5000;
const HOST = '0.0.0.0';

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif',
  '.json': 'application/json', '.gbc': 'application/octet-stream',
  '.bin': 'application/octet-stream', '.csv': 'text/csv',
  '.tilemap': 'application/octet-stream', '.svg': 'image/svg+xml',
};

function serveFile(res, filePath) {
  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, { 'Content-Type': mime }); res.end(data);
  });
}

function jsonResponse(res, data, status) {
  res.writeHead(status || 200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const MAX_BODY_SIZE = 2 * 1024 * 1024;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    req.on('data', c => {
      size += c.length;
      if (size > MAX_BODY_SIZE) { reject(new Error('Request body too large')); return; }
      body += c;
    });
    req.on('end', () => resolve(body));
  });
}

function safePath(base, userInput) {
  const resolved = path.resolve(base, path.basename(userInput));
  if (!resolved.startsWith(path.resolve(base))) return null;
  return resolved;
}

const ALLOWED_BUILD_TARGETS = ['assets', 'rom', 'all'];
const BUILD_COMMANDS = {
  assets: 'export GBDK_HOME=~/gbdk/ && make assets 2>&1',
  rom: 'export GBDK_HOME=~/gbdk/ && make 2>&1',
  all: 'export GBDK_HOME=~/gbdk/ && make assets && make 2>&1',
};

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const p = parsed.pathname;

  if (p === '/' || p === '/index.html') {
    return serveFile(res, path.join(__dirname, 'src/client/index.html'));
  }

  if (p.startsWith('/api/')) {
    return handleAPI(req, res, p, parsed.query);
  }

  const candidates = [
    path.join(__dirname, 'src/client', p),
    path.join(__dirname, p),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) {
      return serveFile(res, c);
    }
  }
  res.writeHead(404); res.end('Not Found');
});

async function handleAPI(req, res, p, query) {
  try {
    if (p === '/api/tiles' && req.method === 'GET') {
      const dir = path.join(__dirname, 'assets/tiles');
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
      return jsonResponse(res, files);
    }

    if (p === '/api/tilemaps' && req.method === 'GET') {
      const dir = path.join(__dirname, 'res/tilemaps');
      if (!fs.existsSync(dir)) return jsonResponse(res, []);
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.tilemap'));
      return jsonResponse(res, files);
    }

    if (p === '/api/maps' && req.method === 'GET') {
      const dir = path.join(__dirname, 'res/maps');
      if (!fs.existsSync(dir)) return jsonResponse(res, []);
      const files = fs.readdirSync(dir);
      return jsonResponse(res, files);
    }

    if (p === '/api/strings' && req.method === 'GET') {
      const strFile = path.join(__dirname, 'assets/strings.js');
      const content = fs.readFileSync(strFile, 'utf8');
      return jsonResponse(res, { content });
    }

    if (p === '/api/strings' && req.method === 'POST') {
      const body = JSON.parse(await readBody(req));
      fs.writeFileSync(path.join(__dirname, 'assets/strings.js'), body.content);
      return jsonResponse(res, { success: true });
    }

    if (p === '/api/tables' && req.method === 'GET') {
      const content = fs.readFileSync(path.join(__dirname, 'assets/tables.csv'), 'utf8');
      return jsonResponse(res, { content });
    }

    if (p === '/api/tables' && req.method === 'POST') {
      const body = JSON.parse(await readBody(req));
      fs.writeFileSync(path.join(__dirname, 'assets/tables.csv'), body.content);
      return jsonResponse(res, { success: true });
    }

    if (p === '/api/src-files' && req.method === 'GET') {
      const dir = path.join(__dirname, 'src');
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.c') || f.endsWith('.h'));
      return jsonResponse(res, files);
    }

    if (p === '/api/src-file' && req.method === 'GET') {
      const file = query.name;
      const filePath = safePath(path.join(__dirname, 'src'), file || '');
      if (!filePath) return jsonResponse(res, { error: 'Invalid path' }, 400);
      if (!fs.existsSync(filePath)) return jsonResponse(res, { error: 'Not found' }, 404);
      const content = fs.readFileSync(filePath, 'utf8');
      return jsonResponse(res, { content, name: path.basename(filePath) });
    }

    if (p === '/api/src-file' && req.method === 'POST') {
      const body = JSON.parse(await readBody(req));
      const filePath = safePath(path.join(__dirname, 'src'), body.name || '');
      if (!filePath) return jsonResponse(res, { error: 'Invalid path' }, 400);
      fs.writeFileSync(filePath, body.content);
      return jsonResponse(res, { success: true });
    }

    if (p === '/api/rom-info' && req.method === 'GET') {
      const romPath = path.join(__dirname, 'LabyrinthOfTheDragon.gbc');
      const exists = fs.existsSync(romPath);
      const size = exists ? fs.statSync(romPath).size : 0;
      return jsonResponse(res, { exists, size, name: 'LabyrinthOfTheDragon.gbc' });
    }

    if (p === '/api/build' && req.method === 'POST') {
      const body = JSON.parse(await readBody(req));
      const target = ALLOWED_BUILD_TARGETS.includes(body.target) ? body.target : 'all';
      const cmd = BUILD_COMMANDS[target];
      exec(cmd, { cwd: __dirname, timeout: 120000 }, (err, stdout, stderr) => {
        const output = stdout + (stderr || '');
        jsonResponse(res, { success: !err, output, error: err ? err.message : null });
      });
      return;
    }

    if (p === '/api/tilemap-data' && req.method === 'GET') {
      let tilemapPath = safePath(path.join(__dirname, 'res/tilemaps'), query.name || '');
      if (!tilemapPath || !fs.existsSync(tilemapPath)) {
        tilemapPath = safePath(path.join(__dirname, 'res/maps'), query.name || '');
      }
      if (!tilemapPath) return jsonResponse(res, { error: 'Invalid' }, 400);
      if (!fs.existsSync(tilemapPath)) return jsonResponse(res, { error: 'Not found' }, 404);
      const data = fs.readFileSync(tilemapPath);
      return jsonResponse(res, { data: data.toString('base64'), name: path.basename(tilemapPath), size: data.length });
    }

    if (p === '/api/upload-tile' && req.method === 'POST') {
      const tilePath = safePath(path.join(__dirname, 'assets/tiles'), req.headers['x-filename'] || '');
      if (!tilePath || !tilePath.endsWith('.png')) return jsonResponse(res, { error: 'Invalid filename' }, 400);
      const chunks = [];
      let totalSize = 0;
      req.on('data', c => { totalSize += c.length; if (totalSize <= MAX_BODY_SIZE) chunks.push(c); });
      req.on('end', () => {
        if (totalSize > MAX_BODY_SIZE) return jsonResponse(res, { error: 'File too large' }, 413);
        fs.writeFileSync(tilePath, Buffer.concat(chunks));
        jsonResponse(res, { success: true, filename: path.basename(tilePath) });
      });
      return;
    }

    if (p === '/api/upload-rom' && req.method === 'POST') {
      const chunks = [];
      let totalSize = 0;
      req.on('data', c => { totalSize += c.length; if (totalSize <= MAX_BODY_SIZE) chunks.push(c); });
      req.on('end', () => {
        if (totalSize > MAX_BODY_SIZE) return jsonResponse(res, { error: 'File too large' }, 413);
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(path.join(__dirname, 'uploaded.gbc'), buf);
        jsonResponse(res, { success: true, size: buf.length, path: '/uploaded.gbc' });
      });
      return;
    }

    jsonResponse(res, { error: 'Not found' }, 404);
  } catch (e) {
    jsonResponse(res, { error: e.message }, 500);
  }
}

server.listen(PORT, HOST, () => {
  console.log(`Enchantment Game Engine - RPG Workbench running at http://${HOST}:${PORT}`);
});
