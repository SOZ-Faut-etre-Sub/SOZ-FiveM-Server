import { Command } from '@public/core/decorators/command';
import { Once, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Vfx } from '@public/shared/animation';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { isPlayerInsideApartment } from '@public/shared/housing/housing';
import { isStaff } from '@public/shared/player';
import { Vector3 } from '@public/shared/polyzone/vector';

import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';

@Provider()
export class PropsProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ItemService)
    private itemService: ItemService;

    private async onUseSozHammer(source: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (isPlayerInsideApartment(player) && !isStaff(player)) {
            this.notifier.notify(
                source,
                "Attend, tu as vraiment voulu utiliser ton pouvoir dans ton habitation ? Tu n'es pas assez riche comme cela ? Respecte toi un peu et va donc acheter tes meubles au ZKEA.",
                'error'
            );
            return;
        }

        TriggerClientEvent(ClientEvent.PROP_OPEN_MENU, source);
    }

    @Once()
    public async onStart() {
        this.itemService.setItemUseCallback('soz_hammer', this.onUseSozHammer.bind(this));
    }

    @OnEvent(ServerEvent.ANIMATION_FX)
    public onAnimationFx(source: number, objectNetId: number, fx: Vfx, players: number[], bone: number) {
        for (const player of players) {
            TriggerClientEvent(ClientEvent.ANIMATION_FX, player, objectNetId, fx, bone);
        }
    }

    @OnEvent(ServerEvent.ANIMATION_FX_POSITION)
    public onAnimationFxPosition(source: number, fx: Vfx, players: number[]) {
        for (const player of players) {
            TriggerClientEvent(ClientEvent.ANIMATION_FX_POSITION, player, fx);
        }
    }

    @OnEvent(ServerEvent.ANIMATION_OBJECT_WORLD)
    public onAnimationObjectWorld(
        source: number,
        players: number[],
        dict: string,
        name: string,
        model: number,
        position: Vector3
    ) {
        for (const player of players) {
            TriggerClientEvent(ClientEvent.ANIMATION_OBJECT_WORLD, player, dict, name, model, position);
        }
    }

    @OnEvent(ServerEvent.ANIMATION_OBJECT_GRID)
    public onAnimationObjectGrid(source: number, players: number[], dict: string, name: string, id: string) {
        for (const player of players) {
            TriggerClientEvent(ClientEvent.ANIMATION_OBJECT_GRID, player, dict, name, id);
        }
    }

    @Command('deleteEntity', {
        role: ['admin', 'staff'],
    })
    public deleteEntity(source: number, netIdStr: string) {
        const netId = parseInt(netIdStr);
        const entity = NetworkGetEntityFromNetworkId(netId);
        if (entity) {
            DeleteEntity(entity);
        }
    }
}
