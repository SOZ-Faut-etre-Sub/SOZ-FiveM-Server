import { decorate, inject, injectable } from 'inversify';

import { Container } from '../container';

export const Inject = inject;

export const Injectable =
    (token?: any): ClassDecorator =>
    target => {
        decorate(injectable(), target);
        Container.bind(token || target)
            .to(target as any)
            .inSingletonScope();
    };
