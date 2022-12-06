import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { ClientEvent, NuiEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { Err, Ok } from '../../shared/result';
import { RpcEvent } from '../../shared/rpc';
import { WeaponMk2TintColorChoices, WeaponTintColorChoices } from '../../shared/weapons/tint';
import { WeaponConfiguration } from '../../shared/weapons/weapon';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { WeaponService } from './weapon.service';

@Provider()
export class WeaponGunsmithProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(WeaponService)
    private weaponService: WeaponService;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ClientEvent.WEAPON_OPEN_GUNSMITH)
    async openGunsmith() {
        const weapons = Object.values(this.playerService.getPlayer().items).filter(item => item.type === 'weapon');

        this.nuiMenu.openMenu(MenuType.GunSmith, {
            weapons: weapons,
            tints: weapons.map(weapon => {
                return {
                    slot: weapon.slot,
                    tints: weapon.name.includes('mk2') ? WeaponMk2TintColorChoices : WeaponTintColorChoices,
                };
            }),
            attachments: weapons.map(weapon => {
                return {
                    slot: weapon.slot,
                    attachments: this.weaponService.getWeaponConfig(weapon.name)?.attachments ?? [],
                };
            }),
        });
    }

    @OnNuiEvent<{ menuType: MenuType }>(NuiEvent.MenuClosed)
    public async resetSkin({ menuType }) {
        if (menuType !== MenuType.GunSmith) {
            return;
        }

        await this.weaponService.clear();

        const weapon = this.weaponService.getCurrentWeapon();
        if (weapon) {
            await this.weaponService.set(weapon);
        }
    }

    // Tint
    @OnNuiEvent(NuiEvent.GunSmithPreviewTint)
    async previewTint({ slot, tint }: { slot: number; tint: number }) {
        const weapon = this.weaponService.getWeaponFromSlot(slot);
        if (!weapon) {
            return;
        }

        await this.weaponService.clear();
        await this.weaponService.set({ ...weapon, metadata: { ...weapon.metadata, tint: Number(tint) } });
    }

    // Attachment
    @OnNuiEvent(NuiEvent.GunSmithPreviewAttachment)
    async previewAttachment({ slot, attachment }: { slot: number; attachment: string }) {
        const weapon = this.weaponService.getWeaponFromSlot(slot);
        if (!weapon) {
            return;
        }

        await this.weaponService.clear();
        await this.weaponService.set(weapon);

        const player = PlayerPedId();
        const weaponHash = GetSelectedPedWeapon(player);

        GiveWeaponComponentToPed(player, weaponHash, GetHashKey(attachment));
    }

    @OnNuiEvent(NuiEvent.GunSmithApplyConfiguration)
    async applyConfiguration({ slot, label, repair, tint, attachments }: WeaponConfiguration & { slot: number }) {
        const weapon = this.weaponService.getWeaponFromSlot(slot);
        if (!weapon) {
            return;
        }

        let customValidated = true;

        if (label) {
            const weaponLabel = await this.inputService.askInput(
                {
                    title: `Nom de l'arme`,
                    maxCharacters: 30,
                    defaultValue: weapon.metadata?.label ?? weapon.label,
                },
                value => {
                    if (value.length < 2) {
                        return Err('Le nom doit faire au moins 2 caractères');
                    }
                    return Ok(true);
                }
            );

            const applied = await emitRpc<boolean>(RpcEvent.WEAPON_SET_LABEL, weapon.slot, weaponLabel);
            if (applied) {
                this.notifier.notify(`Vous avez renommé votre arme en ~b~${weaponLabel}`);
            } else {
                customValidated = false;
            }
        }

        if (repair) {
            const applied = await emitRpc<boolean>(RpcEvent.WEAPON_REPAIR, weapon.slot);
            if (applied) {
                this.notifier.notify(`Vous avez réparé votre arme (~b~${weapon.label}~s~)`);
            } else {
                customValidated = false;
            }
        }

        if (tint !== weapon.metadata.tint) {
            const applied = await emitRpc<boolean>(RpcEvent.WEAPON_SET_TINT, weapon.slot, tint);
            if (applied) {
                this.notifier.notify(
                    `Vous avez changé la couleur de votre arme en ~b~${
                        (weapon.name.includes('mk2') ? WeaponMk2TintColorChoices : WeaponTintColorChoices)[tint].label
                    }`
                );
            } else {
                customValidated = false;
            }
        }

        if (attachments) {
            for (const [type, attachment] of Object.entries(attachments)) {
                if (attachment !== weapon.metadata?.attachments?.[type]) {
                    const applied = await emitRpc<boolean>(
                        RpcEvent.WEAPON_SET_ATTACHMENTS,
                        weapon.slot,
                        type,
                        attachment
                    );
                    if (!applied) {
                        customValidated = false;
                    }
                }
            }
        }

        this.nuiMenu.closeMenu();

        if (customValidated) {
            this.notifier.notify('Vos modifications ont été appliquées');
        } else {
            this.notifier.notify(
                "Une ou plusieurs modifications n'ont pas pu être appliquées par manque d'argent.",
                'error'
            );
        }

        await this.weaponService.clear();
    }
}
