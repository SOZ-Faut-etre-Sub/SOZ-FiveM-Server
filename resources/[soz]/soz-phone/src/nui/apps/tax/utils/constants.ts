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
            "La taxe sur les armes est une imposition qui s'applique spécifiquement sur l'achat et la possession d'armes à feu. Elle vise à limiter la circulation des armes en augmentant leur coût, tout en générant des revenus pour le gouvernement. Ces fonds sont ensuite utilisés pour financer des services publics, tels que la sécurité, la santé, et des programmes de subventions visant à promouvoir la paix et la sécurité publique.",
        consequences:
            "Cette taxe a pour conséquence de réduire le nombre d'armes en circulation, contribuant ainsi à une baisse potentielle des incidents liés aux armes à feu.",
        taxAmount: 10,
        whoModifies: 'Le gouvernement',
        id: 'weapon',
    },
    {
        title: 'Taxe sur les véhicules',
        description:
            "La taxe sur les véhicules est une taxe imposée sur les véhicules à moteur, incluant les voitures, motos, et autres moyens de transport motorisés. L'objectif est de réduire la circulation des véhicules pour minimiser les embouteillages et la pollution. Les recettes générées par cette taxe sont allouées aux infrastructures publiques, à l'amélioration des transports en commun, et aux initiatives écologiques.",
        consequences:
            'Cette taxe a pour conséquence de réduire le nombre de véhicules en circulation, ce qui peut contribuer à une diminution des émissions de gaz à effet de serre et à une meilleure qualité de vie urbaine.',
        taxAmount: 10,
        whoModifies: 'Le gouvernement',
        id: 'vehicle',
    },
    {
        title: 'Taxe sur les habitations',
        description:
            "La taxe sur les habitations est une taxe prélevée sur les propriétaires de biens immobiliers, qu'il s'agisse de maisons, d'appartements ou d'autres types d'habitations. Elle est conçue pour réguler le marché immobilier, tout en générant des revenus pour le gouvernement. Ces fonds sont utilisés pour financer les services publics tels que l'éducation, la santé, et les infrastructures urbaines.",
        consequences:
            'Cette taxe a pour conséquence de stabiliser le marché immobilier, mais elle pourrait également réduire le nombre de personnes pouvant se permettre de vivre dans certaines zones urbaines.',
        taxAmount: 10,
        whoModifies: 'Le gouvernement',
        id: 'housing',
    },
    {
        title: 'Taxe sur les services',
        description:
            "La taxe sur les services s'applique à une vaste gamme de services, allant des services professionnels aux services de divertissement. Cette taxe vise à réguler le marché des services tout en augmentant les recettes publiques. Les fonds collectés sont utilisés pour soutenir les services sociaux, les infrastructures, et les initiatives culturelles.",
        consequences:
            'Cette taxe a pour conséquence de réduire la demande pour certains services, en raison du coût supplémentaire pour les consommateurs.',
        taxAmount: 10,
        whoModifies: 'Le gouvernement',
        id: 'service',
    },
    {
        title: 'Taxe sur les fournitures',
        description:
            "La taxe sur les fournitures s'applique aux biens matériels tels que les équipements de bureau, les fournitures scolaires, et autres produits similaires. L'objectif est de réguler la consommation de ces produits tout en collectant des fonds pour le gouvernement. Ces recettes financent des projets publics, notamment dans les domaines de l'éducation, de la recherche, et des infrastructures.",
        consequences:
            'Cette taxe a pour conséquence de réduire la quantité de fournitures en circulation, encourageant ainsi une utilisation plus rationnelle des ressources.',
        taxAmount: 10,
        whoModifies: 'Le gouvernement',
        id: 'supply',
    },
    {
        title: 'Taxe sur les voyages',
        description:
            "La taxe sur les voyages est une imposition sur les services de voyage, incluant les billets d'avion, de train, et d'autres moyens de transport longue distance. Elle vise à limiter les voyages non essentiels, réduisant ainsi l'empreinte carbone, tout en générant des revenus pour le gouvernement. Ces fonds sont utilisés pour financer des projets écologiques, des infrastructures de transport durable, et des programmes de subventions vertes.",
        consequences:
            'Cette taxe a pour conséquence de réduire le nombre de voyages effectués, encourageant des comportements plus durables et une réduction des émissions liées au transport.',
        taxAmount: 10,
        whoModifies: 'Le gouvernement',
        id: 'travel',
    },
    {
        title: 'Taxe sur les aliments',
        description:
            "La taxe sur les aliments s'applique à une gamme spécifique de produits alimentaires, particulièrement ceux considérés comme non essentiels ou nuisibles à la santé. L'objectif est de décourager la consommation de ces produits tout en collectant des fonds pour le gouvernement. Les recettes de cette taxe sont utilisées pour financer des programmes de santé publique, des campagnes de sensibilisation, et des subventions pour des aliments plus sains.",
        consequences:
            'Cette taxe a pour conséquence de réduire la consommation de certains aliments, ce qui peut contribuer à une meilleure santé publique, mais aussi à une réduction de la diversité alimentaire accessible.',
        taxAmount: 10,
        whoModifies: 'Le gouvernement',
        id: 'food',
    },
    {
        id: 'green',
        title: 'Taxe verte',
        description:
            "La taxe verte est une imposition sur les produits et activités polluants, tels que les carburants fossiles, les plastiques non recyclables, et certaines industries à forte émission de carbone. Elle vise à réduire l'impact environnemental en rendant plus coûteux les choix non écologiques. Les fonds générés sont utilisés par le gouvernement pour financer des initiatives vertes, comme les énergies renouvelables, la protection de la biodiversité, et des programmes de subvention pour des technologies propres.",
        consequences:
            "Cette taxe a pour conséquence de réduire la pollution en incitant les entreprises et les particuliers à adopter des pratiques plus respectueuses de l'environnement.",
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
