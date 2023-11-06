import { rad, Vector4 } from '@public/shared/polyzone/vector';
import { getRacePNJPosID, getRacePosID, Race } from '@public/shared/race';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { PrismaService } from '../database/prisma.service';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { RepositoryLegacy } from './repository';

@Injectable()
export class RaceRepository extends RepositoryLegacy<Record<number, Race>> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

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
                vehicleConfiguration: line.configuration && JSON.parse(line.configuration),
            };

            this.setupTp(raceList[line.id]);
        }

        return raceList;
    }

    public setupTp(race: Race) {
        this.playerPositionProvider.registerZone(getRacePosID(race), race.start);

        const coords = [...race.npcPosition] as Vector4;
        const heading = coords[3];
        coords[0] -= Math.sin(rad(heading));
        coords[1] += Math.cos(rad(heading));
        coords[3] = (heading + 180) % 360;

        this.playerPositionProvider.registerZone(getRacePNJPosID(race), coords);
    }
}
