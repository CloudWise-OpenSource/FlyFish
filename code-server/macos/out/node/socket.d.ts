/// <reference types="node" />
import * as net from "net";
/**
 * Provides a way to proxy a TLS socket. Can be used when you need to pass a
 * socket to a child process since you can't pass the TLS socket.
 */
export declare class SocketProxyProvider {
    private readonly onProxyConnect;
    private proxyPipe;
    private _proxyServer?;
    private readonly proxyTimeout;
    /**
     * Stop the proxy server.
     */
    stop(): void;
    /**
     * Create a socket proxy for TLS sockets. If it's not a TLS socket the
     * original socket is returned. This will spawn a proxy server on demand.
     */
    createProxy(socket: net.Socket): Promise<net.Socket>;
    private startProxyServer;
    findFreeSocketPath(basePath: string, maxTries?: number): Promise<string>;
}
