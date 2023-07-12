export type TSozedexPage = {
    fish: TFish;
    amount: number;
    locations: Localisation[];
    hours: Timetable[];
    weathers: Weather[];
    baits: Bait[];
    playerState: PlayerState[];
};

export type TFish = {
    id: number;
    name: string;
    picture: string;
    weight: number;
    size: number;
    description: string;
    price: number;
};

export enum Localisation {
    seashore = 'Bord de mer',
    northSea = 'Mer Nord',
    southSea = 'Mer Sud',
    bigLake = 'Grand Lac',
    smallLake = 'Petit Lac',
    river = 'Rivière',
    canal = 'Canal',
}

export enum Timetable {
    morning = '/public/images/fishing/icon-morning.webp',
    afternoon = '/public/images/fishing/icon-afternoon.webp',
    evening = '/public/images/fishing/icon-evening.webp',
    night = '/public/images/fishing/icon-night.webp',
}

export enum Weather {
    sunny = 'Ensoleillé',
    snowy = 'Neigeux',
    foggy = 'Brumeux',
    rainy = 'Pluvieux',
    cloudy = 'Nuageux',
    stormy = 'Tempêtueux',
    any = 'Peu importe',
}

export enum Bait {
    juicy = 'Juteux',
    tender = 'Tendre',
    furious = 'Furieux',
    beefedUp = 'Musclé',
}

export enum PlayerState {
    sober = '/public/images/fishing/icon-clean.webp',
    drunk = '/public/images/fishing/icon-alcohol.webp',
    drugged = '/public/images/fishing/icon-drug.webp',
}
