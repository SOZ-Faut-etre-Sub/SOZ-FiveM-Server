import { On, Once, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { PriceService } from '@public/server/bank/price.service';
import { PrismaService } from '@public/server/database/prisma.service';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { ItemService } from '@public/server/item/item.service';
import { Notifier } from '@public/server/notifier';
import { PermissionService } from '@public/server/permission.service';
import { PlayerHealthProvider } from '@public/server/player/player.health.provider';
import { PlayerMoneyService } from '@public/server/player/player.money.service';
import { PlayerService } from '@public/server/player/player.service';
import {
    AnyServerPet,
    ClientJobPet,
    ClientPet,
    GetMaxEnergyForPet,
    IncrementalPetData,
    k9_whistles,
    KennelJobPet,
    Pet,
    PET_BALL_OBJECT,
    PetAffectGainFoodTimeDiff,
    PetAffectionEscapeLimit,
    PetAffectionFoodLimit,
    PetAffectionGainOnPet,
    PetAffectionGainOnPetTimeDiff,
    PetAffectionGainPerDay,
    PetAffectionLimit,
    PetAffectionLossPerDay,
    PetAffectionLostDeath,
    PetAffectionLostDistance,
    PetAffectionLostFood,
    PetAffectionTraitBonus,
    PetAffectLostFoodTimeDiff,
    PetEnergyPerAction,
    PetEnergyRatePerMinute,
    petFood,
    PetFoodGiveLimit,
    PetFoodLimit,
    PetFoodOnHeal,
    PetFoodTraitBonus,
    PetHealPrice,
    PetHungerRatePerMinute,
    PetNamePrice,
    PetResetMeta,
    PetThirstRatePerMinute,
    PetTrainingGainPerDay,
    PetTrainingGainPerOrder,
    PetTrainingLimit,
    PetTrainingTraitBonus,
    PetTraits,
    PlayerStressOnDeath,
    ServerJobPet,
    ServerPet,
    whistles,
} from '@public/shared/animal';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { ADD_ERROR_MESSAGE, InventoryItem, InventoryType } from '@public/shared/inventory';
import { FDO, JobType, PUBLIC_SERVICES } from '@public/shared/job';
import { PlayerData } from '@public/shared/player';
import { isErr } from '@public/shared/result';
import { RpcServerEvent } from '@public/shared/rpc';
import { TaxType } from '@public/shared/tax';

@Provider()
export class AnimalProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerHealthProvider)
    private playerHealthProvider: PlayerHealthProvider;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(InventoryFactory)
    private readonly inventoryFactory: InventoryFactory;

    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(PriceService)
    private priceService: PriceService;

    @Inject(Notifier)
    private notifier: Notifier;

    private resetStateHour = new Date().setHours(6, 0, 0, 0);

    private playerPets: Record<string, ServerPet> = {};
    private playerJobPets: Record<string, ServerJobPet> = {};
    private spawnedPets: Record<number, number> = {};

    @Once()
    public onStart() {
        for (const whistle of whistles) {
            this.itemService.setItemUseCallback(whistle, this.useWhistle.bind(this));
        }
        for (const whistle of k9_whistles) {
            this.itemService.setItemUseCallback(whistle, this.useK9Whistle.bind(this));
        }
    }

    async useWhistle(source: number) {
        TriggerClientEvent(ClientEvent.PET_USE_WHISTLE, source);
    }

    async useK9Whistle(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        if (!FDO.includes(player.job.id)) {
            this.notifier.error(player.source, "Vous n'êtes pas habilité à utiliser cet objet");
            return false;
        }

        TriggerClientEvent(ClientEvent.PET_USE_K9_WHISTLE, source);
    }

    @Rpc(RpcServerEvent.ADMIN_GET_PLAYER_PET)
    public async onAdminGetPlayerPet(source: number, citizenId: string): Promise<ServerPet> {
        if (!this.permissionService.isStaff(source)) {
            return null;
        }

        return await this.getPet(citizenId, false);
    }

    @Rpc(RpcServerEvent.ADMIN_GET_JOB_PETS)
    public async onAdminGetJobPets(source: number, job: string): Promise<Array<ServerJobPet>> {
        if (!this.permissionService.isStaff(source)) {
            return null;
        }

        const pets =
            (await this.prismaService.job_pet.findMany({
                where: {
                    job: job,
                },
            })) || [];

        return pets.map(pet => this.formatServerJobPet(pet));
    }

    @Rpc(RpcServerEvent.PET_GET_ANIMAL)
    public async onPetGetAnimal(source: number, force: boolean): Promise<ClientPet> {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const serverPet = await this.getPet(player.citizenid, force);
        if (!serverPet) {
            delete this.playerPets[player.citizenid];
            return null;
        }

        let needPetUpdate = null;
        if (
            serverPet.perDays.lastAffectionLossThirst < this.resetStateHour ||
            serverPet.perDays.lastAffectionLossHunger < this.resetStateHour ||
            serverPet.perDays.lastAffectionGainThirst < this.resetStateHour ||
            serverPet.perDays.lastAffectionGainHunger < this.resetStateHour ||
            serverPet.perDays.lastAffectionGainOnPet < this.resetStateHour ||
            serverPet.perDays.lastTrainingGain < this.resetStateHour
        ) {
            serverPet.perDays = this.getDefaultPerDaysMetaData();
            needPetUpdate = true;
        }

        if (!serverPet.perDays.escape) {
            if (serverPet.affection < PetAffectionEscapeLimit) {
                if (Math.random() < (PetAffectionEscapeLimit - serverPet.affection) / 100) {
                    this.notifier.notify(
                        source,
                        `${serverPet.name ? serverPet.name : `Ton animal`} ~r~s'est enfuit~s~ ! Tâche d'y faire plus attention là prochaine fois.~n~Dès que l'~y~affection~s~ de celui-ci est bas, il se peut qu'il décide de chercher une meilleure vie ailleurs.`
                    );
                    await this.prismaService.pet.delete({ where: { id: serverPet.id } });
                    return null;
                }
            }
            serverPet.perDays.escape = true;
            needPetUpdate = true;
        }

        this.playerPets[player.citizenid] = serverPet;
        if (needPetUpdate) {
            await this.udpatePetDb(
                player,
                {
                    perDays: JSON.stringify(serverPet.perDays),
                },
                false
            );
        }

        return this.formatClientPet(this.playerPets[player.citizenid]);
    }

    @Rpc(RpcServerEvent.PET_GET_JOB_ANIMAL)
    public async onPetGetJobAnimal(source: number, force: boolean): Promise<ClientPet> {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const serverPet = await this.getJobPet(player.citizenid, force);
        if (!serverPet) {
            delete this.playerJobPets[player.citizenid];
            return null;
        }

        let needPetUpdate = null;
        if (
            serverPet.perDays.lastAffectionLossThirst < this.resetStateHour ||
            serverPet.perDays.lastAffectionLossHunger < this.resetStateHour ||
            serverPet.perDays.lastAffectionGainThirst < this.resetStateHour ||
            serverPet.perDays.lastAffectionGainHunger < this.resetStateHour ||
            serverPet.perDays.lastAffectionGainOnPet < this.resetStateHour ||
            serverPet.perDays.lastTrainingGain < this.resetStateHour
        ) {
            serverPet.perDays = this.getDefaultPerDaysMetaData();
            needPetUpdate = true;
        }

        if (!serverPet.perDays.escape) {
            if (serverPet.affection < PetAffectionEscapeLimit) {
                if (Math.random() < (PetAffectionEscapeLimit - serverPet.affection) / 100) {
                    await this.prismaService.pet.delete({ where: { id: serverPet.id } });
                    return null;
                }
            }
            serverPet.perDays.escape = true;
            needPetUpdate = true;
        }

        this.playerJobPets[player.citizenid] = serverPet;
        if (needPetUpdate) {
            await this.udpateJobPetDb(
                player,
                {
                    perDays: JSON.stringify(serverPet.perDays),
                },
                false
            );
        }

        return this.formatClientJobPet(this.playerJobPets[player.citizenid]);
    }

    @Rpc(RpcServerEvent.PET_LIST_JOB_ANIMALS)
    public async onListJobAnimals(source: number): Promise<Array<KennelJobPet>> {
        const player = this.playerService.getPlayer(source);
        if (!player) return [];

        const pets = await this.prismaService.job_pet.findMany({
            where: {
                job: player.job.id,
            },
        });

        return this.formatJobPetForKennelMenu(pets, player.citizenid);
    }

    @Rpc(RpcServerEvent.PET_CONSUME_BALL)
    public async onPetConsumeBall(source: number): Promise<boolean> {
        const player = this.playerService.getPlayer(source);
        if (!player) return false;

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return false;

        return inventory.remove(PET_BALL_OBJECT);
    }

    @Rpc(RpcServerEvent.PET_SHOULD_PLAYER_BE_ATTACKED)
    public async onPetShouldPlayerBeAttacked(source: number, playerNetworkId: number): Promise<boolean> {
        const target = this.playerService.getPlayer(playerNetworkId);
        if (!target || (PUBLIC_SERVICES.includes(target.job.id) && target.job.onduty)) return false;

        return true;
    }

    private async getPet(citizenId: string, force: boolean): Promise<ServerPet | null> {
        let serverPet = null;
        if (!this.playerPets[citizenId] || force) {
            const petDb = await this.prismaService.pet.findFirst({
                where: {
                    owner_id: citizenId,
                },
            });
            if (petDb) serverPet = this.formatServerPet(petDb);
        } else {
            serverPet = this.playerPets[citizenId];
        }
        return serverPet;
    }

    private async getJobPet(citizenId: string, force: boolean): Promise<ServerJobPet | null> {
        let serverPet = null;
        if (!this.playerJobPets[citizenId] || force) {
            const petDb = await this.prismaService.job_pet.findFirst({
                where: {
                    owner_id: citizenId,
                },
            });
            if (petDb) serverPet = this.formatServerJobPet(petDb);
        } else {
            serverPet = this.playerJobPets[citizenId];
        }
        return serverPet;
    }

    private async udpatePetDb(player: PlayerData, data: Record<string, any>, sync: boolean = true) {
        const pet = this.playerPets[player.citizenid];
        if (!pet) return;

        await this.prismaService.pet.update({
            where: { id: pet.id },
            data: data,
        });
        if (sync) TriggerClientEvent(ClientEvent.PET_SYNC_ANIMAL, player.source);
    }

    private async udpateJobPetDb(player: PlayerData, data: Record<string, any>, sync: boolean = true) {
        const pet = this.playerJobPets[player.citizenid];
        if (!pet) return;

        await this.prismaService.job_pet.update({
            where: { id: pet.id },
            data: data,
        });
        if (sync) TriggerClientEvent(ClientEvent.PET_SYNC_JOB_ANIMAL, player.source);
    }

    private async udpateJobPetDbById(id: number, data: Record<string, any>, sync: boolean = true) {
        const pet = await this.prismaService.job_pet.update({
            where: { id: id },
            data: data,
        });

        if (pet && pet.owner_id && sync) {
            const player = this.playerService.getPlayerByCitizenId(pet.owner_id);
            if (player) TriggerClientEvent(ClientEvent.PET_SYNC_JOB_ANIMAL, player.source);
        }
    }

    public async incrementPetData(
        source: number,
        isPetJob: boolean,
        dataIncrement: Partial<Record<IncrementalPetData, number>>,
        withPerDays: boolean = true
    ) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const pet = isPetJob ? this.playerJobPets[player.citizenid] : this.playerPets[player.citizenid];
        if (!pet) return;

        const data = this.processIncrementData(pet, dataIncrement);
        if (data) {
            if (withPerDays) {
                data.perDays = JSON.stringify(pet.perDays);
            }

            if (isPetJob) {
                await this.udpateJobPetDb(player, data);
            } else {
                await this.udpatePetDb(player, data);
            }
        }
    }

    @OnEvent(ServerEvent.PET_SPAWNED)
    public async onPetSpawned(source: number, entityNetId: number) {
        this.spawnedPets[source] = entityNetId;
    }

    @OnEvent(ServerEvent.PET_DESPAWNED)
    public async onPetDespawned(source: number) {
        delete this.spawnedPets[source];
    }

    @OnEvent(ServerEvent.PET_KENNEL_TAKE)
    public async onPetKennelTake(source: number, petId: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        if (this.playerJobPets[player.citizenid]) {
            this.notifier.notify(
                source,
                `Tu as déjà un ~r~animal d'entreprise~s~ avec toi. ~r~Dépose le~s~ au chenil pour en emporter un autre.`
            );
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory || !inventory.canCarryItem(`whistle_${player.job.id}`)) {
            this.notifier.notify(
                source,
                `Tu ~r~ne possèdes pas~s~ suffisamment de place dans votre inventaire pour recevoir ton ~b~sifflet~s~.`
            );
            return;
        }

        const pet = await this.prismaService.job_pet.findFirst({
            where: {
                id: petId,
                job: player.job.id,
                owner_id: null,
            },
        });
        if (!pet) return;

        await this.prismaService.job_pet.update({
            where: {
                id: petId,
            },
            data: {
                owner_id: player.citizenid,
            },
        });
        inventory.add(`whistle_${player.job.id}`, 1);

        this.notifier.notify(source, `Tu as ~g~emporté~s~ ${pet.name ? pet.name : `un animal d'entreprise`} avec toi.`);
        TriggerClientEvent(ClientEvent.PET_SYNC_JOB_ANIMAL, source, true);
    }

    @OnEvent(ServerEvent.PET_KENNEL_REMOVE)
    public async onPetKennelRemove(source: number, petId: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory || !inventory.hasEnoughItem(`whistle_${player.job.id}`)) {
            this.notifier.notify(
                source,
                `Revient avec ton ~b~sifflet~s~ si tu veux que je recupère ton animal d'entreprise.`
            );
            return;
        }

        const pet = await this.prismaService.job_pet.findFirst({
            where: {
                job: player.job.id,
                id: petId,
                owner_id: player.citizenid,
            },
        });

        if (!pet) return;
        if (pet.dead) {
            this.notifier.notify(
                source,
                `${pet.name ? pet.name : `Ton animal`} est en ~r~très mauvaise~s~ forme. Soigne le avant que le chenil l'acceuil!`
            );
            return;
        }
        await this.prismaService.job_pet.update({
            where: {
                id: petId,
            },
            data: {
                owner_id: null,
            },
        });
        inventory.remove(`whistle_${player.job.id}`, 1);
        this.notifier.notify(source, `Tu as ~g~deposé~s~ ${pet.name ? pet.name : `un animal d'entreprise`} au chenil.`);
        TriggerClientEvent(ClientEvent.PET_SYNC_JOB_ANIMAL, source, true);
    }

    @OnEvent(ServerEvent.PET_KENNEL_ABANDON)
    public async onPetKennelAbandon(source: number, petId: number) {
        if (
            await this.prismaService.job_pet.findFirst({
                where: {
                    id: petId,
                    owner_id: { not: null },
                },
            })
        ) {
            this.notifier.notify(source, `Tu ne peux pas ~r~abandonner~s~ un animal qui est avec un employé.`);
            return;
        }

        const serverPet = await this.prismaService.job_pet.delete({
            where: {
                id: petId,
            },
        });

        if (serverPet)
            this.notifier.notify(
                source,
                `Tu as ~r~abandonné~s~ ${serverPet.name ? serverPet.name : `cet animal d'entreprise`}.`
            );
    }

    @OnEvent(ServerEvent.PET_KENNEL_RECALL)
    public async onPetKennelRecall(source: number, petId: number) {
        const pet = await this.prismaService.job_pet.findFirst({
            where: {
                id: petId,
                owner_id: { not: null },
            },
        });

        if (!pet) return;

        const player = this.playerService.getPlayerByCitizenId(pet.owner_id);
        if (player) {
            this.notifier.notify(source, `Tu ne peux pas ~r~rappeler~s~ un animal qui est avec un employé en ville.`);
            return;
        }

        const inventoryId = `player_${pet.owner_id}`;
        const inventory = await this.inventoryFactory.getOrCreate(inventoryId, InventoryType.Player, {
            owner: pet.owner_id,
            persistent: true,
        });

        await this.prismaService.job_pet.update({
            where: {
                id: petId,
            },
            data: {
                owner_id: null,
            },
        });
        inventory.remove(`whistle_${pet.job}`, 1);

        this.notifier.notify(
            source,
            `Tu as ~g~rappelé~s~ ${pet.name ? pet.name : `un animal d'entreprise`} au chenil.`
        );
    }

    @On('playerDropped')
    public onDropped(source: number) {
        if (this.spawnedPets[source]) {
            const entity = NetworkGetEntityFromNetworkId(this.spawnedPets[source]);
            DeleteEntity(entity);
            delete this.spawnedPets[source];
        }
    }

    @OnEvent(ServerEvent.PET_PICK_UP_BALL)
    public async pickUpBall(source: number, entityNetId: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return;

        const result = inventory.add(PET_BALL_OBJECT);
        if (isErr(result)) {
            this.notifier.error(source, `Impossible de rajouter l'objet: ${ADD_ERROR_MESSAGE[result.err]}`);

            return;
        }

        const entity = NetworkGetEntityFromNetworkId(entityNetId);
        DeleteEntity(entity);
    }

    @OnEvent(ServerEvent.PET_SET_DEATH)
    public async setPetDeath(source: number, death: boolean, isPetJob: boolean) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const pet = isPetJob ? this.playerJobPets[player.citizenid] : this.playerPets[player.citizenid];
        if (!pet) return;

        let data: Record<string, any>;
        if (death) {
            data = this.processIncrementData(pet, {
                affection: this.getPetAffectionIncreament(pet, PetAffectionLostDeath),
            });
            await this.playerHealthProvider.increaseStress(source, PlayerStressOnDeath);
        } else {
            if (!(await this.playerMoneyService.buy(source, PetHealPrice, TaxType.SERVICE))) {
                this.notifier.notify(
                    source,
                    `Tu n'as pas assez d'argent, pauvre ${pet.name || `animal`}.. Reviens avec $~b~${await this.priceService.getPrice(PetHealPrice, TaxType.SERVICE)}~s~.`,
                    'info'
                );
                return;
            }

            data = this.processIncrementData(pet, {
                hunger: Math.max(0, PetFoodOnHeal - pet.hunger),
                thirst: Math.max(0, PetFoodOnHeal - pet.thirst),
            });

            this.notifier.notify(
                source,
                `Merci pour tes $~b~${await this.priceService.getPrice(PetHealPrice, TaxType.SERVICE)}~s~. J'ai ~g~soigné~s~ ${pet.name || `ton animal`} ! Prend en bien plus soin à l'avenir, car il risque de ~y~s'enfuir~s~ si tu ne fais pas attention à lui.`,
                'info'
            );
        }

        pet.dead = death;
        if (!data) {
            data = { dead: death };
        } else {
            data['dead'] = death;
        }
        if (data.affection) {
            data.perDays = JSON.stringify(pet.perDays);
        }

        if (isPetJob) {
            await this.udpateJobPetDb(player, data);
        } else {
            await this.udpatePetDb(player, data);
        }
    }

    @OnEvent(ServerEvent.PET_NAME_ANIMAL)
    async nameAnimal(source: number, name: string, isPetJob: boolean) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const pet = isPetJob ? this.playerJobPets[player.citizenid] : this.playerPets[player.citizenid];
        if (!pet) return;

        if (!(await this.playerMoneyService.buy(source, PetNamePrice, TaxType.SERVICE))) {
            this.notifier.notify(
                source,
                `Tu n'as pas assez d'argent.. Reviens avec $~b~${await this.priceService.getPrice(PetNamePrice, TaxType.SERVICE)}~s~.`,
                'info'
            );
            return;
        }

        let data: Record<string, any>;
        if (pet.name) {
            if (!pet.perDays.renamed) {
                data = this.processIncrementData(pet, { training: -10 });
                data ??= {};
                pet.perDays.renamed = true;
                data.perDays = JSON.stringify(pet.perDays);
            }
        } else {
            data = this.processIncrementData(pet, { affection: 5 });
        }
        data ??= {};
        data['name'] = name;
        pet.name = name;

        if (isPetJob) {
            await this.udpateJobPetDb(player, data);
        } else {
            await this.udpatePetDb(player, data);
        }
        this.notifier.notify(source, `Tu as ~b~nommer~s~ votre animal ~g~${name}~s~, son regard s'illumine !`);
    }

    @OnEvent(ServerEvent.PET_AFFECTION_LOSS_DISTANCE)
    public async onPetAffectionLossDistance(source: number, isPetJob: boolean) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const pet = isPetJob ? this.playerJobPets[player.citizenid] : this.playerPets[player.citizenid];
        if (!pet) return;

        const data =
            this.processIncrementData(pet, {
                affection: this.getPetAffectionIncreament(pet, PetAffectionLostDistance),
            }) || {};
        data.perDays = JSON.stringify(pet.perDays);

        if (isPetJob) {
            await this.udpateJobPetDb(player, data);
        } else {
            await this.udpatePetDb(player, data);
        }
    }

    @OnEvent(ServerEvent.PET_AFFECTION_GAIN_PET)
    public async onPetAffectionGainPet(source: number, isPetJob: boolean) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const pet = isPetJob ? this.playerJobPets[player.citizenid] : this.playerPets[player.citizenid];
        if (!pet) return;

        const now = new Date().getTime();
        const petTimeDiff = now - pet.perDays.lastAffectionGainOnPet;
        if (petTimeDiff <= PetAffectionGainOnPetTimeDiff) {
            return;
        }

        pet.perDays.lastAffectionGainOnPet = now;
        const data =
            this.processIncrementData(pet, {
                affection: this.getPetAffectionIncreament(pet, PetAffectionGainOnPet),
            }) || {};
        data.perDays = JSON.stringify(pet.perDays);

        if (isPetJob) {
            await this.udpateJobPetDb(player, data);
        } else {
            await this.udpatePetDb(player, data);
        }
    }

    @OnEvent(ServerEvent.PET_EXECUTED_ORDER)
    public async onPetExecutedOrder(source: number, success: boolean, isPetJob: boolean) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const pet = isPetJob ? this.playerJobPets[player.citizenid] : this.playerPets[player.citizenid];
        if (!pet) return;

        const dataIncrement: Partial<Record<IncrementalPetData, number>> = { energy: PetEnergyPerAction };
        if (success) {
            const now = new Date().getTime();
            const trainingTimeDiff = now - pet.perDays.lastTrainingGain;
            if (trainingTimeDiff > PetAffectionGainOnPetTimeDiff) {
                dataIncrement.training = this.getPetTrainingIncreament(pet, PetTrainingGainPerOrder);
                pet.perDays.lastTrainingGain = now;
            }
        }

        const data = this.processIncrementData(pet, dataIncrement) || {};
        if (data.training) {
            this.notifier.notify(
                source,
                `Le dressage de ${pet.name || `ton animal`} progresse, passant de ~g~${(pet.training - dataIncrement.training).toFixed(2)}~s~ à ~g~${pet.training.toFixed(2)}~s~.`,
                'info'
            );
        }
        if (success && dataIncrement.training) data.perDays = JSON.stringify(pet.perDays);
        if (isPetJob) {
            await this.udpateJobPetDb(player, data);
        } else {
            await this.udpatePetDb(player, data);
        }
    }

    @OnEvent(ServerEvent.PET_ADMIN_SET_DEATH)
    public async adminSetPetDeath(source: number, citizenId: string, death: boolean) {
        const player = this.playerService.getPlayerByCitizenId(citizenId);
        if (!player) return;

        const pet = this.playerPets[player.citizenid];
        if (!pet) return;

        pet.dead = death;
        await this.udpatePetDb(player, { dead: death });
        this.notifier.notify(source, `L'animal a été ${death ? `~r~tué~s~` : `~g~soigné~s~`}.`, 'info');
    }

    @OnEvent(ServerEvent.PET_ADMIN_RESET_PER_DAYS)
    public async onPetResetPerDays(source: number, citizenId: string) {
        const player = this.playerService.getPlayerByCitizenId(citizenId);
        if (!player) return;

        const pet = this.playerPets[player.citizenid];
        if (!pet) return;

        pet.perDays = this.getDefaultPerDaysMetaData();
        await this.udpatePetDb(player, { perDays: JSON.stringify(pet.perDays) });
    }

    @OnEvent(ServerEvent.PET_ADMIN_SET_DATA)
    public async onSetData(source: number, citizenId: string, data: Partial<Record<IncrementalPetData, number>>) {
        const player = this.playerService.getPlayerByCitizenId(citizenId);
        if (!player) return;

        const pet = this.playerPets[player.citizenid];
        if (!pet) return;

        this.playerPets[player.citizenid] = {
            ...pet,
            ...data,
        };
        await this.udpatePetDb(player, data);
    }

    @OnEvent(ServerEvent.PET_ADMIN_SET_PER_DAYS)
    public async onSetResetMetadata(
        source: number,
        citizenId: string,
        resetMetadata: Partial<Record<IncrementalPetData, number>>
    ) {
        const player = this.playerService.getPlayerByCitizenId(citizenId);
        if (!player) return;

        const pet = this.playerPets[player.citizenid];
        if (!pet) return;

        pet.perDays = {
            ...pet.perDays,
            ...resetMetadata,
        };
        await this.udpatePetDb(player, { perDays: JSON.stringify(pet.perDays) });
    }

    @OnEvent(ServerEvent.PET_ADMIN_JOB_SET_DEATH)
    public async adminJobSetPetDeath(source: number, id: number, death: boolean) {
        const pet = Object.values(this.playerJobPets).find(pet => pet.id === id);
        if (pet) pet.dead = death;

        await this.udpateJobPetDbById(id, { dead: death });
        this.notifier.notify(source, `L'animal a été ${death ? `~r~tué~s~` : `~g~soigné~s~`}.`, 'info');
    }

    @OnEvent(ServerEvent.PET_ADMIN_JOB_RESET_PER_DAYS)
    public async onJobPetResetPerDays(source: number, id: number) {
        const pet = Object.values(this.playerJobPets).find(pet => pet.id === id);
        if (pet) pet.perDays = this.getDefaultPerDaysMetaData();

        await this.udpateJobPetDbById(id, { perDays: JSON.stringify(pet.perDays) });
    }

    @OnEvent(ServerEvent.PET_ADMIN_JOB_SET_DATA)
    public async onJobSetData(source: number, id: number, data: Partial<Record<IncrementalPetData, number>>) {
        const pet = Object.values(this.playerJobPets).find(pet => pet.id === id);
        if (pet) {
            this.playerJobPets[pet.owner_id] = {
                ...pet,
                ...data,
            };
        }

        await this.udpateJobPetDbById(id, data);
    }

    @OnEvent(ServerEvent.PET_ADMIN_JOB_SET_PER_DAYS)
    public async onJobSetResetMetadata(
        source: number,
        id: number,
        resetMetadata: Partial<Record<IncrementalPetData, number>>
    ) {
        const pet = Object.values(this.playerJobPets).find(pet => pet.id === id);
        if (pet) {
            pet.perDays = {
                ...pet.perDays,
                ...resetMetadata,
            };
        }

        await this.udpateJobPetDbById(id, { perDays: JSON.stringify(pet.perDays) });
    }

    private processIncrementData(
        pet: AnyServerPet,
        dataIncrement?: Partial<Record<IncrementalPetData, number>>
    ): Record<string, any> | null {
        let data = null;
        for (const [meta, incr] of Object.entries(dataIncrement)) {
            if (meta === 'hunger') {
                const newValue = Math.max(0, Math.min(pet.hunger + incr, PetFoodLimit));
                const realIncr = newValue - pet.hunger;

                if (realIncr) {
                    data ??= {};
                    data['hunger'] = { increment: realIncr };
                    pet.hunger += realIncr;
                }
            } else if (meta === 'thirst') {
                const newValue = Math.max(0, Math.min(pet.thirst + incr, PetFoodLimit));
                const realIncr = newValue - pet.thirst;

                if (realIncr) {
                    data ??= {};
                    data['thirst'] = { increment: realIncr };
                    pet.thirst += realIncr;
                }
            } else if (meta === 'energy') {
                const newValue = Math.max(0, Math.min(pet.energy + incr, this.getMaxEnergyForPet(pet)));
                const realIncr = newValue - pet.energy;

                if (realIncr) {
                    data ??= {};
                    data['energy'] = { increment: realIncr };
                    pet.energy += realIncr;
                }
            } else if (meta === 'affection') {
                if (incr > 0) {
                    const affectionIncr = Math.max(
                        0,
                        Math.min(incr, PetAffectionGainPerDay - pet.perDays.affectionGain)
                    );
                    const newValue = Math.max(0, Math.min(pet.affection + affectionIncr, PetAffectionLimit));
                    const realIncr = newValue - pet.affection;

                    if (realIncr) {
                        data ??= {};
                        pet.perDays.affectionGain += realIncr;
                        data['affection'] = { increment: realIncr };
                        pet.affection += realIncr;
                    }
                } else if (incr < 0) {
                    const affectionIncr = Math.min(
                        0,
                        Math.max(incr, -(PetAffectionLossPerDay - pet.perDays.affectionLoss))
                    );
                    const newValue = Math.max(0, Math.min(pet.affection + affectionIncr, PetAffectionLimit));
                    const realIncr = newValue - pet.affection;

                    if (realIncr) {
                        data ??= {};
                        pet.perDays.affectionLoss -= incr;
                        data['affection'] = { increment: realIncr };
                        pet.affection += realIncr;
                    }
                }
            } else if (meta === 'training') {
                let trainingIncr = 0;
                if (incr >= 0) {
                    trainingIncr = Math.max(0, Math.min(incr, PetTrainingGainPerDay - pet.perDays.training));
                } else {
                    trainingIncr = incr;
                }
                const newValue = Math.max(5, Math.min(pet.training + trainingIncr, PetTrainingLimit));
                const realIncr = newValue - pet.training;

                if (realIncr) {
                    data ??= {};
                    if (realIncr >= 0) {
                        pet.perDays.training += realIncr;
                    }
                    data['training'] = { increment: realIncr };
                    pet.training += realIncr;
                }
            }
        }

        return data;
    }

    private formatBaseClientPet(pet: ServerPet): Pet {
        return {
            owner_id: pet.owner_id,
            model: pet.model,
            name: pet.name,
            trait_up: pet.trait_up as PetTraits,
            trait_down: pet.trait_down as PetTraits,
            dead: pet.dead,
            hunger: pet.hunger,
            thirst: pet.thirst,
            energy: pet.energy,
            affection: pet.affection,
            training: pet.training,
            perDays: pet.perDays,
            components: pet.components,
            isPetJob: pet.isPetJob,
        };
    }

    private formatClientPet(pet: ServerPet): ClientPet {
        return this.formatBaseClientPet(pet);
    }

    private formatClientJobPet(pet: ServerJobPet): ClientJobPet {
        const basePet = this.formatBaseClientPet(pet);
        return {
            ...basePet,
            job: pet.job,
        };
    }

    private formatJobPetForKennelMenu(
        pets: {
            id: number;
            job: string;
            owner_id: string;
            model: string;
            name: string;
            trait_up: string;
            trait_down: string;
            dead: boolean;
            hunger: number;
            thirst: number;
            energy: number;
            affection: number;
            training: number;
            perDays: string;
            components: string;
            created_at: Date;
        }[],
        citizenId: string
    ): Array<KennelJobPet> {
        if (!pets) return [];

        const formatedPet: Array<KennelJobPet> = [];
        for (const pet of pets) {
            formatedPet.push({
                id: pet.id,
                job: pet.job as JobType,
                name: pet.name,
                available: !pet.owner_id,
                withPlayer: citizenId === pet.owner_id,
            });
        }
        return formatedPet;
    }

    private formatServerPet(pet: {
        id: number;
        owner_id: string;
        model: string;
        name: string | null;
        trait_up: string;
        trait_down: string;
        dead: boolean;
        hunger: number;
        thirst: number;
        energy: number;
        affection: number;
        training: number;
        perDays: string;
        components: string;
        created_at: Date;
    }): ServerPet {
        return {
            id: pet.id,
            owner_id: pet.owner_id,
            model: pet.model,
            name: pet.name,
            trait_up: pet.trait_up as PetTraits,
            trait_down: pet.trait_down as PetTraits,
            dead: pet.dead,
            hunger: pet.hunger,
            thirst: pet.thirst,
            energy: pet.energy,
            affection: pet.affection,
            training: pet.training,
            perDays: JSON.parse(pet.perDays),
            components: JSON.parse(pet.components),
            isPetJob: false,
        };
    }

    private formatServerJobPet(pet: {
        id: number;
        owner_id: string;
        model: string;
        job: string;
        name: string | null;
        trait_up: string;
        trait_down: string;
        dead: boolean;
        hunger: number;
        thirst: number;
        energy: number;
        affection: number;
        training: number;
        perDays: string;
        components: string;
        created_at: Date;
    }): ServerJobPet {
        return {
            id: pet.id,
            owner_id: pet.owner_id,
            model: pet.model,
            job: pet.job as JobType,
            name: pet.name,
            trait_up: pet.trait_up as PetTraits,
            trait_down: pet.trait_down as PetTraits,
            dead: pet.dead,
            hunger: pet.hunger,
            thirst: pet.thirst,
            energy: pet.energy,
            affection: pet.affection,
            training: pet.training,
            perDays: JSON.parse(pet.perDays),
            components: JSON.parse(pet.components),
            isPetJob: true,
        };
    }

    public getDefaultPerDaysMetaData(): PetResetMeta {
        return {
            escape: false,
            renamed: false,
            affectionGain: 0,
            affectionLoss: 0,
            training: 0,
            lastAffectionLossThirst: new Date().getTime(),
            lastAffectionLossHunger: new Date().getTime(),
            lastAffectionGainThirst: new Date().getTime(),
            lastAffectionGainHunger: new Date().getTime(),
            lastAffectionGainOnPet: new Date().getTime(),
            lastTrainingGain: new Date().getTime(),
        };
    }

    @OnEvent(ServerEvent.PET_USE_FOOD)
    async usePetFood(source: number, inventoryItem: InventoryItem, isPetJob: boolean) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return;

        const pet = isPetJob ? this.playerJobPets[player.citizenid] : this.playerPets[player.citizenid];
        if (!pet) return;

        const foodMeta = petFood[inventoryItem.name];

        if (!foodMeta) return;

        if (inventoryItem.name.startsWith('kibble') && pet.hunger >= PetFoodGiveLimit) {
            this.notifier.notify(
                source,
                `${pet.name || `Ton animal`} n'a pas faim, tu essayes de le ~y~gaver~s~ ?`,
                'info'
            );
            return;
        } else if (!inventoryItem.name.startsWith('kibble') && pet.thirst >= PetFoodGiveLimit) {
            this.notifier.notify(
                source,
                `${pet.name || `Ton animal`} n'a pas soif, il va finir ~y~malade~s~ si tu le forces !`,
                'info'
            );
            return;
        }

        if (!inventory.remove(inventoryItem.name)) return;

        TriggerClientEvent(ClientEvent.ANIMATION_GIVE, source);
        let petDataIncrement: Partial<Record<IncrementalPetData, number>>;
        const now = new Date().getTime();
        if (inventoryItem.name.startsWith('kibble')) {
            this.notifier.notify(
                source,
                `Tu as ~g~nourris~s~ ${pet.name || `ton animal`}. Il a l'air de se sentir ~b~mieux~s~ !`,
                'info'
            );
            petDataIncrement = { hunger: foodMeta.hunger };
            if (foodMeta.affection) {
                const hungerTimeDiff = now - pet.perDays.lastAffectionGainHunger;
                if (hungerTimeDiff > PetAffectGainFoodTimeDiff) {
                    const affectionIncr = this.getPetAffectionIncreament(pet, foodMeta.affection);
                    petDataIncrement.affection = affectionIncr;
                    pet.perDays.lastAffectionGainHunger = now;
                }
            }
        } else {
            this.notifier.notify(
                source,
                `Tu as ~g~donné à boire~s~ à ${pet.name || `ton animal`}. Il a en a plein ~b~les babines~s~ !`,
                'info'
            );
            petDataIncrement = { thirst: foodMeta.thirst };
            if (foodMeta.affection) {
                const thirstTimeDiff = now - pet.perDays.lastAffectionGainThirst;
                if (thirstTimeDiff > PetAffectGainFoodTimeDiff) {
                    const affectionIncr = this.getPetAffectionIncreament(pet, foodMeta.affection);
                    petDataIncrement.affection = affectionIncr;
                    pet.perDays.lastAffectionGainThirst = now;
                }
            }
        }

        await this.incrementPetData(source, pet.isPetJob, petDataIncrement, Boolean(petDataIncrement.affection));
    }

    @Tick(TickInterval.EVERY_MINUTE)
    async petCoreTick() {
        for (const pet of Object.values(this.playerPets)) {
            const player = this.playerService.getPlayerByCitizenId(pet.owner_id);
            if (!player) {
                delete this.playerPets[pet.owner_id];
                continue;
            }

            if (pet.dead) continue;

            const petDataIncrement: Partial<Record<IncrementalPetData, number>> = {};
            petDataIncrement['hunger'] = -this.getHungerRatePerTick(pet);
            petDataIncrement['thirst'] = -this.getThirstRatePerMinute(pet);

            const now = new Date().getTime();
            const hungerTimeDiff = now - pet.perDays.lastAffectionLossHunger;
            let affectionsLoss = 0;
            if (hungerTimeDiff > PetAffectLostFoodTimeDiff && pet.hunger <= PetAffectionFoodLimit) {
                this.notifier.notify(player.source, `${pet.name || `Ton animal`} est ~r~affamé~s~ !`, 'info');
                affectionsLoss += PetAffectionLostFood;
                pet.perDays.lastAffectionLossHunger = now;
            }

            const thirstTimeDiff = now - pet.perDays.lastAffectionLossThirst;
            if (thirstTimeDiff > PetAffectLostFoodTimeDiff && pet.thirst <= PetAffectionFoodLimit) {
                this.notifier.notify(player.source, `${pet.name || `Ton animal`} est ~r~assoifé~s~ !`, 'info');
                affectionsLoss += PetAffectionLostFood;
                pet.perDays.lastAffectionLossThirst = now;
            }

            if (affectionsLoss) {
                const affectionIncr = this.getPetAffectionIncreament(pet, affectionsLoss);
                petDataIncrement['affection'] = affectionIncr;
            }

            if (pet.energy < this.getMaxEnergyForPet(pet)) {
                petDataIncrement['energy'] = this.getPetEnergyIncrement(pet, PetEnergyRatePerMinute);
            }

            await this.incrementPetData(player.source, pet.isPetJob, petDataIncrement);
        }
    }

    //TODO: Factorise
    @Tick(TickInterval.EVERY_MINUTE)
    async petJobCoreTick() {
        for (const pet of Object.values(this.playerJobPets)) {
            const player = this.playerService.getPlayerByCitizenId(pet.owner_id);
            if (!player) {
                delete this.playerJobPets[pet.owner_id];
                continue;
            }

            if (pet.dead) continue;

            const petDataIncrement: Partial<Record<IncrementalPetData, number>> = {};
            petDataIncrement['hunger'] = -this.getHungerRatePerTick(pet);
            petDataIncrement['thirst'] = -this.getThirstRatePerMinute(pet);

            const now = new Date().getTime();
            const hungerTimeDiff = now - pet.perDays.lastAffectionLossHunger;
            let affectionsLoss = 0;
            if (hungerTimeDiff > PetAffectLostFoodTimeDiff && pet.hunger <= PetAffectionFoodLimit) {
                this.notifier.notify(player.source, `${pet.name || `Ton animal`} est ~r~affamé~s~ !`, 'info');
                affectionsLoss += PetAffectionLostFood;
                pet.perDays.lastAffectionLossHunger = now;
            }

            const thirstTimeDiff = now - pet.perDays.lastAffectionLossThirst;
            if (thirstTimeDiff > PetAffectLostFoodTimeDiff && pet.thirst <= PetAffectionFoodLimit) {
                this.notifier.notify(player.source, `${pet.name || `Ton animal`} est ~r~assoifé~s~ !`, 'info');
                affectionsLoss += PetAffectionLostFood;
                pet.perDays.lastAffectionLossThirst = now;
            }

            if (affectionsLoss) {
                const affectionIncr = this.getPetAffectionIncreament(pet, affectionsLoss);
                petDataIncrement['affection'] = affectionIncr;
            }

            if (pet.energy < this.getMaxEnergyForPet(pet)) {
                petDataIncrement['energy'] = this.getPetEnergyIncrement(pet, PetEnergyRatePerMinute);
            }

            await this.incrementPetData(player.source, pet.isPetJob, petDataIncrement);
        }
    }

    private getHungerRatePerTick(pet: ServerPet): number {
        let traitMultiplier = 1.0;
        if (pet.trait_up == PetTraits.FOOD) {
            traitMultiplier -= PetFoodTraitBonus;
        } else if (pet.trait_down == PetTraits.FOOD) {
            traitMultiplier += PetFoodTraitBonus;
        }
        return PetHungerRatePerMinute * traitMultiplier;
    }

    private getThirstRatePerMinute(pet: ServerPet): number {
        let traitMultiplier = 1.0;
        if (pet.trait_up == PetTraits.FOOD) {
            traitMultiplier -= PetFoodTraitBonus;
        } else if (pet.trait_down == PetTraits.FOOD) {
            traitMultiplier += PetFoodTraitBonus;
        }
        return PetThirstRatePerMinute * traitMultiplier;
    }

    private getPetAffectionIncreament(pet: ServerPet, affection: number) {
        let traitMultiplier = 1.0;
        if (pet.trait_down == PetTraits.AFFECTION || pet.trait_up == PetTraits.AFFECTION) {
            traitMultiplier += PetAffectionTraitBonus;
        }

        return Math.max(0, Math.min(pet.affection + affection * traitMultiplier, PetAffectionLimit)) - pet.affection;
    }

    private getPetTrainingIncreament(pet: ServerPet, training: number): number {
        let traitMultiplier = 1.0;
        if (pet.trait_up == PetTraits.TRAINING) {
            traitMultiplier += PetTrainingTraitBonus;
        } else if (pet.trait_down == PetTraits.TRAINING) {
            traitMultiplier -= PetTrainingTraitBonus;
        }

        return Math.max(0, Math.min(pet.training + training * traitMultiplier, PetTrainingLimit)) - pet.training;
    }

    private getMaxEnergyForPet(pet: ServerPet): number {
        return GetMaxEnergyForPet(pet);
    }

    private getPetEnergyIncrement(pet: ServerPet, energy: number): number {
        return Math.max(0, Math.min(pet.energy + energy, this.getMaxEnergyForPet(pet))) - pet.energy;
    }
}
