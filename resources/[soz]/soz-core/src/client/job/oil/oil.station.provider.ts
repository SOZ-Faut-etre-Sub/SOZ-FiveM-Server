import { OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { emitRpc } from '../../../core/rpc';
import { wait } from '../../../core/utils';
import { ClientEvent, NuiEvent, ServerEvent } from '../../../shared/event';
import { FuelStation, FuelType } from '../../../shared/fuel';
import { MenuType } from '../../../shared/nui/menu';
import { Err, Ok } from '../../../shared/result';
import { RpcEvent } from '../../../shared/rpc';
import { Notifier } from '../../notifier';
import { InputService } from '../../nui/input.service';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';
import { FuelStationRepository } from '../../resources/fuel.station.repository';

@Provider()
export class OilStationProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(FuelStationRepository)
    private fuelStationRepository: FuelStationRepository;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @OnEvent(ClientEvent.OIL_REFILL_ESSENCE_STATION)
    public async onRefillEssenceStation(entity: number, stationId: number) {
        const station = await emitRpc<FuelStation>(RpcEvent.OIL_GET_STATION, stationId);

        if (!station) {
            return;
        }

        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const vehicle = LocalPlayer.state.tankerEntity;
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        if (!vehicle) {
            this.notifier.notify('Aucune citerne de relié.', 'error');

            return;
        }

        if (station.stock >= 2000) {
            this.notifier.notify('La station est déjà pleine.', 'error');

            return;
        }

        const ped = PlayerPedId();
        TaskTurnPedToFaceEntity(ped, entity, 1000);
        await wait(500);

        const refill = await this.inputService.askInput(
            {
                title: 'Quantité à ajouter (en litres) :',
                maxCharacters: 4,
                defaultValue: (2000 - station.stock).toString(),
            },
            (input: string) => {
                const value = parseInt(input);

                if (isNaN(value) || value < 0 || value > 2000) {
                    return Err('Veuillez entrer un nombre entre 0 et 2000');
                }

                if (value > 2000 - station.stock) {
                    return Err('La station ne peut pas contenir plus de 2000 litres');
                }

                return Ok(true);
            }
        );

        if (!refill) {
            return;
        }

        TriggerServerEvent(ServerEvent.OIL_REFILL_ESSENCE_STATION, stationId, parseInt(refill), vehicleNetworkId);
    }

    @OnEvent(ClientEvent.OIL_REFILL_KEROSENE_STATION)
    public async onRefillKeroseneStation(entity: number, stationId: number) {
        const station = await emitRpc<FuelStation>(RpcEvent.OIL_GET_STATION, stationId);

        if (!station) {
            return;
        }

        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const ped = PlayerPedId();
        TaskTurnPedToFaceEntity(ped, entity, 1000);
        await wait(500);

        const refill = await this.inputService.askInput(
            {
                title: 'Quantité à ajouter (en litres) :',
                maxCharacters: 4,
                defaultValue: (2000 - station.stock).toString(),
            },
            (input: string) => {
                const value = parseInt(input);

                if (isNaN(value) || value < 0 || value > 2000) {
                    return Err('Veuillez entrer un nombre entre 0 et 2000');
                }

                if (value > 2000 - station.stock) {
                    return Err('La station ne peut pas contenir plus de 2000 litres');
                }

                return Ok(true);
            }
        );

        TriggerServerEvent(ServerEvent.OIL_REFILL_KEROSENE_STATION, stationId, parseInt(refill));
    }

    @OnEvent(ClientEvent.OIL_UPDATE_STATION_PRICE)
    public async updateStationPrice() {
        const stationPrices = await emitRpc<Record<FuelType, number>>(RpcEvent.OIL_GET_STATION_PRICES);

        if (!stationPrices) {
            return;
        }

        this.nuiMenu.openMenu(MenuType.OilSetStationPrice, stationPrices);
    }

    @OnNuiEvent(NuiEvent.OilAskStationPrice)
    public async onAskStationPrice({ price, type }) {
        const priceStr = await this.inputService.askInput(
            {
                title: 'Nouveau prix :',
                maxCharacters: 5,
                defaultValue: price.toFixed(2).toString(),
            },
            (input: string) => {
                const value = parseFloat(input);

                if (isNaN(value) || value < 0) {
                    return Err('Veuillez entrer un nombre positif');
                }

                return Ok(true);
            }
        );

        if (!priceStr) {
            return;
        }

        const newPrice = parseFloat(priceStr);

        TriggerServerEvent(ServerEvent.OIL_SET_STATION_PRICE, newPrice, type);

        this.nuiMenu.closeMenu();
    }
}
