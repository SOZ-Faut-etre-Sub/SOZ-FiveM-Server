import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject, Injectable } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { RpcEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';
import { GarageRepository } from './garage.repository';
import { JobGradeRepository } from './job.grade.repository';
import { Repository } from './repository';
import { VehicleRepository } from './vehicle.repository';

@Provider()
export class RepositoryProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(GarageRepository)
    private garageRepository: GarageRepository;

    @Inject(VehicleRepository)
    private vehicleRepository: VehicleRepository;

    @Inject(JobGradeRepository)
    private jobGradeRepository: JobGradeRepository;

    private repositories: Record<string, Repository<any>> = {};

    @Once(OnceStep.DatabaseConnected)
    public async init() {
        this.repositories['garage'] = this.garageRepository;
        this.repositories['vehicle'] = this.vehicleRepository;
        this.repositories['jobGrade'] = this.jobGradeRepository;

        for (const repositoryName of Object.keys(this.repositories)) {
            await this.repositories[repositoryName].init();
        }
    }

    @Rpc(RpcEvent.REPOSITORY_GET_DATA)
    public async getData(source: number, repositoryName: string): Promise<any> {
        if (this.repositories[repositoryName]) {
            return this.repositories[repositoryName].get();
        }

        return null;
    }

    @OnEvent(ServerEvent.REPOSITORY_REFRESH_DATA)
    public async refresh(repositoryName: string) {
        if (this.repositories[repositoryName]) {
            const data = await this.repositories[repositoryName].refresh();

            TriggerClientEvent(ClientEvent.REPOSITORY_SYNC_DATA, -1, repositoryName, data);
        }
    }
}
