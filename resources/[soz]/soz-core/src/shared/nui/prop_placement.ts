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
};

export type PlacementProp = {
    model: string;
    label?: string;
    collision?: boolean;
};

export type PlacementPropList = Record<string, PlacementProp[]>;

export const PLACEMENT_PROP_LIST: PlacementPropList = {
    ['Art']: [],
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
    ],
    ['Musique']: [
        {
            model: 'prop_boombox_01',
            label: 'Boombox',
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
        {
            model: 'prop_bench_12',
            label: 'Banc en bois 8',
        },
    ],
    ['Poubelles']: [
        {
            model: 'prop_cs_bin_02',
            label: 'Poubelle 1',
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
            model: 'v_16_low_lng_mesh_sofa2',
            label: 'Canapé à motifs 1',
        },
        {
            model: 'v_16_study_sofa',
            label: 'Canapé chic 1',
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
            model: 'ex_office_01a_sofa01',
            label: 'Canapé de bureau 1',
        },
        {
            model: 'ex_office_01b_sofa02',
            label: 'Canapé de bureau 2',
        },
        {
            model: 'ex_office_01c_sofa02',
            label: 'Canapé de bureau 3',
        },
        {
            model: 'ex_office2a_sofa01',
            label: 'Canapé de bureau 4',
        },
        {
            model: 'ex_office2b_sofa01',
            label: 'Canapé de bureau 5',
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
            model: 'v_ind_ss_chair02',
            label: 'Chaise en métal 2',
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
            model: 'v_16_low_lng_mesh_armchair',
            label: 'Fauteuil en cuir 1',
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
            model: 'apa_mp_h_din_chair_14',
            label: 'Chaise de salle à manger 7',
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
            model: 'apa_mp_h_stn_chairarm_14',
            label: 'Fauteil simple 1',
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
    ],
    ['Studio']: [
        {
            model: 'prop_studio_light_02',
            label: 'Lumière de studio 1',
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
    ],
    ['Route et panneaux']: [],
    ['Cuisine']: [
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
    ],
    ['Nourritures et Boissons']: [
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
        },
        {
            model: 'bkr_prop_fakeid_pen_01a',
            label: 'Stylo 1',
        },
        {
            model: 'bkr_prop_fakeid_pen_02a',
            label: 'Stylo 2',
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
    ],
    ['Lumières']: [
        {
            model: 'bkr_prop_fakeid_desklamp_01a',
            label: 'Lampe de bureau 1',
        },
    ],
    ["Décoration d'intérieur"]: [
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
            model: 'ex_office_swag_pills',
            label: 'Médicaments 3',
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
    ],
    ['Affaires personnelles']: [
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
            label: 'Portefeuille 1',
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
            model: 'prop_binoc_01',
            label: 'Jumelles 1',
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
            model: 'prop_gaffer_tape',
            label: 'Rouleau de scotch',
        },
        {
            model: 'prop_inhaler_01',
            label: 'Inhalateur',
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
    ],
    ['Vases']: [],
    ['Garage']: [
        {
            model: 'prop_ld_jerrycan_01',
            label: 'Jerrican 1',
        },
    ],
    ['Plantes']: [
        {
            model: 'prop_single_rose',
            label: 'Rose',
            collision: false,
        },
    ],
};
