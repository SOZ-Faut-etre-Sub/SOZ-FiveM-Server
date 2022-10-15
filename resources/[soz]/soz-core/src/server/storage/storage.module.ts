import { Module } from '../../core/decorators/module';
import { StorageProvider } from './storage.provider';

@Module({
    providers: [StorageProvider],
})
export class StorageModule {}
