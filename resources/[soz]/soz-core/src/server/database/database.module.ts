import { Module } from '../../core/decorators/module';
import { PrismaService } from './prisma.service';

@Module({
    providers: [PrismaService],
})
export class DatabaseModule {}
