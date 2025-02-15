import { Inject, Injectable } from '@core/decorators/injectable';
import { Prisma } from '@prisma/client';

import { LeaderboardInterface } from '../../shared/phone/apps/game';
import { RepositoryType } from '../../shared/repository';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable(LeaderboardTetrisRepository, Repository)
export class LeaderboardTetrisRepository extends Repository<RepositoryType.LeaderboardTetris> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    public type = RepositoryType.LeaderboardTetris;

    protected async load(): Promise<Record<number, LeaderboardInterface>> {
        const rows: any[] = await this.prismaService.$queryRaw(
            Prisma.sql`
                SELECT tetris_score.id,
                       player.citizenid,
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
        );

        const list: Record<number, LeaderboardInterface> = {};

        for (const row of rows) {
            list[row.id] = {
                ...row,
                score: Number(row.score),
                game_played: Number(row.game_played),
            };
        }

        return list;
    }

    public async addScore(identifier: string, score: number): Promise<void> {
        if (!score || score <= 0) return;

        await this.prismaService.tetris_score.create({
            data: {
                identifier,
                score,
            },
        });

        await this.refresh();
    }
}
