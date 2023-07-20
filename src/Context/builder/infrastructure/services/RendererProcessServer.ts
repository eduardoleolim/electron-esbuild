import { ServeResult } from 'esbuild';
import connect, { HandleFunction, IncomingMessage, SimpleHandleFunction } from 'connect';
import compression from 'compression';
import fs from 'fs';
import http, { Server } from 'http';
import httpProxy from 'http-proxy';
import livereload, { LiveReloadServer } from 'livereload';
import { findFreePort } from '../../../shared/infrastructure/findFreePort';
import { Logger } from '../../../shared/domain/Logger';

export class RendererProcessServer {
  private readonly htmlPath: string;
  private readonly rendererScriptPath: string;
  private readonly calculateCssPath: () => string | undefined;
  private readonly serveResult: ServeResult;
  private readonly handler: connect.Server;
  private readonly middlewares: Map<string, HandleFunction>;
  private readonly server: Server;
  private reloadServer?: LiveReloadServer;
  private readonly logger: Logger;

  constructor(
    serveResult: ServeResult,
    htmlPath: string,
    rendererScriptPath: string,
    calculateCssPath: () => string | undefined,
    logger: Logger,
  ) {
    this.htmlPath = htmlPath;
    this.rendererScriptPath = rendererScriptPath;
    this.calculateCssPath = calculateCssPath;
    this.serveResult = serveResult;
    this.middlewares = new Map<string, HandleFunction>();
    this.handler = connect();
    this.logger = logger;
    this.loadMiddlewares();
    this.loadHandlerConfig();
    this.server = http.createServer(this.handler);
  }

  private loadHandlerConfig(): void {
    const esbuildProxy = httpProxy.createProxyServer({
      target: `http://${this.serveResult.host}:${this.serveResult.port}`,
    });

    this.handler.use(compression() as any);
    this.handler.use((req, res): void => {
      if (req.method?.toUpperCase() === 'GET') {
        if (req.url === '/') {
          const getIndex = this.middlewares.get('getIndex');
          (getIndex as SimpleHandleFunction)(req, res); // getIndex always exists
          return;
        }

        if (/^\/livereload.js?(\?.*)?$/.test(req.url?.toLowerCase() ?? '')) {
          const getReload = this.middlewares.get('getReload');
          if (getReload === undefined) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found');
          }

          (getReload as SimpleHandleFunction)(req, res);
          return;
        }

        esbuildProxy.web(req, res);
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('ok');
    });
  }

  private loadMiddlewares(): void {
    const htmlPath = this.htmlPath;
    const rendererScriptPath = this.rendererScriptPath;
    const calculateCssPath = this.calculateCssPath;

    function getIndex(req: IncomingMessage, res: http.ServerResponse): void {
      let html = fs.readFileSync(htmlPath, 'utf-8').replace(
        '</body>',
        `  <script src='${rendererScriptPath}'></script>
    <script src='/livereload.js?snipver=1'></script>
  </body>`,
      );

      const cssPath = calculateCssPath();

      if (cssPath !== undefined) {
        html = html.replace(
          '</head>',
          `  <link rel="stylesheet" href="${cssPath}">
</head>`,
        );
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    }

    this.middlewares.set('getIndex', getIndex);
  }

  private loadReloadServer(port: number): void {
    this.reloadServer = livereload.createServer({ port: port });
    this.reloadServer.watch(this.htmlPath);
    const reloadProxy = httpProxy.createProxyServer({
      target: `http://${this.serveResult.host}:${port}`,
    });

    this.server.on('upgrade', (req, socket, head): void => {
      reloadProxy.ws(req, socket, head);
    });

    function getReload(req: IncomingMessage, res: http.ServerResponse): void {
      reloadProxy.web(req, res);
    }

    this.middlewares.set('getReload', getReload);
  }

  public start(port: number, host: string): void {
    const logger = this.logger;
    this.server.listen(port, host, () => {
      (async () => {
        if (this.reloadServer === undefined) {
          const reloadPort = await findFreePort(35729);
          this.loadReloadServer(reloadPort);
        }
      })();

      logger.info('RENDERER', `Renderer process server listening on http://${host}:${port}`);
    });
  }

  public reload(filePath: string): void {
    this.logger.log('RENDERER', 'Reloading renderer process server');
    this.reloadServer?.refresh(filePath);
  }

  public stop(): void {
    this.reloadServer?.close();
    this.server.close();
    this.logger.info('RENDERER', 'Renderer process server stopped');
  }
}
