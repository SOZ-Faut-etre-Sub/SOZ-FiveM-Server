import { BlackjackTable } from '@private/shared/casino.blackjack';
import { InsideTrack } from '@private/shared/casino.inside-track';
import { LuckyWheel } from '@private/shared/casino.lucky-wheel';
import { PokerTable } from '@private/shared/casino.poker';
import { RouletteTable } from '@private/shared/casino.roulette';
import { SlotMachine } from '@private/shared/casino.slot';
import { Gang } from '@private/shared/gang';
import { BankAccount, Invoice } from '@public/shared/bank';
import { Configuration } from '@public/shared/configuration';
import { Field } from '@public/shared/field';
import { Fine, HackedCam } from '@public/shared/job/police';
import { LeaderboardInterface } from '@public/shared/phone/apps/game';
import { ZoneTyped } from '@public/shared/polyzone/box.zone';
import { Scene, SceneLiveElement, WorldEvent } from '@public/shared/scene';
import { SenateParty } from '@public/shared/senate';
import { Tax, TaxType } from '@public/shared/tax';

import { Billboard } from './billboard';
import { GlovesItem } from './cloth';
import { Door } from './door';
import { DynamicElevator, DynamicElevatorState } from './elevators';
import { FuelStation, UpwCharger, UpwStation } from './fuel';
import { Property, RentTaxe } from './housing/housing';
import { JobGrade } from './job';
import { ModelSwap } from './modelswap';
import { WorldObject } from './object';
import { Race } from './race';
import { ClothingShop } from './shop';
import { TravelingCamera } from './traveling';
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
    CasinoLuckyWheel = 'casinoLuckyWheel',
    CasinoSlotMachine = 'casinoSlotMachine',
    CasinoInsideTrack = 'casinoInsideTrack',
    CasinoPoker = 'casinoPoker',
    CasinoBlackjack = 'casinoBlackjack',
    CasinoRoulette = 'casinoRoulette',
    ChargerUpw = 'chargerUpw',
    Configuration = 'configuration',
    Door = 'door',
    Elevator = 'elevator',
    Field = 'field',
    Fine = 'fine',
    Gang = 'gang',
    Garage = 'garage',
    Housing = 'housing',
    JobGrade = 'jobGrade',
    LeaderboardSnake = 'leaderboardSnake',
    LeaderboardTetris = 'leaderboardTetris',
    Object = 'object',
    PhoneLight = 'phoneLight',
    Race = 'race',
    Radar = 'radar',
    Scene = 'scene',
    SceneLive = 'sceneLive',
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
    VehicleSiren = 'vehicleSiren',
    Traveling = 'traveling',
    ModelSwap = 'modelSwap',
    HackedCam = 'hackedCam',
}

export type RepositoryMapping = {
    [RepositoryType.BankAccount]: BankAccount;
    [RepositoryType.BankFarmAccount]: Partial<BankAccount>;
    [RepositoryType.BankInvoice]: Invoice;
    [RepositoryType.Billboard]: Billboard;
    [RepositoryType.CasinoLuckyWheel]: LuckyWheel;
    [RepositoryType.CasinoSlotMachine]: SlotMachine;
    [RepositoryType.CasinoInsideTrack]: InsideTrack;
    [RepositoryType.CasinoPoker]: PokerTable;
    [RepositoryType.CasinoBlackjack]: BlackjackTable;
    [RepositoryType.CasinoRoulette]: RouletteTable;
    [RepositoryType.ChargerUpw]: UpwCharger;
    [RepositoryType.Configuration]: any;
    [RepositoryType.Elevator]: DynamicElevatorState;
    [RepositoryType.Field]: Field;
    [RepositoryType.Fine]: Fine;
    [RepositoryType.Garage]: Garage;
    [RepositoryType.Housing]: Property;
    [RepositoryType.ApartmentRentTaxe]: RentTaxe;
    [RepositoryType.JobGrade]: JobGrade;
    [RepositoryType.Object]: WorldObject;
    [RepositoryType.PhoneLight]: [boolean, boolean];
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
    [RepositoryType.SceneLive]: SceneLiveElement;
    [RepositoryType.WorldEvent]: WorldEvent;
    [RepositoryType.VehicleSiren]: boolean;
    [RepositoryType.Traveling]: TravelingCamera;
    [RepositoryType.ModelSwap]: ModelSwap;
    [RepositoryType.HackedCam]: HackedCam;
};

export interface RepositoryConfig extends Record<keyof RepositoryMapping, any> {
    // Implemented
    [RepositoryType.BankAccount]: Record<string, BankAccount>;
    [RepositoryType.BankFarmAccount]: Record<string, Partial<BankAccount>>;
    [RepositoryType.BankInvoice]: Record<number, Invoice>;
    [RepositoryType.CasinoLuckyWheel]: Record<string, LuckyWheel>;
    [RepositoryType.CasinoSlotMachine]: Record<number, SlotMachine>;
    [RepositoryType.CasinoInsideTrack]: Record<string, InsideTrack>;
    [RepositoryType.CasinoPoker]: Record<string, PokerTable>;
    [RepositoryType.CasinoBlackjack]: Record<string, BlackjackTable>;
    [RepositoryType.CasinoRoulette]: Record<string, RouletteTable>;
    [RepositoryType.Configuration]: Configuration;
    [RepositoryType.Field]: Record<string, Field>;
    [RepositoryType.Elevator]: Record<DynamicElevator, DynamicElevatorState>;
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
    [RepositoryType.PhoneLight]: Record<number, [boolean, boolean]>;
    [RepositoryType.VehicleSiren]: Record<number, boolean>;
    [RepositoryType.Traveling]: Record<number, TravelingCamera>;
    [RepositoryType.ModelSwap]: Record<number, ModelSwap>;
    [RepositoryType.HackedCam]: Record<number, HackedCam>;
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
