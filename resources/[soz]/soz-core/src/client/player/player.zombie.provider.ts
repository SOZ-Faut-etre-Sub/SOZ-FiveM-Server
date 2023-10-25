import PCancelable from 'p-cancelable';

import { Once, OnceStep, OnEvent, OnGameEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { ClientEvent, GameEvent, ServerEvent } from '../../shared/event';
import { RpcServerEvent } from '../../shared/rpc';
import { NuiDispatch } from '../nui/nui.dispatch';
import { SkinService } from '../skin/skin.service';
import { TargetFactory } from '../target/target.factory';
import { PlayerWalkstyleProvider } from './player.walkstyle.provider';

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

    private isZombie = false;

    private transform: PCancelable<void> | null = null;

    @Once(OnceStep.PlayerLoaded)
    async onPlayerZombieStart(): Promise<void> {
        // add btarget
        this.targetFactory.createForAllPlayer([
            {
                label: 'Dezombifier',
                item: 'halloween_zombie_serum',
                canInteract: entity => {
                    if (this.isZombie) {
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

        this.isZombie = await emitRpc<boolean>(RpcServerEvent.PLAYER_IS_ZOMBIE);

        if (this.isZombie) {
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

            TriggerScreenblurFadeIn(8 * 60 * 1000);
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
        this.transform = null;
    }

    @OnEvent(ClientEvent.PLAYER_ZOMBIE_REMOVE)
    async onZombieRemove(): Promise<void> {
        this.isZombie = false;
        this.nuiDispatch.dispatch('zombie', 'zombie', false);

        if (this.transform !== null) {
            this.transform.cancel();
        }

        if (IsScreenblurFadeRunning()) {
            DisableScreenblurFade();
        } else {
            TriggerScreenblurFadeOut(1000);
        }

        await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', null);
        AnimpostfxStop('DrugsTrevorClownsFight');

        // Reset ped and clothes
        TriggerEvent('soz-character:Client:ApplyCurrentSkin');
        TriggerEvent('soz-character:Client:ApplyCurrentClothConfig');
    }

    private async zombieTransform() {
        this.isZombie = true;
        this.nuiDispatch.dispatch('zombie', 'zombie', true);
        await this.skinService.setModel('u_m_y_zombie_01');

        AnimpostfxPlay('DrugsTrevorClownsFight', 0, true);
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

        if (!this.isZombie) {
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
