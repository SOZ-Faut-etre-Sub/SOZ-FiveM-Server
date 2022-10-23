import { JobType } from '../job';
import { VehicleCondition, VehicleModification } from '../vehicle';
import { DealershipId } from './dealership';
import { Garage } from './garage';

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

export type Vehicle = {
    model: string;
    hash: number;
    name: string;
    price: number;
    category: string;
    dealership?: DealershipId;
    requiredLicence?: string;
    size: number;
    jobName?: { [key in JobType]: string };
};

export enum VehicleCategory {
    Boats = 'Bateaux',
    Commercial = 'Commercial',
    Compacts = 'Compactes',
    Coupes = 'Coupés',
    Cycles = 'Vélos',
    Emergency = "Véhicules d'urgence",
    Helicopters = 'Hélicoptères',
    Industrial = 'Industriels',
    Military = 'Militaires',
    Motorcycles = 'Motos',
    Muscle = 'Grosses Cylindrées',
    'Off-road' = 'Tout-terrain',
    Openwheel = 'Ultra-rapide',
    Planes = 'Avions',
    Sedans = 'Berlines',
    Service = 'Service',
    Sportsclassics = 'Sportives Classiques',
    Sports = 'Sportives',
    Super = 'Super-sportives',
    Suvs = 'SUV',
    Trains = 'Trains',
    Utility = 'Utilitaires',
    Vans = 'Vans',
}
