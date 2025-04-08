import { Feature } from '@public/shared/features';
import { Vector4 } from '@public/shared/polyzone/vector';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { Logger } from '../../core/logger';
import { UpwStation } from '../../shared/fuel';
import { PrismaService } from '../database/prisma.service';
import { FeatureProvider } from '../feature/feature.provider';
import { RepositoryLegacy } from './repository';

@Injectable()
export class UpwStationRepository extends RepositoryLegacy<Record<string, UpwStation>> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Logger)
    private logger: Logger;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    protected async load(): Promise<Record<string, UpwStation>> {
        const whatIf = this.featureProvider.isFeatureEnabled(Feature.WhatIfFirstEpisode);
        const stations = await this.prismaService.upw_stations.findMany();
        const upwCharger: Record<number, UpwStation> = {};

        for (const station of stations) {
            //meteor
            if (station.station == 'station20') {
                continue;
            }

            try {
                const position = JSON.parse(station.position) as { x: number; y: number; z: number; w: number };
                const vectorPosition: Vector4 = [position.x, position.y, position.z, position.w];
                upwCharger[station.station] = {
                    id: station.id,
                    station: station.station,
                    position: vectorPosition,
                    stock: whatIf ? 10_000 : station.stock,
                    max_stock: whatIf ? 10_000 : station.max_stock,
                    price: station.price,
                    job: station.job,
                };
            } catch (e) {
                this.logger.error(`cannot load station: ${station.station} ${e}`);
            }
        }

        return upwCharger;
    }
}
