import { Inject } from '@public/core/decorators/injectable';
import { Rpc } from '@public/core/decorators/rpc';
import { Tick } from '@public/core/decorators/tick';
import { Outfit, OutfitType } from '@public/shared/cloth';
import { NuiEvent } from '@public/shared/event/nui';
import { joaat } from '@public/shared/joaat';
import { getLocationHash } from '@public/shared/locationhash';
import { RpcClientEvent } from '@public/shared/rpc';

import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { LockService } from '../../server/lock.service';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import {
    FirePit,
    FirePitClient,
    firePitDefaultHealth,
    firePitGrid,
    fireScale,
    fireScriptOffsets,
    FireType,
    offsetFlameCoords,
} from '../../shared/fire';
import { Control } from '../../shared/input';
import { LsmcCloakroom } from '../../shared/job/lsmc';
import { NumberValidator } from '../../shared/nui/input';
import { applyOffset, getDistance, toVector4Object, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { VehicleSeat } from '../../shared/vehicle/vehicle';
import { BlipFactory } from '../blip';
import { ClothingService } from '../clothing/clothing.service';
import { HudWeatherIconProvider } from '../hud/hud.weathericon.provider';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { ObjectProvider } from '../object/object.provider';
import { PlayerService } from '../player/player.service';
import { PlayerWardrobe } from '../player/player.wardrobe';
import { InteractionProvider } from '../quick-interaction/interaction.provider';
import { ResourceLoader } from '../repository/resource.loader';
import { TargetFactory } from '../target/target.factory';
import { BlurService } from '../utils/blur.service';
import { NoClipProvider } from '../utils/noclip.provider';

const FireStations: {
    position: Vector4;
    parkings: Vector4[];
    createProp?: boolean;
}[] = [
    {
        position: [1193.911, -1477.941, 34.86, 0],
        parkings: [
            [1196.39, -1458.25, 34.93, 2.34],
            [1204.22, -1458.16, 34.82, 2.34],
        ],
    },
    {
        position: [197.596, -1650.367, 29.8, 0],
        parkings: [
            [211.53, -1637.02, 29.62, 320.97],
            [217.21, -1641.93, 29.63, 320.97],
        ],
    },
    {
        position: [-632.0661, -93.8063, 37.15667, -10],
        parkings: [
            [-642.5, -102.15, 38.04, 112.68],
            [-639.11, -109.18, 37.98, 112.68],
        ],
        createProp: true,
    },
    {
        position: [1688.698, 3591.899, 34.71125, 20],
        parkings: [
            [1707.53, 3595.44, 35.42, 240.36],
            [1697.58, 3586.26, 35.62, 206.33],
        ],
        createProp: true,
    },
    {
        position: [-364.9791, 6125.985, 30.50336, -135],
        parkings: [
            [-358.75, 6132.6, 31.44, 39.75],
            [-373.8, 6128.87, 31.45, 39.75],
        ],
        createProp: true,
    },
];

const fireVehicleExcludedFromDamages = [joaat('polterminus'), joaat('firetruk')];

@Provider()
export class FireProvider {
    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    @Inject(ObjectProvider)
    private readonly objectProvider: ObjectProvider;

    @Inject(InputService)
    private readonly inputService: InputService;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(ClothingService)
    private readonly clothingService: ClothingService;

    @Inject(BlurService)
    public readonly blurService: BlurService;

    @Inject(HudWeatherIconProvider)
    public readonly hudWeatherIconProvider: HudWeatherIconProvider;

    @Inject(NoClipProvider)
    public readonly noClipProvider: NoClipProvider;

    @Inject(InteractionProvider)
    public readonly interactionProvider: InteractionProvider;

    @Inject(PlayerWardrobe)
    private readonly playerWardrobe: PlayerWardrobe;

    @Inject(TargetFactory)
    private readonly targetFactory: TargetFactory;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(LockService)
    private readonly lockService: LockService;

    private usedFireExtinguisherRecently = false;

    private readonly gridSize = 25;
    private firePits = new Map<string, FirePitClient>();
    private fireToRespawn = new Set<string>();

    private nearOfPit = false;
    private wearingFireClothes = false;

    private previewFirePit: FirePit | null = null;

    @Once(OnceStep.Start, true)
    async onStart() {
        const pits = await emitRpc(RpcServerEvent.FIRE_GET_ALL_PITS);
        for (const [id, fire] of Object.entries(pits)) {
            await this.spawnFirePit(id, fire);
        }

        for (const station of FireStations) {
            const id = 'fire_locker_' + getLocationHash(station.position);
            if (station.createProp) {
                await this.objectProvider.createObject({
                    id,
                    model: joaat('p_cs_locker_01_s'),
                    position: station.position,
                });
            }

            this.blipFactory.create(id, {
                name: 'Caserne de pompier',
                coords: toVector4Object(station.position),
                sprite: 648,
                color: 59,
                scale: 0.9,
            });

            this.targetFactory.createForBoxZone(
                id,
                {
                    center: station.position,
                    length: 1.0,
                    width: 1.0,
                    minZ: station.position[2],
                    maxZ: station.position[2] + 2,
                },
                [
                    {
                        category: 'citizen',
                        label: 'Prendre la tenue',
                        icon: 'fire/clothes',
                        canInteract: this.isClothType.bind(this, 'FIRE', false),
                        action: async () => {
                            const outfit: Outfit = {
                                type: 'FIRE',
                                ...LsmcCloakroom[GetEntityModel(PlayerPedId())]['Tenue incendie'],
                            };

                            const { completed } = await this.playerWardrobe.waitProgress(false);
                            if (completed) {
                                TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, outfit);
                            }
                        },
                    },
                    {
                        category: 'citizen',
                        label: 'Rendre la tenue',
                        icon: 'fire/clothes',
                        canInteract: this.isClothType.bind(this, 'FIRE'),
                        action: async () => {
                            const { completed } = await this.playerWardrobe.waitProgress(false);
                            if (completed) {
                                TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, null);
                            }
                        },
                    },
                    {
                        category: 'citizen',
                        label: 'Sortir un camion',
                        icon: 'fire/truck',
                        canInteract: this.isClothType.bind(this, 'FIRE'),
                        action: async () => {
                            const parking = station.parkings.find(
                                parking =>
                                    !IsPositionOccupied(
                                        parking[0],
                                        parking[1],
                                        parking[2],
                                        0.1,
                                        false,
                                        true,
                                        true,
                                        false,
                                        false,
                                        0,
                                        false
                                    )
                            );

                            if (!parking) {
                                this.notifier.notify("L'emplacement de parking est occupé.", 'error');
                                return null;
                            }

                            TriggerServerEvent(ServerEvent.FIRETRUCK_TAKEOUT, parking);
                        },
                    },
                    {
                        category: 'citizen',
                        label: 'Rentrer un camion',
                        icon: 'fire/truck',
                        canInteract: this.isClothType.bind(this, 'FIRE'),
                        action: async () => {
                            const DISTANCE_THRESHOLD = 20.0;
                            const vehicle = GetPlayersLastVehicle();

                            if (!vehicle) {
                                this.notifier.notify(
                                    'Vous devez monter dans le camion de pompier avant de pouvoir le ranger.',
                                    'error'
                                );
                                return;
                            }

                            if (GetEntityModel(vehicle) !== joaat('firetruk')) {
                                this.notifier.notify(
                                    "Vous ne pouvez pas ranger autre chose qu'un camion de pompier",
                                    'error'
                                );
                                return;
                            }

                            const position = GetEntityCoords(vehicle) as Vector3;
                            if (getDistance(position, station.position) > DISTANCE_THRESHOLD) {
                                this.notifier.notify(
                                    'Vous devez vous rapprocher le camion de pompier pour pouvoir le ranger.',
                                    'error'
                                );
                                return;
                            }

                            const networkId = NetworkGetNetworkIdFromEntity(vehicle);

                            TriggerServerEvent(ServerEvent.FIRETRUCK_RETURN, networkId);
                        },
                    },
                ]
            );
        }
    }

    private isClothType(type: OutfitType, equal = true): boolean {
        const player = this.playerService.getPlayer();
        if (!player) {
            return false;
        }

        if (!equal) {
            return player.metadata.cloth_type !== type;
        }

        return player.metadata.cloth_type === type;
    }

    @Once(OnceStep.Stop)
    async onStop() {
        this.resourceLoader.unloadPtfxAsset('soz_fire');
        this.resourceLoader.unloadPtfxAsset('des_vaultdoor');

        this.firePits.forEach((_pit, id) => this.despawnFirePit(id));
        this.firePits.clear();
    }

    @OnEvent(ClientEvent.FIRE_PIT_SPAWN)
    private async spawnFirePit(id: string, fire: FirePit) {
        return this.lockService.lock(`firepit-${id}`, async () => {
            const existingPit = this.firePits.get(id);
            if (existingPit) return;

            await this.resourceLoader.loadPtfxAsset('soz_fire');
            await this.resourceLoader.loadPtfxAsset('des_vaultdoor');

            const firePtfxs: number[] = [];
            for (const offset of fireScriptOffsets[fire.type]) {
                const firePosition = applyOffset(fire.position, offset);

                const [valid, z] = await this.getZData(firePosition);
                if (!valid) {
                    this.fireToRespawn.add(id);
                    continue;
                }
                firePosition[2] = z;

                const fireHandle = StartScriptFire(firePosition[0], firePosition[1], firePosition[2], 25, false);
                firePtfxs.push(fireHandle);
            }

            AddShockingEventAtPosition(24, fire.position[0], fire.position[1], fire.position[2], 10_000);

            const prevScale = fire.type >= 1 ? fireScale[fire.type - 1] : 0;
            const currentScale = fireScale[fire.type];
            const ptfxScale = this.lerp(
                prevScale,
                currentScale,
                fire.health ? fire.health / firePitDefaultHealth[fire.type] : 1
            );

            const prevFlameZ = fire.type >= 1 ? offsetFlameCoords[fire.type - 1] : 0;
            const currentFlameZ = offsetFlameCoords[fire.type];
            const ptfxFlameZ = this.lerp(
                prevFlameZ,
                currentFlameZ,
                fire.health ? fire.health / firePitDefaultHealth[fire.type] : 1
            );

            SetPtfxAssetNextCall('des_vaultdoor');
            const smokePtfx = StartParticleFxLoopedAtCoord(
                'ent_ray_pro1_residual_smoke',
                fire.position[0],
                fire.position[1],
                fire.position[2],
                0.0,
                0.0,
                fire.position[3],
                ptfxScale,
                false,
                false,
                false,
                false
            );

            if (!smokePtfx) {
                console.log('Failed to create fire smoke ptfx');
            }

            SetPtfxAssetNextCall('soz_fire');
            const flamePtfx = StartParticleFxLoopedAtCoord(
                'ent_ray_shipwreck_smoke_plume',
                fire.position[0],
                fire.position[1],
                fire.position[2] + ptfxFlameZ,
                0.0,
                0.0,
                fire.position[3],
                ptfxScale,
                false,
                false,
                false,
                false
            );

            if (!flamePtfx) {
                console.log('Failed to create fire smoke ptfx');
            }

            this.firePits.set(id, {
                ...fire,
                smokePtfx,
                flamePtfx,
                firePtfxs,
            });
        });
    }

    @OnEvent(ClientEvent.FIRE_PIT_UPDATE)
    async updateFirePit(id: string, fire: FirePit) {
        await this.despawnFirePit(id);
        await this.spawnFirePit(id, fire);
    }

    @Tick(TickInterval.EVERY_SECOND * 30)
    async respawnFirePit() {
        this.fireToRespawn.forEach(fireId => {
            const fire = this.firePits.get(fireId);
            if (!fire) return;

            this.updateFirePit(fireId, fire);
        });
    }

    @OnEvent(ClientEvent.FIRE_PIT_DESPAWN)
    async despawnFirePit(id: string) {
        return this.lockService.lock(`firepit-${id}`, async () => {
            const pit = this.firePits.get(id);
            if (!pit) return;

            StopParticleFxLooped(pit.smokePtfx, false);
            StopParticleFxLooped(pit.flamePtfx, false);

            for (const firePtfx of pit.firePtfxs) {
                RemoveScriptFire(firePtfx);
            }

            this.firePits.delete(id);
            this.fireToRespawn.delete(id);
        });
    }

    @Rpc(RpcClientEvent.FIRE_GET_WIND_DATA)
    async getWindData() {
        const [x, y] = GetWindDirection();
        return [GetWindDirection(), GetHeadingFromVector_2d(x, y)];
    }

    @Rpc(RpcClientEvent.FIRE_GET_Z)
    async getZData(position: Vector3 | Vector4): Promise<[boolean, number]> {
        return GetGroundZFor_3dCoord_2(position[0], position[1], position[2], false);
    }

    @Tick(TickInterval.EVERY_SECOND)
    async onVehicleDamageTick() {
        const ped = PlayerPedId();
        const vehicles = GetGamePool('CVehicle');

        for (const vehicle of vehicles) {
            if (!NetworkHasControlOfEntity(vehicle)) continue;

            const model = GetEntityModel(vehicle);
            if (fireVehicleExcludedFromDamages.includes(model)) continue;

            const coords = GetEntityCoords(vehicle) as Vector3;
            if (!this.getNearFirePit(coords)) continue;

            const vehicleEngineHealth = GetVehicleEngineHealth(vehicle);
            if (isNaN(vehicleEngineHealth) || IsEntityDead(vehicle)) continue;

            const isDriver = GetPedInVehicleSeat(vehicle, VehicleSeat.Driver) === ped;
            const newVehicleEngineHealth = Math.max(-10, vehicleEngineHealth - (isDriver ? 1 : 10));

            SetVehicleEngineHealth(vehicle, newVehicleEngineHealth);
        }
    }

    @Tick(TickInterval.EVERY_SECOND / 2)
    async fireCheckTick() {
        const player = PlayerPedId();
        const playerCoords = GetEntityCoords(player) as Vector3;

        for (const [id, fire] of this.firePits.entries()) {
            if (getDistance(playerCoords, fire.position) > 100) continue;

            for (const offset of fireScriptOffsets[fire.type]) {
                const firePosition = applyOffset(fire.position, offset);
                const [valid, z] = await this.getZData(firePosition);

                if (!valid) continue;

                const fireNearPit = GetNumberOfFiresInRange(firePosition[0], firePosition[1], z, 1);
                if (fireNearPit === 0 && this.usedFireExtinguisherRecently) {
                    emitRpc(RpcServerEvent.FIRE_EXTINGUISHED, id);
                    await wait(5_000);
                    return;
                }
            }
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    async onWeaponTick() {
        const player = PlayerPedId();

        this.usedFireExtinguisherRecently = false;

        const weapon = GetSelectedPedWeapon(player);
        const weaponGroup = GetWeapontypeGroup(weapon);

        if (weaponGroup === joaat('GROUP_FIREEXTINGUISHER') && IsPedShooting(player)) {
            this.usedFireExtinguisherRecently = true;
            await wait(2_000);
        }

        if (weapon === joaat('WEAPON_HOSE') && IsControlPressed(0, Control.Attack)) {
            this.usedFireExtinguisherRecently = true;
            await wait(2_000);
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    async onNewFireTick() {
        if (!this.previewFirePit) return;

        DrawGlowSphere(
            this.previewFirePit.position[0],
            this.previewFirePit.position[1],
            this.previewFirePit.position[2],
            firePitGrid[this.previewFirePit.type] * this.gridSize,
            255,
            0,
            0,
            0.5,
            false,
            false
        );
    }

    @Tick(TickInterval.EVERY_SECOND)
    async onClothingTick() {
        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        if (this.noClipProvider.IsNoClipMode()) {
            return;
        }

        this.wearingFireClothes = this.clothingService.checkWearingClothes(
            'JobClothSet',
            LsmcCloakroom[player.skin.Model.Hash]['Tenue incendie']
        );

        if (this.wearingFireClothes) {
            this.hudWeatherIconProvider.remove('heat');
            this.blurService.remove('fireHeat', 1000);
            return;
        }

        if (this.firePits.size > 0) {
            const ped = PlayerPedId();
            const playerCoords = GetEntityCoords(ped) as Vector3;

            this.nearOfPit = false;

            for (const fire of this.firePits.values()) {
                if (getDistance(fire.position, playerCoords) > fireScale[fire.type] * 10) continue;

                this.notifier.notify(
                    'Vous commencer à avoir très chaud, il vous faut une tenue approprié sinon vous risquez de bruler',
                    'warning'
                );

                this.nearOfPit = true;
                break;
            }
        }

        if (this.nearOfPit) {
            this.hudWeatherIconProvider.add('heat');
            this.blurService.add('fireHeat', 1000);
        } else {
            this.hudWeatherIconProvider.remove('heat');
            this.blurService.remove('fireHeat', 1000);
        }
    }

    @Tick(TickInterval.EVERY_SECOND * 10)
    public onHeatTick() {
        const playerPed = PlayerPedId();

        if (this.noClipProvider.IsNoClipMode()) {
            return;
        }

        if (this.wearingFireClothes || !this.nearOfPit) {
            return;
        }

        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        if (player.metadata.godmode) {
            return;
        }

        if (player.metadata.isdead) {
            return;
        }

        const newHealth = GetEntityHealth(playerPed) - 10;
        SetEntityHealth(playerPed, newHealth);
    }

    private getNearFirePit(position: Vector3): FirePit | null {
        for (const fire of this.firePits.values()) {
            if (getDistance(fire.position, position) < fireScale[fire.type] * 10) {
                return fire;
            }
        }

        return null;
    }

    @OnNuiEvent(NuiEvent.AdminMenuFireFlash)
    public async fireFlash() {
        await emitRpc(RpcServerEvent.PHONE_APP_NEWS_CREATE, {
            type: 'fire',
            reporterId: '',
            job: '',
            message:
                'Alerte Incendie - Suite à une sècheresse accrue, un départ de feu à été détecté. Nous vous invitons à éviter les endroits à risques.',
        });
    }

    @OnNuiEvent(NuiEvent.AdminMenuPreviewFire)
    async previewFire(type: FireType) {
        const ped = PlayerPedId();

        if (!type) {
            this.previewFirePit = null;
            return;
        }

        const coords = GetEntityCoords(ped, false);
        const [isValid, newZ] = GetGroundZFor_3dCoord(coords[0], coords[1], coords[2], false);

        if (!isValid) {
            this.notifier.error('Impossible de trouver une zone solide');
            this.previewFirePit = null;
            return;
        }

        this.previewFirePit = {
            position: [coords[0], coords[1], newZ, GetEntityHeading(ped)],
            type,
        };
    }

    @OnNuiEvent(NuiEvent.AdminMenuFirePropagation)
    async firePropagation(activate: boolean) {
        TriggerServerEvent(ServerEvent.ADMIN_FIRE_PROPAGATION, activate);
    }

    @OnNuiEvent(NuiEvent.AdminMenuStartFire)
    async startFireAtCoords(type: FireType) {
        const duration = await this.inputService.askInput(
            {
                title: "Durée de l'incendie en minutes (vide = jusqu'à extinction)",
            },
            NumberValidator
        );

        if (duration === null) {
            return;
        }

        if (this.previewFirePit) {
            TriggerServerEvent(
                ServerEvent.ADMIN_STAR_NEW_FIRE_PIT,
                this.previewFirePit.position,
                this.previewFirePit.type,
                duration
            );
            return;
        }

        const ped = PlayerPedId();
        const coords = GetEntityCoords(ped, false);
        const [isValid, newZ] = GetGroundZFor_3dCoord(coords[0], coords[1], coords[2], false);

        if (!isValid) {
            this.notifier.error('Impossible de trouver une zone solide');
            return;
        }

        TriggerServerEvent(
            ServerEvent.ADMIN_STAR_NEW_FIRE_PIT,
            [coords[0], coords[1], newZ, GetEntityHeading(ped)],
            type,
            duration
        );
    }

    @OnNuiEvent(NuiEvent.AdminMenuStopFire)
    async stopAllFirePits(instant: boolean) {
        TriggerServerEvent(ServerEvent.ADMIN_FORCE_PIT_EXTINGUISH, instant);

        this.notifier.notify("Tous les feux commencent à s'éteindre");
    }

    @OnNuiEvent(NuiEvent.AdminMenuFireRemoveModelSwap)
    async removeFireModelSwap() {
        const range = await this.inputService.askInput(
            {
                title: 'Portée',
            },
            NumberValidator
        );

        if (range === null) {
            return;
        }

        TriggerServerEvent(ServerEvent.ADMIN_FIRE_REMOVE_MODELSWAP, range);
    }

    private lerp(min: number, max: number, percentage: number): number {
        return min * (1 - percentage) + max * percentage;
    }
}
