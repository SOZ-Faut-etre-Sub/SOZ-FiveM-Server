import { Taxes } from '@typings/app/tax';

export const MockTax: Taxes = {
    '1': {
        id: "🏠 Taxe d'habitation",
        value: 16,
    },
    '2': {
        id: '🚙 Taxe véhicule',
        value: 18,
    },
};

export enum TaxType {
    HOUSING = 'housing',
    VEHICLE = 'vehicle',
    GREEN = 'green',
    FOOD = 'food',
    WEAPON = 'weapon',
    SUPPLY = 'supply',
    TRAVEL = 'travel',
    SERVICE = 'service',
}

export const TaxeDescription = [
    {
        title: 'Taxe sur les armes',
        description:
            "La taxe sur les armes est une imposition qui s'applique spécifiquement sur l'achat d'équipements et d'améliorations en armurerie. Ces équipements regroupent, entre autres, les armes, leurs accessoires ou bien les équipements sportifs.",
        taxAmount: 10,
        whoModifies: 'Le gouvernement',
        id: 'weapon',
    },
    {
        title: 'Taxe sur les véhicules',
        description:
            "La taxe sur les véhicules est une imposition qui s'applique sur les véhicules achetés auprès des concessionnaires (classique, maritime, aérien, luxe, deux-roues motorisés et entreprise). Elle s'applique également aux améliorations de performances de tous les véhicules auprès des LS Custom, l'utilisation des lavomatiques ainsi qu'aux passages des permis de conduire.",
        taxAmount: 10,
        whoModifies: 'Le gouvernement',
        id: 'vehicle',
    },
    {
        title: 'Taxe sur les habitations',
        description:
            "La taxe sur les habitations est une imposition qui s'applique sur l'achat d'habitation ainsi que sur ses différentes améliorations. Elle s'applique également à l'achat de meubles au Zkea.",
        taxAmount: 10,
        whoModifies: 'Le gouvernement',
        id: 'housing',
    },
    {
        title: 'Taxe sur les services',
        description:
            "La taxe sur les services est une imposition qui s'applique aux services d'urgences, comme le médecin de garde du LSMC, le Pit stop LS Custom, ainsi qu'à l'achat d'un abonnement sportif à Muscle Peach.",
        taxAmount: 10,
        whoModifies: 'Le gouvernement',
        id: 'service',
    },
    {
        title: 'Taxe sur les fournitures',
        description:
            "La taxe sur les fournitures est une imposition qui s'applique à tous les achats effectués chez un coiffeur, un tatoueur, une boutique de vêtements ou à la bijouterie.",
        taxAmount: 10,
        whoModifies: 'Le gouvernement',
        id: 'supply',
    },
    {
        title: 'Taxe sur les voyages',
        description:
            "La taxe sur les voyages est une imposition qui s'applique à tout déplacement de véhicule entre San Andreas et Cayo Perico.",
        taxAmount: 10,
        whoModifies: 'Le gouvernement',
        id: 'travel',
    },
    {
        title: 'Taxe sur les aliments',
        description:
            "La taxe sur les aliments est une imposition qui s'applique à tout achat effectué dans une superette, que cet achat soit alimentaire ou non.",
        taxAmount: 10,
        whoModifies: 'Le gouvernement',
        id: 'food',
    },
    {
        id: 'green',
        title: 'Taxe verte',
        description:
            "La taxe verte est une imposition qui s'applique à l'achat de véhicule en concessionnaire électrique.",
        taxAmount: 10,
        whoModifies: 'Le gouvernement',
    },
];

export const defaultTaxes = {
    housing: {
        id: 'housing',
        value: 0,
    },
    food: {
        id: 'food',
        value: 0,
    },
    green: {
        id: 'green',
        value: 0,
    },
    travel: {
        id: 'travel',
        value: 0,
    },
    supply: {
        id: 'supply',
        value: 0,
    },
    vehicle: {
        id: 'vehicle',
        value: 0,
    },
    weapon: {
        id: 'weapon',
        value: 0,
    },
    service: {
        id: 'service',
        value: 0,
    },
};
