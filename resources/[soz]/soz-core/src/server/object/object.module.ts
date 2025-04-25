import { Module } from '@core/decorators/module';

import { ObjectAttachedProvider } from './object.attached.provider';
import { ObjectPersistentProvider } from './object.persistent.provider';
import { ObjectProvider } from './object.provider';
import { PropImageProvider } from './prop.image.provider';

@Module({
    providers: [ObjectPersistentProvider, ObjectProvider, ObjectAttachedProvider, PropImageProvider],
})
export class ObjectModule {}
