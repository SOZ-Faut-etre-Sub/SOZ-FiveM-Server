import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { emitRpc } from '../../../core/rpc';
import { wait } from '../../../core/utils';
import { ServerEvent } from '../../../shared/event/server';
import { JobType } from '../../../shared/job';
import { OIL_FIELDS } from '../../../shared/job/oil';
import { Zone } from '../../../shared/polyzone/box.zone';
import { MultiZone } from '../../../shared/polyzone/multi.zone';
import { PolygonZone } from '../../../shared/polyzone/polygon.zone';
import { Vector3 } from '../../../shared/polyzone/vector';
import { RpcServerEvent } from '../../../shared/rpc';
import { VehicleClass } from '../../../shared/vehicle/vehicle';
import { AnimationService } from '../../animation/animation.service';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { RopeService } from '../../rope.service';
import { SoundService } from '../../sound.service';
import { TargetFactory } from '../../target/target.factory';

const REFINERY_ZONES: Zone[] = [
    {
        center: [2772.16, 1496.61, 24.49],
        width: 14.2,
        length: 7.25,
        heading: 75,
        minZ: 23.49,
        maxZ: 28.49,
    },
    {
        center: [2780.79, 1528.84, 24.52],
        width: 14.2,
        length: 7.25,
        heading: 75,
        minZ: 23.49,
        maxZ: 28.49,
    },
    {
        center: [2790.07, 1561.52, 24.58],
        width: 14.2,
        length: 7.25,
        heading: 75,
        minZ: 23.49,
        maxZ: 28.49,
    },
];

@Provider()
export class OilTankerProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(RopeService)
    private ropeService: RopeService;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(SoundService)
    private soundService: SoundService;

    public currentTankerAttached: number | null = null;

    private fieldZone: MultiZone<PolygonZone<string>, string> = new MultiZone();

    @Once(OnceStep.PlayerLoaded)
    public setupTanker() {
        for (const fieldKey of Object.keys(OIL_FIELDS)) {
            const field = OIL_FIELDS[fieldKey];

            this.fieldZone.addZone(new PolygonZone(field.zone, { data: fieldKey }));
        }

        this.targetFactory.createForModel(
            ['tanker', 'tanker2'],
            [
                {
                    icon: 'fuel/pistolet',
                    label: 'Connecter le Tanker',
                    job: JobType.Oil,
                    blackoutGlobal: true,
                    blackoutJob: JobType.Oil,
                    category: 'society',
                    canInteract: () => !this.currentTankerAttached,
                    action: this.connectTanker.bind(this),
                },
                {
                    icon: 'fuel/pistolet',
                    label: 'Déconnecter le Tanker',
                    category: 'society',
                    canInteract: () => {
                        const player = this.playerService.getPlayer();

                        if (!player) {
                            return false;
                        }

                        return this.currentTankerAttached !== null;
                    },
                    action: this.disconnectTanker.bind(this),
                },
            ],
            4.0
        );

        this.targetFactory.createForBoxZone(
            'mtp_fuel_resell',
            {
                center: [263.58, -2972.16, 5.31],
                width: 10.4,
                length: 10.4,
                heading: 45,
                minZ: 3.31,
                maxZ: 15.31,
            },
            [
                {
                    icon: 'fuel/remplir',
                    label: 'Relier le Tanker',
                    category: 'society',
                    job: JobType.Oil,
                    blackoutGlobal: true,
                    blackoutJob: JobType.Oil,
                    canInteract: () => this.currentTankerAttached !== null,
                    action: this.tankerResell.bind(this),
                },
            ]
        );

        for (const zone of REFINERY_ZONES) {
            this.targetFactory.createForBoxZone(`mtp_fuel_refinery_${zone.center[0]}`, zone, [
                {
                    icon: 'fuel/remplir',
                    label: 'Relier le Tanker',
                    category: 'society',
                    job: JobType.Oil,
                    blackoutGlobal: true,
                    blackoutJob: JobType.Oil,
                    canInteract: () => this.currentTankerAttached !== null,
                    action: this.refineTanker.bind(this),
                },
            ]);
        }

        this.targetFactory.createForModel(
            ['p_oil_pjack_01_s', 'p_oil_pjack_02_s', 'p_oil_pjack_03_s'],
            [
                {
                    icon: 'fuel/remplir',
                    label: 'Relier le Tanker',
                    category: 'society',
                    job: JobType.Oil,
                    blackoutGlobal: true,
                    blackoutJob: JobType.Oil,
                    canInteract: () =>
                        this.currentTankerAttached !== null &&
                        this.fieldZone.isPointInside(GetEntityCoords(PlayerPedId()) as Vector3),
                    action: this.refillTanker.bind(this),
                },
            ]
        );
    }

    public async connectTanker(vehicle: number) {
        if (this.currentTankerAttached !== null) {
            return;
        }

        const vehicleNetId = NetworkGetNetworkIdFromEntity(vehicle);
        const isLocked = await emitRpc<boolean>(RpcServerEvent.OIL_LOCK_TANKER, vehicleNetId);

        if (!isLocked) {
            this.notifier.error("Le tanker est déjà utilisé par quelqu'un d'autre");

            return;
        }

        this.notifier.notify('Vous cherchez à ~r~connecter~s~ le Tanker.', 'info');

        TaskTurnPedToFaceEntity(PlayerPedId(), vehicle, 1000);
        await wait(500);

        const attachPosition = GetOffsetFromEntityInWorldCoords(vehicle, 0.0, -5.9, -1.0) as Vector3;
        const nozzle = await this.ropeService.createNewRope(
            attachPosition,
            vehicle,
            3,
            25.0,
            'hei_prop_hei_hose_nozzle'
        );
        if (!nozzle) {
            return;
        }

        this.soundService.playAround('fuel/start_fuel', 5, 0.3);
        this.currentTankerAttached = vehicle;
    }

    public async disconnectTanker() {
        if (this.currentTankerAttached === null) {
            return;
        }

        const vehicleNetId = NetworkGetNetworkIdFromEntity(this.currentTankerAttached);

        TaskTurnPedToFaceEntity(PlayerPedId(), this.currentTankerAttached, 500);
        await wait(500);

        this.ropeService.deleteRope();
        this.currentTankerAttached = null;

        this.soundService.playAround('fuel/end_fuel', 5, 0.3);

        TriggerServerEvent(ServerEvent.OIL_UNLOCK_TANKER, vehicleNetId);
    }

    public async refillTanker(entity: number) {
        if (this.currentTankerAttached === null) {
            return;
        }

        const zone = this.fieldZone.getZoneInside(GetEntityCoords(entity) as Vector3);

        if (!zone) {
            return;
        }

        const field = zone.data;
        const entityClass = GetVehicleClass(this.currentTankerAttached) as VehicleClass;
        const vehicleNetId = NetworkGetNetworkIdFromEntity(this.currentTankerAttached);

        TaskTurnPedToFaceEntity(PlayerPedId(), entity, 500);
        await wait(500);

        TriggerServerEvent(ServerEvent.OIL_REFILL_TANKER, vehicleNetId, entityClass, field);
    }

    public refineTanker() {
        if (this.currentTankerAttached === null) {
            return;
        }

        const entityClass = GetVehicleClass(this.currentTankerAttached) as VehicleClass;
        const vehicleNetId = NetworkGetNetworkIdFromEntity(this.currentTankerAttached);

        TriggerServerEvent(ServerEvent.OIL_REFINE_TANKER, vehicleNetId, entityClass);
    }

    public tankerResell() {
        if (this.currentTankerAttached === null) {
            return;
        }

        const entityClass = GetVehicleClass(this.currentTankerAttached) as VehicleClass;
        const vehicleNetId = NetworkGetNetworkIdFromEntity(this.currentTankerAttached);

        TriggerServerEvent(ServerEvent.OIL_RESELL_TANKER, vehicleNetId, entityClass);
    }
}
