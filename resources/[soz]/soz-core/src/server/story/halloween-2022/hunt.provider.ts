import { Exportable } from '@public/core/decorators/exports';

import { On } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { Feature } from '../../../shared/features';
import { doLooting, Loot } from '../../../shared/loot';
import { Vector3 } from '../../../shared/polyzone/vector';
import { PrismaService } from '../../database/prisma.service';
import { FeatureProvider } from '../../feature/feature.provider';
import { InventoryManager } from '../../inventory/inventory.manager';
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

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

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
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) {
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
            this.notifier.notify(source, 'Vous avez déjà trouvé cette coupe', 'info');
            return;
        }

        const { completed } = await this.progressService.progress(
            source,
            'halloween2022_hunt',
            'Vous fouillez...',
            2000,
            {
                dictionary: 'Rcm_epsilonism4',
                name: 'eps_4_ig_1_jimmy_lookaround_idle_a_jb',
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

        const loot = doLooting(this.loots);

        const itemsToAdd = [
            {
                name: 'halloween_blood_cup',
                amount: 1,
            },
        ];

        if (loot.type === 'item') {
            itemsToAdd.push({
                name: loot.value.toString(),
                amount: 1,
            });
        }

        if (!this.inventoryManager.canCarryItems(source, itemsToAdd)) {
            this.notifier.notify(source, "Vous n'avez pas assez de place dans votre inventaire", 'error');
            return;
        }

        await this.prismaService.halloween_pumpkin_hunt.create({
            data: {
                citizenid: player.citizenid,
                coords: pumpkinCoords,
                hunted_at: new Date(),
            },
        });

        this.inventoryManager.addItemToInventory(source, 'halloween_blood_cup', 1);

        if (loot.type === 'item') {
            this.inventoryManager.addItemToInventory(source, loot.value as string, 1);
            this.notifier.notify(source, 'Vous avez trouvé une coupe avec un objet', 'success');
        } else if (loot.type === 'money') {
            this.playerMoneyService.add(source, loot.value as number);
            this.notifier.notify(source, "Vous avez trouvé une coupe avec de l'argent", 'success');
        }
        this.notifier.notify(source, `Vous avez trouvé ~b~${pumpkinFound + 1}~s~ coupe(s)`, 'success');
    }

    @Exportable('isHalloween')
    public isHalloween(): boolean {
        return this.featureProvider.isFeatureEnabled(Feature.Halloween);
    }
}
