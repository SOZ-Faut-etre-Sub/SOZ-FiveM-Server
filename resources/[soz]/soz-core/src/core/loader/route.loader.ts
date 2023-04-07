import { RouteMetadata, RouteMetadataKey } from '../decorators/http';
import { Inject, Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';
import { Response } from '../http/response';
import { Logger } from '../logger';

@Injectable()
export class RouteLoader {
    private routeList: Record<string, Record<string, any>> = {};

    @Inject(Logger)
    private logger: Logger;

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

            this.routeList[route.path][route.method] = method;
        }

        SetHttpHandler(async (req, res) => {
            const now = new Date().getTime();
            const headers = {};

            for (const header of Object.keys(req.headers)) {
                headers[header.toLowerCase()] = req.headers[header];
            }

            const body = new Promise(resolve => {
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

            let response = Response.notFound();

            if (this.routeList[req.path] && this.routeList[req.path][req.method]) {
                const handler = this.routeList[req.path][req.method];
                response = await handler(request);
            }

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

    public unload(): void {}
}
