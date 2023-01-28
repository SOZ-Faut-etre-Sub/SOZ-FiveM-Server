import { Vector4 } from '@public/shared/polyzone/vector';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { UpwCharger } from '../../shared/fuel';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable()
export class UpwChargerRepository extends Repository<Record<number, UpwCharger>> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

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
                console.error('cannot load station: ', station.station, e);
                continue;
            }
        }

        return upwCharger;
    }
}
