import { Histogram } from 'prom-client';

import { RouteConfig, RouteMetadata, RouteMetadataKey } from '../decorators/http';
import { Inject, Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';
import { Request } from '../http/request';
import { Response } from '../http/response';
import { Logger } from '../logger';

type Route = {
    handler: (request: Request) => Promise<Response> | Response;
    config: RouteConfig;
};

@Injectable()
export class RouteLoader {
    private routeList: Record<string, Record<string, Route>> = {};

    @Inject(Logger)
    private logger: Logger;

    private httpDurationHistogram: Histogram<string> = new Histogram({
        name: 'soz_core_http',
        help: 'Http route execution histogram',
        labelNames: ['path', 'method'],
    });

    private expectedAuthHeader = '';

    public constructor() {
        const username = GetConvar('soz_api_username', 'admin');
        const password = GetConvar('soz_api_password', 'admin');

        this.expectedAuthHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    }

    public load(provider): void {
        const routeMethodList = getMethodMetadata<RouteMetadata>(RouteMetadataKey, provider);

        for (const methodName of Object.keys(routeMethodList)) {
            const route = routeMethodList[methodName];
            const method = provider[methodName].bind(provider);

            if (!this.routeList[route.path]) {
                this.routeList[route.path] = {};
            }

            if (this.routeList[route.path][route.method]) {
                this.logger.warn(`route ${route.path} already exists with method ${route.method}`);
            }

            this.routeList[route.path][route.method] = {
                handler: method,
                config: route.config,
            };
        }

        SetHttpHandler(async (req, res) => {
            const now = new Date().getTime();
            const headers = {};

            for (const header of Object.keys(req.headers)) {
                headers[header.toLowerCase()] = req.headers[header];
            }

            const body = new Promise<string>(resolve => {
                req.setDataHandler(data => {
                    resolve(data);
                });
            });

            const request = {
                method: req.method,
                path: req.path,
                headers,
                body,
            };

            const end = this.httpDurationHistogram.startTimer({
                path: request.path,
                method: request.method,
            });
            const response = await this.handleRequest(request);
            end();

            res.writeHead(response.getStatusCode(), response.getHeadersForCfx());
            res.write(response.getBody());
            res.send();

            const duration = new Date().getTime() - now;

            this.logger.debug(
                `[HTTP] ${req.method} ${req.path} ${response.getStatusCode()} [${req.address}] [${duration}] [${
                    headers['user-agent']
                }]`
            );
        });
    }

    private async handleRequest(request: Request): Promise<Response> {
        if (!this.routeList[request.path]) {
            return Response.notFound();
        }

        const route = this.routeList[request.path][request.method];

        if (!route) {
            return Response.notFound();
        }

        if (route.config.auth) {
            const authHeader = request.headers['authorization'] || '';

            if (authHeader !== this.expectedAuthHeader) {
                return Response.unauthorized();
            }
        }

        try {
            return route.handler(request);
        } catch (e) {
            this.logger.error(`[HTTP] Request failed for ${request.method} ${request.path} ${e.message}`, e);

            return Response.internalServerError();
        }
    }

    public unload(): void {}
}
