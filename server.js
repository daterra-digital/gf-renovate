const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Ignora query string na resolução de ficheiro
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Endpoint API para Gestão e Sincronização do Estado do Sistema (Localhost -> GitHub Pages)
  if (pathname === '/api/system-status') {
    const statusJsonPath = path.join(ROOT_DIR, 'system-status.json');
    const statusJsPath = path.join(ROOT_DIR, 'system-status.js');

    if (req.method === 'GET') {
      try {
        const data = fs.readFileSync(statusJsonPath, 'utf8');
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(data);
      } catch (err) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ status: 'open', updated_at: new Date().toISOString() }));
      }
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const nextStatus = payload.status === 'closed' ? 'closed' : 'open';
          const nowIso = new Date().toISOString();
          const author = payload.author || 'moderator-localhost';

          const jsonData = {
            status: nextStatus,
            updated_at: nowIso,
            updated_by: author
          };

          const jsData = `// RENOVATE FG2 - Estado Global do Sistema\n// Sincronizado automaticamente entre Localhost e GitHub Pages\nwindow.RENOVATE_SYSTEM_STATUS = {\n  status: "${nextStatus}",\n  updated_at: "${nowIso}",\n  updated_by: "${author}"\n};\n`;

          fs.writeFileSync(statusJsonPath, JSON.stringify(jsonData, null, 2), 'utf8');
          fs.writeFileSync(statusJsPath, jsData, 'utf8');

          console.log(`[API /api/system-status] Estado atualizado localmente para: "${nextStatus}"`);

          if (payload.auto_push !== false) {
            exec('git status --porcelain system-status.js system-status.json', { cwd: ROOT_DIR }, (statusErr, statusOut) => {
              if (!statusOut || statusOut.trim() === '') {
                console.log('[API /api/system-status] Ficheiros de status sem alterações face ao repositório.');
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({
                  success: true,
                  status: nextStatus,
                  pushed: true,
                  message: 'Estado já sincronizado no Git.'
                }));
                return;
              }

              const commitMsg = `chore(status): alterar system_status para ${nextStatus} [skip ci]`;
              const gitCmd = `git add system-status.js system-status.json && git commit -m "${commitMsg}" && git push origin main`;
              console.log(`[API /api/system-status] A publicar no GitHub Pages via Git Push...`);

              exec(gitCmd, { cwd: ROOT_DIR }, (gitErr, stdout, stderr) => {
                if (gitErr) {
                  console.error('[API /api/system-status] Erro no git push:', stderr || gitErr.message);
                  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                  res.end(JSON.stringify({
                    success: true,
                    status: nextStatus,
                    pushed: false,
                    warning: 'Guardado localmente, mas git push falhou.',
                    git_error: stderr || gitErr.message
                  }));
                } else {
                  console.log('[API /api/system-status] ✅ Git push para GitHub Pages concluído com sucesso!');
                  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                  res.end(JSON.stringify({
                    success: true,
                    status: nextStatus,
                    pushed: true,
                    git_output: stdout
                  }));
                }
              });
            });
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true, status: nextStatus, pushed: false }));
          }
        } catch (parseErr) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, error: parseErr.message }));
        }
      });
      return;
    }
  }

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const filePath = path.join(ROOT_DIR, pathname);

  // Segurança: Prevenir Directory Traversal
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Não Encontrado: ${pathname}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Headers anti-cache para garantir atualização imediata no desenvolvimento
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🌐 Servidor RENOVATE FG2 Ativo em Localhost!`);
  console.log(`👉 Aceda localmente em: http://localhost:${PORT}`);
  console.log(`👉 Ou na rede local em: http://127.0.0.1:${PORT}`);
  console.log(`👉 API de Estado: http://localhost:${PORT}/api/system-status`);
  console.log(`=======================================================`);
});
