import { Module } from '@public/core/decorators/module';

import { PropsProvider } from './props.provider';

@Module({
    providers: [PropsProvider],
})
export class PropsModule {}
