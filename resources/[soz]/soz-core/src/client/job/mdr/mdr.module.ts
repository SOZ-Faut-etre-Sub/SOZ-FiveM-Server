import { Module } from '@core/decorators/module';

import { MandatoryProvider } from './mdr.provider';

@Module({
    providers: [MandatoryProvider],
})
export class MandatoryModule {}
