import { AnimationService } from '@public/client/animation/animation.service';
import { Notifier } from '@public/client/notifier';
import { InputService } from '@public/client/nui/input.service';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { PlayerService } from '@public/client/player/player.service';
import { ResourceLoader } from '@public/client/repository/resource.loader';
import { TargetFactory } from '@public/client/target/target.factory';
import { NoClipProvider } from '@public/client/utils/noclip.provider';
import { Command } from '@public/core/decorators/command';
import { Once, OnceStep, OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { wait, waitUntil } from '@public/core/utils';
import {
    ClientPet,
    getAffectionLabel,
    GetMaxEnergyForPet,
    getTrainingLabel,
    increamentalPetMeta,
    IncrementalPetData,
    incrementalPetResetMetadata,
    IncrementalPetResetMetadataType,
    negativeTraitLabel,
    orderJobRestriction,
    petBreedToOrderType,
    // PetDistanceAttackOnTarget,
    PetDistanceCatchTheBall,
    PetDistanceFollow,
    PetDistanceForceFollowPlayer,
    PetDistanceOrderPedDeltaTrigger,
    // PetDistanceOrderTargetDistance,
    PetDistanceOrderVehicleDeltaTrigger,
    PetDistanceReturnHome,
    // PetDistanceSearch,
    // PetDistanceSearchOnTargetPed,
    // PetDistanceSearchOnTargetVehicle,
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
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { InventoryItem } from '@public/shared/inventory';
// import { FDO, JobType } from '@public/shared/job';
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

    private pet: ClientPet;
    private currentOrder: PetOrder;
    private forceOrder: boolean;
    private isUsingWhistle: boolean = false;
    private warningDistanceNotif: boolean = false;
    private ready: boolean = false;
    private ballEntityNetId: number;
    private energyNotif: boolean = true;

    @OnEvent(ClientEvent.ADMIN_SWITCH_CHARACTER)
    public async onCharacterSwitch() {
        if (this.pet?.entity) {
            await this.despawnAnimal();
        }

        this.currentOrder = null;
        this.forceOrder = null;
        this.isUsingWhistle = false;
        this.warningDistanceNotif = false;
        this.ready = false;

        await this.onSyncAnimal(true);
    }

    @OnEvent(ClientEvent.PET_SYNC_ANIMAL)
    public async onSyncAnimal(force: boolean = false) {
        const pet = await emitRpc<ClientPet | null>(RpcServerEvent.PET_GET_ANIMAL, force);

        if (this.pet && (!pet || pet.dead) && this.pet.entity) {
            await this.despawnAnimal();
        }

        if (!pet) {
            this.pet = null;
            this.currentOrder = null;
            this.forceOrder = null;
            this.isUsingWhistle = false;
            this.warningDistanceNotif = false;
            this.ready = false;
            this.syncWithUI();
            return;
        }

        this.pet = this.pet
            ? {
                  ...this.pet,
                  ...pet,
              }
            : pet;

        this.syncWithUI();
        const maxEnergy = this.getMaxEnergyForPet();
        if (this.pet.energy > maxEnergy / 2 && this.energyNotif) {
            this.energyNotif = false;
        } else if (this.pet.energy <= maxEnergy / 2 && !this.energyNotif) {
            this.energyNotif = true;
            this.notifier.notify(
                "Ton animal commence à ~r~s'épuiser~s~, tu ne pourras bientôt plus lui donner d'ordre.",
                'info'
            );
        }
    }

    private petAsPetStats(): PetStats {
        if (!this.pet) return null;

        return {
            dead: this.pet.dead,
            hunger: this.pet.hunger,
            thirst: this.pet.thirst,
            energy: this.pet.energy,
            maxEnergy: this.getMaxEnergyForPet(),
            spawned: Boolean(this.pet?.entity),
        };
    }

    private syncWithUI() {
        const petAsStats = this.petAsPetStats();
        this.nuiDispatch.dispatch('pet_manager', 'Update', petAsStats);
    }

    @Once(OnceStep.PlayerLoaded)
    public async loadTarget() {
        await this.onSyncAnimal(true);

        // this.targetFactory.createForAllPed(
        //     [
        //         {
        //             label: 'Recherche de drogue',
        //             icon: 'police/screening',
        //             job: FDO.reduce((prev, cur) => ({ ...prev, [cur]: 0 }), {} as Record<JobType, number>),
        //             category: 'society',
        //             canInteract: entity =>
        //                 this.currentOrder === PetOrder.SEARCH &&
        //                 this.ready &&
        //                 GetEntityCanBeDamaged(entity) &&
        //                 !IsPedAnAnimal(entity),
        //             action: async (entity: number) => {
        //                 this.currentOrder = null;
        //                 this.ready = false;
        //                 await this.ensurePetInControl();

        //                 ClearPedTasksImmediately(this.pet.entity);
        //                 const cancelled = await this.taskGoToEntity(entity, PetDistanceSearchOnTargetPed, 0);
        //                 if (cancelled) return;

        //                 if (IsPedAPlayer(entity)) {
        //                     const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
        //                     if (await emitRpc<boolean>(RpcServerEvent.POLICE_K9_FIND_DRUG_ON_PLAYER, target)) {
        //                         await this.startAnimationSyncForOrder(PetOrder.SEARCH);

        //                         this.notifier.notify(
        //                             'Ton animal a ~b~marqué~s~ la personne ! Des drogues ont été trouvés sur elle.',
        //                             'info'
        //                         );
        //                         return;
        //                     }
        //                 }

        //                 this.notifier.notify(
        //                     "~g~Aucune~s~ trace de drogue n'a été trouvée sur cette ~y~personne~s~.",
        //                     'info'
        //                 );
        //             },
        //         },
        //         {
        //             label: 'Attaque',
        //             icon: 'crimi/toxic_flesh',
        //             job: FDO.reduce((prev, cur) => ({ ...prev, [cur]: 0 }), {} as Record<JobType, number>),
        //             category: 'society',
        //             canInteract: entity =>
        //                 this.currentOrder === PetOrder.ATTACK &&
        //                 this.ready &&
        //                 GetEntityCanBeDamaged(entity) &&
        //                 !IsPedAnAnimal(entity),
        //             action: async (entity: number) => {
        //                 this.currentOrder = null;
        //                 this.ready = false;
        //                 await this.ensurePetInControl();

        //                 const dictionary = 'creatures@rottweiler@melee@streamed_core@';
        //                 await this.resourceLoader.loadAnimationDictionary(dictionary);
        //                 await this.ensurePetInControl();

        //                 this.notifier.notify("Ton animal ~b~s'élance~s~ sur la cible et ~b~l'attaque~s~ !", 'info');
        //                 TaskGoToEntity(this.pet.entity, entity, -1, 0.0, 100, 100, 0);

        //                 let success = false;
        //                 await waitUntil(async () => {
        //                     const targetCoords = GetEntityCoords(entity) as Vector3;
        //                     const petCoord = GetEntityCoords(this.pet.entity) as Vector3;
        //                     const distanceTarget = getDistance(
        //                         [targetCoords[0], targetCoords[1]],
        //                         [petCoord[0], petCoord[1]]
        //                     );
        //                     const distanceOwner = getDistance(GetEntityCoords(PlayerPedId()) as Vector3, petCoord);
        //                     success = distanceTarget <= PetDistanceAttackOnTarget;
        //                     return (
        //                         success || distanceOwner >= PetDistanceForceFollowPlayer || this.currentOrder !== null
        //                     );
        //                 });

        //                 ClearPedTasks(this.pet.entity);
        //                 if (success) {
        //                     TaskPlayAnim(this.pet.entity, dictionary, 'attack', 1.0, 1.0, -1, 8, 0.0, true, true, true);

        //                     if (IsPedAPlayer(entity)) {
        //                         const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
        //                         TriggerServerEvent(ServerEvent.POLICE_TAKE_DOWN, target);
        //                     } else {
        //                         SetPedToRagdoll(entity, 10000, 10000, 0, false, false, false);
        //                     }
        //                 }
        //                 this.resourceLoader.unloadAnimationDictionary(dictionary);
        //             },
        //         },
        //     ],
        //     PetDistanceOrderTargetDistance
        // );
        // this.targetFactory.createForAllVehicle(
        //     [
        //         {
        //             label: 'Recherche de drogue',
        //             icon: 'police/screening',
        //             job: FDO.reduce((prev, cur) => ({ ...prev, [cur]: 0 }), {} as Record<JobType, number>),
        //             category: 'society',
        //             canInteract: () => this.currentOrder === PetOrder.SEARCH && this.ready,
        //             action: async (entity: number) => {
        //                 const target = NetworkGetNetworkIdFromEntity(entity);
        //                 this.currentOrder = null;
        //                 this.ready = false;
        //                 await this.ensurePetInControl();

        //                 const cancelled = await this.taskGoToEntity(entity, PetDistanceSearchOnTargetVehicle, 180);
        //                 if (cancelled) return;

        //                 if (await emitRpc<boolean>(RpcServerEvent.POLICE_K9_FIND_DRUG_ON_CAR, target)) {
        //                     await this.startAnimationSyncForOrder(PetOrder.SEARCH);

        //                     this.notifier.notify(
        //                         'Ton animal a ~b~marqué~s~ le vehicule ! Des drogues ont été trouvés dans son coffre.',
        //                         'info'
        //                     );
        //                     return;
        //                 }

        //                 this.notifier.notify(
        //                     "~g~Aucune~s~ trace de drogue n'a été trouvée dans cette ~y~voiture~s~.",
        //                     'info'
        //                 );
        //             },
        //         },
        //     ],
        //     PetDistanceOrderTargetDistance
        // );

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
                    icon: 'crimi/grab',
                    category: 'citizen',
                    canInteract: entity => {
                        return this.pet?.entity !== entity;
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
            this.notifier.notify("Vous ne possédez pas d'animal.", 'error');
            return;
        }
        if (!this.pet.entity) {
            this.notifier.notify('Votre animal se repose.', 'info');
            return;
        }
        const actions = this.petOrderAvailable();
        this.nuiDispatch.dispatch('pet_manager', 'ShowPetManager', { open: true, actions });
    }

    @OnEvent(ClientEvent.PLAYER_ON_DEATH)
    public async onDead() {
        await this.despawnAnimal();
    }

    @OnEvent(ClientEvent.PET_USE_WHISTLE)
    async onUseWhistle() {
        if (!this.isOwningPet()) {
            this.notifier.notify("Vous ne possédez pas d'animal.", 'error');
            return;
        }
        if (this.isUsingWhistle) return;
        this.isUsingWhistle = true;

        const ped = PlayerPedId();
        if (IsPedInAnyVehicle(ped, true)) {
            this.isUsingWhistle = false;
            return;
        }

        if (this.pet.entity) {
            const distance = getDistance(GetEntityCoords(ped) as Vector3, GetEntityCoords(this.pet.entity) as Vector3);
            if (distance >= PetDistanceForceFollowPlayer) {
                this.notifier.notify('Ton animal est ~y~trop éloigné~s~ de toi pour entendre le sifflet.', 'info');
                this.isUsingWhistle = false;
                return;
            }
            await this.playWhistleAnimation();
            await this.despawnAnimal();
            this.notifier.notify('Ton animal est parti ~g~se reposer~s~.', 'info');
            this.isUsingWhistle = false;
            return;
        }

        if (this.pet.dead) {
            this.notifier.notify(
                'Ton animal est à ~r~bout de force~s~, rend toi au ~b~vétérinaire~s~ au plus vite !',
                'info'
            );
            this.isUsingWhistle = false;
            return;
        }

        await this.playWhistleAnimation();
        await this.spawnAnimal();
        this.notifier.notify('Ton animal commence à ~g~te suivre~s~.', 'info');
        this.isUsingWhistle = false;
    }

    async spawnAnimal() {
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
            -0.5
        );

        const model = this.getPetModel();
        await this.resourceLoader.loadModel(model);

        this.pet.entity = CreatePed(0, model, spawnCoord[0], spawnCoord[1], spawnCoord[2], head + 180, true, true);
        SetEntityVisible(this.pet.entity, false, false);
        FreezeEntityPosition(this.pet.entity, true);
        SetEntityCompletelyDisableCollision(this.pet.entity, false, true);
        SetEntityCollision(this.pet.entity, true, true);

        if (!IsPedAnAnimal(this.pet.entity)) {
            await this.despawnAnimal();
            return;
        }

        for (const component of this.pet.components) {
            SetPedComponentVariation(this.pet.entity, component.component, component.drawable, component.texture, 0);
        }

        SetEntityVisible(this.pet.entity, true, false);
        FreezeEntityPosition(this.pet.entity, false);
        SetEntityAsMissionEntity(this.pet.entity, true, true);
        SetPedFleeAttributes(this.pet.entity, 0, false);
        SetPedCombatAttributes(this.pet.entity, 46, true);
        SetPedRelationshipGroupHash(this.pet.entity, GetHashKey('PLAYER_PET'));
        SetRelationshipBetweenGroups(5, GetHashKey('PLAYER_PET'), GetHashKey('PLAYER'));
        SetEntityInvincible(this.pet.entity, false);
        SetPedHearingRange(this.pet.entity, 0.0);
        SetBlockingOfNonTemporaryEvents(this.pet.entity, true);

        let networkId = NetworkGetNetworkIdFromEntity(this.pet.entity);

        if (networkId) {
            SetNetworkIdExistsOnAllMachines(networkId, true);
        }

        let attempts = 0;
        while (!NetworkGetEntityIsNetworked(this.pet.entity) && attempts < 10) {
            NetworkRegisterEntityAsNetworked(this.pet.entity);
            networkId = NetworkGetNetworkIdFromEntity(this.pet.entity);

            if (networkId) {
                SetNetworkIdExistsOnAllMachines(networkId, true);
            }

            attempts += 1;
            await wait(100);
        }

        SetNetworkIdCanMigrate(networkId, false);
        this.currentOrder = PetOrder.FOLLOW;
        this.syncWithUI();
        TriggerServerEvent(ServerEvent.PET_SPAWNED, networkId);
    }

    public petOrderAvailable() {
        const orderAvaible: Array<PetOrder> = [];
        Object.values(PetOrder).forEach(order => {
            let canUseOrder = false;
            if (petOrderModelAnimation[order]?.[petBreedToOrderType?.[this.getPetModel()]]) {
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
        if (!this.pet?.entity || !DoesEntityExist(this.pet.entity) || this.pet.dead) return;

        if (IsEntityDead(this.pet.entity)) {
            this.pet.dead = true;
            this.notifier.notify(
                'Ton animal vient de ~r~perdre connaissance~s~, rend toi au ~b~vétérinaire~s~ au plus vite !',
                'info'
            );

            await this.setPetDeath(true);
            return;
        }

        if (this.pet.hunger === 0 || this.pet.thirst === 0) {
            SetEntityHealth(this.pet.entity, 0);
            return;
        }

        if (this.noClipProvider.IsNoClipMode()) {
            await this.despawnAnimal();
            return;
        }

        const ped = PlayerPedId();
        const distance = getDistance(GetEntityCoords(ped) as Vector3, GetEntityCoords(this.pet.entity) as Vector3);

        if (distance > PetDistanceReturnHome) {
            this.notifier.notify(
                "Ton animal était complètement ~r~perdu~s~ et est ~r~parti~s~ se reposer, avec un ~b~air triste~s~. Il risque de ~y~s'enfuir~s~ si tu ne fais pas attention à lui",
                'info'
            );
            this.warningDistanceNotif = false;
            await this.despawnAnimal();
            TriggerServerEvent(ServerEvent.PET_AFFECTION_LOSS_DISTANCE);
            return;
        }

        if (distance >= PetDistanceForceFollowPlayer) {
            if (!this.warningDistanceNotif) {
                this.notifier.notify(
                    'Ton animal est ~y~trop éloigné~s~ de toi et commence à te ~b~chercher~s~.',
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
        if (!this.pet?.entity || !DoesEntityExist(this.pet.entity) || !IsEntityStatic(this.pet.entity) || this.pet.dead)
            return;

        const ped = PlayerPedId();
        const distance = getDistance(GetEntityCoords(ped) as Vector3, GetEntityCoords(this.pet.entity) as Vector3);

        if (!this.currentOrder) return;

        if (!this.petOrderAvailable().includes(this.currentOrder)) this.currentOrder = PetOrder.FOLLOW;

        await this.ensurePetInControl();
        if (this.currentOrder === PetOrder.FOLLOW) {
            if (IsPedInAnyVehicle(ped, false) && !IsPedInAnyVehicle(this.pet.entity, false)) {
                const animation = petOrderSitInCarAnimation[petBreedToOrderType?.[this.getPetModel()]];
                const veh = GetVehiclePedIsIn(ped, false);
                if (animation && AreAnyVehicleSeatsFree(veh)) {
                    const maxSeats = GetVehicleMaxNumberOfPassengers(veh);
                    const seats = [];
                    for (let i = maxSeats - 1; i >= 0; i--) {
                        if (IsVehicleSeatFree(veh, i)) seats.push(i);
                    }

                    if (seats.length) {
                        const seat = seats[Math.floor(Math.random() * seats.length)];
                        TaskEnterVehicle(this.pet.entity, veh, -1, seat, 2.0, 1.0, 0);
                        let isCanceled = false;
                        await waitUntil(async () => {
                            if (GetScriptTaskStatus(this.pet.entity, 'SCRIPT_TASK_ENTER_VEHICLE') === 7) return true;
                            const distance = getDistance(
                                GetEntityCoords(ped) as Vector3,
                                GetEntityCoords(this.pet.entity) as Vector3
                            );

                            isCanceled = distance > PetDistanceReturnHome || !IsPedInAnyVehicle(ped, false);
                            return isCanceled;
                        });
                        if (!isCanceled) {
                            await this.startAnimationSync(animation, 10);
                        }
                    }
                } else {
                    if (
                        this.forceOrder ||
                        !IsEntityStatic(veh) ||
                        distance > PetDistanceFollow + PetDistanceOrderVehicleDeltaTrigger
                    ) {
                        await this.taskGoToEntity(veh, PetDistanceFollow, 180.0);
                    }
                }
            } else if (!IsPedInAnyVehicle(ped, false) && IsPedInAnyVehicle(this.pet.entity, false)) {
                const veh = GetVehiclePedIsIn(this.pet.entity, false);
                SetEntityInvincible(this.pet.entity, true);

                const flag = [GetHashKey('a_c_cat_01')].includes(GetEntityModel(this.pet.entity)) ? 16.0 : 1.0;
                TaskLeaveVehicle(this.pet.entity, veh, flag);
                await waitUntil(async () => {
                    if (GetScriptTaskStatus(this.pet.entity, 'SCRIPT_TASK_LEAVE_VEHICLE') === 7) return true;
                    const distance = getDistance(
                        GetEntityCoords(ped) as Vector3,
                        GetEntityCoords(this.pet.entity) as Vector3
                    );

                    return distance > PetDistanceReturnHome;
                });
                setTimeout(() => SetEntityInvincible(this.pet.entity, false), 5_000);
            } else if (
                !IsPedInAnyVehicle(ped, false) &&
                (this.forceOrder ||
                    !IsEntityStatic(ped) ||
                    distance > PetDistanceFollow + PetDistanceOrderPedDeltaTrigger)
            ) {
                await this.taskGoToEntity(ped, PetDistanceFollow, 45.0);
            }
        } else if (this.currentOrder === PetOrder.STOP) {
            this.currentOrder = null;
        } else if (this.currentOrder === PetOrder.SIT) {
            await this.startAnimationSyncForOrder(PetOrder.SIT);
            this.currentOrder = null;
        } else if (this.currentOrder === PetOrder.LAY_DOWN) {
            await this.startAnimationSyncForOrder(PetOrder.LAY_DOWN);
            this.currentOrder = null;
        } else if (this.currentOrder === PetOrder.PET) {
            await this.petTheAnimalOrder();
            this.currentOrder = PetOrder.FOLLOW;
        } else if (this.currentOrder === PetOrder.CATCH) {
            await this.catchTheBall();
            this.currentOrder = null;
        } else if (this.currentOrder === PetOrder.TRICK) {
            await this.startAnimationSyncForOrder(PetOrder.TRICK);
            this.currentOrder = null;
        } //else if (this.currentOrder === PetOrder.ATTACK) {
        //     if (this.forceOrder) {
        //         this.ready = true;
        //         this.notifier.notify(
        //             "L'animal est prêt à attaquer ! ~b~Cibler~s~ la ~y~personne~s~ à maîtriser.",
        //             'info'
        //         );
        //     }
        // } else if (this.currentOrder === PetOrder.SEARCH) {
        //     if (distance > PetDistanceSearch + PetDistanceOrderPedDeltaTrigger || this.forceOrder) {
        //         this.ready = false;
        //         const cancelled = await this.taskGoToEntity(ped, PetDistanceSearch, 90.0, true);
        //         if (!cancelled) {
        //             this.ready = true;
        //             this.notifier.notify(
        //                 "L'animal est prêt à chercher des traces de drogue ! ~b~Cibler~s~ la ~y~personne~s~ ou le ~y~véhicule~s~ à marquer.",
        //                 'info'
        //             );
        //         }
        //     }
        // }

        this.forceOrder = false;
    }

    private async ensurePetInControl() {
        NetworkRequestControlOfEntity(this.pet.entity);
        for (let i = 0; i < 20; i++) {
            if (NetworkHasControlOfEntity(this.pet.entity)) {
                break;
            }
            await wait(50);
        }
    }

    private async petTheAnimalOrder() {
        const ped = PlayerPedId();
        const cancelled = await this.taskGoToEntity(ped, 0.1, 0.0);
        if (cancelled) return;

        const dictionary = 'creatures@rottweiler@tricks@';
        await this.resourceLoader.loadAnimationDictionary(dictionary);

        const orderAnimation: { dictionary: string; name: string } =
            petOrderModelAnimation[PetOrder.PET][petBreedToOrderType?.[this.getPetModel()]]?.[0];

        const flag = PetOrderAnimationFlag[PetOrder.PET];

        const coords = GetEntityCoords(ped) as Vector3;
        if (orderAnimation.dictionary === dictionary && orderAnimation.name === 'petting_chop') {
            const scene = NetworkCreateSynchronisedScene(
                coords[0],
                coords[1],
                coords[2] - 1,
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
            if (orderAnimation.dictionary !== dictionary) {
                await this.startAnimationSyncForOrder(PetOrder.PET);
            } else {
                NetworkAddPedToSynchronisedScene(
                    this.pet.entity,
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
            }
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
                this.pet.entity,
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
        TriggerServerEvent(ServerEvent.PET_AFFECTION_GAIN_PET);
    }

    private async catchTheBall() {
        if (!this.ballEntityNetId) return;

        const entity = NetworkGetEntityFromNetworkId(this.ballEntityNetId);
        TaskGoToEntity(this.pet.entity, entity, -1, 0.25, 100, 100, 0);
        await waitUntil(async () => {
            const targetCoords = GetEntityCoords(entity) as Vector3;
            const petCoord = GetEntityCoords(this.pet.entity) as Vector3;
            return (
                getDistance([targetCoords[0], targetCoords[1]], [petCoord[0], petCoord[1]]) <= PetDistanceCatchTheBall
            );
        });

        AttachEntityToEntity(entity, this.pet.entity, 0, 0, 0, 0, 0, 0, 0, true, true, false, true, 1, true);
        await this.taskGoToEntity(PlayerPedId(), PetDistanceFollow, 0);
        DetachEntity(entity, true, true);

        const forwardVector = GetEntityForwardVector(this.pet.entity);
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

    private async stopAnimationSync() {
        await this.ensurePetInControl();
        ClearPedTasks(this.pet.entity);
        await wait(0);
    }

    private async startAnimationSyncForOrder(order: PetOrder) {
        const animationPossibility: Array<{ dictionary: string; name: string }> =
            petOrderModelAnimation[order][petBreedToOrderType?.[this.getPetModel()]];
        const flag = PetOrderAnimationFlag[order];

        let animation: { dictionary: string; name: string };
        if (animationPossibility.length === 1) {
            animation = animationPossibility[0];
        } else {
            animation = animationPossibility[Math.floor(Math.random() * animationPossibility.length)];
        }

        await this.startAnimationSync(animation, flag);
    }

    private async startAnimationSync(animation: { dictionary: string; name: string }, flag: number) {
        await this.resourceLoader.loadAnimationDictionary(animation.dictionary);
        TaskPlayAnim(
            this.pet.entity,
            animation.dictionary,
            animation.name,
            8.0,
            8.0,
            -1,
            flag,
            0.0,
            false,
            false,
            false
        );
        this.resourceLoader.unloadAnimationDictionary(animation.dictionary);
    }

    private getRandomPosNegAngle(angle: number): number {
        return Math.random() < 0.5 ? -angle : angle;
    }

    private async taskGoToEntity(
        entity: number,
        distance: number,
        angle: number,
        forceHeading: boolean = false
    ): Promise<boolean> {
        const ped = PlayerPedId();
        TaskGotoEntityOffset(this.pet.entity, entity, -1, distance, this.getRandomPosNegAngle(angle), 100, 1);
        let isCanceled = false;
        await waitUntil(async () => {
            if (GetScriptTaskStatus(this.pet.entity, 'SCRIPT_TASK_GOTO_ENTITY_OFFSET') === 7) return true;
            const distance = getDistance(GetEntityCoords(ped) as Vector3, GetEntityCoords(this.pet.entity) as Vector3);

            isCanceled =
                distance > PetDistanceReturnHome ||
                (this.currentOrder === PetOrder.FOLLOW && IsPedInAnyVehicle(ped, false));
            return isCanceled;
        });
        if (forceHeading && !isCanceled) {
            TaskAchieveHeading(this.pet.entity, GetEntityHeading(entity), 2500);
            await waitUntil(async () => GetScriptTaskStatus(this.pet.entity, 'SCRIPT_TASK_ACHIEVE_HEADING') === 7);
        }
        return isCanceled;
    }

    private getMaxEnergyForPet(): number {
        return GetMaxEnergyForPet(this.pet);
    }

    private async setPetDeath(death: boolean) {
        if (!this.isOwningPet()) return;

        TriggerServerEvent(ServerEvent.PET_SET_DEATH, death);
    }

    async despawnAnimal() {
        if (!this.pet?.entity) return;
        await this.ensurePetInControl();

        const model = GetEntityModel(this.pet.entity);

        DeleteEntity(this.pet.entity);
        this.resourceLoader.unloadModel(model);
        this.pet.entity = null;
        this.currentOrder = null;
        this.syncWithUI();
        TriggerServerEvent(ServerEvent.PET_DESPAWNED);
        return;
    }

    public isOwningPet(): boolean {
        return Boolean(this.pet);
    }

    public isDead(): boolean {
        return Boolean(this.pet?.dead);
    }

    public getPetEntity(): number | null {
        return this.pet?.entity;
    }

    public usePetFood(inventoryItem: InventoryItem) {
        if (
            getDistance(GetEntityCoords(PlayerPedId()) as Vector3, GetEntityCoords(this.pet.entity) as Vector3) >
            PetDistanceUseFood
        ) {
            this.notifier.notify('Ton animal est ~b~trop loin~s~ pour être nourris.', 'info');
            return;
        }
        TriggerServerEvent(ServerEvent.PET_USE_FOOD, inventoryItem);
    }

    private getPetModel() {
        return this.pet.model;
    }

    @OnNuiEvent(NuiEvent.PetDisplayState)
    public async onPetDisplayState() {
        if (!this.pet) return;
        this.notifier.notify(
            `~h~État de l'animal~/h~~n~
            ~b~Personnalité~s~ : ~g~${positiveTraitLabel[this.pet.trait_up]}~s~ - ~y~${negativeTraitLabel[this.pet.trait_down]}~s~~n~
            ~b~Affection~s~ : ${getAffectionLabel(this.pet.affection)} (${this.pet.affection.toFixed(2)})~n~
            ~b~Entrainement~s~ : ${getTrainingLabel(this.pet.training)} (${this.pet.training.toFixed(2)})`,
            'info',
            7500
        );
    }

    @OnNuiEvent(NuiEvent.PetAnimalOrder)
    public async onPetAnimalOrder(order: PetOrder) {
        if (!this.pet?.entity) return;
        if (!this.petOrderAvailable().includes(order) || order == this.currentOrder) return;

        const ped = PlayerPedId();
        const distance = getDistance(GetEntityCoords(ped) as Vector3, GetEntityCoords(this.pet.entity) as Vector3);
        if (distance >= PetDistanceForceFollowPlayer) {
            this.notifier.notify('Ton animal est ~b~trop loin~s~ pour entendre ton ordre.', 'info');
            return;
        }

        if (order !== PetOrder.CATCH || this.ballEntityNetId) {
            this.animationService.playAnimation(
                {
                    base: {
                        dictionary: 'gestures@f@standing@casual',
                        name: 'gesture_point',
                        options: {
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
                this.notifier.notify("Tu n'as pas de balle à lancer", 'error');
                return;
            }
            await this.throwBall();
        }

        if (this.pet.energy <= 0) {
            this.notifier.notify('Ton animal est ~b~trop épuisé~s~ pour réaliser ton ordre.', 'info');
            return;
        }

        let success: boolean;
        if (order === PetOrder.FOLLOW) {
            success = true;
        } else {
            success = Math.random() <= Math.max(this.pet.training / 100, PetTrainingMinimalExecOrderChance);
            TriggerServerEvent(ServerEvent.PET_EXECUTED_ORDER, success);
        }

        if (!success) {
            this.notifier.notify(
                'Ton animal te regarde ~y~sans comprendre~s~ ce que tu lui demandes ! Malheureusement, il va falloir le ~b~dresser~s~ petit à petit.',
                'info'
            );
        } else {
            this.notifier.notify(`Ton animal exécute l'ordre ~g~${petOrderMeta[order].label}~s~ !`, 'info');
            await this.execOrder(order);
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

    private async execOrder(order: PetOrder) {
        await this.stopAnimationSync();

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
    public async onResetPerDaysCommand(citizenId: string) {
        TriggerServerEvent(ServerEvent.PET_ADMIN_RESET_PER_DAYS, citizenId);
    }
}
