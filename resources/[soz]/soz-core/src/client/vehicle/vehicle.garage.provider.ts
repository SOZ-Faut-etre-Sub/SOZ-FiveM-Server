import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { Garage, GarageCategory, GarageType } from '../../shared/vehicle/garage';
import { BlipFactory } from '../blip';
import { GarageRepository } from '../resources/garage.repository';
import { TargetFactory } from '../target/target.factory';
import { ObjectFactory } from '../world/object.factory';

type BlipConfig = {
    name: string;
    sprite: number;
    color: number;
};

const BlipConfigMap: Partial<Record<GarageType, Partial<Record<GarageCategory, BlipConfig | null>>>> = {
    [GarageType.Private]: {
        [GarageCategory.Car]: { name: 'Parking Privé', sprite: 357, color: 5 },
    },
    [GarageType.Public]: {
        [GarageCategory.Car]: { name: 'Parking public', sprite: 357, color: 3 },
        [GarageCategory.Air]: { name: 'Héliport Public', sprite: 360, color: 3 },
    },
    [GarageType.Depot]: {
        [GarageCategory.Car]: { name: 'Fourrière', sprite: 68, color: 3 },
    },
};

@Provider()
export class VehicleGarageProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(GarageRepository)
    private garageRepository: GarageRepository;

    @Inject(ObjectFactory)
    private objectFactory: ObjectFactory;

    @Once(OnceStep.RepositoriesLoaded)
    public init() {
        const garageList = this.garageRepository.get();
        const jobGaragePayStation = GetHashKey('soz_prop_paystation');

        for (const garageIdentifier of Object.keys(garageList)) {
            const garage = garageList[garageIdentifier];
            const blipConfig = BlipConfigMap[garage.type]?.[garage.category] ?? null;

            if (blipConfig) {
                this.blipFactory.remove(`garage_${garageIdentifier}`);
                this.blipFactory.create(`garage_${garageIdentifier}`, {
                    name: blipConfig.name,
                    coords: { x: garage.zone.center[0], y: garage.zone.center[1], z: garage.zone.center[2] },
                    sprite: blipConfig.sprite,
                    color: blipConfig.color,
                });
            }

            const targets = [];

            if (garage.type === GarageType.Public) {
                targets.push({
                    label: 'Accéder au parking public',
                    icon: 'c:garage/ParkingPublic.png',
                    action: () => {
                        this.enterGarage(garage);
                    },
                });
            }

            if (garage.type === GarageType.Private) {
                targets.push({
                    label: 'Accéder au parking privé',
                    icon: 'c:garage/ParkingPrive.png',
                    action: () => {
                        this.enterGarage(garage);
                    },
                });
            }

            if (garage.type === GarageType.Depot) {
                targets.push({
                    label: 'Accéder à la fourrière',
                    icon: 'c:garage/Fourriere.png',
                    action: () => {
                        this.enterGarage(garage);
                    },
                });
            }

            if (garage.type === GarageType.Job) {
                this.objectFactory.create(jobGaragePayStation, [...garage.zone.center, garage.zone.heading], true);
                targets.push({
                    label: 'Accéder au parking entreprise',
                    icon: 'c:garage/GarageEntreprise.png',
                    action: () => {
                        this.enterGarage(garage);
                    },
                });
            }

            if (targets.length > 0) {
                this.targetFactory.createForBoxZone(`garage_enter_${garageIdentifier}`, garage.zone, targets, 2.5);
            }
        }
    }

    private enterGarage(garage: Garage) {
        // @TODO : Open garage menu
    }
}
