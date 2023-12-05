import { Zone } from '../polyzone/box.zone';
import { Vector4 } from '../polyzone/vector';
import { Vehicle } from './vehicle';

export type AuctionVehicle = {
    vehicle: Vehicle;
    position: Vector4;
    windows: Zone;
    bestBid: {
        citizenId: string;
        account: string;
        name: string;
        price: number;
    } | null;
};

export type ShowVehicle = {
    position: Vector4;
    model: string;
    entity: number;
    rotSpeed: number;
};
