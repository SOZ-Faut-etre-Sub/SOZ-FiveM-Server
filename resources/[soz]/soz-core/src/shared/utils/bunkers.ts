import { BoxZone, Zone } from '../polyzone/box.zone';
import { Vector4 } from '../polyzone/vector';

type Bunker = {
    model: string;
    label: string;
    exitInteractionZone: Zone<any>;
    insideCoords: Vector4;
    outsideCoods: Vector4;
    intermediate?: Vector4;
};

export const Bunkers: Bunker[] = [
    {
        model: 'soz_bunker_5',
        label: 'Shelter 5',
        insideCoords: [-1507.6, -3017.18, -79.24, 357.96],
        exitInteractionZone: new BoxZone([-1508.82, -3016.25, -79.14], 0.2, 0.4, {
            heading: 178.96,
            minZ: -79.24,
            maxZ: -78.64,
        }),
        outsideCoods: [-387.41, -2139.15, 10.46, 191.15],
    },
    {
        model: 'soz_bunker_16',
        label: 'Shelter 16',
        insideCoords: [2155.08, 2921.08, -61.9, 88.33],
        exitInteractionZone: new BoxZone([2154.99, 2922.45, -61.95], 0.2, 0.2, {
            heading: 269.33,
            minZ: -62.15,
            maxZ: -61.55,
        }),
        outsideCoods: [926.32, 3525.7, 34.22, 354.69],
    },
    {
        model: 'soz_bunker_20',
        label: 'Shelter 20',
        insideCoords: [482.89, 4811.03, -58.38, 12],
        exitInteractionZone: new BoxZone([487.53, 4820.08, -58.03], 0.2, 0.4, {
            heading: 101.29,
            minZ: -58.43,
            maxZ: -57.83,
        }),
        outsideCoods: [2597.23, 3559.32, 52.24, 217.7],
    },
    {
        model: 'soz_bunker_22',
        label: 'Shelter 22',
        insideCoords: [520.3, 5902.69, -158.08, 316.84],
        exitInteractionZone: new BoxZone([518.4, 5900.55, -158.08], 1.0, 3.6, {
            heading: 317.86,
            minZ: -159.08,
            maxZ: -157.08,
        }),
        outsideCoods: [-291.61, 6444.05, 12.45, 41.31],
        intermediate: [-354.32, 4825.37, 144.3, 137.8],
    },
];
