import { RepositoryMapping } from '../../shared/repository';
import { addMethodMetadata } from './reflect';

export const RepositoryListenerMetadataKey = 'soz_core.decorator.repository';

export type RepositoryListenerType = 'insert' | 'update' | 'delete';

export type RepositoryListenerMetadata<T extends keyof RepositoryMapping> = {
    type: RepositoryListenerType;
    entityType: T;
};

export const RepositoryInsert = <R extends keyof RepositoryMapping, T extends RepositoryMapping[R]>(data: R) => {
    return (
        target: any,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<(data: T) => void | Promise<void>>
    ) => {
        addMethodMetadata(
            RepositoryListenerMetadataKey,
            {
                type: 'insert',
                entityType: data,
            } as RepositoryListenerMetadata<R>,
            target,
            propertyKey
        );

        return descriptor;
    };
};

export const RepositoryUpdate = <R extends keyof RepositoryMapping, T extends RepositoryMapping[R]>(data: R) => {
    return (target, propertyKey, descriptor: TypedPropertyDescriptor<(data: T) => void | Promise<void>>) => {
        addMethodMetadata(
            RepositoryListenerMetadataKey,
            {
                type: 'update',
                entityType: data,
            } as RepositoryListenerMetadata<R>,
            target,
            propertyKey
        );

        return descriptor;
    };
};

export const RepositoryDelete = <R extends keyof RepositoryMapping, T extends RepositoryMapping[R]>(data: R) => {
    return (target, propertyKey, descriptor: TypedPropertyDescriptor<(data: T) => void | Promise<void>>) => {
        addMethodMetadata(
            RepositoryListenerMetadataKey,
            {
                type: 'delete',
                entityType: data,
            } as RepositoryListenerMetadata<R>,
            target,
            propertyKey
        );

        return descriptor;
    };
};
