import { FishItem } from './item';

export interface PlayerFish {
    citizenId: string;
    fishId: string;
    quantity: number;
    maxWidth: number;
    maxWeight: number;
    maxResell: number;
    lastFishAt: Date;
}

export interface FishWithCompletion extends FishItem {
    completion: {
        quantity: number;
        maxWidth: number;
        maxWeight: number;
        maxResell: number;
        lastFishAt: Date;
        fishTier: any;
    };
}

export enum Localisation {
    littoral = 'Bords de mer',
    north_sea = 'Mer Nord',
    south_sea = 'Mer Sud',
    big_lake = 'Grand Lac',
    little_lake = 'Petits Lacs',
    river = 'Rivières',
    canals = 'Canaux',
    global = 'Global',
}

export const sozedexStatsZones = {
    global: {
        titre: {
            classic: 'Complétion du Sozédex',
            halloween: 'Découvertes Macabres',
        },
        description: {
            classic:
                "Le Sozédex décrit la faune et la flore maritime de San Andreas. Chaque découverte est écrite dans le livre afin d'établir une base de connaissance.",
            halloween: "Cette page du Sozédex n'aurait jamais dû être ouverte à nouveau..",
        },
        rewardTitle: {
            classic: 'Vous avez réussi !',
            halloween: 'Vous avez réussi !',
        },
        rewardDescription: {
            classic:
                "Vous venez de pêcher la totalité des poissons connus sur l'île jusqu'à ce jour. Voici votre récompense.",
            halloween:
                "Vous avez réussi à découvrir la totalité des monstruosités présentes sur l'île.. Voici votre récompense.",
        },
    },
    zones: [
        {
            side: 'left',
            label: {
                classic: Localisation.littoral,
                halloween: 'Côte des Ombres',
            },
            name: 'littoral',
            descriptions: {
                classic:
                    "Entre terre et mer, le littoral de San Andreas regorge de coraux et d'animaux marins en tout genre.",
                halloween:
                    'Entre terre et mer, le littoral de San Andreas révèle des profondeurs cauchemardesques où des coraux déformés et des créatures marines mutées errent, affamées de chair humaine.',
            },
        },
        {
            side: 'left',
            label: {
                classic: Localisation.river,
                halloween: 'Fleuves des Ténèbres',
            },
            name: 'river',
            descriptions: {
                classic:
                    'De nombreuses rivières parcourent San Andreas, regorgeant de nombreuses et surprenantes créatures.',
                halloween:
                    'Les rivières sinueuses de San Andreas cachent des secrets terrifiants, abritant des créatures insaisissables qui surgissent des eaux sombres pour se repaître des âmes perdues.',
            },
        },
        {
            side: 'left',
            label: {
                classic: Localisation.south_sea,
                halloween: "Mer de l'Éternelle Nuit",
            },
            name: 'south_sea',
            descriptions: {
                classic: "La Mer du Sud qui borde l'île de Cayo Perico est chaude et peuplée de race exotiques. ",
                halloween:
                    "La Mer du Sud qui ceinture l'île de Cayo Perico est un véritable enfer aquatique, où des êtres exotiques et maléfiques prospèrent dans les abysses, attendant patiemment que les voyageurs s'aventurent dans leurs profondeurs mortelles",
            },
        },
        {
            side: 'right',
            label: {
                classic: Localisation.north_sea,
                halloween: 'Abysses du Nord',
            },
            name: 'north_sea',
            descriptions: {
                classic:
                    'La Mer du Nord, bordant paleto et abrite de nombreuses petites îles habitée par les crustacés et les grands animaux marins.',
                halloween:
                    "La Mer du Nord, qui borde Paleto Bay, cache des îles maudites, des repaires de créatures marines difformes, où l'obscurité règne en maître et où les marins téméraires deviennent des proies pour les monstres qui rôdent.",
            },
        },
        {
            side: 'right',
            label: {
                classic: Localisation.big_lake,
                halloween: "Lac de l'Effroi",
            },
            name: 'big_lake',
            descriptions: {
                classic:
                    "Le grand lac de San Andreas, situé près de Sandy Shore et surnommé l'Alamo Sea se voit couvert d'une épaisse couche de glace l'hiver.",
                halloween:
                    "Le grand lac de San Andreas, l'Alamo Sea, n'est pas seulement gelé en hiver, il est également le lieu de repos de forces démoniaques qui attendent sous la glace, prêtes à surgir pour punir les intrus audacieux.",
            },
        },
        {
            side: 'right',
            label: {
                classic: Localisation.little_lake,
                halloween: 'Étangs Sombres',
            },
            name: 'little_lake',
            descriptions: {
                classic:
                    "De nombreux petits lacs ornent les plaines et les vallées de l'île de San Andreas, méritant seront ceux qui les observeront tous. ",
                halloween:
                    "Les petits lacs tranquilles qui parsèment les plaines et les vallées de l'île de San Andreas cachent des secrets maléfiques, et ceux qui osent les explorer risquent de libérer des horreurs indicibles.",
            },
        },
        {
            side: 'right',
            label: {
                classic: Localisation.canals,
                halloween: 'Canaux du Cauchemar',
            },
            name: 'canals',
            descriptions: {
                classic:
                    "Les différentes villes de San Andreas abritent divers canaux d'irrigation et de plaisance, il pourra arriver d'y croiser des choses étranges..",
                halloween:
                    "Les canaux d'irrigation et de plaisance serpentant à travers les villes de San Andreas sont hantés par des présences sinistres, des ombres inquiétantes qui se meuvent dans l'eau noire, attendant de piéger quiconque ose s'aventurer trop loin dans leurs sombres passages.",
            },
        },
    ],
};
