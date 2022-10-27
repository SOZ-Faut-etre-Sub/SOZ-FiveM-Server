import { On } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { doLooting, Loot } from '../../../shared/loot';
import { Vector3 } from '../../../shared/polyzone/vector';
import { PrismaService } from '../../database/prisma.service';
import { InventoryManager } from '../../item/inventory.manager';
import { Notifier } from '../../notifier';
import { PlayerMoneyService } from '../../player/player.money.service';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class HuntProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    private loots: Loot[] = [
        { type: 'item', value: 'batrachian_eye', chance: 10 },
        { type: 'item', value: 'zombie_hand', chance: 10 },
        { type: 'item', value: 'surprise_candie', chance: 10 },
        { type: 'item', value: 'head_of_your_dead', chance: 10 },
        { type: 'item', value: 'horror_moon', chance: 10 },
        { type: 'item', value: 'unopenable_gift', chance: 10 },
        { type: 'item', value: 'fake_birthday_cake', chance: 10 },
        { type: 'money', value: 150, chance: 10 },
        { type: 'item', value: 'naked_brain', chance: 10 },
        { type: 'item', value: 'halloween_shopping_bag', chance: 10 },
    ];

    @On(ServerEvent.HALLOWEEN2022_HUNT)
    public async onScenario1(source: number, position: Vector3) {
        if (!isFeatureEnabled(Feature.Halloween)) {
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

        const pumpkinFound = await this.prismaService.halloween_pumpkin_hunt.count({
            where: {
                citizenid: player.citizenid,
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

        this.notifier.notify(source, `Vous avez fouillé ~b~${pumpkinFound + 1}~s~ citrouille(s)`, 'success');
        const loot = doLooting(this.loots);

        if (loot.type === 'item') {
            if (this.inventoryManager.canCarryItem(source, loot.value.toString(), 1)) {
                this.inventoryManager.addItemToInventory(source, loot.value as string, 1);
                return this.notifier.notify(source, 'Vous avez trouvé un objet', 'success');
            } else {
                return this.notifier.notify(source, "Vous n'avez pas assez de place dans votre inventaire", 'error');
            }
        } else if (loot.type === 'money') {
            this.playerMoneyService.add(source, loot.value as number);
            return this.notifier.notify(source, "Vous avez trouvé de l'argent", 'success');
        }
    }
}
