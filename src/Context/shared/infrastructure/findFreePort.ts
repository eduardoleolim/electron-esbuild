import net from 'net';

const MAX_PORT = 65534;
const LOCALHOST = '127.0.0.1';

export function findFreePort(port: number): Promise<number>;
export function findFreePort(port: number, host: string): Promise<number>;
export function findFreePort(portBegin: number, portEnd: number): Promise<number>;
export function findFreePort(portBegin: number, portEnd: number, host: string): Promise<number>;

export function findFreePort(portBegin: number, portEnd?: number | string, host?: string): Promise<number> {
  if (portEnd === undefined) {
    return findFreePort(portBegin, MAX_PORT, LOCALHOST);
  }

  if (typeof portEnd === 'string') {
    return findFreePort(portBegin, MAX_PORT, portEnd);
  }

  if (host === undefined) {
    return findFreePort(portBegin, portEnd, LOCALHOST);
  }

  if (portBegin > portEnd) {
    const temp = portBegin;
    portBegin = portEnd;
    portEnd = temp;
  }

  const usePortEnd = portEnd;
  const useHost = host;

  return new Promise((resolve, reject) => {
    const regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!regex.test(useHost)) {
      reject(new Error(`Invalid host ${useHost}`));
      return;
    }

    const server = net.createServer();
    server.on('listening', () => {
      server.close(() => resolve(portBegin));
    });
    server.on('error', () => {
      if (portEnd === portBegin) {
        server.close(() => reject(new Error(`No free port found between ${portBegin} and ${usePortEnd}`)));
        return;
      }

      server.close(() => findFreePort(portBegin + 1, usePortEnd, host).then(resolve, reject));
    });

    server.listen(portBegin, useHost);
  });
}
