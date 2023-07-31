import { Module } from '@core/decorators/module';

import { ObjectPersistentProvider } from './object.persistent.provider';
import { ObjectProvider } from './object.provider';

@Module({
    providers: [ObjectPersistentProvider, ObjectProvider],
})
export class ObjectModule {}
