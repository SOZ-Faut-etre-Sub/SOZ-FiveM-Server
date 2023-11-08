import { VehicleCategory } from '@public/shared/vehicle/vehicle';

import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { Err, Ok } from '../../shared/result';
import { RpcServerEvent } from '../../shared/rpc';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../progress.service';

@Provider()
export class VehiclePitStopProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @OnNuiEvent(NuiEvent.VehiclePitStop)
    async handlePitStop(price: number) {
        const ped = PlayerPedId();

        const player = this.playerService.getPlayer();
        if (player.money.money < price) {
            this.notifier.notify("Vous n'avez pas assez d'argent", 'error');
            return;
        }

        this.nuiMenu.closeAll();

        const { completed } = await this.progressService.progress('pitstop', 'Pit Stop en cours ...', 120000, null, {
            disableCarMovement: true,
            disableMovement: true,
        });

        if (!completed) {
            return;
        }

        const vehicle = GetVehiclePedIsIn(ped, false);
        if (!vehicle) {
            return;
        }

        TriggerServerEvent(ServerEvent.VEHICLE_PITSTOP, NetworkGetNetworkIdFromEntity(vehicle));
    }

    @OnNuiEvent(NuiEvent.VehiclePitStopPrices)
    async getPiStopPrices() {
        return emitRpc<Record<string, number>>(RpcServerEvent.VEHICLE_PITSTOP_PRICES);
    }

    @OnNuiEvent(NuiEvent.VehiclePitStopSetPrice)
    async setPiStopPrice({ category, price }: { category: string; price: number }) {
        const newPrice = await this.inputService.askInput(
            {
                title: `Prix du Pit Stop pour les ${VehicleCategory[category]}`,
                maxCharacters: 10,
                defaultValue: price.toString(),
            },
            value => {
                if (!value) {
                    return Ok(true);
                }
                const int = parseInt(value);
                if (isNaN(int) || int < 0) {
                    return Err('Valeur incorrecte');
                }
                return Ok(true);
            }
        );

        return emitRpc<Record<string, number>>(
            RpcServerEvent.VEHICLE_PITSTOP_PRICES_UPDATE,
            category,
            parseInt(newPrice)
        );
    }
}
