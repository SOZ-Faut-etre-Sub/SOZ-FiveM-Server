import { PermissionService } from '@public/server/permission.service';

import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { TaxLabel, TaxType } from '../../../shared/bank';
import { JobTaxTier } from '../../../shared/configuration';
import { ServerEvent } from '../../../shared/event/server';
import { JobPermission, JobType } from '../../../shared/job';
import { PrismaService } from '../../database/prisma.service';
import { JobService } from '../../job.service';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ConfigurationRepository } from '../../repository/configuration.repository';
import { TaxRepository } from '../../repository/tax.repository';

@Provider()
export class GouvProvider {
    @Inject(TaxRepository)
    private taxRepository: TaxRepository;

    @Inject(ConfigurationRepository)
    private configurationRepository: ConfigurationRepository;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @OnEvent(ServerEvent.GOUV_UPDATE_JOB_TIER_TAX)
    public async updateJobTierTax(source: number, tier: keyof JobTaxTier, value: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (!(await this.jobService.hasPermission(player, JobType.Gouv, JobPermission.GouvUpdateTax))) {
            return;
        }

        const jobTaxTier = await this.configurationRepository.getValue('JobTaxTier');

        if (tier === 'Tier1' && value > jobTaxTier.Tier2) {
            this.notifier.notify(source, `Le palier ~g~"Tier 1"~s~ doit être inférieur au palier ~g~"Tier 2"~s~`);

            return;
        }

        if (tier === 'Tier2' && (value < jobTaxTier.Tier1 || value > jobTaxTier.Tier3)) {
            this.notifier.notify(
                source,
                `Le palier ~g~"Tier 2"~s~ doit être compris entre ~g~"Tier 1"~s~ et ~g~"Tier 3"~s~`
            );

            return;
        }

        if (tier === 'Tier3' && (value < jobTaxTier.Tier2 || value > jobTaxTier.Tier4)) {
            this.notifier.notify(
                source,
                `Le palier ~g~"Tier 3"~s~ doit être compris entre ~g~"Tier 2"~s~ et ~g~"Tier 4"~s~`
            );

            return;
        }

        if (tier === 'Tier4' && value < jobTaxTier.Tier3) {
            this.notifier.notify(source, `Le palier ~g~"Tier 4"~s~ doit être supérieur au palier ~g~"Tier 3"~s~`);

            return;
        }

        jobTaxTier[tier] = value;

        await this.configurationRepository.update('JobTaxTier', jobTaxTier);

        this.notifier.notify(source, `Vous avez mis à jour le palier ~g~"${tier}"~s~ à ~g~${value}~s~$`);
    }

    @OnEvent(ServerEvent.GOUV_UPDATE_JOB_TIER_TAX_PERCENTAGE)
    public async updateJobTierTaxPercentage(source: number, tier: keyof JobTaxTier, value: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (!(await this.jobService.hasPermission(player, JobType.Gouv, JobPermission.GouvUpdateTax))) {
            return;
        }

        const jobTaxTier = await this.configurationRepository.getValue('JobTaxTier');
        jobTaxTier[tier] = value;

        await this.configurationRepository.update('JobTaxTier', jobTaxTier);

        this.notifier.notify(source, `Vous avez mis à jour le pourcentage à ~g~${value}~s~%`);
    }

    @OnEvent(ServerEvent.GOUV_UPDATE_TAX)
    public async updateTax(source: number, taxType: TaxType, value: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if ((value < 16 || 30 < value) && !this.permissionService.isStaff(source)) {
            this.notifier.error(source, `La valeur de taxe est en ~r~dehors~s~ des normes présidentielles.`);
            return;
        }

        if (!(await this.jobService.hasPermission(player, JobType.Gouv, JobPermission.GouvUpdateTax))) {
            return;
        }

        await this.prismaService.tax.upsert({
            where: { id: taxType },
            update: { value },
            create: { id: taxType, value },
        });

        await this.taxRepository.set(taxType, { id: taxType, value });

        const label = TaxLabel[taxType];

        this.notifier.notify(source, `Vous avez mis à jour la taxe ~g~"${label}"~s~ à ~g~${value}~s~`);
    }

    @OnEvent(ServerEvent.GOUV_VALIDATE_IDENTITY)
    public async onValidateIdentity(source: number, target: number) {
        const sourcePlayer = this.playerService.getPlayer(source);
        const targetPlayer = this.playerService.getPlayer(target);

        if (!sourcePlayer || !targetPlayer) {
            return;
        }

        this.playerService.setPlayerValidated(target, true);

        this.notifier.notify(target, `Votre identité a été ~g~validée~s~.`);
        this.notifier.notify(source, `Vous avez ~g~validé~s~ l'identité.`);
    }
}
