import { Gang } from '@private/shared/gang';
import { BankAccount, Invoice } from '@public/shared/bank';
import { Configuration } from '@public/shared/configuration';
import { Field } from '@public/shared/field';
import { Fine } from '@public/shared/job/police';
import { LeaderboardInterface } from '@public/shared/phone/apps/game';
import { ZoneTyped } from '@public/shared/polyzone/box.zone';
import { Scene, WorldEvent } from '@public/shared/scene';
import { SenateParty } from '@public/shared/senate';
import { Tax, TaxType } from '@public/shared/tax';

import { Billboard } from './billboard';
import { GlovesItem } from './cloth';
import { Door } from './door';
import { FuelStation, UpwCharger, UpwStation } from './fuel';
import { Property, RentTaxe } from './housing/housing';
import { JobGrade } from './job';
import { WorldObject } from './object';
import { Race } from './race';
import { ClothingShop } from './shop';
import { Garage } from './vehicle/garage';
import { Radar } from './vehicle/radar';
import { TowRope } from './vehicle/tow.rope';
import { Vehicle } from './vehicle/vehicle';

export enum RepositoryType {
    ApartmentRentTaxe = 'ApartmentRentTaxe',
    BankAccount = 'bankAccount',
    BankFarmAccount = 'bankFarmAccount',
    BankInvoice = 'bankInvoice',
    Billboard = 'billboard',
    ChargerUpw = 'chargerUpw',
    Configuration = 'configuration',
    Door = 'door',
    Field = 'field',
    Fine = 'fine',
    Gang = 'gang',
    Garage = 'garage',
    Housing = 'housing',
    JobGrade = 'jobGrade',
    LeaderboardSnake = 'leaderboardSnake',
    LeaderboardTetris = 'leaderboardTetris',
    Object = 'object',
    Race = 'race',
    Radar = 'radar',
    Scene = 'scene',
    SenateParty = 'senateParty',
    Shop = 'shop',
    ShopCategory = 'shopCategory',
    ShopGlove = 'shopGlove',
    ShopUnderTypes = 'shopUnderTypes',
    StationFuel = 'stationFuel',
    StationUpw = 'stationUpw',
    Tax = 'tax',
    TowRope = 'towRope',
    Vehicle = 'vehicle',
    WorldEvent = 'worldEvent',
    Zone = 'zone',
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
    [RepositoryType.ApartmentRentTaxe]: RentTaxe;
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
    [RepositoryType.LeaderboardSnake]: LeaderboardInterface[];
    [RepositoryType.LeaderboardTetris]: LeaderboardInterface[];
    [RepositoryType.TowRope]: TowRope;
    [RepositoryType.Zone]: ZoneTyped;
    [RepositoryType.Gang]: Gang;
    [RepositoryType.Door]: Door;
    [RepositoryType.Scene]: Scene;
    [RepositoryType.WorldEvent]: WorldEvent;
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
    [RepositoryType.LeaderboardSnake]: Record<number, LeaderboardInterface>;
    [RepositoryType.LeaderboardTetris]: Record<number, LeaderboardInterface>;
    [RepositoryType.TowRope]: Record<string, TowRope>;
    [RepositoryType.Zone]: Record<number, ZoneTyped>;
    [RepositoryType.Gang]: Record<number, Gang>;
    [RepositoryType.Door]: Record<string, Door>;
    [RepositoryType.Scene]: Record<string, Scene>;
    [RepositoryType.WorldEvent]: Record<string, WorldEvent>;
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
    [RepositoryType.Vehicle]: Record<string, Vehicle>;
    [RepositoryType.ApartmentRentTaxe]: Record<number, RentTaxe>;
}
