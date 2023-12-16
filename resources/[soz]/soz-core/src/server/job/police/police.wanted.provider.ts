import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { PrismaService } from '@public/server/database/prisma.service';
import { PlayerService } from '@public/server/player/player.service';
import { RpcServerEvent } from '@public/shared/rpc';

@Provider()
export class PoliceWantedProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Rpc(RpcServerEvent.POLICE_GET_WANTED_PLAYERS)
    public async getWantedPlayers(source: number): Promise<{ id: number; message: string }[]> {
        const player = this.playerService.getPlayer(source);
        return await this.prismaService.phone_twitch_news.findMany({
            where: {
                type: player.job.id,
            },
            select: {
                id: true,
                message: true,
            },
        });
    }

    @Rpc(RpcServerEvent.POLICE_DELETE_WANTED_PLAYER)
    public async deleteWantedPlayer(source: number, id: number): Promise<boolean> {
        const player = this.playerService.getPlayer(source);
        await this.prismaService.phone_twitch_news.update({
            where: {
                id,
            },
            data: {
                type: `${player.job}:end`,
            },
        });

        return true;
    }
}
