import { AnimationService } from '@public/client/animation/animation.service';
import { Notifier } from '@public/client/notifier';
import { InputService } from '@public/client/nui/input.service';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { PlayerService } from '@public/client/player/player.service';
import { ResourceLoader } from '@public/client/repository/resource.loader';
import { TargetFactory } from '@public/client/target/target.factory';
import { NoClipProvider } from '@public/client/utils/noclip.provider';
import { VehiclePushProvider } from '@public/client/vehicle/vehicle.push.provider';
import { Command } from '@public/core/decorators/command';
import { On, Once, OnceStep, OnEvent, OnGameEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { wait, waitUntil } from '@public/core/utils';
import {
    AnyClientPet,
    ClientJobPet,
    ClientPet,
    getAffectionLabel,
    GetMaxEnergyForPet,
    getTrainingLabel,
    increamentalPetMeta,
    IncrementalPetData,
    incrementalPetResetMetadata,
    IncrementalPetResetMetadataType,
    JobFixPetVariation,
    k9_model,
    negativeTraitLabel,
    orderJobRestriction,
    PetBehavior,
    petBreedToOrderType,
    PetDistanceAttackOnTarget,
    PetDistanceCatchTheBall,
    PetDistanceFollow,
    PetDistanceForceFollowPlayer,
    PetDistanceOrderPedDeltaTrigger,
    PetDistanceOrderTargetDistance,
    PetDistanceOrderVehicleDeltaTrigger,
    PetDistancePetAttackOnShooting,
    PetDistanceReturnHome,
    PetDistanceSearch,
    PetDistanceSearchOnTargetPed,
    PetDistanceSearchOnTargetVehicle,
    PetDistanceUseFood,
    PetMetaLabel,
    PetOrder,
    PetOrderAnimationFlag,
    petOrderMeta,
    petOrderModelAnimation,
    petOrderSitInCarAnimation,
    PetResetMetaLabel,
    PetTrainingMinimalExecOrderChance,
    positiveTraitLabel,
    TENNIS_BALL_MODEL,
} from '@public/shared/animal';
import { AnimationStopReason } from '@public/shared/animation';
import { ClientEvent, GameEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { InventoryItem } from '@public/shared/inventory';
import { FDO, JobType } from '@public/shared/job';
import { PositiveNumberValidator } from '@public/shared/nui/input';
import { PetStats } from '@public/shared/nui/pet_manager';
import { IsPedAnAnimal } from '@public/shared/player';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

@Provider()
export class AnimalProvider {
    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(NoClipProvider)
    private noClipProvider: NoClipProvider;

    @Inject(VehiclePushProvider)
    private vehiclePushProvider: VehiclePushProvider;

    private pet: ClientPet;
    private job_pet: ClientJobPet;

    private currentOrder: PetOrder;
    private forceOrder: boolean;
    private isUsingWhistle: boolean = false;
    private warningDistanceNotif: boolean = false;
    private ballEntityNetId: number;
    private energyNotif: boolean = true;
    private behavior: PetBehavior = PetBehavior.PASSIVE;
    private isAttacking = false;
    private lastGunShotTrigger: number;

    @OnEvent(ClientEvent.ADMIN_SWITCH_CHARACTER)
    public async onCharacterSwitch() {
        const pet = this.getCurrentPet();
        if (pet?.entity) {
            await this.despawnAnimal(pet);
        }

        this.resetAll();
        await this.onSyncAnimal(true);
        await this.onSyncJobAnimal(true);
    }

    @OnEvent(ClientEvent.PET_SYNC_JOB_ANIMAL)
    public async onSyncJobAnimal(force: boolean = false) {
        const pet = await emitRpc<ClientJobPet | null>(RpcServerEvent.PET_GET_JOB_ANIMAL, force);

        if (this.job_pet && (!pet || pet.dead) && this.job_pet.entity) {
            await this.despawnAnimal(this.job_pet);
        }

        if (!pet) {
            this.job_pet = null;
            if (!this.pet?.entity) {
                this.syncWithUI(this.job_pet);
            }
            return;
        }

        this.job_pet = this.job_pet
            ? {
                  ...this.job_pet,
                  ...pet,
              }
            : pet;

        const currentPet = this.getCurrentPet();
        if (currentPet && currentPet.entity === this.job_pet.entity) {
            this.syncWithUI(this.job_pet);
            this.triggerEnergyNotif(this.job_pet);
        }
    }

    @OnEvent(ClientEvent.PET_SYNC_ANIMAL)
    public async onSyncAnimal(force: boolean = false) {
        const pet = await emitRpc<ClientPet | null>(RpcServerEvent.PET_GET_ANIMAL, force);

        if (this.pet && (!pet || pet.dead) && this.pet.entity) {
            await this.despawnAnimal(this.pet);
        }

        if (!pet) {
            this.pet = null;
            if (!this.job_pet?.entity) {
                this.syncWithUI(this.pet);
            }
            return;
        }

        this.pet = this.pet
            ? {
                  ...this.pet,
                  ...pet,
              }
            : pet;

        const currentPet = this.getCurrentPet();
        if (currentPet && currentPet.entity === this.pet.entity) {
            this.syncWithUI(this.pet);
            this.triggerEnergyNotif(this.pet);
        }
    }

    private resetAll() {
        this.currentOrder = null;
        this.forceOrder = null;
        this.isUsingWhistle = false;
        this.warningDistanceNotif = false;
        this.behavior = PetBehavior.PASSIVE;
        this.isAttacking = false;
        this.syncWithUI(null);
    }

    private triggerEnergyNotif(pet: AnyClientPet) {
        const maxEnergy = this.getMaxEnergyForPet(pet);

        if (pet.energy > maxEnergy / 2 && this.energyNotif) {
            this.energyNotif = false;
        } else if (pet.energy <= maxEnergy / 2 && !this.energyNotif) {
            this.energyNotif = true;
            this.notifier.notify(
                `${pet.name || `Ton animal`} commence à ~r~s'épuiser~s~, tu ne pourras bientôt plus lui donner d'ordre.`,
                'info'
            );
        }
    }

    private petAsPetStats(pet: AnyClientPet | null): PetStats {
        if (!pet?.entity) return null;

        return {
            dead: pet.dead,
            hunger: pet.hunger,
            thirst: pet.thirst,
            energy: pet.energy,
            maxEnergy: this.getMaxEnergyForPet(pet),
        };
    }

    private syncWithUI(pet: AnyClientPet | null) {
        const petAsStats = this.petAsPetStats(pet);
        this.nuiDispatch.dispatch('pet_manager', 'Update', petAsStats);
    }

    @Once(OnceStep.PlayerLoaded)
    public async loadTarget() {
        await this.onSyncAnimal(true);
        await this.onSyncJobAnimal(true);

        this.targetFactory.createForAllPed(
            [
                {
                    label: 'Attaque',
                    icon: 'crimi/toxic_flesh',
                    job: FDO.reduce((prev, cur) => ({ ...prev, [cur]: 0 }), {} as Record<JobType, number>),
                    category: 'society',
                    canInteract: entity => {
                        if (!GetEntityCanBeDamaged(entity) || IsPedAnAnimal(entity)) return false;

                        const pet = this.getCurrentPet();
                        return pet?.model === k9_model;
                    },
                    action: async (entity: number) => {
                        await this.attackExcecutionOrder(entity);
                    },
                },
            ],
            PetDistanceOrderTargetDistance
        );
        this.targetFactory.createForAllPlayer(
            [
                {
                    label: 'Attaque',
                    icon: 'crimi/toxic_flesh',
                    job: FDO.reduce((prev, cur) => ({ ...prev, [cur]: 0 }), {} as Record<JobType, number>),
                    category: 'society',
                    canInteract: () => {
                        const pet = this.getCurrentPet();
                        return pet?.model === k9_model;
                    },
                    action: async (entity: number) => {
                        await this.attackExcecutionOrder(entity);
                    },
                },
            ],
            PetDistanceOrderTargetDistance
        );

        this.targetFactory.createForModel(TENNIS_BALL_MODEL, [
            {
                label: 'Ramasser',
                icon: 'baun/createCocktailBox',
                category: 'citizen',
                canInteract: entity => {
                    const entityFromNet = NetworkGetEntityFromNetworkId(this.ballEntityNetId);
                    return entity === entityFromNet;
                },
                action: async entity => {
                    const entityFromNet = NetworkGetEntityFromNetworkId(this.ballEntityNetId);

                    if (entity !== entityFromNet) {
                        this.ballEntityNetId = null;
                        return;
                    }

                    const stopReason = await this.animationService.playAnimation({
                        base: {
                            dictionary: 'anim@mp_snowball',
                            name: 'pickup_snowball',
                        },
                    });

                    if (stopReason !== AnimationStopReason.Finished) {
                        return;
                    }

                    // TODO : Voir si le delete peut être synchro avec l'anim
                    TriggerServerEvent(ServerEvent.PET_PICK_UP_BALL, this.ballEntityNetId);
                    this.ballEntityNetId = null;
                },
            },
        ]);

        this.targetFactory.createForModel(
            Object.keys(petBreedToOrderType),
            [
                {
                    label: 'Caresser',
                    icon: 'pet/cuddle',
                    category: 'citizen',
                    canInteract: entity => {
                        const pet = this.getCurrentPet();
                        return pet?.entity !== entity && !IsEntityDead(entity);
                    },
                    action: async () => {
                        await this.animationService.playAnimation({
                            base: {
                                dictionary: 'creatures@rottweiler@tricks@',
                                name: 'petting_franklin',
                            },
                        });
                        // TODO: Maybe attack ?
                    },
                },
            ],
            1.5
        );

        this.targetFactory.createForModel(
            k9_model,
            [
                {
                    label: 'Passif',
                    icon: 'shop/pet',
                    category: 'society',
                    canInteract: entity => {
                        const pet = this.getCurrentPet();
                        return pet?.entity === entity && !IsEntityDead(entity) && this.behavior !== PetBehavior.PASSIVE;
                    },
                    action: () => {
                        this.behavior = PetBehavior.PASSIVE;
                        const pet = this.getCurrentPet();
                        this.notifier.notify(`${pet.name || `Ton animal`} est ~g~passif~s~.`, 'info');
                    },
                },
                {
                    label: 'Défensif',
                    icon: 'crimi/grab',
                    category: 'society',
                    canInteract: entity => {
                        const pet = this.getCurrentPet();
                        return (
                            pet?.entity === entity && !IsEntityDead(entity) && this.behavior !== PetBehavior.DEFENSIVE
                        );
                    },
                    action: () => {
                        this.behavior = PetBehavior.DEFENSIVE;
                        const pet = this.getCurrentPet();
                        this.notifier.notify(`${pet.name || `Ton animal`} est sur la ~g~défensive~s~.`, 'info');
                    },
                },
                {
                    label: 'Aggresif',
                    icon: 'crimi/force-consume',
                    category: 'society',
                    canInteract: entity => {
                        const pet = this.getCurrentPet();
                        return (
                            pet?.entity === entity && !IsEntityDead(entity) && this.behavior !== PetBehavior.AGGRESIVE
                        );
                    },
                    action: () => {
                        this.behavior = PetBehavior.AGGRESIVE;
                        const pet = this.getCurrentPet();
                        this.notifier.notify(
                            `${pet.name || `Ton animal`} est prêt à répondre  ~g~à tout agression~s~.`,
                            'info'
                        );
                    },
                },
            ],
            1.5
        );
    }

    @Command('openanimalui', {
        description: 'Open animal ui',
        passthroughNuiFocus: true,
        keys: [{ mapper: 'keyboard', key: 'O' }],
    })
    animalUiCommand() {
        const ped = PlayerPedId();
        if (GetVehiclePedIsIn(ped, false)) {
            return;
        }

        if (!this.isOwningPet()) {
            this.notifier.notify("Tu ne possèdes pas d'animal.", 'error');
            return;
        }

        const pet = this.getCurrentPet();
        if (!pet) {
            this.notifier.notify('Ton animal se repose.', 'info');
            return;
        }
        const actions = this.petOrderAvailable(pet);
        this.nuiDispatch.dispatch('pet_manager', 'ShowPetManager', { open: true, actions });
    }

    @On('CEventGunShot', false)
    public async onCEventGunShot(entities, eventEntity): Promise<void> {
        if (this.isAttacking) return;
        if (this.lastGunShotTrigger && new Date().getTime() <= this.lastGunShotTrigger + 500) return;

        const ped = PlayerPedId();
        const player = this.playerService.getPlayer();

        const pet = this.getCurrentPet();
        if (!pet?.entity || !pet.isPetJob || pet.model !== k9_model || this.currentOrder === PetOrder.SEARCH) return;

        if (
            !eventEntity ||
            !player ||
            player.metadata.isdead ||
            this.behavior !== PetBehavior.AGGRESIVE ||
            ped === eventEntity ||
            !DoesEntityExist(eventEntity) ||
            !IsEntityAPed(eventEntity) ||
            IsPedAnAnimal(eventEntity) ||
            this.playerService.getState()?.isInGame
        )
            return;

        const playerPosition = GetEntityCoords(PlayerPedId()) as Vector3;
        const distance = getDistance(GetEntityCoords(eventEntity) as Vector3, playerPosition);

        if (distance > PetDistancePetAttackOnShooting) return;
        if (!this.shouldOrderSucess(pet)) return;
        if (
            IsPedAPlayer(eventEntity) &&
            !(await emitRpc<boolean>(
                RpcServerEvent.PET_SHOULD_PLAYER_BE_ATTACKED,
                GetPlayerServerId(NetworkGetPlayerIndexFromPed(eventEntity))
            ))
        )
            return;

        const now = new Date().getTime();
        if (this.lastGunShotTrigger && now <= this.lastGunShotTrigger + 7500) return;
        this.lastGunShotTrigger = now;

        this.currentOrder = null;
        await this.attackTheTarget(pet, eventEntity);
    }

    @OnGameEvent(GameEvent.CEventNetworkEntityDamage)
    async onEntityGetDamaged(
        victim: number,
        attacker: number,
        unkInt1: number,
        unkBool1: number,
        unkBool2: number,
        isFatal: boolean,
        weaponHash: number
    ) {
        if (this.isAttacking) return;

        const playerPed = PlayerPedId();
        if (playerPed !== victim || this.playerService.getState()?.isInGame || this.behavior === PetBehavior.PASSIVE)
            return;
        if (playerPed === attacker || !IsEntityAPed(attacker) || IsPedAnAnimal(attacker) || isFatal) return;

        const player = this.playerService.getPlayer();
        if (!player || player.metadata.isdead) return;

        const pet = this.getCurrentPet();
        if (!pet?.entity || !pet.isPetJob || pet.model !== k9_model || this.currentOrder === PetOrder.SEARCH) return;

        const damageType = GetWeaponDamageType(weaponHash);

        if (![2, 3].includes(damageType)) return;
        if (!this.shouldOrderSucess(pet)) return;
        if (
            IsPedAPlayer(attacker) &&
            !(await emitRpc<boolean>(
                RpcServerEvent.PET_SHOULD_PLAYER_BE_ATTACKED,
                GetPlayerServerId(NetworkGetPlayerIndexFromPed(attacker))
            ))
        )
            return;

        this.currentOrder = null;
        await this.attackTheTarget(pet, attacker);
    }

    @OnEvent(ClientEvent.PLAYER_ON_DEATH)
    public async onDead() {
        await wait(10_000);
        const pet = this.getCurrentPet();
        await this.despawnAnimal(pet);
    }

    // TODO: Factorise
    @OnEvent(ClientEvent.PET_USE_K9_WHISTLE)
    async onUseK9Whistle() {
        if (!this.isOwningPet()) {
            this.notifier.notify("Tu ne possèdes pas d'animal.", 'error');
            return;
        }
        if (this.isUsingWhistle) return;
        this.isUsingWhistle = true;

        const ped = PlayerPedId();
        if (IsPedInAnyVehicle(ped, true)) {
            this.isUsingWhistle = false;
            return;
        }

        const pet = this.getCurrentPet();
        if (pet?.entity && pet?.model !== k9_model) {
            this.notifier.notify(`Tu ne peux pas utiliser ce sifflet avec ${pet.name || `cet animal`}.`, 'error');
            this.isUsingWhistle = false;
            return;
        } else if (pet?.entity) {
            const distance = getDistance(GetEntityCoords(ped) as Vector3, GetEntityCoords(pet.entity) as Vector3);
            if (distance >= PetDistanceForceFollowPlayer) {
                this.notifier.notify(
                    `${pet.name || `Ton animal`} est ~y~trop éloigné~s~ de toi pour entendre le sifflet.`,
                    'info'
                );
                this.isUsingWhistle = false;
                return;
            }
            await this.playWhistleAnimation();
            await this.despawnAnimal(pet);
            this.notifier.notify(`${pet.name || `Ton animal`} est parti ~g~se reposer~s~.`, 'info');
            this.isUsingWhistle = false;
            return;
        }

        if (this.job_pet.dead) {
            this.notifier.notify(
                `${this.job_pet.name || `Ton animal`} est à ~r~bout de force~s~, rend toi au ~b~vétérinaire~s~ au plus vite !`,
                'info'
            );
            this.isUsingWhistle = false;
            return;
        }

        await this.playWhistleAnimation();
        await this.spawnAnimal(this.job_pet);
        this.notifier.notify(`${this.job_pet.name || `Ton animal`} commence à ~g~te suivre~s~.`, 'info');
        this.isUsingWhistle = false;
    }

    @OnEvent(ClientEvent.PET_USE_WHISTLE)
    async onUseWhistle() {
        if (!this.isOwningPet()) {
            this.notifier.notify("Tu ne possèdes pas d'animal.", 'error');
            return;
        }
        if (this.isUsingWhistle) return;
        this.isUsingWhistle = true;

        const ped = PlayerPedId();
        if (IsPedInAnyVehicle(ped, true)) {
            this.isUsingWhistle = false;
            return;
        }

        const pet = this.getCurrentPet();
        if (pet?.entity && pet?.model === k9_model) {
            this.notifier.notify(`Tu ne peux pas utiliser ce sifflet avec ${pet.name || `cet animal`}.`, 'error');
            this.isUsingWhistle = false;
            return;
        } else if (pet?.entity) {
            const distance = getDistance(GetEntityCoords(ped) as Vector3, GetEntityCoords(pet.entity) as Vector3);
            if (distance >= PetDistanceForceFollowPlayer) {
                this.notifier.notify(
                    `${pet.name || `Ton animal`} est ~y~trop éloigné~s~ de toi pour entendre le sifflet.`,
                    'info'
                );
                this.isUsingWhistle = false;
                return;
            }
            await this.playWhistleAnimation();
            await this.despawnAnimal(pet);
            this.notifier.notify(`${pet.name || `Ton animal`} est parti ~g~se reposer~s~.`, 'info');
            this.isUsingWhistle = false;
            return;
        }

        if (this.pet.dead) {
            this.notifier.notify(
                `${this.pet.name || `Ton animal`} est à ~r~bout de force~s~, rend toi au ~b~vétérinaire~s~ au plus vite !`,
                'info'
            );
            this.isUsingWhistle = false;
            return;
        }

        await this.playWhistleAnimation();
        await this.spawnAnimal(this.pet);
        this.notifier.notify(`${this.pet.name || `Ton animal`} commence à ~g~te suivre~s~.`, 'info');
        this.isUsingWhistle = false;
    }

    async spawnAnimal(pet: AnyClientPet) {
        const player = this.playerService.getPlayer();
        if (!player) return;

        const playerPed = PlayerPedId();
        const coords = GetEntityCoords(playerPed);
        const head = GetEntityHeading(playerPed);
        const spawnCoord = GetOffsetFromCoordAndHeadingInWorldCoords(
            coords[0],
            coords[1],
            coords[2],
            GetEntityHeading(playerPed),
            0,
            2,
            0
        );

        await this.resourceLoader.loadModel(pet.model);

        pet.entity = CreatePed(0, pet.model, spawnCoord[0], spawnCoord[1], spawnCoord[2], head + 180, true, true);
        SetEntityInvincible(pet.entity, true);
        SetEntityMaxHealth(pet.entity, 1000);
        SetEntityHealth(pet.entity, 1000);
        SetEntityVisible(pet.entity, false, false);
        FreezeEntityPosition(pet.entity, true);
        PlaceObjectOnGroundProperly_2(pet.entity);
        SetEntityCompletelyDisableCollision(pet.entity, false, true);
        SetEntityCollision(pet.entity, true, true);
        SetRagdollBlockingFlags(pet.entity, 66048);

        if (!IsPedAnAnimal(pet.entity)) {
            await this.despawnAnimal(pet);
            return;
        }

        for (const component of pet.components) {
            SetPedComponentVariation(pet.entity, component.component, component.drawable, component.texture, 0);
        }
        if (pet.isPetJob && JobFixPetVariation?.[player.job.id]?.[pet.model]) {
            for (const component of JobFixPetVariation[player.job.id][pet.model]) {
                SetPedComponentVariation(pet.entity, component.component, component.drawable, component.texture, 0);
            }
        }

        SetEntityVisible(pet.entity, true, false);
        FreezeEntityPosition(pet.entity, false);
        SetEntityAsMissionEntity(pet.entity, true, true);
        SetPedFleeAttributes(pet.entity, 0, false);
        SetPedCombatAttributes(pet.entity, 46, true);
        SetPedRelationshipGroupHash(pet.entity, GetHashKey('PLAYER_PET'));
        SetRelationshipBetweenGroups(5, GetHashKey('PLAYER_PET'), GetHashKey('PLAYER'));
        SetEntityInvincible(pet.entity, false);
        SetPedHearingRange(pet.entity, 0.0);
        SetBlockingOfNonTemporaryEvents(pet.entity, true);

        let networkId = NetworkGetNetworkIdFromEntity(pet.entity);

        if (networkId) {
            SetNetworkIdExistsOnAllMachines(networkId, true);
        }

        let attempts = 0;
        while (!NetworkGetEntityIsNetworked(pet.entity) && attempts < 10) {
            NetworkRegisterEntityAsNetworked(pet.entity);
            networkId = NetworkGetNetworkIdFromEntity(pet.entity);

            if (networkId) {
                SetNetworkIdExistsOnAllMachines(networkId, true);
            }

            attempts += 1;
            await wait(100);
        }

        SetNetworkIdCanMigrate(networkId, false);
        this.currentOrder = PetOrder.FOLLOW;
        this.syncWithUI(pet);
        TriggerServerEvent(ServerEvent.PET_SPAWNED, networkId);
    }

    public petOrderAvailable(pet: AnyClientPet) {
        const orderAvaible: Array<PetOrder> = [];
        Object.values(PetOrder).forEach(order => {
            let canUseOrder = false;
            if (petOrderModelAnimation[order]?.[petBreedToOrderType?.[pet.model]]) {
                if (orderJobRestriction[order] === null) {
                    canUseOrder = true;
                } else {
                    const player = this.playerService.getPlayer();
                    if (orderJobRestriction[order].includes(player.job.id) && player.job.onduty) {
                        canUseOrder = true;
                    }
                }
            }

            if (canUseOrder) orderAvaible.push(order);
        });

        return orderAvaible;
    }

    private async playWhistleAnimation() {
        return await this.animationService.playAnimation(
            {
                base: {
                    dictionary: 'rcmnigel1c',
                    name: 'hailing_whistle_waive_a',
                    options: {
                        enablePlayerControl: true,
                        onlyUpperBody: true,
                    },
                },
            },
            {
                cancellable: false,
            }
        );
    }

    @Tick(TickInterval.EVERY_FRAME * 100)
    async animalStateLoop() {
        const pet = this.getCurrentPet();
        if (!pet?.entity) return;

        if (!DoesEntityExist(pet.entity)) {
            pet.entity = null;
            this.resetAll();
            return;
        }

        if (pet.dead) return;

        if (IsEntityDead(pet.entity)) {
            pet.dead = true;
            this.notifier.notify(
                `${pet.name || `Ton animal`} vient de ~r~perdre connaissance~s~, rend toi au ~b~vétérinaire~s~ au plus vite !`,
                'info'
            );

            await this.setPetDeath(pet, true);
            return;
        }

        if (pet.hunger === 0 || pet.thirst === 0) {
            SetEntityHealth(pet.entity, 0);
            return;
        }

        if (this.noClipProvider.IsNoClipMode()) {
            await this.despawnAnimal(pet);
            return;
        }

        const ped = PlayerPedId();
        const distance = getDistance(GetEntityCoords(ped) as Vector3, GetEntityCoords(pet.entity) as Vector3);

        if (distance > PetDistanceReturnHome) {
            this.notifier.notify(
                `${pet.name || `Ton animal`} était complètement ~r~perdu~s~ et est ~r~parti~s~ se reposer, avec un ~b~air triste~s~. Il risque de ~y~s'enfuir~s~ si tu ne fais pas attention à lui !`,
                'info'
            );
            this.warningDistanceNotif = false;
            await this.despawnAnimal(pet);

            TriggerServerEvent(ServerEvent.PET_AFFECTION_LOSS_DISTANCE, pet.isPetJob);
            return;
        }

        if (distance >= PetDistanceForceFollowPlayer) {
            if (!this.warningDistanceNotif) {
                this.notifier.notify(
                    `${pet.name || `Ton animal`} est ~y~trop éloigné~s~ de toi et commence à te ~b~chercher~s~.`,
                    'info'
                );
            }
            this.currentOrder = PetOrder.FOLLOW;
            this.warningDistanceNotif = true;
        } else {
            this.warningDistanceNotif = false;
        }
    }

    @Tick(TickInterval.EVERY_FRAME * 100)
    async animalOrderLoop() {
        const pet = this.getCurrentPet();
        if (!pet?.entity || !DoesEntityExist(pet.entity) || !IsEntityStatic(pet.entity) || pet.dead) return;

        const ped = PlayerPedId();
        const distance = getDistance(GetEntityCoords(ped) as Vector3, GetEntityCoords(pet.entity) as Vector3);

        if (!this.currentOrder) return;

        if (!this.petOrderAvailable(pet).includes(this.currentOrder)) this.currentOrder = PetOrder.FOLLOW;

        await this.ensurePetInControl(pet);
        if (this.currentOrder === PetOrder.FOLLOW) {
            if (IsPedInAnyVehicle(ped, false) && !IsPedInAnyVehicle(pet.entity, false)) {
                const animation = petOrderSitInCarAnimation[petBreedToOrderType?.[pet.model]];
                const veh = GetVehiclePedIsIn(ped, false);
                if (animation && AreAnyVehicleSeatsFree(veh)) {
                    const maxSeats = GetVehicleMaxNumberOfPassengers(veh);
                    const seats = [];
                    for (let i = maxSeats - 1; i >= 0; i--) {
                        if (IsVehicleSeatFree(veh, i) && i !== -1) seats.push(i);
                    }

                    if (seats.length) {
                        const seat = seats[Math.floor(Math.random() * seats.length)];
                        TaskEnterVehicle(pet.entity, veh, -1, seat, 2.0, 1.0, 0);
                        let isCanceled = false;
                        await waitUntil(async () => {
                            if (GetScriptTaskStatus(pet.entity, 'SCRIPT_TASK_ENTER_VEHICLE') === 7) return true;
                            const distance = getDistance(
                                GetEntityCoords(ped) as Vector3,
                                GetEntityCoords(pet.entity) as Vector3
                            );

                            isCanceled =
                                distance > PetDistanceReturnHome ||
                                (!IsVehicleSeatFree(veh, seat) && GetPedInVehicleSeat(veh, seat) !== pet.entity);
                            if (!isCanceled) await wait(100);
                            return isCanceled;
                        });

                        if (!isCanceled && IsPedInAnyVehicle(pet.entity, false)) {
                            await this.startAnimationSync(pet, animation, 10);
                        }
                    }
                } else {
                    if (
                        this.forceOrder ||
                        !IsEntityStatic(veh) ||
                        distance > PetDistanceFollow + PetDistanceOrderVehicleDeltaTrigger
                    ) {
                        await this.taskGoToEntity(pet, veh, PetDistanceFollow, 180.0);
                    }
                }
            } else if (!IsPedInAnyVehicle(ped, false) && IsPedInAnyVehicle(pet.entity, false)) {
                const veh = GetVehiclePedIsIn(pet.entity, false);
                SetEntityInvincible(pet.entity, true);
                SetEntityCanBeDamaged(pet.entity, false);
                await wait(0);
                await waitUntil(async () => !GetEntityCanBeDamaged(pet.entity));

                TaskLeaveVehicle(pet.entity, veh, 1.0);
                await waitUntil(async () => {
                    if (GetScriptTaskStatus(pet.entity, 'SCRIPT_TASK_LEAVE_VEHICLE') === 7) return true;
                    const distance = getDistance(
                        GetEntityCoords(ped) as Vector3,
                        GetEntityCoords(pet.entity) as Vector3
                    );

                    return distance > PetDistanceReturnHome;
                });
                await wait(2_000);
                await waitUntil(async () => !IsPedRagdoll(pet.entity));
                await wait(0);

                SetEntityInvincible(pet.entity, false);
                SetEntityCanBeDamaged(pet.entity, true);
            } else if (
                !IsPedInAnyVehicle(ped, false) &&
                (this.forceOrder ||
                    !IsEntityStatic(ped) ||
                    distance > PetDistanceFollow + PetDistanceOrderPedDeltaTrigger)
            ) {
                await this.taskGoToEntity(pet, ped, PetDistanceFollow, 45.0);
            }
        } else if (this.currentOrder === PetOrder.STOP) {
            this.currentOrder = null;
        } else if (this.currentOrder === PetOrder.SIT) {
            await this.startAnimationSyncForOrder(pet, PetOrder.SIT);
            this.currentOrder = null;
        } else if (this.currentOrder === PetOrder.LAY_DOWN) {
            await this.startAnimationSyncForOrder(pet, PetOrder.LAY_DOWN);
            this.currentOrder = null;
        } else if (this.currentOrder === PetOrder.PET) {
            await this.petTheAnimalOrder(pet);
            this.currentOrder = PetOrder.FOLLOW;
        } else if (this.currentOrder === PetOrder.CATCH) {
            await this.catchTheBall(pet);
            this.currentOrder = null;
        } else if (this.currentOrder === PetOrder.TRICK) {
            await this.startAnimationSyncForOrder(pet, PetOrder.TRICK);
            this.currentOrder = null;
        } else if (this.currentOrder === PetOrder.SEARCH) {
            const ped = PlayerPedId();
            const allEntities = [...GetGamePool('CPed'), ...GetGamePool('CVehicle')];
            const filteredEntities = allEntities
                .filter(
                    entity =>
                        entity !== ped &&
                        (GetEntityType(entity) === 2 ||
                            (GetEntityType(entity) === 1 && !IsPedAnAnimal(entity) && GetEntityCanBeDamaged(entity))) &&
                        getDistance(GetEntityCoords(ped) as Vector3, GetEntityCoords(entity) as Vector3) <=
                            PetDistanceSearch
                )
                .sort(
                    (a, b) =>
                        getDistance(GetEntityCoords(ped) as Vector3, GetEntityCoords(a) as Vector3) -
                        getDistance(GetEntityCoords(ped) as Vector3, GetEntityCoords(b) as Vector3)
                );
            for (const entity of filteredEntities) {
                if (this.currentOrder !== PetOrder.SEARCH) break;
                if (
                    getDistance(GetEntityCoords(ped) as Vector3, GetEntityCoords(entity) as Vector3) > PetDistanceSearch
                )
                    continue;

                const entityType = GetEntityType(entity);
                if (entityType === 2) {
                    await this.searchOnVeh(pet, entity);
                } else if (entityType === 1) {
                    await this.searchOnPed(pet, entity);
                }
                await waitUntil(async () => GetScriptTaskStatus(pet.entity, 'SCRIPT_TASK_PLAY_ANIM') === 7);
            }

            this.currentOrder = PetOrder.FOLLOW;
        }

        this.forceOrder = false;
    }

    private async ensurePetInControl(pet: AnyClientPet) {
        if (!NetworkHasControlOfEntity(pet.entity)) {
            NetworkRequestControlOfEntity(pet.entity);
            for (let i = 0; i < 20; i++) {
                if (NetworkHasControlOfEntity(pet.entity)) {
                    break;
                }
                await wait(50);
            }
        }
    }

    private async petTheAnimalOrder(pet: AnyClientPet) {
        const ped = PlayerPedId();
        const cancelled = await this.taskGoToEntity(pet, ped, 0.1, 0.0);
        if (cancelled) return;

        const dictionary = 'creatures@rottweiler@tricks@';
        await this.resourceLoader.loadAnimationDictionary(dictionary);

        const orderAnimation: { dictionary: string; name: string } =
            petOrderModelAnimation[PetOrder.PET][petBreedToOrderType?.[pet.model]]?.[0];

        const flag = PetOrderAnimationFlag[PetOrder.PET];

        if (orderAnimation.dictionary === dictionary && orderAnimation.name === 'petting_chop') {
            const coords = GetOffsetFromEntityInWorldCoords(ped, 0, 1.3, -1.0) as Vector3;
            const scene = NetworkCreateSynchronisedScene(
                coords[0],
                coords[1],
                coords[2],
                0,
                0,
                GetEntityHeading(ped),
                2,
                false,
                false,
                1.0,
                0.0,
                1.0
            );
            NetworkAddPedToSynchronisedScene(ped, scene, dictionary, 'petting_franklin', 10.0, 10.0, flag, 0, 0, 0);
            NetworkAddPedToSynchronisedScene(
                pet.entity,
                scene,
                orderAnimation.dictionary,
                orderAnimation.name,
                10.0,
                10.0,
                flag,
                0,
                0,
                0
            );
            NetworkStartSynchronisedScene(scene);

            let localScene = -1;
            while (localScene < 0) {
                await wait(0);
                localScene = NetworkGetLocalSceneFromNetworkId(scene);
            }

            while (IsSynchronizedSceneRunning(localScene)) {
                await wait(0);
            }
        } else {
            await this.resourceLoader.loadAnimationDictionary(orderAnimation.dictionary);
            TaskPlayAnim(
                pet.entity,
                orderAnimation.dictionary,
                orderAnimation.name,
                8.0,
                8.0,
                -1,
                1,
                0.0,
                false,
                false,
                false
            );

            await this.startAnimationSyncForOrder(pet, PetOrder.PET);
            await this.animationService.playAnimation(
                {
                    base: {
                        dictionary: dictionary,
                        name: 'petting_franklin',
                        options: {
                            onlyUpperBody: true,
                        },
                    },
                },
                {
                    cancellable: false,
                }
            );
            this.resourceLoader.unloadAnimationDictionary(orderAnimation.dictionary);
        }

        this.resourceLoader.unloadAnimationDictionary(dictionary);
        TriggerServerEvent(ServerEvent.PET_AFFECTION_GAIN_PET, pet.isPetJob);
        this.currentOrder = PetOrder.FOLLOW;
    }

    private async searchOnPed(pet: AnyClientPet, ped: number) {
        await this.ensurePetInControl(pet);

        ClearPedTasksImmediately(pet.entity);
        const cancelled = await this.taskGoToEntity(pet, ped, PetDistanceSearchOnTargetPed, 0);
        if (cancelled) return;

        if (IsPedAPlayer(ped)) {
            const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(ped));
            if (await emitRpc<boolean>(RpcServerEvent.POLICE_K9_FIND_DRUG_ON_PLAYER, target)) {
                await this.startAnimationSyncForOrder(pet, PetOrder.SEARCH);

                this.notifier.notify(
                    `${pet.name || `Ton animal`} a ~b~marqué~s~ la personne ! Des drogues ont été trouvés sur elle.`,
                    'info'
                );
                return;
            }
        }

        this.notifier.notify("~g~Aucune~s~ trace de drogue n'a été trouvée sur cette ~y~personne~s~.", 'info');
    }

    private async searchOnVeh(pet: AnyClientPet, veh: number) {
        const target = NetworkGetNetworkIdFromEntity(veh);
        await this.ensurePetInControl(pet);

        const cancelled = await this.taskGoToEntity(pet, veh, PetDistanceSearchOnTargetVehicle, 180);
        if (cancelled) return;

        if (await emitRpc<boolean>(RpcServerEvent.POLICE_K9_FIND_DRUG_ON_CAR, target)) {
            await this.startAnimationSyncForOrder(pet, PetOrder.SEARCH);

            this.notifier.notify(
                `${pet.name || `Ton animal`} a ~b~marqué~s~ le vehicule ! Des traces de drogues ont été trouvés dans son coffre.`,
                'info'
            );
            return;
        }

        this.notifier.notify("~g~Aucune~s~ trace de drogue n'a été trouvée dans cette ~y~voiture~s~.", 'info');
    }

    private async attackExcecutionOrder(entity: number) {
        const pet = this.getCurrentPet();
        const previousOrder = this.currentOrder;

        await this.ensurePetInControl(pet);

        this.currentOrder = null;
        const ped = PlayerPedId();
        const distance = getDistance(GetEntityCoords(ped) as Vector3, GetEntityCoords(pet.entity) as Vector3);
        if (distance >= PetDistanceForceFollowPlayer) {
            this.notifier.notify(`${pet.name || `Ton animal`} est ~b~trop loin~s~ pour entendre ton ordre.`, 'info');
            this.currentOrder = previousOrder;
            return;
        }

        this.animationService.playAnimation(
            {
                base: {
                    dictionary: 'gestures@f@standing@casual',
                    name: 'gesture_point',
                    options: {
                        enablePlayerControl: true,
                        onlyUpperBody: true,
                    },
                },
            },
            {
                cancellable: false,
            }
        );

        const successOrder = this.shouldOrderSucess(pet);
        TriggerServerEvent(ServerEvent.PET_EXECUTED_ORDER, successOrder, pet.isPetJob);

        if (!successOrder) {
            this.notifier.notify(
                `${pet.name || `Ton animal`} te regarde ~y~sans comprendre~s~ ce que tu lui demandes ! Malheureusement, il va falloir le ~b~dresser~s~ petit à petit.`,
                'info'
            );
            this.currentOrder = previousOrder;
            return;
        }

        await this.attackTheTarget(pet, entity);
    }

    private shouldOrderSucess(pet: AnyClientPet): boolean {
        return Math.random() <= Math.max(pet.training / 100, PetTrainingMinimalExecOrderChance);
    }

    private async attackTheTarget(pet: AnyClientPet, entity: number) {
        if (this.isAttacking) return;
        this.isAttacking = true;

        const dictionary = 'creatures@rottweiler@melee@streamed_core@';
        await this.resourceLoader.loadAnimationDictionary(dictionary);

        this.notifier.notify(`${pet.name || `Ton animal`} ~b~s'élance~s~ sur la cible et ~b~l'attaque~s~ !`, 'info');
        TaskGoToEntity(pet.entity, entity, -1, 0.0, 100, 100, 0);

        let success = false;
        await waitUntil(async () => {
            const targetCoords = GetEntityCoords(entity) as Vector3;
            const petCoord = GetEntityCoords(pet.entity) as Vector3;
            const distanceTarget = getDistance([targetCoords[0], targetCoords[1]], [petCoord[0], petCoord[1]]);
            const distanceOwner = getDistance(GetEntityCoords(PlayerPedId()) as Vector3, petCoord);
            success = distanceTarget <= PetDistanceAttackOnTarget;
            return success || distanceOwner >= PetDistanceForceFollowPlayer || this.currentOrder !== null;
        });

        ClearPedTasks(pet.entity);
        if (success) {
            TaskPlayAnim(pet.entity, dictionary, 'attack', 1.0, 1.0, -1, 8, 0.0, true, true, true);

            if (IsPedAPlayer(entity)) {
                const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                TriggerServerEvent(ServerEvent.POLICE_TAKE_DOWN, target);
            } else {
                SetPedToRagdoll(entity, 10000, 10000, 0, false, false, false);
            }
        }

        this.resourceLoader.unloadAnimationDictionary(dictionary);
        this.currentOrder = PetOrder.FOLLOW;
        this.isAttacking = false;
    }

    private async catchTheBall(pet: AnyClientPet) {
        if (!this.ballEntityNetId) return;

        const entity = NetworkGetEntityFromNetworkId(this.ballEntityNetId);
        TaskGoToEntity(pet.entity, entity, -1, 0.25, 100, 100, 0);
        await waitUntil(async () => {
            const targetCoords = GetEntityCoords(entity) as Vector3;
            const petCoord = GetEntityCoords(pet.entity) as Vector3;
            return (
                getDistance([targetCoords[0], targetCoords[1]], [petCoord[0], petCoord[1]]) <= PetDistanceCatchTheBall
            );
        });

        AttachEntityToEntity(entity, pet.entity, 0, 0, 0, 0, 0, 0, 0, true, true, false, true, 1, true);
        await this.taskGoToEntity(pet, PlayerPedId(), PetDistanceFollow, 0);
        DetachEntity(entity, true, true);

        const forwardVector = GetEntityForwardVector(pet.entity);
        ApplyForceToEntity(
            entity,
            1,
            forwardVector[0],
            forwardVector[1] + 1.0,
            forwardVector[2],
            0,
            0,
            0,
            0,
            false,
            true,
            true,
            false,
            true
        );
    }

    private async stopAnimationSync(pet: AnyClientPet) {
        await this.ensurePetInControl(pet);
        ClearPedTasks(pet.entity);
        await wait(0);
    }

    private async startAnimationSyncForOrder(pet: AnyClientPet, order: PetOrder) {
        const animationPossibility: Array<{ dictionary: string; name: string }> =
            petOrderModelAnimation[order][petBreedToOrderType?.[pet.model]];
        const flag = PetOrderAnimationFlag[order];

        let animation: { dictionary: string; name: string };
        if (animationPossibility.length === 1) {
            animation = animationPossibility[0];
        } else {
            animation = animationPossibility[Math.floor(Math.random() * animationPossibility.length)];
        }

        await this.startAnimationSync(pet, animation, flag);
    }

    private async startAnimationSync(pet: AnyClientPet, animation: { dictionary: string; name: string }, flag: number) {
        await this.resourceLoader.loadAnimationDictionary(animation.dictionary);
        TaskPlayAnim(pet.entity, animation.dictionary, animation.name, 8.0, 8.0, -1, flag, 0.0, false, false, false);
        this.resourceLoader.unloadAnimationDictionary(animation.dictionary);
    }

    private getRandomPosNegAngle(angle: number): number {
        return Math.random() < 0.5 ? -angle : angle;
    }

    private async taskGoToEntity(
        pet: AnyClientPet,
        entity: number,
        distance: number,
        angle: number,
        forceHeading: boolean = false
    ): Promise<boolean> {
        const ped = PlayerPedId();
        TaskGotoEntityOffset(pet.entity, entity, -1, distance, this.getRandomPosNegAngle(angle), 100, 1);
        let isCanceled = false;
        await waitUntil(async () => {
            if (GetScriptTaskStatus(pet.entity, 'SCRIPT_TASK_GOTO_ENTITY_OFFSET') === 7) return true;
            const distance = getDistance(GetEntityCoords(ped) as Vector3, GetEntityCoords(pet.entity) as Vector3);

            isCanceled =
                distance > PetDistanceReturnHome ||
                (this.currentOrder === PetOrder.FOLLOW && IsPedInAnyVehicle(ped, false));

            if (!isCanceled) await wait(100);
            return isCanceled;
        });
        if (forceHeading && !isCanceled) {
            TaskAchieveHeading(pet.entity, GetEntityHeading(entity), 2500);
            await waitUntil(async () => GetScriptTaskStatus(pet.entity, 'SCRIPT_TASK_ACHIEVE_HEADING') === 7);
        }
        return isCanceled;
    }

    private getMaxEnergyForPet(pet: AnyClientPet): number {
        return GetMaxEnergyForPet(pet);
    }

    private async setPetDeath(pet: AnyClientPet, death: boolean) {
        if (!pet) return;

        TriggerServerEvent(ServerEvent.PET_SET_DEATH, death, pet.isPetJob);
    }

    async despawnAnimal(pet: AnyClientPet) {
        if (!pet?.entity) return;
        await this.ensurePetInControl(pet);

        const model = GetEntityModel(pet.entity);

        DeleteEntity(pet.entity);
        this.resourceLoader.unloadModel(model);
        pet.entity = null;
        this.resetAll();

        TriggerServerEvent(ServerEvent.PET_DESPAWNED);
        return;
    }

    public isOwningPet(): boolean {
        return Boolean(this.pet || this.job_pet);
    }

    public getCurrentPet(): AnyClientPet {
        if (this.pet?.entity) return this.pet;
        if (this.job_pet?.entity) return this.job_pet;
        return null;
    }

    public isNamed(pet: AnyClientPet): boolean {
        return Boolean(pet.name);
    }

    public isDead(): boolean {
        return Boolean(this.pet?.dead);
    }

    public isJobDead(): boolean {
        return Boolean(this.job_pet?.dead);
    }

    public getPetEntity(): number | null {
        const pet = this.getCurrentPet();
        return pet?.entity;
    }

    public usePetFood(inventoryItem: InventoryItem) {
        const pet = this.getCurrentPet();
        if (
            getDistance(GetEntityCoords(PlayerPedId()) as Vector3, GetEntityCoords(pet.entity) as Vector3) >
            PetDistanceUseFood
        ) {
            this.notifier.notify(`${pet.name || `Ton animal`} est ~b~trop loin~s~ pour être nourris.`, 'info');
            return;
        }

        TriggerServerEvent(ServerEvent.PET_USE_FOOD, inventoryItem, pet.isPetJob);
    }

    @OnNuiEvent(NuiEvent.PetDisplayState)
    public async onPetDisplayState() {
        const pet = this.getCurrentPet();
        if (!pet) return;
        this.notifier.notify(
            `~h~État de ${pet.name || `ton animal`}~/h~~n~
            ~b~Personnalité~s~ : ~g~${positiveTraitLabel[pet.trait_up]}~s~ - ~y~${negativeTraitLabel[pet.trait_down]}~s~~n~
            ~b~Affection~s~ : ${getAffectionLabel(pet.affection)} (${pet.affection.toFixed(2)})~n~
            ~b~Entrainement~s~ : ${getTrainingLabel(pet.training)} (${pet.training.toFixed(2)})`,
            'info',
            7500
        );
    }

    @OnNuiEvent(NuiEvent.PetAnimalOrder)
    public async onPetAnimalOrder(order: PetOrder) {
        const pet = this.getCurrentPet();
        if (!pet?.entity) return;
        if (!this.petOrderAvailable(pet).includes(order) || order == this.currentOrder) return;

        const ped = PlayerPedId();
        const distance = getDistance(GetEntityCoords(ped) as Vector3, GetEntityCoords(pet.entity) as Vector3);
        if (distance >= PetDistanceForceFollowPlayer) {
            this.notifier.notify(`${pet.name || `Ton animal`} est ~b~trop loin~s~ pour entendre ton ordre.`, 'info');
            return;
        }

        if (order !== PetOrder.CATCH || this.ballEntityNetId) {
            this.animationService.playAnimation(
                {
                    base: {
                        dictionary: 'gestures@f@standing@casual',
                        name: 'gesture_point',
                        options: {
                            enablePlayerControl: true,
                            onlyUpperBody: true,
                        },
                    },
                },
                {
                    cancellable: false,
                }
            );
        } else {
            if (!(await emitRpc<boolean>(RpcServerEvent.PET_CONSUME_BALL))) {
                this.notifier.notify("Tu n'as pas de balle à lancer !", 'error');
                return;
            }
            await this.throwBall();
        }

        if (pet.energy <= 0 && order !== PetOrder.FOLLOW) {
            this.notifier.notify(`${pet.name || `Ton animal`} est ~b~trop épuisé~s~ pour réaliser ton ordre.`, 'info');
            return;
        }

        let success: boolean;
        if (order === PetOrder.FOLLOW) {
            success = true;
        } else {
            success = this.shouldOrderSucess(pet);
            TriggerServerEvent(ServerEvent.PET_EXECUTED_ORDER, success, pet.isPetJob);
        }

        if (!success) {
            this.notifier.notify(
                `${pet.name || `Ton animal`} te regarde ~y~sans comprendre~s~ ce que tu lui demandes ! Malheureusement, il va falloir le ~b~dresser~s~ petit à petit.`,
                'info'
            );
        } else {
            this.notifier.notify(
                `${pet.name || `Ton animal`} exécute l'ordre ~g~${petOrderMeta[order].label}~s~ !`,
                'info'
            );
            await this.execOrder(pet, order);
        }
    }

    private async throwBall() {
        await this.resourceLoader.loadModel(TENNIS_BALL_MODEL);
        const ped = PlayerPedId();
        const [x, y, z] = GetOffsetFromEntityInWorldCoords(ped, 0.0, 1.0, -1.0);

        const entity = CreateObjectNoOffset(TENNIS_BALL_MODEL, x, y, z, true, false, false);
        AttachEntityToEntity(
            entity,
            ped,
            GetPedBoneIndex(PlayerPedId(), 57005),
            0.15,
            0,
            0,
            0,
            270.0,
            60.0,
            true,
            true,
            false,
            true,
            1,
            true
        );

        const forwardVector = GetEntityForwardVector(ped);
        const force = 50.0;
        const animDict = 'melee@unarmed@streamed_variations';
        const anim = 'plyr_takedown_front_slap';
        ClearPedTasks(ped);

        await this.resourceLoader.loadAnimationDictionary(animDict);
        TaskPlayAnim(PlayerPedId(), animDict, anim, 8.0, -8.0, -1, 0, 0.0, false, false, false);
        await wait(500);

        DetachEntity(entity, true, true);
        ApplyForceToEntity(
            entity,
            1,
            forwardVector[0] * force,
            forwardVector[1] * force + 5.0,
            forwardVector[2],
            0,
            0,
            0,
            0,
            false,
            true,
            true,
            false,
            true
        );

        const entityNetId = ObjToNet(entity);
        SetNetworkIdExistsOnAllMachines(entityNetId, true);

        this.ballEntityNetId = entityNetId;
        await wait(300);

        this.resourceLoader.unloadAnimationDictionary(animDict);
        this.resourceLoader.unloadModel(TENNIS_BALL_MODEL);
    }

    private async execOrder(pet: AnyClientPet, order: PetOrder) {
        await this.stopAnimationSync(pet);

        this.currentOrder = order;
        this.forceOrder = true;
    }

    @OnNuiEvent(NuiEvent.AdminSetPlayerPetSeath)
    public async onAdminSetPlayerPetDeath({ citizenId, value }: { citizenId: string; value: boolean }) {
        TriggerServerEvent(ServerEvent.PET_ADMIN_SET_DEATH, citizenId, value);
    }

    @OnNuiEvent(NuiEvent.AdminSetPlayerPetMeta)
    public async onAdminSetPlayerPetMeta({ citizenId, meta }: { citizenId: string; meta: IncrementalPetData }) {
        if (!increamentalPetMeta.has(meta)) return;

        const value = await this.inputService.askInput<number>(
            {
                title: `${PetMetaLabel[meta]}`,
                defaultValue: '',
            },
            PositiveNumberValidator
        );

        if (value === null) {
            return;
        }

        TriggerServerEvent(ServerEvent.PET_ADMIN_SET_DATA, citizenId, { [meta]: value });
    }

    @OnNuiEvent(NuiEvent.AdminSetPlayerPetResetMeta)
    public async onAdminSetPlayerPetResetMeta({
        citizenId,
        resetMeta,
    }: {
        citizenId: string;
        resetMeta: IncrementalPetResetMetadataType;
    }) {
        if (!incrementalPetResetMetadata.has(resetMeta)) return;

        const value = await this.inputService.askInput<number>(
            {
                title: `${PetResetMetaLabel[resetMeta].label}`,
                defaultValue: '',
            },
            PositiveNumberValidator
        );

        if (value === null) {
            return;
        }

        TriggerServerEvent(ServerEvent.PET_ADMIN_SET_PER_DAYS, citizenId, { [resetMeta]: value });
    }

    @OnNuiEvent(NuiEvent.AdminResetPlayerPetResetMeta)
    public async onResetPerDays(citizenId: string) {
        TriggerServerEvent(ServerEvent.PET_ADMIN_RESET_PER_DAYS, citizenId);
    }

    @OnNuiEvent(NuiEvent.AdminSetJobPetSeath)
    public async onAdminSetJobPetDeath({ id, value }: { id: number; value: boolean }) {
        TriggerServerEvent(ServerEvent.PET_ADMIN_JOB_SET_DEATH, id, value);
    }

    @OnNuiEvent(NuiEvent.AdminSetJobPetMeta)
    public async onAdminSetJobPetMeta({ id, meta }: { id: number; meta: IncrementalPetData }) {
        if (!increamentalPetMeta.has(meta)) return;

        const value = await this.inputService.askInput<number>(
            {
                title: `${PetMetaLabel[meta]}`,
                defaultValue: '',
            },
            PositiveNumberValidator
        );

        if (value === null) {
            return;
        }

        TriggerServerEvent(ServerEvent.PET_ADMIN_JOB_SET_DATA, id, { [meta]: value });
    }

    @OnNuiEvent(NuiEvent.AdminSetJobPetResetMeta)
    public async onAdminSetJobPetResetMeta({
        id,
        resetMeta,
    }: {
        id: number;
        resetMeta: IncrementalPetResetMetadataType;
    }) {
        if (!incrementalPetResetMetadata.has(resetMeta)) return;

        const value = await this.inputService.askInput<number>(
            {
                title: `${PetResetMetaLabel[resetMeta].label}`,
                defaultValue: '',
            },
            PositiveNumberValidator
        );

        if (value === null) {
            return;
        }

        TriggerServerEvent(ServerEvent.PET_ADMIN_JOB_SET_PER_DAYS, id, { [resetMeta]: value });
    }

    @OnNuiEvent(NuiEvent.AdminResetJobPetResetMeta)
    public async onResetJobPerDays(id: number) {
        TriggerServerEvent(ServerEvent.PET_ADMIN_JOB_RESET_PER_DAYS, id);
    }
}
