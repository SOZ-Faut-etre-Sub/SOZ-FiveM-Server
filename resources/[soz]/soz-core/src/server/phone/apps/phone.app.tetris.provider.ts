import { Prisma } from '@prisma/client';
import { Provider } from '@public/core/decorators/provider';

import { Inject } from '../../../core/decorators/injectable';
import { Rpc } from '../../../core/decorators/rpc';
import { ClientEvent } from '../../../shared/event/client';
import { LeaderboardInterface } from '../../../shared/phone/apps/game';
import { RpcServerEvent } from '../../../shared/rpc';
import { PrismaService } from '../../database/prisma.service';
import { PlayerService } from '../../player/player.service';

@Provider()
export class PhoneAppTetrisProvider {
    @Inject(PrismaService)
    private readonly prismaService: PrismaService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Rpc(RpcServerEvent.PHONE_APP_TETRIS_GET_LEADERBOARD)
    async getLeaderboard() {
        const leaderborad = (await this.prismaService.$queryRaw(
            Prisma.sql`
                SELECT player.citizenid,
                       phone_profile.avatar,
                       concat(JSON_VALUE(player.charinfo, '$.firstname'), ' ', JSON_VALUE(player.charinfo, '$.lastname')) as player_name,
                       MAX(tetris_score.score)                                                                            as score,
                       try_count.game_played
                FROM tetris_score
                         LEFT JOIN player ON player.citizenid = tetris_score.identifier
                         LEFT JOIN phone_profile ON JSON_VALUE(player.charinfo, '$.phone') = phone_profile.number
                         LEFT JOIN (SELECT COUNT(*) as game_played, tetris_score.identifier FROM tetris_score GROUP BY tetris_score.identifier) AS try_count
                                   ON player.citizenid = try_count.identifier
                GROUP BY player.citizenid, try_count.game_played
                ORDER BY score DESC
            `
        )) as LeaderboardInterface[];

        return leaderborad.map(v => ({ ...v, score: Number(v.score), game_played: Number(v.game_played) }));
    }

    @Rpc(RpcServerEvent.PHONE_APP_TETRIS_ADD_SCORE)
    async addScore(source: number, score: number = 0) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        if (!score || score <= 0) return;

        const maxScore = await this.prismaService.tetris_score.aggregate({
            _max: {
                score: true,
            },
        });

        await this.prismaService.tetris_score.create({
            data: {
                identifier: player.citizenid,
                score,
            },
        });

        if (maxScore._max.score >= score) return;

        const leaderboard = await this.getLeaderboard();
        TriggerClientEvent(ClientEvent.PHONE_APP_TETRIS_UPDATE_LEADERBOARD, -1, leaderboard);
    }
}
