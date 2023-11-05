import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { Race, RaceRanking, RaceRankingInfo } from '@public/shared/race';
import { RpcServerEvent } from '@public/shared/rpc';

import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { RaceRepository } from '../repository/race.repository';

@Provider()
export class RaceProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(RaceRepository)
    private raceRepository: RaceRepository;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.RACE_ADD)
    public async onRaceAdd(source: number, race: Race) {
        const dbRace = await this.prismaService.race.create({
            data: {
                model: race.carModel,
                name: race.name,
                npc_position: JSON.stringify(race.npcPosition),
                start: JSON.stringify(race.start),
                enabled: race.enabled,
                checkpoints: JSON.stringify(race.checkpoints),
                fps: false,
                garage: race.garageLocation && JSON.stringify(race.garageLocation),
                configuration: race.vehicleConfiguration && JSON.stringify(race.vehicleConfiguration),
            },
        });

        const races = await this.raceRepository.get();
        race.id = dbRace.id;
        races[dbRace.id] = race;

        this.raceRepository.setupTp(race);

        this.notifier.notify(source, `Course ~g~${race.name}~s~ créée`, 'success');

        TriggerClientEvent(ClientEvent.RACE_ADD_UPDATE, -1, race);
    }

    @OnEvent(ServerEvent.RACE_UPDATE)
    public async onRaceUpdate(source: number, race: Race) {
        await this.prismaService.race.update({
            where: {
                id: race.id,
            },
            data: {
                model: race.carModel,
                name: race.name,
                npc_position: JSON.stringify(race.npcPosition),
                start: JSON.stringify(race.start),
                enabled: race.enabled,
                checkpoints: JSON.stringify(race.checkpoints),
                fps: race.fps,
                garage: race.garageLocation && JSON.stringify(race.garageLocation),
                configuration: race.vehicleConfiguration && JSON.stringify(race.vehicleConfiguration),
            },
        });

        race.display = false;
        race.npc = null;

        const races = await this.raceRepository.get();
        races[race.id] = race;

        this.raceRepository.setupTp(race);

        this.notifier.notify(source, `Course ~g~${race.name}~s~ mise à jour`, 'success');

        TriggerClientEvent(ClientEvent.RACE_ADD_UPDATE, -1, race);
    }

    @OnEvent(ServerEvent.RACE_DELETE)
    public async onRaceDelete(source: number, raceId: number) {
        const dbRace = await this.prismaService.race.delete({
            where: {
                id: raceId,
            },
        });

        const races = await this.raceRepository.get();
        delete races[raceId];

        this.notifier.notify(source, `Course ~g~${dbRace.name}~s~ supprimmée`, 'success');

        TriggerClientEvent(ClientEvent.RACE_DELETE, -1, raceId);
    }

    @OnEvent(ServerEvent.RACE_FINISH)
    public async onRaceFinish(source: number, raceId: number, result: [number[], number[]]) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const dbInfo = await this.prismaService.race_score.findUnique({
            where: {
                citizenid_race_id: {
                    citizenid: player.citizenid,
                    race_id: raceId,
                },
            },
        });

        if (!dbInfo) {
            await this.prismaService.race_score.create({
                data: {
                    best_run: JSON.stringify(result[0]),
                    best_splits: JSON.stringify(result[1]),
                    citizenid: player.citizenid,
                    race_id: raceId,
                },
            });
        } else {
            await this.prismaService.race_score.update({
                where: {
                    citizenid_race_id: {
                        citizenid: player.citizenid,
                        race_id: raceId,
                    },
                },
                data: {
                    best_run: JSON.stringify(result[0]),
                    best_splits: JSON.stringify(result[1]),
                },
            });
        }
    }

    @OnEvent(ServerEvent.RACE_CLEAR_RANKING)
    public async onClearRanking(source: number, raceId: number) {
        await this.prismaService.race_score.deleteMany({
            where: {
                race_id: raceId,
            },
        });

        const races = await this.raceRepository.get();
        const race = races[raceId];

        this.notifier.notify(source, `Classement de la course ~g~${race.name}~s~ supprimée`, 'success');
    }

    @Rpc(RpcServerEvent.RACE_SERVER_START)
    public gardenEnter(source: number) {
        SetRoutingBucketEntityLockdownMode(source, 'strict');
        SetPlayerRoutingBucket(String(source), source);
        SetRoutingBucketPopulationEnabled(source, false);
        return true;
    }

    @Rpc(RpcServerEvent.RACE_SERVER_EXIT)
    public gardenExit(source: number) {
        SetPlayerRoutingBucket(String(source), 0);
    }

    @Rpc(RpcServerEvent.RACE_GET_RANKING)
    public async getRanking(source: number, raceId: number): Promise<RaceRankingInfo> {
        const dbInfo = await this.prismaService.race_score.findMany({
            where: {
                race_id: raceId,
            },
        });

        let ranks: RaceRanking[] = [];
        for (let i = 0; i < dbInfo.length; i++) {
            if (!dbInfo[i].best_run) {
                continue;
            }
            const best = JSON.parse(dbInfo[i].best_run) as number[];
            ranks.push({
                citizenId: dbInfo[i].citizenid,
                time: best[best.length - 1],
                name: await this.playerService.getNameFromCitizenId(dbInfo[i].citizenid),
            });
        }

        ranks = ranks.sort((a, b) => a.time - b.time);

        return {
            max: ranks.length,
            ranks: ranks,
        };
    }

    @Rpc(RpcServerEvent.RACE_GET_SPLITS)
    public async getSplit(source: number, raceId: number): Promise<[number[], number[]]> {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const dbInfo = await this.prismaService.race_score.findUnique({
            where: {
                citizenid_race_id: {
                    citizenid: player.citizenid,
                    race_id: raceId,
                },
            },
        });

        if (!dbInfo) {
            return [null, null];
        }

        return [
            dbInfo.best_run ? JSON.parse(dbInfo.best_run) : null,
            dbInfo.best_splits ? JSON.parse(dbInfo.best_splits) : null,
        ];
    }
}
