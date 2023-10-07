import { Vector4 } from '@public/shared/polyzone/vector';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { Logger } from '../../core/logger';
import { UpwCharger } from '../../shared/fuel';
import { PrismaService } from '../database/prisma.service';
import { RepositoryLegacy } from './repository';

@Injectable()
export class UpwChargerRepository extends RepositoryLegacy<Record<number, UpwCharger>> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Logger)
    private logger: Logger;

    protected async load(): Promise<Record<number, UpwCharger>> {
        const stations = await this.prismaService.upw_chargers.findMany();
        const upwCharger: Record<number, UpwCharger> = {};

        for (const station of stations) {
            try {
                const position = JSON.parse(station.position) as { x: number; y: number; z: number; w: number };
                const vectorPosition: Vector4 = [position.x, position.y, position.z, position.w];
                upwCharger[station.id] = {
                    id: station.id,
                    station: station.station,
                    position: vectorPosition,
                    active: station.active == 1,
                };
            } catch (e) {
                this.logger.error('cannot load charger: ', station.station, e);
            }
        }

        return upwCharger;
    }
}
