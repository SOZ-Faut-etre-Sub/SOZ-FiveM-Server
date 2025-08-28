import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { AnimalProvider } from '@public/server/animal/animal.provider';
import { PrismaService } from '@public/server/database/prisma.service';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { Notifier } from '@public/server/notifier';
import { PlayerHealthProvider } from '@public/server/player/player.health.provider';
import { PlayerMoneyService } from '@public/server/player/player.money.service';
import { PlayerService } from '@public/server/player/player.service';
import {
    PetDrawable,
    petInShop,
    PetMaxEnergy,
    PetMaxEnergyTraitBonus,
    PetTraits,
    PlayerStressOnAbandon,
} from '@public/shared/animal';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobType, PUBLIC_SERVICES } from '@public/shared/job';
import { isErr } from '@public/shared/result';
import { TaxType } from '@public/shared/tax';

@Provider()
export class AnimalShopProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(PlayerHealthProvider)
    private playerHealthProvider: PlayerHealthProvider;

    @Inject(AnimalProvider)
    private animalProvider: AnimalProvider;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    @OnEvent(ServerEvent.PET_SHOP_BUY_ANIMAL)
    public async onPetShopBuyPet(source: number, pet: petInShop, petDrawables: PetDrawable[], job: JobType | null) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        if (job === null) {
            const ownedPet = await this.prismaService.pet.findFirst({
                where: {
                    owner_id: player.citizenid,
                },
            });
            if (ownedPet) {
                this.notifier.notify(
                    source,
                    `Vous possedez déjà ~b~${ownedPet.name || `un animal`}~s~. ~r~ABANDONNE~s~ le si tu en souhaites un autre (pauvre bête).`,
                    'info'
                );
                return;
            }
        }

        if (
            !(await this.playerMoneyService.buy(
                source,
                pet.price,
                PUBLIC_SERVICES.includes(job) ? null : TaxType.SERVICE
            ))
        ) {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent.", 'error');
            return;
        }

        const [traitUp, traitDown] = this.getTraits();
        const basePet = {
            model: pet.model,
            trait_up: traitUp,
            trait_down: traitDown,
            hunger: 100,
            thirst: 100,
            energy: PetMaxEnergy - PetMaxEnergyTraitBonus,
            affection: 50,
            training: 5,
            perDays: JSON.stringify(this.animalProvider.getDefaultPerDaysMetaData()),
            components: JSON.stringify(petDrawables),
        };

        if (job) {
            const newPet = {
                ...basePet,
                job: job,
            };
            await this.prismaService.job_pet.create({ data: newPet });
            this.notifier.notify(
                source,
                "Tu as  ~g~acheté~s~ un animal pour ton entreprise ! Reviens me voir si tu souhaites l'emporter avec toi."
            );
        } else {
            const newPet = {
                ...basePet,
                owner_id: player.citizenid,
            };
            await this.prismaService.pet.create({ data: newPet });
            const inventory = await this.inventoryFactory.getPlayerInventory(source);
            if (!inventory || isErr(inventory.add('whistle_basic', 1))) {
                this.notifier.notify(
                    source,
                    `Je n'ai pas pu te donner ~b~ton sifflet~s~ de dressage, passe à la boutique pour t'en ~y~acheter~s~ un.`,
                    'error'
                );
            }

            this.notifier.notify(
                source,
                "Tu as  ~g~acheté~s~ un animal, utilise ~b~ton sifflet~s~ pour l'appeler ! Reviens me voir pour lui donner un nom."
            );

            this.notifier.notify(source, "Tu peux donner des ordres à ton animal à l'aide du Menu ~g~O~s~ !", 'info');
            TriggerClientEvent(ClientEvent.PET_SYNC_ANIMAL, source, true);
        }
    }

    @OnEvent(ServerEvent.PET_SHOP_ABANDON_ANIMAL)
    async earaseAnimal(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        await this.prismaService.pet.deleteMany({
            where: {
                owner_id: player.citizenid,
            },
        });

        this.playerHealthProvider.increaseStress(source, PlayerStressOnAbandon);
        this.notifier.notify(
            source,
            `Vous avez ~r~abandonné~s~ votre animal, son regard était triste, et vous vous sentez ~r~stressé~s~..`
        );
        TriggerClientEvent(ClientEvent.PET_SYNC_ANIMAL, source, true);
    }

    private getTraits(): [PetTraits, PetTraits] {
        const values = Object.values(PetTraits);
        const firstIndex = Math.floor(Math.random() * values.length);

        let secondIndex: number;
        do {
            secondIndex = Math.floor(Math.random() * values.length);
        } while (secondIndex === firstIndex);

        return [values[firstIndex], values[secondIndex]] as [PetTraits, PetTraits];
    }
}
