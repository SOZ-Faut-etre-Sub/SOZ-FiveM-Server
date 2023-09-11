import { decorate, inject, injectable, multiInject } from 'inversify';

import { Container } from '../container';

export const Inject = inject;

export const MultiInject = multiInject;

export const Injectable =
    (...token: any[]): ClassDecorator =>
    target => {
        decorate(injectable(), target);

        if (token.length === 0) {
            token.push(target);
        }

        const first = token.shift();
        Container.bind(first)
            .to(target as any)
            .inSingletonScope();

        for (const item of token) {
            Container.bind(item).toService(first);
        }
    };
