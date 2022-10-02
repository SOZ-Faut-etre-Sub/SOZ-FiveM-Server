export const MONEY_OPTIONS = [
    { label: '$1,000', value: 1000 },
    { label: '$5,000', value: 5000 },
    { label: '$10,000', value: 10000 },
    { label: '$100,000', value: 100000 },
];

export const LICENCES = [
    { label: 'Voiture', value: 'car' },
    { label: 'Poids lourd', value: 'truck' },
    { label: 'Moto', value: 'motorcycle' },
    { label: 'Hélicoptère', value: 'heli' },
    { label: 'Bateau', value: 'boat' },
];

/**
 * A very simple version of the admin player.
 * If you need more, use the FullAdminPlayer.
 */
export type AdminPlayer = {
    id: number; // That's the server id of the player.
    citizenId: string;
    name: string;
};

export type FullAdminPlayer = {
    id: number; // That's the server id of the player.
    name: string;
    coords: number[];
    heading: number;
    cid: string;
    citizenId: string;
    ped: number;
};
