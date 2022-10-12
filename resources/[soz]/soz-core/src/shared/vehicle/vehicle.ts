import { JobType } from '../job';
import { DealershipId } from './dealership';

export type Vehicle = {
    model: string;
    hash: number;
    name: string;
    price: number;
    category: string;
    dealership?: DealershipId;
    requiredLicence?: string;
    size: number;
    jobName?: {
        [key in JobType]?: string;
    };
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
