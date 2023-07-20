import net from 'net';

const MAX_PORT = 65534;
const LOCALHOST = '127.0.0.1';
const RESERVED_PORTS: number[] = [];

/**
 * Find a free port from the given port until 65534 in localhost
 * @param port - The port to start searching
 * @param reservePort - Reserve the port, so it will be ignored in the next searches
 */
export function findFreePort(port: number, reservePort: boolean): Promise<number>;
/**
 * Find a free port from the given port until 65534 with the given host
 * @param port - The port to start searching
 * @param host - The host to search the free port
 * @param reservePort - Reserve the port, so it will be ignored in the next searches
 */
export function findFreePort(port: number, host: string, reservePort: boolean): Promise<number>;
/**
 * Find a free port between the given ports in localhost
 * @param portBegin - The port to start searching
 * @param portEnd - The port to end searching
 * @param reservePort - Reserve the port, so it will be ignored in the next searches
 */
export function findFreePort(portBegin: number, portEnd: number, reservePort: boolean): Promise<number>;
/**
 * Find a free port between the given ports with the given host
 * @param portBegin - The port to start searching
 * @param portEnd - The port to end searching
 * @param host - The host to search the free port
 * @param reservePort - Reserve the port, so it will be ignored in the next searches
 */
export function findFreePort(portBegin: number, portEnd: number, host: string, reservePort: boolean): Promise<number>;

export function findFreePort<S extends boolean | string, T extends number | string | boolean>(
  portBegin: number,
  portEnd: T,
  host?: T extends string ? boolean : S,
  reservePort?: boolean,
): Promise<number> {
  let usePortEnd: number;
  let useHost: string;
  let useReservePort: boolean;
  let usePortBegin: number;

  if (typeof portEnd === 'boolean') {
    usePortEnd = MAX_PORT;
    useHost = LOCALHOST;
    useReservePort = portEnd;
    usePortBegin = portBegin;
  } else if (typeof host === 'boolean') {
    usePortEnd = MAX_PORT;
    useHost = LOCALHOST;
    useReservePort = host;
    usePortBegin = portBegin;
  } else if (typeof portEnd === 'string') {
    usePortEnd = MAX_PORT;
    useHost = portEnd;
    useReservePort = reservePort ?? false;
    usePortBegin = portBegin;
  } else if (typeof host === 'string') {
    usePortEnd = MAX_PORT;
    useHost = host;
    useReservePort = reservePort ?? false;
    usePortBegin = portBegin;
  } else {
    usePortEnd = portEnd;
    useHost = host ?? LOCALHOST;
    useReservePort = reservePort ?? false;
    usePortBegin = portBegin;
  }

  if (usePortBegin > usePortEnd) {
    const temp = usePortBegin;
    usePortBegin = usePortEnd;
    usePortEnd = temp;
  }

  if (usePortBegin < 0) {
    usePortBegin = 0;
  }

  if (usePortEnd > MAX_PORT) {
    usePortEnd = MAX_PORT;
  }

  return new Promise((resolve, reject) => {
    const regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!regex.test(useHost)) {
      reject(new Error(`Invalid host ${useHost}`));
      return;
    }

    if (RESERVED_PORTS.includes(usePortBegin)) {
      findFreePort(usePortBegin + 1, usePortEnd, useHost, useReservePort).then(resolve, reject);
      return;
    }

    const server = net.createServer();
    server.on('listening', () => {
      if (useReservePort) {
        RESERVED_PORTS.push(portBegin);
      }
      server.close(() => resolve(portBegin));
    });
    server.on('error', () => {
      if (portEnd === portBegin) {
        server.close(() => reject(new Error(`No free port found between ${portBegin} and ${usePortEnd}`)));
        return;
      }

      server.close(() => findFreePort(usePortBegin, usePortEnd, useHost, useReservePort).then(resolve, reject));
    });

    server.listen(portBegin, useHost);
  });
}
