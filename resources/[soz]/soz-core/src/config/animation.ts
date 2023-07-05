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
];

export const Moods: MoodConfigList = [
    { name: 'Humeur par défaut', mood: 'mood_normal_1' },
    { name: 'Suffisant', mood: 'mood_smug_1' },
    { name: 'Stressé', mood: 'mood_stressed_1' },
    { name: 'Pas content', mood: 'mood_drivefast_1' },
    { name: 'Blessé', mood: 'mood_injured_1' },
    { name: 'En colère', mood: 'mood_angry_1' },
    { name: 'Bourré', mood: 'mood_drunk_1' },
    { name: 'Joyeux', mood: 'mood_happy_1' },
    { name: 'Boudeur', mood: 'mood_sulk_1' },
];

export const Animations: AnimationConfigList = [
    {
        type: 'category',
        name: 'Danses et instruments',
        items: [
            {
                type: 'animation',
                name: '90°C',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_15_v2_female^3',
                        options: { repeat: true },
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Aller, Aller',
                items: [
                    {
                        type: 'animation',
                        name: 'Aller, Aller !',
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
                        name: 'Aller, Aller ! 2',
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
                name: 'Balancement d’épaules',
                items: [
                    {
                        type: 'animation',
                        name: "Balancement d'épaules",
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
                        name: "Balancement d'épaules (rapide)",
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
                        name: "Balancement d'épaules 2",
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
                        name: "Balancement d'épaules 2 (rapide)",
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
                name: 'Boing Boing',
                items: [
                    {
                        type: 'animation',
                        name: 'Boing Boing',
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
                    {
                        type: 'animation',
                        name: 'Boing Boing (rapide)',
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
                ],
            },
            {
                type: 'category',
                name: 'Boxing',
                items: [
                    {
                        type: 'animation',
                        name: 'Boxing C',
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
                        name: 'Boxing L',
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
                        name: 'Boxing R',
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
                type: 'category',
                name: 'Cayo',
                items: [
                    {
                        type: 'animation',
                        name: 'Cayo Timide #1',
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
                        name: 'Cayo Timide #2',
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
                        name: 'Accelerating Clap',
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
                        name: 'Accelerating Clap (rapide)',
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
                        name: 'Bouncing Clap',
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
                        name: 'Bouncing Clap',
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
                        name: 'Bouncing Clap',
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
                        name: 'Clap Clap',
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
                        name: 'Clap Clap 2',
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
                        name: 'Clap Clap 3',
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
                        name: 'Clap Clap 4 (rapide)',
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
                        name: 'Clap Clap OULALAAAAA',
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
                        name: 'Crying Clap',
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
                        name: 'Enthusiastic Clap',
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
                        name: 'Motivating Clap',
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
                        name: 'Motivating Clap (rapide)',
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
                        name: 'Moving Clap',
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
                        name: 'Raising Clap',
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
                        name: 'Raising Clap 2',
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
                        name: 'Raising Clap 3',
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
                        name: 'Searching Clap',
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
                        name: 'Searching Clap (rapide)',
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
                        name: 'Stylized Clap',
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
                        name: 'Training Clap',
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
                        name: 'Training Clap (rapide)',
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
                        name: 'Transition Clap',
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
                        name: 'Transition Clap (rapide)',
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
                type: 'animation',
                name: 'Counting stars',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                        name: 'hi_idle_b_m02',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'DJ',
                items: [
                    {
                        type: 'animation',
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                    {
                        type: 'animation',
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                        name: 'DJ',
                        rightLabel: 'Nouveau!',
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
                ],
            },
            {
                type: 'animation',
                name: 'Danse Année 90',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_a@',
                        name: 'med_center',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse BOLT',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_11_v1_male^2',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Bagareur',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_b@',
                        name: 'med_center',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Bourré',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@lazlow@hi_podium@',
                        name: 'danceidle_li_11_takebreath_laz',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Crampe',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@lazlow@hi_podium@',
                        name: 'danceidle_mi_11_hippain_laz',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse DJ',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationmale@dj',
                        name: 'dj',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Guitare',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationmale@air_guitar',
                        name: 'air_guitar',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse HipHop',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'missfbi3_sniping',
                        name: 'dance_m_default',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Hippie',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'misschinese2_crystalmazemcs1_ig',
                        name: 'dance_loop_tao',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Hula Hoop',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@lazlow@hi_podium@',
                        name: 'danceidle_mi_15_shimmy_laz',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Jazz',
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
                name: 'Danse Joie exagéré',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@lazlow@hi_podium@',
                        name: 'danceidle_hi_11_turnaround_laz',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Mouchoir',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_15_v2_male^6',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse NON NON NON',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_13_v2_female^5',
                        options: { repeat: true },
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Robot',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@lazlow@hi_podium@',
                        name: 'danceidle_mi_15_robot_laz',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Robot Fou',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@lazlow@hi_podium@',
                        name: 'danceidle_hi_15_crazyrobot_laz',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Rock',
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
                type: 'animation',
                name: 'Danse Réservé',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_a@',
                        name: 'low_center_up',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Shagging',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationmale@air_shagging',
                        name: 'air_shagging',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse StreetDance',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_b@',
                        name: 'high_center_down',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Sur place',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@lazlow@hi_podium@',
                        name: 'danceidle_li_06_base_v2_laz',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Synth',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationmale@air_synth',
                        name: 'air_synth',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Tektonik',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_09_v1_female^1',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Tempo',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intincardancestd@rps@',
                        name: 'idle_a',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse Twerk nul',
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
                type: 'animation',
                name: 'Danse Vieux',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'amb@world_human_partying@female@partying_beer@base',
                        name: 'base',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse coucou',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_17_v2_female^4',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse de la fleur',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_17_v2_female^5',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse de la spirale',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_15_v1_female^1',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse du mime',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_17_v1_female^1',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse déprime',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_09_v1_male^2',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse détente',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@club@',
                        name: 'hi_idle_c_m03',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse en douceur',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupe@',
                        name: 'hi_dance_crowd_13_v2_female^1',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: "Danse on s'emmerde",
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@beachdance@',
                        name: 'hi_idle_a_m01',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse pointe des pieds',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@club@',
                        name: 'hi_loop_m03',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse silencieuse',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_09_v1_male^1',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse sur le téco',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_09_v2_male^5',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Danse étrange',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@club@',
                        name: 'hi_idle_b_m01',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Danses Aléatoire ?!',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse aléatoire ?!',
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
                    {
                        type: 'animation',
                        name: 'Danse aléatoire ?! (rapide)',
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
                ],
            },
            {
                type: 'category',
                name: 'Danses Calme',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse calme',
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
                        name: 'Danse calme (rapide)',
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
                        name: 'Danse calme 2',
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
                        name: 'Danse calme 2 (rapide)',
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
                        name: 'Danse calme 3',
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
                        name: 'Danse calme 3 (rapide)',
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
                name: 'Danses Coincé',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse Coincé',
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
                        name: 'Danse Timide',
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
                        name: 'Danse coincé 2',
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
                        name: 'Danse coincé 3',
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
                    {
                        type: 'animation',
                        name: 'Danse timide 2',
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
                type: 'category',
                name: 'Danses Constipé',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse Constipé',
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
                        name: 'Danse Constipé (rapide)',
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
                        name: 'Danse constipé 2',
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
                        name: 'Danse constipé 3',
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
                type: 'category',
                name: 'Danses Cow Boy',
                items: [
                    {
                        type: 'animation',
                        name: 'COOW BOOY',
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
                        name: 'COOW BOOY 2',
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
                        name: 'COOW BOOY 2 (rapide)',
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
                        name: 'COOW BOOY 3',
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
                        name: 'COOW BOOY 3 (rapide)',
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
                type: 'category',
                name: 'Danses DJ perdu',
                items: [
                    {
                        type: 'animation',
                        name: 'Dance DJ perdu 3 (rapide)',
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
                    {
                        type: 'animation',
                        name: 'Danse DJ perdu',
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
                        name: 'Danse DJ perdu 2',
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
                        name: 'Danse DJ perdu 3',
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
                ],
            },
            {
                type: 'category',
                name: 'Danses Drogué',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse drogué',
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
                        name: 'Danse drogué 2',
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
                        name: 'Danse drogué 3',
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
                name: 'Danses Drum',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse Drum',
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
                        name: 'Danse Drum 2',
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
                        name: 'Danse Drum 3',
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
                        name: 'Danse Drum 4',
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
                        name: 'Danse Drum 5',
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
                        name: 'Danse Drum 6',
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
                        name: 'Danse Drum 7',
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
                        name: 'Danse Drum 8',
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
                type: 'category',
                name: 'Danses Fatigué',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse Fatigué',
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
                        name: 'Danse Fatigué 2',
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
                        name: 'Danse Fatigué 3',
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
                        name: 'Danse Fatigué 4',
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
                        name: 'Danse Fatigué 5',
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
                        name: 'Danse Fatigué 6',
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
                name: 'Danses Fumette',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse fumette',
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
                        name: 'Danse fumette 10',
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
                        name: 'Danse fumette 11',
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
                        name: 'Danse fumette 12',
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
                        name: 'Danse fumette 2',
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
                        name: 'Danse fumette 3',
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
                        name: 'Danse fumette 4',
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
                        name: 'Danse fumette 5',
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
                        name: 'Danse fumette 6',
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
                        name: 'Danse fumette 7',
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
                        name: 'Danse fumette 8',
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
                        name: 'Danse fumette 9',
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
                name: 'Danses Mamy',
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
                        name: 'Danse mamy',
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
                        name: 'Danse mamy 2',
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
                        name: 'Danse mamy 3',
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
                name: 'Danses Maracasses',
                items: [
                    {
                        type: 'animation',
                        name: 'Dance Maracasses 4 (rapide)',
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
                        name: 'Danse Maracasses',
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
                        name: 'Danse Maracasses 2',
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
                        name: 'Danse Maracasses 3',
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
                        name: 'Danse Maracasses 4',
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
                        name: 'Danse Maracasses 5',
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
                        name: 'Danse Maracasses 5 (rapide)',
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
                        name: 'Danse Maracasses 6',
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
                        name: 'Danse Maracasses 6 (rapide)',
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
                name: 'Danses Motivé',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse motivé',
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
                        name: 'Danse motivé 2',
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
                        name: 'Danse motivé 3',
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
                type: 'category',
                name: 'Danses OulalAAAAA',
                items: [
                    {
                        type: 'animation',
                        name: 'Dance OULALAAAAA 12 (rapide)',
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
                        name: 'Danse OULALAAAAA',
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
                        name: 'Danse OULALAAAAA 10',
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
                        name: 'Danse OULALAAAAA 11',
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
                        name: 'Danse OULALAAAAA 12',
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
                        name: 'Danse OULALAAAAA 2',
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
                        name: 'Danse OULALAAAAA 3',
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
                        name: 'Danse OULALAAAAA 4',
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
                        name: 'Danse OULALAAAAA 5',
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
                        name: 'Danse OULALAAAAA 6',
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
                        name: 'Danse OULALAAAAA 7',
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
                        name: 'Danse OULALAAAAA 8',
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
                        name: 'Danse OULALAAAAA 9',
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
                type: 'category',
                name: 'Danses Rock’n Roll',
                items: [
                    {
                        type: 'animation',
                        name: "Danse Rock'n Roll",
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
                        name: "Danse Rock'n Roll 2",
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
                        name: "Danse Rock'n Roll 3",
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
                name: 'Danses Shoulders',
                items: [
                    {
                        type: 'animation',
                        name: 'Bouncing Shoulders',
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
                        name: 'Dancing Shoulders',
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
                        name: 'Gesticulating Shoulders',
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
                        name: 'Jazzy Shoulders',
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
                        name: 'Jazzy Shoulders (rapide)',
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
                        name: 'Laughing Shoulders 2',
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
                        name: 'Laughing Shoulders 2 (rapide)',
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
                        name: 'Rotating Shoulders',
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
                        name: 'Shaking Shoulders',
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
                        name: 'Sky Shoulders',
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
                        name: 'Swinging Shoulders',
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
                        name: 'Swinging shoulders (rapide)',
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
                name: 'Danses Survoltée',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse survoltée',
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
                        name: 'Danse survoltée 2',
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
                type: 'category',
                name: 'Danses de la joie',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse de la joie 1',
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
                        name: 'Danse de la joie 2',
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
                        name: 'Danse de la joie 3',
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
                        name: 'Danse de la joie 4',
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
                        name: 'Danse de la joie 5',
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
                        name: 'Danse de la joie 6',
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
                        name: 'Danse de la joie 7',
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
                type: 'category',
                name: 'Danses de la natation',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse de la natation',
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
                        name: 'Danse de la natation (rapide)',
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
                type: 'category',
                name: 'Danses de la peur',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse de la peur',
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
                        name: 'Danse de la peur 2',
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
                        name: 'Danse de la peur 2 (rapide)',
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
                name: 'Danses de l’envie pressante',
                items: [
                    {
                        type: 'animation',
                        name: "Danse de l'envie pressante",
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
                        name: "Danse de l'envie pressante 2",
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
                type: 'category',
                name: 'Danses des animaux',
                items: [
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
                        name: 'Dancing Cats',
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
                        name: 'Dancing Cats (rapide)',
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
                        name: 'Dancing Cats 2',
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
                        name: 'Dancing Cats 2 (rapide)',
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
                        name: 'Danse Poulet',
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
                        name: 'Danse Spiderman',
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
                        name: "Danse de l'anguille",
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
                        name: "Danse de l'anguille 2",
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
                        name: "Danse de l'esturgeon",
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
                        name: "Danse de l'esturgeon (rapide)",
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
                        name: 'Danse de la crevette',
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
                        name: 'Danse de la crevette (rapide)',
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
                        name: 'Danse de la truite',
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
                        name: 'Danse des sardines',
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
                        name: 'Danse du Crabe',
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
                        name: 'Danse du Saumon',
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
                        name: 'Danse du dyno',
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
                        name: 'Danse du pigeon',
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
                        name: 'Frogy Danse',
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
                        name: 'Frogy Danse (rapide)',
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
                        name: 'Milky dance',
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
                    {
                        type: 'animation',
                        name: 'Monkey C',
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
                        name: 'Monkey L',
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
                        name: 'Monkey R',
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
                        name: 'Seahorse',
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
                        name: 'Squeleton Dance',
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
                        name: 'Squeleton Dance (rapide)',
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
                        name: 'The Rabbit Move',
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
                        name: 'The Rabbit Move (rapide)',
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
                ],
            },
            {
                type: 'category',
                name: 'Danses des coudes',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse des coudes',
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
                    {
                        type: 'animation',
                        name: 'Danse des coudes (rapide)',
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
                ],
            },
            {
                type: 'category',
                name: 'Danses du baton',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse du Baton',
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
                    {
                        type: 'animation',
                        name: 'Danse du Baton (rapide)',
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
                ],
            },
            {
                type: 'category',
                name: 'Danses du ressort',
                items: [
                    {
                        type: 'animation',
                        name: 'Dance du ressort rouillé (rapide)',
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
                        name: 'Danse du ressort',
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
                    {
                        type: 'animation',
                        name: 'Danse du ressort (rapide)',
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
                        name: 'Danse du ressort rouillé',
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
                ],
            },
            {
                type: 'category',
                name: 'Danses déchaîné',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse Déchainé',
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
                        name: 'Danse Déchainé#2',
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
                name: 'Danses perché',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse Perché',
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
                        name: 'Danse Perché #2',
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
                        name: 'Danse Perché #3',
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
                type: 'category',
                name: 'Danses rythmé',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse rythmée',
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
                        name: 'Danse rythmée 2',
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
                type: 'category',
                name: 'Danses sexy',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse Sexy',
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
                        name: 'Danse Sexy #2',
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
                        name: 'Danse Sexy #3',
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
                        name: 'Danse Sexy #4',
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
                        name: 'LapDance',
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
                type: 'category',
                name: 'Danses tranquille',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse tranquille',
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
                        name: 'Danse tranquille 2',
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
                type: 'category',
                name: 'Danses échauffement',
                items: [
                    {
                        type: 'animation',
                        name: 'Danse échauffement',
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
                        name: 'Danse échauffement 2',
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
                        name: 'Danse échauffement 3',
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
                        name: 'Danse échauffement 4',
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
                        name: 'Danse échauffement 5',
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
                        name: 'Danse échauffement 6',
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
                        name: 'Danse échauffement 7',
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
                        name: 'Danse échauffement 7 (rapide)',
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
                type: 'category',
                name: 'Didn’t find it',
                items: [
                    {
                        type: 'animation',
                        name: "Didn't find it",
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
                        name: "Didn't find it 2",
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
                        name: "Didn't find it 2 (rapide)",
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
                        name: "Didn't find it 3",
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
                name: 'Démenbré',
                items: [
                    {
                        type: 'animation',
                        name: 'Démembré',
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
                        name: 'Démembré (rapide)',
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
                        name: 'Démembré 2',
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
                name: 'Earth Shake',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_09_v1_male^4',
                        options: { repeat: true },
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
                        options: { repeat: true },
                    },
                },
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
                        options: { repeat: true },
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Fingers',
                items: [
                    {
                        type: 'animation',
                        name: 'Fingers',
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
                    {
                        type: 'animation',
                        name: 'Fingers (rapide)',
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
                ],
            },
            {
                type: 'category',
                name: 'Groovy',
                items: [
                    {
                        type: 'animation',
                        name: 'Air Groovy',
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
                        name: 'Air Groovy',
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
                        name: 'Air Groovy (rapide)',
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
                        name: 'Bluesy Groovy',
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
                        name: 'Bluesy Groovy (rapide)',
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
                        name: 'Calmly Grovvy',
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
                        name: 'Dancing Groovy',
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
                        name: 'Dancing Groovy (rapide)',
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
                        name: 'Flirting Groovy',
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
                        name: 'Funky Groovy',
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
                        name: 'Funky Groovy (rapide)',
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
                        name: 'Groovy',
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
                        name: 'Groovy 2',
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
                        name: 'Inspired Groovy',
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
                        name: 'Jazzy Groovy',
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
                        name: 'Jazzy Groovy (rapide)',
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
                        name: 'Miming Groovy',
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
                        name: 'Miming Groovy (rapide)',
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
                        name: 'Resting Groovy',
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
                        name: 'Resting Groovy (rapide)',
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
                        name: 'Rhythmic Groovy',
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
                        name: 'Rhythmic Groovy (rapide)',
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
                        name: 'Shaking Groovy',
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
                        name: 'Shaking Groovy (rapide)',
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
                        name: 'Shining Groovy',
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
                        name: 'Shining Groovy (rapide)',
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
                        name: 'Swingy Groovy',
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
                        name: 'Swingy Groovy (rapide)',
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
                        name: 'Tapping Groovy',
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
                        name: 'Groupie',
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
                    {
                        type: 'animation',
                        name: 'Groupie (rapide)',
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Hands',
                items: [
                    {
                        type: 'animation',
                        name: 'Aiming Hands',
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
                        name: 'Alternating Hands',
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
                        name: 'Bouncing Hands',
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
                        name: 'Cutting Hands',
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
                        name: 'DJ Hands',
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
                        name: 'DJ Hands 2',
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
                        name: 'DJ Hands 3',
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
                        name: 'Degenerating Hands',
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
                        name: 'Degenerating Hands 2',
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
                        name: 'Degenerating Hands 2 (rapide)',
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
                        name: 'Fishing Hands',
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
                        name: 'Flying Hands',
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
                        name: 'Flying Hands (rapide)',
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
                        name: 'Going Hands',
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
                        name: 'Going Hands (rapide)',
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
                        name: 'Groovy Hands',
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
                        name: 'Groovy Hands (rapide)',
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
                        name: 'Hands Up OULALAAAAA',
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
                    {
                        type: 'animation',
                        name: 'Motivating Hands',
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
                        name: 'Raising Hands',
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
                        name: 'Raising Hands',
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
                        name: 'Rasta Hands',
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
                        name: 'Rotating Hands',
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
                        name: 'Scattering Hands',
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
                        name: 'Showing Hands',
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
                        name: 'Slow Hands',
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
                        name: 'Spiraling Hands',
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
                        name: 'Sunny Hands',
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
                        name: 'Swimming Hands',
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
                        name: 'Swimming Hands (rapide)',
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
                        name: 'Talking Hands',
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
                        name: 'Talking Hands (rapide)',
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
                        name: 'Vibing Hands',
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
                        name: 'Vibing Hands (rapide)',
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
                        name: 'Hands Up',
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
                        name: 'Hands Up 2',
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
                        name: 'Hands Up 3',
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
                        name: 'Hands Up 4',
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
                        name: 'Hands Up 5',
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
                        name: 'Hands Up 6',
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
                        name: 'Hands Up 6 (rapide)',
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
                        options: { repeat: true },
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: "Hey, j'suis la !",
                items: [
                    {
                        type: 'animation',
                        name: "Hey, j'suis là !",
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
                        name: "Hey, j'suis là ! 2",
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
                        name: "Hey, j'suis là ! 3",
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
                        name: "Hey, j'suis là ! 4",
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
                name: 'Hiding dance',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_groups@groupd@',
                        name: 'hi_dance_crowd_13_v1_male^1',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'In the Airrr',
                items: [
                    {
                        type: 'animation',
                        name: "Danse bras en l'air",
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
                        name: 'Finger in the air',
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
                        name: 'Hands in the air',
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
                        name: 'IN THE AIRRR',
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
                        name: 'IN THE AIRRR (rapide)',
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
                        options: { repeat: true },
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
                        options: { repeat: true },
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
                        options: { repeat: true },
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Je suis rassuré !',
                items: [
                    {
                        type: 'animation',
                        name: 'Je suis rassuré !',
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
                    {
                        type: 'animation',
                        name: 'Je suis rassuré ! (rapide)',
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
                ],
            },
            {
                type: 'category',
                name: 'Je suis un BG',
                items: [
                    {
                        type: 'animation',
                        name: 'Je suis un BG',
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
                    {
                        type: 'animation',
                        name: 'Je suis un BG (rapide)',
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
                ],
            },
            {
                type: 'category',
                name: 'Jumper',
                items: [
                    {
                        type: 'animation',
                        name: 'Jumper C',
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
                        name: 'Jumper L',
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
                        name: 'Jumper R',
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
                name: 'J’met l’ambiance !',
                items: [
                    {
                        type: 'animation',
                        name: "J'met l'ambiance !",
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
                    {
                        type: 'animation',
                        name: "J'met l'ambiance ! (rapide)",
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
                ],
            },
            {
                type: 'category',
                name: 'Karaté',
                items: [
                    {
                        type: 'animation',
                        name: 'Karate C',
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
                        name: 'Karate L',
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
                        name: 'Karate R',
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
                        name: 'Keskia',
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
                    {
                        type: 'animation',
                        name: 'Keskia (rapide)',
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
                ],
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
                        options: { repeat: true },
                    },
                },
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
                        options: { repeat: true },
                    },
                },
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
                        options: { repeat: true },
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
                        options: { repeat: true },
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
                        options: { repeat: true },
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Lost In my mind',
                items: [
                    {
                        type: 'animation',
                        name: 'Lost in my mind',
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
                    {
                        type: 'animation',
                        name: 'Lost in my mind (rapide)',
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
                ],
            },
            {
                type: 'animation',
                name: 'Lost with my feets',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                        name: 'hi_dance_facedj_13_v2_male^5',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Lost with my feets (rapide)',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity',
                        name: 'hi_dance_facedj_13_v2_male^5',
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Léger déhanché',
                items: [
                    {
                        type: 'animation',
                        name: 'Léger déhanché',
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
                        name: 'Léger déhanché 2',
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
                type: 'category',
                name: 'Marionnette',
                items: [
                    {
                        type: 'animation',
                        name: 'Marionette',
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
                        name: 'Marionette 2',
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
                        name: 'Marionette 3',
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Mini Danses',
                items: [
                    {
                        type: 'animation',
                        name: 'Mini danse 1',
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
                        name: 'Mini danse 2',
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
                        name: 'Mini danse 3',
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
                        name: 'Mini danse 4',
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
                        name: 'Mini danse 5',
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
                name: 'Moving animatronic',
                items: [
                    {
                        type: 'animation',
                        name: 'Bugged Animatronic',
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
                        name: 'Clapping Animatronic',
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
                        name: 'Clapping Animatronic (rapide)',
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
                        name: 'Gesticulating Animatronic',
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
                        name: 'Looping Animatronic',
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
                        name: 'Looping Animatronic (rapide)',
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
                        name: 'Miming Animatronic',
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
                        name: 'Moving Animatronic',
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
                        name: 'Static Animatronic',
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
                        name: 'Static Animatronic',
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
                        name: 'Swinging Animatronic',
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
                        name: 'Wiggling Animatronic',
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
                        name: 'Air Drums',
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
                        name: 'Air Drums 2',
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
                type: 'animation',
                name: 'OH YEAAH',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_a@',
                        name: 'high_center',
                        options: { repeat: true },
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
                        options: { repeat: true },
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'On est où ?',
                items: [
                    {
                        type: 'animation',
                        name: 'On est où ?',
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
                        name: 'On est où ? 2',
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
                type: 'category',
                name: 'On tourne',
                items: [
                    {
                        type: 'animation',
                        name: 'On tourne',
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
                        name: 'On tourne 2',
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
                type: 'animation',
                name: 'Out of control',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
                        name: 'hi_dance_crowd_09_v2_male^4',
                        options: { repeat: true },
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Pas trop Vite',
                items: [
                    {
                        type: 'animation',
                        name: 'Pas trop vite...',
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
                    {
                        type: 'animation',
                        name: 'Pas trop vite... (rapide)',
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Photography',
                items: [
                    {
                        type: 'animation',
                        name: 'Photography',
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
                        name: 'Photography 2',
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
                        name: 'Playa',
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
                        name: 'Playa 2',
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
                        name: 'Playa 3',
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
                        name: 'Playa 4',
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
                        name: 'Playa 5',
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
                name: 'Raise the Roof',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@mp_player_intcelebrationfemale@raise_the_roof',
                        name: 'raise_the_roof',
                        options: { repeat: true },
                    },
                },
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
                        options: { repeat: true },
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Sand Trip',
                items: [
                    {
                        type: 'animation',
                        name: 'Sand Trip C',
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
                        name: 'Sand Trip L',
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
                        name: 'Sand Trip R',
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
                name: 'Shake It',
                items: [
                    {
                        type: 'animation',
                        name: 'Shake It',
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
                    {
                        type: 'animation',
                        name: 'Shake It (rapide)',
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
                ],
            },
            {
                type: 'category',
                name: 'Shaking Body',
                items: [
                    {
                        type: 'animation',
                        name: 'Shaking Body',
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
                        name: 'Shaking Body 2',
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
                        name: 'Shaking Body 3',
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
                        name: 'Shaking Body 4',
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
                        name: 'Shaking Body 5',
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
                        name: 'Shaking Body 6',
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
                        name: 'Shaking Body 7',
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
                        name: 'Shaking Body 8',
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
                        name: 'Shaking Body 9',
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
                name: 'Show Your Knees',
                items: [
                    {
                        type: 'animation',
                        name: 'Show your knees',
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
                        name: 'Show your knees 2',
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
                        name: 'Show your knees 2 (rapide)',
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
                        name: 'Show your knees 3',
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
                        name: 'Shuffle C',
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
                        name: 'Shuffle L',
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
                        name: 'Shuffle R',
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
                type: 'category',
                name: 'Skiing',
                items: [
                    {
                        type: 'animation',
                        name: 'Skiing',
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
                        name: 'Skiing 2',
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
                        name: 'Skiing 2 (rapide)',
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
                        name: 'Skiing 3',
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
                        name: 'Skiing 3 (rapide)',
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Slap',
                items: [
                    {
                        type: 'animation',
                        name: 'Slap Left',
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
                        name: 'Slap Right',
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Snapping',
                items: [
                    {
                        type: 'animation',
                        name: 'Snapping',
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
                        name: 'Snapping 2',
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
                        name: 'Snapping 3',
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
                        name: 'Snapping 3 (rapide)',
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
                        options: { repeat: true },
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Summer',
                items: [
                    {
                        type: 'animation',
                        name: 'SUMMER',
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
                        name: 'SUMMER 2',
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
                        name: 'SUMMER 3',
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
                name: 'TOC TOC TOC',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'anim@amb@nightclub_island@dancers@crowddance_facedj@',
                        name: 'hi_dance_facedj_hu_15_v2_female^4',
                        options: { repeat: true },
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Together',
                items: [
                    {
                        type: 'animation',
                        name: 'Together',
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
                    {
                        type: 'animation',
                        name: 'Together (rapide)',
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
                ],
            },
            {
                type: 'category',
                name: 'Twerking Shoulders',
                items: [
                    {
                        type: 'animation',
                        name: 'Twerking shoulders',
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
                    {
                        type: 'animation',
                        name: 'Twerking shoulders (rapide)',
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
                        options: { repeat: true },
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Wesh Wesh',
                items: [
                    {
                        type: 'animation',
                        name: 'Wesh Wesh',
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
                        name: 'Wesh Wesh 2',
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
                        name: 'Wesh Wesh 2 (rapide)',
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
                        name: 'Wesh Wesh 3',
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
                        name: 'Wesh Wesh 4',
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
                        name: 'Wesh Wesh 4 (rapide)',
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
                        name: 'Wohooooo',
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
                        name: 'Wohooooo 2',
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
                        name: 'Wohooooo 3',
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
                        name: 'Wohooooo 4',
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
                        options: { repeat: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Yo Yo',
                items: [
                    {
                        type: 'animation',
                        name: 'YO YO',
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
                    {
                        type: 'animation',
                        name: 'Yo Yo (rapide)',
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
                        options: { repeat: true },
                    },
                },
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
                        name: 'High Five',
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
                        name: 'Insultant ',
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
                        name: 'Tchek',
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
        name: 'Event',
        items: [
            {
                type: 'category',
                name: 'DJ',
                items: [
                    {
                        type: 'animation',
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                    {
                        type: 'animation',
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                        name: 'DJ',
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
                name: 'Aucune idée',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'gestures@m@sitting@generic@casual',
                        name: 'gesture_shrug_hard',
                        options: { onlyUpperBody: true },
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
                        options: { onlyUpperBody: true },
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
                        options: { onlyUpperBody: true },
                    },
                },
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
                        options: { repeat: true },
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
                        options: { repeat: true, onlyUpperBody: true, enablePlayerControl: true },
                    },
                },
            },
            {
                type: 'category',
                name: 'Célébrations',
                items: [
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
                name: 'Damn',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'gestures@m@standing@casual',
                        name: 'gesture_damn',
                        options: { onlyUpperBody: true },
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
                        options: { repeat: true, onlyUpperBody: true, enablePlayerControl: true },
                    },
                },
            },
            {
                type: 'animation',
                name: 'Est-ce que vous êtes là !?',
                rightLabel: null,
                icon: null,
                animation: {
                    base: {
                        dictionary: 'mp_player_int_uppergang_sign_a',
                        name: 'mp_player_int_gang_sign_a_enter',
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
                        options: { repeat: true, onlyUpperBody: true, enablePlayerControl: true },
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
                scenario: { name: 'WORLD_HUMAN_MOBILE_FILM_SHOCKING' },
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
                        options: { repeat: true, onlyUpperBody: true, enablePlayerControl: true },
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
                        options: { onlyUpperBody: true },
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
                        options: { onlyUpperBody: true },
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
                        options: { onlyUpperBody: true },
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
                        options: { onlyUpperBody: true },
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
                        type: 'scenario',
                        name: 'Regarder sa carte',
                        rightLabel: null,
                        icon: null,
                        scenario: { name: 'WORLD_HUMAN_TOURIST_MAP' },
                    },
                    {
                        type: 'animation',
                        name: 'je vais être en retard',
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
                        options: { repeat: true, onlyUpperBody: true, enablePlayerControl: true },
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
                        options: { repeat: true },
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
                        options: { onlyUpperBody: true },
                    },
                },
            },
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
                        options: { repeat: true, onlyUpperBody: true, enablePlayerControl: true },
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
                        scenario: { name: 'world_human_janitor' },
                    },
                    {
                        type: 'scenario',
                        name: 'Laver le sol',
                        rightLabel: null,
                        icon: null,
                        scenario: { name: 'world_human_bum_wash' },
                    },
                    {
                        type: 'scenario',
                        name: 'Laver vitres',
                        rightLabel: null,
                        icon: null,
                        scenario: { name: 'world_human_maid_clean' },
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
                        scenario: { name: 'world_human_gardener_plant' },
                    },
                    {
                        type: 'scenario',
                        name: 'Souffler',
                        rightLabel: null,
                        icon: null,
                        scenario: { name: 'world_human_gardener_leaf_blower' },
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
                        options: { repeat: true },
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
                        scenario: { name: 'world_human_vehicle_mechanic' },
                    },
                    {
                        type: 'scenario',
                        name: 'Souder',
                        rightLabel: null,
                        icon: null,
                        scenario: { name: 'world_human_welding' },
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
                        options: { repeat: true },
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
                type: 'scenario',
                name: 'SDF',
                rightLabel: null,
                icon: null,
                scenario: { name: 'world_human_bum_freeway' },
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
                        scenario: { name: 'world_human_const_drill' },
                    },
                    {
                        type: 'scenario',
                        name: 'Marteau',
                        rightLabel: null,
                        icon: null,
                        scenario: { name: 'world_human_hammering' },
                    },
                ],
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
                        options: { repeat: true, onlyUpperBody: true, enablePlayerControl: true },
                    },
                },
            },
            {
                type: 'scenario',
                name: 'Circulation',
                rightLabel: null,
                icon: null,
                scenario: { name: 'world_human_car_park_attendant' },
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
                        options: { repeat: true, onlyUpperBody: true, enablePlayerControl: true },
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
                        options: { repeat: true, onlyUpperBody: true, enablePlayerControl: true },
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
                        options: { repeat: true, onlyUpperBody: true, enablePlayerControl: true },
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
                        options: { repeat: true, onlyUpperBody: true, enablePlayerControl: true },
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
                event: 'soz-core:client:player:animation:takedown',
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
                        name: 'Attentif',
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
                        name: 'Attentif',
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
                        name: 'Bras croisé',
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
                        name: 'Impatient',
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
                        name: 'Mains dans le dos',
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
                        name: 'Mouvement de bras',
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
                        options: { repeat: true },
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
                        options: { repeat: true, onlyUpperBody: true, enablePlayerControl: true },
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
                        options: { repeat: true },
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
                        options: { repeat: true },
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
                        scenario: { name: 'WORLD_HUMAN_SUNBATHE_BACK' },
                    },
                    {
                        type: 'scenario',
                        name: 'Allongé (Ventre)',
                        rightLabel: null,
                        icon: null,
                        scenario: { name: 'WORLD_HUMAN_SUNBATHE' },
                    },
                    {
                        type: 'scenario',
                        name: 'Dormir',
                        rightLabel: null,
                        icon: null,
                        scenario: { name: 'WORLD_HUMAN_BUM_SLUMPED' },
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
                        type: 'scenario',
                        name: 'Contre le mur',
                        rightLabel: null,
                        icon: null,
                        scenario: { name: 'WORLD_HUMAN_LEANING' },
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
                        name: "S'appuyer contre un mur",
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
                        name: "S'appuyer sur la table",
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
                        scenario: { name: 'PROP_HUMAN_SEAT_ARMCHAIR', fixPositionDelta: [-0.48, -0.5] },
                    },
                    {
                        type: 'scenario',
                        name: "S'asseoir (Bench)",
                        rightLabel: null,
                        icon: null,
                        scenario: { name: 'PROP_HUMAN_SEAT_BENCH', fixPositionDelta: [-0.48, -0.5] },
                    },
                    {
                        type: 'scenario',
                        name: "S'asseoir (Bus Stop Wait)",
                        rightLabel: null,
                        icon: null,
                        scenario: { name: 'PROP_HUMAN_SEAT_BUS_STOP_WAIT', fixPositionDelta: [-0.48, -0.5] },
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
                        type: 'animation',
                        name: "S'asseoir (Capot)",
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
                        type: 'scenario',
                        name: "S'asseoir (Chair Upright)",
                        rightLabel: null,
                        icon: null,
                        scenario: { name: 'PROP_HUMAN_SEAT_CHAIR_UPRIGHT', fixPositionDelta: [-0.48, -0.5] },
                    },
                    {
                        type: 'scenario',
                        name: "S'asseoir (Chair)",
                        rightLabel: null,
                        icon: null,
                        scenario: { name: 'PROP_HUMAN_SEAT_CHAIR', fixPositionDelta: [-0.48, -0.5] },
                    },
                    {
                        type: 'scenario',
                        name: "S'asseoir (Deckchair)",
                        rightLabel: null,
                        icon: null,
                        scenario: { name: 'PROP_HUMAN_SEAT_DECKCHAIR', fixPositionDelta: [-0.48, -0.6] },
                    },
                    {
                        type: 'scenario',
                        name: "S'asseoir (MP)",
                        rightLabel: null,
                        icon: null,
                        scenario: { name: 'PROP_HUMAN_SEAT_CHAIR_MP_PLAYER', fixPositionDelta: [-0.48, -0.5] },
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
                        scenario: { name: 'WORLD_HUMAN_PICNIC' },
                    },
                    {
                        type: 'scenario',
                        name: "S'asseoir (Stripclub)",
                        rightLabel: null,
                        icon: null,
                        scenario: { name: 'PROP_HUMAN_SEAT_STRIP_WATCH', fixPositionDelta: [-0.48, -0.5] },
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
                    {
                        type: 'animation',
                        name: "S'asseoir (Sol mixte)",
                        rightLabel: null,
                        icon: null,
                        animation: {
                            base: {
                                dictionary: 'amb@world_human_picnic@male@idle_a',
                                name: 'idle_a',
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
                        name: 'Eh oh, je suis là !',
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
                        name: 'Eh oh, je suis là ! #2',
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
                        options: { repeat: true, onlyUpperBody: true, enablePlayerControl: true },
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
                        name: 'Révérence',
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
                        name: 'Révérence #2',
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
                        name: 'Saluer',
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
                        name: 'Saluer #2',
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
                        name: 'Saluer #3',
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
                        options: { repeat: true },
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
                        name: 'Boxe',
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
                        name: 'Boxe #2',
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
                        name: 'Célébration Football',
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
                        name: 'Saut 1',
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
                type: 'event',
                name: 'Faire des abdos',
                rightLabel: null,
                icon: '💪',
                event: 'soz-core:client:player:health:sit-up',
            },
            {
                type: 'event',
                name: 'Faire des haltères',
                rightLabel: null,
                icon: '💪',
                event: 'soz-core:client:player:health:free-weight',
            },
            {
                type: 'event',
                name: 'Faire des pompes',
                rightLabel: null,
                icon: '💪',
                event: 'soz-core:client:player:health:push-up',
            },
            {
                type: 'event',
                name: 'Faire du yoga',
                rightLabel: null,
                icon: '🧘',
                event: 'soz-core:client:player:health:yoga',
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
                scenario: { name: 'WORLD_HUMAN_MUSCLE_FLEX' },
            },
            {
                type: 'category',
                name: 'Préparations',
                items: [
                    {
                        type: 'animation',
                        name: 'Préparation Fight',
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
                        name: 'Préparation Fight #2',
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
                        name: 'Préparation Fight #2',
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
                        name: 'Préparation Fight #2',
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
                        name: 'Préparation Fight #2',
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
                type: 'category',
                name: 'Étirements',
                items: [
                    {
                        type: 'animation',
                        name: 'Etirement',
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
                        name: 'Etirement #2',
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
                        name: 'Etirement #3',
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
                        name: 'Etirement #4',
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
                        options: { repeat: true },
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
                        options: { repeat: true },
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
                        name: 'Peur à genou',
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
                        name: 'Peur à genou 2',
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
                        event: 'soz-core:client:animation:surrender',
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
                        name: 'Triste',
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
                        options: { repeat: true, onlyUpperBody: true, enablePlayerControl: true },
                    },
                },
            },
        ],
    },
];
