import { ClientEvent } from '@public/shared/event';

import { AnimationConfigList, MoodConfigList, WalkConfigList } from '../shared/animation';

export const Walks: WalkConfigList = [
    { type: 'walk', name: 'Démarche par défaut Homme', walk: 'move_m@multiplayer' },
    { type: 'walk', name: 'Démarche par défaut Femme', walk: 'move_f@multiplayer' },
    {
        type: 'category',
        name: 'Alcool',
        items: [
            { type: 'walk', name: 'Trop bu', walk: 'move_m@drunk@a' },
            { type: 'walk', name: 'Éméché', walk: 'move_m@drunk@slightlydrunk' },
            { type: 'walk', name: 'Bourré', walk: 'move_m@buzzed' },
            { type: 'walk', name: 'Déglingué', walk: 'move_m@drunk@verydrunk' },
        ],
    },
    {
        type: 'category',
        name: 'Charme',
        items: [
            { type: 'walk', name: 'Allumeuse', walk: 'move_f@maneater' },
            { type: 'walk', name: 'Charmante', walk: 'move_f@sexy@a' },
            { type: 'walk', name: 'Flambeur', walk: 'move_m@sassy' },
            { type: 'walk', name: 'Playboy', walk: 'move_m@swagger' },
            { type: 'walk', name: 'Sexy', walk: 'move_f@heels@d' },
        ],
    },
    {
        type: 'category',
        name: 'Street',
        items: [
            { type: 'walk', name: 'Assuré', walk: 'move_m@tough_guy@' },
            { type: 'walk', name: 'Confiante', walk: 'move_f@tough_guy@' },
            { type: 'walk', name: 'Frimeur', walk: 'move_m@shadyped@a' },
            { type: 'walk', name: 'Gangster chill', walk: 'move_m@gangster@generic' },
            { type: 'walk', name: 'Gangster lent', walk: 'move_m@gangster@var_e' },
            { type: 'walk', name: 'Gangster', walk: 'move_m@gangster@ng' },
            { type: 'walk', name: 'Gangster pressé', walk: 'move_m@gangster@var_i' },
            { type: 'walk', name: 'Gros dur lent', walk: 'anim_group_move_ballistic' },
            { type: 'walk', name: 'Gros dur rapide', walk: 'move_m@fire' },
        ],
    },
    {
        type: 'category',
        name: 'Émotions',
        items: [
            { type: 'walk', name: 'Arrogant', walk: 'move_f@arrogant@a' },
            { type: 'walk', name: 'Dépité', walk: 'move_m@hobo@a' },
            { type: 'walk', name: 'Déprimé', walk: 'move_m@gangster@var_f' },
            { type: 'walk', name: 'Déterminé', walk: 'move_m@brave' },
            { type: 'walk', name: 'Enjoué', walk: 'anim@move_m@grooving@' },
            { type: 'walk', name: 'Fier', walk: 'move_m@posh@' },
            { type: 'walk', name: 'Apeuré', walk: 'move_f@flee@a' },
            { type: 'walk', name: 'Inquiet', walk: 'move_f@scared' },
            { type: 'walk', name: 'Maniéré', walk: 'move_f@posh@' },
            { type: 'walk', name: 'Triste', walk: 'move_m@sad@a' },
            { type: 'walk', name: 'Énervé', walk: 'move_p_m_zero_janitor' },
        ],
    },
    { type: 'walk', name: 'Boiteux', walk: 'move_heist_lester' },
    { type: 'walk', name: 'Marche très lente', walk: 'move_m@casual@d' },
    { type: 'walk', name: 'Marche lente', walk: 'move_m@casual@a' },
    { type: 'walk', name: 'Marche', walk: 'move_m@casual@b' },
    { type: 'walk', name: 'Marche rapide', walk: 'move_m@casual@f' },
    { type: 'walk', name: 'Marche très rapide', walk: 'move_m@casual@c' },
    { type: 'walk', name: 'Menotté', walk: 'move_m@prisoner_cuffed' },
    { type: 'walk', name: 'Pressé', walk: 'move_f@hurry@a' },
    { type: 'walk', name: 'Trottiner', walk: 'move_m@quick' },
    { type: 'walk', name: 'Accroupi', walk: 'move_ped_crouched' },
    {
        type: 'event',
        name: 'Ramper',
        rightLabel: null,
        icon: null,
        event: ClientEvent.TOGGLE_CRAWLING,
    },
    {
        type: 'category',
        name: 'Nouvelles Démarches',
        items: [
            { type: 'walk', name: 'Alien', walk: 'move_m@alien' },
            { type: 'walk', name: 'Butch', walk: 'move_m@hurry_butch@a' },
            { type: 'walk', name: 'Butch 2', walk: 'move_m@hurry_butch@b' },
            { type: 'walk', name: 'Butch 3', walk: 'move_m@hurry_butch@c' },
            { type: 'walk', name: 'Brave 2', walk: 'move_m@brave@a' },
            { type: 'walk', name: 'Casey', walk: 'move_casey' },
            { type: 'walk', name: 'Casual', walk: 'move_m@casual@a' },
            { type: 'walk', name: 'Casual 5', walk: 'move_m@casual@e' },
            { type: 'walk', name: 'Chichi', walk: 'move_f@chichi' },
            { type: 'walk', name: 'Confident', walk: 'move_m@confident' },
            { type: 'walk', name: 'Cop', walk: 'move_m@business@a' },
            { type: 'walk', name: 'Cop 2', walk: 'move_m@business@b' },
            { type: 'walk', name: 'Cop 3', walk: 'move_m@business@c' },
            { type: 'walk', name: 'Coward', walk: 'move_m@coward' },
            { type: 'walk', name: 'Chubby Male', walk: 'move_chubby' },
            { type: 'walk', name: 'Chubby Female', walk: 'move_f@chubby@a' },
            { type: 'walk', name: 'Dave', walk: 'move_characters@dave_n' },
            { type: 'walk', name: 'Depressed', walk: 'move_m@depressed@a' },
            { type: 'walk', name: 'Depressed 2', walk: 'move_m@depressed@b' },
            { type: 'walk', name: 'Depressed 3', walk: 'move_f@depressed@a' },
            { type: 'walk', name: 'Depressed 4', walk: 'move_f@depressed@c' },
            { type: 'walk', name: 'Dreyfuss', walk: 'move_dreyfuss' },
            { type: 'walk', name: 'Drunk 3 - Moderate', walk: 'move_m@drunk@moderatedrunk' },
            { type: 'walk', name: 'Drunk 4 - Moderate 2', walk: 'move_m@drunk@moderatedrunk_head_up' },
            { type: 'walk', name: 'Fat Male', walk: 'move_m@fat@a' },
            { type: 'walk', name: 'Fat Female', walk: 'move_f@fat@a' },
            { type: 'walk', name: 'Fat Female 2', walk: 'move_f@fat@a_no_add' },
            { type: 'walk', name: 'Femme', walk: 'move_f@femme@' },
            { type: 'walk', name: 'Femme 2', walk: 'move_m@femme@' },
            { type: 'walk', name: 'Fire', walk: 'move_characters@franklin@fire' },
            { type: 'walk', name: 'Fire 2', walk: 'move_characters@michael@fire' },
            { type: 'walk', name: 'Flee 2', walk: 'move_f@flee@c' },
            { type: 'walk', name: 'Flee 3', walk: 'move_m@flee@a' },
            { type: 'walk', name: 'Flee 4', walk: 'move_m@flee@b' },
            { type: 'walk', name: 'Flee 5', walk: 'move_m@flee@c' },
            { type: 'walk', name: 'Floyd', walk: 'move_characters@floyd' },
            { type: 'walk', name: 'Franklin', walk: 'move_p_m_one' },
            { type: 'walk', name: 'Gangster 2', walk: 'move_gangster' },
            { type: 'walk', name: 'Gangster 4', walk: 'move_m@gangster@var_a' },
            { type: 'walk', name: 'Gangster 5', walk: 'move_m@gangster@var_b' },
            { type: 'walk', name: 'Gangster 6', walk: 'move_m@gangster@var_c' },
            { type: 'walk', name: 'Gangster 7', walk: 'move_m@gangster@var_d' },
            { type: 'walk', name: 'Gangster 8', walk: 'move_m@gangster@var_k' },
            { type: 'walk', name: 'Grooving Female', walk: 'anim@move_f@grooving@' },
            { type: 'walk', name: 'Heels', walk: 'move_f@heels@c' },
            { type: 'walk', name: 'Hiking', walk: 'move_m@hiking' },
            { type: 'walk', name: 'Hiking 2', walk: 'move_f@hiking' },
        ],
    },
];

export const Moods: MoodConfigList = [
    { name: 'Humeur par défaut', mood: 'mood_normal_1' },
    { name: 'Blessé', mood: 'mood_injured_1' },
    { name: 'Boudeur', mood: 'mood_sulk_1' },
    { name: 'Bourré', mood: 'mood_drunk_1' },
    { name: 'Bizarre', mood: 'effort_2' },
    { name: 'Bizarre 2', mood: 'effort_3' },
    { name: 'Choqué', mood: 'shocked_1' },
    { name: 'Choqué 2', mood: 'shocked_2' },
    { name: 'Content', mood: 'mood_dancing_low_1' },
    { name: 'Électrocuté', mood: 'electrocuted_1' },
    { name: 'En colère', mood: 'mood_angry_1' },
    { name: 'En feu', mood: 'burning_1' },
    { name: 'Endormi', mood: 'mood_sleeping_1' },
    { name: 'Endormi 2', mood: 'dead_1' },
    { name: 'Endormi 3', mood: 'dead_2' },
    { name: 'Excité', mood: 'mood_excited_1' },
    { name: 'Frustré', mood: 'mood_frustrated_1' },
    { name: 'Grincheux', mood: 'effort_1' },
    { name: 'Grincheux 3', mood: 'pose_angry_1' },
    { name: 'Joyeux', mood: 'mood_happy_1' },
    { name: 'Mort', mood: 'dead_1' },
    { name: 'Ne cligne jamais des yeux', mood: 'pose_normal_1' },
    { name: 'Pas content', mood: 'mood_drivefast_1' },
    { name: 'Pleurer', mood: 'console_wasnt_fun_end_loop_floyd_facial' },
    { name: 'Respirer par la bouche', mood: 'smoking_hold_1' },
    { name: 'Stupide', mood: 'pose_injured_1' },
    { name: 'Stressé', mood: 'mood_stressed_1' },
    { name: 'Suffisant', mood: 'mood_smug_1' },
    { name: 'Un œil', mood: 'pose_aiming_1' },
    { name: 'Viser', mood: 'mood_aiming_1' },
];

export const Animations: AnimationConfigList = [
    {
        type: 'category',
        name: 'Danses et instruments',
        items: [
            {
                type: 'animation',
                name: "50's",
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_b@',
                        name: 'high_center',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: '90°C',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_15_v2_female^3',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Air Fist',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                        name: 'hi_dance_facedj_hu_13_male^3',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Aléatoire ?!',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_hu_13_v1_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_13_v1_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Aller, Aller',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_a_m05',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_a_m04',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Animaux',
                items: [
                    {
                        type: 'animation',
                        name: 'Anguille #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_11_v1_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Anguille #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Au galot !',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Cats #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v1_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Cats #1 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v1_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Cats #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v2_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Cats #2 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v2_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Cats Cradle',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationmale@cats_cradle',
                                name: 'cats_cradle',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Crabe',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_13_v2_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Crevette',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v2_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Crevette (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v2_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Dyno',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_11_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Esturgeon',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_11_v1_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Esturgeon (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_11_v1_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Find the Fish',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationfemale@find_the_fish',
                                name: 'find_the_fish',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Grenouille',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v1_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Grenouille (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v1_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Hippocampe',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupa@',
                                name: 'hi_dance_crowd_17_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Lapin',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Lapin (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Pigeon',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Poulet',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationfemale@chicken_taunt',
                                name: 'chicken_taunt',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Sardines',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v1_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Saumon',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Singe C',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@techno_monkey@',
                                name: 'high_center',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Singe L',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@techno_monkey@',
                                name: 'high_left',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Singe R',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@techno_monkey@',
                                name: 'high_right',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Spiderman',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@lazlow@hi_podium@',
                                name: 'danceidle_hi_17_spiderman_laz',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Squeleton (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v2_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Squellette',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v2_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Truite',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_b_f01',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Vache',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_17_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Année 90',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_a@',
                        name: 'med_center',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Bagareur',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_b@',
                        name: 'med_center',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Balancement d’épaules',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v1_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#1 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v1_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_13_v2_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_13_v2_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Baton',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v2_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v2_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Boing Boing',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v1_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v1_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'BOLT',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_11_v1_male^2',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Bourré',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@lazlow@hi_podium@',
                        name: 'danceidle_li_11_takebreath_laz',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Boxing',
                items: [
                    {
                        type: 'animation',
                        name: 'C',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@beach_boxing@',
                                name: 'high_center',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'L',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@beach_boxing@',
                                name: 'high_left',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'R',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@beach_boxing@',
                                name: 'high_right',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Ça revient quand ?',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupb@',
                        name: 'hi_dance_crowd_13_v2_female^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Calme',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_11_v1_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#1 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_11_v1_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v2_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v2_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_11_v1_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_11_v1_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Cayo',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@low_intensity',
                                name: 'li_dance_crowd_15_v1_gropub_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@low_intensity',
                                name: 'li_dance_crowd_15_v1_gropub_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Clap Clap',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_13_v2_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_13_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_13_v2_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_hu_13_v1_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Accelerating',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_d_11_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Accelerating (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_d_11_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Bouncing #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_09_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Bouncing #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_11_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Bouncing #3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_09_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Crying',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_13_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Enthusiastic',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_13_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Motivating',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_13_v1_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Motivating (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_hu_13_v1_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Moving',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_13_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'OULALAAAAA',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_v2_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Raising #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@club@',
                                name: 'hi_idle_d_m01',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Raising #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@club@',
                                name: 'hi_idle_d_m02',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Raising #3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@club@',
                                name: 'hi_idle_d_m03',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Searching',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_13_v1_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Searching (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_hu_13_v1_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Stylized',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_17_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Training',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_d_11_v2_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Training (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_d_11_v2_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Transition',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v1_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Transition (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v1_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Coincé',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@female@var_b@',
                                name: 'med_center',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_13_v2_female^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v1_female^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Constipé',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_13_v2_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#1 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_13_v2_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupa@',
                                name: 'hi_dance_crowd_11_v1_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupb@',
                                name: 'hi_dance_crowd_09_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Coucou',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_17_v2_female^4',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Coudes',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v1_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v1_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Counting stars',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                        name: 'hi_idle_b_m02',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Cow Boy',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_09_v2_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_13_v1_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_hu_13_v1_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_11_v1_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_11_v1_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Crampe',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@lazlow@hi_podium@',
                        name: 'danceidle_mi_11_hippain_laz',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Pochtron',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'amb@world_human_partying@male@partying_beer@base',
                        name: 'base',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Déchaîné',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@female@var_b@',
                                name: 'high_center_up',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_a@',
                                name: 'high_center_up',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Démenbré',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_d_11_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#1 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_d_11_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_09_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Déprime',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_09_v1_male^2',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Détente',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@club@',
                        name: 'hi_idle_c_m03',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Didn’t find it',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v1_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_13_v2_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_13_v2_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupd@',
                                name: 'hi_dance_crowd_17_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'DJ',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'new_tou_sync_a_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#10',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_d_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#11',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_e_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#12',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_e_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#13',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_f_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#14',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_f_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#15',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_g_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#16',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_g_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#17',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_h_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#18',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_h_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#19',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_i_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'new_tou_sync_a_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#20',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_i_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#21',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_j_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#22',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_j_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#23',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_k_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#24',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_k_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#25',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_l_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#26',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_l_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_a_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_a_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_b_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#6',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_b_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#7',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_c_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#8',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_c_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#9',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_d_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'DJ perdu',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_09_v2_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@club@',
                                name: 'hi_loop_m02',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_13_v1_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_hu_13_v1_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Drogué',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_b_m01',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@club@',
                                name: 'hi_idle_c_m01',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@club@',
                                name: 'hi_loop_m01',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Drum',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v2_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_09_v2_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v2_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_11_v1_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v2_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#6',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v2_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#7',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_09_v1_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#8',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_13_v2_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Earth Shake',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_09_v1_male^4',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Echauffement',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v2_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_09_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_loop_m05',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_loop_m04',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_loop_m03',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#6',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_loop_m01',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#7',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v1_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#7 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v1_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'En douceur',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupe@',
                        name: 'hi_dance_crowd_13_v2_female^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'En haut !',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_11_v1_female^2',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Envie pressante',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupe@',
                                name: 'hi_dance_crowd_09_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupe@',
                                name: 'hi_dance_crowd_09_v1_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Et on accellère',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_b@',
                        name: 'med_center',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Etrange',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@club@',
                        name: 'hi_idle_b_m01',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Fatigué',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v2_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_13_v2_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_09_v1_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v2_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v1_female^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#6',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_11_v1_female^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Fingers',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Fleur',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_17_v2_female^5',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'FUCK YEAAAH',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@casino@mini@dance@dance_solo@female@var_a@',
                        name: 'high_center',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Fumette',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v1_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#10',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupe@',
                                name: 'hi_dance_crowd_17_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#11',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupa@',
                                name: 'hi_dance_crowd_17_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#12',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupa@',
                                name: 'hi_dance_crowd_15_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v1_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v2_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v1_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupb@',
                                name: 'hi_dance_crowd_17_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#6',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupc@',
                                name: 'hi_dance_crowd_15_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#7',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupd@',
                                name: 'hi_dance_crowd_15_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#8',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupd@',
                                name: 'hi_dance_crowd_17_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#9',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupe@',
                                name: 'hi_dance_crowd_15_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Groovy',
                items: [
                    {
                        type: 'animation',
                        name: 'Air #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_v2_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Air #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v2_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Air #2 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v2_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Bluesy',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v2_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Bluesy (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v2_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Calmly',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupc@',
                                name: 'hi_dance_crowd_11_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Dancing',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v2_female^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Dancing (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v2_female^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Flirting',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupd@',
                                name: 'hi_dance_crowd_13_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Funky',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_13_v2_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Funky (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_13_v2_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Inspired',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupa@',
                                name: 'hi_dance_crowd_09_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Jazzy',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v2_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Jazzy (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v2_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Miming',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v2_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Miming (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v2_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Resting',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v1_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Resting (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v1_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Rhythmic',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v1_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Rhythmic (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v1_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Shaking',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v2_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Shaking (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v2_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Shining',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v2_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Shining (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v2_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_09_v2_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v1_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Swingy',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v1_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Swingy (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v1_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Tapping',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupc@',
                                name: 'hi_dance_crowd_17_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Groupie',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_d_11_v2_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_d_11_v2_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Guitare',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationmale@air_guitar',
                        name: 'air_guitar',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Hands',
                items: [
                    {
                        type: 'animation',
                        name: 'Aiming',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_17_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Alternating',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_17_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Bouncing',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_11_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Cutting',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@club@',
                                name: 'hi_idle_c_m02',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Degenerating #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_13_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Degenerating #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_d_11_v2_female^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Degenerating #2 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_d_11_v2_female^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'DJ #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'DJ #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_13_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'DJ #3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@club@',
                                name: 'hi_idle_d_f01',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Fishing',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_09_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Flying',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_v1_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Flying (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_hu_15_v1_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Going',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_d_11_v2_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Going (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_d_11_v2_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Groovy',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Groovy (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Motivating',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Raising #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_11_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Raising #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Rasta',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_11_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Rotating',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_09_female^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Scattering',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Showing',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_17_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Slow',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_11_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Spiraling',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@club@',
                                name: 'hi_idle_d_f02',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Sunny',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_female^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Swimming',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_11_v1_female^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Swimming (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_11_v1_female^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Talking',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_v1_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Talking (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_hu_15_v1_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Vibing',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v2_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Vibing (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v2_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Hands Up',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_d_m05',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_d_m03',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_d_m02',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_d_m01',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_d_m04',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#6',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_v1_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#6 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_hu_15_v1_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#7',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_v2_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Heart Pumping',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationmale@heart_pumping',
                        name: 'heart_pumping',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Hey Hey',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                        name: 'hi_dance_facedj_hu_11_male^3',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: "Hey, j'suis la !",
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupb@',
                                name: 'hi_dance_crowd_17_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupd@',
                                name: 'hi_dance_crowd_17_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupe@',
                                name: 'hi_dance_crowd_17_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupa@',
                                name: 'hi_dance_crowd_17_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'HEYYYYYY YOU',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupa@',
                        name: 'hi_dance_crowd_11_v2_male^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Hiding dance',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupd@',
                        name: 'hi_dance_crowd_13_v1_male^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'HipHop',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'missfbi3_sniping',
                        name: 'dance_m_default',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Hippie',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'misschinese2_crystalmazemcs1_ig',
                        name: 'dance_loop_tao',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Hula Hoop',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@lazlow@hi_podium@',
                        name: 'danceidle_mi_15_shimmy_laz',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'In the Airrr',
                items: [
                    {
                        type: 'animation',
                        name: "Bras en l'air",
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v2_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: "Doigts en l'air",
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_11_v1_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: "Mains en l'air",
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_09_v1_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v2_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v2_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: "J'me la pète",
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_13_v2_male^2',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: "J'vibes",
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_a@',
                        name: 'low_center',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'J’met l’ambiance !',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_d_11_v2_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_d_11_v2_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Jazz',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationmale@jazz_hands',
                        name: 'jazz_hands',
                    },
                },
            },
            {
                type: 'animation',
                name: 'Je kiff',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                        name: 'hi_idle_b_f02',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Je patiente...',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupb@',
                        name: 'hi_dance_crowd_15_v1_female^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Je suis rassuré !',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v1_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v1_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Je suis un BG',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_11_v1_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_11_v1_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Joie',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@scripted@island@special_peds@dave@hs4_dave_stage1_ig5',
                                name: 'can-can_in_here',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@scripted@island@special_peds@scott@hs4_scott_stage2_ig4_p1',
                                name: 'base_idle_haung',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@scripted@island@special_peds@dave@hs4_dave_stage1_ig5',
                                name: 'base_idle_f',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@scripted@island@special_peds@dave@hs4_dave_stage1_ig5',
                                name: 'base_idle_e',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@scripted@island@special_peds@dave@hs4_dave_stage1_ig5',
                                name: 'base_idle_a',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#6',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@scripted@island@special_peds@dave@hs4_dave_stage2_ig6',
                                name: 'base_idle',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#7',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@scripted@island@special_peds@scott@hs4_scott_stage2_ig4_p1',
                                name: 'after_party_a_f_y_beach',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Joie exagéré',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@lazlow@hi_podium@',
                        name: 'danceidle_hi_11_turnaround_laz',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Jumper',
                items: [
                    {
                        type: 'animation',
                        name: 'C',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@jumper@',
                                name: 'high_center',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'L',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@jumper@',
                                name: 'high_left',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'R',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@jumper@',
                                name: 'high_right',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Karaté',
                items: [
                    {
                        type: 'animation',
                        name: 'C',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@techno_karate@',
                                name: 'high_center',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'L',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@techno_karate@',
                                name: 'high_left',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'R',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@techno_karate@',
                                name: 'high_right',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Keskia',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v1_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v1_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Le pieeeed devant',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_b@',
                        name: 'low_center',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Léger déhanché',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_b@',
                                name: 'low_center',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_09_v1_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Les mains devant',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                        name: 'hi_idle_b_m05',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: "Let's Go !",
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_15_v2_female^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: "LET'S GO BOOOOOOYYYY",
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupa@',
                        name: 'hi_dance_crowd_15_v2_male^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: "Let's groove",
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupb@',
                        name: 'hi_dance_crowd_15_v2_female^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Loooobster',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_11_v1_female^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Lost In my mind',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v2_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v2_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Lost with my feets',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_13_v2_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_13_v2_male^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Mamy',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupd@',
                                name: 'hi_dance_crowd_13_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupd@',
                                name: 'hi_dance_crowd_09_v1_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupa@',
                                name: 'hi_dance_crowd_13_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Maracasses',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v2_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v2_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v1_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_11_v1_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_11_v1_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v2_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#5 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v2_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#6',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_13_v2_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#6 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_13_v2_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Marionnette',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_c_m01',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_loop_f02',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_loop_f01',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Masks',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupc@',
                        name: 'hi_dance_crowd_09_v1_male^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Mime',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_17_v1_female^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Mini Danses',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@casino@mini@dance@dance_solo@female@var_b@',
                                name: 'low_left_up',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@casino@mini@dance@dance_solo@female@var_b@',
                                name: 'med_right_down',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@casino@mini@dance@dance_solo@female@var_b@',
                                name: 'med_left',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@casino@mini@dance@dance_solo@female@var_b@',
                                name: 'med_center_up',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@casino@mini@dance@dance_solo@female@var_b@',
                                name: 'med_center_down',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Motivé',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v1_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_09_v2_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_11_v1_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Mouchoir',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_15_v2_male^6',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Moving animatronic',
                items: [
                    {
                        type: 'animation',
                        name: 'Bugged',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_a_f01',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Clapping',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_d_11_v2_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Clapping (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_d_11_v2_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Gesticulating',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_a_m02',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Looping',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v1_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Looping (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v1_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Miming',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_v2_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Moving',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_a_m03',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Static #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_11_v1_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Static #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_11_v1_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Swinging',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_a_f02',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Wiggling',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_c_f02',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Musique',
                items: [
                    {
                        type: 'animation',
                        name: 'Air Drums #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationfemale@air_drums',
                                name: 'air_drums',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Air Drums #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationmale@air_drums',
                                name: 'air_drums',
                            },
                        },
                    },
                    {
                        type: 'scenario',
                        name: 'Jouer de la musique',
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'WORLD_HUMAN_MUSICIAN',
                            propsCreated: ['prop_acc_guitar_01', 'prop_acc_guitar_01_d1', 'prop_bongos_01'],
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Natation',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v2_female^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#1 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v2_female^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'NON NON NON',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_13_v2_female^5',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Oh Snap',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationmale@oh_snap',
                        name: 'oh_snap',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'OH YEAAH',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_a@',
                        name: 'high_center',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Ohana signifie famille',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_a@',
                        name: 'med_center',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'On est où ?',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v1_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: "On s'emmerde",
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                        name: 'hi_idle_a_m01',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'On tourne',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupb@',
                                name: 'hi_dance_crowd_17_v1_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupb@',
                                name: 'hi_dance_crowd_11_v1_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'OulalAAAAA',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_09_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#10',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_v2_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#11',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_17_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#12',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_v1_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#12 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_hu_15_v1_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_09_v1_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v1_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v1_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_13_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#6',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v2_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#7',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_09_v1_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#8',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v1_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#9',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Out of control',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_09_v2_male^4',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Pas dans le rythme',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                        name: 'hi_dance_facedj_hu_09_female^5',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Pas trop Vite',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v1_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v1_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Perché',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'special_ped@mountain_dancer@monologue_2@monologue_2a',
                                name: 'mnt_dnc_angel',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'special_ped@mountain_dancer@monologue_3@monologue_3a',
                                name: 'mnt_dnc_buttwag',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'special_ped@mountain_dancer@monologue_4@monologue_4a',
                                name: 'mnt_dnc_verse',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Petit pas sur le coté',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupc@',
                        name: 'hi_dance_crowd_13_v2_male^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Peur',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_11_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_v1_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_hu_15_v1_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Photography',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v2_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v1_female^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Playa',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_c_m05',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_c_m04',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_c_m03',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_c_m02',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_loop_m02',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Pochtron',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationmale@dj',
                        name: 'dj',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Pointe des pieds',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@club@',
                        name: 'hi_loop_m03',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Raise the Roof',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationfemale@raise_the_roof',
                        name: 'raise_the_roof',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Réservé',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_a@',
                        name: 'low_center_up',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Ressort',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v1_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Rouillé',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v2_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Rouillé (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v2_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v1_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Robot',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@lazlow@hi_podium@',
                        name: 'danceidle_mi_15_robot_laz',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Robot Fou',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@lazlow@hi_podium@',
                        name: 'danceidle_hi_15_crazyrobot_laz',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Rock',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationmale@rock',
                        name: 'rock',
                    },
                },
            },
            {
                type: 'category',
                name: 'Rock’n Roll',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v1_male^3',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_13_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Rythmé',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupa@',
                                name: 'hi_dance_crowd_13_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupa@',
                                name: 'hi_dance_crowd_11_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Salsa Roll',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationmale@salsa_roll',
                        name: 'salsa_roll',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Salt This',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                        name: 'hi_idle_c_f01',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Sand Trip',
                items: [
                    {
                        type: 'animation',
                        name: 'C',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@sand_trip@',
                                name: 'high_center',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'L',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@sand_trip@',
                                name: 'high_left',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'R',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@sand_trip@',
                                name: 'high_right',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Sexy',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mini@strip_club@private_dance@part1',
                                name: 'priv_dance_p1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mini@strip_club@private_dance@part2',
                                name: 'priv_dance_p2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@female@var_a@',
                                name: 'low_center_down',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@female@var_a@',
                                name: 'med_center_down',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mini@strip_club@lap_dance@ld_girl_a_song_a_p1',
                                name: 'ld_girl_a_song_a_p1_f',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Shagging',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationmale@air_shagging',
                        name: 'air_shagging',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Shake It',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v2_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v2_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Shaking Body',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupc@',
                                name: 'hi_dance_crowd_09_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupc@',
                                name: 'hi_dance_crowd_15_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupc@',
                                name: 'hi_dance_crowd_11_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupd@',
                                name: 'hi_dance_crowd_15_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupd@',
                                name: 'hi_dance_crowd_11_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#6',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupd@',
                                name: 'hi_dance_crowd_09_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#7',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupe@',
                                name: 'hi_dance_crowd_15_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#8',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupe@',
                                name: 'hi_dance_crowd_09_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#9',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupa@',
                                name: 'hi_dance_crowd_09_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Shoulders',
                items: [
                    {
                        type: 'animation',
                        name: 'Bouncing',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v1_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Dancing',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_17_v1_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Gesticulating',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_13_v2_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Jazzy',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_13_v2_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Jazzy (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_13_v2_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Laughing',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_13_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Laughing (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_13_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Rotating',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v1_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Shaking',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_09_v1_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Sky',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_v2_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Swinging',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v1_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Swinging (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v1_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Show Your Knees',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_v2_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_11_v1_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_11_v1_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_17_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Shuffle',
                items: [
                    {
                        type: 'animation',
                        name: 'C',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@shuffle@',
                                name: 'high_center',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'L',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@shuffle@',
                                name: 'high_left',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'R',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@shuffle@',
                                name: 'high_right',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Silencieuse',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_09_v1_male^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Skiing',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_11_v1_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_13_v1_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_hu_13_v1_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_d_11_v2_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_d_11_v2_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Sky Digging',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                        name: 'hi_dance_facedj_hu_11_female^5',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Slap',
                items: [
                    {
                        type: 'animation',
                        name: 'Left',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationpaired@f_f_backslap',
                                name: 'backslap_left',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Right',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationpaired@f_f_backslap',
                                name: 'backslap_right',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Slow Shaking',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupe@',
                        name: 'hi_dance_crowd_15_v1_female^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Snapping',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_11_v1_male^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_17_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_13_v2_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_13_v2_male^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Sound rise',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupd@',
                        name: 'hi_dance_crowd_15_v2_female^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Spirale',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_15_v1_female^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Step by Step',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_15_v1_male^6',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'StreetDance',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_b@',
                        name: 'high_center_down',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Summer',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_d_f02',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_d_f01',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_b_m03',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Sur le téco',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_09_v2_male^5',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Sur place',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@lazlow@hi_podium@',
                        name: 'danceidle_li_06_base_v2_laz',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Survoltée',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v2_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_09_v2_female^5',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Synth',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationmale@air_synth',
                        name: 'air_synth',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Tektonik',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_09_v1_female^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Tempo',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intincardancestd@rps@',
                        name: 'idle_a',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'The Woogie',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationfemale@the_woogie',
                        name: 'the_woogie',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Timide',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@female@var_b@',
                                name: 'low_center_down',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_09_v1_female^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'TOC TOC TOC',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                        name: 'hi_dance_facedj_hu_15_v2_female^4',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Together',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_13_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_13_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Tranquille',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@club@',
                                name: 'hi_loop_f02',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@club@',
                                name: 'hi_loop_f01',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Twerk nul',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@lazlow@hi_podium@',
                        name: 'danceidle_hi_11_buttwiggle_f_laz',
                    },
                },
            },
            {
                type: 'category',
                name: 'Twerking Shoulders',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_11_v1_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_11_v1_female^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Uncle Disco',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationfemale@uncle_disco',
                        name: 'uncle_disco',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Vieux',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'amb@world_human_partying@female@partying_beer@base',
                        name: 'base',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Vite ça presse',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_09_v2_female^4',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Wesh Wesh',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                                name: 'hi_idle_b_m04',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_11_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_11_v1_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_hu_15_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_09_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4 (rapide)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_09_v2_male^1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Wohooooo',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_09_v2_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_11_v1_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_15_v2_female^6',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                                name: 'hi_dance_crowd_13_v2_male^4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Yeah Yeah',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                        name: 'hi_dance_facedj_hu_15_v2_male^1',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Yo Yo',
                items: [
                    {
                        type: 'animation',
                        name: 'Rapide',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                                name: 'hi_dance_facedj_17_v1_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Simple',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                                name: 'hi_dance_facedj_17_v1_female^2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
        ],
    },
    {
        type: 'category',
        name: 'Duo',
        items: [
            {
                type: 'animation',
                name: 'Faire un bisou',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'mp_ped_interaction',
                        name: 'kisses_guy_a',
                    },
                },
            },
            {
                type: 'animation',
                name: 'Serrer la main',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'mp_common',
                        name: 'givetake1_a',
                    },
                },
            },
            {
                type: 'category',
                name: 'Victoire',
                items: [
                    {
                        type: 'animation',
                        name: 'Check !',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mp_ped_interaction',
                                name: 'handshake_guy_a',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Hey !',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mp_ped_interaction',
                                name: 'hugs_guy_a',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'High Five #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mp_ped_interaction',
                                name: 'highfive_guy_a',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'High Five #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@arena@celeb@flat@paired@no_props@',
                                name: 'high_five_b_player_a',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'High Five #3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@arena@celeb@flat@paired@no_props@',
                                name: 'high_five_b_player_b',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Insultant #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@arena@celeb@flat@paired@no_props@',
                                name: 'laugh_b_player_a',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Insultant #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@arena@celeb@flat@paired@no_props@',
                                name: 'laugh_b_player_b',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'On a gagné',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mp_parachute_outro@male@win',
                                name: 'first_place',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Tchek #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@arena@celeb@flat@paired@no_props@',
                                name: 'daps_b_player_a',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Tchek #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@arena@celeb@flat@paired@no_props@',
                                name: 'daps_b_player_b',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Team Mate',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mp_parachute_outro@female@win',
                                name: 'first_place',
                            },
                        },
                    },
                ],
            },
        ],
    },
    {
        type: 'category',
        name: 'Émotions et états',
        items: [
            {
                type: 'animation',
                name: 'Bouder',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'mini@hookers_sp',
                        name: 'idle_reject_loop_b',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Douleur',
                items: [
                    {
                        type: 'animation',
                        name: 'Blessé par balles',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'random@dealgonewrong',
                                name: 'idle_a',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Douleur coeur',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'rcmfanatic1out_of_breath',
                                name: 'p_zero_tired_02',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Ennuie',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'oddjobs@bailbond_hobotwitchy',
                        name: 'base',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Faire un bisou',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'mp_ped_interaction',
                        name: 'kisses_guy_a',
                    },
                },
            },
            {
                type: 'category',
                name: 'Joie',
                items: [
                    {
                        type: 'animation',
                        name: 'Applaudir',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@world_human_cheering@male_d',
                                name: 'base',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Jump Jump',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@world_human_cheering@female_c',
                                name: 'base',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Plié de rire',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@arena@celeb@flat@solo@no_props@',
                                name: 'taunt_d_player_b',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Rire',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'Rcmpaparazzo_3b',
                                name: 'idle_b',
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Peur',
                items: [
                    {
                        type: 'animation',
                        name: 'Menotté au sol',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'random@burial',
                                name: 'b_burial',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Nerveux',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'rcmme_tracey1',
                                name: 'nervous_loop',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Peur',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@code_human_cower_stand@male@idle_a',
                                name: 'idle_b',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Peur à genou #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@scripted@anim_yacht@yacht_ig1_hostage@',
                                name: 'cower_idle_bar_lady_barlady',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Peur à genou #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@scripted@anim_yacht@yacht_ig1_hostage@',
                                name: 'cower_idle_captain_captain',
                            },
                        },
                    },
                    {
                        type: 'event',
                        name: 'Se rendre',
                        rightLabel: null,
                        icon: null,
                        event: ClientEvent.ANIMATION_SURRENDER,
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Somnoler',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'mp_sleep',
                        name: 'sleep_loop',
                        options: {
                            freezeLastFrame: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Tristesse',
                items: [
                    {
                        type: 'animation',
                        name: 'Désolé',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'oddjobs@towingpleadingbase',
                                name: 'base',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Pleureuse',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationmale@cry_baby',
                                name: 'cry_baby',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Triste #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'rcmnigel1aig_3',
                                name: 'base_willie',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Triste #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@world_human_bum_standing@depressed@idle_a',
                                name: 'idle_a',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Triste par terre',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@lazlow@lo_alone@',
                                name: 'lowalone_dlg_moans_laz',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Tu es foufou',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intupperyou_loco',
                        name: 'idle_a',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                },
            },
        ],
    },
    {
        type: 'category',
        name: 'Event',
        items: [
            {
                type: 'category',
                name: 'DJ',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'new_tou_sync_a_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#10',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_d_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#11',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_e_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#12',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_e_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#13',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_f_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#14',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_f_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#15',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_g_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#16',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_g_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#17',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_h_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#18',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_h_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#19',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_i_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'new_tou_sync_a_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#20',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_i_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#21',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_j_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#22',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_j_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#23',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_k_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#24',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_k_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#25',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_l_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#26',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_l_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_a_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_a_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_b_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#6',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_b_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#7',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_c_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#8',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_c_mm',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#9',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@djs@tale_of_us@',
                                name: 'tou_dance_d_cc',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                ],
            },
        ],
    },
    {
        type: 'category',
        name: 'Gestes',
        items: [
            {
                type: 'animation',
                name: '« Shhht » bourré',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@arena@celeb@flat@solo@no_props@',
                        name: 'giggle_a_player_a',
                    },
                },
            },
            {
                type: 'animation',
                name: 'Aucune idée',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'gestures@m@sitting@generic@casual',
                        name: 'gesture_shrug_hard',
                        options: {
                            onlyUpperBody: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Bro',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'mp_player_int_upperbro_love',
                        name: 'mp_player_int_bro_love_enter',
                        options: {
                            onlyUpperBody: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Calmes-toi',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'rcmnigel1a',
                        name: 'idle_c_2',
                        options: {
                            onlyUpperBody: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Célébrations',
                items: [
                    {
                        type: 'animation',
                        name: 'Bang Bang',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationmale@bang_bang',
                                name: 'bang_bang',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'BOOM !',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationmale@mind_blown',
                                name: 'mind_blown',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: "C'est ma musique !",
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationmale@bro_love',
                                name: 'bro_love',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: "J'adore !",
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationmale@blow_kiss',
                                name: 'blow_kiss',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Jeter des billets',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationmale@raining_cash',
                                name: 'raining_cash',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Non mais allo ?!',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationfemale@call_me',
                                name: 'call_me',
                                options: {
                                    freezeLastFrame: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Pile ou Face ?',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationmale@coin_roll_and_toss',
                                name: 'coin_roll_and_toss',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Viser la lune',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'oddjobs@basejump@',
                                name: 'ped_a_loop',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Cherche au sol',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'Rcm_epsilonism4',
                        name: 'eps_4_ig_1_jimmy_lookaround_idle_a_jb',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Cordon de sécurité',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'nm@hands',
                        name: 'flail',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Damn',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'gestures@m@standing@casual',
                        name: 'gesture_damn',
                        options: {
                            onlyUpperBody: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Ecouteur',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'cellphone@female',
                        name: 'cellphone_call_listen_base',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Est-ce que vous êtes là !?',
                rightLabel: null,
                icon: null,
                animation: {
                    enter: {
                        dictionary: 'mp_player_int_uppergang_sign_a',
                        name: 'mp_player_int_gang_sign_a_enter',
                        duration: 500,
                    },
                    base: {
                        dictionary: 'mp_player_int_uppergang_sign_a',
                        name: 'mp_player_int_gang_sign_a',
                        options: {
                            repeat: true,
                        },
                    },
                    exit: {
                        dictionary: 'mp_player_int_uppergang_sign_a',
                        name: 'mp_player_int_gang_sign_a_exit',
                    },
                },
            },
            {
                type: 'animation',
                name: 'FacePalm',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationmale@face_palm',
                        name: 'face_palm',
                    },
                },
            },
            {
                type: 'animation',
                name: 'FacePalm 2',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'random@car_thief@agitated@idle_a',
                        name: 'agitated_idle_a',
                    },
                },
            },
            {
                type: 'animation',
                name: 'Faire du stop',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'random@hitch_lift',
                        name: 'idle_f',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: "Faire l'animal",
                items: [
                    {
                        type: 'animation',
                        name: "Faire l'oiseau",
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'random@peyote@bird',
                                name: 'wakeup',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Faire le Canard',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationfemale@chicken_taunt',
                                name: 'chicken_taunt',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Faire le poulet',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'random@peyote@chicken',
                                name: 'wakeup',
                            },
                        },
                    },
                ],
            },
            {
                type: 'scenario',
                name: 'Filmer',
                rightLabel: null,
                icon: null,
                scenario: {
                    name: 'WORLD_HUMAN_MOBILE_FILM_SHOCKING',
                },
            },
            {
                type: 'category',
                name: 'Grossier',
                items: [
                    {
                        type: 'animation',
                        name: 'Balle dans la tete',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mp_suicide',
                                name: 'pistol',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Branleur',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mp_player_int_upperwank',
                                name: 'mp_player_int_wank_01',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: "Doigt d'honneur",
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mp_player_int_upperfinger',
                                name: 'mp_player_int_finger_01_enter',
                                options: {
                                    freezeLastFrame: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Doigt dans le c**',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'friends@frt@ig_1',
                                name: 'trevor_impatient_wait_3',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Doigt dans le nez',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationmale@nose_pick',
                                name: 'nose_pick',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Fuck you',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intincarfingerbodhi@ds@',
                                name: 'idle_a',
                                options: {
                                    freezeLastFrame: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: "Je t'enc**e ou ?",
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationmale@dock',
                                name: 'dock',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Par derrière',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intincarair_shaggingbodhi@ds@',
                                name: 'idle_a',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Se gratter les c**',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mp_player_int_uppergrab_crotch',
                                name: 'mp_player_int_grab_crotch',
                                options: {
                                    freezeLastFrame: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Isoké',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intincarthumbs_uplow@ds@',
                        name: 'idle_a',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Je valide',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'missheist_jewel',
                        name: 'im_telling_you',
                        options: {
                            onlyUpperBody: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Laisse tomber',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'missheist_jewel',
                        name: 'despair',
                        options: {
                            onlyUpperBody: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Non',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'gestures@m@standing@casual',
                        name: 'gesture_head_no',
                        options: {
                            onlyUpperBody: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Oui',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'gestures@m@standing@casual',
                        name: 'gesture_pleased',
                        options: {
                            onlyUpperBody: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Peut-être',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'oddjobs@bailbond_hobohang_out_street_b',
                        name: 'idle_b',
                    },
                },
            },
            {
                type: 'category',
                name: 'Regarder',
                items: [
                    {
                        type: 'animation',
                        name: 'Je vais être en retard',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'oddjobs@taxi@gyn@cc@intro',
                                name: 'm_impatient_a',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Regarder autour',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'oddjobs@taxi@gyn@cc@intro',
                                name: 'm_impatient_b',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: "Regarder l'heure",
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'oddjobs@taxi@gyn@cc@intro',
                                name: 'm_impatient_a',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Regarder le sol',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'rcmrc_omega_2',
                                name: 'omega_idle_looking_around',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Regarder sa carte',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@world_human_tourist_map@female@base',
                                name: 'base',
                                options: {
                                    repeat: true,
                                },
                            },
                            props: [
                                {
                                    model: 'p_tourist_map_01_s',
                                    bone: 58867,
                                    position: [0.15, 0.081, 0.05],
                                    rotation: [120, 160, 30],
                                },
                            ],
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Rock',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intincarrockbodhi@ds@',
                        name: 'idle_a',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: "T'es un homme mort",
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationmale@cut_throat',
                        name: 'cut_throat',
                    },
                },
            },
            {
                type: 'animation',
                name: 'Taper au clavier',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'mp_fib_grab',
                        name: 'loop',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'WTF',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'gestures@m@standing@casual',
                        name: 'gesture_shrug_hard',
                        options: {
                            onlyUpperBody: true,
                        },
                    },
                },
            },
        ],
    },
    {
        type: 'category',
        name: 'Métiers et tâches',
        items: [
            {
                type: 'animation',
                name: 'Holster',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'move_m@intimidation@cop@unarmed',
                        name: 'idle',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Hygiène',
                items: [
                    {
                        type: 'scenario',
                        name: 'Balayer',
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'world_human_janitor',
                        },
                    },
                    {
                        type: 'scenario',
                        name: 'Laver le sol',
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'world_human_bum_wash',
                        },
                    },
                    {
                        type: 'scenario',
                        name: 'Laver vitres',
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'world_human_maid_clean',
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Prendre une douche',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mp_safehouseshower@male@',
                                name: 'male_shower_idle_d',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Se laver les mains',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'missheist_agency3aig_23',
                                name: 'urinal_sink_loop',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Jardinage',
                items: [
                    {
                        type: 'animation',
                        name: 'Creuser',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@drug_field_workers@rake@male_a@base',
                                name: 'base',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Creuser #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'missmic1leadinoutmic_1_mcs_2',
                                name: '_leadin_trevor',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'scenario',
                        name: 'Planter',
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'world_human_gardener_plant',
                        },
                    },
                    {
                        type: 'scenario',
                        name: 'Souffler',
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'world_human_gardener_leaf_blower',
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Massage Cardiaque',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'mini@cpr@char_a@cpr_str',
                        name: 'cpr_pumpchest',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Mécanique',
                items: [
                    {
                        type: 'animation',
                        name: 'Dépanneur du dimanche',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mp_fm_intro_cut',
                                name: 'fixing_a_ped',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'scenario',
                        name: 'Réparer',
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'world_human_vehicle_mechanic',
                        },
                    },
                    {
                        type: 'scenario',
                        name: 'Souder',
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'world_human_welding',
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Noter',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'missheistdockssetup1clipboard@base',
                        name: 'base',
                        options: {
                            repeat: true,
                        },
                    },
                    props: [
                        {
                            model: 'prop_notepad_01',
                            bone: 18905,
                            position: [0.09999999999999432, 0.020000000000003126, 0.04999999999999716],
                            rotation: [10, 0, 0],
                        },
                        {
                            model: 'prop_pencil_01',
                            bone: 58866,
                            position: [0.11000000000001364, -0.020000000000003126, 0.0009999999999998899],
                            rotation: [-120, 0, 0],
                        },
                    ],
                },
            },
            {
                type: 'animation',
                name: 'Paparazzi',
                rightLabel: null,
                icon: null,
                animation: {
                    enter: {
                        dictionary: 'amb@world_human_paparazzi@male@enter',
                        name: 'enter',
                    },
                    base: {
                        dictionary: 'amb@world_human_paparazzi@male@idle_a',
                        name: 'idle_c',
                        options: {
                            repeat: true,
                        },
                    },
                    exit: {
                        dictionary: 'amb@world_human_paparazzi@male@exit',
                        name: 'exit',
                    },
                    props: [
                        {
                            model: 'prop_pap_camera_01',
                            bone: 28422,
                            position: [0, 0, 0],
                            rotation: [0, 0, 0],
                            fx: {
                                dictionary: 'core',
                                name: 'ent_anim_paparazzi_flash',
                                position: [0.08, -0.08, 0.08],
                                rotation: [0, 0, 0],
                                scale: 1,
                                duration: [400, 400, 5766],
                                manualLoop: true,
                                delay: 6200,
                                net: true,
                            },
                        },
                    ],
                },
            },
            {
                type: 'scenario',
                name: 'SDF',
                rightLabel: null,
                icon: null,
                scenario: {
                    name: 'world_human_bum_freeway',
                },
            },
            {
                type: 'category',
                name: 'Travaux',
                items: [
                    {
                        type: 'scenario',
                        name: 'BTP',
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'world_human_const_drill',
                        },
                    },
                    {
                        type: 'scenario',
                        name: 'Marteau',
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'world_human_hammering',
                        },
                    },
                ],
            },
        ],
    },
    {
        type: 'category',
        name: 'New Emotes',
        items: [
            {
                type: 'animation',
                name: "Briquet en l'air",
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'samnick@lighter@wave',
                        name: 'waving_lighter',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                            freezeLastFrame: true,
                        },
                    },
                    props: [
                        {
                            bone: 18905,
                            model: 'samnick_prop_lighter01',
                            position: [0.11, 0.01, 0.02],
                            rotation: [-85, 188, 10],
                        },
                    ],
                },
            },
            {
                type: 'animation',
                name: 'Main dans les poches (Sweat)',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'bzzz@animations@hands',
                        name: 'bz_hands',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                            freezeLastFrame: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Police - Garde à Vous',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'airforce@attention',
                        name: 'base',
                        options: {
                            repeat: true,
                            onlyUpperBody: false,
                            enablePlayerControl: false,
                            freezeLastFrame: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Police - Main GPB1',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@male@holding_vest',
                        name: 'holding_vest_clip',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                            freezeLastFrame: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Police - Main GPB2',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@holding_side_vest',
                        name: 'holding_side_vest_clip',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                            freezeLastFrame: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Police - Repos',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'airforce@parade_rest',
                        name: 'base',
                        options: {
                            repeat: true,
                            onlyUpperBody: false,
                            enablePlayerControl: false,
                            freezeLastFrame: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Police - Stop Holster (arme ou holster droite)',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@hlstr_7360_hold',
                        name: 'holster_stop',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                            freezeLastFrame: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Props',
                items: [
                    {
                        type: 'animation',
                        name: 'Boite à Outils  #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'move_weapon@jerrycan@generic',
                                name: 'idle',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 28422,
                                    model: 'prop_tool_box_04',
                                    position: [0.396, 0.041, -0.003],
                                    rotation: [-90, 0, 90],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Boite à Outils  #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'move_weapon@jerrycan@generic',
                                name: 'idle',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 28422,
                                    model: 'imp_prop_tool_box_01a',
                                    position: [0.37, 0.02, 0],
                                    rotation: [-90, 0, 90],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Bongos',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@world_human_musician@bongos@male@base',
                                name: 'base',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 60309,
                                    model: 'prop_bongos_01',
                                    position: [0, 0, 0],
                                    rotation: [0, 0, 0],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Coupe Champagne',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@heists@humane_labs@finale@keycards',
                                name: 'ped_a_enter_loop',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: false,
                                },
                            },
                            props: [
                                {
                                    bone: 18905,
                                    model: 'prop_drink_champ',
                                    position: [0.1, -0.03, 0.03],
                                    rotation: [-100, 0, -10],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Demande Bague',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'ultra@propose',
                                name: 'propose',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: false,
                                    enablePlayerControl: false,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 64064,
                                    model: 'pata_freevalentinesday2',
                                    position: [0.019, 0.048, 0.011],
                                    rotation: [-9.035, 88.4373, -9.8783],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Guitare  #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@world_human_musician@guitar@male@idle_a',
                                name: 'idle_b',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 24818,
                                    model: 'prop_acc_guitar_01',
                                    position: [-0.1, 0.3, 0.05],
                                    rotation: [20, -15, 150],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Guitare  #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'switch@trevor@guitar_beatdown',
                                name: '001370_02_trvs_8_guitar_beatdown_idle_busker',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 24818,
                                    model: 'prop_acc_guitar_01',
                                    position: [-0.05, 0.3, 0.05],
                                    rotation: [20, -15, 150],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Guitare assis',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'misssnowie@gatlax',
                                name: 'base',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: false,
                                    enablePlayerControl: false,
                                    freezeLastFrame: false,
                                },
                            },
                            props: [
                                {
                                    bone: 24818,
                                    model: 'prop_acc_guitar_01',
                                    position: [-0.05, 0.31, 0],
                                    rotation: [30, 5, 150],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Guitare Electrique  #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@world_human_musician@guitar@male@idle_a',
                                name: 'idle_b',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 24818,
                                    model: 'prop_el_guitar_03',
                                    position: [-0.1, 0.31, 0.1],
                                    rotation: [20, -15, 150],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Guitare Electrique  #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@world_human_musician@guitar@male@idle_a',
                                name: 'idle_b',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 24818,
                                    model: 'prop_el_guitar_01',
                                    position: [-0.1, 0.3, 0.05],
                                    rotation: [20, -15, 150],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Guitare Transport',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'move_weapon@jerrycan@generic',
                                name: 'idle',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 28422,
                                    model: 'sf_prop_sf_guitar_case_01a',
                                    position: [0.28, -0.2, -0.06],
                                    rotation: [0, 0, 15],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Journal #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@world_human_clipboard@male@idle_a',
                                name: 'idle_a',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 60309,
                                    model: 'prop_cliff_paper',
                                    position: [0.097, -0.028, -0.017],
                                    rotation: [107.4008, 3.2712, -10.508],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Journal #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@world_human_clipboard@male@idle_a',
                                name: 'idle_a',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 60309,
                                    model: 'ng_proc_paper_news_quik',
                                    position: [0.159, 0.029, -0.01],
                                    rotation: [90.9998, 0.0087, 0.5],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Journal #3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@world_human_clipboard@male@idle_a',
                                name: 'idle_a',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 60309,
                                    model: 'ng_proc_paper_news_rag',
                                    position: [0.176, -0.0007, 0.02],
                                    rotation: [99.8306, 3.2841, -4.7185],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Lire Livre Assis/Appuyé dos',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'holding_book_5@dark',
                                name: 'holding_book_5_clip',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: false,
                                    enablePlayerControl: false,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 18905,
                                    model: 'v_ilev_mp_bedsidebook',
                                    position: [0.21, 0.06, 0.04],
                                    rotation: [170.6161, -14.296, 28.8727],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Lire Livre Debout',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'cellphone@',
                                name: 'cellphone_text_read_base',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: false,
                                },
                            },
                            props: [
                                {
                                    bone: 6286,
                                    model: 'prop_novel_01',
                                    position: [0.17, 0, -0.066],
                                    rotation: [180, 0, 90],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Microphone Rock',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'lunyx@mic@p7',
                                name: 'mic@p7',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 28422,
                                    model: 'v_ilev_fos_mic',
                                    position: [-0.821, 0.09, -1.19],
                                    rotation: [-2.1478, 36.3684, -11.7503],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Nettoyage Mur',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@world_human_maid_clean@',
                                name: 'base',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 28422,
                                    model: 'prop_sponge_01',
                                    position: [0, 0, -0.01],
                                    rotation: [90, 0, 0],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Nettoyage Table',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'timetable@floyd@clean_kitchen@base',
                                name: 'base',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 28422,
                                    model: 'prop_sponge_01',
                                    position: [0, 0, -0.01],
                                    rotation: [90, 0, 0],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Passer la Serpillère',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'move_mop',
                                name: 'idle_scrub_small_player',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 28422,
                                    model: 'prop_cs_mop_s',
                                    position: [0, 0, 0.12],
                                    rotation: [0, 0, 0],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Pointer au Sol (avoir arme en main)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'chocoholic@single12',
                                name: 'single12_clip',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: false,
                                },
                            },
                            props: [
                                {
                                    bone: 17188,
                                    model: 'prop_cigar_01',
                                    position: [0.045, 0.013, 0.017],
                                    rotation: [0, 0, 0],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Porter Carton',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@heists@box_carry@',
                                name: 'idle',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 60309,
                                    model: 'hei_prop_heist_box',
                                    position: [0.025, 0.08, 0.255],
                                    rotation: [-145, 290, 0],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Radiocassette',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'move_weapon@jerrycan@generic',
                                name: 'idle',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 57005,
                                    model: 'prop_boombox_01',
                                    position: [0.27, 0, 0],
                                    rotation: [90, 180, -90],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Radiocassette (avec lunettes)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'molly@boombox1',
                                name: 'boombox1_clip',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 31086,
                                    model: 'prop_cs_sol_glasses',
                                    position: [0.044, 0.074, 0],
                                    rotation: [-160.9843, -88.7288, -0.6197],
                                },
                                {
                                    bone: 10706,
                                    model: 'prop_ghettoblast_02',
                                    position: [-0.231, -0.077, 0.241],
                                    rotation: [-179.7256, 176.7406, -30.019],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Sac de Sport',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'move_weapon@jerrycan@generic',
                                name: 'idle',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 28422,
                                    model: 'bkr_prop_duffel_bag_01a',
                                    position: [0.26, 0.04, 0],
                                    rotation: [90, 0, -78.99],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Sac Shopping  #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'move_weapon@jerrycan@generic',
                                name: 'idle',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 28422,
                                    model: 'prop_cs_shopping_bag',
                                    position: [0.24, 0.03, -0.04],
                                    rotation: [0, -90, 10],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Sac Shopping  #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'move_weapon@jerrycan@generic',
                                name: 'idle',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 28422,
                                    model: 'prop_shopping_bags02',
                                    position: [0.05, 0.02, 0],
                                    rotation: [178.8, 91.19, 9.97],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Sac Shopping  #3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'move_weapon@jerrycan@generic',
                                name: 'idle',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 28422,
                                    model: 'vw_prop_casino_shopping_bag_01a',
                                    position: [0.24, 0.03, -0.04],
                                    rotation: [0, -90, 10],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Saxophone  #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'play_saxophone@dark',
                                name: 'play_saxophone_clip',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: false,
                                },
                            },
                            props: [
                                {
                                    bone: 57005,
                                    model: 'rpemotes_prop_saxophone01',
                                    position: [0.07, 0.04, 0.03],
                                    rotation: [-71.2242, 29.3364, 5.9514],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Saxophone  #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'play_saxophone@dark',
                                name: 'play_saxophone_clip',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: false,
                                },
                            },
                            props: [
                                {
                                    bone: 57005,
                                    model: 'rpemotes_prop_saxophone02',
                                    position: [0.07, 0.04, 0.03],
                                    rotation: [-71.2242, 29.3364, 5.9514],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Tenir Livre (torse)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'holding_book_3@dark',
                                name: 'holding_book_3_clip',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: false,
                                },
                            },
                            props: [
                                {
                                    bone: 18905,
                                    model: 'prop_cs_stock_book',
                                    position: [0.07, 0.04, 0.07],
                                    rotation: [0, 0, -15],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Tenir Serpillère',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'missfbi4prepp1',
                                name: 'idle',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 28422,
                                    model: 'prop_cs_mop_s',
                                    position: [-0.05, -0.12, -0.3],
                                    rotation: [-13.377, 10.3568, 17.9681],
                                },
                            ],
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Trousse Médicale',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'move_weapon@jerrycan@generic',
                                name: 'idle',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                    freezeLastFrame: true,
                                },
                            },
                            props: [
                                {
                                    bone: 57005,
                                    model: 'xm_prop_x17_bag_med_01a',
                                    position: [0.42, 0.01, -0.01],
                                    rotation: [90, -180, -90],
                                },
                            ],
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'UwU',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'uwu@egirl',
                        name: 'base',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                            freezeLastFrame: true,
                        },
                    },
                },
            },
        ],
    },
    {
        type: 'category',
        name: 'Police',
        items: [
            {
                type: 'animation',
                name: 'Bras Croisé',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@heists@heist_corona@single_team',
                        name: 'single_team_loop_boss',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                },
            },
            {
                type: 'scenario',
                name: 'Circulation',
                rightLabel: null,
                icon: null,
                scenario: {
                    name: 'world_human_car_park_attendant',
                },
            },
            {
                type: 'animation',
                name: 'Cow Boy',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'amb@world_human_cop_idles@male@base',
                        name: 'base',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Ecouteur',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'cellphone@female',
                        name: 'cellphone_call_listen_base',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Holster',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'move_m@intimidation@cop@unarmed',
                        name: 'idle',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Lampe torche',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'amb@world_human_security_shine_torch@male@base',
                        name: 'base',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                    props: [
                        {
                            model: 'prop_cs_police_torch_02',
                            bone: 18905,
                            position: [0.160000000000025, 0.030000000000001137, 0],
                            rotation: [110, -70, 0],
                        },
                    ],
                },
            },
            {
                type: 'event',
                name: 'Plaquage',
                rightLabel: null,
                icon: null,
                event: ClientEvent.TAKE_DOWN,
            },
            {
                type: 'category',
                name: 'SWAT',
                items: [
                    {
                        type: 'animation',
                        name: 'A Droite !',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'swat',
                                name: 'you_right',
                                options: {
                                    freezeLastFrame: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'A Gauche !',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'swat',
                                name: 'you_left',
                                options: {
                                    freezeLastFrame: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Avancez !',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'swat',
                                name: 'you_fwd',
                                options: {
                                    freezeLastFrame: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: "C'est compris !",
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'swat',
                                name: 'understood',
                                options: {
                                    freezeLastFrame: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Derrière !',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'swat',
                                name: 'you_back',
                                options: {
                                    freezeLastFrame: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Ralliement !',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'swat',
                                name: 'rally_point',
                                options: {
                                    freezeLastFrame: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Reculez !',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'swat',
                                name: 'go_fwd',
                                options: {
                                    freezeLastFrame: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Stop !',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'swat',
                                name: 'freeze',
                                options: {
                                    freezeLastFrame: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Venez !',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'swat',
                                name: 'come',
                                options: {
                                    freezeLastFrame: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                ],
            },
        ],
    },
    {
        type: 'category',
        name: 'Positions',
        items: [
            {
                type: 'category',
                name: 'Bras et mains',
                items: [
                    {
                        type: 'animation',
                        name: 'Attente',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'missheist_jewel_setup',
                                name: 'idle_storeclerk',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Attentif #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'oddjobs@taxi@gyn@cc@intro',
                                name: 'f_impatient_a',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Attentif #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'oddjobs@taxi@gyn@cc@intro',
                                name: 'f_impatient_a',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Bras croisé #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@world_human_window_shop@male@idle_a',
                                name: 'browse_a',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Bras croisé #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'oddjobs@bailbond_hobohang_out_street_c',
                                name: 'base',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Bras en croix',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@casino@hangout@ped_female@stand@03a@base',
                                name: 'base',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Impatient #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'oddjobs@bailbond_surf_farm',
                                name: 'idle_a',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Impatient #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'oddjobs@assassinate@guard',
                                name: 'unarmed_fold_arms',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Mains dans le dos #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'oddjobs@taxi@gyn@cc@intro',
                                name: 'f_impatient_c',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Mains dans le dos #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@casino@valet_scenario@pose_d@',
                                name: 'base_a_m_y_vinewood_01',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Mains ensembles',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'missfbi4mcs_2',
                                name: 'loop_sec_a',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Mains jointes (neutre)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@carmeet@checkout_car@male_a@base',
                                name: 'base',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Mains jointes (triste)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@carmeet@checkout_engine@male_c@base',
                                name: 'base',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Mouvement de bras #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'rcmme_amanda1',
                                name: 'pst_arrest_loop_owner',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Mouvement de bras #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'rcmme_amanda1',
                                name: 'pst_arrest_loop_cop',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Stressé',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@casino@hangout@ped_female@stand@02a@base',
                                name: 'base',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: "Est-ce que j'ai eu l'bac..",
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'oddjobs@taxi@gyn@cc@intro',
                        name: 'f_impatient_b',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Fier',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'rcmbarry',
                        name: 'base',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Patient',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'move_characters@tracey@core@',
                        name: 'idle',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Pensif',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@casino@hangout@ped_male@stand@02b@base',
                        name: 'base',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: "S'allonger",
                items: [
                    {
                        type: 'animation',
                        name: 'Allongé (Aie)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'missheist_jewel',
                                name: 'gassed_npc_customer1',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Allongé (Blessé)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'missfbi5ig_0',
                                name: 'lyinginpain_loop_steve',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Allongé (Dos #2)',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'missheist_jewel',
                                name: 'gassed_npc_customer2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'scenario',
                        name: 'Allongé (Dos)',
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'WORLD_HUMAN_SUNBATHE_BACK',
                        },
                    },
                    {
                        type: 'scenario',
                        name: 'Allongé (Ventre)',
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'WORLD_HUMAN_SUNBATHE',
                        },
                    },
                    {
                        type: 'scenario',
                        name: 'Dormir',
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'WORLD_HUMAN_BUM_SLUMPED',
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Petite sieste au soleil',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'missheist_jewel',
                                name: 'gassed_npc_guard',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'PLS',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'missheist_jewel',
                                name: 'gassed_npc_customer4',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Tomber dans les pommes',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'ragdoll',
                                name: '',
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: "S'appuyer",
                items: [
                    {
                        type: 'animation',
                        name: 'Adossé au bar',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@gt_idle@',
                                name: 'base',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Contre un mur',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'rcmnigel1a_band_groupies',
                                name: 'idle_a_m2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Main sur la voiture',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'missstrip_club_lean',
                                name: 'player_lean_rail_loop',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Main sur le mur',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@scripted@island@special_peds@couple@hs4_couple_stage2_ig10',
                                name: 'base_idle_male',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Sur la table',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'missheist_agency2aig_4',
                                name: 'look_plan_b_worker2',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: "S'appuyer dos au mur",
                items: [
                    {
                        type: 'animation',
                        name: 'Bras levé #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@hand_up@enter',
                                name: 'enter_back',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@hand_up@idle_a',
                                name: 'idle_a',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@hand_up@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Bras levé #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@hand_up@enter',
                                name: 'enter_back',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@hand_up@idle_a',
                                name: 'idle_b',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@hand_up@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Bras levé #3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@hand_up@enter',
                                name: 'enter_back',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@hand_up@idle_a',
                                name: 'idle_c',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@hand_up@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Bras levé #4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@hand_up@enter',
                                name: 'enter_back',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@hand_up@idle_b',
                                name: 'idle_d',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@hand_up@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Bras levé #5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@hand_up@enter',
                                name: 'enter_back',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@hand_up@idle_b',
                                name: 'idle_e',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@hand_up@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'scenario',
                        name: 'Hasard',
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'WORLD_HUMAN_LEANING',
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Jambe levée #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@foot_up@enter',
                                name: 'enter_back',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@foot_up@idle_a',
                                name: 'idle_a',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@foot_up@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Jambe levée #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@foot_up@enter',
                                name: 'enter_back',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@foot_up@idle_a',
                                name: 'idle_b',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@foot_up@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Jambe levée #3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@foot_up@enter',
                                name: 'enter_back',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@foot_up@idle_a',
                                name: 'idle_c',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@foot_up@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Jambe levée #4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@foot_up@enter',
                                name: 'enter_back',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@foot_up@idle_b',
                                name: 'idle_d',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@foot_up@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Jambe levée #5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@foot_up@enter',
                                name: 'enter_back',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@foot_up@idle_b',
                                name: 'idle_e',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@foot_up@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Jambes croisées #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@legs_crossed@enter',
                                name: 'enter_front',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@legs_crossed@idle_a',
                                name: 'idle_a',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@legs_crossed@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Jambes croisées #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@legs_crossed@enter',
                                name: 'enter_front',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@legs_crossed@idle_a',
                                name: 'idle_b',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@legs_crossed@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Jambes croisées #3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@legs_crossed@enter',
                                name: 'enter_front',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@legs_crossed@idle_a',
                                name: 'idle_c',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@legs_crossed@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Jambes croisées #4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@legs_crossed@enter',
                                name: 'enter_front',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@legs_crossed@idle_b',
                                name: 'idle_d',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@legs_crossed@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Jambes croisées #5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@legs_crossed@enter',
                                name: 'enter_front',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@legs_crossed@idle_b',
                                name: 'idle_e',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@legs_crossed@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Mains tenues #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@hands_together@enter',
                                name: 'enter_back',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@hands_together@idle_a',
                                name: 'idle_b',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@hands_together@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Mains tenues #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@hands_together@enter',
                                name: 'enter_back',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@hands_together@idle_a',
                                name: 'idle_c',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@hands_together@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Mains tenues #3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@hands_together@enter',
                                name: 'enter_back',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@hands_together@idle_b',
                                name: 'idle_d',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@hands_together@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Mains tenues #4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            enter: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@hands_together@enter',
                                name: 'enter_back',
                                duration: 3200,
                            },
                            base: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@hands_together@idle_b',
                                name: 'idle_e',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@male@wall@back@hands_together@exit',
                                name: 'exit_front',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Pensif #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@mobile@idle_a',
                                name: 'idle_a',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@mobile@exit',
                                name: 'exit',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Pensif #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@mobile@idle_a',
                                name: 'idle_b',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@mobile@exit',
                                name: 'exit',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Pensif #3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@mobile@idle_a',
                                name: 'idle_c',
                                options: {
                                    repeat: true,
                                },
                            },
                            exit: {
                                dictionary: 'amb@world_human_leaning@female@wall@back@mobile@exit',
                                name: 'exit',
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: "S'asseoir",
                items: [
                    {
                        type: 'animation',
                        name: "S'asseoir",
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'switch@michael@sitting',
                                name: 'idle',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'scenario',
                        name: "S'asseoir (Armchair)",
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'PROP_HUMAN_SEAT_ARMCHAIR',
                            fixPositionDelta: [-0.48, -0.5],
                        },
                    },
                    {
                        type: 'scenario',
                        name: "S'asseoir (Bench)",
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'PROP_HUMAN_SEAT_BENCH',
                            fixPositionDelta: [-0.48, -0.5],
                        },
                    },
                    {
                        type: 'scenario',
                        name: "S'asseoir (Bus Stop Wait)",
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'PROP_HUMAN_SEAT_BUS_STOP_WAIT',
                            fixPositionDelta: [-0.48, -0.5],
                        },
                    },
                    {
                        type: 'animation',
                        name: "S'asseoir (Capot #1)",
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@scripted@carmeet@tun_meet_ig2_race@',
                                name: 'look_at_player',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: "S'asseoir (Capot #2)",
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@scripted@carmeet@tun_meet_ig2_race@',
                                name: 'base',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'scenario',
                        name: "S'asseoir (Chair Upright)",
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'PROP_HUMAN_SEAT_CHAIR_UPRIGHT',
                            fixPositionDelta: [-0.48, -0.5],
                        },
                    },
                    {
                        type: 'scenario',
                        name: "S'asseoir (Chair)",
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'PROP_HUMAN_SEAT_CHAIR',
                            fixPositionDelta: [-0.48, -0.5],
                        },
                    },
                    {
                        type: 'scenario',
                        name: "S'asseoir (Deckchair)",
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'PROP_HUMAN_SEAT_DECKCHAIR',
                            fixPositionDelta: [-0.48, -0.6],
                        },
                    },
                    {
                        type: 'scenario',
                        name: "S'asseoir (MP)",
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'PROP_HUMAN_SEAT_CHAIR_MP_PLAYER',
                            fixPositionDelta: [-0.48, -0.5],
                        },
                    },
                    {
                        type: 'animation',
                        name: "S'asseoir (Sol PLS)",
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@nightclub@lazlow@lo_toilet@',
                                name: 'lowtoilet_base_v2_laz',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'scenario',
                        name: "S'asseoir (Sol)",
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'WORLD_HUMAN_PICNIC',
                        },
                    },
                    {
                        type: 'scenario',
                        name: "S'asseoir (Stripclub)",
                        rightLabel: null,
                        icon: null,
                        scenario: {
                            name: 'PROP_HUMAN_SEAT_STRIP_WATCH',
                            fixPositionDelta: [-0.48, -0.5],
                        },
                    },
                    {
                        type: 'animation',
                        name: "S'asseoir (WC)",
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'switch@trevor@on_toilet',
                                name: 'trev_on_toilet_loop',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Se mettre à genoux',
                items: [
                    {
                        type: 'animation',
                        name: 'A genoux',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'misschinese2_crystalmaze',
                                name: '2int_loop_base_taotranslator',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Accroupi',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'rcmextreme3',
                                name: 'idle',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
        ],
    },
    {
        type: 'category',
        name: 'Salutations',
        items: [
            {
                type: 'category',
                name: 'Eh oh, je suis là !',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@waving@male',
                                name: 'ground_wave',
                                options: {
                                    freezeLastFrame: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@amb@waving@male',
                                name: 'air_wave',
                                options: {
                                    freezeLastFrame: true,
                                    onlyUpperBody: true,
                                    enablePlayerControl: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Miss Monde',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intupperwave',
                        name: 'idle_a',
                        options: {
                            repeat: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Namaste !',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'timetable@amanda@ig_4',
                        name: 'ig_4_base',
                        options: {
                            freezeLastFrame: true,
                            onlyUpperBody: true,
                            enablePlayerControl: true,
                        },
                    },
                },
            },
            {
                type: 'category',
                name: 'Révérences',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@arena@celeb@podium@no_prop@',
                                name: 'regal_a_1st',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@arena@celeb@podium@no_prop@',
                                name: 'regal_c_1st',
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Saluer',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'gestures@m@standing@casual',
                                name: 'gesture_hello',
                                options: {
                                    onlyUpperBody: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'friends@frj@ig_1',
                                name: 'wave_e',
                                options: {
                                    onlyUpperBody: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'friends@frj@ig_1',
                                name: 'wave_a',
                                options: {
                                    onlyUpperBody: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Salut Militaire',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'mp_player_int_uppersalute',
                        name: 'mp_player_int_salute',
                        options: {
                            repeat: true,
                        },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Serrer la main',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'mp_common',
                        name: 'givetake1_a',
                    },
                },
            },
            {
                type: 'animation',
                name: 'Sifflement',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'rcmnigel1c',
                        name: 'hailing_whistle_waive_a',
                    },
                },
            },
            {
                type: 'animation',
                name: 'Tapes en 5',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'mp_ped_interaction',
                        name: 'highfive_guy_a',
                    },
                },
            },
            {
                type: 'category',
                name: 'XXX',
                items: [
                    {
                        type: 'animation',
                        name: 'xxx : Boobs',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mini@strip_club@idles@stripper',
                                name: 'stripper_idle_05',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'xxx : Coucou Toi',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mini@strip_club@idles@stripper',
                                name: 'stripper_idle_02',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'xxx : Donner faim',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mini@strip_club@idles@stripper',
                                name: 'stripper_idle_04',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'xxx : Hey Toi',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mini@strip_club@idles@stripper',
                                name: 'stripper_idle_06',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'xxx : Regarde mon ***',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mini@strip_club@idles@stripper',
                                name: 'stripper_idle_03',
                            },
                        },
                    },
                ],
            },
        ],
    },
    {
        type: 'category',
        name: 'Sports',
        items: [
            {
                type: 'animation',
                name: 'A bout de souffle',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 're@construction',
                        name: 'out_of_breath',
                    },
                },
            },
            {
                type: 'category',
                name: 'Boxe',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationmale@shadow_boxing',
                                name: 'shadow_boxing',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@mp_player_intcelebrationfemale@shadow_boxing',
                                name: 'shadow_boxing',
                            },
                        },
                    },
                ],
            },
            {
                type: 'category',
                name: 'Célébrations',
                items: [
                    {
                        type: 'animation',
                        name: 'BackFlip',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@arena@celeb@flat@solo@no_props@',
                                name: 'flip_a_player_a',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Capoeira',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@arena@celeb@flat@solo@no_props@',
                                name: 'cap_a_player_a',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Football',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@arena@celeb@flat@solo@no_props@',
                                name: 'slide_a_player_a',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Saut #1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@arena@celeb@flat@solo@no_props@',
                                name: 'jump_b_player_a',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Saut #2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@arena@celeb@flat@solo@no_props@',
                                name: 'jump_c_player_a',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Saut #3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@arena@celeb@flat@solo@no_props@',
                                name: 'jump_d_player_a',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: 'Vague arrière',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'anim@arena@celeb@flat@solo@no_props@',
                                name: 'pageant_a_player_a',
                            },
                        },
                    },
                ],
            },
            {
                type: 'animation',
                name: 'Départ de course',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'random@street_race',
                        name: 'grid_girl_race_start',
                    },
                },
            },
            {
                type: 'category',
                name: 'Étirements',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mini@triathlon',
                                name: 'idle_f',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mini@triathlon',
                                name: 'idle_a',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mini@triathlon',
                                name: 'idle_d',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mini@triathlon',
                                name: 'idle_e',
                                options: {
                                    repeat: true,
                                },
                            },
                        },
                    },
                ],
            },
            {
                type: 'event',
                name: 'Faire des abdos',
                rightLabel: null,
                icon: '💪',
                event: ClientEvent.PLAYER_HEALTH_DO_SIT_UP,
            },
            {
                type: 'event',
                name: 'Faire des haltères',
                rightLabel: null,
                icon: '💪',
                event: ClientEvent.PLAYER_HEALTH_DO_FREE_WEIGHT,
            },
            {
                type: 'event',
                name: 'Faire des pompes',
                rightLabel: null,
                icon: '💪',
                event: ClientEvent.PLAYER_HEALTH_DO_PUSH_UP,
            },
            {
                type: 'event',
                name: 'Faire du yoga',
                rightLabel: null,
                icon: '🧘',
                event: ClientEvent.PLAYER_HEALTH_DO_YOGA,
            },
            {
                type: 'animation',
                name: 'Karate',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationfemale@karate_chops',
                        name: 'karate_chops',
                    },
                },
            },
            {
                type: 'scenario',
                name: 'Montrer ses muscles',
                rightLabel: null,
                icon: null,
                scenario: {
                    name: 'WORLD_HUMAN_MUSCLE_FLEX',
                },
            },
            {
                type: 'category',
                name: 'Préparations',
                items: [
                    {
                        type: 'animation',
                        name: '#1',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mp_deathmatch_intros@unarmed',
                                name: 'intro_male_unarmed_a',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#2',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mp_deathmatch_intros@unarmed',
                                name: 'intro_male_unarmed_b',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#3',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mp_deathmatch_intros@unarmed',
                                name: 'intro_male_unarmed_c',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#4',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mp_deathmatch_intros@unarmed',
                                name: 'intro_male_unarmed_d',
                            },
                        },
                    },
                    {
                        type: 'animation',
                        name: '#5',
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'mp_deathmatch_intros@unarmed',
                                name: 'intro_male_unarmed_e',
                            },
                        },
                    },
                ],
            },
            {
                type: 'event',
                name: 'Ramasser de la neige',
                rightLabel: null,
                icon: '❄️',
                event: ClientEvent.WEAPON_PICK_SNOWBALL,
            },
        ],
    },
];
