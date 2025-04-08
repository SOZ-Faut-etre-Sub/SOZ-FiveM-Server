import { Inject, Injectable } from '../../core/decorators/injectable';
import { Logger } from '../../core/logger';
import { Feature } from '../../shared/features';
import { FuelStation, FuelStationType, FuelType } from '../../shared/fuel';
import { JobType } from '../../shared/job';
import { Vector3, Vector4 } from '../../shared/polyzone/vector';
import { PrismaService } from '../database/prisma.service';
import { FeatureProvider } from '../feature/feature.provider';
import { RepositoryLegacy } from './repository';

/**
 * "length": 22.2,
 *                 "width": 15.0,
 *                 "options": {
 *                     "name": "BlueBird_car",
 *                     "heading": 292.0,
 *                     "minZ": 25.75,
 *                     "maxZ": 28.75
 *                 }
 */
type DatabaseZone = {
    position: {
        x: number;
        y: number;
        z: number;
    };
    length: number;
    width: number;
    options: {
        name: string;
        heading: number;
        minZ: number;
        maxZ: number;
    };
};

@Injectable()
export class FuelStationRepository extends RepositoryLegacy<Record<string, FuelStation>> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Logger)
    private logger: Logger;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    protected async load(): Promise<Record<string, FuelStation>> {
        const stations = await this.prismaService.fuel_storage.findMany();
        const fuelStations: Record<string, FuelStation> = {};
        const whatIf = this.featureProvider.isFeatureEnabled(Feature.WhatIfFirstEpisode);

        for (const station of stations) {
            //meteor
            if (station.station == 'Station6') {
                continue;
            }

            try {
                const stationPosition = JSON.parse(station.position) as { x: number; y: number; z: number; w?: number };
                const stationZone = JSON.parse(station.zone) as DatabaseZone;

                const position = [
                    stationPosition.x,
                    stationPosition.y,
                    stationPosition.z,
                    stationPosition.w || 0,
                ] as Vector4;
                const zone = {
                    center: [stationZone.position.x, stationZone.position.y, stationZone.position.z] as Vector3,
                    length: stationZone.length,
                    width: stationZone.width,
                    heading: stationZone.options.heading,
                    minZ: stationZone.options.minZ,
                    maxZ: stationZone.options.maxZ,
                };

                fuelStations[station.station] = {
                    id: station.id,
                    name: station.station,
                    model: station.model,
                    fuel: station.fuel as FuelType,
                    type: station.type as FuelStationType,
                    position,
                    zone,
                    stock: whatIf ? 10_000 : station.stock,
                    price: station.price,
                    job: whatIf && station.owner === JobType.LSPD ? JobType.SASP : (station.owner as JobType) ?? null,
                };
            } catch (e) {
                this.logger.error(`cannot load station: ${station.station} ${e}`);
            }
        }

        return fuelStations;
    }
}
