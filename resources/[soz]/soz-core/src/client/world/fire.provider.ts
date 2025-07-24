import { Inject } from '@public/core/decorators/injectable';
import { Rpc } from '@public/core/decorators/rpc';
import { Tick } from '@public/core/decorators/tick';
import { Outfit, OutfitType } from '@public/shared/cloth';
import { NuiEvent } from '@public/shared/event/nui';
import { joaat } from '@public/shared/joaat';
import { RpcClientEvent } from '@public/shared/rpc';

import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
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
    offsetSmokeCoords,
} from '../../shared/fire';
import { LsmcCloakroom } from '../../shared/job/lsmc';
import { NumberValidator } from '../../shared/nui/input';
import { PlayerData } from '../../shared/player';
import { applyOffset, getDistance, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { ClothingService } from '../clothing/clothing.service';
import { HudWeatherIconProvider } from '../hud/hud.weathericon.provider';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { ObjectProvider } from '../object/object.provider';
import { PlayerService } from '../player/player.service';
import { PlayerWardrobe } from '../player/player.wardrobe';
import { InteractionProvider } from '../quick-interaction/interaction.provider';
import { ResourceLoader } from '../repository/resource.loader';
import { BlurService } from '../utils/blur.service';
import { NoClipProvider } from '../utils/noclip.provider';

const FireCloakroomPositions: Vector3[] = [
    [1193.911, -1477.941, 34.86],
    [197.596, -1650.367, 29.8],
];

const FireCloakroomPositionsWithProps: Vector4[] = [
    [-632.0661, -93.8063, 37.15667, -10],
    [1688.698, 3591.899, 34.71125, 20],
    [-364.9791, 6125.985, 30.50336, -135],
];

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

    private usedFireExtinguisherRecently = false;

    private readonly gridSize = 25;
    private firePits = new Map<string, FirePitClient>();

    private nearOfPit = false;
    private wearingFireClothes = false;

    private previewFirePit: FirePit | null = null;

    @Once(OnceStep.Start, true)
    async onStart() {
        await this.resourceLoader.loadStreamedTextureDict('soz');
        AddReplaceTexture('core', 'ptfx_fire_v2', 'soz', 'ptfx_fire_v2');

        const pits = await emitRpc(RpcServerEvent.FIRE_GET_ALL_PITS);
        for (const [id, fire] of Object.entries(pits)) {
            await this.spawnFirePit(id, fire);
        }
    }

    @Once(OnceStep.PlayerLoaded, true)
    async onPlayerLoaded(player: PlayerData) {
        for (const position of FireCloakroomPositionsWithProps) {
            const index = FireCloakroomPositionsWithProps.indexOf(position);
            await this.objectProvider.createObject({
                id: 'fire_locker_' + index,
                model: joaat('p_cs_locker_01_s'),
                position: position,
            });
        }

        [
            ...FireCloakroomPositions,
            ...FireCloakroomPositionsWithProps.map(
                position => [position[0], position[1], position[2] + 0.7, position[3]] as Vector4
            ),
        ].forEach(position => {
            this.interactionProvider.createInteractionForCoords(
                position,
                {
                    label: "S'équiper de la tenue d'incendie",
                    canInteract: this.isClothType.bind(this, ''),
                    action: async () => {
                        const outfit: Outfit = {
                            type: 'FIRE',
                            ...LsmcCloakroom[player.skin.Model.Hash]['Tenue incendie'],
                        };

                        const { completed } = await this.playerWardrobe.waitProgress(false);
                        if (completed) {
                            TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, outfit);
                        }
                    },
                },
                2,
                5
            );
            this.interactionProvider.createInteractionForCoords(
                position,
                {
                    label: "Retirer la tenue d'incendie",
                    canInteract: this.isClothType.bind(this, 'FIRE'),
                    action: async () => {
                        const { completed } = await this.playerWardrobe.waitProgress(false);
                        if (completed) {
                            TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, null);
                        }
                    },
                },
                2,
                5
            );
        });
    }

    private isClothType(type: OutfitType): boolean {
        const player = this.playerService.getPlayer();
        if (!player) {
            return false;
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
        await this.resourceLoader.loadPtfxAsset('soz_fire');
        await this.resourceLoader.loadPtfxAsset('des_vaultdoor');

        const smokeCoords = applyOffset(fire.position, offsetSmokeCoords[fire.type]);
        const flameCoords = applyOffset(fire.position, offsetFlameCoords[fire.type]);

        const firePtfxs: number[] = [];
        for (const offset of fireScriptOffsets[fire.type]) {
            const firePosition = applyOffset(fire.position, offset);

            const [valid, z] = await this.getZData(firePosition);
            if (valid) {
                firePosition[2] = z;
            }

            const fireHandle = StartScriptFire(firePosition[0], firePosition[1], firePosition[2], 25, false);
            firePtfxs.push(fireHandle);
        }

        const prevScale = fire.type >= 1 ? fireScale[fire.type - 1] : 0;
        const currentScale = fireScale[fire.type];
        const ptfxScale = this.lerp(
            prevScale,
            currentScale,
            fire.health ? fire.health / firePitDefaultHealth[fire.type] : 1
        );

        SetPtfxAssetNextCall('des_vaultdoor');
        const smokePtfx = StartParticleFxLoopedAtCoord(
            'ent_ray_pro1_residual_smoke',
            smokeCoords[0],
            smokeCoords[1],
            smokeCoords[2],
            0.0,
            0.0,
            smokeCoords[3],
            ptfxScale,
            false,
            false,
            false,
            false
        );

        SetPtfxAssetNextCall('soz_fire');
        const flamePtfx = StartParticleFxLoopedAtCoord(
            'ent_ray_shipwreck_smoke_plume',
            flameCoords[0],
            flameCoords[1],
            flameCoords[2],
            0.0,
            0.0,
            flameCoords[3],
            ptfxScale,
            false,
            false,
            false,
            false
        );

        this.firePits.set(id, {
            ...fire,
            smokePtfx,
            flamePtfx,
            firePtfxs,
        });
    }

    @OnEvent(ClientEvent.FIRE_PIT_UPDATE)
    async updateFirePit(id: string, fire: FirePit) {
        await this.despawnFirePit(id);
        await this.spawnFirePit(id, fire);
    }

    @OnEvent(ClientEvent.FIRE_PIT_DESPAWN)
    async despawnFirePit(id: string) {
        const pit = this.firePits.get(id);
        if (!pit) return;

        StopParticleFxLooped(pit.smokePtfx, false);
        StopParticleFxLooped(pit.flamePtfx, false);

        for (const firePtfx of pit.firePtfxs) {
            RemoveScriptFire(firePtfx);
        }

        this.firePits.delete(id);
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
    async fireCheckTick() {
        for (const [id, fire] of this.firePits.entries()) {
            const fireNearPit = GetNumberOfFiresInRange(fire.position[0], fire.position[1], fire.position[2], 5);

            if (fireNearPit < 5) {
                for (const firePtfx of fire.firePtfxs) {
                    RemoveScriptFire(firePtfx);
                }

                const firePtfxs: number[] = [];
                for (const offset of fireScriptOffsets[fire.type]) {
                    const firePosition = applyOffset(fire.position, offset);

                    const [valid, z] = await this.getZData(firePosition);
                    if (valid) {
                        firePosition[2] = z;
                    }

                    const fireHandle = StartScriptFire(firePosition[0], firePosition[1], firePosition[2], 25, false);
                    firePtfxs.push(fireHandle);
                }

                this.firePits.set(id, { ...fire, firePtfxs });

                AddShockingEventAtPosition(24, fire.position[0], fire.position[1], fire.position[2], 10_000);
            }

            if (fireNearPit === 0 && this.usedFireExtinguisherRecently) {
                emitRpc(RpcServerEvent.FIRE_EXTINGUISHED, id);
                await wait(2_000);
            }
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    async onWeaponTick() {
        const player = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(player, false);
        const model = GetEntityModel(vehicle);

        this.usedFireExtinguisherRecently = false;

        if (model === joaat('firetruk')) {
            this.usedFireExtinguisherRecently = true;
            await wait(2_000);
            return;
        }

        const weaponGroup = GetWeapontypeGroup(GetSelectedPedWeapon(player));
        if (weaponGroup !== joaat('GROUP_FIREEXTINGUISHER')) {
            return;
        }

        if (!IsPedShooting(player)) {
            return;
        }

        this.usedFireExtinguisherRecently = true;
        await wait(2_000);
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

    @Tick(TickInterval.EVERY_SECOND * 5)
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
    async stopAllFirePits() {
        TriggerServerEvent(ServerEvent.ADMIN_FORCE_PIT_EXTINGUISH);

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
