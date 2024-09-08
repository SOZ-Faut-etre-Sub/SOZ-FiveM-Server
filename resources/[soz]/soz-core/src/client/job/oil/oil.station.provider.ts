import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { emitRpc } from '../../../core/rpc';
import { wait } from '../../../core/utils';
import { ClientEvent, NuiEvent, ServerEvent } from '../../../shared/event';
import { FuelStation, FuelType } from '../../../shared/fuel';
import { JobPermission, JobType } from '../../../shared/job';
import { PositiveNumberValidator } from '../../../shared/nui/input';
import { MenuType } from '../../../shared/nui/menu';
import { Vector3 } from '../../../shared/polyzone/vector';
import { Err, Ok } from '../../../shared/result';
import { RpcServerEvent } from '../../../shared/rpc';
import { Notifier } from '../../notifier';
import { InputService } from '../../nui/input.service';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';
import { JobService } from '../job.service';
import { OilTankerProvider } from './oil.tanker.provider';

@Provider()
export class OilStationProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(OilTankerProvider)
    private oilTankerProvider: OilTankerProvider;

    @Once(OnceStep.PlayerLoaded)
    public setupStation() {
        this.targetFactory.createForBoxZone(
            'mtp_set_price',
            {
                center: [-244.89, 6068.39, 40.57],
                width: 0.55,
                length: 1.4,
                heading: 315,
                minZ: 39.57,
                maxZ: 42.57,
            },
            [
                {
                    icon: 'fuel/remplir',
                    color: 'oil',
                    label: 'Configurateur station',
                    job: JobType.Oil,
                    blackoutGlobal: true,
                    blackoutJob: JobType.Oil,
                    category: 'society',
                    canInteract: () => this.jobService.hasPermission(JobType.Oil, JobPermission.FuelerChangePrice),
                    action: () => {
                        this.updateStationPrice();
                    },
                },
            ]
        );
    }

    @OnEvent(ClientEvent.OIL_REFILL_ESSENCE_STATION)
    public async onRefillEssenceStation(entity: number, stationId: number) {
        const station = await emitRpc<FuelStation>(RpcServerEvent.OIL_GET_STATION, stationId);

        if (!station) {
            return;
        }

        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        const vehicle = this.oilTankerProvider.currentTankerAttached;
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        if (!vehicle) {
            this.notifier.notify('Aucune citerne de relié.', 'error');

            return;
        }

        if (station.stock >= 3000) {
            this.notifier.notify('La station est déjà pleine.', 'error');

            return;
        }

        const ped = PlayerPedId();
        TaskTurnPedToFaceEntity(ped, entity, 1000);
        await wait(500);

        const refill = await this.inputService.askInput<number>(
            {
                title: 'Quantité à ajouter (en litres) :',
                maxCharacters: 4,
                defaultValue: (3000 - station.stock).toString(),
            },
            (input: string) => {
                const value = Number(input);

                if (isNaN(value) || value < 0 || value > 3000) {
                    return Err('Veuillez entrer un nombre entre 0 et 3000');
                }

                if (value > 3000 - station.stock) {
                    return Err('La station ne peut pas contenir plus de 3000 litres');
                }

                return Ok(value);
            }
        );

        if (!refill) {
            return;
        }

        TriggerServerEvent(ServerEvent.OIL_REFILL_ESSENCE_STATION, stationId, refill, vehicleNetworkId);
    }

    @OnEvent(ClientEvent.OIL_REFILL_KEROSENE_STATION)
    public async onRefillKeroseneStation(entity: number, stationId: number) {
        const station = await emitRpc<FuelStation>(RpcServerEvent.OIL_GET_STATION, stationId);

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

        const refill = await this.inputService.askInput<number>(
            {
                title: 'Quantité à ajouter (en litres) :',
                maxCharacters: 4,
                defaultValue: (3000 - station.stock).toString(),
            },
            (input: string) => {
                const value = Number(input);

                if (isNaN(value) || value < 0 || value > 3000) {
                    return Err('Veuillez entrer un nombre entre 0 et 3000');
                }

                if (value > 3000 - station.stock) {
                    return Err('La station ne peut pas contenir plus de 3000 litres');
                }

                return Ok(value);
            }
        );

        TriggerServerEvent(ServerEvent.OIL_REFILL_KEROSENE_STATION, stationId, refill);
    }

    public async updateStationPrice() {
        const stationPrices = await emitRpc<Record<FuelType, number>>(RpcServerEvent.OIL_GET_STATION_PRICES);

        if (!stationPrices) {
            return;
        }

        this.nuiMenu.openMenu(MenuType.OilSetStationPrice, stationPrices, {
            position: {
                position: GetEntityCoords(PlayerPedId(), true) as Vector3,
                distance: 3,
            },
        });
    }

    @OnNuiEvent(NuiEvent.OilAskStationPrice)
    public async onAskStationPrice({ price, type }) {
        const newPrice = await this.inputService.askInput(
            {
                title: 'Nouveau prix :',
                maxCharacters: 5,
                defaultValue: price.toFixed(2).toString(),
            },
            PositiveNumberValidator
        );

        TriggerServerEvent(ServerEvent.OIL_SET_STATION_PRICE, newPrice, type);

        this.nuiMenu.closeMenu();
    }
}
