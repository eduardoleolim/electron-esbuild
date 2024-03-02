import compression from 'compression';
import connect, { HandleFunction, IncomingMessage, SimpleHandleFunction } from 'connect';
import { ServeResult } from 'esbuild';
import http, { Server } from 'http';
import httpProxy from 'http-proxy';
import livereload, { LiveReloadServer } from 'livereload';

import { Logger } from '../../../shared/domain/Logger.mjs';
import { findFreePort } from '../../../shared/infrastructure/findFreePort.mjs';

export class RendererProcessServer {
  private readonly outputRenderer: string;
  private readonly serveResult: ServeResult;
  private readonly handler: connect.Server;
  private readonly middlewares: Map<string, HandleFunction>;
  private readonly server: Server;
  private reloadServer?: LiveReloadServer;
  private readonly logger: Logger;

  constructor(outputRenderer: string, serveResult: ServeResult, logger: Logger) {
    this.outputRenderer = outputRenderer;
    this.serveResult = serveResult;
    this.middlewares = new Map<string, HandleFunction>();
    this.handler = connect();
    this.logger = logger;
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

  private loadReloadServer(port: number): void {
    this.reloadServer = livereload.createServer({ port: port });
    this.reloadServer.watch(this.outputRenderer);
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

  public listen(port: number, host: string): void {
    const logger = this.logger;
    this.server.listen(port, host, () => {
      (async () => {
        if (this.reloadServer === undefined) {
          const reloadPort = await findFreePort(35729, true);
          this.loadReloadServer(reloadPort);
        }
      })();

      logger.info('RENDERER-SERVER', `Renderer process server listening on http://${host}:${port}`);
    });
  }

  public refresh(filePath: string): void {
    this.logger.log('RENDERER-SERVER', 'Reloading renderer process server');
    this.reloadServer?.refresh(filePath);
  }

  public stop(): void {
    this.reloadServer?.close();
    this.server.close();
    this.logger.info('RENDERER-SERVER', 'Renderer process server stopped');
  }
}
