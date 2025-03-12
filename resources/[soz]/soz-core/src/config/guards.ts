import { Vector3 } from '../shared/polyzone/vector';

export const campGuards = [
    {
        model: 'g_m_y_salvaboss_01',
        invincible: true,
        freeze: true,
        blockevents: true,
        coords: {
            x: -1042.02,
            y: 4906.41,
            z: 207.48,
            w: 316.72,
        },
        animDict: 'anim@heists@heist_corona@single_team',
        anim: 'single_team_loop_boss',
        animprops: [
            {
                bone: 24816,
                model: 'w_ar_assaultriflemk2',
                position: [0.173, -0.18, 0.05] as Vector3,
                rotation: [10, 45, 10] as Vector3,
                extraWeaponDraw: [
                    {
                        bone: 'WAPBarrel',
                        model: 'w_at_ar_barrel_1',
                    },
                ],
            },
        ],
    },
    {
        model: 'g_m_y_salvagoon_01',
        invincible: true,
        freeze: true,
        blockevents: true,
        coords: {
            x: -1045.58,
            y: 4913.96,
            z: 207.52,
            w: 282.39,
        },
        animDict: 'anim@heists@heist_corona@single_team',
        anim: 'single_team_loop_boss',
        animprops: [
            {
                bone: 24816,
                model: 'w_ar_assaultriflemk2',
                position: [0.173, -0.18, 0.05] as Vector3,
                rotation: [10, 45, 10] as Vector3,
                extraWeaponDraw: [
                    {
                        bone: 'WAPBarrel',
                        model: 'w_at_ar_barrel_1',
                    },
                ],
            },
        ],
    },
];
