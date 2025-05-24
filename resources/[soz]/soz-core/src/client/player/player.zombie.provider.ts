import { BlipFactory } from '@public/client/blip';
import { ObjectProvider } from '@public/client/object/object.provider';
import { PhoneService } from '@public/client/phone/phone.service';
import { WeaponService } from '@public/client/weapon/weapon.service';
import { Blip } from '@public/shared/blip';
import { Control } from '@public/shared/input';
import { BIN_MODELS } from '@public/shared/job/garbage';
import { Vector3 } from '@public/shared/polyzone/vector';
import { WeaponName } from '@public/shared/weapons/weapon';
import PCancelable from 'p-cancelable';

import { Once, OnceStep, OnEvent, OnGameEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { ClientEvent, GameEvent, ServerEvent } from '../../shared/event';
import { RpcServerEvent } from '../../shared/rpc';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
import { SkinService } from '../skin/skin.service';
import { TargetFactory } from '../target/target.factory';
import { BlurService } from '../utils/blur.service';
import { PlayerWalkstyleProvider } from './player.walkstyle.provider';

const ZOMBIE_SCREEN_EFFECT = 'SwitchOpenTrevorIn';
const ZOMBIE_TRANSFORM_EFFECT = 'MinigameEndTrevor';

@Provider()
export class PlayerZombieProvider {
    @Inject(PlayerWalkstyleProvider)
    private readonly playerWalkstyleProvider: PlayerWalkstyleProvider;

    @Inject(TargetFactory)
    private readonly targetFactory: TargetFactory;

    @Inject(SkinService)
    private readonly skinService: SkinService;

    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    @Inject(BlurService)
    private readonly blurService: BlurService;

    @Inject(PhoneService)
    private readonly phoneService: PhoneService;

    @Inject(ObjectProvider)
    private readonly objectProvider: ObjectProvider;

    @Inject(BlipFactory)
    private readonly blipFactory: BlipFactory;

    @Inject(WeaponService)
    private weaponService: WeaponService;

    private _isZombie = false;

    private transform: PCancelable<void> | null = null;

    private zombiePositions: Record<number, Vector3> = null;

    public isZombie(): boolean {
        return this._isZombie;
    }

    public isTransforming(): boolean {
        return this.transform !== null;
    }

    @Tick(TickInterval.EVERY_MINUTE)
    async checkZombieTransformingFxLoop(): Promise<void> {
        if (!this.isTransforming()) {
            return;
        }

        AnimpostfxPlay(ZOMBIE_TRANSFORM_EFFECT, 2000, false);
    }

    @Tick(TickInterval.EVERY_FRAME)
    async checkZombieFxLoop(): Promise<void> {
        if (!this.isZombie()) {
            return;
        }

        DisableControlAction(0, Control.VehicleAccelerate, true);
        DisableControlAction(0, Control.VehicleBrake, true);
        DisableControlAction(0, Control.VehicleMoveLeftRight, true);
        DisableControlAction(0, Control.VehicleMoveLeftOnly, true);
        DisableControlAction(0, Control.VehicleMoveRightOnly, true);

        if (AnimpostfxIsRunning(ZOMBIE_SCREEN_EFFECT)) {
            return;
        }

        AnimpostfxPlay(ZOMBIE_SCREEN_EFFECT, 0, true);
    }

    public async handleOnDeath() {
        this.notifier.error('La mort nous rend plus fort...');

        // If player is transforming, cancel it and make it reborn as a zombie
        if (this.isTransforming()) {
            await wait(5_000);
            this.transform.cancel();

            const ped = PlayerPedId();
            const pos = GetEntityCoords(ped);
            const heading = GetEntityHeading(ped);
            NetworkResurrectLocalPlayer(pos[0], pos[1], pos[2], heading, 1, false);

            await wait(2_000);
            await this.zombieTransform();

            return;
        }

        // If player is already a zombie, wait 20 seconds and make it reborn as a zombie
        if (this.isZombie()) {
            await wait(20_000);
            const ped = PlayerPedId();

            const pos = GetEntityCoords(ped);
            const heading = GetEntityHeading(ped);
            NetworkResurrectLocalPlayer(pos[0], pos[1], pos[2], heading, 1, false);
            SetEntityHealth(ped, 200);
            SetPedArmour(ped, 100);
            return;
        }
    }

    @Once(OnceStep.RepositoriesLoaded)
    async onPlayerZombieStart(): Promise<void> {
        // add btarget
        this.targetFactory.createForAllPlayer([
            {
                label: 'Dezombifier',
                item: 'halloween_zombie_serum',
                icon: 'ems/take_blood',
                category: 'citizen',
                canInteract: entity => {
                    if (this._isZombie) {
                        return false;
                    }

                    return IsPedAPlayer(entity);
                },
                action: entity => {
                    const playerId = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    TriggerServerEvent(ServerEvent.PLAYER_ZOMBIE_REMOVE, playerId);
                },
            },
        ]);

        this._isZombie = await emitRpc<boolean>(RpcServerEvent.PLAYER_IS_ZOMBIE);

        if (this._isZombie) {
            await this.zombieTransform();
        }
    }

    @OnEvent(ClientEvent.PLAYER_ZOMBIE_TRANSFORM)
    async onZombieTransform(): Promise<void> {
        this.transform = new PCancelable(async (resolve, reject, onCancel) => {
            let isCanceled = false;

            onCancel.shouldReject = false;
            onCancel(() => {
                isCanceled = true;
                resolve();
            });

            this.nuiDispatch.dispatch('zombie', 'zombie', true);

            await wait(1000 * 60);

            if (isCanceled) {
                return;
            }

            await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', 'move_m@drunk@slightlydrunk');

            await wait(1000 * 60);

            if (isCanceled) {
                return;
            }

            await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', 'move_m@drunk@moderatedrunk');

            await wait(1000 * 60);

            if (isCanceled) {
                return;
            }

            await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', 'move_m@drunk@verydrunk');

            await wait(1000 * 60);

            if (isCanceled) {
                return;
            }

            await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', null);
            await wait(5000);

            if (isCanceled) {
                return;
            }

            SetPedToRagdoll(PlayerPedId(), 1000, 1000, 0, false, false, false);
            await wait(2000);

            if (isCanceled) {
                return;
            }

            this.blurService.remove(null, 1000);

            await this.zombieTransform();

            resolve();
        });

        await this.transform;
        await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', null);

        this.transform = null;
    }

    @OnEvent(ClientEvent.PLAYER_ZOMBIE_REMOVE)
    async onZombieRemove(): Promise<void> {
        this._isZombie = false;
        this.nuiDispatch.dispatch('zombie', 'zombie', false);

        if (this.transform !== null) {
            this.transform.cancel();
        }

        this.phoneService.setPhoneDisabled('zombie', false);
        this.weaponService.setDisabled('zombie', false);
        SetWeaponDamageModifier(WeaponName.UNARMED, 0.5);

        await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', null);
        AnimpostfxStop(ZOMBIE_SCREEN_EFFECT);

        // Reset ped and clothes
        TriggerEvent('soz-character:Client:ApplyCurrentSkin');
        TriggerEvent('soz-character:Client:ApplyCurrentClothConfig');

        // Remove zombie blips
        const bins = this.objectProvider.getObjects(object => BIN_MODELS.includes(object.model));

        for (const bin of bins) {
            this.blipFactory.remove(`zombie_tp_${bin.id}`);
        }
    }

    @OnEvent(ClientEvent.PLAYER_ZOMBIE_SET_POSITIONS)
    async onZombieSetPositions(positions: Record<number, Vector3>): Promise<void> {
        if (this._isZombie) {
            this.zombiePositions = positions;
        } else {
            this.zombiePositions = null;
        }
    }

    @Tick(1000)
    public async checkZombieBlips(): Promise<void> {
        const currentBlips = this.blipFactory.getBlipsByGroup('zombie');

        if (!this._isZombie) {
            if (currentBlips.length > 0) {
                for (const blip of currentBlips) {
                    this.blipFactory.remove(blip.id);
                }
            }

            this.zombiePositions = null;

            return;
        }

        if (!this.zombiePositions) {
            return;
        }

        const blips = {};
        const toAdd = [];
        const toDelete = [];
        const toUpdate = [];

        for (const [id, position] of Object.entries(this.zombiePositions)) {
            if (!currentBlips.find(blip => blip.id === `zombie_position_${id}`)) {
                toAdd.push({ id, position });
            } else {
                blips[`zombie_position_${id}`] = position;
            }
        }

        for (const blip of currentBlips) {
            if (blips[blip.id]) {
                toUpdate.push({ id: blip.id, position: blips[blip.id] });
            }

            if (!blips[blip.id]) {
                toDelete.push(blip.id);
            }
        }

        for (const blip of toAdd) {
            this.blipFactory.create(`zombie_position_${blip.id}`, {
                name: 'Zombie',
                coords: blip.position,
                sprite: 1,
                group: 'zombie',
                color: 47,
            });
        }

        for (const blip of toUpdate) {
            this.blipFactory.update(blip.id, {
                position: blip.position,
            });
        }

        for (const blip of toDelete) {
            this.blipFactory.remove(blip);
        }
    }

    private async zombieTransform() {
        this._isZombie = true;
        this.nuiDispatch.dispatch('zombie', 'zombie', true);
        await this.skinService.setModel('u_m_y_zombie_01');

        TriggerServerEvent(ServerEvent.TALENT_TREE_DISABLE_CRIMI);
        this.phoneService.setPhoneDisabled('zombie', true);
        this.weaponService.setDisabled('zombie', true);

        this.notifier.notify(
            'Tu es désormais un ~r~zombie~s~ ! Ton seul et unique bût est de contaminer la terre entière. Agis et comporte toi comme tel !',
            'info'
        );

        SetWeaponDamageModifier(WeaponName.UNARMED, 1.0);
        SetPedArmour(PlayerPedId(), 100);
        AnimpostfxPlay(ZOMBIE_SCREEN_EFFECT, 0, true);

        const bins = this.objectProvider.getObjects(object => BIN_MODELS.includes(object.model));

        for (const bin of bins) {
            this.blipFactory.create(
                `zombie_tp_${bin.id}`,
                {
                    name: 'Cercueil de zombie',
                    coords: {
                        x: bin.position[0],
                        y: bin.position[1],
                        z: bin.position[2],
                    },
                    sprite: 885,
                },
                [
                    {
                        label: 'Téléporter',
                        action: async (blip: Blip, data: string) => {
                            SetFrontendActive(false);
                            TriggerServerEvent(ServerEvent.PLAYER_ZOMBIE_TP, data);
                        },
                        data: bin.id,
                    },
                ]
            );
        }
    }

    @OnGameEvent(GameEvent.CEventNetworkEntityDamage)
    async onPedDamage(
        victim: number,
        attacker: number,
        _unkInt1: number,
        _unkBool1: number,
        _unkBool2: number,
        _isFatal: boolean,
        weaponHash: number
    ): Promise<void> {
        const playerPed = PlayerPedId();

        if (playerPed !== attacker) {
            return;
        }

        if (!this._isZombie) {
            return;
        }

        // If weapon is hand
        const hash = GetHashKey('WEAPON_UNARMED');

        if (weaponHash !== hash) {
            return;
        }

        // is victim a player ped
        if (!IsPedAPlayer(victim)) {
            return;
        }

        // Get victim player id
        const victimId = GetPlayerServerId(NetworkGetPlayerIndexFromPed(victim));

        TriggerServerEvent(ServerEvent.PLAYER_ZOMBIE_CONVERT, victimId);
    }
}
