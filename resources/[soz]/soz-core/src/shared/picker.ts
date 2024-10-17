import { Vector2, Vector3 } from './polyzone/vector';

export interface NuiPickerMethodMap {
    map: NuiMapPickerLocation[];
}

export type NuiMapPickerLocation = Exclude<MapPickerLocation, 'coords'> & {
    coords: Vector2;
};

export type MapPickerLocation = {
    id: string;
    coords: Vector3;
    icon: 'coffin';
};
