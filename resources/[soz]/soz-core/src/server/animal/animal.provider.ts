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
    ClientPet,
    GetMaxEnergyForPet,
    IncrementalPetData,
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
    PetResetMeta,
    PetThirstRatePerMinute,
    PetTrainingGainPerDay,
    PetTrainingGainPerOrder,
    PetTrainingLimit,
    PetTrainingTraitBonus,
    PetTraits,
    PlayerStressOnDeath,
    ServerPet,
    whistles,
} from '@public/shared/animal';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { ADD_ERROR_MESSAGE, InventoryItem } from '@public/shared/inventory';
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
    private spawnedPets: Record<number, number> = {};

    @Once()
    public onStart() {
        for (const whistle of whistles) {
            this.itemService.setItemUseCallback(whistle, this.useWhistle.bind(this));
        }
    }

    @Rpc(RpcServerEvent.ADMIN_GET_PLAYER_PET)
    public async onAdminGetPlayerPet(source: number, citizenId: string): Promise<ServerPet> {
        if (!this.permissionService.isStaff(source)) {
            return null;
        }

        return await this.getPet(citizenId, false);
    }

    @Rpc(RpcServerEvent.PET_GET_ANIMAL)
    public async onPetGetAnimal(source: number, force: boolean): Promise<ClientPet> {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const serverPet = await this.getPet(player.citizenid, force);
        if (!serverPet) return null;

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

    @Rpc(RpcServerEvent.PET_CONSUME_BALL)
    public async onPetConsumeBall(source: number): Promise<boolean> {
        const player = this.playerService.getPlayer(source);
        if (!player) return false;

        const pet = this.playerPets[player.citizenid];
        if (!pet) return false;

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return false;

        return inventory.remove(PET_BALL_OBJECT);
    }

    private async getPet(citizenId: string, force: boolean): Promise<ServerPet> {
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

    private async udpatePetDb(player: PlayerData, data: Record<string, any>, sync: boolean = true) {
        const pet = this.playerPets[player.citizenid];
        if (!pet) return;

        await this.prismaService.pet.update({
            where: { id: pet.id },
            data: data,
        });
        if (sync) TriggerClientEvent(ClientEvent.PET_SYNC_ANIMAL, player.source);
    }

    public async incrementPetData(
        source: number,
        dataIncrement: Partial<Record<IncrementalPetData, number>>,
        withPerDays: boolean = true
    ) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const pet = this.playerPets[player.citizenid];
        if (!pet) return;

        const data = this.processIncrementData(pet, dataIncrement);
        if (data) {
            if (withPerDays) {
                data.perDays = JSON.stringify(pet.perDays);
            }
            await this.udpatePetDb(player, data);
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
    public async setPetDeath(source: number, death: boolean) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const pet = this.playerPets[player.citizenid];
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
                    `Tu n'as pas assez d'argent, pauvre animal.. Reviens avec $~b~${await this.priceService.getPrice(PetHealPrice, TaxType.SERVICE)}~s~.`,
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
                `Merci pour tes $~b~${await this.priceService.getPrice(PetHealPrice, TaxType.SERVICE)}~s~. J'ai ~g~soigné~s~ ton animal ! Prend en bien plus soin à l'avenir, car il risque de ~y~s'enfuir~s~ si tu ne fais pas attention à lui.`,
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
        await this.udpatePetDb(player, data);
    }

    @OnEvent(ServerEvent.PET_AFFECTION_LOSS_DISTANCE)
    public async onPetAffectionLossDistance(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const pet = this.playerPets[player.citizenid];
        if (!pet) return;

        const data = this.processIncrementData(pet, {
            affection: this.getPetAffectionIncreament(pet, PetAffectionLostDistance),
        });
        data.perDays = JSON.stringify(pet.perDays);
        await this.udpatePetDb(player, data);
    }

    @OnEvent(ServerEvent.PET_AFFECTION_GAIN_PET)
    public async onPetAffectionGainPet(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const pet = this.playerPets[player.citizenid];
        if (!pet) return;

        const now = new Date().getTime();
        const petTimeDiff = now - pet.perDays.lastAffectionGainOnPet;
        if (petTimeDiff <= PetAffectionGainOnPetTimeDiff) {
            return;
        }

        pet.perDays.lastAffectionGainOnPet = now;
        const data = this.processIncrementData(pet, {
            affection: this.getPetAffectionIncreament(pet, PetAffectionGainOnPet),
        });
        data.perDays = JSON.stringify(pet.perDays);
        await this.udpatePetDb(player, data);
    }

    @OnEvent(ServerEvent.PET_EXECUTED_ORDER)
    public async onPetExecutedOrder(source: number, success: boolean) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const pet = this.playerPets[player.citizenid];
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

        const data = this.processIncrementData(pet, dataIncrement);
        if (data.training) {
            this.notifier.notify(
                source,
                `Le dressage de ton animal progresse, passant de ~g~${pet.training.toFixed(2)}~s~ à ~g~${(pet.training + dataIncrement.training).toFixed(2)}~s~.`,
                'info'
            );
        }
        if (success && dataIncrement.training) data.perDays = JSON.stringify(pet.perDays);
        await this.udpatePetDb(player, data);
    }

    @OnEvent(ServerEvent.PET_ADMIN_SET_DEATH)
    public async adminSetPetDeath(source: number, citizenId: string, death: boolean) {
        const player = this.playerService.getPlayerByCitizenId(citizenId);
        if (!player) return;

        const pet = this.playerPets[player.citizenid];
        if (!pet) return;

        pet.dead = death;
        await this.udpatePetDb(player, { dead: death });
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

    private processIncrementData(
        pet: ServerPet,
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
                const trainingIncr = Math.max(0, Math.min(incr, PetTrainingGainPerDay - pet.perDays.training));
                const newValue = Math.max(0, Math.min(pet.training + trainingIncr, PetTrainingLimit));
                const realIncr = newValue - pet.training;

                if (realIncr) {
                    data ??= {};
                    pet.perDays.training += realIncr;
                    data['training'] = { increment: realIncr };
                    pet.training += realIncr;
                }
            }
        }

        return data;
    }

    private formatClientPet(pet: ServerPet): ClientPet {
        return {
            owner_id: pet.owner_id,
            model: pet.model,
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
        };
    }

    private formatServerPet(pet: {
        id: number;
        owner_id: string;
        model: string;
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
        };
    }

    public getDefaultPerDaysMetaData(): PetResetMeta {
        return {
            escape: false,
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

    async useWhistle(source: number) {
        TriggerClientEvent(ClientEvent.PET_USE_WHISTLE, source);
    }

    @OnEvent(ServerEvent.PET_USE_FOOD)
    async usePetFood(source: number, inventoryItem: InventoryItem) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return;

        const pet = this.playerPets[player.citizenid];
        if (!pet) return;

        const foodMeta = petFood[inventoryItem.name];

        if (!foodMeta) return;

        if (inventoryItem.name.startsWith('kibble') && pet.hunger >= PetFoodGiveLimit) {
            this.notifier.notify(source, "Ton animal n'a pas faim, tu essayes de le ~y~gaver~s~ ?", 'info');
            return;
        } else if (!inventoryItem.name.startsWith('kibble') && pet.thirst >= PetFoodGiveLimit) {
            this.notifier.notify(source, "Ton animal n'a pas soif, il va finir ~y~malade~s~ si tu le forces !", 'info');
            return;
        }

        if (!inventory.remove(inventoryItem.name)) return;

        TriggerClientEvent(ClientEvent.ANIMATION_GIVE, source);
        let petDataIncrement: Partial<Record<IncrementalPetData, number>>;
        const now = new Date().getTime();
        if (inventoryItem.name.startsWith('kibble')) {
            this.notifier.notify(
                source,
                "Tu as ~g~nourris~s~ ton animal de compagnie. Il a l'air de se sentir ~b~mieux~s~ !",
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
                'Tu as ~g~donné à boire~s~ à ton animal de compagnie. Il a en a plein ~b~les babines~s~ !',
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

        await this.incrementPetData(source, petDataIncrement, Boolean(petDataIncrement.affection));
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
                this.notifier.notify(player.source, 'Ton animal est ~r~affamé~s~ !', 'info');
                affectionsLoss += PetAffectionLostFood;
                pet.perDays.lastAffectionLossHunger = now;
            }

            const thirstTimeDiff = now - pet.perDays.lastAffectionLossThirst;
            if (thirstTimeDiff > PetAffectLostFoodTimeDiff && pet.thirst <= PetAffectionFoodLimit) {
                this.notifier.notify(player.source, 'Ton animal est ~r~assoifé~s~ !', 'info');
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

            await this.incrementPetData(player.source, petDataIncrement);
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
