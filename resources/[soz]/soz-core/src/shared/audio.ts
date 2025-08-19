export type Audio = {
    id: string;
    path: string;
    volume: number;
    loop?: boolean;
};

export enum Music {
    Siren = 'siren',
    Chronos = 'chronos',
    Ambiance = 'ambiance',
    SandStorm = 'sandstorm',
    Impact = 'impact',
    DiesIrae = 'dies_irae',
    Cinis = 'cinis',
    Obsession = 'obsession',
}
