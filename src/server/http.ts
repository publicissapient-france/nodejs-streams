import { createReadStream, readFile } from 'fs';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { resolve } from 'path';

const port = 8080;
createServer(requestListener).listen(port);
console.log(`\nServer listening on port: ${port}`);

function requestListener(req: IncomingMessage, res: ServerResponse): void {
  switch (req.url) {
    case '/favicon.ico': {
      serveFavicon(res);
      break;
    }
    default: {
      serveContent(res);
      break;
    }
  }
}

function serveFavicon(res: ServerResponse): void {
  res.writeHead(200, { 'Content-Type': 'image/x-icon' });
  readFile(resolve(__dirname, 'favicon.ico'), (err, data) => res.end(data));
}

function serveContent(res: ServerResponse): void {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  createReadStream('./package-lock.json').pipe(res);
}
