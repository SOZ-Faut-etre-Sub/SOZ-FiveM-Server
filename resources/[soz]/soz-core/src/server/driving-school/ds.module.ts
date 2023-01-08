import { Module } from '../../core/decorators/module';
import { DrivingSchoolProvider } from './ds.provider';

@Module({
    providers: [DrivingSchoolProvider],
})
export class DrivingSchoolModule {}
