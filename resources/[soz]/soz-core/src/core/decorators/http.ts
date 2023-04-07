import { setMethodMetadata } from './reflect';

export const RouteMetadataKey = 'soz_core.decorator.http-route';

export type RouteMetadata = {
    path: string;
    method: string;
};

export const Route = (method: string, path: string): MethodDecorator => {
    return (target, propertyKey) => {
        setMethodMetadata(
            RouteMetadataKey,
            {
                path,
                method,
            },
            target,
            propertyKey
        );
    };
};

export const Get = (path: string): MethodDecorator => {
    return Route('GET', path);
};

export const Post = (path: string): MethodDecorator => {
    return Route('POST', path);
};
