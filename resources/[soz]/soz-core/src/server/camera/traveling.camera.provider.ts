import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ServerEvent } from '@public/shared/event/server';
import { TravelingCamera, TravelingPoint } from '@public/shared/traveling';

import { PrismaService } from '../database/prisma.service';
import { PlayerService } from '../player/player.service';
import { CameraTravelingRepository } from '../repository/camera.traveling.repositoty';

@Provider()
export class TravelingCameraProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(CameraTravelingRepository)
    private cameraTravelingRepository: CameraTravelingRepository;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @OnEvent(ServerEvent.TRAVELING_ADD)
    public async add(source: number, name: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const dbValue = await this.prismaService.traveling.create({
            data: {
                name: name,
                job: player.job.id,
                points: JSON.stringify([]),
            },
        });

        await this.cameraTravelingRepository.set(dbValue.id, {
            id: dbValue.id,
            name,
            job: player.job.id,
            points: [],
        });
    }

    @OnEvent(ServerEvent.TRAVELING_DELETE)
    public async delete(source: number, id: number) {
        this.cameraTravelingRepository.delete(id);
        await this.prismaService.traveling.delete({
            where: {
                id,
            },
        });
    }

    @OnEvent(ServerEvent.TRAVELING_RENAME)
    public async rename(source: number, id: number, name: string) {
        const existing = await this.cameraTravelingRepository.find(id);
        if (!existing) {
            return;
        }
        await this.prismaService.traveling.update({
            data: {
                name,
            },
            where: {
                id,
            },
        });
        existing.name = name;
    }

    @OnEvent(ServerEvent.TRAVELING_POINT_ADD)
    public async addPoint(source: number, id: number, index: number, point: TravelingPoint) {
        const traveling = await this.cameraTravelingRepository.find(id);
        traveling.points.splice(index, 0, point);
        await this.save(traveling);
    }

    @OnEvent(ServerEvent.TRAVELING_POINT_UPDATE)
    public async updatePoint(source: number, id: number, index: number, point: TravelingPoint) {
        const traveling = await this.cameraTravelingRepository.find(id);
        traveling.points[index] = point;
        await this.save(traveling);
    }

    @OnEvent(ServerEvent.TRAVELING_POINT_DELETE)
    public async deletePoint(source: number, id: number, index: number) {
        const traveling = await this.cameraTravelingRepository.find(id);
        traveling.points.splice(index, 1);
        await this.save(traveling);
    }

    private async save(traveling: TravelingCamera) {
        await this.prismaService.traveling.update({
            data: {
                points: JSON.stringify(traveling.points),
            },
            where: {
                id: traveling.id,
            },
        });
    }
}
