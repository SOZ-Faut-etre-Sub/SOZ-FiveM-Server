import { PoliceClueDBProvider } from '@private/server/police/police.cluedb.provider';
import { PoliceScientistProvider } from '@private/server/police/police.scientist.provider';
import { uuidv4 } from '@public/core/utils';
import { joaat } from '@public/shared/joaat';
import { toVector3Object, Vector3, Vector4 } from '@public/shared/polyzone/vector';

import { On, Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { InventoryItem } from '../../shared/item';
import { RpcServerEvent } from '../../shared/rpc';
import { excludeExplosionAlert, GlobalWeaponConfig, WeaponConfig, Weapons } from '../../shared/weapons/weapon';
import { InventoryManager } from '../inventory/inventory.manager';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { PlayerStateService } from '../player/player.state.service';
import { Store } from '../store/store';

@Provider()
export class WeaponProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @Inject(PoliceClueDBProvider)
    private policeClueDBProvider: PoliceClueDBProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PoliceScientistProvider)
    private policeScientistProvider: PoliceScientistProvider;

    @Inject('Store')
    private store: Store;

    private lastAlertByZone: Record<string, number> = {};
    private disableExplosionAlert = false;

    @OnEvent(ServerEvent.FIVEM_WEAPON_DAMAGE_EVENT)
    public onWeaponDamageEvent(source: number, sender: number, data: any) {
        const netId: number = data.hitGlobalId || data.hitGlobalIds[0];
        const target: number = NetworkGetEntityFromNetworkId(netId);
        if (!IsPedAPlayer(target)) {
            return;
        }
        const targetData = this.playerService.getPlayer(NetworkGetEntityOwner(target));
        if (!targetData || targetData.metadata.armor.current > 0 || data.weaponType == joaat('weapon_snowball')) {
            return;
        }
        const positionVictim = GetEntityCoords(target) as Vector4;
        this.policeClueDBProvider.addClues([
            {
                id: uuidv4(),
                model: joaat('p_bloodsplat_s'),
                position: positionVictim,
                noCollision: true,
                invisible: true,
                matrix: {
                    '0': 1.7988152503967285,
                    '1': 0,
                    '2': 0,
                    '3': 0,
                    '4': 0,
                    '5': -0.05141063779592514,
                    '6': -1.7978105545043945,
                    '7': 0,
                    '8': 0,
                    '9': 1.7980772256851196,
                    '10': -0.05143792927265167,
                    '11': 0,
                    '12': positionVictim[0],
                    '13': positionVictim[1],
                    '14': positionVictim[2],
                    '15': 1,
                } as any,
                placeOnGround: true,
                type: 'evidence_blood',
                information: `Sang de ${targetData.charinfo.firstname} ${targetData.charinfo.lastname}`,
                outline: true,
                quantity: 1,
            },
        ]);
    }

    @OnEvent(ServerEvent.WEAPON_SHOOTING)
    async onWeaponShooting(
        source: number,
        weaponSlot: number,
        weaponGroup: number,
        playerAmmo: number,
        isWearingGloves: boolean
    ) {
        const weapon = this.inventoryManager.getSlot(source, weaponSlot);
        if (!weapon) {
            return;
        }

        if (weaponGroup == GetHashKey('GROUP_THROWN') && weapon.metadata.ammo <= 1) {
            this.inventoryManager.removeItemFromInventory(source, weapon.name, 1, weapon.metadata, weaponSlot);
        } else if (weaponGroup == GetHashKey('GROUP_FIREEXTINGUISHER')) {
            this.inventoryManager.updateMetadata(source, weapon.slot, {
                ammo: playerAmmo || 0,
            });
        } else {
            this.inventoryManager.updateMetadata(source, weapon.slot, {
                ammo: weapon.metadata.ammo > 0 ? weapon.metadata.ammo - 1 : 0,
                health: weapon.metadata.health > 0 ? weapon.metadata.health - 1 : 0,
            });
        }
        if (
            weaponGroup == GetHashKey('GROUP_THROWN') ||
            weaponGroup == GetHashKey('GROUP_FIREEXTINGUISHER') ||
            weaponGroup == GetHashKey('GROUP_MELEE') ||
            weaponGroup == GetHashKey('GROUP_PETROLCAN') ||
            weaponGroup == GetHashKey('GROUP_STUNGUN') ||
            weapon.name == 'weapon_snowball' ||
            weapon.name == 'weapon_ammo'
        ) {
            return;
        }
        const bulletId = uuidv4();
        const position = GetEntityCoords(GetPlayerPed(source)) as Vector4;
        const possibilities = [
            {
                '0': -0.08464948832988739,
                '1': 0,
                '2': 0.06400823593139648,
                '3': 0,
                '4': 0.061960551887750626,
                '5': 0.026466330513358116,
                '6': 0.08199362456798553,
                '7': 0,
                '8': -0.01591610163450241,
                '9': 0.10278768092393875,
                '10': -0.021073197945952415,
                '11': 0,
                '12': position[0],
                '13': position[1],
                '14': position[2],
                '15': 1,
            },
            {
                '0': 0.012342352420091629,
                '1': -0.09301327913999557,
                '2': 0.04953247681260109,
                '3': 0,
                '4': 0.0490272231400013,
                '5': 0.049223240464925766,
                '6': 0.08028391748666763,
                '7': 0,
                '8': -0.0933312475681305,
                '9': 0.013589534908533096,
                '10': 0.04874316230416298,
                '11': 0,
                '12': position[0],
                '13': position[1],
                '14': position[2],
                '15': 1,
            },
            {
                '0': -0.08595592528581619,
                '1': -0.03464289754629135,
                '2': -0.0516449399292469,
                '3': 0,
                '4': 0.021051499992609024,
                '5': 0.06671272963285446,
                '6': -0.07985212653875351,
                '7': 0,
                '8': 0.05858747288584709,
                '9': -0.07491840422153473,
                '10': -0.047225967049598694,
                '11': 0,
                '12': position[0],
                '13': position[1],
                '14': position[2],
                '15': 1,
            },
            {
                '0': -0.07145446538925171,
                '1': -0.00856716651469469,
                '2': -0.07793055474758148,
                '3': 0,
                '4': 0.06866560131311417,
                '5': -0.057831309735774994,
                '6': -0.05664428323507309,
                '7': 0,
                '8': -0.03786391764879227,
                '9': -0.08863752335309982,
                '10': 0.04448233172297478,
                '11': 0,
                '12': position[0],
                '13': position[1],
                '14': position[2],
                '15': 1,
            },
        ];
        const random = Math.floor(Math.random() * possibilities.length);
        let bulletInfo = 'Inconnue';
        const weaponInfo = Weapons[weapon.name.toUpperCase()];
        if (weaponInfo) {
            const item = this.item.getItem(weaponInfo.ammo);
            if (item) {
                bulletInfo = item.label;
            }
        }
        this.policeClueDBProvider.addClues([
            {
                id: bulletId,
                model: joaat('v_ret_gc_bullet'),
                position: position,
                noCollision: true,
                invisible: true,
                matrix: possibilities[random] as any,
                placeOnGround: true,
                type: 'evidence_bullet',
                information: `Balle de type ${bulletInfo}`,
                outline: true,
                quantity: 1,
            },
        ]);
        const playerData = this.playerService.getPlayer(source);
        if (!playerData) {
            return;
        }
        if (!isWearingGloves) {
            this.policeScientistProvider.setPlayerPowder(source, {
                last_identified_shot: Date.now(),
                last_weapon_used: weapon.label,
            });
        }
    }

    @OnEvent(ServerEvent.WEAPON_SHOOTING_ALERT)
    async onWeaponShootingAlert(source: number, alertMessage: string, htmlMessage: string, zoneID: string) {
        //No longer used
        if (this.lastAlertByZone[zoneID] && this.lastAlertByZone[zoneID] + 60000 > Date.now()) {
            return;
        }

        const coords = GetEntityCoords(GetPlayerPed(source)) as Vector3;

        exports['soz-phone'].sendSocietyMessage({
            anonymous: true,
            number: '555-POLICE',
            message: alertMessage,
            htmlMessage: htmlMessage,
            info: { type: 'shooting' },
            overrideIdentifier: 'System',
            pedPosition: JSON.stringify(toVector3Object(coords)),
        });

        this.lastAlertByZone[zoneID] = Date.now();
    }

    private async useAmmo(source: number, item: InventoryItem) {
        if (this.playerStateService.getClientState(source).isInventoryBusy) {
            this.notifier.notify(source, "Inventaire en cours d'utilisation", 'warning');
            return;
        }

        TriggerClientEvent(ClientEvent.WEAPON_USE_AMMO, source, item.name);
    }

    @Rpc(RpcServerEvent.WEAPON_USE_AMMO)
    async onUseAmmo(
        source: number,
        weaponSlot: number,
        ammoName: string,
        ammoInClip: number
    ): Promise<InventoryItem | null> {
        const weapon = this.inventoryManager.getSlot(source, weaponSlot);
        if (!weapon) {
            return;
        }

        const ammo = this.inventoryManager.findItem(
            source,
            item => item.name == ammoName && !this.item.isItemExpired(item)
        );
        if (!ammo) {
            return;
        }

        if (ammo.name !== this.getWeaponConfig(weapon.name)?.ammo) {
            this.notifier.notify(source, 'Vous ne pouvez pas utiliser ces munitions avec cette arme', 'error');
            return;
        }

        if (weapon.metadata.ammo + ammoInClip > ammoInClip * GlobalWeaponConfig.MaxAmmoRefill(weapon.name)) {
            this.notifier.notify(source, 'Vous avez déjà assez de munitions...', 'info');
            return;
        }

        if (!this.inventoryManager.removeInventoryItem(source, ammo)) {
            return;
        }

        this.inventoryManager.updateMetadata(source, weaponSlot, {
            ammo: (weapon.metadata.ammo || 0) + ammoInClip,
        });
        return this.inventoryManager.getSlot(source, weaponSlot);
    }

    @OnEvent(ServerEvent.WEAPON_GET_SNOW)
    public snow(source: number) {
        if (!this.store.getState().global.snow) {
            this.notifier.notify(source, 'Où tu as vu de la neige ???', 'error');
            return;
        }

        const weapon = this.inventoryManager.getFirstItemInventory(source, 'weapon_snowball');
        if (weapon) {
            if (weapon.metadata.ammo >= 10) {
                this.notifier.notify(source, 'Tu as trop de boules de neige sur toi !', 'error');
                return;
            }
            this.inventoryManager.updateMetadata(source, weapon.slot, {
                ammo: weapon.metadata.ammo + 1,
            });
        } else {
            this.inventoryManager.addItemToInventory(source, 'weapon_snowball', 1, { ammo: 1 });
        }
        this.notifier.notify(source, 'Tu as ramassé une boule de neige');
    }

    @Once(OnceStep.Start)
    public onStart() {
        this.item.setItemUseCallback('ammo_01', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_02', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_03', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_04', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_05', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_06', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_07', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_08', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_09', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_10', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_11', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_12', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_13', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_14', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_15', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_16', this.useAmmo.bind(this));
        this.item.setItemUseCallback('ammo_17', this.useAmmo.bind(this));
    }

    private getWeaponConfig(weaponName: string): WeaponConfig | null {
        return Weapons[weaponName.toUpperCase()] ?? null;
    }

    @On('explosionEvent')
    public onExplosion(unk: any, source: number, explosionData) {
        if (excludeExplosionAlert.includes(explosionData.explosionType) || this.disableExplosionAlert) {
            return;
        }

        if (!explosionData.f208) {
            TriggerClientEvent(
                ClientEvent.WEAPON_EXPLOSION,
                source,
                explosionData.posX,
                explosionData.posY,
                explosionData.posZ,
                explosionData.explosionType
            );
        }
    }

    public setDisableExplosionAlert(value: boolean) {
        this.disableExplosionAlert = value;
    }
}
