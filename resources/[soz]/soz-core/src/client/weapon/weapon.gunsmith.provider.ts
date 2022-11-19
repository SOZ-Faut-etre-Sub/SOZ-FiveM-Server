import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { Err, Ok } from '../../shared/result';
import { WeaponComponentType } from '../../shared/weapons/attachment';
import { WeaponTintColorChoices } from '../../shared/weapons/tint';
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

    @OnEvent(ClientEvent.WEAPON_OPEN_GUNSMITH)
    async openGunsmith() {
        const weapons = Object.values(this.playerService.getPlayer().items).filter(item => item.type === 'weapon');

        this.nuiMenu.openMenu(MenuType.GunSmith, {
            weapons: weapons,
            tints: weapons.map(weapon => {
                return {
                    slot: weapon.slot,
                    tints: weapon.name.includes('mk2') ? WeaponTintColorChoices : WeaponTintColorChoices,
                };
            }),
            attachments: weapons.map(weapon => {
                return {
                    slot: weapon.slot,
                    attachments: this.weaponService.getWeaponConfig(weapon.name).attachments,
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

    @OnNuiEvent(NuiEvent.GunSmithRenameWeapon)
    async renameWeapon({ slot }: { slot: number }) {
        const weapon = this.weaponService.getWeaponFromSlot(slot);
        if (!weapon) {
            return;
        }

        const weaponLabel = await this.inputService.askInput(
            {
                title: `Nom de l'arme`,
                maxCharacters: 30,
                defaultValue: weapon.metadata.label ?? weapon.label,
            },
            value => {
                if (value.length < 2) {
                    return Err('Le nom doit faire au moins 2 caractères');
                }
                return Ok(true);
            }
        );

        TriggerServerEvent(ServerEvent.WEAPON_GUNSMITH_RENAME, weapon.slot, weaponLabel);
    }

    // Tint
    @OnNuiEvent(NuiEvent.GunSmithPreviewTint)
    async previewTint({ slot, tint }: { slot: number; tint: number }) {
        const weapon = this.weaponService.getWeaponFromSlot(slot);
        if (!weapon) {
            return;
        }

        await this.weaponService.clear();
        await this.weaponService.set(weapon);

        const player = PlayerPedId();
        const weaponHash = GetSelectedPedWeapon(player);

        SetPedWeaponTintIndex(player, weaponHash, Number(tint));
    }

    @OnNuiEvent(NuiEvent.GunSmithApplyTint)
    async applyTint({ slot, tint }: { slot: number; tint: number }) {
        const weapon = this.weaponService.getWeaponFromSlot(slot);
        if (!weapon) {
            return;
        }

        TriggerServerEvent(ServerEvent.WEAPON_GUNSMITH_APPLY_TINT, weapon.slot, tint);

        await this.weaponService.clear();
        await this.weaponService.set(weapon);
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

    @OnNuiEvent(NuiEvent.GunSmithApplyAttachment)
    async applyAttachment({
        slot,
        attachmentType,
        attachment,
    }: {
        slot: number;
        attachmentType: WeaponComponentType;
        attachment: string;
    }) {
        const weapon = this.weaponService.getWeaponFromSlot(slot);
        if (!weapon) {
            return;
        }

        TriggerServerEvent(ServerEvent.WEAPON_GUNSMITH_APPLY_ATTACHMENT, weapon.slot, attachmentType, attachment);

        await this.weaponService.clear();
        await this.weaponService.set(weapon);
    }
}
