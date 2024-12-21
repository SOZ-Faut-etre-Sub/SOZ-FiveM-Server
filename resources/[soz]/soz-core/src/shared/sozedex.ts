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
            vampire: 'Secrets Sanguinaires',
            summer: 'Voyage tropical',
            winter: 'Horizons gelées',
        },
        description: {
            classic:
                "Le Sozédex décrit la faune et la flore maritime de San Andreas. Chaque découverte est écrite dans le livre afin d'établir une base de connaissance.",
            halloween:
                'Il est désormais temps de découvrir ces pages remplies de créatures monstrueuses et démoniaques que seul un appât du diable est en mesure de débusquer.',
            vampire:
                'Explorez ces pages sombres où se cachent des créatures mystérieuses, insaisissables, drapées de ténèbres et assoiffées de sang.',
            summer: 'Découvrez les pages de ce périple rempli de créatures plus surprenantes les unes que les autres dans cet environnement hors du commun.',
            winter: 'Découvrez les pages de ce périple rempli de créatures glacées, mystérieuses et fascinantes, dans cet environnement figé dans le froid.',
        },
        rewardTitle: {
            classic: 'Vous avez réussi !',
            halloween: 'Vous avez réussi !',
            vampire: 'Vous êtes victorieux !',
            summer: 'Vous avez réussi !',
            winter: 'Vous avez réussi !',
        },
        rewardDescription: {
            classic:
                "Vous venez de pêcher la totalité des poissons connus sur l'île jusqu'à ce jour. Voici votre récompense.",
            halloween:
                "Vous avez réussi à découvrir la totalité des monstruosités présentes sur l'île.. Voici votre récompense.",
            vampire:
                "Vous avez bravé l'ombre et découvert tous les secrets cachés de San Andreas, triomphant des créatures les plus ténébreuses. Voici votre récompense.",
            summer: 'Vous avez réussi à découvrir les totalité des espèces méconnues de cet environnement. Voici votre récompense.',
            winter: 'Vous avez réussi à découvrir la totalité des espèces cachées dans ce paysage hivernal. Voici votre récompense',
        },
    },
    zones: [
        {
            side: 'left',
            label: {
                classic: Localisation.littoral,
                halloween: 'Côte des Ombres',
                vampire: 'Côte des Mânes',
                summer: 'Côtes submergées',
                winter: 'Côtes gelées',
            },
            name: 'littoral',
            descriptions: {
                classic:
                    "Entre terre et mer, le littoral de San Andreas regorge de coraux et d'animaux marins en tout genre.",
                halloween:
                    'Entre terre et mer, le littoral de San Andreas révèle des profondeurs cauchemardesques où des coraux déformés et des créatures marines mutées errent, affamées de chair humaine.',
                vampire:
                    'Les côtes de San Andreas, plongées dans la pénombre, sont peuplées de créatures nocturnes, attirées par le parfum du sang et l’aura mystérieuse de la nuit.',
                summer: 'Autrefois entre terre et mer, le littoral de San Andreas regorgeais de coraux et de créatures colorées. Et maintenant..?',
                winter: 'Autrefois bordées de sable et de vagues, les côtes de San Andreas sont maintenant figées sous une épaisse couche de glace, où des formes de vie inattendues prospèrent',
            },
        },
        {
            side: 'left',
            label: {
                classic: Localisation.river,
                halloween: 'Fleuves Ténébreux',
                vampire: 'Fleuves Pourpres',
                summer: 'Fleuves Oubliés',
                winter: 'Fleuves Cristallisés',
            },
            name: 'river',
            descriptions: {
                classic:
                    'De nombreuses rivières parcourent San Andreas, regorgeant de nombreuses et surprenantes créatures.',
                halloween:
                    'Les rivières sinueuses de San Andreas cachent des secrets terrifiants, abritant des créatures insaisissables qui surgissent des eaux sombres pour se repaître des âmes perdues.',
                vampire:
                    'Les rivières pourpres de San Andreas cachent des secrets interdits, où des êtres éternels se désaltèrent dans le calme nocturne, surveillant leurs territoires anciens.',
                summer: "Après une telle catastrophe, qu'est-il advenu des créatures fluviales ?",
                winter: 'Après une telle catastrophe, les créatures fluviales se sont-elles adaptées ou se sont-elles perdues sous les eaux glacées ?',
            },
        },
        {
            side: 'left',
            label: {
                classic: Localisation.south_sea,
                halloween: 'Mer de la Nuit',
                vampire: 'Mer des Lamentations',
                summer: "Crique d'Émeraude",
                winter: 'Crique de glace',
            },
            name: 'south_sea',
            descriptions: {
                classic: "La Mer du Sud qui borde l'île de Cayo Perico est chaude et peuplée de race exotiques.",
                halloween:
                    "La Mer du Sud qui ceinture l'île de Cayo Perico est un véritable enfer aquatique, où des êtres exotiques et maléfiques prospèrent dans les abysses, attendant patiemment que les voyageurs s'aventurent dans leurs profondeurs mortelles",
                vampire:
                    'La Mer des Lamentations accueille des créatures en quête de sang, se mouvant silencieusement dans ses eaux sombres, attirant les âmes perdues vers leur fin.',
                summer: 'La Mer du Sud autrefois calme et paradisiaque est désormais remplie de dangers et de phénomènes de grande ampleur.',
                winter: "La Mer du Sud, autrefois calme et paradisiaque, est désormais prisonnière d'une couche de glace éternelle, où le danger rôde à chaque pas.",
            },
        },
        {
            side: 'right',
            label: {
                classic: Localisation.north_sea,
                halloween: 'Abysses du Nord',
                vampire: 'Abysses Obscurs',
                summer: 'Baie des Brumes',
                winter: 'Baie des Brumes Gelées',
            },
            name: 'north_sea',
            descriptions: {
                classic:
                    'La Mer du Nord, bordant paleto et abrite de nombreuses petites îles habitée par les crustacés et les grands animaux marins.',
                halloween:
                    "La Mer du Nord, qui borde Paleto Bay, cache des îles maudites, des repaires de créatures marines difformes, où l'obscurité règne en maître et où les marins téméraires deviennent des proies pour les monstres qui rôdent.",
                vampire:
                    'Les Abysses Obscurs sont le royaume des créatures maudites, qui veillent dans les ombres et nourrissent une soif insatiable pour quiconque oserait troubler leur sommeil.',
                summer: 'La Mer du Nord qui bordait paleto est désormais sombre et mystérieuse, ne vous faites pas emporter ...',
                winter: 'La Mer du Nord, bordant Paleto, est devenue sombre et froide, recouverte de brumes glaciales. Prenez garde à ne pas vous perdre...',
            },
        },
        {
            side: 'right',
            label: {
                classic: Localisation.big_lake,
                halloween: "Lac de l'Effroi",
                vampire: 'Lac Sombre',
                summer: "Désert d'Alamo",
                winter: 'Désert de Givre',
            },
            name: 'big_lake',
            descriptions: {
                classic:
                    "Le grand lac de San Andreas, situé près de Sandy Shore et surnommé l'Alamo Sea se voit couvert d'une épaisse couche de glace l'hiver.",
                halloween:
                    "Le grand lac de San Andreas, l'Alamo Sea, n'est pas seulement gelé en hiver, il est également le lieu de repos de forces démoniaques qui attendent sous la glace, prêtes à surgir pour punir les intrus audacieux.",
                vampire:
                    "Le Lac Sombre, teinté de rouge par les légendes de San Andreas, attire les créatures vampiriques, où nul ne s'aventure sans craindre pour son sang.",
                summer: "Du sable, des rochers, c'est tout ce qu'il reste de la mer d'Alamo..",
                winter: 'Du sable et des rochers ? Ce n’est plus qu’un souvenir. Désormais, la mer d’Alamo est un désert glacé, balayé par des vents mordants.',
            },
        },
        {
            side: 'right',
            label: {
                classic: Localisation.little_lake,
                halloween: 'Étangs Sombres',
                vampire: 'Étangs Morts',
                summer: 'Étendues de Sables',
                winter: 'Étendues Givrées',
            },
            name: 'little_lake',
            descriptions: {
                classic:
                    "De nombreux petits lacs ornent les plaines et les vallées de l'île de San Andreas, méritant seront ceux qui les observeront tous. ",
                halloween:
                    "Les petits lacs tranquilles qui parsèment les plaines et les vallées de l'île de San Andreas cachent des secrets maléfiques, et ceux qui osent les explorer risquent de libérer des horreurs indicibles.",
                vampire:
                    'Les Étangs Morts dissimulent des présences éternelles, invisibles au regard humain, mais bien réelles pour ceux dotés de pouvoirs vampiriques.',
                summer: "Il y'avait autrefois des petits lacs qui parsemaient les plaines et les vallées de San Andreas.. Il ne reste plus que du sable et des cailloux..",
                winter: 'Autrefois parsemées de lacs scintillants, les plaines et vallées de San Andreas sont désormais recouvertes d’une épaisse croûte de glace et de neige.',
            },
        },
        {
            side: 'right',
            label: {
                classic: Localisation.canals,
                halloween: 'Canaux du Cauchemar',
                vampire: 'Canaux de la Nuit',
                summer: 'Quartiers Engloutis',
                winter: 'Quartiers Figés',
            },
            name: 'canals',
            descriptions: {
                classic:
                    "Les différentes villes de San Andreas abritent divers canaux d'irrigation et de plaisance, il pourra arriver d'y croiser des choses étranges..",
                halloween:
                    "Les canaux d'irrigation et de plaisance serpentant à travers les villes de San Andreas sont hantés par des présences sinistres, des ombres inquiétantes qui se meuvent dans l'eau noire, attendant de piéger quiconque ose s'aventurer trop loin dans leurs sombres passages.",
                vampire:
                    'Les Canaux de la Nuit sont des passages secrets utilisés par des créatures assoiffées de sang, invisibles aux yeux humains mais prêtes à se manifester au moindre murmure.',
                summer: "La météorite a englouti les canaux et les quartiers irrigés, de nouvelles créatures s'y sont cachées..",
                winter: 'La météorite a plongé les canaux et quartiers autrefois vivants sous la glace. De nouvelles créatures se sont adaptées à ce froid implacable, se cachant dans l’ombre des glaces.',
            },
        },
    ],
};
