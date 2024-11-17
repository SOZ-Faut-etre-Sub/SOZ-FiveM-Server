import { Tick } from '@core/decorators/tick';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { emitRpc } from '@public/core/rpc';
import { Vector3, Vector4 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event';
import { ItemProvider } from '../item/item.provider';
import { LSMCPlasterProvider } from '../job/lsmc/lsmc.plaster.provider';
import { LSMCStretcherProvider } from '../job/lsmc/lsmc.stretcher.provider';
import { LSMCWheelChairProvider } from '../job/lsmc/lsmc.wheelchair.provider';
import { AttachedObjectService } from '../object/attached.object.service';
import { WeaponDrawingProvider } from '../weapon/weapon.drawing.provider';

@Provider()
export class PlayerPositionProvider {
    private readonly fadeDelay = 500;

    @Inject(WeaponDrawingProvider)
    private weaponDrawingProvider: WeaponDrawingProvider;

    @Inject(LSMCWheelChairProvider)
    private LSMCWheelChairProvider: LSMCWheelChairProvider;

    @Inject(LSMCStretcherProvider)
    private LSMCStretcherProvider: LSMCStretcherProvider;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(AttachedObjectService)
    private attachedObjectService: AttachedObjectService;

    @Inject(LSMCPlasterProvider)
    private LSMCPlasterProvider: LSMCPlasterProvider;

    @Inject(ItemProvider)
    private itemProvider: ItemProvider;

    @Tick(1000)
    updatePosition() {
        const position = GetEntityCoords(PlayerPedId()) as Vector3;

        this.nuiDispatch.dispatch('player', 'UpdatePosition', position);
    }

    @OnEvent(ClientEvent.PLAYER_TELEPORT)
    async onPlayerTeleport(zone: string) {
        await this.teleportPlayerToPosition(zone);
    }

    async teleportPlayerToPosition(target: string, cb?: () => void) {
        const playerPed = PlayerPedId();

        await this.startTp(playerPed);

        await emitRpc(RpcServerEvent.PLAYER_TELEPORT, target);

        await this.endTp(playerPed, cb);
    }

    async teleportAdminToPosition([x, y, z, w]: Vector4) {
        const playerPed = PlayerPedId();

        await this.startTp(playerPed);

        SetEntityCoords(playerPed, x, y, z, false, false, false, false);
        SetEntityHeading(playerPed, w || 0.0);

        this.endTp(playerPed, null);
    }

    public async removeProps() {
        await this.weaponDrawingProvider.undrawWeapons();
        this.LSMCPlasterProvider.disablePlaster();
        this.attachedObjectService.detachAll();
    }

    private async startTp(playerPed: number) {
        FreezeEntityPosition(playerPed, true);
        DoScreenFadeOut(this.fadeDelay);
        await wait(this.fadeDelay);

        await this.removeProps();

        await this.LSMCStretcherProvider.startTp();
        await this.LSMCWheelChairProvider.startTp();
    }

    private async endTp(playerPed: number, cb?: () => void) {
        while (!HasCollisionLoadedAroundEntity(playerPed)) {
            await wait(1);
        }

        await wait(1000);

        FreezeEntityPosition(playerPed, false);

        if (cb) {
            await cb();
        }

        await this.LSMCStretcherProvider.endTp();
        await this.LSMCWheelChairProvider.endTp();

        this.weaponDrawingProvider.drawWeapons();
        this.LSMCPlasterProvider.enablePlaster();
        this.itemProvider.onWalkStickRefresh();

        DoScreenFadeIn(this.fadeDelay);
        await wait(this.fadeDelay);
    }
}
