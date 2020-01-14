import express, { Request, Response, NextFunction } from 'express';
import httpProxy from 'http-proxy';
import { URL } from 'url';

const app = express();

var proxy = httpProxy.createProxyServer({ secure: false, target: 'http://127.0.0.1:8080' });

app.use(
  (req: Request, res: Response, next: NextFunction): void => {
    if (req.hostname !== '127.0.0.1') {
      const url = new URL(req.url);
      proxy.web(req, res, {
        target: `${req.protocol}//${req.hostname}${url.port === '80' ? '' : url.port}`,
        changeOrigin: true,
      });
      return;
    }
    return next();
  },
);

app.get('*', (req: Request, res: Response) => {
  res.end('Hello World');
});

app.listen(
  8080,
  (): void => {
    console.log('Server started, listening 8080');
  },
);

proxy.listen(8081);
