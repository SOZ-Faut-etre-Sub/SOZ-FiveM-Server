import { setMethodMetadata } from './reflect';

export const RouteMetadataKey = 'soz_core.decorator.http-route';

export type RouteMetadata = {
    path: string;
    method: string;
    config: RouteConfig;
};

export type RouteConfig = {
    auth: boolean;
};

export const Route = (method: string, path: string, config?: RouteConfig): MethodDecorator => {
    return (target, propertyKey) => {
        setMethodMetadata(
            RouteMetadataKey,
            {
                path,
                method,
                config: config || {
                    auth: true,
                },
            },
            target,
            propertyKey
        );
    };
};

export const Get = (path: string, config?: RouteConfig): MethodDecorator => {
    return Route('GET', path, config);
};

export const Post = (path: string, config?: RouteConfig): MethodDecorator => {
    return Route('POST', path, config);
};
