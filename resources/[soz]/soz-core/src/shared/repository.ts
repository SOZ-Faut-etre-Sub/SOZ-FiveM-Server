import { Gang } from '@private/shared/gang';
import { BankAccount, Invoice, Tax, TaxType } from '@public/shared/bank';
import { Configuration } from '@public/shared/configuration';
import { Field } from '@public/shared/field';
import { Fine } from '@public/shared/job/police';
import { ZoneTyped } from '@public/shared/polyzone/box.zone';
import { SenateParty } from '@public/shared/senate';

import { Billboard } from './billboard';
import { GlovesItem } from './cloth';
import { Door } from './door';
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
    BankAccount = 'bankAccount',
    BankFarmAccount = 'bankFarmAccount',
    BankInvoice = 'bankInvoice',
    Billboard = 'billboard',
    ChargerUpw = 'chargerUpw',
    Configuration = 'configuration',
    Field = 'field',
    Fine = 'fine',
    Garage = 'garage',
    Housing = 'housing',
    JobGrade = 'jobGrade',
    Object = 'object',
    Race = 'race',
    Radar = 'radar',
    SenateParty = 'senateParty',
    Shop = 'shop',
    ShopCategory = 'shopCategory',
    ShopUnderTypes = 'shopUnderTypes',
    ShopGlove = 'shopGlove',
    StationFuel = 'stationFuel',
    StationUpw = 'stationUpw',
    Vehicle = 'vehicle',
    Tax = 'tax',
    TowRope = 'towRope',
    Zone = 'zone',
    Gang = 'gang',
    Door = 'door',
}

export type RepositoryMapping = {
    [RepositoryType.BankAccount]: BankAccount;
    [RepositoryType.BankFarmAccount]: Partial<BankAccount>;
    [RepositoryType.BankInvoice]: Invoice;
    [RepositoryType.Billboard]: Billboard;
    [RepositoryType.ChargerUpw]: UpwCharger;
    [RepositoryType.Configuration]: any;
    [RepositoryType.Field]: Field;
    [RepositoryType.Fine]: Fine;
    [RepositoryType.Garage]: Garage;
    [RepositoryType.Housing]: Property;
    [RepositoryType.JobGrade]: JobGrade;
    [RepositoryType.Object]: WorldObject;
    [RepositoryType.Race]: Race;
    [RepositoryType.Radar]: Radar;
    [RepositoryType.SenateParty]: SenateParty;
    [RepositoryType.Shop]: ClothingShop;
    [RepositoryType.ShopCategory]: any;
    [RepositoryType.ShopUnderTypes]: number[];
    [RepositoryType.ShopGlove]: GlovesItem;
    [RepositoryType.StationFuel]: FuelStation;
    [RepositoryType.StationUpw]: UpwStation;
    [RepositoryType.Vehicle]: Vehicle;
    [RepositoryType.Tax]: Tax;
    [RepositoryType.TowRope]: TowRope;
    [RepositoryType.Zone]: ZoneTyped;
    [RepositoryType.Gang]: Gang;
    [RepositoryType.Door]: Door;
};

export interface RepositoryConfig extends Record<keyof RepositoryMapping, any> {
    // Implemented
    [RepositoryType.BankAccount]: Record<string, BankAccount>;
    [RepositoryType.BankFarmAccount]: Record<string, Partial<BankAccount>>;
    [RepositoryType.BankInvoice]: Record<number, Invoice>;
    [RepositoryType.Configuration]: Configuration;
    [RepositoryType.Field]: Record<string, Field>;
    [RepositoryType.Fine]: Record<number, Fine>;
    [RepositoryType.Housing]: Record<number, Property>;
    [RepositoryType.JobGrade]: Record<number, JobGrade>;
    [RepositoryType.Radar]: Record<number, Radar>;
    [RepositoryType.SenateParty]: Record<string, SenateParty>;
    [RepositoryType.Tax]: Record<TaxType, Tax>;
    [RepositoryType.TowRope]: Record<string, TowRope>;
    [RepositoryType.Zone]: Record<number, ZoneTyped>;
    [RepositoryType.Gang]: Record<number, Gang>;
    [RepositoryType.Door]: Record<string, Door>;
    // Not implemented
    [RepositoryType.Billboard]: Record<number, Billboard>;
    [RepositoryType.ChargerUpw]: Record<number, UpwCharger>;
    [RepositoryType.Garage]: Record<string, Garage>;
    [RepositoryType.Object]: Record<string, WorldObject>;
    [RepositoryType.Race]: Record<number, Race>;
    [RepositoryType.Shop]: Record<number, ClothingShop>;
    [RepositoryType.ShopCategory]: Record<number, any>; // @TODO Fix this
    [RepositoryType.ShopUnderTypes]: Record<number, number[]>;
    [RepositoryType.ShopGlove]: Record<number, GlovesItem>;
    [RepositoryType.StationFuel]: Record<string, FuelStation>;
    [RepositoryType.StationUpw]: Record<number, UpwStation>;
    [RepositoryType.Vehicle]: Record<number, Vehicle>;
}
