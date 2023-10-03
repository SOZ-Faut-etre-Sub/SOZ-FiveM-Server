import { BoxZone } from '@public/shared/polyzone/box.zone';
import { MultiZone } from '@public/shared/polyzone/multi.zone';

export const LS_CUSTOM_ZONE = new MultiZone([
    new BoxZone([-339.27, -136.19, 39.01], 18, 10, {
        heading: 71.36,
        minZ: 38.01,
        maxZ: 41.61,
    }),
    new BoxZone([-1154.88, -2005.4, 13.18], 10, 18, {
        heading: 45,
        minZ: 12.18,
        maxZ: 16.18,
    }),
    new BoxZone([731.87, -1087.88, 22.17], 10, 10, {
        heading: 0,
        minZ: 21.17,
        maxZ: 25.17,
    }),
    // Paleto LSCustom is large to allow Trunk customization
    new BoxZone([103.78, 6628.37, 31.4], 22.6, 22.8, {
        heading: 45,
        minZ: 30.4,
        maxZ: 37.0,
    }),
    new BoxZone([1175.88, 2640.3, 37.79], 10, 10, {
        heading: 45,
        minZ: 36.79,
        maxZ: 40.79,
    }),
    /* Cayo when custom on boats are OK
    new BoxZone([5126.11, -4649.94, 0.62], 71.0, 29.2, {
        heading: 255.65,
        minZ: -0.38,
        maxZ: 1.62,
    }),*/
]);
