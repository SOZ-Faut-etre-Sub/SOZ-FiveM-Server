import { FDO, JobType } from '@public/shared/job';
import { Vector3 } from '@public/shared/polyzone/vector';

export const TENNIS_BALL_MODEL = 'prop_tennis_ball';
export const PET_BALL_OBJECT = 'pet_ball';
export type PetResetMeta = {
    escape: boolean;
    renamed: boolean;
    affectionGain: number;
    affectionLoss: number;
    training: number;
    lastAffectionLossThirst: number;
    lastAffectionLossHunger: number;
    lastAffectionGainThirst: number;
    lastAffectionGainHunger: number;
    lastAffectionGainOnPet: number;
    lastTrainingGain: number;
};

export enum PetBehavior {
    PASSIVE = 'PASSIVE',
    DEFENSIVE = 'DEFENSIVE',
    AGGRESIVE = 'AGGRESIVE',
}

export const whistles = [
    'whistle_basic',
    'whistle_steel',
    'whistle_oak',
    'whistle_carved',
    'whistle_clay',
    'whistle_tin',
    'whistle_engraved',
    'whistle_goldsmith',
    'whistle_lunar',
];

export const k9_whistles = ['whistle_bcso', 'whistle_lspd', 'whistle_sasp'];
export const k9_model = 'german_shepherd';

export enum PetOrder {
    FOLLOW = 'FOLLOW',
    STOP = 'STOP',
    SIT = 'SIT',
    LAY_DOWN = 'LAY_DOWN',
    PET = 'PET',
    TRICK = 'TRICK',
    CATCH = 'CATCH',
    SEARCH = 'SEARCH',
}

export const petOrderMeta: Record<PetOrder, { label: string; icon: any }> = {
    [PetOrder.FOLLOW]: { label: 'Suis-moi', icon: 'follow' },
    [PetOrder.STOP]: { label: 'Reste ici', icon: 'stop' },
    [PetOrder.SIT]: { label: 'Assis', icon: 'sit' },
    [PetOrder.LAY_DOWN]: { label: 'Couché', icon: 'lay' },
    [PetOrder.PET]: { label: 'Caresse', icon: 'pet' },
    [PetOrder.TRICK]: { label: 'Fais ton numéro', icon: 'trick' },
    [PetOrder.CATCH]: { label: 'Va chercher', icon: 'catch' },
    [PetOrder.SEARCH]: { label: 'Cherche', icon: 'search' },
};
export const orderJobRestriction: Record<PetOrder, Array<JobType>> = {
    [PetOrder.FOLLOW]: null,
    [PetOrder.STOP]: null,
    [PetOrder.SIT]: null,
    [PetOrder.LAY_DOWN]: null,
    [PetOrder.PET]: null,
    [PetOrder.TRICK]: null,
    [PetOrder.CATCH]: null,
    [PetOrder.SEARCH]: FDO,
};

export type petAnimationType =
    | 'retriever'
    | 'rottweiler'
    | 'pug'
    | 'cat'
    | 'boar'
    | 'cow'
    | 'pig'
    | 'rabbit'
    | 'hen'
    | 'k9';

export const petBreedToOrderType: Record<petBreed, petAnimationType> = {
    a_c_husky: 'retriever',
    a_c_retriever: 'retriever',
    a_c_westy: 'pug',
    a_c_rottweiler: 'rottweiler',
    a_c_shepherd: 'rottweiler',
    a_c_pug: 'pug',
    a_c_poodle: 'pug',
    a_c_cat_01: 'cat',
    a_c_boar: 'boar',
    a_c_cow: 'cow',
    a_c_pig: 'pig',
    a_c_rabbit_01: 'rabbit',
    a_c_hen: 'hen',
    [k9_model]: 'k9',
};

export const PetOrderAnimationFlag: Partial<Record<PetOrder, number>> = {
    [PetOrder.SIT]: 10,
    [PetOrder.LAY_DOWN]: 10,
    [PetOrder.PET]: 5,
    [PetOrder.TRICK]: 1,
    [PetOrder.CATCH]: null,
    [PetOrder.SEARCH]: 8,
};

export const petOrderModelAnimation: Record<
    PetOrder,
    Record<petAnimationType, boolean | Array<{ dictionary: string; name: string }>>
> = {
    [PetOrder.FOLLOW]: {
        retriever: true,
        rottweiler: true,
        pug: true,
        cat: true,
        boar: true,
        cow: true,
        pig: true,
        rabbit: true,
        hen: true,
        k9: true,
    },
    [PetOrder.STOP]: {
        retriever: true,
        rottweiler: true,
        pug: true,
        cat: true,
        boar: true,
        cow: true,
        pig: true,
        rabbit: true,
        hen: true,
        k9: true,
    },
    [PetOrder.SIT]: {
        retriever: [
            { dictionary: 'creatures@retriever@amb@world_dog_sitting@idle_a', name: 'idle_a' },
            { dictionary: 'creatures@retriever@amb@world_dog_sitting@idle_a', name: 'idle_b' },
            { dictionary: 'creatures@retriever@amb@world_dog_sitting@idle_a', name: 'idle_c' },
            { dictionary: 'creatures@retriever@amb@world_dog_sitting@base', name: 'base' },
        ],
        rottweiler: [
            { dictionary: 'creatures@rottweiler@amb@world_dog_sitting@idle_a', name: 'idle_a' },
            { dictionary: 'creatures@rottweiler@amb@world_dog_sitting@idle_a', name: 'idle_b' },
            { dictionary: 'creatures@rottweiler@amb@world_dog_sitting@idle_a', name: 'idle_c' },
            { dictionary: 'creatures@rottweiler@amb@world_dog_sitting@base', name: 'base' },
        ],
        pug: [
            { dictionary: 'creatures@pug@amb@world_dog_sitting@idle_a', name: 'idle_a' },
            { dictionary: 'creatures@pug@amb@world_dog_sitting@idle_a', name: 'idle_b' },
            { dictionary: 'creatures@pug@amb@world_dog_sitting@idle_a', name: 'idle_c' },
            { dictionary: 'creatures@pug@amb@world_dog_sitting@base', name: 'base' },
        ],
        cat: false,
        boar: false,
        cow: false,
        pig: false,
        rabbit: false,
        hen: false,
        k9: [
            { dictionary: 'creatures@rottweiler@amb@world_dog_sitting@idle_a', name: 'idle_a' },
            { dictionary: 'creatures@rottweiler@amb@world_dog_sitting@idle_a', name: 'idle_b' },
            { dictionary: 'creatures@rottweiler@amb@world_dog_sitting@idle_a', name: 'idle_c' },
            { dictionary: 'creatures@rottweiler@amb@world_dog_sitting@base', name: 'base' },
        ],
    },
    [PetOrder.LAY_DOWN]: {
        retriever: [{ dictionary: 'creatures@rottweiler@amb@sleep_in_kennel@', name: 'sleep_in_kennel' }],
        rottweiler: [{ dictionary: 'creatures@rottweiler@amb@sleep_in_kennel@', name: 'sleep_in_kennel' }],
        pug: [
            { dictionary: 'creatures@pug@move', name: 'dead_right' },
            { dictionary: 'creatures@pug@move', name: 'dead_left' },
        ],
        cat: [
            { dictionary: 'creatures@cat@amb@world_cat_sleeping_ground@base', name: 'base' },
            { dictionary: 'creatures@cat@amb@world_cat_sleeping_ground@idle_a', name: 'idle_a' },
            { dictionary: 'creatures@cat@amb@world_cat_sleeping_ledge@base', name: 'base' },
            { dictionary: 'creatures@cat@amb@world_cat_sleeping_ledge@idle_a', name: 'idle_a' },
        ],
        boar: false,
        cow: false,
        pig: false,
        rabbit: false,
        hen: false,
        k9: [{ dictionary: 'creatures@rottweiler@amb@sleep_in_kennel@', name: 'sleep_in_kennel' }],
    },
    [PetOrder.PET]: {
        retriever: [{ dictionary: 'creatures@rottweiler@tricks@', name: 'petting_chop' }],
        rottweiler: [{ dictionary: 'creatures@rottweiler@tricks@', name: 'petting_chop' }],
        pug: [{ dictionary: 'creatures@pug@amb@world_dog_barking@idle_a', name: 'idle_a' }],
        cat: [{ dictionary: 'creatures@cat@move', name: 'idle' }],
        boar: [{ dictionary: 'creatures@boar@amb@world_boar_grazing@idle_a', name: 'idle_b' }],
        cow: [{ dictionary: 'creatures@cow@amb@world_cow_grazing@idle_a', name: 'idle_b' }],
        pig: [{ dictionary: 'creatures@pig@amb@world_pig_grazing@idle_a', name: 'idle_b' }],
        rabbit: [{ dictionary: 'creatures@rabbit@amb@world_rabbit_eating@idle_a', name: 'idle_b' }],
        hen: [{ dictionary: 'creatures@hen@amb@world_hen_standing@idle_a', name: 'idle_b' }],
        k9: [{ dictionary: 'creatures@rottweiler@tricks@', name: 'petting_chop' }],
    },
    [PetOrder.TRICK]: {
        retriever: [
            { dictionary: 'creatures@rottweiler@indication@', name: 'indicate_high' },
            { dictionary: 'creatures@rottweiler@indication@', name: 'indicate_a"head' },
            { dictionary: 'creatures@rottweiler@indication@', name: 'indicate_low' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'beg_loop' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'beg_loop_right' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'beg_loop_left' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'paw_right_loop' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'paw_right_loop_right' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'paw_right_loop_left' },
        ],
        rottweiler: [
            { dictionary: 'creatures@rottweiler@indication@', name: 'indicate_high' },
            { dictionary: 'creatures@rottweiler@indication@', name: 'indicate_ahead' },
            { dictionary: 'creatures@rottweiler@indication@', name: 'indicate_low' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'beg_loop' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'beg_loop_right' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'beg_loop_left' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'paw_right_loop' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'paw_right_loop_right' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'paw_right_loop_left' },
        ],
        pug: [
            { dictionary: 'creatures@pug@move', name: 'idle_turn_r' },
            { dictionary: 'creatures@pug@move', name: 'idle_turn_l' },
        ],
        cat: false,
        boar: false,
        cow: false,
        pig: false,
        rabbit: false,
        hen: false,
        k9: [
            { dictionary: 'creatures@rottweiler@indication@', name: 'indicate_high' },
            { dictionary: 'creatures@rottweiler@indication@', name: 'indicate_ahead' },
            { dictionary: 'creatures@rottweiler@indication@', name: 'indicate_low' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'beg_loop' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'beg_loop_right' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'beg_loop_left' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'paw_right_loop' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'paw_right_loop_right' },
            { dictionary: 'creatures@rottweiler@tricks@', name: 'paw_right_loop_left' },
        ],
    },
    [PetOrder.CATCH]: {
        retriever: true,
        rottweiler: true,
        pug: true,
        cat: true,
        boar: true,
        cow: true,
        pig: true,
        rabbit: true,
        hen: true,
        k9: true,
    },
    [PetOrder.SEARCH]: {
        retriever: false,
        rottweiler: false,
        pug: false,
        cat: false,
        boar: false,
        cow: false,
        pig: false,
        rabbit: false,
        hen: false,
        k9: [
            { dictionary: 'creatures@rottweiler@indication@', name: 'indicate_high' },
            { dictionary: 'creatures@rottweiler@indication@', name: 'indicate_ahead' },
            { dictionary: 'creatures@rottweiler@indication@', name: 'indicate_low' },
        ],
    },
};

export const petOrderSitInCarAnimation: Record<petAnimationType, { dictionary: string; name: string }> = {
    retriever: { dictionary: 'creatures@retriever@amb@world_dog_sitting@base', name: 'base' },
    rottweiler: { dictionary: 'creatures@rottweiler@amb@world_dog_sitting@base', name: 'base' },
    pug: { dictionary: 'creatures@pug@amb@world_dog_sitting@base', name: 'base' },
    cat: { dictionary: 'creatures@cat@amb@world_cat_sleeping_ground@base', name: 'base' },
    boar: null,
    cow: null,
    pig: null,
    rabbit: { dictionary: 'creatures@rabbit@amb@world_rabbit_eating@idle_a', name: 'idle_c' },
    hen: { dictionary: 'creatures@hen@amb@world_hen_standing@base', name: 'base' },
    k9: { dictionary: 'creatures@rottweiler@amb@world_dog_sitting@base', name: 'base' },
};

export type PetDrawable = {
    component: number;
    drawable: number;
    texture: number;
};

// Food
export const PetThirstRatePerMinute = 0.33; // ~5h
export const PetHungerRatePerMinute = 0.25; // ~6h
export const PetFoodTraitBonus = 0.2;
export const PetFoodLimit = 100;
export const PetFoodGiveLimit = 75;

// Stress
export const PlayerStressOnAbandon = 40;
export const PlayerStressOnDeath = 15;

// Energy
export const PetMaxEnergy = 12;
export const PetMaxEnergyTraitBonus = 2;
export const PetEnergyPerAction = -1;
export const PetEnergyRatePerMinute = 1;
export const GetMaxEnergyForPet = (pet: ClientPet | ServerPet): number => {
    let maxEnergy = PetMaxEnergy;
    if (pet.trait_up == PetTraits.ENERGY) {
        maxEnergy += PetMaxEnergyTraitBonus;
    } else if (pet.trait_down == PetTraits.ENERGY) {
        maxEnergy -= PetMaxEnergyTraitBonus;
    }
    return maxEnergy;
};

// Affection
export const PetAffectionLimit = 100;
export const PetAffectionEscapeLimit = 25;
export const PetAffectionLossPerDay = 25;
export const PetAffectionGainPerDay = 20;
export const PetAffectionFoodLimit = 25;
export const PetAffectionLostFood = -0.5;
export const PetAffectLostFoodTimeDiff = 5 * 60 * 1000; // every 5 minutes
export const PetAffectGainFoodTimeDiff = 30 * 60 * 1000; // every 30 minutes
export const PetAffectionLostDeath = -10;
export const PetAffectionLostDistance = -2.5;
export const PetAffectionGainOnPet = 2;
export const PetAffectionGainOnPetTimeDiff = 15 * 60 * 1000; // every 15 minutes
export const PetAffectionTraitBonus = 0.1;

// Training
export const PetTrainingGainPerOrder = 1;
export const PetTrainingGainTimeDiff = 10 * 60 * 1000; // every 10 minutes
export const PetTrainingGainPerDay = 10;
export const PetTrainingLimit = 100;
export const PetTrainingTraitBonus = 0.2;
export const PetTrainingMinimalExecOrderChance = 0.25;

// Other
export const PetDistanceOrderTargetDistance = 12;
export const PetDistanceReturnHome = 110;
export const PetDistanceForceFollowPlayer = 70;
export const PetDistancePetAttackOnShooting = 40;
export const PetDistanceOrderPedDeltaTrigger = 1.5;
export const PetDistanceOrderVehicleDeltaTrigger = 3.5;
export const PetDistanceUseFood = 3.0;
export const PetDistanceFollow = 2.0;
export const PetDistanceSearch = 12;
export const PetDistanceSearchOnTargetPed = 1.0;
export const PetDistanceSearchOnTargetVehicle = 2.0;
export const PetDistanceAttackOnTarget = 2.0;
export const PetDistanceCatchTheBall = 1.0;
export const PetHealPrice = 5_000;
export const PetFoodOnHeal = 40;
export const PetNamePrice = 10_000;

export type IncrementalPetData = 'hunger' | 'thirst' | 'energy' | 'affection' | 'training';
export const increamentalPetMeta: Set<IncrementalPetData> = new Set([
    'hunger',
    'thirst',
    'energy',
    'affection',
    'training',
]);
export const PetMetaLabel: Record<IncrementalPetData, string> = {
    hunger: 'Faim',
    thirst: 'Soif',
    energy: 'Energie',
    affection: 'Affection',
    training: 'Entrainement',
};

export type IncrementalPetResetMetadataType = 'affectionGain' | 'affectionLoss' | 'training';
export const incrementalPetResetMetadata: Set<IncrementalPetResetMetadataType> = new Set([
    'affectionGain',
    'affectionLoss',
    'training',
]);
export const PetResetMetaLabel: Record<IncrementalPetResetMetadataType, { label: string; max: number }> = {
    affectionGain: { label: "Gain d'affection", max: PetAffectionGainPerDay },
    affectionLoss: { label: "Perte d'affection", max: PetAffectionLossPerDay },
    training: { label: "Gain d'entrainement", max: PetTrainingGainPerDay },
};

export enum PetTraits {
    ENERGY = 'ENERGY',
    AFFECTION = 'AFFECTION',
    TRAINING = 'TRAINING',
    FOOD = 'FOOD',
}

export const positiveTraitLabel: Record<PetTraits, string> = {
    [PetTraits.ENERGY]: 'Actif',
    [PetTraits.TRAINING]: 'Génie',
    [PetTraits.FOOD]: 'Frugal',
    [PetTraits.AFFECTION]: 'Affectif',
};
export const negativeTraitLabel: Record<PetTraits, string> = {
    [PetTraits.ENERGY]: 'Paresseux',
    [PetTraits.TRAINING]: 'Idiot',
    [PetTraits.FOOD]: 'Glouton',
    [PetTraits.AFFECTION]: 'Distant',
};

export const getAffectionLabel = (affection: number) => {
    if (affection >= 100) return 'Harmonie totale';
    if (affection >= 75) return 'Dévotion';
    if (affection >= 50) return 'Attachement';
    if (affection >= 25) return 'Curiosité';
    return 'Méfiance';
};

export const getTrainingLabel = (training: number) => {
    if (training >= 100) return 'Obéissance totale';
    if (training >= 75) return 'Maîtrise';
    if (training >= 50) return 'Discipline';
    if (training >= 25) return 'Apprentissage';
    return 'Sauvage';
};

export type Pet = {
    owner_id: string;
    model: string;
    name: string | null;
    trait_up: PetTraits;
    trait_down: PetTraits;
    dead: boolean;
    hunger: number;
    thirst: number;
    energy: number;
    affection: number;
    training: number;
    perDays: PetResetMeta;
    components: PetDrawable[];
    isPetJob: boolean;
};

export type ServerPet = Pet & {
    id: number;
};

export type ServerJobPet = ServerPet & {
    job: JobType;
};

export type AnyServerPet = ServerJobPet | ServerPet;

export type ClientPet = Pet & {
    entity?: number;
};

export type ClientJobPet = ClientPet & {
    entity?: number;
    job: JobType;
};

export type KennelJobPet = {
    id: number;
    job: JobType;
    name: string;
    available: boolean;
    withPlayer: boolean;
};

export type AnyClientPet = ClientJobPet | ClientPet;

export const petShopSpawnPosition: Vector3 = [2401.08, 5026.29, 45.02];
export const petShopCameraOffset = [1.0, -3.0, 1.5];
export const petShopCameraTargetOffset = 0.5;

export type petInShop = {
    model: string;
    label: string;
    type: string;
    price: number;
    jobs?: Array<JobType>;
};

type petFoodName = 'kibble_1' | 'kibble_2' | 'kibble_3' | 'pet_drink_1' | 'pet_drink_2' | 'pet_drink_3';
export const petFood: Record<petFoodName, { hunger?: number; thirst?: number; affection?: number }> = {
    kibble_1: { hunger: 60 },
    kibble_2: { hunger: 60, affection: 1 },
    kibble_3: { hunger: 60, affection: 2 },
    pet_drink_1: { thirst: 60 },
    pet_drink_2: { thirst: 60, affection: 1 },
    pet_drink_3: { thirst: 60, affection: 2 },
};

type petBreed =
    | 'a_c_husky'
    | 'a_c_retriever'
    | 'a_c_westy'
    | 'a_c_rottweiler'
    | 'a_c_shepherd'
    | 'a_c_pug'
    | 'a_c_poodle'
    | 'a_c_cat_01'
    | 'a_c_boar'
    | 'a_c_cow'
    | 'a_c_pig'
    | 'a_c_rabbit_01'
    | 'a_c_hen'
    | 'german_shepherd';

export type PetShopMenuData = {
    job: JobType | null;
    pets: Array<petInShop>;
};
export type PetJobKennelMenuData = {
    pets: Array<KennelJobPet>;
};

export const petShopContent: Record<petBreed, petInShop> = {
    a_c_husky: {
        model: 'a_c_husky',
        label: 'Husky',
        type: 'Chien',
        price: 60_000,
    },
    a_c_retriever: {
        model: 'a_c_retriever',
        label: 'Retriever',
        type: 'Chien',
        price: 75_000,
    },
    a_c_westy: {
        model: 'a_c_westy',
        label: 'Westie',
        type: 'Chien',
        price: 25_000,
    },
    a_c_rottweiler: {
        model: 'a_c_rottweiler',
        label: 'Rottweiler',
        type: 'Chien',
        price: 67_500,
    },
    a_c_shepherd: {
        model: 'a_c_shepherd',
        label: 'Border Collie',
        type: 'Chien',
        price: 45_000,
    },
    a_c_pug: {
        model: 'a_c_pug',
        label: 'Carlin',
        type: 'Chien',
        price: 35_000,
    },
    a_c_poodle: {
        model: 'a_c_poodle',
        label: 'Caniche',
        type: 'Chien',
        price: 52_500,
    },
    a_c_cat_01: {
        model: 'a_c_cat_01',
        label: 'Chat de rue',
        type: 'Chat',
        price: 20_000,
    },
    a_c_boar: {
        model: 'a_c_boar',
        label: 'Sanglier',
        type: 'Ferme',
        price: 20_000,
    },
    a_c_cow: {
        model: 'a_c_cow',
        label: 'Vache',
        type: 'Ferme',
        price: 20_000,
    },
    a_c_pig: {
        model: 'a_c_pig',
        label: 'Cochon',
        type: 'Ferme',
        price: 20_000,
    },
    a_c_rabbit_01: {
        model: 'a_c_rabbit_01',
        label: 'Lapin',
        type: 'Ferme',
        price: 10_000,
    },
    a_c_hen: {
        model: 'a_c_hen',
        label: 'Poule',
        type: 'Ferme',
        price: 10_000,
    },
    [k9_model]: {
        model: k9_model,
        label: 'Berger Allemand',
        type: 'Chien',
        price: 150_000,
        jobs: [JobType.BCSO, JobType.LSPD, JobType.SASP],
    },
};

export const PetVariation: Record<petBreed, Record<string, Record<string, PetDrawable>>> = {
    a_c_husky: {
        Pelage: {
            'Noir et Blanc': {
                component: 0,
                drawable: 0,
                texture: 0,
            },
            'Brun et Blanc': {
                component: 0,
                drawable: 0,
                texture: 1,
            },
            Blanc: {
                component: 0,
                drawable: 0,
                texture: 2,
            },
        },
    },
    a_c_retriever: {
        Pelage: {
            'Brun et Blanc': {
                component: 0,
                drawable: 0,
                texture: 0,
            },
            Noir: {
                component: 0,
                drawable: 0,
                texture: 1,
            },
            Blanc: {
                component: 0,
                drawable: 0,
                texture: 2,
            },
            Marron: {
                component: 0,
                drawable: 0,
                texture: 3,
            },
        },
    },
    a_c_westy: {
        Collier: {
            Brun: {
                component: 3,
                drawable: 0,
                texture: 0,
            },
            'Noir à clou': {
                component: 3,
                drawable: 0,
                texture: 1,
            },
            Blanc: {
                component: 3,
                drawable: 0,
                texture: 2,
            },
        },
        Pelage: {
            Blanc: {
                component: 4,
                drawable: 0,
                texture: 0,
            },
            Brun: {
                component: 4,
                drawable: 0,
                texture: 1,
            },
            Noir: {
                component: 4,
                drawable: 0,
                texture: 2,
            },
        },
    },
    a_c_rottweiler: {
        Collier: {
            Brun: {
                component: 3,
                drawable: 0,
                texture: 0,
            },
            Noir: {
                component: 3,
                drawable: 0,
                texture: 1,
            },
            Cuir: {
                component: 3,
                drawable: 0,
                texture: 2,
            },
        },
        Pelage: {
            Noir: {
                component: 4,
                drawable: 0,
                texture: 0,
            },
            Brun: {
                component: 4,
                drawable: 0,
                texture: 1,
            },
            Tigré: {
                component: 4,
                drawable: 0,
                texture: 2,
            },
        },
    },
    a_c_shepherd: {
        Pelage: {
            Noir: {
                component: 0,
                drawable: 0,
                texture: 0,
            },
            'Noir et Blanc': {
                component: 0,
                drawable: 0,
                texture: 1,
            },
            Brun: {
                component: 0,
                drawable: 0,
                texture: 2,
            },
        },
    },
    a_c_pug: {
        Collier: {
            Brun: {
                component: 3,
                drawable: 0,
                texture: 0,
            },
            'Noir à clou': {
                component: 3,
                drawable: 0,
                texture: 1,
            },
            Blanc: {
                component: 3,
                drawable: 0,
                texture: 2,
            },
        },
        Pelage: {
            Blanc: {
                component: 4,
                drawable: 0,
                texture: 0,
            },
            Gris: {
                component: 4,
                drawable: 0,
                texture: 1,
            },
            Brun: {
                component: 4,
                drawable: 0,
                texture: 2,
            },
            Noir: {
                component: 4,
                drawable: 0,
                texture: 3,
            },
        },
    },
    a_c_poodle: {},
    a_c_cat_01: {
        Pelage: {
            'Noir et Blanc': {
                component: 0,
                drawable: 0,
                texture: 0,
            },
            Noir: {
                component: 0,
                drawable: 0,
                texture: 1,
            },
            Brun: {
                component: 0,
                drawable: 0,
                texture: 2,
            },
        },
    },
    a_c_boar: {
        Pelage: {
            Blanc: {
                component: 0,
                drawable: 0,
                texture: 0,
            },
            Noir: {
                component: 0,
                drawable: 0,
                texture: 1,
            },
            Brun: {
                component: 0,
                drawable: 0,
                texture: 2,
            },
            Gris: {
                component: 0,
                drawable: 0,
                texture: 3,
            },
        },
    },
    a_c_cow: {
        Pelage: {
            Brun: {
                component: 0,
                drawable: 0,
                texture: 0,
            },
            'Noir et Blanc': {
                component: 0,
                drawable: 0,
                texture: 1,
            },
            'Blanc et Noir': {
                component: 0,
                drawable: 0,
                texture: 2,
            },
            'Blanc et Brun': {
                component: 0,
                drawable: 0,
                texture: 3,
            },
        },
    },
    a_c_pig: {
        Pelage: {
            Rose: {
                component: 0,
                drawable: 0,
                texture: 0,
            },
            'Rose et Noir': {
                component: 0,
                drawable: 0,
                texture: 1,
            },
            Noir: {
                component: 0,
                drawable: 0,
                texture: 2,
            },
        },
    },
    a_c_rabbit_01: {
        Pelage: {
            Brun: {
                component: 0,
                drawable: 0,
                texture: 0,
            },
            Marron: {
                component: 0,
                drawable: 0,
                texture: 1,
            },
            Noir: {
                component: 0,
                drawable: 0,
                texture: 2,
            },
            Gris: {
                component: 0,
                drawable: 0,
                texture: 3,
            },
        },
    },
    a_c_hen: {},
    [k9_model]: {
        Pelage: {
            Classique: {
                component: 0,
                drawable: 0,
                texture: 0,
            },
            Brun: {
                component: 0,
                drawable: 0,
                texture: 1,
            },
            Sombre: {
                component: 0,
                drawable: 0,
                texture: 2,
            },
            Noir: {
                component: 0,
                drawable: 0,
                texture: 3,
            },
        },
    },
};

export const JobFixPetVariation: Partial<Record<JobType, Partial<Record<petBreed, Array<PetDrawable>>>>> = {
    [JobType.LSPD]: {
        [k9_model]: [
            {
                component: 3,
                drawable: 0,
                texture: 0,
            },
            {
                component: 8,
                drawable: 0,
                texture: 0,
            },
        ],
    },
    [JobType.BCSO]: {
        [k9_model]: [
            {
                component: 3,
                drawable: 0,
                texture: 1,
            },
            {
                component: 8,
                drawable: 0,
                texture: 1,
            },
        ],
    },
    [JobType.SASP]: {
        [k9_model]: [
            {
                component: 3,
                drawable: 0,
                texture: 4,
            },
            {
                component: 8,
                drawable: 0,
                texture: 8,
            },
        ],
    },
};
