import { On } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { Vector3 } from '../../../shared/polyzone/vector';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { PrismaService } from '../../database/prisma.service';
import { StonkConfig } from '../../../shared/job/stonk';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class HuntProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @On(ServerEvent.HALLOWEEN2022_HUNT)
    public async onScenario1(source: number, position: Vector3) {
        if (!isFeatureEnabled(Feature.Halloween2022)) {
            return;
        }

        const player = this.playerService.getPlayer(source);
        const pumpkinCoords = position.map(v => v.toFixed(3)).join('--');

        const pumpkin = await this.prismaService.halloween_pumpkin_hunt.findMany({
            where: {
                citizenid: player.citizenid,
                coords: pumpkinCoords,
            },
        });

        if (pumpkin.length > 0) {
            this.notifier.notify(source, 'Vous avez déjà fouillé cette citrouille', 'info');
            return;
        }

        const { completed } = await this.progressService.progress(
            source,
            'halloween2022_hunt',
            'Vous fouillez...',
            2000,
            {
                dictionary: 'anim@mp_radio@garage@low',
                name: 'action_a',
                flags: 1,
            },
            {
                disableCombat: true,
                disableCarMovement: true,
                disableMovement: true,
            }
        );

        if (!completed) {
            return;
        }

        await this.prismaService.halloween_pumpkin_hunt.create({
            data: {
                citizenid: player.citizenid,
                coords: pumpkinCoords,
                hunted_at: new Date(),
            },
        });
        this.notifier.notify(source, 'Vous avez fouillé cette citrouille');
    }
}
