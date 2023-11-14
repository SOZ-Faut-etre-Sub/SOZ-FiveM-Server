import { Module } from '../../core/decorators/module';
import { JobBellProvider } from './job.bell.provider';
import { JobCloakroomProvider } from './job.cloakroom.provider';
import { JobDutyProvider } from './job.duty.provider';
import { JobEmployeeProvider } from './job.employee.provider';
import { JobInvoiceProvider } from './job.invoice.provider';
import { JobMenuProvider } from './job.menu.provider';
import { JobProvider } from './job.provider';

@Module({
    providers: [
        JobBellProvider,
        JobCloakroomProvider,
        JobDutyProvider,
        JobEmployeeProvider,
        JobInvoiceProvider,
        JobMenuProvider,
        JobProvider,
    ],
})
export class JobModule {}
