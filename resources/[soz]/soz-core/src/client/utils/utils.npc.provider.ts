import { On, Once } from '@public/core/decorators/event';
import { Tick } from '@public/core/decorators/tick';
import { Vector2 } from '@public/shared/polyzone/vector';

import { Provider } from '../../core/decorators/provider';

const DisableSpawn: Vector2[][] = [
    [
        // LSPD
        [487.64, -12.38],
        [531.07, 38.07],
        [667.54, 1.78],
        [557.58, -66.67],
    ],
    [
        // BCSO
        [1870.77, 3687.37],
        [1858.87, 3711.39],
        [1807.03, 3679.45],
        [1819.46, 3659.77],
    ],
    [
        // MTP
        [-316.55, 6034.77],
        [-286.99, 6005.98],
        [-192.62, 6099.07],
        [-224.23, 6129.52],
    ],
    [
        // PAWL
        [-642.06, 5295.47],
        [-594.74, 5392.59],
        [-451.87, 5359.08],
        [-499.19, 5227.49],
    ],
    [
        // UPW
        [532.32, 2834.87],
        [541.52, 2714.07],
        [668.28, 2724.53],
        [660.12, 2842.84],
    ],
    [
        // TwitchNews
        [-608.23, -906.54],
        [-608.62, -945.35],
        [-547.05, -944.04],
        [-547.5, -906.46],
    ],
    [
        // Yellow Jack
        [1980.99, 3033.43],
        [2010.96, 3068.37],
    ],
];

const disabledPickups = [
    GetHashKey('PICKUP_AMMO_BULLET_MP'),
    GetHashKey('PICKUP_AMMO_FIREWORK'),
    GetHashKey('PICKUP_AMMO_FLAREGUN'),
    GetHashKey('PICKUP_AMMO_GRENADELAUNCHER'),
    GetHashKey('PICKUP_AMMO_GRENADELAUNCHER_MP'),
    GetHashKey('PICKUP_AMMO_HOMINGLAUNCHER'),
    GetHashKey('PICKUP_AMMO_MG'),
    GetHashKey('PICKUP_AMMO_MINIGUN'),
    GetHashKey('PICKUP_AMMO_MISSILE_MP'),
    GetHashKey('PICKUP_AMMO_PISTOL'),
    GetHashKey('PICKUP_AMMO_RIFLE'),
    GetHashKey('PICKUP_AMMO_RPG'),
    GetHashKey('PICKUP_AMMO_SHOTGUN'),
    GetHashKey('PICKUP_AMMO_SMG'),
    GetHashKey('PICKUP_AMMO_SNIPER'),
    GetHashKey('PICKUP_ARMOUR_STANDARD'),
    GetHashKey('PICKUP_CAMERA'),
    GetHashKey('PICKUP_CUSTOM_SCRIPT'),
    GetHashKey('PICKUP_GANG_ATTACK_MONEY'),
    GetHashKey('PICKUP_HEALTH_SNACK'),
    GetHashKey('PICKUP_HEALTH_STANDARD'),
    GetHashKey('PICKUP_MONEY_CASE'),
    GetHashKey('PICKUP_MONEY_DEP_BAG'),
    GetHashKey('PICKUP_MONEY_MED_BAG'),
    GetHashKey('PICKUP_MONEY_PAPER_BAG'),
    GetHashKey('PICKUP_MONEY_PURSE'),
    GetHashKey('PICKUP_MONEY_SECURITY_CASE'),
    GetHashKey('PICKUP_MONEY_VARIABLE'),
    GetHashKey('PICKUP_MONEY_WALLET'),
    GetHashKey('PICKUP_PARACHUTE'),
    GetHashKey('PICKUP_PORTABLE_CRATE_FIXED_INCAR'),
    GetHashKey('PICKUP_PORTABLE_CRATE_UNFIXED'),
    GetHashKey('PICKUP_PORTABLE_CRATE_UNFIXED_INCAR'),
    GetHashKey('PICKUP_PORTABLE_CRATE_UNFIXED_INCAR_SMALL'),
    GetHashKey('PICKUP_PORTABLE_CRATE_UNFIXED_LOW_GLOW'),
    GetHashKey('PICKUP_PORTABLE_DLC_VEHICLE_PACKAGE'),
    GetHashKey('PICKUP_PORTABLE_PACKAGE'),
    GetHashKey('PICKUP_SUBMARINE'),
    GetHashKey('PICKUP_VEHICLE_ARMOUR_STANDARD'),
    GetHashKey('PICKUP_VEHICLE_CUSTOM_SCRIPT'),
    GetHashKey('PICKUP_VEHICLE_CUSTOM_SCRIPT_LOW_GLOW'),
    GetHashKey('PICKUP_VEHICLE_HEALTH_STANDARD'),
    GetHashKey('PICKUP_VEHICLE_HEALTH_STANDARD_LOW_GLOW'),
    GetHashKey('PICKUP_VEHICLE_MONEY_VARIABLE'),
    GetHashKey('PICKUP_VEHICLE_WEAPON_APPISTOL'),
    GetHashKey('PICKUP_VEHICLE_WEAPON_ASSAULTSMG'),
    GetHashKey('PICKUP_VEHICLE_WEAPON_COMBATPISTOL'),
    GetHashKey('PICKUP_VEHICLE_WEAPON_GRENADE'),
    GetHashKey('PICKUP_VEHICLE_WEAPON_MICROSMG'),
    GetHashKey('PICKUP_VEHICLE_WEAPON_MOLOTOV'),
    GetHashKey('PICKUP_VEHICLE_WEAPON_PISTOL'),
    GetHashKey('PICKUP_VEHICLE_WEAPON_PISTOL50'),
    GetHashKey('PICKUP_VEHICLE_WEAPON_SAWNOFF'),
    GetHashKey('PICKUP_VEHICLE_WEAPON_SMG'),
    GetHashKey('PICKUP_VEHICLE_WEAPON_SMOKEGRENADE'),
    GetHashKey('PICKUP_VEHICLE_WEAPON_STICKYBOMB'),
    GetHashKey('PICKUP_WEAPON_ADVANCEDRIFLE'),
    GetHashKey('PICKUP_WEAPON_APPISTOL'),
    GetHashKey('PICKUP_WEAPON_ASSAULTRIFLE'),
    GetHashKey('PICKUP_WEAPON_ASSAULTSHOTGUN'),
    GetHashKey('PICKUP_WEAPON_ASSAULTSMG'),
    GetHashKey('PICKUP_WEAPON_AUTOSHOTGUN'),
    GetHashKey('PICKUP_WEAPON_BAT'),
    GetHashKey('PICKUP_WEAPON_BATTLEAXE'),
    GetHashKey('PICKUP_WEAPON_BOTTLE'),
    GetHashKey('PICKUP_WEAPON_BULLPUPRIFLE'),
    GetHashKey('PICKUP_WEAPON_BULLPUPSHOTGUN'),
    GetHashKey('PICKUP_WEAPON_CARBINERIFLE'),
    GetHashKey('PICKUP_WEAPON_COMBATMG'),
    GetHashKey('PICKUP_WEAPON_COMBATPDW'),
    GetHashKey('PICKUP_WEAPON_COMBATPISTOL'),
    GetHashKey('PICKUP_WEAPON_COMPACTLAUNCHER'),
    GetHashKey('PICKUP_WEAPON_COMPACTRIFLE'),
    GetHashKey('PICKUP_WEAPON_CROWBAR'),
    GetHashKey('PICKUP_WEAPON_DAGGER'),
    GetHashKey('PICKUP_WEAPON_DBSHOTGUN'),
    GetHashKey('PICKUP_WEAPON_FIREWORK'),
    GetHashKey('PICKUP_WEAPON_FLAREGUN'),
    GetHashKey('PICKUP_WEAPON_FLASHLIGHT'),
    GetHashKey('PICKUP_WEAPON_GRENADE'),
    GetHashKey('PICKUP_WEAPON_GRENADELAUNCHER'),
    GetHashKey('PICKUP_WEAPON_GUSENBERG'),
    GetHashKey('PICKUP_WEAPON_GOLFCLUB'),
    GetHashKey('PICKUP_WEAPON_HAMMER'),
    GetHashKey('PICKUP_WEAPON_HATCHET'),
    GetHashKey('PICKUP_WEAPON_HEAVYPISTOL'),
    GetHashKey('PICKUP_WEAPON_HEAVYSHOTGUN'),
    GetHashKey('PICKUP_WEAPON_HEAVYSNIPER'),
    GetHashKey('PICKUP_WEAPON_HOMINGLAUNCHER'),
    GetHashKey('PICKUP_WEAPON_KNIFE'),
    GetHashKey('PICKUP_WEAPON_KNUCKLE'),
    GetHashKey('PICKUP_WEAPON_MACHETE'),
    GetHashKey('PICKUP_WEAPON_MACHINEPISTOL'),
    GetHashKey('PICKUP_WEAPON_MARKSMANPISTOL'),
    GetHashKey('PICKUP_WEAPON_MARKSMANRIFLE'),
    GetHashKey('PICKUP_WEAPON_MG'),
    GetHashKey('PICKUP_WEAPON_MICROSMG'),
    GetHashKey('PICKUP_WEAPON_MINIGUN'),
    GetHashKey('PICKUP_WEAPON_MINISMG'),
    GetHashKey('PICKUP_WEAPON_MOLOTOV'),
    GetHashKey('PICKUP_WEAPON_MUSKET'),
    GetHashKey('PICKUP_WEAPON_NIGHTSTICK'),
    GetHashKey('PICKUP_WEAPON_PETROLCAN'),
    GetHashKey('PICKUP_WEAPON_PIPEBOMB'),
    GetHashKey('PICKUP_WEAPON_PISTOL'),
    GetHashKey('PICKUP_WEAPON_PISTOL50'),
    GetHashKey('PICKUP_WEAPON_POOLCUE'),
    GetHashKey('PICKUP_WEAPON_PROXMINE'),
    GetHashKey('PICKUP_WEAPON_PUMPSHOTGUN'),
    GetHashKey('PICKUP_WEAPON_RAILGUN'),
    GetHashKey('PICKUP_WEAPON_REVOLVER'),
    GetHashKey('PICKUP_WEAPON_RPG'),
    GetHashKey('PICKUP_WEAPON_SAWNOFFSHOTGUN'),
    GetHashKey('PICKUP_WEAPON_SMG'),
    GetHashKey('PICKUP_WEAPON_SMOKEGRENADE'),
    GetHashKey('PICKUP_WEAPON_SNIPERRIFLE'),
    GetHashKey('PICKUP_WEAPON_SNSPISTOL'),
    GetHashKey('PICKUP_WEAPON_SPECIALCARBINE'),
    GetHashKey('PICKUP_WEAPON_STICKYBOMB'),
    GetHashKey('PICKUP_WEAPON_STUNGUN'),
    GetHashKey('PICKUP_WEAPON_SWITCHBLADE'),
    GetHashKey('PICKUP_WEAPON_VINTAGEPISTOL'),
    GetHashKey('PICKUP_WEAPON_WRENCH'),
];

@Provider()
export class UtilsNPCProvider {
    private density = {
        parked: 1.0,
        vehicle: 1.0,
        multiplier: 1.0,
        peds: 1.0,
        scenario: 1.0, //Walking NPC Density
    };

    @Once()
    public onStart() {
        const relationshipTypesLike = ['CIVMALE', 'CIVFEMALE', 'COP', 'SECURITY_GUARD', 'PRIVATE_SECURITY'];

        const relationshipTypesRespect = [
            'GANG_1',
            'GANG_2',
            'GANG_9',
            'GANG_10',
            'AMBIENT_GANG_LOST',
            'AMBIENT_GANG_MEXICAN',
            'AMBIENT_GANG_FAMILY',
            'AMBIENT_GANG_BALLAS',
            'AMBIENT_GANG_MARABUNTE',
            'AMBIENT_GANG_CULT',
            'AMBIENT_GANG_SALVA',
            'AMBIENT_GANG_WEICHENG',
            'AMBIENT_GANG_HILLBILLY',
            'DEALER',
            'HATES_PLAYER',
            'NO_RELATIONSHIP',
            'SPECIAL',
            'MISSION2',
            'MISSION3',
            'MISSION4',
            'MISSION5',
            'MISSION6',
            'MISSION7',
            'MISSION8',
            'AGGRESSIVE_INVESTIGATE',
            'MEDIC',
            'FIREMAN',
        ];

        /*
            Relationship types:
            0 = Companion
            1 = Respect
            2 = Like
            3 = Neutral
            4 = Dislike
            5 = Hate
            255 = Pedestrians
        */
        for (const group of relationshipTypesRespect) {
            SetRelationshipBetweenGroups(1, GetHashKey(group), GetHashKey('PLAYER'));
        }
        for (const group of relationshipTypesLike) {
            SetRelationshipBetweenGroups(2, GetHashKey(group), GetHashKey('PLAYER'));
        }

        // SetGarbageTrucks(false)
        SetCreateRandomCops(false);
        SetCreateRandomCopsNotOnScenarios(false);
        SetCreateRandomCopsOnScenarios(false);
        DistantCopCarSirens(false);
        /*
        RemoveVehiclesFromGeneratorsInArea(335.2616 - 300.0, -1432.455 - 300.0, 46.51 - 300.0, 335.2616 + 300.0, -1432.455 + 300.0, 46.51 + 300.0) -- central los santos medical center
        RemoveVehiclesFromGeneratorsInArea(441.8465 - 500.0, -987.99 - 500.0, 30.68 - 500.0, 441.8465 + 500.0, -987.99 + 500.0, 30.68 + 500.0) -- police station mission row
        RemoveVehiclesFromGeneratorsInArea(316.79 - 300.0, -592.36 - 300.0, 43.28 - 300.0, 316.79 + 300.0, -592.36 + 300.0, 43.28 + 300.0) -- pillbox
        RemoveVehiclesFromGeneratorsInArea(-2150.44 - 500.0, 3075.99 - 500.0, 32.8 - 500.0, -2150.44 + 500.0, -3075.99 + 500.0, 32.8 + 500.0) -- military
        RemoveVehiclesFromGeneratorsInArea(-1108.35 - 300.0, 4920.64 - 300.0, 217.2 - 300.0, -1108.35 + 300.0, 4920.64 + 300.0, 217.2 + 300.0) -- nudist
        RemoveVehiclesFromGeneratorsInArea(-458.24 - 300.0, 6019.81 - 300.0, 31.34 - 300.0, -458.24 + 300.0, 6019.81 + 300.0, 31.34 + 300.0) -- police station paleto
        RemoveVehiclesFromGeneratorsInArea(1854.82 - 300.0, 3679.4 - 300.0, 33.82 - 300.0, 1854.82 + 300.0, 3679.4 + 300.0, 33.82 + 300.0) -- police station sandy
        RemoveVehiclesFromGeneratorsInArea(-724.46 - 300.0, -1444.03 - 300.0, 5.0 - 300.0, -724.46 + 300.0, -1444.03 + 300.0, 5.0 + 300.0) -- REMOVE CHOPPERS WOW
        */

        // Disable LSMC heli spawn
        const helipad = [305.92, -1457.84, 46.56];
        const helipadMin = [helipad[0] - 20.0, helipad[1] - 20.0, helipad[2] - 5.0];
        const helipadMax = [helipad[0] + 20.0, helipad[1] + 20.0, helipad[2] + 5.0];

        if (
            !DoesScenarioBlockingAreaExist(
                helipadMin[0],
                helipadMin[1],
                helipadMin[1],
                helipadMax[0],
                helipadMax[1],
                helipadMax[2]
            )
        ) {
            AddScenarioBlockingArea(
                helipadMin[0],
                helipadMin[1],
                helipadMin[1],
                helipadMax[0],
                helipadMax[1],
                helipadMax[2],
                false,
                true,
                true,
                true
            );
        }

        SetPedPopulationBudget(3.0);
        SetVehiclePopulationBudget(3.0);
        SetAllVehicleGeneratorsActive();

        for (let i = 1; i <= 15; i++) {
            EnableDispatchService(i, false);
        }

        const playerId = PlayerId();
        for (const hash of disabledPickups) {
            ToggleUsePickupsForPlayer(playerId, hash, false);
        }
    }

    @Tick()
    public onDensityTick() {
        SetParkedVehicleDensityMultiplierThisFrame(this.density['parked']);
        SetVehicleDensityMultiplierThisFrame(this.density['vehicle']);
        SetRandomVehicleDensityMultiplierThisFrame(this.density['multiplier']);
        SetPedDensityMultiplierThisFrame(this.density['peds']);
        SetAmbientPedRangeMultiplierThisFrame(this.density['peds']);
        SetScenarioPedDensityMultiplierThisFrame(this.density['scenario'], this.density['scenario']);
    }

    @Tick()
    public onDisablePlayerVehicleRewardsTick() {
        DisablePlayerVehicleRewards(PlayerId());
    }

    public updateDensity(type: string, value: number) {
        this.density[type] = value;
    }

    @On('populationPedCreating')
    public async onPopulationPedCreating(x: number, y: number, z: number) {
        for (const zone of DisableSpawn) {
            const Px = {
                min: null,
                max: null,
            };
            const Py = {
                min: null,
                max: null,
            };

            for (const coord of zone) {
                if (Px.min == null || Px.min > coord[0]) {
                    Px.min = coord[0];
                }
                if (Px.max == null || Px.max < coord[0]) {
                    Px.max = coord[0];
                }
                if (Py.min == null || Py.min > coord[1]) {
                    Py.min = coord[1];
                }
                if (Py.max == null || Py.max < coord[1]) {
                    Py.max = coord[1];
                }
            }

            if (x >= Px.min && x <= Px.max && y >= Py.min && y <= Py.max) {
                CancelEvent();
                return;
            }
        }

        Wait(500); // Give the entity some time to be created
        const [, handle] = GetClosestPed(x, y, z, 1.0, false, false, false, false, 0);
        SetPedDropsWeaponsWhenDead(handle, false);
    }
}
