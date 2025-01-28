import { Tax, TaxType } from '@public/shared/tax';

type TaxDescription = {
    title: string;
    description: string;
    whoModifies: string;
};

export const TaxesDescription: Record<TaxType, TaxDescription> = {
    [TaxType.WEAPON]: {
        title: 'Taxe sur les armes',
        description:
            "La taxe sur les armes est une imposition qui s'applique spécifiquement sur l'achat d'équipements et d'améliorations en armurerie. Ces équipements regroupent, entre autres, les armes, leurs accessoires ou bien les équipements sportifs.",
        whoModifies: 'Le gouvernement',
    },
    [TaxType.VEHICLE]: {
        title: 'Taxe sur les véhicules',
        description:
            "La taxe sur les véhicules est une imposition qui s'applique sur les véhicules achetés auprès des concessionnaires (classique, maritime, aérien, luxe, deux-roues motorisés et entreprise). Elle s'applique également aux améliorations de performances de tous les véhicules auprès des LS Custom, l'utilisation des lavomatiques ainsi qu'aux passages des permis de conduire.",
        whoModifies: 'Le gouvernement',
    },
    [TaxType.HOUSING]: {
        title: 'Taxe sur les habitations',
        description:
            "La taxe sur les habitations est une imposition qui s'applique sur l'achat d'habitation ainsi que sur ses différentes améliorations. Elle s'applique également à l'achat de meubles au Zkea.",
        whoModifies: 'Le gouvernement',
    },
    [TaxType.SERVICE]: {
        title: 'Taxe sur les services',
        description:
            "La taxe sur les services est une imposition qui s'applique aux services d'urgences, comme le médecin de garde du LSMC, le Pit stop LS Custom, ainsi qu'à l'achat d'un abonnement sportif à Muscle Peach.",
        whoModifies: 'Le gouvernement',
    },
    [TaxType.SUPPLY]: {
        title: 'Taxe sur les fournitures',
        description:
            "La taxe sur les fournitures est une imposition qui s'applique à tous les achats effectués chez un coiffeur, un tatoueur, une boutique de vêtements, à la bijouterie ou une boutique de souvenir.",
        whoModifies: 'Le gouvernement',
    },
    [TaxType.TRAVEL]: {
        title: 'Taxe sur les voyages',
        description:
            "La taxe sur les voyages est une imposition qui s'applique à tout déplacement de véhicule entre San Andreas et Cayo Perico.",
        whoModifies: 'Le gouvernement',
    },
    [TaxType.FOOD]: {
        title: 'Taxe sur les aliments',
        description:
            "La taxe sur les aliments est une imposition qui s'applique à tout achat effectué dans une superette, que cet achat soit alimentaire ou non.",
        whoModifies: 'Le gouvernement',
    },
    [TaxType.GREEN]: {
        title: 'Taxe verte',
        description:
            "La taxe verte est une imposition qui s'applique à l'achat de véhicule en concessionnaire électrique.",
        whoModifies: 'Le gouvernement',
    },
};

export const defaultTaxes: Tax[] = [
    { id: TaxType.HOUSING, value: 0 },
    { id: TaxType.FOOD, value: 0 },
    { id: TaxType.GREEN, value: 0 },
    { id: TaxType.TRAVEL, value: 0 },
    { id: TaxType.SUPPLY, value: 0 },
    { id: TaxType.VEHICLE, value: 0 },
    { id: TaxType.WEAPON, value: 0 },
    { id: TaxType.SERVICE, value: 0 },
];
