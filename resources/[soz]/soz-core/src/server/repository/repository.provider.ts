import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { OnceLoader } from '../../core/loader/once.loader';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { RpcServerEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';
import { FuelStationRepository } from './fuel.station.repository';
import { GarageRepository } from './garage.repository';
import { HousingRepository } from './housing.repository';
import { JobGradeRepository } from './job.grade.repository';
import { Repository } from './repository';
import { UpwChargerRepository } from './upw.charger.repository';
import { UpwStationRepository } from './upw.station.repository';
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

    @Inject(FuelStationRepository)
    private fuelStationRepository: FuelStationRepository;

    @Inject(UpwChargerRepository)
    private upwChargerRepository: UpwChargerRepository;

    @Inject(UpwStationRepository)
    private upwStationRepository: UpwStationRepository;

    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    private repositories: Record<string, Repository<any>> = {};

    @Once()
    public setup() {
        this.repositories['garage'] = this.garageRepository;
        this.repositories['vehicle'] = this.vehicleRepository;
        this.repositories['jobGrade'] = this.jobGradeRepository;
        this.repositories['fuelStation'] = this.fuelStationRepository;
        this.repositories['upwCharger'] = this.upwChargerRepository;
        this.repositories['upwStation'] = this.upwStationRepository;
        this.repositories['housing'] = this.housingRepository;
    }

    @Once(OnceStep.DatabaseConnected)
    public async init() {
        for (const repositoryName of Object.keys(this.repositories)) {
            await this.repositories[repositoryName].init();
        }

        this.onceLoader.trigger(OnceStep.RepositoriesLoaded);
    }

    @Rpc(RpcServerEvent.REPOSITORY_GET_DATA)
    public async getData(source: number, repositoryName: string): Promise<any> {
        if (this.repositories[repositoryName]) {
            return await this.repositories[repositoryName].get();
        }

        return null;
    }

    public async refresh(repositoryName: string): Promise<any | null> {
        if (this.repositories[repositoryName]) {
            const data = await this.repositories[repositoryName].refresh();

            TriggerClientEvent(ClientEvent.REPOSITORY_SYNC_DATA, -1, repositoryName, data);

            return data;
        }

        return null;
    }
}
