import { Notifier } from '../client/notifier';
import { PhoneService } from '../client/phone/phone.service';
import { PlayerService } from '../client/player/player.service';
import { VehicleSeatbeltProvider } from '../client/vehicle/vehicle.seatbelt.provider';
import { PlayerLicenceType } from './player';
import { Vector3, Vector4 } from './polyzone/vector';

interface Checkpoint {
    coords: Vector3;
    message?: string;
    licenses?: DrivingSchoolLicenseType[];
}

export interface DrivingSchoolLicense {
    licenseType: DrivingSchoolLicenseType;
    vehicle: {
        model: string;
        spawnPoints: { x: number; y: number; z: number; w: number }[];
    };
    price: number;
    icon: string;
    label: string;
    points: number;
    marker: Marker;
    checkpointCount: number;
    finalCheckpoint: Checkpoint;
}

export enum DrivingSchoolLicenseType {
    Car = PlayerLicenceType.Car,
    Truck = PlayerLicenceType.Truck,
    Moto = PlayerLicenceType.Moto,
    Heli = PlayerLicenceType.Heli,
}

interface Marker {
    type: number;
    typeFinal: number;
    size: number;
    color: MarkerColor;
}

interface MarkerColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface PenaltyContext {
    phoneService: PhoneService;
    playerService: PlayerService;
    notifier: Notifier;
    seatbeltProvider: VehicleSeatbeltProvider;
    undrivableVehicles: number[];
    vehicle: number;
}

const markerColor: MarkerColor = { r: 12, g: 123, b: 86, a: 150 };

const markers: Record<string, Marker> = {
    landVehicle: { type: 0, typeFinal: 4, size: 3.0, color: markerColor },
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
    licenses: <Record<DrivingSchoolLicenseType, DrivingSchoolLicense>>{
        [DrivingSchoolLicenseType.Car]: {
            licenseType: DrivingSchoolLicenseType.Car,
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
            marker: markers.landVehicle,
            checkpointCount: 6,
            finalCheckpoint: finalCheckpoints.landVehicle,
        },
        [DrivingSchoolLicenseType.Truck]: {
            licenseType: DrivingSchoolLicenseType.Truck,
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
            marker: markers.landVehicle,
            checkpointCount: 6,
            finalCheckpoint: finalCheckpoints.landVehicle,
        },
        [DrivingSchoolLicenseType.Moto]: {
            licenseType: DrivingSchoolLicenseType.Moto,
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
            marker: markers.landVehicle,
            checkpointCount: 6,
            finalCheckpoint: finalCheckpoints.landVehicle,
        },
        [DrivingSchoolLicenseType.Heli]: {
            licenseType: DrivingSchoolLicenseType.Heli,
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
            marker: markers.airVehicle,
            checkpointCount: 5,
            finalCheckpoint: finalCheckpoints.airVehicle,
        },
    },
};

const checkpoints: Checkpoint[] = [
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
        coords: [506.42, -1306.97, 27.76],
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
