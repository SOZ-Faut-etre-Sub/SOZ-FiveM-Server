import { JobType } from '../shared/job';
import { CylinderZone } from '../shared/polyzone/cylinder.zone';
import { Radar } from '../shared/vehicle/radar';

// TODO: Move the radar configuration in database for the Chains Of Justice DLC
export const RadarList: Record<number, Radar> = {
    [1]: {
        props: [-54.77, 6338.8, 30.33, 155.46],
        zone: new CylinderZone([-60.35, 6321.91], 9, 22.3, 40.3),
        station: JobType.BCSO,
        isOnline: true,
        speed: 130,
    },
    //Freeway Radars, do not touch until migration in DB
    [2]: {
        props: [2365.11, 5763.63, 44.94, 236.35],
        zone: new CylinderZone([2386.17, 5745.69], 10, 35.73, 55.73),
        station: JobType.BCSO,
        isOnline: false,
        speed: 0,
    },
    [3]: {
        props: [-2831.09, 2176.07, 30.84, 320.84],
        zone: new CylinderZone([-2813.6, 2202.67], 15, 13.91, 43.91),
        station: JobType.BCSO,
        isOnline: true,
        speed: 130,
    },
    [4]: {
        props: [2149.54, 3761.94, 31.89, 320.54],
        zone: new CylinderZone([2161.77, 3778.34], 8, 25.36, 41.36),
        station: JobType.BCSO,
        isOnline: true,
        speed: 110,
    },
    [5]: {
        props: [710.03, 2707.9, 39.23, 116.24],
        zone: new CylinderZone([695.75, 2700.52], 8, 32.5, 48.5),
        station: JobType.BCSO,
        isOnline: true,
        speed: 110,
    },
    [6]: {
        props: [2234.08, 4744.3, 38.66, 111.03],
        zone: new CylinderZone([2221.52, 4739.29], 8, 32.14, 48.14),
        station: JobType.BCSO,
        isOnline: true,
        speed: 110,
    },
    [7]: {
        props: [1131.91, 1890.94, 64.72, 42.22],
        zone: new CylinderZone([1118.43, 1909.73], 8, 55.44, 71.44),
        station: JobType.BCSO,
        isOnline: true,
        speed: 110,
    },
    [8]: {
        props: [-1434.12, 1930.06, 72.43, 202.18],
        zone: new CylinderZone([-1425.47, 1905.34], 10, 64.05, 84.05),
        station: JobType.BCSO,
        isOnline: true,
        speed: 110,
    },
    //Freeway Radars, do not touch until migration in DB
    [9]: {
        props: [2767.39, 4601.74, 44.2, 29.84],
        zone: new CylinderZone([2751.96, 4625.0], 10, 34.89, 54.89),
        station: JobType.BCSO,
        isOnline: false,
        speed: 0,
    },
    [10]: {
        props: [-797.55, 2231.07, 86.17, 356.3],
        zone: new CylinderZone([-798.91, 2252.27], 8, 76.23, 92.23),
        station: JobType.BCSO,
        isOnline: true,
        speed: 110,
    },
    [11]: {
        props: [-2467.23, -219.14, 16.65, 220.11],
        zone: new CylinderZone([-2447.98, -238.33], 8, 8.61, 24.61),
        station: JobType.LSPD,
        isOnline: true,
        speed: 130,
    },
    [12]: {
        props: [-1919.08, 692.07, 125.73, 166.88],
        zone: new CylinderZone([-1922.6, 671.7], 12, 113.62, 137.62),
        station: JobType.LSPD,
        isOnline: true,
        speed: 110,
    },
    [13]: {
        props: [-1650.11, -600.63, 32.63, 259.89],
        zone: new CylinderZone([-1622.3, -606.86], 12, 20.67, 44.67),
        station: JobType.LSPD,
        isOnline: true,
        speed: 90,
    },
    [14]: {
        props: [-11.96, -441.02, 39.34, 7.71],
        zone: new CylinderZone([-17.41, -405.88], 14, 25.68, 53.68),
        station: JobType.LSPD,
        isOnline: true,
        speed: 90,
    },
    [15]: {
        props: [-163.1, 109.87, 69.42, 215.3],
        zone: new CylinderZone([-148.8, 90.02], 8, 62.77, 78.77),
        station: JobType.LSPD,
        isOnline: true,
        speed: 90,
    },
    [16]: {
        props: [736.53, -1725.36, 28.38, 221.79],
        zone: new CylinderZone([762.64, -1740.99], 12, 17.52, 41.52),
        station: JobType.LSPD,
        isOnline: true,
        speed: 90,
    },
    [17]: {
        props: [-943.88, -1818.97, 18.8, 330.71],
        zone: new CylinderZone([-933.51, -1797.83], 8, 11.84, 27.84),
        station: JobType.LSPD,
        isOnline: true,
        speed: 90,
    },
    [18]: {
        props: [-699.19, -824.05, 22.75, 225.37],
        zone: new CylinderZone([-681.3, -837.16], 12, 12.14, 36.14),
        station: JobType.LSPD,
        isOnline: true,
        speed: 90,
    },
    // Freeway Radars, do not touch until migration in DB
    [19]: {
        props: [844.38, 141.1, 71.3, 301.84],
        zone: new CylinderZone([868.5, 154.6], 12, 61.41, 85.41),
        station: JobType.LSPD,
        isOnline: false,
        speed: 0,
    },
    [20]: {
        props: [-1001.81, 102.48, 51.33, 59.55],
        zone: new CylinderZone([-1014.42, 114.04], 8, 46.91, 60.91),
        station: JobType.LSPD,
        isOnline: true,
        speed: 90,
    },
};

export const RadarAllowedVehicle: number[] = [
    //LSMC
    GetHashKey('ambulance'),
    GetHashKey('ambcar'),
    GetHashKey('firetruk'),
    // LSPD
    GetHashKey('police'),
    GetHashKey('police2'),
    GetHashKey('police3'),
    GetHashKey('police4'),
    GetHashKey('police5'),
    GetHashKey('police6'),
    GetHashKey('policeb2'),
    // BCSO
    GetHashKey('sheriff'),
    GetHashKey('sheriff2'),
    GetHashKey('sheriff3'),
    GetHashKey('sheriff4'),
    GetHashKey('sheriffb'),
    GetHashKey('sheriffdodge'),
    GetHashKey('sheriffcara'),
    // LSPD / BCSO
    GetHashKey('pbus'),
    // FBI
    GetHashKey('fbi'),
    GetHashKey('fbi2'),
    GetHashKey('cogfbi'),
    GetHashKey('paragonfbi'),
];

export const RadarInformedVehicle: number[] = [
    // LSPD
    GetHashKey('police'),
    GetHashKey('police2'),
    GetHashKey('police3'),
    GetHashKey('police4'),
    GetHashKey('police5'),
    GetHashKey('police6'),
    GetHashKey('policeb2'),
    // BCSO
    GetHashKey('sheriff'),
    GetHashKey('sheriff2'),
    GetHashKey('sheriff3'),
    GetHashKey('sheriff4'),
    GetHashKey('sheriffb'),
    GetHashKey('sheriffdodge'),
    GetHashKey('sheriffcara'),
];
