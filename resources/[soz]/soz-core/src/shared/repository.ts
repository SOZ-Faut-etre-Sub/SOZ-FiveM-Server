import { ZoneTyped } from '@public/shared/polyzone/box.zone';

import { Billboard } from './billboard';
import { GlovesItem } from './cloth';
import { FuelStation, UpwCharger, UpwStation } from './fuel';
import { Property } from './housing/housing';
import { JobGrade } from './job';
import { WorldObject } from './object';
import { Race } from './race';
import { ClothingShop } from './shop';
import { Garage } from './vehicle/garage';
import { Radar } from './vehicle/radar';
import { TowRope } from './vehicle/tow.rope';
import { Vehicle } from './vehicle/vehicle';

export enum RepositoryType {
    Billboard = 'billboard',
    ChargerUpw = 'chargerUpw',
    Garage = 'garage',
    Housing = 'housing',
    JobGrade = 'jobGrade',
    Object = 'object',
    Race = 'race',
    Radar = 'radar',
    Shop = 'shop',
    ShopCategory = 'shopCategory',
    ShopUnderTypes = 'shopUnderTypes',
    ShopGlove = 'shopGlove',
    StationFuel = 'stationFuel',
    StationUpw = 'stationUpw',
    Vehicle = 'vehicle',
    Zone = 'zone',
    TowRope = 'towRope',
}

export type RepositoryMapping = {
    [RepositoryType.Housing]: Property;
    [RepositoryType.Zone]: ZoneTyped;
    [RepositoryType.Billboard]: Billboard;
    [RepositoryType.ChargerUpw]: UpwCharger;
    [RepositoryType.Garage]: Garage;
    [RepositoryType.JobGrade]: JobGrade;
    [RepositoryType.Object]: WorldObject;
    [RepositoryType.Race]: Race;
    [RepositoryType.Radar]: Radar;
    [RepositoryType.Shop]: ClothingShop;
    [RepositoryType.ShopCategory]: any;
    [RepositoryType.ShopUnderTypes]: number[];
    [RepositoryType.ShopGlove]: GlovesItem;
    [RepositoryType.StationFuel]: FuelStation;
    [RepositoryType.StationUpw]: UpwStation;
    [RepositoryType.Vehicle]: Vehicle;
    [RepositoryType.TowRope]: TowRope;
};

export interface RepositoryConfig extends Record<keyof RepositoryMapping, any> {
    // Implemented
    [RepositoryType.Housing]: Record<number, Property>;
    [RepositoryType.Zone]: Record<number, ZoneTyped>;
    [RepositoryType.JobGrade]: Record<number, JobGrade>;
    [RepositoryType.TowRope]: Record<string, TowRope>;
    // Not implemented
    [RepositoryType.Billboard]: Record<number, Billboard>;
    [RepositoryType.ChargerUpw]: Record<number, UpwCharger>;
    [RepositoryType.Garage]: Record<string, Garage>;
    [RepositoryType.Object]: Record<string, WorldObject>;
    [RepositoryType.Race]: Record<number, Race>;
    [RepositoryType.Radar]: Record<number, Radar>;
    [RepositoryType.Shop]: Record<number, ClothingShop>;
    [RepositoryType.ShopCategory]: Record<number, any>; // @TODO Fix this
    [RepositoryType.ShopUnderTypes]: Record<number, number[]>;
    [RepositoryType.ShopGlove]: Record<number, GlovesItem>;
    [RepositoryType.StationFuel]: Record<string, FuelStation>;
    [RepositoryType.StationUpw]: Record<number, UpwStation>;
    [RepositoryType.Vehicle]: Record<number, Vehicle>;
}
