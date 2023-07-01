import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { OnceLoader } from '../../core/loader/once.loader';
import { ClientEvent } from '../../shared/event';
import { FuelStationRepository } from './fuel.station.repository';
import { GarageRepository } from './garage.repository';
import { JobGradeRepository } from './job.grade.repository';
import { ClothingShopRepository } from './shop.repository';
import { UpwChargerRepository } from './upw.station.repository';
import { VehicleRepository } from './vehicle.repository';

@Provider()
export class RepositoryProvider {
    @Inject(GarageRepository)
    private garageRepository: GarageRepository;

    @Inject(JobGradeRepository)
    private jobGradeRepository: JobGradeRepository;

    @Inject(VehicleRepository)
    private vehicleRepository: VehicleRepository;

    @Inject(FuelStationRepository)
    private fuelStationRepository: FuelStationRepository;

    @Inject(UpwChargerRepository)
    private upwChargerRepository: UpwChargerRepository;
    @Inject(ClothingShopRepository)
    private clothingShopRepository: ClothingShopRepository;

    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    @Once(OnceStep.PlayerLoaded)
    public async onRepositoryStart() {
        await this.garageRepository.load();
        await this.jobGradeRepository.load();
        await this.vehicleRepository.load();
        await this.fuelStationRepository.load();
        await this.upwChargerRepository.load();
        await this.clothingShopRepository.load();

        this.onceLoader.trigger(OnceStep.RepositoriesLoaded);
    }

    @OnEvent(ClientEvent.REPOSITORY_SYNC_DATA)
    onSyncData(repositoryName: string, data: any) {
        switch (repositoryName) {
            case 'garage':
                this.garageRepository.update(data);
                break;
            case 'jobGrade':
                this.jobGradeRepository.update(data);
                break;
            case 'vehicle':
                this.vehicleRepository.update(data);
                break;
            case 'fuelStation':
                this.fuelStationRepository.update(data);
                break;
            case 'upwCharger':
                this.upwChargerRepository.update(data);
                break;
            case 'clothingShop':
                this.clothingShopRepository.update(data);
        }
    }
}
