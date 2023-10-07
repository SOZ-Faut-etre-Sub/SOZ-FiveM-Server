import { Module } from '../../core/decorators/module';
import { BillboardProvider } from './billboard.provider';

@Module({
    providers: [BillboardProvider],
})
export class BillboardModule {}
