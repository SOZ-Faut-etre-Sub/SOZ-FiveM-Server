import { Race } from '@public/shared/race';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { PrismaService } from '../database/prisma.service';
import { PlayerService } from '../player/player.service';
import { Repository } from './repository';

@Injectable()
export class RaceRepository extends Repository<Record<number, Race>> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    protected async load(): Promise<Record<number, Race>> {
        const data = await this.prismaService.race.findMany();
        const raceList: Record<number, Race> = {};

        for (const line of data) {
            raceList[line.id] = {
                id: line.id,
                name: line.name,
                carModel: line.model,
                npcPosition: JSON.parse(line.npc_position),
                start: JSON.parse(line.start),
                checkpoints: JSON.parse(line.checkpoints),
                enabled: line.enabled,
                fps: line.fps,
                garageLocation: line.garage && JSON.parse(line.garage),
            } as Race;
        }

        return raceList;
    }
}
