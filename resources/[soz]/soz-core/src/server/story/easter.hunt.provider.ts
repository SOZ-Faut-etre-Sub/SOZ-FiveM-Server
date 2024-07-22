import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { ServerEvent } from '@public/shared/event/server';
import { Feature } from '@public/shared/features';
import { doLooting, Loot } from '@public/shared/loot';
import { Vector3 } from '@public/shared/polyzone/vector';

import { ADD_ERROR_MESSAGE } from '../../shared/inventory';
import { PrismaService } from '../database/prisma.service';
import { FeatureProvider } from '../feature/feature.provider';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';

@Provider()
export class EasterHuntProvider {
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

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    private loots: Loot[] = [
        { type: 'money', value: 150, chance: 20 },
        { type: 'item', value: 'easter_basket', chance: 10 },
        { type: 'item', value: 'golden_egg', chance: 0.1 },
        { type: 'item', value: 'chocolate_bunny', chance: 10 },
        { type: 'item', value: 'stuffed_rabbit', chance: 10 },
        { type: 'item', value: 'easter_bell', chance: 10 },
        { type: 'item', value: 'chocolat_bread', chance: 10 },
        { type: 'item', value: 'chocolat_egg', chance: 10 },
        { type: 'item', value: 'chocolat_milk_egg', chance: 10 },
    ];

    @OnEvent(ServerEvent.EASTER_HUNT)
    public async onHunt(source: number, position: Vector3) {
        if (!this.featureProvider.isFeatureEnabled(Feature.Easter)) {
            return;
        }

        const player = this.playerService.getPlayer(source);
        const pumpkinCoords = position.map(v => v.toFixed(3)).join('--');

        const pumpkin = await this.prismaService.easter_hunt.findMany({
            where: {
                citizenid: player.citizenid,
                coords: pumpkinCoords,
            },
        });

        if (pumpkin.length > 0) {
            this.notifier.notify(source, 'Vous avez déjà fouillé ce panier', 'info');
            return;
        }

        const { completed } = await this.progressService.progress(
            source,
            'easter_hunt',
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

        await this.prismaService.easter_hunt.create({
            data: {
                citizenid: player.citizenid,
                coords: pumpkinCoords,
                hunted_at: new Date(),
            },
        });

        const count = await this.prismaService.easter_hunt.count({
            where: {
                citizenid: player.citizenid,
            },
        });

        this.notifier.notify(source, `Vous avez fouillé ~b~${count}~s~ panier(s)`, 'success');
        const loot = doLooting(this.loots);
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (loot.type === 'item') {
            if (inventory.canCarryItem(loot.value.toString(), 1)) {
                inventory.add(loot.value as string, 1);
                return this.notifier.notify(source, 'Vous avez trouvé un objet', 'success');
            } else {
                return this.notifier.notify(source, ADD_ERROR_MESSAGE['not_enough_space'], 'error');
            }
        } else if (loot.type === 'money') {
            this.playerMoneyService.add(source, loot.value as number);
            return this.notifier.notify(source, "Vous avez trouvé de l'argent", 'success');
        }
    }
}
