export const setMethodMetadata = (key: string, value: any, target: any, propertyKey: string | symbol) => {
    const metadata = Reflect.getMetadata(key, target) || {};
    metadata[propertyKey] = value;

    Reflect.defineMetadata(key, metadata, target);
};

export const addMethodMetadata = (key: string, value: any, target: any, propertyKey: string | symbol) => {
    const metadata = Reflect.getMetadata(key, target) || {};
    metadata[propertyKey] ||= [];
    metadata[propertyKey].push(value);

    Reflect.defineMetadata(key, metadata, target);
};

export const getMethodMetadata = <T>(key: string, target: any): Record<string, T> => {
    return Reflect.getMetadata(key, target) || ({} as Record<string, T>);
};
