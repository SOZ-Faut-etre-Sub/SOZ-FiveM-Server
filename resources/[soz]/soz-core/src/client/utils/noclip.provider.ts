import { AdminSpectateProvider } from '@public/client/admin/admin.spectate.provider';
import { CHANGE_SPEED_KEY } from '@public/config/admin';
import { Command } from '@public/core/decorators/command';
import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { AdminPlayer } from '@public/shared/admin/admin';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { Control } from '@public/shared/input';
import { PlayerData } from '@public/shared/player';
import { add2Vector3, multVector3, Vector3 } from '@public/shared/polyzone/vector';

import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { VoipService } from '../voip/voip.service';
import { WeaponDrawingProvider } from '../weapon/weapon.drawing.provider';

const MOVE_UP_KEY = 20;
const MOVE_DOWN_KEY = 44;
const NO_CLIP_NORMAL_SPEED = 0.5;
const eps = 0.01;
const breakSpeed = 10.0;

@Provider()
export class NoClipProvider {
    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(VoipService)
    public voipService: VoipService;

    @Inject(WeaponDrawingProvider)
    public weaponDrawingProvider: WeaponDrawingProvider;

    @Inject(Notifier)
    public notifier: Notifier;

    @Inject(AdminSpectateProvider)
    public adminSpectateProvider: AdminSpectateProvider;

    private input = [0, 0, 0];
    private previousVelocity: Vector3 = [0, 0, 0];
    private isNoClipping = false;
    private isClippedVeh = false;
    private noClippingEntity = 0;
    private speed = NO_CLIP_NORMAL_SPEED;
    private bonusSpeed = 0;

    @Once(OnceStep.PlayerLoaded)
    public init(player: PlayerData) {
        this.SetNoClip(!!player.metadata.noclip);
    }

    private IsControlAlwaysPressed(inputGroup: number, control: Control) {
        return IsControlPressed(inputGroup, control) || IsDisabledControlPressed(inputGroup, control);
    }

    private Lerp(a: Vector3, b: Vector3, t: number): Vector3 {
        return add2Vector3(multVector3(add2Vector3(b, multVector3(a, -1)), t), a);
    }

    private IsPedDrivingVehicle(ped: number, veh: number) {
        return ped == GetPedInVehicleSeat(veh, -1);
    }

    private SetInvincible(val: boolean, id: number) {
        SetEntityInvincible(id, val);
        return SetPlayerInvincible(id, val);
    }

    private MoveInNoClip() {
        const camRot = GetGameplayCamRot(0);
        SetEntityRotation(this.noClippingEntity, camRot[0], camRot[1], camRot[2], 0, false);
        const [forward, right, up, c] = GetEntityMatrix(this.noClippingEntity);
        this.previousVelocity = this.Lerp(
            this.previousVelocity,
            add2Vector3(
                add2Vector3(
                    multVector3(right as Vector3, this.speed * this.input[0]),
                    multVector3(up as Vector3, this.speed * -this.input[2])
                ),
                multVector3(forward as Vector3, this.speed * -this.input[1])
            ),
            Timestep() * breakSpeed
        );

        SetEntityCoordsNoOffset(
            this.noClippingEntity,
            c[0] + this.previousVelocity[0],
            c[1] + this.previousVelocity[1],
            c[2] + this.previousVelocity[2],
            true,
            true,
            false
        );
    }

    private async SetNoClip(val: boolean) {
        if (this.isNoClipping == val) {
            return;
        }
        TriggerServerEvent(ServerEvent.QBCORE_SET_METADATA, 'noclip', val);
        const playerPed = PlayerPedId();
        const playerId = PlayerId();
        this.noClippingEntity = playerPed;
        if (IsPedInAnyVehicle(playerPed, false)) {
            const veh = GetVehiclePedIsIn(playerPed, false);
            if (this.IsPedDrivingVehicle(playerPed, veh)) {
                this.noClippingEntity = veh;
            }
        }
        this.isClippedVeh = IsEntityAVehicle(this.noClippingEntity);
        SetUserRadioControlEnabled(!val);
        SetRelationshipToPlayer(playerId, !val);

        if (this.isNoClipping) {
            PlaySoundFromEntity(-1, 'CANCEL', playerPed, 'HUD_LIQUOR_STORE_SOUNDSET', false, 0);
            this.weaponDrawingProvider.drawAdminWeapons();
            ResetEntityAlpha(this.noClippingEntity);
            this.isNoClipping = val;

            FreezeEntityPosition(this.noClippingEntity, false);
            SetEntityCollision(this.noClippingEntity, true, true);
            SetEntityVisible(this.noClippingEntity, true, false);
            SetLocalPlayerVisibleLocally(true);
            SetEveryoneIgnorePlayer(playerId, false);
            SetPoliceIgnorePlayer(playerPed, false);
            this.voipService.mutePlayer(false);
            await wait(5000);
            if (this.isClippedVeh) {
                while (!IsVehicleOnAllWheels(this.noClippingEntity) && !this.isNoClipping) {
                    await wait(0);
                }
                while (!this.isNoClipping) {
                    await wait(0);
                    if (IsVehicleOnAllWheels(this.noClippingEntity)) {
                        return this.SetInvincible(false, this.noClippingEntity);
                    }
                }
            } else {
                if (
                    IsPedFalling(this.noClippingEntity) &&
                    Math.abs(1 - GetEntityHeightAboveGround(this.noClippingEntity)) > eps
                ) {
                    while (
                        IsPedStopped(this.noClippingEntity) ||
                        (!IsPedFalling(this.noClippingEntity) && !this.isNoClipping)
                    ) {
                        await wait(0);
                    }
                }
                while (!this.isNoClipping) {
                    await wait(0);
                    if (!IsPedFalling(this.noClippingEntity) && !IsPedRagdoll(this.noClippingEntity)) {
                        return this.SetInvincible(false, this.noClippingEntity);
                    }
                }
            }
        } else {
            PlaySoundFromEntity(-1, 'SELECT', playerPed, 'HUD_LIQUOR_STORE_SOUNDSET', false, 0);

            this.weaponDrawingProvider.undrawAdminWeapons();
            SetEntityAlpha(this.noClippingEntity, 51, false);
            this.voipService.mutePlayer(true);

            this.SetInvincible(true, this.noClippingEntity);
            if (!this.isClippedVeh) {
                ClearPedTasksImmediately(playerPed);
            } else {
                this.notifier.notify(
                    "Le noclip en véhicule fait depop les PNJ d'ambiance en cas de collision",
                    'warning'
                );
            }
            this.isNoClipping = val;
        }
    }

    public async ToggleNoClipMode() {
        if (!this.adminSpectateProvider.isNotSpectating()) {
            this.notifier.notify('Le mode spectateur doit être stoppé pour désactiver le mode NoClip.', 'warning');
            return;
        }
        return await this.SetNoClip(!this.isNoClipping);
    }

    public IsNoClipMode() {
        return this.isNoClipping;
    }

    @Tick()
    private noClipTick() {
        if (!this.isNoClipping) {
            return;
        }

        const playerId = PlayerId();
        FreezeEntityPosition(this.noClippingEntity, true);
        SetEntityCollision(this.noClippingEntity, false, false);
        SetEntityVisible(this.noClippingEntity, false, false);
        if (this.adminSpectateProvider.isNotSpectating()) {
            SetLocalPlayerVisibleLocally(true);
        } else {
            SetLocalPlayerInvisibleLocally(true);
        }
        SetEntityAlpha(this.noClippingEntity, 51, false);
        SetEveryoneIgnorePlayer(playerId, true);
        SetPoliceIgnorePlayer(playerId, true);
        this.input = [
            GetControlNormal(0, Control.MoveLeftRight),
            GetControlNormal(0, Control.MoveUpDown),
            this.IsControlAlwaysPressed(1, MOVE_UP_KEY) ? 1 : this.IsControlAlwaysPressed(1, MOVE_DOWN_KEY) ? -1 : 0,
        ];
        this.speed = NO_CLIP_NORMAL_SPEED;
        this.speed += this.bonusSpeed;
        if (this.IsControlAlwaysPressed(1, CHANGE_SPEED_KEY)) {
            this.speed *= 5;
        }
        if (this.isClippedVeh) {
            this.speed *= 2.75;
        }
        this.MoveInNoClip();
    }

    @Once(OnceStep.Stop)
    private onStop() {
        this.SetNoClip(false);
        const playerId = PlayerId();
        FreezeEntityPosition(this.noClippingEntity, false);
        SetEntityCollision(this.noClippingEntity, true, true);
        SetEntityVisible(this.noClippingEntity, true, false);
        SetLocalPlayerVisibleLocally(true);
        ResetEntityAlpha(this.noClippingEntity);
        SetEveryoneIgnorePlayer(playerId, false);
        SetPoliceIgnorePlayer(this.noClippingEntity, false);
        ResetEntityAlpha(this.noClippingEntity);
        this.SetInvincible(false, this.noClippingEntity);
    }

    @Command('noclip', {
        description: 'Noclip Activer/Désactiver',
        keys: [
            {
                mapper: 'keyboard',
                key: '',
            },
        ],
    })
    public commandNoClip() {
        const player = this.playerService.getPlayer();
        if (!['admin', 'staff', 'gamemaster', 'helper'].includes(player.role)) {
            return;
        }

        this.ToggleNoClipMode();
    }

    @Command('noclipincreasespeed', {
        description: 'Noclip Accélère la vitesse',
        keys: [
            {
                mapper: 'keyboard',
                key: '',
            },
        ],
    })
    public commandNoClipSpeedUp() {
        const player = this.playerService.getPlayer();
        if (!['admin', 'staff', 'gamemaster', 'helper'].includes(player.role)) {
            return;
        }

        this.updateSpeed(0.1);
    }

    @Command('noclipdecreasespeed', {
        description: 'Noclip Diminue la vitesse',
        keys: [
            {
                mapper: 'keyboard',
                key: '',
            },
        ],
    })
    public commandNoClipSpeedDown() {
        this.updateSpeed(-0.1);
    }

    private updateSpeed(delta: number) {
        const player = this.playerService.getPlayer();
        if (!['admin', 'staff', 'gamemaster', 'helper'].includes(player.role)) {
            return;
        }

        this.bonusSpeed = Math.max(-1 * NO_CLIP_NORMAL_SPEED, this.bonusSpeed + delta);
        this.notifier.notify('Vitesse ' + (NO_CLIP_NORMAL_SPEED + this.bonusSpeed).toFixed(1));
    }

    @OnEvent(ClientEvent.ADMIN_SPECTATE_PLAYER)
    public async onSpectatePlayer(player: AdminPlayer, position: Vector3): Promise<void> {
        if (!this.IsNoClipMode()) {
            this.notifier.notify(`Le mode NoClip doit être activé pour observer un joueur.`, 'info');
            return;
        }

        await this.adminSpectateProvider.spectatePlayer(player, position);
    }
}
