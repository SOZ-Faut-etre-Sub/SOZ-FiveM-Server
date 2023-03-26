import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { BlipFactory } from '../blip';
import { UpwChargerRepository } from '../resources/upw.station.repository';

type CurrentStationPistol = {
    object: number;
    rope: number;
    entity: number;
    station: string;
    filling: boolean;
};

@Provider()
export class VehicleElectricProvider {
    @Inject(UpwChargerRepository)
    private upwChargerRepository: UpwChargerRepository;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Once(OnceStep.RepositoriesLoaded)
    public async onRepositoryLoaded() {
        let upwCharger = this.upwChargerRepository.get();

        while (!upwCharger) {
            await wait(100);
            upwCharger = this.upwChargerRepository.get();
        }
    }
}
