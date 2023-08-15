import { DrugSeedlingRepository } from '@private/client/resources/drug.seedling.repository';
import { DrugSellLocationRepository } from '@private/client/resources/drug.sell.location.repository';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { OnceLoader } from '../../core/loader/once.loader';
import { ClientEvent } from '../../shared/event';
import { BillboardRepository } from './billboard.repository';
import { FuelStationRepository } from './fuel.station.repository';
import { GarageRepository } from './garage.repository';
import { HousingRepository } from './housing.repository';
import { JobGradeRepository } from './job.grade.repository';
import { RaceRepository } from './race.repository';
import { UnderTypesShopRepository } from './under_types.shop.repository';
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

    @Inject(UnderTypesShopRepository)
    private underTypesShopRepository: UnderTypesShopRepository;

    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    @Inject(DrugSeedlingRepository)
    private drugSeedlingRepository: DrugSeedlingRepository;

    @Inject(DrugSellLocationRepository)
    private drugSellLocationRepository: DrugSellLocationRepository;

    @Inject(RaceRepository)
    private raceRepository: RaceRepository;

    @Inject(BillboardRepository)
    private billboardRepository: BillboardRepository;

    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    @Once(OnceStep.PlayerLoaded)
    public async onRepositoryStart() {
        await this.garageRepository.load();
        await this.jobGradeRepository.load();
        await this.vehicleRepository.load();
        await this.fuelStationRepository.load();
        await this.upwChargerRepository.load();
        await this.housingRepository.load();
        await this.underTypesShopRepository.load();
        await this.drugSeedlingRepository.load();
        await this.drugSellLocationRepository.load();
        await this.raceRepository.load();
        await this.billboardRepository.load();

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
            case 'housing':
                this.housingRepository.update(data);
                break;
            case 'underTypesShop':
                this.underTypesShopRepository.update(data);
                break;
            case 'drugSeedling':
                this.drugSeedlingRepository.update(data);
                break;
            case 'drugSellLocation':
                this.drugSellLocationRepository.update(data);
                break;
            case 'billboard':
                this.billboardRepository.update(data);
                break;
        }
    }
}
