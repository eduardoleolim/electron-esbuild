import chokidar from 'chokidar';
import compression from 'compression';
import connect from 'connect';
import { Server, createServer } from 'http';
import httpProxy from 'http-proxy';
import livereload, { CreateServerConfig, LiveReloadServer } from 'livereload';

import { Logger } from '../../../shared/domain/Logger.mjs';

export interface RendererHotReloadServerOptions {
  dependencies: string[];
  esbuildHost: string;
  esbuildPort: number;
  hotReloadHost: string;
  hotReloadPort: number;
}

export class RendererHotReloadServer {
  private dependencies: string[];
  private readonly esbuildHost: string;
  private readonly esbuildPort: number;
  private readonly hotReloadHost: string;
  private readonly hotReloadPort: number;
  private readonly hotReloadServer: LiveReloadServer;
  readonly watcher: chokidar.FSWatcher;
  private readonly server: Server;
  private readonly logger: Logger;

  constructor(options: RendererHotReloadServerOptions, logger: Logger) {
    const { dependencies, esbuildHost, esbuildPort, hotReloadHost, hotReloadPort } = options;

    this.dependencies = dependencies;
    this.esbuildHost = esbuildHost;
    this.esbuildPort = esbuildPort;
    this.hotReloadHost = hotReloadHost;
    this.hotReloadPort = hotReloadPort;
    this.hotReloadServer = this.loadHotReloadServer();
    this.hotReloadServer.watch(this.dependencies);
    this.watcher = this.hotReloadServer.watcher as chokidar.FSWatcher;
    this.watcher.removeAllListeners('unlink');
    this.watcher.removeAllListeners('change');
    this.watcher.removeAllListeners('add');
    this.server = this.loadServer();
    this.logger = logger;
  }

  private loadHotReloadServer(): LiveReloadServer {
    const config: CreateServerConfig = {
      port: this.hotReloadPort,
      noListen: true,
    };
    return livereload.createServer(config);
  }

  private loadServer(): Server {
    const esbuildProxy = httpProxy.createProxyServer({
      target: `http://${this.esbuildHost}:${this.esbuildPort}`,
    });
    const hotReloadProxy = httpProxy.createProxyServer({
      target: `http://${this.hotReloadHost}:${this.hotReloadPort}`,
    });

    const handlers = connect();
    handlers.use(compression() as any);
    handlers.use((req, res) => {
      const regex = /^\/livereload.js?(\?.*)?$/;
      const url = req.url!;

      if (regex.test(url)) {
        hotReloadProxy.web(req, res);
      } else {
        esbuildProxy.web(req, res);
      }
    });

    return createServer(handlers).on('upgrade', (req, socket, head): void => {
      hotReloadProxy.ws(req, socket, head);
    });
  }

  async listen(port: number, host: string, callback?: () => void): Promise<void> {
    this.hotReloadServer.listen(() => {
      this.server.listen(port, host, () => {
        this.logger.info('RENDERER-SERVER', `Renderer process server listening on http://${host}:${port}`);
        callback?.();
      });
    });
  }

  refresh() {
    this.hotReloadServer.refresh('.');
  }

  public close() {
    this.hotReloadServer.close();
    this.server.close();
  }
}
