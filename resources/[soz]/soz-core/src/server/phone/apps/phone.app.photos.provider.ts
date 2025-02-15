import { Provider } from '@public/core/decorators/provider';

import { Inject } from '../../../core/decorators/injectable';
import { Rpc } from '../../../core/decorators/rpc';
import { RpcServerEvent } from '../../../shared/rpc';
import { PrismaService } from '../../database/prisma.service';
import { PlayerService } from '../../player/player.service';

@Provider()
export class PhoneAppPhotosProvider {
    @Inject(PrismaService)
    private readonly prismaService: PrismaService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Rpc(RpcServerEvent.PHONE_APP_PHOTOS_GET)
    async getPhotos(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        return this.prismaService.phone_gallery.findMany({
            select: {
                id: true,
                image: true,
            },
            where: {
                identifier: player.citizenid,
            },
            orderBy: {
                id: 'desc',
            },
        });
    }

    @Rpc(RpcServerEvent.PHONE_APP_PHOTOS_UPLOAD)
    async takePhoto(source: number, image: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        return this.prismaService.phone_gallery.create({
            data: {
                identifier: player.citizenid,
                image,
            },
        });
    }

    @Rpc(RpcServerEvent.PHONE_APP_PHOTOS_DELETE)
    async deletePhoto(source: number, id: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        await this.prismaService.phone_gallery.delete({
            where: {
                id,
                identifier: player.citizenid,
            },
        });
    }
}
