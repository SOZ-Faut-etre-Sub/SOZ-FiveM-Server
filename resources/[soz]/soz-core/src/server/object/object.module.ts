import { Module } from '@core/decorators/module';

import { ObjectAttachedProvider } from './object.attached.provider';
import { ObjectPersistentProvider } from './object.persistent.provider';
import { ObjectProvider } from './object.provider';

@Module({
    providers: [ObjectPersistentProvider, ObjectProvider, ObjectAttachedProvider],
})
export class ObjectModule {}
