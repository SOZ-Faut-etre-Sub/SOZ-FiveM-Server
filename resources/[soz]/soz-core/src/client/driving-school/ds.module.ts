import { Module } from '../../core/decorators/module';
import { DrivingSchoolProvider } from './ds.provider';
import { ExamProvider } from './exam.provider';

@Module({
    providers: [DrivingSchoolProvider, ExamProvider],
})
export class DrivingSchoolModule {}
