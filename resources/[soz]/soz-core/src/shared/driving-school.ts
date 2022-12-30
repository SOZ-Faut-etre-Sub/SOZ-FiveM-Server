import { Notifier } from '../client/notifier';
import { PhoneService } from '../client/phone/phone.service';
import { PlayerService } from '../client/player/player.service';
import { VehicleSeatbeltProvider } from '../client/vehicle/vehicle.seatbelt.provider';
import { PlayerLicenceType } from './player';
import { Vector3, Vector4 } from './polyzone/vector';

export type Checkpoint = {
    coords: Vector3;
    message?: string;
    licenses?: DrivingSchoolLicenseType[];
};

export type DrivingSchoolLicense = {
    licenseType: DrivingSchoolLicenseType;
    vehicle: {
        model: string;
        spawnPoints: Vector4[];
    };
    price: number;
    icon: string;
    label: string;
    points: number;
    marker: Marker;
    checkpointCount: number;
    finalCheckpoint: Checkpoint;
};

export enum DrivingSchoolLicenseType {
    Car = PlayerLicenceType.Car,
    Truck = PlayerLicenceType.Truck,
    Moto = PlayerLicenceType.Moto,
    Heli = PlayerLicenceType.Heli,
}

type Marker = {
    type: number;
    typeFinal: number;
    size: number;
    color: MarkerColor;
};

type MarkerColor = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export type PenaltyContext = {
    phoneService: PhoneService;
    playerService: PlayerService;
    notifier: Notifier;
    seatbeltProvider: VehicleSeatbeltProvider;
    undrivableVehicles: number[];
    vehicle: number;
};

const markerColor: MarkerColor = { r: 12, g: 123, b: 86, a: 150 };

const markers: Record<string, Marker> = {
    landVehicle: { type: 47, typeFinal: 4, size: 3.0, color: markerColor },
    airVehicle: { type: 42, typeFinal: 4, size: 10.0, color: markerColor },
};

const finalCheckpoints: Record<string, Checkpoint> = {
    landVehicle: {
        coords: [-763.07, -1322.39, 3.42],
        message: 'Tu es arrivé au bout. Bien joué !',
    },
    airVehicle: {
        coords: [-745.25, -1468.67, 4.0],
        message: 'Très beau vol. Bien joué !',
    },
};

export const DrivingSchoolConfig = {
    fadeDelay: 500, // in ms
    playerDefaultLocation: <Vector4>[-806.57, -1344.53, 5.5, 150.0],
    vehiclePlateText: 'P3RM15',
    maxGracePeriod: 4000, // in ms
    gracePeriodIncrement: 200, // in ms
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
    startSpeeches: [
        {
            message: 'Ton examen va débuter. Boucle ta ceinture et nous pouvons partir.',
            exclude: [DrivingSchoolLicenseType.Moto],
        },
        {
            message: 'Suis ton GPS à allure modérée, et respecte les autres usagers de la route.',
        },
    ],
    licenses: <Record<DrivingSchoolLicenseType, DrivingSchoolLicense>>{
        [DrivingSchoolLicenseType.Car]: {
            licenseType: DrivingSchoolLicenseType.Car,
            vehicle: {
                model: 'dilettante2',
                spawnPoints: [
                    [-809.18, -1319.61, 4.49, 170.42],
                    [-814.58, -1296.18, 4.65, 170.07],
                    [-798.43, -1315.28, 4.65, 351.13],
                    [-817.49, -1311.57, 4.49, 350.02],
                    [-808.2, -1297.81, 4.49, 170.29],
                    [-791.33, -1293.64, 4.49, 350.16],
                    [-811.17, -1312.57, 4.49, 349.04],
                    [-804.08, -1291.58, 4.49, 351.07],
                    [-786.28, -1301.15, 4.49, 173.05],
                    [-798.86, -1299.54, 4.49, 169.81],
                    [-810.36, -1290.87, 4.49, 350.15],
                    [-745.45, -1313.55, 4.49, 49.7],
                ],
            },
            price: 50,
            icon: 'c:driving-school/voiture.png',
            label: 'Permis voiture',
            points: 12,
            marker: markers.landVehicle,
            checkpointCount: 6,
            finalCheckpoint: finalCheckpoints.landVehicle,
        },
        [DrivingSchoolLicenseType.Truck]: {
            licenseType: DrivingSchoolLicenseType.Truck,
            vehicle: {
                model: 'boxville4',
                spawnPoints: [
                    [-828.87, -1264.37, 4.57, 139.59],
                    [-853.91, -1257.2, 4.9, 229.32],
                    [-807.63, -1276.53, 4.9, 171.22],
                    [-785.54, -1280.2, 4.9, 169.75],
                    [-848.95, -1274.45, 4.9, 300.18],
                    [-737.99, -1303.16, 4.9, 50.94],
                    [-781.97, -1295.58, 4.9, 349.38],
                    [-794.9, -1278.47, 4.9, 169.72],
                    [-775.98, -1281.71, 4.9, 170.89],
                    [-817.01, -1274.66, 4.9, 170.51],
                    [-857.07, -1267.6, 4.9, 301.25],
                    [-816.74, -1289.1, 4.9, 350.28],
                ],
            },
            price: 50,
            icon: 'c:driving-school/camion.png',
            label: 'Permis camion',
            points: 12,
            marker: markers.landVehicle,
            checkpointCount: 6,
            finalCheckpoint: finalCheckpoints.landVehicle,
        },
        [DrivingSchoolLicenseType.Moto]: {
            licenseType: DrivingSchoolLicenseType.Moto,
            vehicle: {
                model: 'faggio',
                spawnPoints: [
                    [-805.25, -1336.23, 4.62, 315.04],
                    [-780.41, -1341.65, 4.63, 7.65],
                    [-833.34, -1331.21, 4.63, 320.92],
                    [-765.9, -1336.77, 4.64, 51.54],
                    [-796.52, -1337.86, 4.63, 19.72],
                    [-763.39, -1304.49, 4.63, 8.31],
                    [-770.51, -1342.66, 4.64, 44.23],
                    [-802.66, -1319.68, 4.48, 169.33],
                    [-792.86, -1301.13, 4.48, 169.49],
                    [-804.82, -1312.5, 4.48, 349.23],
                    [-724.88, -1298.75, 4.48, 50.02],
                    [-775.24, -1347.36, 4.63, 9.47],
                ],
            },
            price: 50,
            icon: 'c:driving-school/moto.png',
            label: 'Permis moto',
            points: 12,
            marker: markers.landVehicle,
            checkpointCount: 6,
            finalCheckpoint: finalCheckpoints.landVehicle,
        },
        [DrivingSchoolLicenseType.Heli]: {
            licenseType: DrivingSchoolLicenseType.Heli,
            vehicle: {
                model: 'seasparrow2',
                spawnPoints: [
                    [-744.84, -1434.05, 4.0, 234.75],
                    [-762.31, -1453.83, 4.0, 234.75],
                    [-724.99, -1444.38, 4.0, 134.21],
                    [-700.73, -1447.2, 4.0, 49.75],
                    [-722.72, -1473.04, 4.0, 58.68],
                    [-744.15, -1495.75, 4.0, 4.52],
                ],
            },
            price: 600,
            icon: 'c:driving-school/heli.png',
            label: 'Permis hélicoptère',
            points: 12,
            marker: markers.airVehicle,
            checkpointCount: 5,
            finalCheckpoint: finalCheckpoints.airVehicle,
        },
    },
};

export const Checkpoints: Checkpoint[] = [
    {
        coords: [-606.1, -957.79, 20.39],
        message: 'Ici, ce sont les bureaux de ~p~Twitch News~s~. Ils ne racontent que des salades…',
        licenses: [DrivingSchoolLicenseType.Car, DrivingSchoolLicenseType.Truck, DrivingSchoolLicenseType.Moto],
    },
    {
        coords: [31.24, -767.01, 42.67],
        message: 'Connaissez-vous Stonk Depository ?',
        licenses: [DrivingSchoolLicenseType.Car, DrivingSchoolLicenseType.Truck, DrivingSchoolLicenseType.Moto],
    },
    {
        coords: [248.3, -369.19, 42.89],
        message: "T'auras besoin de ton permis si tu veux un job du Pole emploi, alors concentre-toi !",
        licenses: [DrivingSchoolLicenseType.Car, DrivingSchoolLicenseType.Truck, DrivingSchoolLicenseType.Moto],
    },
    {
        coords: [667.22, -27.01, 80.96],
        message: 'LSPD Vinewood. Au premier excès de vitesse, tu finis ici !',
        licenses: [DrivingSchoolLicenseType.Car, DrivingSchoolLicenseType.Truck, DrivingSchoolLicenseType.Moto],
    },
    {
        coords: [204.08, 195.72, 104.01],
        message: "La Pacific Bank. Je crois que c'est ici qu'ils rendent l'argent.",
        licenses: [DrivingSchoolLicenseType.Car, DrivingSchoolLicenseType.Truck, DrivingSchoolLicenseType.Moto],
    },
    {
        coords: [807.06, -1290.38, 24.72],
        message: "LSPD, La Mesa. C'est cette patrouille autoroutière qui te coinceras si tu fais n'importe quoi…",
        licenses: [DrivingSchoolLicenseType.Car, DrivingSchoolLicenseType.Truck, DrivingSchoolLicenseType.Moto],
    },
    {
        coords: [305.58, -1367.15, 30.44],
        message: "Les mauvais conducteurs finissent souvent ici, à l'Hôpital !",
        licenses: [DrivingSchoolLicenseType.Car, DrivingSchoolLicenseType.Truck, DrivingSchoolLicenseType.Moto],
    },
    {
        coords: [432.83, -1634.1, 28.55],
        message: 'Ta maman ne sera pas fière si tu dois venir chercher ta voiture à cette fourrière…',
        licenses: [DrivingSchoolLicenseType.Car, DrivingSchoolLicenseType.Truck, DrivingSchoolLicenseType.Moto],
    },
    {
        coords: [-222.02, -2053.33, 26.06],
        message: 'L\'affiche dit : "ZEvent, du 8 au 11 Septembre 2022."',
        licenses: [DrivingSchoolLicenseType.Car, DrivingSchoolLicenseType.Truck, DrivingSchoolLicenseType.Moto],
    },
    {
        coords: [-1028.3, -871.1, 5.83],
        message: 'Los Santos Police Department ! De chouettes types !',
        licenses: [DrivingSchoolLicenseType.Car, DrivingSchoolLicenseType.Truck, DrivingSchoolLicenseType.Moto],
    },
    {
        coords: [-696.01, 40.51, 41.56],
        message: 'Kifflom !',
        licenses: [DrivingSchoolLicenseType.Car, DrivingSchoolLicenseType.Truck, DrivingSchoolLicenseType.Moto],
    },
    {
        coords: [-1379.76, 55.13, 52.04],
        message: "Tu essayes de m'acheter avec une partie de golf ?! Dommage je n'ai pas mes clubs…",
        licenses: [DrivingSchoolLicenseType.Car, DrivingSchoolLicenseType.Truck, DrivingSchoolLicenseType.Moto],
    },
    {
        coords: [399.83, -981.8, 27.77],
        message: 'Le LSPD surveille tous les conducteurs. Regarde la route !',
        licenses: [DrivingSchoolLicenseType.Car, DrivingSchoolLicenseType.Truck, DrivingSchoolLicenseType.Moto],
    },
    {
        coords: [-262.13, -1310.05, 29.65],
        message: "New Gahray ! J'ai le sentiment que tu vas passer beaucoup de temps ici !",
        licenses: [DrivingSchoolLicenseType.Car, DrivingSchoolLicenseType.Truck, DrivingSchoolLicenseType.Moto],
    },
    {
        coords: [-1601.2, 156.95, 58.05],
        message: 'Pfff! Regarde-moi tous ces étudiants qui passent leur vie sur les jeux-vidéos…',
        licenses: [DrivingSchoolLicenseType.Car, DrivingSchoolLicenseType.Truck, DrivingSchoolLicenseType.Moto],
    },
    {
        coords: [-86.89, -1101.69, 24.46],
        message: 'Termine cet examen avant de lorgner sur le concessionnaire. Chaque chose en son temps.',
        licenses: [DrivingSchoolLicenseType.Car, DrivingSchoolLicenseType.Truck, DrivingSchoolLicenseType.Moto],
    },
    {
        coords: [-552.76, -151.6, 36.62],
        message: "Il paraît que c'est dans ce commissariat qu'il y a les meilleurs donuts.",
        licenses: [DrivingSchoolLicenseType.Car, DrivingSchoolLicenseType.Truck, DrivingSchoolLicenseType.Moto],
    },
    { coords: [-340.44, -2357.59, 30.65], licenses: [DrivingSchoolLicenseType.Heli] },
    { coords: [-934.18, -1280.37, 28.13], message: 'Olé !', licenses: [DrivingSchoolLicenseType.Heli] },
    { coords: [-1511.35, -555.54, 52.55], message: 'Belle manoeuvre !', licenses: [DrivingSchoolLicenseType.Heli] },
    { coords: [-913.59, -382.14, 154.54], licenses: [DrivingSchoolLicenseType.Heli] },
    {
        coords: [-75.35, -819.17, 326.79],
        message: 'Je suis le roi du monde !',
        licenses: [DrivingSchoolLicenseType.Heli],
    },
    {
        coords: [-7.21, 682.43, 197.93],
        message: 'Redresse ! On va se noyer !',
        licenses: [DrivingSchoolLicenseType.Heli],
    },
    { coords: [722.25, 1198.04, 350.88], message: 'Vinewood, baby !', licenses: [DrivingSchoolLicenseType.Heli] },
    { coords: [592.46, -1021.0, 21.91], licenses: [DrivingSchoolLicenseType.Heli] },
];
