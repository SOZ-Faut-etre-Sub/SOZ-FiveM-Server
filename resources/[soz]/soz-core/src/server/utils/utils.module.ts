import { Module } from '@public/core/decorators/module';

import { UtilsProvider } from './utils.provider';

@Module({
    providers: [UtilsProvider],
})
export class UtilsModule {}
