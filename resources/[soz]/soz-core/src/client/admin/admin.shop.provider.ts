import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { ClientEvent } from '@public/shared/event';
import { toVector4Object } from '@public/shared/polyzone/vector';
import { TargetOption } from '@public/shared/target';

import { Provider } from '../../core/decorators/provider';
import { InventoryManager } from '../inventory/inventory.manager';
import { ItemService } from '../item/item.service';
import { PlayerService } from '../player/player.service';
import { TargetFactory } from '../target/target.factory';

const shop = {
    Munitions: [
        'ammo_01',
        'ammo_02',
        'ammo_03',
        'ammo_04',
        'ammo_05',
        'ammo_06',
        'ammo_07',
        'ammo_08',
        'ammo_09',
        'ammo_10',
        'ammo_11',
        'ammo_12',
        'ammo_13',
        'ammo_14',
        'ammo_15',
        'ammo_16',
        'ammo_17',
        'ammo_18',
    ],
    Pistolet: [
        'weapon_pistol',
        'weapon_pistol_mk2',
        'weapon_combatpistol',
        'weapon_appistol',
        'weapon_stungun',
        'weapon_pistol50',
        'weapon_snspistol',
        'weapon_snspistol_mk2',
        'weapon_heavypistol',
        'weapon_vintagepistol',
        'weapon_flaregun',
        'weapon_marksmanpistol',
        'weapon_revolver',
        'weapon_revolver_mk2',
        'weapon_doubleaction',
        'weapon_raypistol',
        'weapon_ceramicpistol',
        'weapon_navyrevolver',
        'weapon_gadgetpistol',
        'weapon_stungun_mp',
        'weapon_pistolxm3',
    ],
    Mitraillette: [
        'weapon_microsmg',
        'weapon_smg',
        'weapon_smg_mk2',
        'weapon_assaultsmg',
        'weapon_combatpdw',
        'weapon_machinepistol',
        'weapon_minismg',
        'weapon_tecpistol',
        'weapon_gusenberg',
    ],
    Pompe: [
        'weapon_pumpshotgun',
        'weapon_pumpshotgun_mk2',
        'weapon_sawnoffshotgun',
        'weapon_assaultshotgun',
        'weapon_bullpupshotgun',
        'weapon_musket',
        'weapon_heavyshotgun',
        'weapon_dbshotgun',
        'weapon_autoshotgun',
        'weapon_dbshotgun',
        'weapon_combatshotgun',
    ],
    Fusil: [
        'weapon_assaultrifle',
        'weapon_assaultrifle_mk2',
        'weapon_carbinerifle',
        'weapon_carbinerifle_mk2',
        'weapon_advancedrifle',
        'weapon_specialcarbine',
        'weapon_specialcarbine_mk2',
        'weapon_bullpuprifle',
        'weapon_bullpuprifle_mk2',
        'weapon_compactrifle',
        'weapon_militaryrifle',
        'weapon_heavyrifle',
        'weapon_tacticalrifle',
        'weapon_battlerifle',
    ],
    Mitrailleuse: ['weapon_mg', 'weapon_combatmg', 'weapon_combatmg_mk2', 'weapon_raycarbine'],
    Sniper: [
        'weapon_sniperrifle',
        'weapon_heavysniper',
        'weapon_heavysniper_mk2',
        'weapon_marksmanrifle',
        'weapon_marksmanrifle_mk2',
        'weapon_precisionrifle',
    ],
    Lourd: [
        'weapon_rpg',
        'weapon_grenadelauncher',
        'weapon_grenadelauncher_smoke',
        'weapon_minigun',
        'weapon_firework',
        'weapon_hominglauncher',
        'weapon_compactlauncher',
        'weapon_emplauncher',
        'weapon_rayminigun',
        'weapon_railgunxm3',
        'weapon_railgun',
        'weapon_snowlauncher',
    ],
    Lancable: [
        'weapon_grenade',
        'weapon_bzgas',
        'weapon_molotov',
        'weapon_stickybomb',
        'weapon_proxmine',
        'weapon_pipebomb',
        'weapon_ball',
        'weapon_smokegrenade',
        'weapon_flare',
        'weapon_acidpackage',
    ],
    Protection: [
        'armor_plate',
        'bulletproof_vest_medium',
        'bulletproof_vest_low',
        'armor_tactical',
        'armor_tactical_light',
        'armor_tactical_medium',
        'armor_tactical_heavy',
    ],
    Mélée: [
        'weapon_knuckle',
        'weapon_machete',
        'weapon_bottle',
        'weapon_hammer',
        'weapon_flashlight',
        'weapon_nightstick',
        'weapon_poolcue',
        'weapon_bat',
        'weapon_switchblade',
        'weapon_knife',
        'weapon_crowbar',
        'weapon_stone_hatchet',
        'weapon_battleaxe',
        'weapon_wrench',
        'weapon_candycane',
        'weapon_golfclub',
        'weapon_dagger',
        'weapon_hatchet',
        'weapon_stunrod',
    ],
};
const shopMetadata = {
    Lancable: { ammo: 1 },
};

@Provider()
export class AdminShopProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ItemService)
    private itemService: ItemService;

    private getTargets(): TargetOption[] {
        const ret: TargetOption[] = [];

        for (const [title, items] of Object.entries(shop)) {
            ret.push({
                label: title,
                category: 'citizen',
                canInteract: () => {
                    const player = this.playerService.getPlayer();
                    if (!player) {
                        return false;
                    }
                    return ['staff', 'admin'].includes(player.role);
                },
                action: async () => {
                    this.inventoryManager.openShopInventory(
                        items.map(item => ({
                            ...this.itemService.getItem(item),
                            price: 1,
                            metadata: shopMetadata[title],
                        })),
                        title
                    );
                },
            });
        }
        ret.push({
            label: 'Gunsmith',
            category: 'society',
            canInteract: () => {
                const player = this.playerService.getPlayer();
                if (!player) {
                    return false;
                }
                return ['staff', 'admin'].includes(player.role);
            },
            action: async () => {
                emit(ClientEvent.WEAPON_OPEN_GUNSMITH, true);
            },
        });

        return ret;
    }

    @Once(OnceStep.Start)
    public async onStart() {
        this.targetFactory.createForPed({
            coords: toVector4Object([5010.68, -5757.93, 27.85, 337.07]),
            model: 's_m_y_blackops_03',
            freeze: true,
            invincible: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_STAND_IMPATIENT',
            target: {
                options: this.getTargets(),
                distance: 3.0,
            },
        });
    }
}
