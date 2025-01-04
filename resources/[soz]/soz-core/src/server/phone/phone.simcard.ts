import { Provider } from '@public/core/decorators/provider';

import { Inject } from '../../core/decorators/injectable';
import { Rpc } from '../../core/decorators/rpc';
import { RpcServerEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';
import { PlayerService } from '../player/player.service';

@Provider()
export class PhoneSimCard {
    @Inject(PrismaService)
    private readonly prismaService: PrismaService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Rpc(RpcServerEvent.PHONE_SIMCARD_GET_AVATAR)
    async getAvatar(source: number): Promise<string> {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const profile = await this.prismaService.phone_profile.findFirst({
            select: {
                avatar: true,
            },
            where: {
                number: player.charinfo.phone,
            },
        });

        return profile?.avatar;
    }

    @Rpc(RpcServerEvent.PHONE_SIMCARD_UPDATE_AVATAR)
    async updateAvatar(source: number, avatar: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        await this.prismaService.phone_profile.upsert({
            where: {
                number: player.charinfo.phone,
            },
            update: {
                avatar,
            },
            create: {
                number: player.charinfo.phone,
                avatar,
            },
        });
    }
}
