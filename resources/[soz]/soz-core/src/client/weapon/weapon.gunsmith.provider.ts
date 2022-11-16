import { Command } from '../../core/decorators/command';
import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { Err, Ok } from '../../shared/result';
import { WeaponMk2TintColor, WeaponTintColor } from '../../shared/weapons/tint';
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

    @Command('gunsmith', { role: 'admin' })
    @OnEvent(ClientEvent.WEAPON_OPEN_GUNSMITH)
    async openGunsmith() {
        this.nuiMenu.openMenu(MenuType.GunSmith, {
            weapons: Object.values(this.playerService.getPlayer().items).filter(item => item.type === 'weapon'),
        });
    }

    @OnNuiEvent(NuiEvent.GunSmithRenameWeapon)
    async renameWeapon({ slot }: { slot: number }) {
        const weapon = Object.values(this.playerService.getPlayer().items).find(
            item => item.type === 'weapon' && item.slot === slot
        );
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

    @OnNuiEvent(NuiEvent.GunSmithPreviewTint)
    async previewTint({ tint }: { tint: number }) {
        const player = PlayerPedId();
        const weapon = GetSelectedPedWeapon(player);

        SetPedWeaponTintIndex(player, weapon, Number(tint));
    }

    @OnNuiEvent(NuiEvent.GunSmithApplyTint)
    async applyTint({ slot, tint }: { slot: number; tint: number }) {
        const weapon = Object.values(this.playerService.getPlayer().items).find(
            item => item.type === 'weapon' && item.slot === slot
        );
        if (!weapon) {
            return;
        }

        TriggerServerEvent(ServerEvent.WEAPON_GUNSMITH_APPLY_TINT, weapon.slot, tint);
        await this.previewTint({ tint });
    }
}
