import { PlayerLicenceType } from './player';

export enum DrivingSchoolLicenseType {
    Car = PlayerLicenceType.Car,
    Truck = PlayerLicenceType.Truck,
    Moto = PlayerLicenceType.Moto,
    Heli = PlayerLicenceType.Heli,
}

export interface DrivingSchoolLicense {
    vehicle: {
        model: string;
        spawnPoints: { x: number; y: number; z: number; w: number }[];
    };
    price: number;
    icon: string;
    label: string;
    points: number;
}

export const DrivingSchoolConfig = {
    fadeDelay: 500, // in ms
    vehiclePlateText: 'P3RM15',
    blip: {
        name: 'Auto-école',
        sprite: 545,
        color: 25,
        scale: 0.8,
    },
    peds: {
        instructor: {
            model: 'cs_manuel',
            coords: { x: 0.0, y: 0.0, z: 0.0, w: 0.0 },
        },
        secretary: {
            model: 'u_f_y_princess',
            coords: { x: -815.99, y: -1357.3, z: 5.15, w: 309.49 },
        },
    },
    licenses: <Record<DrivingSchoolLicenseType, DrivingSchoolLicense>>{
        [DrivingSchoolLicenseType.Car]: {
            vehicle: {
                model: 'dilettante2',
                spawnPoints: [
                    { x: -809.18, y: -1319.61, z: 4.49, w: 170.42 },
                    { x: -814.58, y: -1296.18, z: 4.65, w: 170.07 },
                    { x: -798.43, y: -1315.28, z: 4.65, w: 351.13 },
                    { x: -817.49, y: -1311.57, z: 4.49, w: 350.02 },
                    { x: -808.2, y: -1297.81, z: 4.49, w: 170.29 },
                    { x: -791.33, y: -1293.64, z: 4.49, w: 350.16 },
                    { x: -811.17, y: -1312.57, z: 4.49, w: 349.04 },
                    { x: -804.08, y: -1291.58, z: 4.49, w: 351.07 },
                    { x: -786.28, y: -1301.15, z: 4.49, w: 173.05 },
                    { x: -798.86, y: -1299.54, z: 4.49, w: 169.81 },
                    { x: -810.36, y: -1290.87, z: 4.49, w: 350.15 },
                    { x: -745.45, y: -1313.55, z: 4.49, w: 49.7 },
                ],
            },
            price: 50,
            icon: 'c:driving-school/voiture.png',
            label: 'Permis voiture',
            points: 12,
        },
        [DrivingSchoolLicenseType.Truck]: {
            vehicle: {
                model: 'boxville4',
                spawnPoints: [
                    { x: -828.87, y: -1264.37, z: 4.57, w: 139.59 },
                    { x: -853.91, y: -1257.2, z: 4.9, w: 229.32 },
                    { x: -807.63, y: -1276.53, z: 4.9, w: 171.22 },
                    { x: -785.54, y: -1280.2, z: 4.9, w: 169.75 },
                    { x: -848.95, y: -1274.45, z: 4.9, w: 300.18 },
                    { x: -737.99, y: -1303.16, z: 4.9, w: 50.94 },
                    { x: -781.97, y: -1295.58, z: 4.9, w: 349.38 },
                    { x: -794.9, y: -1278.47, z: 4.9, w: 169.72 },
                    { x: -775.98, y: -1281.71, z: 4.9, w: 170.89 },
                    { x: -817.01, y: -1274.66, z: 4.9, w: 170.51 },
                    { x: -857.07, y: -1267.6, z: 4.9, w: 301.25 },
                    { x: -816.74, y: -1289.1, z: 4.9, w: 350.28 },
                ],
            },
            price: 50,
            icon: 'c:driving-school/camion.png',
            label: 'Permis camion',
            points: 12,
        },
        [DrivingSchoolLicenseType.Moto]: {
            vehicle: {
                model: 'faggio',
                spawnPoints: [
                    { x: -805.25, y: -1336.23, z: 4.62, w: 315.04 },
                    { x: -780.41, y: -1341.65, z: 4.63, w: 7.65 },
                    { x: -833.34, y: -1331.21, z: 4.63, w: 320.92 },
                    { x: -765.9, y: -1336.77, z: 4.64, w: 51.54 },
                    { x: -796.52, y: -1337.86, z: 4.63, w: 19.72 },
                    { x: -763.39, y: -1304.49, z: 4.63, w: 8.31 },
                    { x: -770.51, y: -1342.66, z: 4.64, w: 44.23 },
                    { x: -802.66, y: -1319.68, z: 4.48, w: 169.33 },
                    { x: -792.86, y: -1301.13, z: 4.48, w: 169.49 },
                    { x: -804.82, y: -1312.5, z: 4.48, w: 349.23 },
                    { x: -724.88, y: -1298.75, z: 4.48, w: 50.02 },
                    { x: -775.24, y: -1347.36, z: 4.63, w: 9.47 },
                ],
            },
            price: 50,
            icon: 'c:driving-school/moto.png',
            label: 'Permis moto',
            points: 12,
        },
        [DrivingSchoolLicenseType.Heli]: {
            vehicle: {
                model: 'seasparrow2',
                spawnPoints: [
                    { x: -744.84, y: -1434.05, z: 4.0, w: 234.75 },
                    { x: -762.31, y: -1453.83, z: 4.0, w: 234.75 },
                    { x: -724.99, y: -1444.38, z: 4.0, w: 134.21 },
                    { x: -700.73, y: -1447.2, z: 4.0, w: 49.75 },
                    { x: -722.72, y: -1473.04, z: 4.0, w: 58.68 },
                    { x: -744.15, y: -1495.75, z: 4.0, w: 4.52 },
                ],
            },
            price: 600,
            icon: 'c:driving-school/heli.png',
            label: 'Permis hélicoptère',
            points: 12,
        },
    },
};
