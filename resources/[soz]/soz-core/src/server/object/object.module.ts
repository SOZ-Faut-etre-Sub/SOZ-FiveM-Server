import { Module } from '@public/core/decorators/module';

import { ObjectProvider } from './object.provider';

@Module({
    providers: [ObjectProvider],
})
export class ShopModule {}
