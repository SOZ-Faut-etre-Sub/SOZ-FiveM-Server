import { PhoneService } from '@public/client/phone/phone.service';
import { Control } from '@public/shared/input';
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

    @Inject(PhoneService)
    private readonly phoneService: PhoneService;

    private _isZombie = false;

    private transform: PCancelable<void> | null = null;

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

            await wait(2_000);
            await this.zombieTransform();

            return;
        }

        // If player is already a zombie, wait 30 seconds and make it reborn as a zombie
        if (this.isZombie()) {
            await wait(30_000);
            const ped = PlayerPedId();

            const pos = GetEntityCoords(ped);
            const heading = GetEntityHeading(ped);
            NetworkResurrectLocalPlayer(pos[0], pos[1], pos[2], heading, true, false);
            SetEntityHealth(ped, 200);

            return;
        }
    }

    @Once(OnceStep.PlayerLoaded)
    async onPlayerZombieStart(): Promise<void> {
        // add btarget
        this.targetFactory.createForAllPlayer([
            {
                label: 'Dezombifier',
                item: 'halloween_zombie_serum',
                icon: 'c:ems/take_blood.png',
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

            await wait(1000 * 60 * 3);

            if (isCanceled) {
                return;
            }

            await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', 'move_m@drunk@slightlydrunk');

            await wait(1000 * 60 * 3);

            if (isCanceled) {
                return;
            }

            await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', 'move_m@drunk@moderatedrunk');

            await wait(1000 * 60 * 2);

            if (isCanceled) {
                return;
            }

            await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', 'move_m@drunk@verydrunk');

            await wait(1000 * 60 * 2);

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

            if (IsScreenblurFadeRunning()) {
                DisableScreenblurFade();
            }

            TriggerScreenblurFadeOut(1000);

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

        await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', null);
        AnimpostfxStop(ZOMBIE_SCREEN_EFFECT);

        // Reset ped and clothes
        TriggerEvent('soz-character:Client:ApplyCurrentSkin');
        TriggerEvent('soz-character:Client:ApplyCurrentClothConfig');
    }

    private async zombieTransform() {
        this._isZombie = true;
        this.nuiDispatch.dispatch('zombie', 'zombie', true);
        await this.skinService.setModel('u_m_y_zombie_01');

        TriggerServerEvent(ServerEvent.TALENT_TREE_DISABLE_CRIMI);
        this.phoneService.setPhoneDisabled('zombie', true);

        this.notifier.notify(
            'Tu es désormais un ~r~zombie~s~ ! Ton seul et unique bût est de contaminer la terre entière. Agis et comporte toi comme tel !',
            'info'
        );

        AnimpostfxPlay(ZOMBIE_SCREEN_EFFECT, 0, true);
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
