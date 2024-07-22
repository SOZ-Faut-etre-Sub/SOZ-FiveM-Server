import { OnEvent } from '@core/decorators/event';
import { Provider } from '@core/decorators/provider';
import { Command } from '@public/core/decorators/command';
import { Inject } from '@public/core/decorators/injectable';
import { PrismaService } from '@public/server/database/prisma.service';
import { Monitor } from '@public/server/monitor/monitor';
import { PlayerService } from '@public/server/player/player.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { DamageData, DamageServerData } from '@public/shared/job/lsmc';

import { MedicalMetadata } from '../../../shared/inventory';

@Provider()
export class LSMCDamageProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Monitor)
    private monitor: Monitor;

    @OnEvent(ServerEvent.LSMC_DAMAGE_ADD)
    public async addDamage(source: number, damage: DamageData) {
        const player = this.playerService.getPlayer(source);
        let attackerId = '';

        if (damage.attackerId == 0) {
            attackerId = 'UNKNOWN';
        } else if (damage.attackerId != -1) {
            attackerId = this.playerService.getPlayer(damage.attackerId).citizenid;
        } else if (damage.attackerId == -1) {
            attackerId = 'ADMIN';
        }

        await this.prismaService.player_damage.create({
            data: {
                attackerId: attackerId,
                bone: damage.bone,
                damageQty: damage.damageQty,
                damageType: damage.damageType,
                weapon: damage.weapon,
                isFatal: damage.isFatal,
                citizenid: player.citizenid,
                date: new Date(),
            },
        });
    }

    @OnEvent(ServerEvent.LSMC_SCAN)
    public async getPatientInformations(source: number, targetId: number) {
        const target = this.playerService.getPlayer(targetId);
        if (!target) {
            return;
        }

        const damages = await this.prismaService.player_damage.findMany({
            where: {
                citizenid: target.citizenid,
            },
        });

        const formattedDamages = damages.map(damage => {
            const formattedDamage: DamageServerData = {
                attackerId: damage.attackerId,
                bone: damage.bone,
                citizenid: damage.citizenid,
                damageQty: damage.damageQty,
                damageType: damage.damageType,
                date: damage.date.getTime(),
                isFatal: damage.isFatal,
                weapon: damage.weapon,
            };
            return formattedDamage;
        });

        const data: MedicalMetadata = {
            damages: formattedDamages,
            patient: {
                metadata: target.metadata,
                charinfo: target.charinfo,
                job: target.job,
                hash: target.skin.Model.Hash,
            },
            date: Date.now(),
        };
        TriggerClientEvent(ClientEvent.LSMC_SHOW_MEDICAL_DIAG, source, data);
    }

    @Command('damageremove', {
        role: ['staff', 'admin'],
    })
    public async removeDamages(source: number) {
        const player = this.playerService.getPlayer(source);
        await this.prismaService.player_damage.deleteMany({
            where: {
                citizenid: player.citizenid,
            },
        });

        this.monitor.traceEvent('job_lsmc_damageremove', {
            player_source: source,
        });
    }

    @Command('damageshow', {
        role: ['staff', 'admin'],
    })
    public async showDamages(source: number) {
        this.getPatientInformations(source, source);
    }
}
