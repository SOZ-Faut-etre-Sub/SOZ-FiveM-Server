import { Module } from '../../../core/decorators/module';
import { MdrProvider } from './mdr.provider';

@Module({
    providers: [MdrProvider],
})
export class MdrModule {}
