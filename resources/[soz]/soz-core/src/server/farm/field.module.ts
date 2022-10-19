import { Module } from '../../core/decorators/module';
import { FieldProvider } from './field.provider';

@Module({
    providers: [FieldProvider],
})
export class FieldModule {}
