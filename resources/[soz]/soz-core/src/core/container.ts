import { Container as ContainerInversify } from 'inversify';

export const ContainerMetadata = 'soz_core.decorator.container';

const getContainer = (): ContainerInversify => {
    const c: ContainerInversify = Reflect.getMetadata(ContainerMetadata, global);
    return c ? c : createContainer();
};

const createContainer = (): ContainerInversify => {
    const container = new ContainerInversify({
        skipBaseClassChecks: true,
        autoBindInjectable: true,
        defaultScope: 'Singleton',
    });

    Reflect.defineMetadata(ContainerMetadata, container, global);

    return container;
};

export const unloadContainer = (): void => {
    Reflect.deleteMetadata(ContainerMetadata, global);
};

export const Container: ContainerInversify = getContainer();
