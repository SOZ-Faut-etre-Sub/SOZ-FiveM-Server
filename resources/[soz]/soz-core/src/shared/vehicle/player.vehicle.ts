import { JobType } from '../job';
import { VehicleCategory, VehicleCondition, VehicleModification } from './vehicle';

export enum PlayerVehicleState {
    Out = 0,
    InGarage = 1,
    InPound = 2,
    InJobGarage = 3,
    Missing = 4,
    Destroyed = 5,
}
export type PlayerVehicle = {
    id: number;
    license: string;
    citizenid: string;
    model: number;
    modelName: string;
    modification: VehicleModification;
    condition: VehicleCondition;
    plate: string;
    garage: string;
    job: JobType | null;
    category: VehicleCategory;
    state: PlayerVehicleState;
};
