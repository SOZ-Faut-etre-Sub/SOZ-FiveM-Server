import { PropClientData, PropCollection, PropCollectionData, PropServerData } from '../object';

export type PropPlacementMenuData = {
    props: PlacementPropList;
    serverData: PropServerData;
    clientData: PropClientData;
    collections: PropCollectionData[];
};

export type NuiPlacementPropMethodMap = {
    SetCollectionList: PropCollectionData[];
    SetCollection: PropCollection;
    SetDatas: { serverData: PropServerData; clientData: PropClientData };
    EnterEditorMode: void;
    SetCurrentSearch: string;
};

export type PlacementProp = {
    model: string;
    label?: string;
    collision?: boolean;
};

export type PlacementPropList = Record<string, PlacementProp[]>;

export const PLACEMENT_PROP_LIST: PlacementPropList = {
    ['Distributeur & Arcade']: [
        {
            model: 'ch_prop_arcade_race_01a',
            label: 'Arcade de course (base) 1',
        },
        {
            model: 'ch_prop_arcade_race_01b',
            label: 'Arcade de course (base) 2',
        },
        {
            model: 'ch_prop_arcade_race_02a',
            label: 'Arcade de course (base) 3',
        },
        {
            model: 'ch_prop_arcade_race_bike_02a',
            label: 'Arcade de course (moto) 1',
        },
        {
            model: 'ch_prop_arcade_race_car_01a',
            label: 'Arcade de course (voiture) 1',
        },
        {
            model: 'ch_prop_arcade_race_car_01b',
            label: 'Arcade de course (voiture) 2',
        },
        {
            model: 'ch_prop_arcade_race_truck_01a',
            label: 'Arcade de course (camion) 1',
        },
        {
            model: 'ch_prop_arcade_race_truck_01b',
            label: 'Arcade de course (camion) 2',
        },
        {
            model: 'prop_50s_jukebox',
            label: 'Jukebox',
        },
        {
            model: 'prop_airhockey_01',
            label: 'Air Hockey',
        },
        {
            model: 'prop_arcade_01',
            label: 'Arcade 1',
        },
        {
            model: 'prop_arcade_02',
            label: 'Arcade 2',
        },
        {
            model: 'ch_prop_arcade_degenatron_01a',
            label: 'Arcade 3',
        },
        {
            model: 'ch_prop_arcade_monkey_01a',
            label: 'Arcade 4',
        },
        {
            model: 'ch_prop_arcade_penetrator_01a',
            label: 'Arcade 5',
        },
        {
            model: 'prop_gumball_03',
            label: 'Distributeur de bonbons',
        },
        {
            model: 'prop_jukebox_01',
            label: 'Jukebox 1',
        },
        {
            model: 'prop_jukebox_02',
            label: 'Jukebox 2',
        },
        {
            model: 'ch_prop_arcade_love_01a',
            label: 'Arcade 7',
        },
        {
            model: 'ch_prop_arcade_fortune_01a',
            label: 'Diseuse de bonne aventure',
        },
        {
            model: 'ch_prop_arcade_gun_01a',
            label: 'Arcade 6',
        },
        {
            model: 'ch_prop_arcade_jukebox_01a',
            label: 'Jukebox 3',
        },
        {
            model: 'prop_pooltable_02',
            label: 'Table de billard 1',
        },
        {
            model: 'prop_pooltable_3b',
            label: 'Table de billard 2',
        },
        {
            model: 'prop_train_ticket_02',
            label: 'Distributeur de tickets',
        },
        {
            model: 'prop_vend_coffe_01',
            label: 'Distributeur de café',
        },
        {
            model: 'prop_vend_fags_01',
            label: 'Distributeur de sodas 1',
        },
        {
            model: 'prop_vend_fridge01',
            label: 'Frigo de boissons 1',
        },
        {
            model: 'prop_vend_snak_01',
            label: 'Distributeur de snacks 1',
        },
        {
            model: 'prop_vend_soda_02',
            label: 'Distributeur de sodas 2',
        },
        {
            model: 'prop_vend_water_01',
            label: "Distributeur de bouteille d'eau",
        },
        {
            model: 'prop_bball_arcade_01',
            label: 'Basketball arcade',
        },
        {
            model: 'bkr_prop_clubhouse_jukebox_01a',
            label: 'Jukebox de club 1',
        },
        {
            model: 'ch_prop_arcade_claw_01a',
            label: 'Gatcha ! UwU',
        },
        {
            model: 'ch_prop_arcade_space_01a',
            label: 'Arcade 8',
        },
        {
            model: 'ch_prop_arcade_invade_01a',
            label: 'Arcade 9',
        },
        {
            model: 'ch_prop_arcade_street_01a',
            label: 'Arcade 10',
        },
        {
            model: 'ch_prop_arcade_street_01b',
            label: 'Arcade 11',
        },
        {
            model: 'ch_prop_arcade_street_01c',
            label: 'Arcade 12',
        },
        {
            model: 'ch_prop_arcade_street_01d',
            label: 'Arcade 13',
        },
        {
            model: 'ch_prop_arcade_wizard_01a',
            label: 'Arcade 14',
        },
        {
            model: 'ch_prop_casino_lucky_wheel_01a',
            label: 'Roue de la fortune',
        },
    ],
    ['Art']: [
        {
            model: 'apa_mp_h_acc_artwalll_01',
            label: 'Tableau 1',
            collision: false,
        },
        {
            model: 'apa_mp_h_acc_artwalll_02',
            label: 'Tableau 2',
            collision: false,
        },
        {
            model: 'apa_mp_h_acc_artwalll_03',
            label: 'Tableau 3',
            collision: false,
        },
        {
            model: 'apa_mp_h_acc_artwallm_02',
            label: 'Tableau 4',
            collision: false,
        },
        {
            model: 'apa_mp_h_acc_artwallm_03',
            label: 'Tableau 5',
            collision: false,
        },
        {
            model: 'apa_mp_h_acc_artwallm_04',
            label: 'Tableau 6',
            collision: false,
        },
        {
            model: 'apa_p_h_acc_artwalll_01',
            label: 'Tableau 7',
            collision: false,
        },
        {
            model: 'apa_p_h_acc_artwalll_02',
            label: 'Tableau 8',
            collision: false,
        },
        {
            model: 'apa_p_h_acc_artwalll_03',
            label: 'Tableau 9',
            collision: false,
        },
        {
            model: 'apa_p_h_acc_artwallm_01',
            label: 'Tableau 10',
            collision: false,
        },
        {
            model: 'apa_p_h_acc_artwallm_03',
            label: 'Tableau 12',
            collision: false,
        },
        {
            model: 'apa_p_h_acc_artwallm_04',
            label: 'Tableau 13',
            collision: false,
        },
        {
            model: 'apa_p_h_acc_artwalls_03',
            label: 'Maillot de sport 3',
            collision: false,
        },
        {
            model: 'apa_p_h_acc_artwalls_04',
            label: 'Maillot de sport 4',
            collision: false,
        },
        {
            model: 'ex_mp_h_acc_artwalll_02',
            label: 'Tableau 14',
            collision: false,
        },
        {
            model: 'ex_mp_h_acc_artwalll_03',
            label: 'Tableau 15',
            collision: false,
        },
        {
            model: 'ex_mp_h_acc_artwallm_02',
            label: 'Tableau 16',
            collision: false,
        },
        {
            model: 'ex_mp_h_acc_artwallm_03',
            label: 'Tableau 17',
            collision: false,
        },
        {
            model: 'ex_mp_h_acc_artwallm_04',
            label: 'Tableau 18',
            collision: false,
        },
        {
            model: 'ex_p_h_acc_artwalll_01',
            label: 'Tableau 19',
            collision: false,
        },
        {
            model: 'ex_p_h_acc_artwalll_03',
            label: 'Tableau 21',
            collision: false,
        },
        {
            model: 'ex_p_h_acc_artwallm_01',
            label: 'Tableau 22',
            collision: false,
        },
        {
            model: 'ex_p_h_acc_artwallm_03',
            label: 'Tableau 24',
            collision: false,
        },
        {
            model: 'ex_p_h_acc_artwallm_04',
            label: 'Tableau 25',
            collision: false,
        },
        {
            model: 'hei_prop_hei_pic_hl_gurkhas',
            label: 'Poster 1',
            collision: false,
        },
        {
            model: 'hei_prop_hei_pic_hl_keycodes',
            label: 'Poster 2',
            collision: false,
        },
        {
            model: 'hei_prop_hei_pic_hl_valkyrie',
            label: 'Poster 3',
            collision: false,
        },
        {
            model: 'hei_prop_hei_pic_pb_break',
            label: 'Poster 4',
            collision: false,
        },
        {
            model: 'hei_prop_hei_pic_pb_bus',
            label: 'Poster 5',
            collision: false,
        },
        {
            model: 'hei_prop_hei_pic_pb_plane',
            label: 'Poster 6',
            collision: false,
        },
        {
            model: 'hei_prop_hei_pic_pb_station',
            label: 'Poster 7',
            collision: false,
        },
        {
            model: 'hei_prop_hei_pic_ps_bike',
            label: 'Poster 8',
            collision: false,
        },
        {
            model: 'hei_prop_hei_pic_ps_convoy',
            label: 'Poster 9',
            collision: false,
        },
        {
            model: 'hei_prop_hei_pic_ps_job',
            label: 'Poster 10',
            collision: false,
        },
        {
            model: 'hei_prop_hei_pic_ps_trucks',
            label: 'Poster 11',
            collision: false,
        },
        {
            model: 'hei_prop_hei_pic_ps_witsec',
            label: 'Poster 12',
            collision: false,
        },
        {
            model: 'hei_prop_hei_pic_ub_prep',
            label: 'Poster 13',
            collision: false,
        },
        {
            model: 'hei_prop_hei_pic_ub_prep02',
            label: 'Poster 14',
            collision: false,
        },
        {
            model: 'hei_prop_heist_pic_01',
            label: 'Poster 15',
            collision: false,
        },
        {
            model: 'hei_prop_heist_pic_02',
            label: 'Poster 16',
            collision: false,
        },
        {
            model: 'hei_prop_heist_pic_04',
            label: 'Poster 17',
            collision: false,
        },
        {
            model: 'hei_prop_heist_pic_05',
            label: 'Poster 18',
            collision: false,
        },
        {
            model: 'hei_prop_heist_pic_06',
            label: 'Poster 19',
            collision: false,
        },
        {
            model: 'hei_prop_heist_pic_07',
            label: 'Poster 20',
            collision: false,
        },
        {
            model: 'hei_prop_heist_pic_08',
            label: 'Poster 21',
            collision: false,
        },
        {
            model: 'hei_prop_heist_pic_09',
            label: 'Poster 22',
            collision: false,
        },
        {
            model: 'hei_prop_heist_pic_10',
            label: 'Poster 23',
            collision: false,
        },
        {
            model: 'hei_prop_heist_pic_11',
            label: 'Poster 24',
            collision: false,
        },
        {
            model: 'hei_prop_heist_pic_12',
            label: 'Poster 25',
            collision: false,
        },
        {
            model: 'hei_prop_heist_pic_13',
            label: 'Poster 26',
            collision: false,
        },
        {
            model: 'hei_prop_heist_pic_14',
            label: 'Poster 27',
            collision: false,
        },
        {
            model: 'hei_heist_acc_artgolddisc_01',
            label: "Disque d'or 1",
            collision: false,
        },
        {
            model: 'vw_prop_casino_art_concrete_01a',
            label: 'Sculpture ballon',
        },
        {
            model: 'vw_prop_casino_art_concrete_02a',
            label: 'Sculpture volant',
        },
        {
            model: 'vw_prop_casino_art_console_02a',
            label: 'Présntoire console',
        },
        {
            model: 'vw_prop_casino_art_miniature_05a',
            label: 'Maquette 1',
        },
        {
            model: 'vw_prop_casino_art_miniature_05b',
            label: 'Maquette 2',
        },
        {
            model: 'vw_prop_casino_art_miniature_05c',
            label: 'Maquette 3',
        },
        {
            model: 'vw_prop_casino_art_skull_01a',
            label: 'Crâne 1',
        },
        {
            model: 'vw_prop_casino_art_skull_01b',
            label: 'Crâne 2',
        },
        {
            model: 'vw_prop_casino_art_skull_02a',
            label: 'Crâne 3',
        },
        {
            model: 'vw_prop_casino_art_skull_02b',
            label: 'Crâne 4',
        },
        {
            model: 'vw_prop_casino_art_skull_03a',
            label: 'Crâne 5',
        },
        {
            model: 'vw_prop_casino_art_skull_03b',
            label: 'Crâne 6',
        },
        {
            model: 'vw_prop_casino_art_statue_01a',
            label: 'Statue DAB',
        },
        {
            model: 'vw_prop_casino_art_statue_02a',
            label: 'Statue déhanché',
        },
        {
            model: 'vw_prop_casino_art_bird_01a',
            label: 'Oiseau 1',
        },
        {
            model: 'vw_prop_casino_art_car_01a',
            label: 'Voiture 1',
        },
        {
            model: 'vw_prop_casino_art_car_02a',
            label: 'Voiture 2',
        },
        {
            model: 'vw_prop_casino_art_car_03a',
            label: 'Voiture 3',
        },
        {
            model: 'vw_prop_casino_art_car_04a',
            label: 'Voiture 4',
        },
        {
            model: 'vw_prop_casino_art_car_05a',
            label: 'Voiture 5',
        },
        {
            model: 'vw_prop_casino_art_car_06a',
            label: 'Voiture 6',
        },
        {
            model: 'vw_prop_casino_art_car_07a',
            label: 'Voiture 7',
        },
        {
            model: 'vw_prop_casino_art_car_08a',
            label: 'Voiture 8',
        },
        {
            model: 'vw_prop_casino_art_car_09a',
            label: 'Voiture 9',
        },
        {
            model: 'vw_prop_casino_art_car_10a',
            label: 'Voiture 10',
        },
        {
            model: 'vw_prop_casino_art_car_11a',
            label: 'Voiture 11',
        },
        {
            model: 'vw_prop_casino_art_car_12a',
            label: 'Voiture 12',
        },
        {
            model: 'vw_prop_casino_art_cherries_01a',
            label: 'Cerises',
        },
        {
            model: 'vw_prop_casino_art_deer_01a',
            label: 'Sirène Kang',
        },
        {
            model: 'vw_prop_casino_art_head_01a',
            label: 'Tête 1',
        },
        {
            model: 'vw_prop_casino_art_head_01b',
            label: 'Tête 2',
        },
        {
            model: 'vw_prop_casino_art_head_01c',
            label: 'Tête 3',
        },
        {
            model: 'vw_prop_casino_art_head_01d',
            label: 'Tête 4',
        },
        {
            model: 'vw_prop_casino_art_mod_03b',
            label: 'Mannequin en cailloux 1',
        },
        {
            model: 'vw_prop_casino_art_mod_03b_a',
            label: 'Mannequin en cailloux 2',
        },
        {
            model: 'vw_prop_casino_art_mod_03b_b',
            label: 'Mannequin en cailloux 3',
        },
        {
            model: 'vw_prop_casino_art_mod_03b_c',
            label: 'Mannequin en cailloux 4',
        },
        {
            model: 'vw_prop_art_wall_segment_02a',
            label: 'Affiche artistique 1',
        },
        {
            model: 'vw_prop_art_wall_segment_02b',
            label: 'Affiche artistique 2',
        },
        {
            model: 'vw_prop_art_wall_segment_03a',
            label: 'Affiche artistique 3',
        },
        {
            model: 'vw_prop_art_wings_01a',
            label: "Ailes d'anges suspendues 1",
        },
        {
            model: 'vw_prop_casino_art_bowling_01a',
            label: 'Quille peinte 1',
        },
        {
            model: 'vw_prop_casino_art_bowling_01b',
            label: 'Quille peinte 2',
        },
        {
            model: 'vw_prop_casino_art_bowling_02a',
            label: 'Quille peinte 3',
        },
        {
            model: 'vw_prop_casino_art_horse_01a',
            label: 'Cheval 1',
        },
        {
            model: 'vw_prop_casino_art_horse_01b',
            label: 'Cheval 2',
        },
        {
            model: 'vw_prop_casino_art_horse_01c',
            label: 'Cheval 3',
        },
        {
            model: 'vw_prop_casino_art_panther_01a',
            label: 'Panthere 1',
        },
        {
            model: 'vw_prop_casino_art_panther_01b',
            label: 'Panthere 2',
        },
        {
            model: 'vw_prop_casino_art_panther_01c',
            label: 'Panthere 3',
        },
        {
            model: 'vw_prop_casino_art_rocket_01a',
            label: 'Fusée 1',
        },
        {
            model: 'apa_dining_art_new',
            label: 'Tableau pop art 2',
            collision: false,
        },
        {
            model: 'apa_mp_h_acc_artwalll_01_dressing',
            label: 'Tableau pop art 3',
            collision: false,
        },
        {
            model: 'apa_mp_h_acc_artwallm_bed_1',
            label: 'Tableau pop art 4',
            collision: false,
        },
        {
            model: 'apa_mp_h_acc_artwallm_bed_2',
            label: 'Tableau pop art 5',
            collision: false,
        },
        {
            model: 'apa_mpa3_dining_art',
            label: 'Tableau pop art 6',
            collision: false,
        },
        {
            model: 'sf_int1_art1_operations',
            label: 'Tableau pop art 7',
            collision: false,
        },
        {
            model: 'sf_int1_art1_stairs',
            label: 'Tableau pop art 8',
            collision: false,
        },
        {
            model: 'sf_int1_art2_operations',
            label: 'Tableau pop art 9',
            collision: false,
        },
        {
            model: 'sf_int1_art2_stairs',
            label: 'Tableau pop art 10',
            collision: false,
        },
        {
            model: 'sf_int1_art3_new1',
            label: 'Tableau pop art 11',
            collision: false,
        },
        {
            model: 'sf_int1_art3_stairs1',
            label: 'Tableau pop art 12',
            collision: false,
        },
        {
            model: 'sf_prop_sf_art_car_01a',
            label: 'Voiture 13',
        },
        {
            model: 'sf_prop_sf_art_car_02a',
            label: 'Voiture 14',
        },
        {
            model: 'sf_prop_sf_art_car_03a',
            label: 'Voiture 15',
        },
        {
            model: 'sf_prop_sf_art_trophy_co_01a',
            label: 'Trophée 1',
        },
        {
            model: 'sf_prop_sf_art_trophy_cp_01a',
            label: 'Trophée 2',
        },
        {
            model: 'sf_prop_sf_art_s_board_01a',
            label: 'Skateboard 1',
        },
        {
            model: 'sf_prop_sf_art_s_board_02a',
            label: 'Skateboard 2',
        },
        {
            model: 'sf_prop_sf_art_s_board_02b',
            label: 'Skateboard 3',
        },
        {
            model: 'sf_prop_sf_art_bobble_01a',
            label: 'Bobblehead 1',
        },
        {
            model: 'sf_prop_sf_art_bobble_bb_01a',
            label: 'Bobblehead 2',
        },
        {
            model: 'sf_prop_sf_art_bobble_bb_01b',
            label: 'Bobblehead 3',
        },
    ],
    ['Salle de bain']: [
        {
            model: 'prop_washer_01',
            label: 'Machine à laver (sale)',
        },
        {
            model: 'prop_washer_02',
            label: 'Machine à laver (propre)',
        },
        {
            model: 'prop_washer_03',
            label: 'Machine à laver (rouillée)',
        },
        {
            model: 'prop_washing_basket_01',
            label: 'Panier à linge',
        },
        {
            model: 'prop_sink_02',
            label: 'Évier 1',
        },
        {
            model: 'prop_sink_04',
            label: 'Évier 2',
        },
        {
            model: 'prop_sink_05',
            label: 'Évier 3',
        },
        {
            model: 'prop_sink_06',
            label: 'Évier 4',
        },
        {
            model: 'prop_toilet_01',
            label: 'Toilette 1',
        },
        {
            model: 'prop_toilet_02',
            label: 'Toilette 2',
        },
        {
            model: 'prop_toilet_brush_01',
            label: 'Brosse à toilette',
        },
        {
            model: 'prop_toilet_roll_01',
            label: 'Papier toilette 1',
        },
        {
            model: 'prop_toilet_roll_02',
            label: 'Papier toilette 2',
        },
        {
            model: 'prop_toilet_roll_05',
            label: 'Papier toilette 3',
        },
        {
            model: 'prop_toilet_shamp_01',
            label: 'Shampoing 1',
        },
        {
            model: 'prop_toilet_shamp_02',
            label: 'Shampoing 2',
        },
        {
            model: 'prop_toilet_soap_01',
            label: 'Savon 1',
        },
        {
            model: 'prop_toilet_soap_02',
            label: 'Savon 2',
        },
        {
            model: 'prop_toilet_soap_03',
            label: 'Savon 3',
        },
        {
            model: 'prop_toilet_soap_04',
            label: 'Savon 4',
        },
        {
            model: 'v_res_mbaccessory',
            label: 'Accessoires de salle de bain',
        },
        {
            model: 'v_res_mbath',
            label: 'Baignoire',
        },
        {
            model: 'v_res_mbathpot',
            label: 'Pot de rangement',
        },
        {
            model: 'apa_mp_h_bathtub_01',
            label: 'Baignoire 2',
        },
        {
            model: 'prop_makeup_brush',
            label: 'Pinceau de maquillage',
        },
        {
            model: 'v_serv_bs_cond',
            label: 'Laque',
        },
        {
            model: 'v_serv_bs_gelx3',
            label: 'Gel x3',
        },
        {
            model: 'v_hair_d_gel',
            label: 'Gel',
        },
        {
            model: 'p_int_jewel_mirror',
            label: 'Miroir',
        },
        {
            model: 'prop_clippers_01',
            label: 'Rasoir électrique',
        },
        {
            model: 'prop_cs_nail_file',
            label: 'Lime à ongles',
        },
        {
            model: 'prop_cs_pills',
            label: 'Pilules',
        },
        {
            model: 'prop_disp_razor_01',
            label: 'Rasoir',
        },
        {
            model: 'prop_toothbrush_01',
            label: 'Brosse à dents',
        },
        {
            model: 'v_res_r_perfume',
            label: 'Parfum',
        },
        {
            model: 'stt_prop_lives_bottle',
            label: 'Bouteille à coeur <3',
        },
    ],
    ['Divers']: [
        {
            model: 'prop_cs_dvd',
            label: 'DVD',
        },
        {
            model: 'v_ilev_mp_bedsidebook',
            label: 'Livre retourné',
        },
        {
            model: 'v_ilev_mr_rasberryclean',
            label: 'Nounours',
        },
        {
            model: 'p_cs_lighter_01',
            label: 'Briquet 2',
        },
        {
            model: 'prop_amb_ciggy_01',
            label: 'Cigarette',
        },
        {
            model: 'prop_controller_01',
            label: 'Manette de jeu vidéal',
        },
        {
            model: 'prop_cs_cashenvelope',
            label: 'Enveloppe',
        },
        {
            model: 'prop_syringe_01',
            label: 'Seringue',
            collision: false,
        },
        {
            model: 'prop_binoc_01',
            label: 'Jumelles 1',
            collision: false,
        },
        {
            model: 'prop_gaffer_tape',
            label: 'Rouleau de scotch',
        },
        {
            model: 'prop_inhaler_01',
            label: 'Inhalateur',
        },
        {
            model: 'ng_proc_syrnige01a',
            label: 'Seringue 2',
            collision: false,
        },
        {
            model: 'xs_propintxmas_tree_2018',
            label: 'Sapin de Noël',
            collision: false,
        },
        {
            model: 'ch_prop_ch_diamond_xmastree',
            label: 'Sapin de Diamands',
            collision: false,
        },
    ],
    ['Sport']: [
        {
            model: 'prop_beach_bars_01',
            label: 'Barres de traction (triple)',
        },
        {
            model: 'prop_beach_bars_02',
            label: 'Barres de traction (simple)',
        },
        {
            model: 'prop_beach_dip_bars_01',
            label: 'Barres symmetriques 1',
        },
        {
            model: 'prop_beach_dip_bars_02',
            label: 'Barres symmetriques 2',
        },
        {
            model: 'prop_beach_rings_01',
            label: 'Anneaux de gymnastique 1',
        },
        {
            model: 'prop_muscle_bench_03',
            label: 'Banc de musculation 1',
        },
        {
            model: 'prop_muscle_bench_05',
            label: 'Barre de traction 1',
        },
        {
            model: 'prop_ping_pong',
            label: 'Balle de ping-pong',
        },
        {
            model: 'prop_pool_rack_01',
            label: 'Rack de billard',
        },
        {
            model: 'prop_pool_tri',
            label: 'Triangle de billard',
        },
        {
            model: 'prop_boxing_glove_01',
            label: 'Gant de boxe 1',
        },
        {
            model: 'prop_freeweight_01',
            label: 'Haltère 1',
        },
        {
            model: 'prop_golf_bag_01',
            label: 'Sac de golf',
        },
        {
            model: 'prop_golf_bag_01b',
            label: 'Sac de golf 2',
        },
        {
            model: 'prop_golf_bag_01c',
            label: 'Sac de golf 3',
        },
        {
            model: 'prop_golf_driver',
            label: 'Club de golf 1',
        },
        {
            model: 'prop_golf_iron_01',
            label: 'Club de golf 2',
        },
        {
            model: 'prop_golf_putter_01',
            label: 'Club de golf 3',
        },
        {
            model: 'prop_beach_punchbag',
            label: 'Sac de frappe',
        },
        {
            model: 'prop_basketball_net',
            label: 'Filet de basket',
        },
        {
            model: 'prop_table_ten_bat',
            label: 'Raquette de ping pong',
            collision: false,
        },
        {
            model: 'prop_swiss_ball_01',
            label: 'Ballon de gym 1',
        },
        {
            model: 'stt_prop_stunt_soccer_goal',
            label: 'But de foot',
        },
        {
            model: 'w_am_baseball',
            label: 'Balle de baseball',
            collision: false,
        },
        {
            model: 'prop_table_tennis',
            label: 'Table de ping pong',
        },
        {
            model: 'p_yoga_mat_01_s',
            label: 'Tapis de yoga',
            collision: false,
        },
        {
            model: 'prop_yoga_mat_02',
            label: 'Tapis de yoga 2',
            collision: false,
        },
        {
            model: 'prop_yoga_mat_03',
            label: 'Tapis de yoga 3',
            collision: false,
        },
        {
            model: 'prop_ball_box',
            label: 'Boite de ballons',
        },
        {
            model: 'prop_barbell_01',
            label: 'Haltere 2',
        },
        {
            model: 'prop_barbell_02',
            label: 'Haltere 3',
        },
        {
            model: 'prop_bowling_ball',
            label: 'Boule de bowling',
        },
        {
            model: 'prop_bowling_pin',
            label: 'Quille de bowling',
        },
        {
            model: 'prop_curl_bar_01',
            label: 'Barre de musculation',
        },
        {
            model: 'prop_dart_bd_01',
            label: 'Cible de flechettes 1',
        },
        {
            model: 'prop_dart_bd_cab_01',
            label: 'Cible de flechettes 2',
        },
        {
            model: 'prop_punch_bag_l',
            label: 'Sac de frappe 2',
        },
        {
            model: 'prop_weight_bench_02',
            label: 'Banc de musculation 2',
        },
        {
            model: 'prop_weight_squat',
            label: 'Barre de musculation 2',
        },
        {
            model: 'apa_p_apdlc_crosstrainer_s',
            label: 'Velo elliptique',
        },
        {
            model: 'apa_p_apdlc_treadmill_s',
            label: 'Tapis de course',
        },
        {
            model: 'p_ld_am_ball_01',
            label: 'Ballon de football',
            collision: false,
        },
        {
            model: 'p_ld_frisbee_01',
            label: 'Frisbee',
            collision: false,
        },
        {
            model: 'p_ld_soc_ball_01',
            label: 'Ballon de soccer',
            collision: false,
        },
        {
            model: 'prop_bskball_01',
            label: 'Ballon de basket',
            collision: false,
        },
        {
            model: 'prop_exercisebike',
            label: "Velo d'appartement",
        },
        {
            model: 'prop_tennis_ball',
            label: 'Balle de tennis',
            collision: false,
        },
        {
            model: 'prop_tennis_rack_01',
            label: 'Raquette de tennis',
            collision: false,
        },
        {
            model: 'prop_tennis_rack_01b',
            label: 'Raquette de tennis 2',
            collision: false,
        },
    ],
    ['Plage']: [
        {
            model: 'p_cs_beachtowel_01_s',
            label: 'Serviette de plage 1',
            collision: false,
        },
        {
            model: 'prop_parasol_04',
            label: 'Parasol ouvert 1',
        },
        {
            model: 'prop_parasol_04b',
            label: 'Parasol ouvert 2',
        },
        {
            model: 'prop_parasol_04c',
            label: 'Parasol ouvert 3',
        },
        {
            model: 'prop_parasol_04e',
            label: 'Parasol fermé 1',
        },
        {
            model: 'prop_parasol_bh_48',
            label: 'Parasol fermé 2',
        },
        {
            model: 'prop_patio_lounger_3',
            label: 'Transat 1',
        },
        {
            model: 'prop_patio_lounger1b',
            label: 'Transat 2',
        },
        {
            model: 'p_patio_lounger1_s',
            label: 'Transat 3',
        },
        {
            model: 'prop_byard_lifering',
            label: 'Bouée de sauvetage',
        },
        {
            model: 'prop_jetski_ramp_01',
            label: 'Rampe de jet-ski',
        },
        {
            model: 'prop_beach_bag_01a',
            label: 'Sac de plage 1',
        },
        {
            model: 'prop_beach_bag_01b',
            label: 'Sac de plage 2',
        },
        {
            model: 'prop_beach_bag_02',
            label: 'Sac de plage 3',
        },
        {
            model: 'prop_beach_bag_03',
            label: 'Sac de plage 4',
        },
        {
            model: 'prop_beach_bbq',
            label: 'Barbecue de plage',
        },
        {
            model: 'prop_beach_fire',
            label: 'Feu de plage',
        },
        {
            model: 'prop_beach_lg_float',
            label: 'Gros matelas gonflable',
        },
        {
            model: 'prop_beach_lilo_01',
            label: 'Matelas gonflable 1',
        },
        {
            model: 'prop_beach_lilo_02',
            label: 'Matelas gonflable 2',
        },
        {
            model: 'prop_beach_lotion_01',
            label: 'Lotion solaire 1',
        },
        {
            model: 'prop_beach_lotion_02',
            label: 'Lotion solaire 2',
        },
        {
            model: 'prop_beach_lotion_03',
            label: 'Lotion solaire 3',
        },
        {
            model: 'prop_beach_parasol_01',
            label: 'Parasol de plage 1',
        },
        {
            model: 'prop_beach_parasol_02',
            label: 'Parasol de plage 2',
        },
        {
            model: 'prop_beach_parasol_03',
            label: 'Parasol de plage 3',
        },
        {
            model: 'prop_beach_parasol_04',
            label: 'Parasol de plage 4',
        },
        {
            model: 'prop_beach_parasol_05',
            label: 'Parasol de plage 5',
        },
        {
            model: 'prop_beach_parasol_06',
            label: 'Parasol de plage 6',
        },
        {
            model: 'prop_beach_parasol_07',
            label: 'Parasol de plage 7',
        },
        {
            model: 'prop_beach_parasol_08',
            label: 'Parasol de plage 8',
        },
        {
            model: 'prop_beach_parasol_10',
            label: 'Parasol de plage 9',
        },
        {
            model: 'prop_beach_ring_01',
            label: 'Bouée gonflable ronde',
        },
        {
            model: 'prop_beach_sandcas_01',
            label: 'Château de sable 1',
        },
        {
            model: 'prop_beach_sandcas_03',
            label: 'Château de sable 2',
        },
        {
            model: 'prop_beach_sandcas_04',
            label: 'Château de sable 3',
        },
        {
            model: 'prop_beach_sandcas_05',
            label: 'Château de sable 4',
        },
        {
            model: 'prop_beach_towel_01',
            label: 'Serviette de plage roulée 1',
        },
        {
            model: 'prop_beach_towel_02',
            label: 'Serviette de plage roulée 2',
        },
        {
            model: 'prop_beach_towel_03',
            label: 'Serviette de plage roulée 3',
        },
        {
            model: 'prop_beach_towel_04',
            label: 'Serviette de plage roulée 4',
        },
        {
            model: 'prop_beach_volball01',
            label: 'Ballon de volley',
        },
        {
            model: 'prop_beachball_01',
            label: 'Ballon de plage 1',
        },
        {
            model: 'prop_beachball_02',
            label: 'Ballon de plage 2',
        },
        {
            model: 'prop_beachf_01_cr',
            label: 'Drapeau de plage 1',
            collision: false,
        },
        {
            model: 'prop_beachflag_01',
            label: 'Drapeau de plage 2',
            collision: false,
        },
        {
            model: 'prop_beachflag_02',
            label: 'Drapeau de plage 3',
            collision: false,
        },
        {
            model: 'prop_beachflag_le',
            label: 'Drapeau de plage 4',
            collision: false,
        },
        {
            model: 'prop_boogbd_stack_01',
            label: 'Planches de surf (pile) 1',
        },
        {
            model: 'prop_boogbd_stack_02',
            label: 'Planches de surf (pile) 2',
        },
        {
            model: 'prop_boogieboard_01',
            label: 'Planche de surf 1',
        },
        {
            model: 'prop_boogieboard_02',
            label: 'Planche de surf 2',
        },
        {
            model: 'prop_buck_spade_01',
            label: 'Seaux de plage (pile) 1',
        },
        {
            model: 'prop_buck_spade_02',
            label: 'Seau de plage 1',
        },
        {
            model: 'prop_buck_spade_03',
            label: 'Seau de plage 2',
        },
        {
            model: 'prop_buck_spade_04',
            label: 'Seau de plage 3',
        },
        {
            model: 'prop_buck_spade_05',
            label: 'Seau de plage 4',
        },
        {
            model: 'prop_buck_spade_06',
            label: 'Seau de plage 5',
        },
        {
            model: 'prop_buck_spade_07',
            label: 'Seau de plage 6',
        },
        {
            model: 'prop_buck_spade_08',
            label: 'Seau de plage 7',
        },
        {
            model: 'prop_buck_spade_09',
            label: 'Seau de plage 8',
        },
        {
            model: 'prop_buck_spade_10',
            label: 'Seau de plage 9',
        },
        {
            model: 'prop_coolbox_01',
            label: 'Glacière 1',
        },
        {
            model: 'prop_jetski_trailer_01',
            label: 'Remorque de jet-ski',
        },
        {
            model: 'prop_life_ring_01',
            label: 'Bouée de sauvetage sur pied',
        },
        {
            model: 'prop_life_ring_02',
            label: 'Bouée de sauvetage',
        },
        {
            model: 'prop_surf_board_01',
            label: 'Planche de surf 1',
        },
        {
            model: 'prop_surf_board_02',
            label: 'Planche de surf 2',
        },
        {
            model: 'prop_surf_board_03',
            label: 'Planche de surf 3',
        },
        {
            model: 'prop_surf_board_04',
            label: 'Planche de surf 4',
        },
        {
            model: 'prop_surf_board_ldn_01',
            label: 'Planche de surf 5',
        },
        {
            model: 'prop_surf_board_ldn_02',
            label: 'Planche de surf 6',
        },
        {
            model: 'prop_surf_board_ldn_03',
            label: 'Planche de surf 7',
        },
        {
            model: 'prop_surf_board_ldn_04',
            label: 'Planche de surf 8',
        },
        {
            model: 'prop_test_sandcas_002',
            label: 'Château de sable 5',
        },
        {
            model: 'prop_venice_board_01',
            label: 'Panneau de Venice Beach 1',
        },
        {
            model: 'prop_venice_board_02',
            label: 'Panneau de Venice Beach 2',
        },
        {
            model: 'prop_venice_board_03',
            label: 'Panneau de Venice Beach 3',
        },
        {
            model: 'prop_bin_beach_01a',
            label: 'Poubelle de plage 1',
        },
        {
            model: 'prop_bin_beach_01d',
            label: 'Poubelle de plage 2',
        },
        {
            model: 'p_airdancer_01_s',
            label: 'Boudin qui danse',
        },
        {
            model: 'prop_umpire_01',
            label: 'Siège de maitre nageur',
        },
    ],
    ['Musique']: [
        {
            model: 'prop_boombox_01',
            label: 'Boombox',
        },
        {
            model: 'prop_ghettoblast_01',
            label: 'Ghetto Blaster 1',
        },
        {
            model: 'prop_ghettoblast_02',
            label: 'Ghetto Blaster 2',
        },
        {
            model: 'prop_hifi_01',
            label: 'Chaîne Hi-Fi',
        },
        {
            model: 'prop_mp3_dock',
            label: "Station d'accueil MP3",
        },
        {
            model: 'prop_tapeplayer_01',
            label: 'Lecteur cassette',
        },
        {
            model: 'prop_portable_hifi_01',
            label: 'Chaîne Hi-Fi portable',
        },
        {
            model: 'prop_speaker_02',
            label: 'Enceinte 1',
        },
        {
            model: 'prop_speaker_03',
            label: 'Enceinte 2',
        },
        {
            model: 'prop_speaker_05',
            label: 'Enceinte 3',
        },
        {
            model: 'prop_speaker_06',
            label: 'Enceinte 4',
        },
        {
            model: 'prop_speaker_07',
            label: 'Enceinte 5',
        },
        {
            model: 'prop_speaker_08',
            label: 'Enceinte 6',
        },
        {
            model: 'prop_vcr_01',
            label: 'Magnétoscope',
        },
        {
            model: 'ba_prop_battle_dj_stand',
            label: 'Stand de DJ',
        },
        {
            model: 'sf_prop_sf_rack_audio_01a',
            label: 'Rack audio',
        },
        {
            model: 'sf_prop_sf_ps_mixer_01a',
            label: 'Table de mixage sur pied ',
        },
    ],
    ['Lits']: [
        {
            model: 'v_res_msonbed',
            label: 'Lit en vrac 1',
        },
        {
            model: 'p_lestersbed_s',
            label: 'Lit en vrac 2',
        },
        {
            model: 'p_mbbed_s',
            label: 'Lit ancien',
        },
        {
            model: 'apa_mp_h_bed_double_08',
            label: 'Lit double 1',
        },
        {
            model: 'apa_mp_h_bed_double_09',
            label: 'Lit double 2',
        },
        {
            model: 'apa_mp_h_bed_wide_05',
            label: 'Lit triple 1',
        },
        {
            model: 'apa_mp_h_bed_with_table_02',
            label: 'Lit double avec table de chevet 1',
        },
        {
            model: 'apa_mp_h_yacht_bed_01',
            label: 'Lit triple 2',
        },
        {
            model: 'apa_mp_h_yacht_bed_02',
            label: 'Lit triple 3',
        },
        {
            model: 'bkr_prop_biker_campbed_01',
            label: 'Lit de camp 1',
        },
        {
            model: 'ex_prop_exec_bed_01',
            label: 'Lit pas fait',
        },
        {
            model: 'gr_prop_bunker_bed_01',
            label: 'Lit de bunker 1',
        },
        {
            model: 'v_res_mdbed',
            label: 'Lit luxueux 1',
        },
    ],
    ['Bancs']: [
        {
            model: 'prop_bench_01a',
            label: 'Banc noir',
        },
        {
            model: 'prop_bench_01b',
            label: 'Banc bleu',
        },
        {
            model: 'prop_bench_01c',
            label: 'Banc vert',
        },
        {
            model: 'prop_bench_02',
            label: 'Banc en métal grille 1',
        },
        {
            model: 'prop_bench_03',
            label: 'Banc en métal grille 2',
        },
        {
            model: 'prop_bench_04',
            label: 'Banc en bois 1',
        },
        {
            model: 'prop_bench_05',
            label: 'Banc en bois 2',
        },
        {
            model: 'prop_bench_06',
            label: 'Banc en bois 3',
        },
        {
            model: 'prop_bench_07',
            label: 'Banc en bois 4',
        },
        {
            model: 'prop_bench_08',
            label: 'Banc en bois 5',
        },
        {
            model: 'prop_bench_09',
            label: 'Banc en béton 1',
        },
        {
            model: 'prop_bench_10',
            label: 'Banc en bois 6',
        },
        {
            model: 'prop_bench_11',
            label: 'Banc en bois 7',
        },
    ],
    ['Poubelles']: [
        {
            model: 'prop_cs_bin_02',
            label: 'Poubelle 1',
        },
        {
            model: 'prop_cs_dumpster_01a',
            label: 'Benne à ordures 1',
        },
        {
            model: 'prop_rub_binbag_sd_01',
            label: 'Sac poubelle 1',
        },
        {
            model: 'prop_rub_binbag_03',
            label: 'Poubelles en bazar 1',
        },
        {
            model: 'prop_rub_binbag_04',
            label: 'Sac poubelle 2',
        },
        {
            model: 'prop_rub_binbag_05',
            label: 'Sac poubelle 3',
        },
        {
            model: 'prop_bin_01a',
            label: 'Poubelle 2',
        },
        {
            model: 'prop_bin_02a',
            label: 'Poubelle 3',
        },
        {
            model: 'prop_bin_04a',
            label: 'Poubelle 4',
        },
        {
            model: 'prop_bin_05a',
            label: 'Poubelle 5',
        },
        {
            model: 'prop_bin_06a',
            label: 'Poubelle 6',
        },
        {
            model: 'prop_bin_07a',
            label: 'Poubelle 7',
        },
        {
            model: 'prop_bin_08a',
            label: 'Poubelle 8',
        },
        {
            model: 'prop_bin_08open',
            label: 'Poubelle 9',
        },
        {
            model: 'prop_bin_09a',
            label: 'Poubelle 10',
        },
        {
            model: 'prop_bin_10a',
            label: 'Poubelle 11',
        },
        {
            model: 'prop_bin_11a',
            label: 'Poubelle 12',
        },
        {
            model: 'prop_bin_14a',
            label: 'Benne à ordures 2',
        },
        {
            model: 'prop_bin_beach_01d',
            label: 'Poubelle de plage 1',
        },
        {
            model: 'prop_bin_delpiero',
            label: 'Poubelle de plage 2',
        },
        {
            model: 'prop_bin_delpiero_b',
            label: 'Poubelle de plage 3',
        },
        {
            model: 'prop_dumpster_02a',
            label: 'Benne à ordures 3',
        },
        {
            model: 'prop_dumpster_4b',
            label: 'Benne à ordures 4',
        },
        {
            model: 'prop_recyclebin_04_a',
            label: 'Poubelle de recyclage 1',
        },
        {
            model: 'prop_recyclebin_04_b',
            label: 'Poubelle de recyclage 2',
        },
        {
            model: 'prop_recyclebin_05_a',
            label: 'Poubelle de recyclage 3',
        },
    ],
    ['Sofas']: [
        {
            model: 'v_ilev_m_sofa',
            label: 'Canapé en cuir blanc 1',
        },
        {
            model: 'v_res_mp_sofa',
            label: 'Canapé en cuir blanc 2',
        },
        {
            model: 'v_res_tt_sofa',
            label: 'Canapé vieux en bois 1',
        },
        {
            model: 'v_16_low_lng_mesh_sofa1',
            label: 'Canapé usé 1',
        },
        {
            model: 'hei_heist_stn_sofa3seat_01',
            label: 'Canapé long 1',
        },
        {
            model: 'hei_heist_stn_sofacorn_05',
            label: "Canapé d'angle 1",
        },
        {
            model: 'v_ilev_m_sofa',
            label: 'Canapé en cuir blanc 1',
        },
        {
            model: 'v_res_tre_sofa',
            label: 'Sofa 1',
        },
        {
            model: 'prop_t_sofa_02',
            label: 'Sofa 2',
        },
        {
            model: 'miss_rub_couch_01',
            label: 'Sofa 3',
        },
        {
            model: 'p_res_sofa_l_s',
            label: 'Sofa 4',
        },
        {
            model: 'prop_rub_couch04',
            label: 'Sofa 5',
        },
        {
            model: 'prop_couch_01',
            label: 'Sofa Luxueux 1',
        },
        {
            model: 'prop_couch_03',
            label: 'Sofa Luxueux 2',
        },
        {
            model: 'prop_couch_lg_02',
            label: 'Sofa 6',
        },
        {
            model: 'prop_couch_lg_06',
            label: 'Sofa 7',
        },
        {
            model: 'prop_couch_lg_07',
            label: 'Sofa Luxueux 3',
        },
        {
            model: 'prop_couch_lg_08',
            label: 'Sofa Luxueux 4',
        },
        {
            model: 'apa_mp_h_stn_sofa_daybed_01',
            label: 'Fauteuil allongé 1',
        },
        {
            model: 'apa_mp_h_stn_sofa_daybed_02',
            label: 'Fauteuil allongé 2',
        },
        {
            model: 'apa_mp_h_stn_sofacorn_01',
            label: "Canapé d'angle 2",
        },
        {
            model: 'apa_mp_h_stn_sofacorn_05',
            label: "Canapé d'angle 3",
        },
        {
            model: 'apa_mp_h_stn_sofacorn_06',
            label: "Canapé d'angle 4",
        },
        {
            model: 'apa_mp_h_stn_sofacorn_07',
            label: "Canapé d'angle 5",
        },
        {
            model: 'apa_mp_h_stn_sofacorn_08',
            label: "Canapé d'angle 6",
        },
        {
            model: 'apa_mp_h_stn_sofacorn_09',
            label: "Canapé d'angle 7",
        },
        {
            model: 'apa_mp_h_stn_sofacorn_10',
            label: "Canapé d'angle 8",
        },
        {
            model: 'ex_mp_h_off_sofa_003',
            label: 'Canapé de bureau 1',
        },
        {
            model: 'ex_mp_h_off_sofa_01',
            label: 'Canapé de bureau 2',
        },
        {
            model: 'ex_mp_h_off_sofa_02',
            label: 'Canapé de bureau 3',
        },
    ],
    ['Skating']: [
        {
            model: 'v_res_skateboard',
            label: 'Skateboard 1',
        },
        {
            model: 'prop_skate_halfpipe',
            label: 'Halfpipe 1',
        },
        {
            model: 'prop_skate_halfpipe_cr',
            label: 'Halfpipe 2',
        },
        {
            model: 'prop_skate_kickers',
            label: 'Kickers 1',
        },
        {
            model: 'prop_skate_quartpipe',
            label: 'Quartpipe 1',
        },
        {
            model: 'prop_skate_quartpipe_cr',
            label: 'Quartpipe 2',
        },
        {
            model: 'prop_skate_rail',
            label: 'Rail 1',
        },
        {
            model: 'prop_skate_spiner',
            label: 'Spiner 1',
        },
        {
            model: 'prop_skate_spiner_cr',
            label: 'Spiner 2',
        },
    ],
    ['Chaises et Fauteuils']: [
        {
            model: 'v_corp_sidechair',
            label: 'Chaise simple 1',
        },
        {
            model: 'v_ind_ss_chair01',
            label: 'Chaise en métal 1',
        },
        {
            model: 'v_ilev_chair02_ped',
            label: 'Chaise en plastique 1',
        },
        {
            model: 'v_ilev_hd_chair',
            label: 'Fauteuil stylé 1',
        },
        {
            model: 'v_ilev_leath_chr',
            label: 'Chaise de bureau en cuir',
        },
        {
            model: 'v_ilev_ph_bench',
            label: 'Rangée de chaises en plastique',
        },
        {
            model: 'v_res_kitchnstool',
            label: 'Chaise vieille en bois',
        },
        {
            model: 'v_res_m_armchair',
            label: 'Fauteuil en cuir blanc',
        },
        {
            model: 'v_res_mp_stripchair',
            label: 'Fauteuil en tissu vert',
        },
        {
            model: 'v_res_tre_stool',
            label: 'Tabouret simple 1',
        },
        {
            model: 'v_serv_bs_barbchair',
            label: 'Chaise de barbier 1',
        },
        {
            model: 'v_serv_bs_barbchair2',
            label: 'Chaise de barbier 2',
        },
        {
            model: 'v_serv_bs_barbchair3',
            label: 'Chaise de barbier 3',
        },
        {
            model: 'v_serv_bs_barbchair5',
            label: 'Chaise de barbier 4',
        },
        {
            model: 'prop_off_chair_01',
            label: 'Chaise de bureau 1',
        },
        {
            model: 'prop_off_chair_03',
            label: 'Chaise de bureau 2',
        },
        {
            model: 'prop_off_chair_04',
            label: 'Chaise de bureau 3',
        },
        {
            model: 'prop_off_chair_04b',
            label: 'Chaise de bureau 4',
        },
        {
            model: 'prop_off_chair_05',
            label: 'Chaise de bureau 5',
        },
        {
            model: 'v_corp_bk_chair3',
            label: 'Chaise de bureau 6',
        },
        {
            model: 'v_corp_cd_chair',
            label: 'Chaise de bureau 7',
        },
        {
            model: 'v_corp_offchair',
            label: 'Chaise de bureau 8',
        },
        {
            model: 'prop_cs_office_chair',
            label: 'Chaise de bureau 9',
        },
        {
            model: 'prop_rock_chair_01',
            label: 'Rocking chair 1',
        },
        {
            model: 'p_yacht_chair_01_s',
            label: 'Fauteuil en paille 1',
        },
        {
            model: 'prop_yacht_seat_03',
            label: 'Chaise en paille 1',
        },
        {
            model: 'p_clb_officechair_s',
            label: 'Chaise de bureau 10',
        },
        {
            model: 'p_dinechair_01_s',
            label: 'Chaise de salle à manger 1',
        },
        {
            model: 'p_soloffchair_s',
            label: 'Fauteuil en cuir noir 1',
        },
        {
            model: 'prop_chair_01a',
            label: 'Chaise en métal 3',
        },
        {
            model: 'prop_chair_01b',
            label: 'Chaise en métal 4',
        },
        {
            model: 'prop_chair_02',
            label: 'Chaise en métal 5',
        },
        {
            model: 'prop_chair_03',
            label: 'Chaise en paille 2',
        },
        {
            model: 'prop_chair_04a',
            label: 'Chaise de salle à manger 2',
        },
        {
            model: 'prop_chair_04b',
            label: 'Chaise de salle à manger 3',
        },
        {
            model: 'prop_chair_05',
            label: 'Fauteuil synthétique 1',
        },
        {
            model: 'prop_chair_06',
            label: 'Fauteuil en métal 6',
        },
        {
            model: 'prop_chair_07',
            label: 'Chaise en bois 1',
        },
        {
            model: 'prop_chair_08',
            label: 'Chaise en plastique 2',
        },
        {
            model: 'prop_chair_09',
            label: 'Chaise en métal 7',
        },
        {
            model: 'prop_chair_10',
            label: 'Chaise en métal 8',
        },
        {
            model: 'prop_chair_pile_01',
            label: 'Pile de chaises en plastique 1',
        },
        {
            model: 'prop_chateau_chair_01',
            label: 'Chaise de terrasse 1',
        },
        {
            model: 'prop_clown_chair',
            label: 'Chaise de clown',
        },
        {
            model: 'prop_old_deck_chair',
            label: 'Chaise de pêche vieille',
        },
        {
            model: 'prop_old_wood_chair',
            label: 'Chaise en bois 2',
        },
        {
            model: 'prop_table_01_chr_a',
            label: 'Chaise en vois 3',
        },
        {
            model: 'prop_table_02_chr',
            label: 'Chaise en bois 4',
        },
        {
            model: 'prop_table_03_chr',
            label: 'Chaise en plastique 3',
        },
        {
            model: 'prop_table_03b_chr',
            label: 'Chaise en plastique 4',
        },
        {
            model: 'prop_table_04_chr',
            label: 'Chaise de terrasse 2',
        },
        {
            model: 'prop_table_05_chr',
            label: 'Chaise en paille 3',
        },
        {
            model: 'v_club_barchair',
            label: 'Chaise de bar 1',
        },
        {
            model: 'v_club_cc_stool',
            label: 'Tabouret de bar 1',
        },
        {
            model: 'v_club_stagechair',
            label: 'Fauteuil de bar 1',
        },
        {
            model: 'v_club_vuarmchair',
            label: 'Fauteuil de bar 2',
        },
        {
            model: 'prop_rub_couch03',
            label: 'Fauteuil usé 1',
        },
        {
            model: 'prop_skid_chair_01',
            label: 'Chaise de camping 1',
        },
        {
            model: 'prop_skid_chair_02',
            label: 'Chaise de camping 2',
        },
        {
            model: 'prop_skid_chair_03',
            label: 'Chaise de camping 3',
        },
        {
            model: 'prop_bar_stool_01',
            label: 'Tabouret de bar 2',
        },
        {
            model: 'apa_mp_h_din_chair_04',
            label: 'Chaise de salle à manger 3',
        },
        {
            model: 'apa_mp_h_din_chair_08',
            label: 'Chaise de salle à manger 4',
        },
        {
            model: 'apa_mp_h_din_chair_09',
            label: 'Chaise de salle à manger 5',
        },
        {
            model: 'apa_mp_h_din_chair_12',
            label: 'Chaise de salle à manger 6',
        },
        {
            model: 'apa_mp_h_stn_chairarm_01',
            label: 'Fauteil en cuir 2',
        },
        {
            model: 'apa_mp_h_stn_chairarm_02',
            label: 'Fauteil en bois 1',
        },
        {
            model: 'apa_mp_h_stn_chairarm_03',
            label: 'Fauteil en bois 2',
        },
        {
            model: 'apa_mp_h_stn_chairarm_09',
            label: 'Fauteil rond 1',
        },
        {
            model: 'apa_mp_h_stn_chairarm_11',
            label: 'Fauteil en bois 3',
        },
        {
            model: 'apa_mp_h_stn_chairarm_12',
            label: 'Fauteil de bureau 1',
        },
        {
            model: 'apa_mp_h_stn_chairarm_13',
            label: 'Fauteil de bureau 2',
        },
        {
            model: 'apa_mp_h_stn_chairarm_26',
            label: 'Fauteil rond 2',
        },
        {
            model: 'apa_mp_h_stn_chairstool_12',
            label: 'Tabouret de bar 3',
        },
        {
            model: 'apa_mp_h_stn_chairstrip_02',
            label: 'Fautueil en cuir 3',
        },
        {
            model: 'apa_mp_h_stn_chairstrip_03',
            label: 'Fautueil en cuir 4',
        },
        {
            model: 'apa_mp_h_stn_chairstrip_04',
            label: 'Fautueil en cuir 5',
        },
        {
            model: 'apa_mp_h_stn_chairstrip_05',
            label: 'Fautueil en cuir 6',
        },
        {
            model: 'apa_mp_h_stn_chairstrip_07',
            label: 'Fautueil en cuir 7',
        },
        {
            model: 'apa_mp_h_yacht_armchair_01',
            label: 'Fauteuil en cuir 8',
        },
        {
            model: 'apa_mp_h_yacht_armchair_04',
            label: 'Fauteuil en cuir 9',
        },
        {
            model: 'apa_mp_h_yacht_barstool_01',
            label: 'Tabouret de bar 4',
        },
        {
            model: 'hei_heist_stn_chairarm_04',
            label: 'Fauteuil en cuir 10',
        },
        {
            model: 'hei_heist_stn_chairarm_06',
            label: 'Chaise stylée 1',
        },
        {
            model: 'v_ilev_fh_kitchenstool',
            label: 'Tabouret de bar 5',
        },
        {
            model: 'prop_direct_chair_01',
            label: 'Chaise de camping 4',
        },
    ],
    ['Exterieur']: [
        {
            model: 'prop_bbq_1',
            label: 'Barbecue 1',
        },
        {
            model: 'prop_bbq_5',
            label: 'Barbecue 2',
        },
        {
            model: 'prop_hobo_seat_01',
            label: 'Pouf de camping 1',
        },
        {
            model: 'prop_fire_hydrant_1',
            label: "Bouche d'incendie 1",
        },
        {
            model: 'prop_fire_hydrant_4',
            label: "Bouche d'incendie 2",
        },
        {
            model: 'prop_old_churn_01',
            label: 'Baril en métal',
        },
        {
            model: 'prop_gnome1',
            label: 'Nain de jardin 1',
        },
        {
            model: 'prop_gnome2',
            label: 'Nain de jardin 2',
        },
        {
            model: 'prop_gnome3',
            label: 'Nain de jardin 3',
        },
        {
            model: 'prop_stickbfly',
            label: 'Oiseau sur baton 1',
        },
        {
            model: 'prop_stickhbird',
            label: 'Oiseau sur baton 2',
        },
        {
            model: 'prop_parasol_01',
            label: 'Parasol 1',
        },
        {
            model: 'prop_parasol_01_b',
            label: 'Parasol 2',
        },
        {
            model: 'prop_parasol_01_c',
            label: 'Parasol 3',
        },
        {
            model: 'prop_parasol_02',
            label: 'Parasol 4',
        },
        {
            model: 'prop_parasol_02_b',
            label: 'Parasol 5',
        },
        {
            model: 'prop_parasol_02_c',
            label: 'Parasol 6',
        },
        {
            model: 'prop_parasol_05',
            label: 'Parasol 7',
        },
        {
            model: 'prop_parasol_03',
            label: 'Parasol 8',
        },
        {
            model: 'prop_parasol_03_b',
            label: 'Parasol 9',
        },
        {
            model: 'prop_parasol_03_c',
            label: 'Parasol 9',
        },
        {
            model: 'prop_coffin_01',
            label: 'Cercueil 1',
        },
        {
            model: 'prop_coffin_02',
            label: 'Cercueil 2',
        },
        {
            model: 'prop_coffin_02b',
            label: 'Cercueil 3',
        },
        {
            model: 'prop_wateringcan',
            label: 'Arrosoir',
        },
        {
            model: 'prop_bucket_01a',
            label: 'Seau 1',
        },
        {
            model: 'prop_watercrate_01',
            label: "Caisse d'eau 1",
        },
        {
            model: 'prop_wooden_barrel',
            label: 'Baril en bois 1',
        },
        {
            model: 'prop_fruit_sign_01',
            label: 'Panneau de fruits',
        },
        {
            model: 'prop_fruit_stand_01',
            label: 'Stand de fruits 1',
        },
        {
            model: 'prop_fruit_stand_02',
            label: 'Stand de fruits 2',
        },
        {
            model: 'prop_fruit_stand_03',
            label: 'Stand de fruits 3',
        },
        {
            model: 'prop_water_ramp_02',
            label: "Rampe de mise à l'eau 1",
        },
        {
            model: 'prop_water_ramp_03',
            label: "Rampe de mise à l'eau 2",
        },
        {
            model: 'prop_cs_protest_sign_01',
            label: 'Pancarte de manifestation 1',
        },
        {
            model: 'prop_cs_protest_sign_03',
            label: 'Pancarte de manifestation 2',
        },
        {
            model: 'prop_cs_protest_sign_04a',
            label: 'Pancarte de manifestation 3',
        },
        {
            model: 'prop_cs_protest_sign_04b',
            label: 'Pancarte de manifestation 4',
        },
        {
            model: 'prop_road_memorial_01',
            label: 'Memorial 1',
        },
        {
            model: 'prop_road_memorial_02',
            label: 'Memorial 2',
        },
        {
            model: 'prop_prlg_snowpile',
            label: 'Bonhomme de neige',
        },
        {
            model: 'prop_rural_windmill',
            label: 'Eolienne',
        },
        {
            model: 'prop_hayb_st_01_cr',
            label: 'Botte de foin 1',
        },
        {
            model: 'prop_haybale_01',
            label: 'Botte de foin 2',
        },
        {
            model: 'prop_haybale_02',
            label: 'Botte de foin 3',
        },
        {
            model: 'prop_haybale_03',
            label: 'Botte de foin 4',
        },
        {
            model: 'prop_waterwheela',
            label: "Roue de tuyau d'eau",
        },
        {
            model: 'prop_bbq_2',
            label: 'Barbecue 3',
        },
        {
            model: 'prop_bbq_3',
            label: 'Barbecue 4',
        },
        {
            model: 'prop_bbq_4',
            label: 'Barbecue 5',
        },
        {
            model: 'prop_birdbath1',
            label: "Bain d'oiseaux 1",
        },
        {
            model: 'prop_birdbath2',
            label: "Bain d'oiseaux 2",
        },
        {
            model: 'prop_doghouse_01',
            label: 'Niche',
        },
        {
            model: 'prop_flamingo',
            label: 'Flamant rose',
        },
        {
            model: 'prop_fruitstand_01',
            label: 'Tente de marché 1',
        },
        {
            model: 'prop_gazebo_01',
            label: "Tente d'extérieur 1",
        },
        {
            model: 'prop_gazebo_02',
            label: "Tente d'extérieur 2",
        },
        {
            model: 'prop_letterbox_01',
            label: 'Boîte aux lettres 1',
        },
        {
            model: 'prop_letterbox_02',
            label: 'Boîte aux lettres 2',
        },
        {
            model: 'prop_letterbox_03',
            label: 'Boîte aux lettres 3',
        },
        {
            model: 'prop_prlg_gravestone_01a',
            label: 'Pierre tombale 1',
        },
        {
            model: 'prop_prlg_gravestone_02a',
            label: 'Pierre tombale 2',
        },
        {
            model: 'prop_prlg_gravestone_03a',
            label: 'Pierre tombale 3',
        },
        {
            model: 'prop_prlg_gravestone_04a',
            label: 'Pierre tombale 4',
        },
        {
            model: 'prop_prlg_gravestone_05a',
            label: 'Pierre tombale 5',
        },
        {
            model: 'prop_portaloo_01a',
            label: 'Toilettes portables 1',
        },
        {
            model: 'prop_bleachers_04_cr',
            label: 'Gradins 1',
        },
        {
            model: 'prop_bleachers_05_cr',
            label: 'Gradins 2',
        },
        {
            model: 'prop_bleachers_01',
            label: 'Gradins 3',
        },
        {
            model: 'prop_bleachers_02',
            label: 'Gradins 4',
        },
        {
            model: 'prop_bleachers_03',
            label: 'Gradins 5',
        },
        {
            model: 'prop_inflatearch_01',
            label: 'Arche gonflable 1',
        },
    ],
    ['Studio']: [
        {
            model: 'prop_studio_light_02',
            label: 'Lumière de studio 1',
        },
        {
            model: 'v_ilev_fos_mic',
            label: 'Micro sur pieds 1',
        },
        {
            model: 'prop_podium_mic',
            label: 'Micro de podium',
        },
        {
            model: 'prop_tv_cam_02',
            label: 'Caméra de télévision 1',
        },
        {
            model: 'prop_voltmeter_01',
            label: 'Voltmètre 1',
        },
        {
            model: 'v_club_roc_micstd',
            label: 'Micro sur pieds 2',
        },
        {
            model: 'v_res_mountedprojector',
            label: 'Projecteur de plafond',
        },
        {
            model: 'prop_spot_01',
            label: 'Spot de lumière 1',
        },
        {
            model: 'prop_kino_light_01',
            label: 'Lumière de studio 2',
        },
        {
            model: 'prop_kino_light_03',
            label: 'Lumière de studio 3',
        },
        {
            model: 'prop_studio_light_01',
            label: 'Lumière de studio 4',
        },
        {
            model: 'prop_studio_light_02',
            label: 'Lumière de studio 5',
        },
        {
            model: 'prop_studio_light_03',
            label: 'Lumière de studio 6',
        },
    ],
    ['BTP']: [
        {
            model: 'p_pallet_02a_s',
            label: 'Palette de bois 1',
        },
        {
            model: 'prop_ld_faucet',
            label: "Tuyau d'eau 1",
        },
        {
            model: 'prop_mp_barrier_01',
            label: 'Barrière en béton 1',
        },
        {
            model: 'prop_mp_arrow_barrier_01',
            label: 'Barrière flêchée 1',
        },
        {
            model: 'prop_mp_barrier_02',
            label: 'Barrière Travaux droit devant',
        },
        {
            model: 'prop_mp_barrier_02b',
            label: 'Barrière de chantier',
        },
        {
            model: 'prop_rad_waste_barrel_01',
            label: 'Baril de déchets radioactifs',
        },
        {
            model: 'p_blueprints_01_s',
            label: 'Plans de construction',
            collision: false,
        },
        {
            model: 'prop_cementbags01',
            label: 'Palette Sacs de ciment',
        },
        {
            model: 'prop_cementmixer_01a',
            label: 'Bétonnière 1',
        },
        {
            model: 'prop_cementmixer_02a',
            label: 'Bétonnière 2',
        },
        {
            model: 'prop_conc_blocks01a',
            label: 'Palette Bloc de béton 1',
        },
        {
            model: 'prop_conc_blocks01b',
            label: 'Palette Bloc de béton 2',
        },
        {
            model: 'prop_conc_blocks01c',
            label: 'Palette Bloc de béton 3',
        },
        {
            model: 'prop_conc_sacks_02a',
            label: 'Sacs de ciment 2',
        },
        {
            model: 'prop_cons_crate',
            label: 'Caisse de construction vide',
        },
        {
            model: 'prop_mc_conc_barrier_01',
            label: 'Barrière de chantier jaune/noire',
        },
        {
            model: 'prop_pipes_01b',
            label: 'Caisse de tuyaux 1',
        },
        {
            model: 'prop_tool_sawhorse',
            label: 'Chevalet de sciage',
        },
        {
            model: 'prop_woodpile_01a',
            label: 'Tas de planches de bois 1',
        },
        {
            model: 'prop_woodpile_01b',
            label: 'Tas de planches de bois 2',
        },
        {
            model: 'prop_woodpile_01c',
            label: 'Tas de bois 1',
        },
        {
            model: 'prop_woodpile_03a',
            label: 'Tas de planches de bois 3',
        },
        {
            model: 'prop_woodpile_04a',
            label: 'Tas de bois 2',
        },
        {
            model: 'prop_woodpile_04b',
            label: 'Tas de bois 3',
        },
        {
            model: 'prop_worklight_04a',
            label: 'Lampe de chantier 1',
        },
        {
            model: 'ng_proc_block_02a',
            label: 'Parpaing 1',
        },
        {
            model: 'ng_proc_brick_01a',
            label: 'Brique 1',
        },
        {
            model: 'prop_rub_generator',
            label: 'Groupe électrogène',
        },
        {
            model: 'prop_rub_stool',
            label: 'Tabouret de chantier',
        },
        {
            model: 'prop_construcionlamp_01',
            label: 'Lampe de chantier 2',
        },
        {
            model: 'prop_highway_paddle',
            label: 'Panneau de signalisation highway',
        },
        {
            model: 'prop_maxheight_01',
            label: 'Panneau de signalisation hauteur max',
        },
        {
            model: 'prop_mb_sandblock_01',
            label: 'Bloc de sable',
        },
        {
            model: 'prop_byard_bench01',
            label: 'Banc de chantier',
        },
        {
            model: 'prop_byard_benchset',
            label: 'Table de chantier',
        },
        {
            model: 'prop_set_generator_01_cr',
            label: 'Groupe électrogène 2',
        },
        {
            model: 'prop_generator_01a',
            label: 'Groupe électrogène 3',
        },
        {
            model: 'prop_barrel_03a',
            label: 'Baril 1',
        },
        {
            model: 'prop_flattruck_01a',
            label: 'Camionnette de chantier',
        },
        {
            model: 'prop_pallettruck_01',
            label: 'Chariot élévateur',
        },
        {
            model: 'prop_barrier_work01a',
            label: 'Barrière de chantier 1',
        },
        {
            model: 'prop_barrier_work01d',
            label: 'Barrière de chantier 2',
        },
        {
            model: 'prop_barrier_work06a',
            label: 'Barrière de chantier 3',
        },
        {
            model: 'prop_oiltub_01',
            label: "Tonneau d'huile 1",
        },
        {
            model: 'prop_oiltub_03',
            label: "Bidon d'huile 1",
        },
        {
            model: 'prop_oiltub_04',
            label: "Bidon d'huile 2",
        },
        {
            model: 'prop_oiltub_05',
            label: "Bidon d'huile 3",
        },
        {
            model: 'prop_paints_can01',
            label: 'Pot de peinture 1',
        },
        {
            model: 'prop_paints_can02',
            label: 'Pot de peinture 2',
        },
        {
            model: 'prop_paints_can03',
            label: 'Pot de peinture 3',
        },
        {
            model: 'prop_paints_can04',
            label: 'Pot de peinture 4',
        },
        {
            model: 'prop_paints_can05',
            label: 'Pot de peinture 5',
        },
        {
            model: 'prop_gascyl_01a',
            label: 'Bouteille de gaz 1',
        },
        {
            model: 'prop_gascyl_02a',
            label: 'Bouteille de gaz 2',
        },
        {
            model: 'prop_gascyl_03a',
            label: 'Bouteille de gaz 3',
        },
        {
            model: 'prop_barrier_wat_03b',
            label: 'Plot de voiture',
        },
        {
            model: 'prop_worklight_01a_l1',
            label: 'Lampe de chantier 3',
        },
        {
            model: 'prop_worklight_02a',
            label: 'Lampe de chantier 4',
        },
        {
            model: 'prop_worklight_03a',
            label: 'Lampe de chantier 5',
        },
        {
            model: 'prop_worklight_03b',
            label: 'Lampe de chantier 6',
        },
        {
            model: 'prop_worklight_04b',
            label: 'Lampe de chantier 7',
        },
        {
            model: 'prop_worklight_04b_l1',
            label: 'Lampe de chantier 8',
        },
    ],
    ['Conteneurs et Caisses']: [
        {
            model: 'prop_container_01g',
            label: 'Grand Conteneur postal 1',
        },
        {
            model: 'prop_container_01h',
            label: 'Grand Conteneur postal 2',
        },
        {
            model: 'prop_container_01mb',
            label: 'Grand Conteneur 1',
        },
        {
            model: 'prop_container_01mb',
            label: 'Grand Conteneur ouvert 1',
        },
        {
            model: 'prop_container_03_ld',
            label: 'Petit Conteneur ouvert 1',
        },
        {
            model: 'prop_container_03a',
            label: 'Petit Conteneur 1',
        },
        {
            model: 'prop_container_03b',
            label: 'Petit Conteneur 2',
        },
        {
            model: 'prop_container_03mb',
            label: 'Petit Conteneur 3',
        },
        {
            model: 'prop_container_04mb',
            label: 'Petit Conteneur ouvert 2',
        },
        {
            model: 'prop_container_05a',
            label: 'Mini Conteneur 1',
        },
        {
            model: 'prop_container_05mb',
            label: 'Mini Conteneur 2',
        },
        {
            model: 'prop_skip_01a',
            label: 'Benne à ordures vide 1',
        },
        {
            model: 'prop_skip_02a',
            label: 'Benne à ordures pleine 1',
        },
        {
            model: 'prop_skip_03',
            label: 'Benne à ordures pleine 2',
        },
        {
            model: 'prop_skip_04',
            label: 'Benne à ordures pleine 3',
        },
        {
            model: 'prop_skip_05a',
            label: 'Benne à ordures pleine 4',
        },
        {
            model: 'prop_skip_05b',
            label: 'Benne à ordures vide 2',
        },
        {
            model: 'prop_skip_08a',
            label: 'Benne à ordures pleine 5',
        },
        {
            model: 'prop_skip_08b',
            label: 'Benne à ordures vide 3',
        },
        {
            model: 'sm_prop_smug_crate_l_antiques',
            label: 'Conteneur de contrebande 1',
        },
        {
            model: 'sm_prop_smug_crate_l_bones',
            label: 'Conteneur de contrebande 2',
        },
        {
            model: 'sm_prop_smug_crate_l_fake',
            label: 'Conteneur de contrebande 3',
        },
        {
            model: 'sm_prop_smug_crate_l_hazard',
            label: 'Conteneur de contrebande 4',
        },
        {
            model: 'sm_prop_smug_crate_l_jewellery',
            label: 'Conteneur de contrebande 5',
        },
        {
            model: 'sm_prop_smug_crate_l_medical',
            label: 'Conteneur de contrebande 6',
        },
        {
            model: 'sm_prop_smug_crate_l_narc',
            label: 'Conteneur de contrebande 7',
        },
        {
            model: 'sm_prop_smug_crate_l_tobacco',
            label: 'Conteneur de contrebande 8',
        },
        {
            model: 'sm_prop_smug_crate_m_antiques',
            label: 'Palette de contrebande 1',
        },
        {
            model: 'sm_prop_smug_crate_m_bones',
            label: 'Palette de contrebande 2',
        },
        {
            model: 'sm_prop_smug_crate_m_fake',
            label: 'Palette de contrebande 3',
        },
        {
            model: 'sm_prop_smug_crate_m_hazard',
            label: 'Palette de contrebande 4',
        },
        {
            model: 'sm_prop_smug_crate_m_jewellery',
            label: 'Palette de contrebande 5',
        },
        {
            model: 'sm_prop_smug_crate_m_medical',
            label: 'Palette de contrebande 6',
        },
        {
            model: 'sm_prop_smug_crate_m_narc',
            label: 'Palette de contrebande 7',
        },
        {
            model: 'sm_prop_smug_crate_m_tobacco',
            label: 'Palette de contrebande 8',
        },
        {
            model: 'sm_prop_smug_crate_s_antiques',
            label: 'Caisse de contrebande 1',
        },
        {
            model: 'sm_prop_smug_crate_s_bones',
            label: 'Caisse de contrebande 2',
        },
        {
            model: 'sm_prop_smug_crate_s_fake',
            label: 'Caisse de contrebande 3',
        },
        {
            model: 'sm_prop_smug_crate_s_hazard',
            label: 'Caisse de contrebande 4',
        },
        {
            model: 'sm_prop_smug_crate_s_jewellery',
            label: 'Caisse de contrebande 5',
        },
        {
            model: 'sm_prop_smug_crate_s_medical',
            label: 'Caisse de contrebande 6',
        },
        {
            model: 'sm_prop_smug_crate_s_narc',
            label: 'Caisse de contrebande 7',
        },
        {
            model: 'sm_prop_smug_crate_s_tobacco',
            label: 'Caisse de contrebande 8',
        },
        {
            model: 'prop_box_wood01a',
            label: 'Caisse en bois 1',
        },
        {
            model: 'prop_box_wood02a_mws',
            label: 'Caisse en bois 2',
        },
        {
            model: 'prop_box_wood02a_pu',
            label: 'Caisse en bois 3',
        },
        {
            model: 'prop_box_wood03a',
            label: 'Caisse en bois 4',
        },
        {
            model: 'prop_box_wood04a',
            label: 'Caisse en bois 5',
        },
        {
            model: 'prop_box_wood05a',
            label: 'Caisse en bois 6',
        },
        {
            model: 'prop_box_wood06a',
            label: 'Caisse en bois 7',
        },
        {
            model: 'prop_box_wood07a',
            label: 'Caisse en bois 8',
        },
        {
            model: 'prop_box_wood08a',
            label: 'Caisse en bois 9',
        },
        {
            model: 'prop_boxpile_01a',
            label: 'Pile de cartons 1',
        },
        {
            model: 'prop_boxpile_02b',
            label: 'Pile de cartons 2',
        },
        {
            model: 'prop_boxpile_02c',
            label: 'Pile de cartons 3',
        },
        {
            model: 'prop_boxpile_02d',
            label: 'Pile de cartons 4',
        },
        {
            model: 'prop_boxpile_03a',
            label: 'Pile de cartons 5',
        },
        {
            model: 'prop_boxpile_04a',
            label: 'Pile de cartons 6',
        },
        {
            model: 'prop_boxpile_05a',
            label: 'Pile de cartons 7',
        },
        {
            model: 'prop_boxpile_08a',
            label: 'Pile de cartons 8',
        },
        {
            model: 'prop_boxpile_09a',
            label: 'Palette de cartons 1',
        },
        {
            model: 'prop_boxpile_10a',
            label: 'Palette de cartons 2',
        },
        {
            model: 'prop_boxpile_10b',
            label: 'Palette de cartons 3',
        },
        {
            model: 'prop_mb_cargo_01a',
            label: 'Caisse Cargo 1',
        },
        {
            model: 'prop_mb_cargo_02a',
            label: 'Caisse Cargo 2',
        },
        {
            model: 'prop_mb_cargo_03a',
            label: 'Caisse Cargo 3',
        },
        {
            model: 'prop_mb_cargo_04a',
            label: 'Caisse Cargo 4',
        },
        {
            model: 'prop_mb_cargo_04b',
            label: 'Caisse Cargo 5',
        },
        {
            model: 'ex_prop_crate_ammo_bc',
            label: 'Caisse de marchandises 1',
        },
        {
            model: 'ex_prop_crate_ammo_sc',
            label: 'Caisse de marchandises 2',
        },
        {
            model: 'ex_prop_crate_art_02_bc',
            label: 'Caisse de marchandises 3',
        },
        {
            model: 'ex_prop_crate_art_02_sc',
            label: 'Caisse de marchandises 4',
        },
        {
            model: 'ex_prop_crate_art_bc',
            label: 'Caisse de marchandises 5',
        },
        {
            model: 'ex_prop_crate_art_sc',
            label: 'Caisse de marchandises 6',
        },
        {
            model: 'ex_prop_crate_biohazard_bc',
            label: 'Caisse de déchets radioactifs 1',
        },
        {
            model: 'ex_prop_crate_biohazard_sc',
            label: 'Caisse de déchets radioactifs 2',
        },
        {
            model: 'ex_prop_crate_closed_ms',
            label: 'Caisse médicale fermée',
        },
        {
            model: 'ex_prop_crate_clothing_bc',
            label: 'Caisse de vêtements 1',
        },
        {
            model: 'ex_prop_crate_clothing_sc',
            label: 'Caisse de vêtements 2',
        },
        {
            model: 'ex_prop_crate_elec_bc',
            label: "Caisse d'électronique 1",
        },
        {
            model: 'ex_prop_crate_elec_sc',
            label: "Caisse d'électronique 2",
        },
        {
            model: 'ex_prop_crate_furjacket_bc',
            label: 'Caisse de fourrures 1',
        },
        {
            model: 'ex_prop_crate_furjacket_sc',
            label: 'Caisse de fourrures 2',
        },
        {
            model: 'ex_prop_crate_gems_bc',
            label: 'Caisse de pierres précieuses 1',
        },
        {
            model: 'ex_prop_crate_gems_sc',
            label: 'Caisse de pierres précieuses 2',
        },
        {
            model: 'ex_prop_crate_highend_pharma_bc',
            label: 'Caisse de médicaments 1',
        },
        {
            model: 'ex_prop_crate_highend_pharma_sc',
            label: 'Caisse de médicaments 2',
        },
        {
            model: 'ex_prop_crate_jewels_bc',
            label: 'Caisse de bijoux 1',
        },
        {
            model: 'ex_prop_crate_jewels_racks_bc',
            label: 'Caisse de bijoux 2',
        },
        {
            model: 'ex_prop_crate_jewels_racks_sc',
            label: 'Caisse de bijoux 3',
        },
        {
            model: 'ex_prop_crate_med_bc',
            label: 'Caisse de médicaments 3',
        },
        {
            model: 'ex_prop_crate_med_sc',
            label: 'Caisse de médicaments 4',
        },
        {
            model: 'ex_prop_crate_money_bc',
            label: 'Caisse de billets 1',
        },
        {
            model: 'ex_prop_crate_money_sc',
            label: 'Caisse de billets 2',
        },
        {
            model: 'ex_prop_crate_narc_bc',
            label: 'Caisse de drogues 1',
        },
        {
            model: 'ex_prop_crate_narc_sc',
            label: 'Caisse de drogues 2',
        },
        {
            model: 'ex_prop_crate_tob_bc',
            label: 'Caisse de tabac 1',
        },
        {
            model: 'ex_prop_crate_tob_sc',
            label: 'Caisse de tabac 2',
        },
        {
            model: 'sm_prop_smug_crate_m_antiques',
            label: 'Caisse d’antiquités',
        },
        {
            model: 'ex_office_swag_pills3',
            label: 'Caisse de médicaments 5',
        },
        {
            model: 'ex_office_swag_pills4',
            label: 'Caisse de médicaments 6',
        },
    ],
    ['Outils']: [
        {
            model: 'prop_tool_adjspanner',
            label: 'Clé à molette',
            collision: false,
        },
        {
            model: 'prop_tool_consaw',
            label: 'Scie circulaire',
            collision: false,
        },
        {
            model: 'prop_tool_drill',
            label: 'Perceuse',
            collision: false,
        },
        {
            model: 'prop_tool_hammer',
            label: 'Marteau',
            collision: false,
        },
        {
            model: 'prop_tool_hardhat',
            label: 'Casque de chantier',
            collision: false,
        },
        {
            model: 'prop_tool_jackham',
            label: 'Marteau piqueur',
            collision: false,
        },
        {
            model: 'prop_tool_mallet',
            label: 'Maillet',
            collision: false,
        },
        {
            model: 'prop_tool_nailgun',
            label: 'Cloueuse',
            collision: false,
        },
        {
            model: 'prop_tool_pickaxe',
            label: 'Pioche',
            collision: false,
        },
        {
            model: 'prop_tool_pliers',
            label: 'Pince',
            collision: false,
        },
        {
            model: 'prop_tool_rake',
            label: 'Râteau',
            collision: false,
        },
        {
            model: 'prop_tool_screwdvr01',
            label: 'Tournevis 1',
            collision: false,
        },
        {
            model: 'prop_tool_screwdvr02',
            label: 'Tournevis 2',
            collision: false,
        },
        {
            model: 'prop_tool_shovel',
            label: 'Pelle',
            collision: false,
        },
        {
            model: 'prop_tool_shovel006',
            label: 'Pelle 2',
            collision: false,
        },
        {
            model: 'prop_tool_shovel2',
            label: 'Pelle 3',
            collision: false,
        },
        {
            model: 'prop_tool_shovel3',
            label: 'Pelle 4',
            collision: false,
        },
        {
            model: 'prop_tool_shovel4',
            label: 'Pelle 5',
            collision: false,
        },
        {
            model: 'prop_tool_shovel5',
            label: 'Pelle 6',
            collision: false,
        },
        {
            model: 'prop_tool_sledgeham',
            label: 'Masse',
            collision: false,
        },
        {
            model: 'prop_tool_spanner01',
            label: 'Clé plate 1',
            collision: false,
        },
        {
            model: 'prop_tool_spanner02',
            label: 'Clé plate 2',
            collision: false,
        },
        {
            model: 'prop_wheelbarrow01a',
            label: 'Brouette 1',
        },
        {
            model: 'prop_wheelbarrow02a',
            label: 'Brouette 2',
        },
        {
            model: 'prop_ld_fireaxe',
            label: 'Hache de pompier',
            collision: false,
        },
        {
            model: 'prop_megaphone_01',
            label: 'Mégaphone',
            collision: false,
        },
        {
            model: 'prop_microphone_02',
            label: 'Microphone',
            collision: false,
        },
        {
            model: 'prop_squeegee',
            label: 'Raclette',
            collision: false,
        },
        {
            model: 'prop_w_me_hatchet',
            label: 'Hache',
            collision: false,
        },
        {
            model: 'p_cs_cuffs_02_s',
            label: 'Menottes',
            collision: false,
        },
        {
            model: 'prop_lawnmower_01',
            label: 'Tondeuse',
        },
        {
            model: 'prop_shrub_rake',
            label: 'Râteau à feuilles',
            collision: false,
        },
        {
            model: 'prop_paint_brush01',
            label: 'Pinceau à peinture 1',
            collision: false,
        },
        {
            model: 'prop_paint_brush04',
            label: 'Pinceau à peinture 2',
            collision: false,
        },
        {
            model: 'prop_paint_roller',
            label: 'Rouleau à peinture',
            collision: false,
        },
        {
            model: 'prop_paint_spray01a',
            label: 'Bombe de peinture 1',
            collision: false,
        },
        {
            model: 'prop_paint_spray01b',
            label: 'Bombe de peinture 2',
            collision: false,
        },
        {
            model: 'prop_tool_torch',
            label: 'Lampe torche 3',
            collision: false,
        },
        {
            model: 'prop_cs_sheers',
            label: 'Ciseaux de jardin',
            collision: false,
        },
        {
            model: 'prop_tool_broom',
            label: 'Balai',
            collision: false,
        },
    ],
    ['Route et panneaux']: [
        {
            model: 'prop_consign_01a',
            label: 'Panneau de chantier 1',
        },
        {
            model: 'prop_roadcone01a',
            label: 'Cône de chantier 1',
        },
        {
            model: 'prop_roadpole_01a',
            label: 'Poteau de chantier 1',
        },
    ],
    ['Cuisine']: [
        {
            model: 'prop_cs_fork',
            label: 'Fourchette',
            collision: false,
        },
        {
            model: 'xm3_prop_xm3_coke_spoon_01a',
            label: 'Cuillère',
            collision: false,
        },
        {
            model: 'prop_sh_tall_glass',
            label: 'Verre grand 1',
            collision: false,
        },
        {
            model: 'prop_glass_stack_01',
            label: 'Ensemble de verres 1',
            collision: false,
        },
        {
            model: 'prop_glass_stack_03',
            label: 'Ensemble de verres 2',
            collision: false,
        },
        {
            model: 'prop_glass_stack_04',
            label: 'Ensemble de verres 3',
            collision: false,
        },
        {
            model: 'prop_glass_stack_05',
            label: 'Ensemble de verres 4',
            collision: false,
        },
        {
            model: 'prop_glass_stack_06',
            label: 'Ensemble de verres 5',
            collision: false,
        },
        {
            model: 'prop_glass_stack_07',
            label: 'Ensemble de verres 6',
            collision: false,
        },
        {
            model: 'prop_glass_stack_08',
            label: 'Ensemble de verres 7',
            collision: false,
        },
        {
            model: 'prop_glass_stack_09',
            label: 'Ensemble de verres 8',
            collision: false,
        },
        {
            model: 'prop_glass_stack_10',
            label: 'Ensemble de verres 9',
            collision: false,
        },
        {
            model: 'apa_mp_h_acc_bowl_ceramic_01',
            label: 'Bol en céramique 1',
        },
        {
            model: 'apa_mp_h_acc_drink_tray_02',
            label: 'Plateau de boissons 1',
        },
        {
            model: 'bkr_prop_coke_cracktray_01',
            label: 'Grand Plateau 1',
        },
        {
            model: 'prop_scourer_01',
            label: 'Éponge',
            collision: false,
        },
        {
            model: 'prop_kettle',
            label: 'Bouilloire 1',
        },
        {
            model: 'prop_kettle_01',
            label: 'Bouilloire 2',
        },
        {
            model: 'prop_kitch_juicer',
            label: 'Presse-agrumes',
        },
        {
            model: 'prop_kitch_pot_fry',
            label: 'Poêle',
        },
        {
            model: 'prop_kitch_pot_huge',
            label: 'Marmite 1',
        },
        {
            model: 'prop_kitch_pot_lrg',
            label: 'Casserole pleine',
        },
        {
            model: 'prop_kitch_pot_med',
            label: 'Casserole',
        },
        {
            model: 'prop_knife',
            label: 'Couteau de cuisine',
            collision: false,
        },
        {
            model: 'prop_ladel',
            label: 'Louche',
            collision: false,
        },
        {
            model: 'v_ilev_m_pitcher',
            label: 'Pichet',
        },
        {
            model: 'v_ilev_mm_faucet',
            label: 'Robinet 1',
        },
        {
            model: 'prop_coffee_mac_01',
            label: 'Machine à café 1',
        },
        {
            model: 'prop_coffee_mac_02',
            label: 'Machine à café 2',
        },
        {
            model: 'prop_juice_dispenser',
            label: 'Distributeur de jus',
        },
        {
            model: 'prop_fish_slice_01',
            label: 'Spatule',
            collision: false,
        },
        {
            model: 'prop_cleaver',
            label: 'Couteau de boucher',
            collision: false,
        },
        {
            model: 'prop_pot_05',
            label: 'Poêle 1',
        },
        {
            model: 'prop_whisk',
            label: 'Fouet',
            collision: false,
        },
        {
            model: 'prop_wok',
            label: 'Wok',
        },
        {
            model: 'v_res_mbowl',
            label: 'Bol en céramique 2',
        },
        {
            model: 'v_res_mcofcup',
            label: 'Tasse de café',
        },
        {
            model: 'v_res_tt_bowlpile02',
            label: 'Pile de bols',
        },
        {
            model: 'v_res_tt_platepile',
            label: "Pile d'assiettes",
        },
        {
            model: 'v_ret_fh_plate1',
            label: 'Assiette 1',
        },
        {
            model: 'v_ret_fh_plate2',
            label: 'Assiette 2',
        },
        {
            model: 'v_ret_fh_plate3',
            label: 'Assiette 3',
        },
        {
            model: 'v_ret_fh_plate4',
            label: 'Assiette 4',
        },
        {
            model: 'v_ret_ta_paproll',
            label: 'Sopalain',
        },
    ],
    ['Electroménager']: [
        {
            model: 'apa_mp_h_acc_coffeemachine_01',
            label: 'Machine à café 1',
        },
        {
            model: 'bkr_prop_biker_ceiling_fan_base',
            label: 'Ventilateur de plafond',
        },
        {
            model: 'bkr_prop_coke_scale_01',
            label: 'Balance de cuisine',
        },
        {
            model: 'bkr_prop_fakeid_deskfan_01a',
            label: 'Ventilateur de bureau',
        },
        {
            model: 'prop_fax_01',
            label: 'Fax',
        },
        {
            model: 'prop_iron_01',
            label: 'Fer à repasser',
        },
        {
            model: 'prop_fire_exting_1a',
            label: 'Extincteur',
        },
        {
            model: 'prop_cs_fridge',
            label: 'Réfrigérateur 1',
        },
        {
            model: 'prop_cs_ice_locker',
            label: 'Bac à glaçons',
        },
        {
            model: 'prop_cs_toaster',
            label: 'Grille-pain',
        },
        {
            model: 'prop_sewing_machine',
            label: 'Machine à coudre',
        },
        {
            model: 'prop_trailr_fridge',
            label: 'Réfrigérateur 2',
        },
        {
            model: 'prop_foodprocess_01',
            label: 'Robot de cuisine',
        },
        {
            model: 'prop_fridge_01',
            label: 'Réfrigérateur 3',
        },
        {
            model: 'prop_fridge_03',
            label: 'Réfrigérateur 4',
        },
        {
            model: 'prop_micro_01',
            label: 'Micro-ondes 1',
        },
        {
            model: 'prop_micro_02',
            label: 'Micro-ondes 2',
        },
        {
            model: 'prop_micro_04',
            label: 'Micro-ondes 3',
        },
        {
            model: 'prop_micro_cs_01',
            label: 'Micro-ondes 4',
        },
        {
            model: 'prop_toaster_01',
            label: 'Grille-pain 2',
        },
        {
            model: 'v_ret_fh_dryer',
            label: 'Sèche-linge',
        },
        {
            model: 'v_ret_fh_washmach',
            label: 'Machine à laver',
        },
    ],
    ['Nourritures et Boissons']: [
        {
            model: 'prop_amb_donut',
            label: 'Donut',
        },
        {
            model: 'prop_taco_01',
            label: 'Taco 1',
            collision: false,
        },
        {
            model: 'beerrow_local',
            label: 'Bières locales en vrac',
        },
        {
            model: 'beerrow_world',
            label: 'Bières du monde en vrac',
        },
        {
            model: 'apa_mp_h_acc_fruitbowl_01',
            label: 'Plateau de fruits 1',
        },
        {
            model: 'apa_mp_h_acc_fruitbowl_02',
            label: 'Plateau de fruits 2',
        },
        {
            model: 'bkr_prop_coke_bakingsoda',
            label: 'Bicarbonate de soude',
        },
        {
            model: 'bkr_prop_coke_powderedmilk',
            label: 'Lait en poudre',
        },
        {
            model: 'prop_ff_noodle_01',
            label: 'Boite de Nouilles 1',
        },
        {
            model: 'prop_food_bag1',
            label: 'Sac de nourriture 1',
        },
        {
            model: 'prop_food_bs_bag_01',
            label: 'Sac de nourriture 2',
        },
        {
            model: 'prop_food_bs_bag_04',
            label: 'Sac de nourriture 3',
        },
        {
            model: 'prop_food_bs_burg1',
            label: 'Burger 1',
        },
        {
            model: 'prop_food_bs_burg3',
            label: 'Burger 2',
        },
        {
            model: 'prop_food_bs_burger2',
            label: 'Panini 1',
        },
        {
            model: 'prop_food_bs_chips',
            label: 'Frites 1',
        },
        {
            model: 'prop_food_bs_coffee',
            label: 'Café 1',
        },
        {
            model: 'prop_food_bs_cups01',
            label: 'Pile de gobelets 1',
        },
        {
            model: 'prop_food_bs_cups02',
            label: 'Pile de gobelets 2',
        },
        {
            model: 'prop_food_bs_cups03',
            label: 'Pile de gobelets 3',
        },
        {
            model: 'prop_food_bs_juice01',
            label: 'Jus de fruit 1',
        },
        {
            model: 'prop_food_bs_juice02',
            label: 'Jus de fruit 2',
        },
        {
            model: 'prop_food_bs_tray_01',
            label: 'Plateau de nourriture 1',
        },
        {
            model: 'prop_food_bs_tray_02',
            label: 'Plateau de nourriture 2',
        },
        {
            model: 'prop_food_bs_tray_03',
            label: 'Plateau de nourriture 3',
        },
        {
            model: 'prop_food_bs_tray_06',
            label: 'Plateau de nourriture 4',
        },
        {
            model: 'prop_food_burg3',
            label: 'Burger 3',
        },
        {
            model: 'prop_food_cb_burg02',
            label: 'Burger 4',
        },
        {
            model: 'prop_food_cb_chips',
            label: 'Frites 2',
        },
        {
            model: 'prop_food_cb_coffee',
            label: 'Café 2',
        },
        {
            model: 'prop_food_cb_cups01',
            label: 'Pile de gobelets 4',
        },
        {
            model: 'prop_food_cb_cups02',
            label: 'Pile de gobelets 5',
        },
        {
            model: 'prop_food_cb_cups04',
            label: 'Pile de gobelets 6',
        },
        {
            model: 'prop_food_cb_tray_01',
            label: 'Plateau de nourriture 5',
        },
        {
            model: 'prop_food_cb_tray_02',
            label: 'Plateau de nourriture 6',
        },
        {
            model: 'prop_food_cb_tray_03',
            label: 'Plateau de nourriture 7',
        },
        {
            model: 'prop_food_ketchup',
            label: 'Ketchup',
        },
        {
            model: 'prop_food_mustard',
            label: 'Moutarde',
        },
        {
            model: 'prop_food_sugarjar',
            label: 'Pot de sucre',
        },
        {
            model: 'prop_food_napkin_01',
            label: 'Serviette 1',
        },
        {
            model: 'prop_food_tray_01',
            label: 'Plateau de nourriture 8',
        },
        {
            model: 'prop_food_tray_02',
            label: 'Plateau de nourriture 9',
        },
        {
            model: 'prop_food_tray_03',
            label: 'Plateau de nourriture 10',
        },
        {
            model: 'prop_fib_coffee',
            label: 'Café 3',
            collision: false,
        },
        {
            model: 'prop_ld_can_01',
            label: 'Canette de soda 1',
            collision: false,
        },
        {
            model: 'prop_ld_flow_bottle',
            label: "Bouteille d'eau 1",
            collision: false,
        },
        {
            model: 'prop_peanut_bowl_01',
            label: 'Bol de cacahuètes',
            collision: false,
        },
        {
            model: 'prop_sandwich_01',
            label: 'Sandwich 1',
            collision: false,
        },
        {
            model: 'v_ret_247_bread1',
            label: 'Pain de mie',
            collision: false,
        },
        {
            model: 'v_ret_247_cereal1',
            label: 'Céréales 1',
            collision: false,
        },
        {
            model: 'v_ret_247_choptom',
            label: 'Tomates',
            collision: false,
        },
        {
            model: 'v_ret_247_eggs',
            label: 'Oeufs',
            collision: false,
        },
        {
            model: 'v_ret_247_flour',
            label: 'Farine',
            collision: false,
        },
        {
            model: 'v_ret_247_ketchup2',
            label: 'Ketchup 2',
            collision: false,
        },
        {
            model: 'v_ret_247_popbot4',
            label: 'Bouteille de soda 2',
            collision: false,
        },
        {
            model: 'v_ret_247_swtcorn2',
            label: 'Maïs',
            collision: false,
        },
        {
            model: 'v_ret_ml_beeram',
            label: 'Pack de bière 1',
        },
        {
            model: 'v_ret_ml_beerbar',
            label: 'Pack de bière 2',
        },
        {
            model: 'v_ret_ml_beerben1',
            label: 'Pack de bière 3',
        },
        {
            model: 'v_ret_ml_beerben2',
            label: 'Pack de bière 4',
        },
        {
            model: 'v_ret_ml_beerbla1',
            label: 'Pack de bière 5',
        },
        {
            model: 'v_ret_ml_beerdus',
            label: 'Pack de bière 6',
        },
        {
            model: 'v_ret_ml_beerjak1',
            label: 'Pack de bière 7',
        },
        {
            model: 'v_ret_ml_beerlog1',
            label: 'Pack de bière 8',
        },
        {
            model: 'v_ret_ml_beerpis1',
            label: 'Pack de bière 9',
        },
        {
            model: 'prop_beer_box_01',
            label: 'Pack de bière en canettes 1',
        },
        {
            model: 'v_ret_ml_chips1',
            label: 'Chips 1',
            collision: false,
        },
        {
            model: 'v_ret_ml_chips2',
            label: 'Chips 2',
            collision: false,
        },
        {
            model: 'v_ret_ml_chips3',
            label: 'Chips 3',
            collision: false,
        },
        {
            model: 'v_ret_ml_chips4',
            label: 'Chips 4',
            collision: false,
        },
        {
            model: 'v_ret_ml_cigs',
            label: 'Paquet de cigarettes 1',
            collision: false,
        },
        {
            model: 'v_ret_ml_cigs2',
            label: 'Paquet de cigarettes 2',
            collision: false,
        },
        {
            model: 'v_ret_ml_cigs3',
            label: 'Paquet de cigarettes 3',
            collision: false,
        },
        {
            model: 'v_ret_ml_cigs4',
            label: 'Paquet de cigarettes 4',
            collision: false,
        },
        {
            model: 'v_ret_ml_cigs5',
            label: 'Paquet de cigarettes 5',
            collision: false,
        },
        {
            model: 'v_ret_ml_cigs6',
            label: 'Paquet de cigarettes 6',
            collision: false,
        },
        {
            model: 'prop_bowl_crisps',
            label: 'Bol de chips',
            collision: false,
        },
        {
            model: 'prop_cs_burger_01',
            label: 'Hamburger',
        },
        {
            model: 'prop_cs_hotdog_01',
            label: 'Hotdog',
        },
        {
            model: 'prop_cs_steak',
            label: 'Steak',
        },
        {
            model: 'prop_energy_drink',
            label: 'Boisson énergisante',
            collision: false,
        },
        {
            model: 'prop_pineapple',
            label: 'Ananas',
            collision: false,
        },
        {
            model: 'p_weed_bottle_s',
            label: 'Bocal de Zeed',
            collision: false,
        },
        {
            model: 'ng_proc_food_nana1a',
            label: 'Banane',
            collision: false,
        },
        {
            model: 'prop_pizza_box_01',
            label: 'Boîte de pizza 1',
            collision: false,
        },
        {
            model: 'prop_pizza_box_02',
            label: 'Boîte de pizza 2',
            collision: false,
        },
        {
            model: 'prop_pizza_box_03',
            label: 'Boîte de pizza 3',
            collision: false,
        },
    ],
    ['Bureautique']: [
        {
            model: 'prop_cs_binder_01',
            label: 'Classeur 1',
            collision: false,
        },
        {
            model: 'apa_mp_h_acc_phone_01',
            label: 'Téléphone 1',
            collision: false,
        },
        {
            model: 'bkr_prop_fakeid_pen_01a',
            label: 'Stylo 1',
            collision: false,
        },
        {
            model: 'bkr_prop_fakeid_pen_02a',
            label: 'Stylo 2',
            collision: false,
        },
        {
            model: 'ex_prop_ex_laptop_01a',
            label: 'Ordinateur portable 1',
        },
        {
            model: 'prop_fib_clipboard',
            label: 'Presse-papier 1',
        },
        {
            model: 'prop_ld_lap_top',
            label: 'Ordinateur portable 2',
        },
        {
            model: 'prop_paper_ball',
            label: 'Boule de papier 1',
            collision: false,
        },
        {
            model: 'prop_ld_scrap',
            label: 'Papier froissé 1',
            collision: false,
        },
        {
            model: 'prop_notepad_02',
            label: 'Bloc-notes 1',
            collision: false,
        },
        {
            model: 'prop_pencil_01',
            label: 'Crayon 1',
            collision: false,
        },
        {
            model: 'prop_keyboard_01a',
            label: 'Clavier 1',
            collision: false,
        },
        {
            model: 'prop_keyboard_01b',
            label: 'Clavier 2',
            collision: false,
        },
        {
            model: 'prop_laptop_01a',
            label: 'Ordinateur portable 3',
        },
        {
            model: 'prop_laptop_02_closed',
            label: 'Ordinateur portable 4',
        },
        {
            model: 'v_serv_ct_monitor01',
            label: "Écran d'ordinateur 1",
        },
        {
            model: 'v_serv_ct_monitor07',
            label: "Écran d'ordinateur 2",
        },
        {
            model: 'prop_office_phone_tnt',
            label: 'Téléphone 2',
        },
        {
            model: 'prop_printer_01',
            label: 'Imprimante 1',
        },
        {
            model: 'prop_printer_02',
            label: 'Imprimante 2',
        },
        {
            model: 'prop_watercooler',
            label: 'Fontaine à eau',
        },
        {
            model: 'v_res_cdstorage',
            label: 'Boîte de CD',
        },
        {
            model: 'v_res_desktidy',
            label: 'Fournitures de bureau 1',
        },
        {
            model: 'v_res_paperfolders',
            label: 'Fournitures de bureau 2',
        },
        {
            model: 'v_ret_gc_folder1',
            label: 'Classeur 2',
            collision: false,
        },
        {
            model: 'v_ret_gc_folder2',
            label: 'Classeur 3',
            collision: false,
        },
        {
            model: 'v_ret_gc_trays',
            label: 'Bac à courrier',
            collision: false,
        },
        {
            model: 'prop_cs_scissors',
            label: 'Ciseaux',
            collision: false,
        },
        {
            model: 'prop_cs_tablet',
            label: 'Tablette',
            collision: false,
        },
        {
            model: 'prop_cd_folder_pile2',
            label: 'Pile de classeurs 1',
            collision: false,
        },
        {
            model: 'prop_cd_folder_pile3',
            label: 'Pile de classeurs 2',
            collision: false,
        },
        {
            model: 'prop_cd_paper_pile1',
            label: 'Pile de papier au mur 1',
        },
        {
            model: 'prop_cd_paper_pile3',
            label: 'Pile de papier au mur 2',
        },
        {
            model: 'prop_dyn_pc',
            label: "Tour d'ordinateur 1",
            collision: false,
        },
        {
            model: 'prop_cs_mouse_01',
            label: 'Souris',
            collision: false,
        },
        {
            model: 'prop_elec_heater_01',
            label: 'Chauffage éléctrique',
        },
        {
            model: 'prop_pc_02a',
            label: "Tour d'ordinateur 2",
            collision: false,
        },
        {
            model: 'hei_prop_hst_usb_drive',
            label: 'Clé USB',
            collision: false,
        },
    ],
    ['Télévisions']: [
        {
            model: 'ex_prop_ex_tv_flat_01',
            label: 'Télévision 1',
        },
        {
            model: 'ex_prop_tv_settop_box',
            label: 'Décodeur 1',
        },
        {
            model: 'ex_prop_tv_settop_remote',
            label: 'Télécommande 1',
        },
        {
            model: 'v_ilev_acet_projector',
            label: 'Projecteur 1',
        },
        {
            model: 'v_ilev_cin_screen',
            label: 'Écran incurvé',
        },
        {
            model: 'v_ilev_lest_bigscreen',
            label: 'Écran dépliant',
        },
        {
            model: 'des_tvsmash_start',
            label: 'Télévision 2',
        },
        {
            model: 'prop_cctv_01_sm_02',
            label: 'Moniteur de surveillance 1',
        },
        {
            model: 'prop_cctv_cont_02',
            label: 'Moniteur de surveillance 2',
        },
        {
            model: 'prop_crt_mon_01',
            label: 'Télévision 3',
        },
        {
            model: 'prop_cs_tv_stand',
            label: 'Télévision avec support',
        },
        {
            model: 'prop_monitor_03b',
            label: 'Télévision 4',
        },
        {
            model: 'prop_trev_tv_01',
            label: 'Télévision 5',
        },
        {
            model: 'prop_tv_01',
            label: 'Télévision 6',
        },
        {
            model: 'prop_tv_03',
            label: 'Télévision 7',
        },
        {
            model: 'prop_tv_04',
            label: 'Télévision 8',
        },
        {
            model: 'prop_tv_06',
            label: 'Télévision 9',
        },
        {
            model: 'prop_tv_flat_01',
            label: 'Ecran plat 1',
        },
        {
            model: 'prop_tv_flat_02',
            label: 'Ecran plat 2',
        },
        {
            model: 'prop_tv_flat_03',
            label: 'Ecran plat 3',
        },
        {
            model: 'apa_mp_h_str_avunitl_04',
            label: 'Meuble TV 1',
        },
        {
            model: 'apa_mp_h_str_avunitm_01',
            label: 'Meuble TV 2',
        },
        {
            model: 'apa_mp_h_str_avunitm_03',
            label: 'Meuble TV 3',
        },
        {
            model: 'apa_mp_h_str_avunits_01',
            label: 'Meuble TV 4',
        },
        {
            model: 'apa_mp_h_str_avunits_04',
            label: 'Meuble TV 5',
        },
        {
            model: 'prop_console_01',
            label: 'Console de jeux',
        },
    ],
    ['Lumières & Eclairages']: [
        {
            model: 'bkr_prop_fakeid_desklamp_01a',
            label: 'Lampe de bureau 1',
        },
        {
            model: 'v_ilev_fh_lampa_on',
            label: 'Lampe de salon 1',
        },
        {
            model: 'vw_prop_casino_art_lampf_01a',
            label: 'Lampe de casino 1',
        },
        {
            model: 'vw_prop_casino_art_lampf_01b',
            label: 'Lampe de casino 2',
        },
        {
            model: 'v_corp_bk_lamp1',
            label: 'Lampe de salon ancienne 1',
        },
        {
            model: 'v_corp_bk_lamp2',
            label: 'Lampe de salon 2',
        },
        {
            model: 'v_ind_cf_bugzap',
            label: 'Lampe anti-moustique',
        },
        {
            model: 'v_res_fa_lamp1on',
            label: 'Lampe de chevet 1',
        },
        {
            model: 'v_res_fh_floorlamp',
            label: 'Lampe à bras 1',
        },
        {
            model: 'v_res_m_lampstand2',
            label: 'Lampe à pied 1',
        },
        {
            model: 'v_ret_gc_lamp',
            label: 'Lampe de bureau 2',
        },
        {
            model: 'v_ret_neon_blarneys',
            label: 'Enseigne lumineuse 1',
        },
        {
            model: 'v_ret_neon_logger',
            label: 'Enseigne lumineuse 2',
        },
        {
            model: 'v_serv_ct_lamp',
            label: 'Lampe de bureau 3',
        },
        {
            model: 'prop_cd_lamp',
            label: 'Lampe de bureau 4',
        },
        {
            model: 'prop_garden_zapper_01',
            label: 'Lampe anti-moustique 2',
        },
        {
            model: 'prop_patio_heater_01',
            label: 'Chauffage extérieur',
        },
        {
            model: 'v_19_vanillasigneon2',
            label: 'Enseigne lumineuse 3',
        },
        {
            model: 'v_61_bd1_mesh_lamp',
            label: 'Lampe de salon 3',
        },
        {
            model: 'v_61_hall_mesh_sidestuff',
            label: 'Lampe de salon 4',
        },
        {
            model: 'v_club_vu_lamp',
            label: 'Lampe de chevet 2',
        },
        {
            model: 'v_med_examlight_static',
            label: 'Lampe médicale',
        },
        {
            model: 'prop_barebulb_01',
            label: 'Ampoule nue',
        },
        {
            model: 'prop_chall_lamp_01n',
            label: 'Chandelier moderne',
        },
        {
            model: 'prop_oldlight_01a',
            label: 'Lampadaire ancien',
        },
        {
            model: 'prop_oldlight_01b',
            label: 'Lampe ancienne de mur',
        },
        {
            model: 'prop_oldlight_01c',
            label: 'Lampe ancienne de plafond',
        },
        {
            model: 'prop_streetlight_01',
            label: 'Lampadaire de rue 1',
        },
        {
            model: 'prop_streetlight_01b',
            label: 'Lampadaire de rue 2',
        },
        {
            model: 'prop_streetlight_02',
            label: 'Lampadaire de rue 3',
        },
        {
            model: 'prop_streetlight_03',
            label: 'Lampadaire de rue 4',
        },
        {
            model: 'prop_streetlight_03b',
            label: 'Lampadaire de rue 5',
        },
        {
            model: 'prop_streetlight_03c',
            label: 'Lampadaire de rue 6',
        },
        {
            model: 'prop_streetlight_03d',
            label: 'Lampadaire double de rue 1',
        },
        {
            model: 'prop_streetlight_04',
            label: 'Lampadaire double de rue 2',
        },
        {
            model: 'prop_streetlight_05',
            label: 'Lampadaire double de rue 3',
        },
        {
            model: 'prop_streetlight_05_b',
            label: 'Lampadaire double de rue 4',
        },
        {
            model: 'prop_streetlight_06',
            label: 'Lampadaire double de rue 5',
        },
        {
            model: 'prop_streetlight_07a',
            label: 'Lampadaire rue 7',
        },
        {
            model: 'prop_streetlight_07b',
            label: 'Lampadaire double de rue 6',
        },
        {
            model: 'prop_streetlight_08',
            label: 'Lampadaire de rue 8',
        },
        {
            model: 'prop_streetlight_09',
            label: 'Lampadaire de rue 9',
        },
        {
            model: 'prop_streetlight_10',
            label: 'Lampadaire double de rue 7',
        },
        {
            model: 'prop_streetlight_11a',
            label: 'Lampadaire de rue 10',
        },
        {
            model: 'prop_streetlight_16a',
            label: 'Lampadaire double de rue 8',
        },
        {
            model: 'prop_wall_light_01a',
            label: 'Lampe de mur 1',
        },
        {
            model: 'prop_wall_light_02a',
            label: 'Lampe de mur 2',
        },
        {
            model: 'prop_wall_light_03a',
            label: 'Lampe de mur 3',
        },
        {
            model: 'prop_wall_light_07a',
            label: 'Lampe de mur 4',
        },
        {
            model: 'prop_wall_light_08a',
            label: 'Lampe de mur 5',
        },
        {
            model: 'prop_wall_light_09a',
            label: 'Lampe de mur 6',
        },
        {
            model: 'prop_wall_light_09c',
            label: 'Lampe de mur 7',
        },
        {
            model: 'prop_wall_light_12',
            label: 'Lampe suspendue 1',
        },
        {
            model: 'prop_wall_light_16a',
            label: 'Lampe de mur 8',
        },
        {
            model: 'prop_wall_light_16b',
            label: 'Lampe de mur 9',
        },
        {
            model: 'prop_wall_light_16c',
            label: 'Lampe de mur 10',
        },
        {
            model: 'prop_wall_light_16e',
            label: 'Lampe suspendue 2',
        },
        {
            model: 'prop_runlight_b',
            label: 'Spot lumineux bleu',
            collision: false,
        },
        {
            model: 'prop_runlight_g',
            label: 'Spot lumineux vert',
            collision: false,
        },
        {
            model: 'prop_runlight_r',
            label: 'Spot lumineux rouge',
            collision: false,
        },
        {
            model: 'prop_runlight_y',
            label: 'Spot lumineux jaune',
            collision: false,
        },
        {
            model: 'xm_base_cia_lamp_ceiling_01',
            label: 'Lampe de plafond 1',
        },
        {
            model: 'xm_base_cia_lamp_ceiling_02',
            label: 'Lampe de plafond 2',
        },
        {
            model: 'ch_prop_ch_lamp_ceiling_02a',
            label: 'Néon de plafond 1',
        },
        {
            model: 'ch_prop_ch_lamp_ceiling_02b',
            label: 'Néon de plafond 2',
        },
        {
            model: 'ch_prop_tunnel_tripod_lampa',
            label: 'Lampe tripode',
        },
        {
            model: 'apa_mp_h_floor_lamp_int_08',
            label: 'Lampe à pied 1',
        },
        {
            model: 'apa_mp_h_floorlamp_a',
            label: 'Lampe à pied 2',
        },
        {
            model: 'apa_mp_h_floorlamp_b',
            label: 'Lampe à pied 3',
        },
        {
            model: 'apa_mp_h_floorlamp_c',
            label: 'Lampe à pied 4',
        },
        {
            model: 'apa_mp_h_lampbulb_multiple_a',
            label: 'Lampe multiples bulbes',
        },
        {
            model: 'apa_mp_h_lit_floorlamp_10',
            label: 'Lampe de bureau multiple tiges',
        },
        {
            model: 'apa_mp_h_lit_floorlamp_13',
            label: 'Lampe rose',
        },
        {
            model: 'apa_mp_h_lit_lamptable_005',
            label: 'Lampe de salon 5',
        },
        {
            model: 'apa_mp_h_lit_lamptable_04',
            label: 'Lampe de salon 6',
        },
        {
            model: 'apa_mp_h_lit_lamptable_09',
            label: 'Lampe de salon 7',
        },
        {
            model: 'apa_mp_h_lit_lamptable_17',
            label: 'Lampe de salon 8',
        },
        {
            model: 'apa_mp_h_lit_lamptable_21',
            label: 'Lampe de salon 9',
        },
        {
            model: 'apa_mp_h_lit_lamptablenight_16',
            label: 'Lampe de chevet 3',
        },
        {
            model: 'apa_mp_h_lit_lamptablenight_24',
            label: 'Lampe de chevet 4',
        },
        {
            model: 'apa_mp_h_lit_lightpendant_01',
            label: 'Lampe suspendue 3',
        },
        {
            model: 'apa_mp_h_lit_lightpendant_05',
            label: 'Lampe suspendue 4',
        },
        {
            model: 'apa_mp_h_yacht_table_lamp_01',
            label: 'Lampe de salon 10',
        },
        {
            model: 'ba_prop_sign_galaxy',
            label: 'Néon Galaxy',
        },
        {
            model: 'ba_prop_sign_technologie',
            label: 'Néon Technologie',
        },
        {
            model: 'bkr_prop_grow_lamp_02a',
            label: 'Lampe de culture 1',
        },
        {
            model: 'bkr_prop_grow_lamp_02b',
            label: 'Lampe de culture 2',
        },
        {
            model: 'xm_int_prop_tinsel_aven_01a',
            label: 'Guirlande 1',
            collision: false,
        },
        {
            model: 'xm_int_prop_tinsel_truck_carmod',
            label: 'Guirlande 2',
            collision: false,
        },
        {
            model: 'xm_int_prop_tinsel_truck_main',
            label: 'Guirlande 3',
            collision: false,
        },
        {
            model: 'xm_prop_lab_floor_lampa',
            label: 'Lampe de laboratoire',
            collision: false,
        },
        {
            model: 'xm_prop_lab_lamp_wall_b',
            label: 'Lampe de laboratoire murale',
            collision: false,
        },
        {
            model: 'xs_prop_arena_lights_tube_l_a',
            label: 'Néon mural violet',
            collision: false,
        },
        {
            model: 'xs_prop_x18_hangar_lamp_led_a',
            label: 'Lampe de hangar 1',
            collision: false,
        },
        {
            model: 'xs_prop_x18_hangar_lamp_wall_a',
            label: 'Lampe de hangar 2',
            collision: false,
        },
        {
            model: 'xs_prop_x18_hangar_light_a',
            label: 'Lampe de hangar 3',
            collision: false,
        },
        {
            model: 'xs_prop_x18_hangar_light_b',
            label: 'Lampe de hangar 4',
            collision: false,
        },
        {
            model: 'xs_propintarena_lamps_01a',
            label: "Eclairage d'arène",
            collision: false,
        },
        {
            model: 'prop_beer_neon_01',
            label: 'Néon Liquor',
            collision: false,
        },
        {
            model: 'prop_pharm_sign_01',
            label: 'Néon Pharmacie',
            collision: false,
        },
    ],
    ["Décoration d'intérieur"]: [
        {
            model: 'prop_sh_cigar_01',
            label: 'Cigare 2',
        },
        {
            model: 'prop_cigar_01',
            label: 'Cigare 3',
        },
        {
            model: 'prop_sh_joint_01',
            label: 'Joint 1',
        },
        {
            model: 'apa_mp_h_acc_box_trinket_01',
            label: 'Petite boîte 1',
        },
        {
            model: 'apa_mp_h_acc_box_trinket_02',
            label: 'Petite boîte 2',
        },
        {
            model: 'apa_mp_h_acc_candles_01',
            label: 'Bougies 1',
        },
        {
            model: 'apa_mp_h_acc_candles_02',
            label: 'Bougies 2',
        },
        {
            model: 'apa_mp_h_acc_candles_04',
            label: 'Bougies 3',
        },
        {
            model: 'apa_mp_h_acc_candles_05',
            label: 'Bougies 4',
        },
        {
            model: 'apa_mp_h_acc_candles_06',
            label: 'Bougies 5',
        },
        {
            model: 'apa_mp_h_acc_dec_head_01',
            label: 'Masque sur présentoir 1',
        },
        {
            model: 'apa_mp_h_acc_dec_plate_01',
            label: 'Assiette sur présentoir 1',
        },
        {
            model: 'apa_mp_h_acc_dec_plate_02',
            label: 'Assiette sur présentoir 2',
        },
        {
            model: 'apa_mp_h_acc_dec_sculpt_01',
            label: 'Sculpture 1',
        },
        {
            model: 'apa_mp_h_acc_dec_sculpt_02',
            label: 'Sculpture 2',
        },
        {
            model: 'apa_mp_h_acc_dec_sculpt_03',
            label: 'Sculpture 3',
        },
        {
            model: 'apa_mp_h_acc_pot_pouri_01',
            label: 'Pot-pourri 1',
        },
        {
            model: 'apa_mp_h_acc_scent_sticks_01',
            label: 'Bâtonnets parfumés 1',
        },
        {
            model: 'apa_mp_h_acc_tray_01',
            label: 'Plateau 1',
        },
        {
            model: 'bkr_cash_scatter_02',
            label: 'Billets de banque 1',
        },
        {
            model: 'bkr_prop_jailer_keys_01a',
            label: 'Clés 1',
        },
        {
            model: 'p_car_keys_01',
            label: 'Clés 2',
        },
        {
            model: 'bkr_prop_fakeid_openpassport',
            label: 'Passeport',
        },
        {
            model: 'ex_office_swag_pills2',
            label: 'Médicaments 1',
        },
        {
            model: 'ex_office_swag_med2',
            label: 'Médicaments 2',
        },
        {
            model: 'ex_prop_ashtray_luxe_02',
            label: 'Cendrier 1',
        },
        {
            model: 'ex_prop_exec_award_bronze',
            label: 'Trophée en bronze',
        },
        {
            model: 'ex_prop_exec_award_diamond',
            label: 'Trophée en diamant',
        },
        {
            model: 'ex_prop_exec_award_gold',
            label: 'Trophée en or',
        },
        {
            model: 'ex_prop_exec_award_plastic',
            label: 'Trophée en plastique',
        },
        {
            model: 'ex_prop_exec_award_silver',
            label: 'Trophée en argent',
        },
        {
            model: 'ex_prop_exec_cigar_01',
            label: 'Cigare 1',
        },
        {
            model: 'ex_prop_exec_lighter_01',
            label: 'Briquet 1',
        },
        {
            model: 'prop_fib_ashtray_01',
            label: 'Cendrier 2',
        },
        {
            model: 'prop_novel_01',
            label: 'Livre ouvert 1',
        },
        {
            model: 'prop_egg_clock_01',
            label: 'Horloge 1',
        },
        {
            model: 'prop_dummy_01',
            label: 'Statuette 1',
        },
        {
            model: 'prop_t_telescope_01b',
            label: 'Télescope',
        },
        {
            model: 'prop_anim_cash_note',
            label: 'Billet de banque',
        },
        {
            model: 'prop_anim_cash_pile_01',
            label: 'Liasses de billets',
        },
        {
            model: 'prop_ashtray_01',
            label: 'Cendrier 3',
        },
        {
            model: 'prop_game_clock_01',
            label: 'Horloge 2',
        },
        {
            model: 'prop_game_clock_02',
            label: 'Horloge 3',
        },
    ],
    ['Tapis']: [
        {
            model: 'apa_mp_h_acc_rugwooll_03',
            label: 'Tapis 1',
            collision: false,
        },
        {
            model: 'apa_mp_h_acc_rugwooll_04',
            label: 'Tapis 2',
            collision: false,
        },
        {
            model: 'apa_mp_h_acc_rugwoolm_01',
            label: 'Tapis 3',
            collision: false,
        },
        {
            model: 'apa_mp_h_acc_rugwoolm_02',
            label: 'Tapis 4',
            collision: false,
        },
        {
            model: 'apa_mp_h_acc_rugwoolm_03',
            label: 'Tapis 5',
            collision: false,
        },
        {
            model: 'apa_mp_h_acc_rugwoolm_04',
            label: 'Tapis 6',
            collision: false,
        },
        {
            model: 'apa_mp_h_acc_rugwools_01',
            label: 'Tapis 7',
            collision: false,
        },
        {
            model: 'apa_mp_h_acc_rugwools_03',
            label: 'Tapis 8',
            collision: false,
        },
        {
            model: 'ex_mp_h_acc_rugwoolm_04',
            label: 'Tapis 9',
            collision: false,
        },
        {
            model: 'hei_heist_acc_rugwooll_01',
            label: 'Tapis 10',
            collision: false,
        },
        {
            model: 'hei_heist_acc_rugwooll_02',
            label: 'Tapis 11',
            collision: false,
        },
    ],
    ['Affaires personnelles']: [
        {
            model: 'p_ld_heist_bag_s_1',
            label: 'Gros Sac 1',
        },
        {
            model: 'p_ld_heist_bag_s_2',
            label: 'Gros Sac 2',
        },
        {
            model: 'p_ld_heist_bag_s_pro',
            label: 'Gros Sac 3',
        },
        {
            model: 'p_ld_heist_bag_s_pro_o',
            label: 'Gros Sac 4',
        },
        {
            model: 'prop_ld_hat_01',
            label: 'Chapeau de cowboy',
        },
        {
            model: 'prop_ld_jeans_01',
            label: 'Jean',
        },
        {
            model: 'prop_ld_shoe_01',
            label: 'Chaussure',
        },
        {
            model: 'prop_suitcase_01',
            label: 'Valisette 1',
        },
        {
            model: 'prop_ld_wallet_pickup',
            label: 'Portefeuille 1',
        },
        {
            model: 'p_jewel_necklace_02',
            label: 'Collier 1',
            collision: false,
        },
        {
            model: 'p_ld_heist_bag_01',
            label: 'Sac 1',
            collision: false,
        },
        {
            model: 'p_watch_01',
            label: 'Montre 1',
        },
        {
            model: 'p_watch_02',
            label: 'Montre 2',
        },
        {
            model: 'p_watch_03',
            label: 'Montre 3',
        },
        {
            model: 'p_watch_04',
            label: 'Montre 4',
        },
        {
            model: 'p_watch_05',
            label: 'Montre 5',
        },
        {
            model: 'p_watch_06',
            label: 'Montre 6',
        },
        {
            model: 'prop_amb_handbag_01',
            label: 'Sac à main 1',
            collision: false,
        },
        {
            model: 'prop_amb_phone',
            label: 'Téléphone 1',
            collision: false,
        },
        {
            model: 'prop_big_bag_01',
            label: 'Sac 2',
            collision: false,
        },
        {
            model: 'prop_cash_dep_bag_01',
            label: 'Sac 3',
            collision: false,
        },
        {
            model: 'prop_cs_heist_bag_01',
            label: 'Sac 4',
            collision: false,
        },
        {
            model: 'prop_cs_heist_bag_02',
            label: 'Sac 5',
            collision: false,
        },
        {
            model: 'prop_cs_shopping_bag',
            label: 'Sac 6',
            collision: false,
        },
        {
            model: 'prop_cs_walking_stick',
            label: 'Canne de marche',
            collision: false,
        },
        {
            model: 'prop_fruit_basket',
            label: 'Panier de fruits',
            collision: false,
        },
        {
            model: 'prop_ing_camera_01',
            label: 'Caméra 1',
            collision: false,
        },
        {
            model: 'prop_ld_case_01',
            label: 'Valise 1',
            collision: false,
        },
        {
            model: 'prop_ld_health_pack',
            label: 'Trousse de soins',
            collision: false,
        },
        {
            model: 'prop_ld_suitcase_01',
            label: 'Valise 2',
            collision: false,
        },
        {
            model: 'prop_ld_suitcase_02',
            label: 'Valise 3',
            collision: false,
        },
        {
            model: 'prop_ld_wallet_01',
            label: 'Portefeuille 2',
            collision: false,
        },
        {
            model: 'prop_med_bag_01',
            label: 'Sac médical 1',
        },
        {
            model: 'prop_med_bag_01b',
            label: 'Sac médical 2',
        },
        {
            model: 'prop_npc_phone',
            label: 'Téléphone 2',
            collision: false,
        },
        {
            model: 'prop_npc_phone_02',
            label: 'Téléphone 3',
            collision: false,
        },
        {
            model: 'prop_pap_camera_01',
            label: 'Caméra 2',
            collision: false,
        },
        {
            model: 'prop_phone_cs_frank',
            label: 'Téléphone 4',
            collision: false,
        },
        {
            model: 'prop_phone_ing_02',
            label: 'Téléphone 5',
            collision: false,
        },
        {
            model: 'prop_police_phone',
            label: 'Téléphone 6',
            collision: false,
        },
        {
            model: 'prop_poly_bag_01',
            label: 'Sac de courses 1',
        },
        {
            model: 'prop_prologue_phone',
            label: 'Téléphone 7',
            collision: false,
        },
        {
            model: 'prop_tennis_bag_01',
            label: 'Sac de tennis 1',
            collision: false,
        },
        {
            model: 'prop_v_m_phone_01',
            label: 'Téléphone 8',
            collision: false,
        },
        {
            model: 'p_sunglass_m_s',
            label: 'Lunettes de soleil 1',
            collision: false,
        },
        {
            model: 'prop_ld_case_01_s',
            label: 'Valise 4',
            collision: false,
        },
        {
            model: 'p_ld_id_card_002',
            label: "Carte d'identité 1",
            collision: false,
        },
        {
            model: 'p_ld_id_card_01',
            label: "Carte d'identité 2",
            collision: false,
        },
        {
            model: 'prop_aviators_01',
            label: 'Lunettes de soleil 2',
            collision: false,
        },
        {
            model: 'prop_carrier_bag_01',
            label: 'Sac de courses 2',
        },
        {
            model: 'prop_cs_amanda_shoe',
            label: 'Chaussures 1',
            collision: false,
        },
        {
            model: 'prop_cs_bowie_knife',
            label: 'Couteau 1',
            collision: false,
        },
        {
            model: 'prop_cs_business_card',
            label: 'Carte banquaire 1',
            collision: false,
        },
        {
            model: 'prop_cs_hand_radio',
            label: 'Radio 1',
            collision: false,
        },
        {
            model: 'prop_cs_katana_01',
            label: 'Katana 1',
            collision: false,
        },
        {
            model: 'prop_cs_lipstick',
            label: 'Rouge à lèvres 1',
            collision: false,
        },
        {
            model: 'prop_cs_police_torch',
            label: 'Lampe torche 1',
            collision: false,
        },
        {
            model: 'prop_cs_sol_glasses',
            label: 'Lunettes de soleil 3',
            collision: false,
        },
        {
            model: 'prop_fag_packet_01',
            label: 'Paquet de cigarettes 1',
        },
        {
            model: 'prop_ld_fags_01',
            label: 'Paquet de cigarettes 2',
        },
        {
            model: 'prop_ld_fags_02',
            label: 'Paquet de cigarettes 3',
        },
        {
            model: 'prop_m_pack_int_01',
            label: 'Sac à dos 1',
        },
        {
            model: 'prop_cs_dildo_01',
            label: 'Dildo',
        },
    ],
    ['Rangement']: [
        {
            model: 'prop_fruit_plas_crate_01',
            label: 'Caisses en plastique 1',
        },
        {
            model: 'prop_gold_trolly',
            label: 'Chariot 1',
        },
        {
            model: 'prop_hotel_trolley',
            label: 'Chariot 2',
        },
        {
            model: 'prop_ld_int_safe_01',
            label: 'Coffre-fort 1',
        },
        {
            model: 'prop_cabinet_02b',
            label: 'Tiroirs',
        },
        {
            model: 'p_pharm_unit_01',
            label: 'Placard à pharmacie 1',
        },
        {
            model: 'p_pharm_unit_02',
            label: 'Placard à pharmacie 2',
        },
        {
            model: 'prop_cs_bucket_s',
            label: 'Seau de ménage',
        },
        {
            model: 'prop_blox_spray',
            label: 'Spray Javel',
        },
        {
            model: 'prop_cs_ironing_board',
            label: 'Planche à repasser',
        },
        {
            model: 'prop_cs_lester_crate',
            label: 'Caisse de classeurs',
        },
        {
            model: 'prop_crate_03a',
            label: 'Cagette 1',
        },
        {
            model: 'prop_crate_05a',
            label: 'Cagette 2',
        },
        {
            model: 'prop_crate_09a',
            label: 'Cagette 3',
        },
        {
            model: 'prop_crate_11b',
            label: 'Cagette 4',
        },
        {
            model: 'prop_cratepile_01a',
            label: 'Pile de Cagette',
        },
        {
            model: 'prop_cratepile_07a',
            label: 'Pile de Caisse',
        },
        {
            model: 'v_serv_plastic_box',
            label: 'Boite en plastique',
        },
    ],
    ['Vases']: [
        {
            model: 'v_res_cherubvase',
            label: 'Vase 1',
        },
        {
            model: 'v_res_exoticvase',
            label: 'Vase de fleurs 1',
        },
        {
            model: 'v_res_m_vasedead',
            label: 'Vase de fleurs 2',
        },
        {
            model: 'v_res_m_vasefresh',
            label: 'Vase de fleurs 3',
        },
        {
            model: 'v_res_mbronzvase',
            label: 'Vase 2',
        },
        {
            model: 'v_res_mvasechinese',
            label: 'Vase de fleurs 4',
        },
        {
            model: 'v_res_rosevase',
            label: 'Vase de fleurs 5',
        },
        {
            model: 'v_res_rosevasedead',
            label: 'Vase de fleurs 6',
        },
        {
            model: 'v_med_p_vaseround',
            label: 'Vase 3',
        },
        {
            model: 'v_med_p_vasetall',
            label: 'Vase 4',
        },
        {
            model: 'apa_mp_h_acc_vase_01',
            label: 'Vase 5',
        },
        {
            model: 'apa_mp_h_acc_vase_02',
            label: 'Vase 6',
        },
        {
            model: 'apa_mp_h_acc_vase_04',
            label: 'Vase 7',
        },
        {
            model: 'apa_mp_h_acc_vase_05',
            label: 'Vase 8',
        },
        {
            model: 'apa_mp_h_acc_vase_flowers_01',
            label: 'Vase de fleurs 7',
        },
        {
            model: 'apa_mp_h_acc_vase_flowers_02',
            label: 'Vase de fleurs 8',
        },
        {
            model: 'apa_mp_h_acc_vase_flowers_03',
            label: 'Vase de fleurs 9',
        },
        {
            model: 'apa_mp_h_acc_vase_flowers_04',
            label: 'Vase de fleurs 10',
        },
        {
            model: 'p_int_jewel_plant_01',
            label: 'Vase de plantes 1',
        },
        {
            model: 'p_int_jewel_plant_02',
            label: 'Vase de plantes 2',
        },
        {
            model: 'prop_fbibombplant',
            label: 'Vase de plantes 3',
        },
        {
            model: 'vw_prop_casino_art_vase_01a',
            label: 'Vase de décoration 1',
        },
        {
            model: 'vw_prop_casino_art_vase_02a',
            label: 'Vase de décoration 2',
        },
        {
            model: 'vw_prop_casino_art_vase_03a',
            label: 'Vase de décoration 3',
        },
        {
            model: 'vw_prop_casino_art_vase_04a',
            label: 'Vase de décoration 4',
        },
        {
            model: 'vw_prop_casino_art_vase_05a',
            label: 'Vase de décoration 5',
        },
        {
            model: 'vw_prop_casino_art_vase_06a',
            label: 'Vase de décoration 6',
        },
        {
            model: 'vw_prop_casino_art_vase_07a',
            label: 'Vase de décoration 7',
        },
        {
            model: 'vw_prop_casino_art_vase_08a',
            label: 'Vase de décoration 8',
        },
        {
            model: 'vw_prop_casino_art_vase_09a',
            label: 'Vase de décoration 9',
        },
        {
            model: 'vw_prop_casino_art_vase_10a',
            label: 'Vase de décoration 10',
        },
        {
            model: 'vw_prop_casino_art_vase_11a',
            label: 'Vase de décoration 11',
        },
        {
            model: 'vw_prop_casino_art_vase_12a',
            label: 'Vase de décoration 12',
        },
    ],
    ['Garage']: [
        {
            model: 'prop_oilcan_01a',
            label: "Bidon d'huile 1",
        },
        {
            model: 'prop_oilcan_02a',
            label: "Bidon d'huile 2",
        },
        {
            model: 'prop_toolchest_01',
            label: 'Coffre à outils',
        },
        {
            model: 'prop_toolchest_02',
            label: 'Coffre à outils 2',
        },
        {
            model: 'prop_toolchest_03',
            label: 'Coffre à outils 3',
        },
        {
            model: 'p_cs_trolley_01_s',
            label: 'Chariot 1',
        },
        {
            model: 'imp_prop_impexp_half_cut_rack_01a',
            label: 'Rack de pièces 1',
        },
        {
            model: 'imp_prop_impexp_half_cut_rack_01b',
            label: 'Rack de pièces 2',
        },
        {
            model: 'imp_prop_impexp_hub_rack_01a',
            label: 'Rack de pièces 3',
        },
        {
            model: 'imp_prop_impexp_postlift',
            label: 'Pont élévateur',
        },
        {
            model: 'imp_prop_tool_draw_01a',
            label: 'Tiroir à outils 1',
        },
        {
            model: 'imp_prop_welder_01a',
            label: 'Poste à souder',
        },
        {
            model: 'imp_prop_wheel_balancer_01a',
            label: 'Équilibreuse de roue',
        },
        {
            model: 'prop_cablespool_05',
            label: 'Bobine de câble',
        },
        {
            model: 'prop_rub_pile_03',
            label: 'Pile de pneus 1',
        },
        {
            model: 'prop_rub_pile_04',
            label: 'Pile de pneus 2',
        },
        {
            model: 'prop_rub_tyre_01',
            label: 'Pneu 1',
            collision: false,
        },
        {
            model: 'prop_rub_tyre_02',
            label: 'Pneu 2',
            collision: false,
        },
        {
            model: 'prop_rub_tyre_03',
            label: 'Pneu 3',
            collision: false,
        },
        {
            model: 'prop_car_battery_01',
            label: 'Batterie de voiture',
        },
        {
            model: 'prop_car_engine_01',
            label: 'Moteur de voiture',
        },
        {
            model: 'prop_bumper_04',
            label: 'Pare-choc',
        },
        {
            model: 'prop_car_door_03',
            label: 'Portière',
        },
        {
            model: 'prop_car_exhaust_01',
            label: "Pot d'échappement",
        },
        {
            model: 'prop_car_seat',
            label: 'Siège de voiture',
        },
        {
            model: 'prop_wheel_hub_01',
            label: 'Jante de voiture',
        },
        {
            model: 'prop_wheel_rim_01',
            label: 'Roue de voiture',
        },
        {
            model: 'prop_byard_motor_01',
            label: 'Moteur de bateau 1',
        },
        {
            model: 'prop_byard_motor_02',
            label: 'Moteur de bateau 2',
        },
        {
            model: 'prop_byard_motor_03',
            label: 'Moteur de bateau 3',
        },
        {
            model: 'imp_prop_impexp_parts_rack_01a',
            label: 'Rack de pièces 4',
        },
        {
            model: 'imp_prop_impexp_parts_rack_02a',
            label: 'Rack de pièces 5',
        },
        {
            model: 'imp_prop_impexp_parts_rack_03a',
            label: 'Rack de pièces 6',
        },
        {
            model: 'imp_prop_impexp_rack_01a',
            label: 'Rack vide 1',
        },
        {
            model: 'imp_prop_impexp_rack_02a',
            label: 'Rack vide 2',
        },
        {
            model: 'imp_prop_impexp_rack_03a',
            label: 'Rack vide 3',
        },
        {
            model: 'imp_prop_impexp_rack_04a',
            label: 'Rack vide 4',
        },
        {
            model: 'prop_tool_box_03',
            label: 'Boîte à outils vide',
        },
        {
            model: 'prop_tool_box_04',
            label: 'Boîte à outils 1',
        },
        {
            model: 'prop_tool_box_07',
            label: 'Boîte à outils 2',
        },
    ],
    ['Plantes']: [
        {
            model: 'prop_single_rose',
            label: 'Rose',
            collision: false,
        },
        {
            model: 'prop_snow_flower_02',
            label: 'Bouquet de fleurs 1',
        },
        {
            model: 'prop_windowbox_a',
            label: 'Pot de fleurs 1',
        },
        {
            model: 'prop_windowbox_b',
            label: 'Pot de fleurs 2',
        },
        {
            model: 'prop_fib_plant_01',
            label: 'Plante en pot 1',
        },
        {
            model: 'prop_fib_plant_02',
            label: 'Plante 1',
        },
        {
            model: 'prop_agave_01',
            label: 'Cactus 1',
        },
        {
            model: 'prop_agave_02',
            label: 'Cactus 2',
        },
        {
            model: 'prop_cs_plant_01',
            label: 'Plantes roses',
        },
        {
            model: 'prop_plant_01b',
            label: 'Plantes violettes',
        },
        {
            model: 'prop_plant_cane_01a',
            label: 'Plante à fleurs variées',
        },
        {
            model: 'prop_plant_fern_01a',
            label: 'Plantes jaunes',
        },
        {
            model: 'prop_plant_palm_01a',
            label: 'Palmier 1',
        },
        {
            model: 'prop_plant_paradise',
            label: 'Plantes rouges',
        },
        {
            model: 'prop_plant_paradise_b',
            label: 'Plantes blanches',
        },
        {
            model: 'prop_bush_lrg_02',
            label: 'Buisson 1',
        },
        {
            model: 'prop_bush_lrg_02b',
            label: 'Buisson 2',
        },
        {
            model: 'prop_bush_lrg_03',
            label: 'Buisson 3',
        },
        {
            model: 'prop_bush_lrg_04b',
            label: 'Arbuste 1',
        },
        {
            model: 'prop_bush_lrg_04c',
            label: 'Arbuste 2',
        },
        {
            model: 'prop_bush_neat_01',
            label: 'Arbuste 3',
        },
        {
            model: 'prop_bush_neat_02',
            label: 'Arbuste 4',
        },
        {
            model: 'prop_bush_neat_07',
            label: 'Buisson 4',
        },
        {
            model: 'prop_bush_neat_06',
            label: 'Buisson 5',
        },
        {
            model: 'prop_bush_neat_08',
            label: 'Buisson taillé 1',
        },
        {
            model: 'prop_bush_ornament_01',
            label: 'Buisson taillé 2',
        },
        {
            model: 'prop_bush_ornament_02',
            label: 'Buisson taillé 3',
        },
        {
            model: 'prop_bush_ornament_03',
            label: 'Buisson taillé 4',
        },
        {
            model: 'prop_bush_ornament_04',
            label: 'Buisson taillé 5',
        },
        {
            model: 'prop_cactus_01a',
            label: 'Cactus 3',
        },
        {
            model: 'prop_cactus_01b',
            label: 'Cactus 4',
        },
        {
            model: 'prop_cactus_01c',
            label: 'Cactus 5',
        },
        {
            model: 'prop_cactus_01d',
            label: 'Cactus 6',
        },
        {
            model: 'prop_cactus_01e',
            label: 'Cactus 7',
        },
        {
            model: 'prop_cactus_02',
            label: 'Cactus 8',
        },
        {
            model: 'prop_cactus_03',
            label: 'Cactus 9',
        },
        {
            model: 'prop_tree_birch_05',
            label: 'Arbre à fruits 1',
        },
        {
            model: 'prop_veg_crop_03_cab',
            label: 'Salade verte',
        },
        {
            model: 'prop_veg_crop_03_pump',
            label: 'Citrouille',
        },
        {
            model: 'prop_veg_crop_tr_01',
            label: 'Palmier 2',
        },
        {
            model: 'prop_palm_fan_02_b',
            label: 'Palmier 3',
        },
        {
            model: 'prop_palm_fan_03_a',
            label: 'Palmier 4',
        },
        {
            model: 'prop_palm_fan_03_b',
            label: 'Palmier 5',
        },
        {
            model: 'prop_plant_int_01a',
            label: 'Plante en pot 2',
        },
        {
            model: 'prop_plant_int_01b',
            label: 'Plante en pot 3',
        },
        {
            model: 'prop_plant_int_02a',
            label: 'Plante en pot 4',
        },
        {
            model: 'prop_plant_int_02b',
            label: 'Plante en pot 5',
        },
        {
            model: 'prop_plant_int_03a',
            label: 'Plante en pot 6',
        },
        {
            model: 'prop_plant_int_03b',
            label: 'Plante en pot 7',
        },
        {
            model: 'prop_plant_int_03c',
            label: 'Plante en pot 8',
        },
        {
            model: 'prop_plant_int_04a',
            label: 'Plante en pot 9',
        },
        {
            model: 'prop_plant_int_04b',
            label: 'Plante en pot 10',
        },
        {
            model: 'prop_plant_int_04c',
            label: 'Plante en pot 11',
        },
        {
            model: 'prop_plant_int_05a',
            label: 'Plante en pot 12',
        },
        {
            model: 'prop_plant_int_05b',
            label: 'Plante en pot 13',
        },
        {
            model: 'prop_plant_int_06a',
            label: 'Plante en pot 14',
        },
        {
            model: 'prop_plant_int_06b',
            label: 'Plante en pot 15',
        },
        {
            model: 'prop_pot_plant_01c',
            label: 'Plante en pot 16',
        },
        {
            model: 'prop_pot_plant_01d',
            label: 'Plante en pot 17',
        },
        {
            model: 'prop_pot_plant_01e',
            label: 'Plante en pot 18',
        },
        {
            model: 'prop_pot_plant_02a',
            label: 'Plante en pot 19',
        },
        {
            model: 'prop_pot_plant_02b',
            label: 'Plante en pot 20',
        },
        {
            model: 'prop_pot_plant_02c',
            label: 'Plante en pot 21',
        },
        {
            model: 'prop_pot_plant_02d',
            label: 'Plante en pot 22',
        },
        {
            model: 'prop_pot_plant_03a',
            label: 'Plante en pot 23',
        },
        {
            model: 'prop_pot_plant_03b',
            label: 'Plante en pot 24',
        },
        {
            model: 'prop_pot_plant_03c',
            label: 'Plante en pot 25',
        },
        {
            model: 'prop_tree_log_01',
            label: "Tronc d'arbre 1",
        },
        {
            model: 'prop_tree_log_02',
            label: "Tronc d'arbre 2",
        },
    ],
    ['Bar']: [
        {
            model: 'prop_stripmenu',
            label: 'Menu de bar',
        },
        {
            model: 'prop_rum_bottle',
            label: 'Bouteille de rhum',
        },
        {
            model: 'prop_amb_beer_bottle',
            label: 'Bouteille de bière',
        },
        {
            model: 'prop_cs_bottle_opener',
            label: 'Ouvre-bouteille',
        },
        {
            model: 'prop_cs_cctv',
            label: 'Caméra de surveillance',
        },
        {
            model: 'prop_cs_champ_flute',
            label: 'Flûte de champagne',
        },
        {
            model: 'prop_cs_shot_glass',
            label: 'Verre à shot',
        },
        {
            model: 'prop_sh_wine_glass',
            label: 'Verre à vin',
        },
        {
            model: 'prop_tumbler_01_empty',
            label: 'Tumbler vide',
        },
        {
            model: 'prop_wheat_grass_empty',
            label: 'Verre à cocktail',
        },
        {
            model: 'p_till_01_s',
            label: 'Caisse enregistreuse 1',
        },
        {
            model: 'prop_till_01',
            label: 'Caisse enregistreuse 2',
        },
        {
            model: 'prop_bahammenu',
            label: 'Menu de bar 2',
        },
        {
            model: 'prop_bar_beerfridge_01',
            label: 'Frigo à bière',
        },
        {
            model: 'prop_bar_caddy',
            label: 'Fournitures de bar',
        },
        {
            model: 'prop_bar_cockshaker',
            label: 'Shaker',
        },
        {
            model: 'prop_bar_drinkstraws',
            label: 'Pailles',
        },
        {
            model: 'prop_bar_fridge_02',
            label: 'Frigo à bière 2',
        },
        {
            model: 'prop_bar_fridge_03',
            label: 'Frigo à bière 3',
        },
        {
            model: 'prop_bar_ice_01',
            label: 'Bac à glaçons',
        },
        {
            model: 'prop_bar_fruit',
            label: 'Fruits',
        },
        {
            model: 'prop_bar_measrjug',
            label: 'Verre doseur',
        },
        {
            model: 'prop_beer_logopen',
            label: 'Bouteille de bière 2',
        },
        {
            model: 'prop_beer_patriot',
            label: 'Bouteille de bière 3',
        },
        {
            model: 'prop_beer_pissh',
            label: 'Bouteille de bière 4',
        },
        {
            model: 'prop_beerdusche',
            label: 'Bouteille de bière 5',
        },
        {
            model: 'prop_bottle_brandy',
            label: 'Bouteille de brandy',
        },
        {
            model: 'prop_bottle_cognac',
            label: 'Bouteille de cognac',
        },
        {
            model: 'prop_bottle_macbeth',
            label: 'Bouteille de whisky',
        },
        {
            model: 'prop_bottle_richard',
            label: 'Bouteille de whisky 2',
        },
        {
            model: 'prop_cava',
            label: 'Bouteille de champagne 1',
        },
        {
            model: 'prop_champ_01a',
            label: 'Bouteille de champagne 2',
        },
        {
            model: 'prop_champ_cool',
            label: 'Bouteille de champagne 3',
        },
        {
            model: 'prop_cocktail',
            label: 'Cocktail',
        },
        {
            model: 'prop_daiquiri',
            label: 'Daiquiri',
        },
        {
            model: 'prop_pinacolada',
            label: 'Piña Colada',
        },
        {
            model: 'prop_plonk_red',
            label: 'Bouteille de vin rouge',
        },
        {
            model: 'prop_plonk_white',
            label: 'Bouteille de vin blanc',
        },
        {
            model: 'prop_tequila',
            label: 'Tequila',
        },
        {
            model: 'prop_tequila_bottle',
            label: 'Bouteille de tequila',
        },
        {
            model: 'prop_tequsunrise',
            label: 'Tequila Sunrise',
        },
        {
            model: 'prop_vodka_bottle',
            label: 'Bouteille de vodka',
        },
        {
            model: 'spiritsrow',
            label: "Rangée de bouteilles d'alcool fort",
        },
        {
            model: 'vodkarow',
            label: 'Rangée de bouteilles de vodka',
        },
        {
            model: 'winerow',
            label: 'Rangée de bouteilles de vin',
        },
        {
            model: 'prop_bar_coasterdisp',
            label: 'Distributeur de sous-verres',
        },
    ],
    ['Barrières']: [
        {
            model: 'p_fnclink_dtest',
            label: 'Grillage 1',
        },
        {
            model: 'prop_ld_barrier_01',
            label: 'Barrière 1',
        },
        {
            model: 'prop_premier_fence_01',
            label: 'Barrière 2',
        },
        {
            model: 'prop_ld_balastrude',
            label: 'Balustrade en béton 1',
        },
        {
            model: 'prop_ld_fragwall_01b',
            label: 'Mur en béton 1',
        },
        {
            model: 'prop_fnccorgm_01a',
            label: 'Tôles 1',
        },
        {
            model: 'prop_fnccorgm_02c',
            label: 'Tôles 2',
        },
        {
            model: 'prop_fncsec_03a',
            label: 'Grillage 2',
        },
        {
            model: 'prop_fncsec_04a',
            label: 'Barrière 3',
        },
        {
            model: 'prop_ch2_wdfence_01',
            label: 'Barrière en bois 1',
        },
        {
            model: 'prop_fnc_farm_01b',
            label: 'Barrière en bois 2',
        },
        {
            model: 'prop_fnc_farm_01e',
            label: 'Barrière en bois 3',
        },
        {
            model: 'prop_fnc_omesh_01a',
            label: 'Barrière en bois 4',
        },
        {
            model: 'prop_fnclog_01a',
            label: 'Barrière en bois 5',
        },
        {
            model: 'prop_fnclog_02b',
            label: 'Piquet en bois 1',
        },
        {
            model: 'prop_fnclog_03a',
            label: 'Piquet en bois 2',
        },
        {
            model: 'prop_fncres_01c',
            label: 'Barrière classieuse 1',
        },
        {
            model: 'prop_fncres_02c',
            label: 'Barrière classieuse 2',
        },
        {
            model: 'prop_fncres_04b',
            label: 'Barrière classieuse 3',
        },
        {
            model: 'prop_fncres_05b',
            label: 'Barrière classieuse 4',
        },
        {
            model: 'prop_fncres_07b',
            label: 'Barrière classieuse 5',
        },
    ],
    ['Drapeaux']: [
        {
            model: 'prop_flag_canada',
            label: 'Drapeau du Canada',
        },
        {
            model: 'prop_flag_eu',
            label: "Drapeau de l'Union Européenne",
        },
        {
            model: 'prop_flag_france_s',
            label: 'Drapeau de la France',
        },
        {
            model: 'prop_flag_german',
            label: "Drapeau de l'Allemagne",
        },
        {
            model: 'prop_flag_ireland',
            label: "Drapeau de l'Irlande",
        },
        {
            model: 'prop_flag_japan',
            label: 'Drapeau du Japon',
        },
        {
            model: 'prop_flag_ls',
            label: 'Drapeau de Los Santos',
        },
        {
            model: 'prop_flag_lsfd',
            label: 'Drapeau des pompiers de Los Santos',
        },
        {
            model: 'prop_flag_lsservices',
            label: 'Drapeau des services de Los Santos',
        },
        {
            model: 'prop_flag_mexico',
            label: 'Drapeau du Mexique',
        },
        {
            model: 'prop_flag_russia',
            label: 'Drapeau de la Russie',
        },
        {
            model: 'prop_flag_sa',
            label: 'Drapeau de San Andreas',
        },
        {
            model: 'prop_flag_sheriff',
            label: 'Drapeau du BCSO',
        },
        {
            model: 'prop_flag_uk',
            label: 'Drapeau du Royaume-Uni',
        },
        {
            model: 'prop_flag_us',
            label: 'Drapeau des États-Unis',
        },
    ],
    ['Camionettes & Stands']: [
        {
            model: 'prop_food_van_01',
            label: 'Camion de nourriture 1',
        },
        {
            model: 'prop_food_van_02',
            label: 'Camion de nourriture 2',
        },
        {
            model: 'prop_wheelchair_01',
            label: 'Fauteuil roulant',
        },
        {
            model: 'p_ld_coffee_vend_s',
            label: 'Distributeur de café',
        },
        {
            model: 'prop_rub_trolley01a',
            label: 'Caddie 1',
        },
        {
            model: 'prop_rub_trolley02a',
            label: 'Caddie 2',
        },
        {
            model: 'prop_burgerstand_01',
            label: 'Stand de burger',
        },
        {
            model: 'prop_hotdogstand_01',
            label: 'Stand de hotdog',
        },
    ],
    ['Tables']: [
        {
            model: 'prop_astro_table_01',
            label: "Table d'astro 1",
        },
        {
            model: 'prop_astro_table_02',
            label: "Table d'astro 2",
        },
        {
            model: 'prop_chateau_table_01',
            label: 'Table en oseille 1',
        },
        {
            model: 'prop_table_01',
            label: 'Table en bois 1',
        },
        {
            model: 'prop_table_02',
            label: 'Table en bois 2',
        },
        {
            model: 'prop_table_03',
            label: 'Table en plastique 1',
        },
        {
            model: 'prop_table_03b',
            label: 'Table en plastique 2',
        },
        {
            model: 'prop_table_04',
            label: 'Table en bois 3',
        },
        {
            model: 'prop_table_05',
            label: 'Table en oseille 2',
        },
        {
            model: 'prop_table_06',
            label: 'Table en pierre 1',
        },
        {
            model: 'prop_table_07',
            label: 'Table de bar 1',
        },
        {
            model: 'prop_table_08',
            label: 'Table de pique-nique 1',
        },
        {
            model: 'prop_table_para_comb_01',
            label: 'Table avec parasol 1',
        },
        {
            model: 'prop_table_para_comb_02',
            label: 'Table avec parasol 2',
        },
        {
            model: 'prop_table_para_comb_03',
            label: 'Table avec parasol 3',
        },
        {
            model: 'prop_table_para_comb_04',
            label: 'Table avec parasol 4',
        },
        {
            model: 'prop_table_para_comb_05',
            label: 'Table avec parasol 5',
        },
        {
            model: 'apa_mp_h_din_table_01',
            label: 'Table en verre 1',
        },
        {
            model: 'apa_mp_h_din_table_04',
            label: 'Table en verre 2',
        },
        {
            model: 'apa_mp_h_din_table_06',
            label: 'Table en plastique 3',
        },
        {
            model: 'apa_mp_h_din_table_11',
            label: 'Table en verre 3',
        },
        {
            model: 'apa_mp_h_tab_coffee_07',
            label: 'Table en verre 4',
        },
        {
            model: 'apa_mp_h_tab_sidelrg_01',
            label: 'Table en verre 5',
        },
        {
            model: 'apa_mp_h_tab_sidelrg_02',
            label: 'Table en verre 6',
        },
        {
            model: 'apa_mp_h_tab_sidelrg_04',
            label: 'Table de bar 2',
        },
        {
            model: 'apa_mp_h_yacht_coffee_table_01',
            label: 'Table stylée 1',
        },
        {
            model: 'apa_mp_h_yacht_coffee_table_02',
            label: 'Table stylée 2',
        },
        {
            model: 'apa_mp_h_yacht_side_table_01',
            label: 'Table stylée 3',
        },
        {
            model: 'apa_mp_h_yacht_side_table_02',
            label: 'Table stylée 4',
        },
        {
            model: 'bkr_prop_weed_table_01b',
            label: 'Table de pique-nique 2',
        },
        {
            model: 'ex_mp_h_din_table_05',
            label: 'Table basse 1',
        },
        {
            model: 'ex_mp_h_tab_coffee_05',
            label: 'Table basse 2',
        },
        {
            model: 'ex_mp_h_tab_coffee_08',
            label: 'Table basse 3',
        },
        {
            model: 'ex_prop_ex_console_table_01',
            label: 'Console 1',
        },
        {
            model: 'gr_dlc_gr_yacht_props_table_01',
            label: 'Table de terrasse 1',
        },
        {
            model: 'gr_dlc_gr_yacht_props_table_02',
            label: 'Table de terrasse 2',
        },
        {
            model: 'gr_dlc_gr_yacht_props_table_03',
            label: 'Table de terrasse 3',
        },
        {
            model: 'hei_heist_din_table_01',
            label: 'Table en verre 7',
        },
        {
            model: 'hei_heist_din_table_04',
            label: 'Table en verre 8',
        },
        {
            model: 'prop_lectern_01',
            label: 'Pupitre',
        },
        {
            model: 'prop_patio_lounger1_table',
            label: 'Table de terrasse 4',
        },
    ],
    ['Instruments']: [
        {
            model: 'prop_acc_guitar_01',
            label: 'Guitare acoustique',
            collision: false,
        },
        {
            model: 'prop_el_guitar_01',
            label: 'Guitare électrique 1',
            collision: false,
        },
        {
            model: 'prop_el_guitar_02',
            label: 'Guitare électrique 2',
            collision: false,
        },
        {
            model: 'prop_el_guitar_03',
            label: 'Guitare électrique 3',
            collision: false,
        },
        {
            model: 'prop_bongos_01',
            label: 'Bongos',
            collision: false,
        },
    ],
    ['Meubles']: [
        {
            model: 'v_res_tre_sideboard',
            label: 'Meuble de salle de bain 1',
        },
        {
            model: 'apa_mp_h_str_shelffloorm_02',
            label: 'Meuble de salon 1',
        },
        {
            model: 'apa_mp_h_str_shelffreel_01',
            label: 'Meuble de salon 2',
        },
        {
            model: 'apa_mp_h_str_shelfwallm_01',
            label: 'Meuble de salon 3',
        },
        {
            model: 'apa_mp_h_str_sideboardl_14',
            label: 'Commode 1',
        },
        {
            model: 'apa_mp_h_str_sideboardm_02',
            label: 'Commode 2',
        },
        {
            model: 'apa_mp_h_str_sideboardm_03',
            label: 'Commode 3',
        },
        {
            model: 'apa_mp_h_str_sideboards_01',
            label: 'Commode 4',
        },
        {
            model: 'apa_mp_h_str_sideboards_02',
            label: 'Etagère en verre',
        },
    ],
    ['Machines']: [
        {
            model: 'gr_prop_gr_lathe_01a',
            label: 'Tour à bois 1',
        },
        {
            model: 'gr_prop_gr_lathe_01b',
            label: 'Tour à bois 2',
        },
        {
            model: 'gr_prop_gr_lathe_01c',
            label: 'Tour à bois 3',
        },
        {
            model: 'gr_prop_gr_speeddrill_01a',
            label: 'Perceuse à colonne 1',
        },
        {
            model: 'gr_prop_gr_speeddrill_01b',
            label: 'Perceuse à colonne 2',
        },
        {
            model: 'gr_prop_gr_speeddrill_01c',
            label: 'Perceuse à colonne 3',
        },
        {
            model: 'gr_prop_gr_vertmill_01a',
            label: 'Fraiseuse 1',
        },
        {
            model: 'gr_prop_gr_vertmill_01b',
            label: 'Fraiseuse 2',
        },
        {
            model: 'gr_prop_gr_vertmill_01c',
            label: 'Fraiseuse 3',
        },
        {
            model: 'gr_prop_gr_cnc_01b',
            label: 'Machine à commande numérique 1',
        },
        {
            model: 'gr_prop_gr_cnc_01c',
            label: 'Machine à commande numérique 2',
        },
        {
            model: 'ch_prop_ch_metal_detector_01a',
            label: 'Portique de sécurité',
        },
    ],
};
