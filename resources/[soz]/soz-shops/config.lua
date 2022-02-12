Config = {}

Config.Products = {
    ["normal"] = {
        [1] = { name = "water_bottle", price = 2, amount = 50 },
        [2] = { name = "coffee", price = 2, amount = 50 },
        [3] = { name = "kurkakola", price = 2, amount = 50 },
        [4] = { name = "tosti", price = 2, amount = 50 },
        [5] = { name = "twerks_candy", price = 2, amount = 50 },
        [6] = { name = "snikkel_candy", price = 2, amount = 50 },
        [7] = { name = "sandwich", price = 2, amount = 50 },
        [8] = { name = "phone", price = 150, amount = 50 },
    },
    ["weapons"] = {
        [1] = { name = "weapon_knife", price = 250, amount = 250 },
        [2] = { name = "weapon_bat", price = 250, amount = 250 },
        [3] = { name = "weapon_hatchet", price = 250, amount = 250, requiredJob = { "mechanic", "police" } },
        [4] = { name = "weapon_pistol", price = 2500, amount = 5 },
        [5] = { name = "weapon_snspistol", price = 1500, amount = 5 },
        [6] = { name = "weapon_vintagepistol", price = 4000, amount = 5 },
        [7] = { name = "pistol_ammo", price = 250, amount = 250 },
    },
    ["tattoo"] = {
        {
            label = "ZONE_HEAD",
            products = {
                {
                    gfx = "TAT_BB_021",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "MP_Bea_M_Head_000",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_022",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "MP_Bea_M_Head_001",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_031",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "MP_Bea_M_Head_002",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_028",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "MP_Bea_M_Neck_000",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_029",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "MP_Bea_M_Neck_001",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_008",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Bea_F_Neck_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_009",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_009_M",
                        [1] = "MP_MP_Biker_Tat_009_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_038",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_038_M",
                        [1] = "MP_MP_Biker_Tat_038_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_051",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_051_M",
                        [1] = "MP_MP_Biker_Tat_051_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_005",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "MP_Buis_M_Neck_000",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_006",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "MP_Buis_M_Neck_001",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_007",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "MP_Buis_M_Neck_002",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_008",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "MP_Buis_M_Neck_003",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_F_007",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Buis_F_Neck_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_F_008",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Buis_F_Neck_001"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_007",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_007",
                        [1] = "MP_Xmas2_F_Tat_007"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_024",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_024",
                        [1] = "MP_Xmas2_F_Tat_024"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_025",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_025",
                        [1] = "MP_Xmas2_F_Tat_025"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_029",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_029",
                        [1] = "MP_Xmas2_F_Tat_029"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_003",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_003_M",
                        [1] = "MP_Gunrunning_Tattoo_003_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_000",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_000_M",
                        [1] = "mpHeist3_Tat_000_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_001",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_001_M",
                        [1] = "mpHeist3_Tat_001_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_002",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_002_M",
                        [1] = "mpHeist3_Tat_002_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_003",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_003_M",
                        [1] = "mpHeist3_Tat_003_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_004",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_004_M",
                        [1] = "mpHeist3_Tat_004_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_005",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_005_M",
                        [1] = "mpHeist3_Tat_005_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_006",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_006_M",
                        [1] = "mpHeist3_Tat_006_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_007",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_007_M",
                        [1] = "mpHeist3_Tat_007_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_008",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_008_M",
                        [1] = "mpHeist3_Tat_008_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_009",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_009_M",
                        [1] = "mpHeist3_Tat_009_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_010",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_010_M",
                        [1] = "mpHeist3_Tat_010_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_011",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_011_M",
                        [1] = "mpHeist3_Tat_011_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_012",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_012_M",
                        [1] = "mpHeist3_Tat_012_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_013",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_013_M",
                        [1] = "mpHeist3_Tat_013_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_014",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_014_M",
                        [1] = "mpHeist3_Tat_014_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_015",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_015_M",
                        [1] = "mpHeist3_Tat_015_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_016",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_016_M",
                        [1] = "mpHeist3_Tat_016_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_017",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_017_M",
                        [1] = "mpHeist3_Tat_017_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_018",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_018_M",
                        [1] = "mpHeist3_Tat_018_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_019",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_019_M",
                        [1] = "mpHeist3_Tat_019_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_020",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_020_M",
                        [1] = "mpHeist3_Tat_020_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_021",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_021_M",
                        [1] = "mpHeist3_Tat_021_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_022",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_022_M",
                        [1] = "mpHeist3_Tat_022_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_042",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_042_M",
                        [1] = "mpHeist3_Tat_042_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_043",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_043_M",
                        [1] = "mpHeist3_Tat_043_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_044",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_044_M",
                        [1] = "mpHeist3_Tat_044_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_005",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_005",
                        [1] = "FM_Hip_F_Tat_005"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_021",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_021",
                        [1] = "FM_Hip_F_Tat_021"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_001",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_001_M",
                        [1] = "MP_Security_Tat_001_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_002",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_002_M",
                        [1] = "MP_Security_Tat_002_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_027",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_027_M",
                        [1] = "MP_Security_Tat_027_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_011",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_011_M",
                        [1] = "MP_Smuggler_Tattoo_011_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_012",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_012_M",
                        [1] = "MP_Smuggler_Tattoo_012_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_000",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_Tat_000_M",
                        [1] = "MP_MP_Stunt_Tat_000_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_004",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_004_M",
                        [1] = "MP_MP_Stunt_tat_004_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_006",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_006_M",
                        [1] = "MP_MP_Stunt_tat_006_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_017",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_017_M",
                        [1] = "MP_MP_Stunt_tat_017_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_042",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_042_M",
                        [1] = "MP_MP_Stunt_tat_042_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_008",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_000",
                        [1] = "FM_Tat_Award_F_000"
                    },
                    price = 100
                }
            }
        },
        {
            label = "ZONE_TORSO",
            products = {
                {
                    gfx = "TAT_AR_000",
                    collection = "mpairraces_overlays",
                    overlay = {
                        [0] = "MP_Airraces_Tattoo_000_M",
                        [1] = "MP_Airraces_Tattoo_000_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_AR_001",
                    collection = "mpairraces_overlays",
                    overlay = {
                        [0] = "MP_Airraces_Tattoo_001_M",
                        [1] = "MP_Airraces_Tattoo_001_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_AR_002",
                    collection = "mpairraces_overlays",
                    overlay = {
                        [0] = "MP_Airraces_Tattoo_002_M",
                        [1] = "MP_Airraces_Tattoo_002_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_AR_004",
                    collection = "mpairraces_overlays",
                    overlay = {
                        [0] = "MP_Airraces_Tattoo_004_M",
                        [1] = "MP_Airraces_Tattoo_004_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_AR_005",
                    collection = "mpairraces_overlays",
                    overlay = {
                        [0] = "MP_Airraces_Tattoo_005_M",
                        [1] = "MP_Airraces_Tattoo_005_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_AR_006",
                    collection = "mpairraces_overlays",
                    overlay = {
                        [0] = "MP_Airraces_Tattoo_006_M",
                        [1] = "MP_Airraces_Tattoo_006_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_AR_007",
                    collection = "mpairraces_overlays",
                    overlay = {
                        [0] = "MP_Airraces_Tattoo_007_M",
                        [1] = "MP_Airraces_Tattoo_007_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_018",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "MP_Bea_M_Back_000",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_019",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "MP_Bea_M_Chest_000",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_020",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "MP_Bea_M_Chest_001",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_023",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "MP_Bea_M_Stom_000",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_032",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "MP_Bea_M_Stom_001",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_003",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Bea_F_Back_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_001",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Bea_F_Back_001"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_005",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Bea_F_Back_002"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_012",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Bea_F_Chest_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_013",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Bea_F_Chest_001"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_000",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Bea_F_Chest_002"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_006",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Bea_F_RSide_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_011",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Bea_F_Should_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_004",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Bea_F_Should_001"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_014",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Bea_F_Stom_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_009",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Bea_F_Stom_001"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_010",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Bea_F_Stom_002"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_000",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_000_M",
                        [1] = "MP_MP_Biker_Tat_000_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_001",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_001_M",
                        [1] = "MP_MP_Biker_Tat_001_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_003",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_003_M",
                        [1] = "MP_MP_Biker_Tat_003_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_005",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_005_M",
                        [1] = "MP_MP_Biker_Tat_005_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_006",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_006_M",
                        [1] = "MP_MP_Biker_Tat_006_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_008",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_008_M",
                        [1] = "MP_MP_Biker_Tat_008_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_010",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_010_M",
                        [1] = "MP_MP_Biker_Tat_010_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_011",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_011_M",
                        [1] = "MP_MP_Biker_Tat_011_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_013",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_013_M",
                        [1] = "MP_MP_Biker_Tat_013_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_017",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_017_M",
                        [1] = "MP_MP_Biker_Tat_017_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_018",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_018_M",
                        [1] = "MP_MP_Biker_Tat_018_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_019",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_019_M",
                        [1] = "MP_MP_Biker_Tat_019_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_021",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_021_M",
                        [1] = "MP_MP_Biker_Tat_021_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_023",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_023_M",
                        [1] = "MP_MP_Biker_Tat_023_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_026",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_026_M",
                        [1] = "MP_MP_Biker_Tat_026_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_029",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_029_M",
                        [1] = "MP_MP_Biker_Tat_029_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_030",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_030_M",
                        [1] = "MP_MP_Biker_Tat_030_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_031",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_031_M",
                        [1] = "MP_MP_Biker_Tat_031_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_032",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_032_M",
                        [1] = "MP_MP_Biker_Tat_032_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_034",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_034_M",
                        [1] = "MP_MP_Biker_Tat_034_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_039",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_039_M",
                        [1] = "MP_MP_Biker_Tat_039_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_041",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_041_M",
                        [1] = "MP_MP_Biker_Tat_041_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_043",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_043_M",
                        [1] = "MP_MP_Biker_Tat_043_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_050",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_050_M",
                        [1] = "MP_MP_Biker_Tat_050_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_052",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_052_M",
                        [1] = "MP_MP_Biker_Tat_052_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_058",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_058_M",
                        [1] = "MP_MP_Biker_Tat_058_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_059",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_059_M",
                        [1] = "MP_MP_Biker_Tat_059_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_060",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_060_M",
                        [1] = "MP_MP_Biker_Tat_060_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_011",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "MP_Buis_M_Stomach_000",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_001",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "MP_Buis_M_Chest_000",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_002",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "MP_Buis_M_Chest_001",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_000",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "MP_Buis_M_Back_000",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_F_002",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Buis_F_Chest_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_F_003",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Buis_F_Chest_001"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_F_004",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Buis_F_Chest_002"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_F_011",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Buis_F_Stom_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_F_012",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Buis_F_Stom_001"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_F_013",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Buis_F_Stom_002"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_F_000",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Buis_F_Back_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_F_001",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Buis_F_Back_001"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_000",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_000_M",
                        [1] = "MP_Christmas2017_Tattoo_000_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_002",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_002_M",
                        [1] = "MP_Christmas2017_Tattoo_002_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_003",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_003_M",
                        [1] = "MP_Christmas2017_Tattoo_003_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_005",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_005_M",
                        [1] = "MP_Christmas2017_Tattoo_005_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_008",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_008_M",
                        [1] = "MP_Christmas2017_Tattoo_008_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_009",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_009_M",
                        [1] = "MP_Christmas2017_Tattoo_009_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_010",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_010_M",
                        [1] = "MP_Christmas2017_Tattoo_010_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_011",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_011_M",
                        [1] = "MP_Christmas2017_Tattoo_011_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_015",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_015_M",
                        [1] = "MP_Christmas2017_Tattoo_015_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_016",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_016_M",
                        [1] = "MP_Christmas2017_Tattoo_016_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_019",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_019_M",
                        [1] = "MP_Christmas2017_Tattoo_019_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_020",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_020_M",
                        [1] = "MP_Christmas2017_Tattoo_020_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_021",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_021_M",
                        [1] = "MP_Christmas2017_Tattoo_021_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_022",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_022_M",
                        [1] = "MP_Christmas2017_Tattoo_022_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_024",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_024_M",
                        [1] = "MP_Christmas2017_Tattoo_024_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_026",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_026_M",
                        [1] = "MP_Christmas2017_Tattoo_026_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_027",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_027_M",
                        [1] = "MP_Christmas2017_Tattoo_027_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_AW_000",
                    collection = "mpchristmas2018_overlays",
                    overlay = {
                        [0] = "MP_Christmas2018_Tat_000_M",
                        [1] = "MP_Christmas2018_Tat_000_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_005",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_005",
                        [1] = "MP_Xmas2_F_Tat_005"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_006",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_006",
                        [1] = "MP_Xmas2_F_Tat_006"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_009",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_009",
                        [1] = "MP_Xmas2_F_Tat_009"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_011",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_011",
                        [1] = "MP_Xmas2_F_Tat_011"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_013",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_013",
                        [1] = "MP_Xmas2_F_Tat_013"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_015",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_015",
                        [1] = "MP_Xmas2_F_Tat_015"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_016",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_016",
                        [1] = "MP_Xmas2_F_Tat_016"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_017",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_017",
                        [1] = "MP_Xmas2_F_Tat_017"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_018",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_018",
                        [1] = "MP_Xmas2_F_Tat_018"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_019",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_019",
                        [1] = "MP_Xmas2_F_Tat_019"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_028",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_028",
                        [1] = "MP_Xmas2_F_Tat_028"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_000",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_000_M",
                        [1] = "MP_Gunrunning_Tattoo_000_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_001",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_001_M",
                        [1] = "MP_Gunrunning_Tattoo_001_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_009",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_009_M",
                        [1] = "MP_Gunrunning_Tattoo_009_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_010",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_010_M",
                        [1] = "MP_Gunrunning_Tattoo_010_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_012",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_012_M",
                        [1] = "MP_Gunrunning_Tattoo_012_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_013",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_013_M",
                        [1] = "MP_Gunrunning_Tattoo_013_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_014",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_014_M",
                        [1] = "MP_Gunrunning_Tattoo_014_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_017",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_017_M",
                        [1] = "MP_Gunrunning_Tattoo_017_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_018",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_018_M",
                        [1] = "MP_Gunrunning_Tattoo_018_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_019",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_019_M",
                        [1] = "MP_Gunrunning_Tattoo_019_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_020",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_020_M",
                        [1] = "MP_Gunrunning_Tattoo_020_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_022",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_022_M",
                        [1] = "MP_Gunrunning_Tattoo_022_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_028",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_028_M",
                        [1] = "MP_Gunrunning_Tattoo_028_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_029",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_029_M",
                        [1] = "MP_Gunrunning_Tattoo_029_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_023",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_023_M",
                        [1] = "mpHeist3_Tat_023_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_024",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_024_M",
                        [1] = "mpHeist3_Tat_024_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_025",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_025_M",
                        [1] = "mpHeist3_Tat_025_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_026",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_026_M",
                        [1] = "mpHeist3_Tat_026_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_027",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_027_M",
                        [1] = "mpHeist3_Tat_027_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_028",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_028_M",
                        [1] = "mpHeist3_Tat_028_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_029",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_029_M",
                        [1] = "mpHeist3_Tat_029_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_030",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_030_M",
                        [1] = "mpHeist3_Tat_030_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_033",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_033_M",
                        [1] = "mpHeist3_Tat_033_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_035",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_035_M",
                        [1] = "mpHeist3_Tat_035_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_036",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_036_M",
                        [1] = "mpHeist3_Tat_036_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_037",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_037_M",
                        [1] = "mpHeist3_Tat_037_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_038",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_038_M",
                        [1] = "mpHeist3_Tat_038_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_039",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_039_M",
                        [1] = "mpHeist3_Tat_039_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_004",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_004_M",
                        [1] = "MP_Heist4_Tat_004_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_013",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_013_M",
                        [1] = "MP_Heist4_Tat_013_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_014",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_014_M",
                        [1] = "MP_Heist4_Tat_014_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_015",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_015_M",
                        [1] = "MP_Heist4_Tat_015_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_016",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_016_M",
                        [1] = "MP_Heist4_Tat_016_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_017",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_017_M",
                        [1] = "MP_Heist4_Tat_017_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_018",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_018_M",
                        [1] = "MP_Heist4_Tat_018_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_019",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_019_M",
                        [1] = "MP_Heist4_Tat_019_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_020",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_020_M",
                        [1] = "MP_Heist4_Tat_020_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_021",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_021_M",
                        [1] = "MP_Heist4_Tat_021_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_022",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_022_M",
                        [1] = "MP_Heist4_Tat_022_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_023",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_023_M",
                        [1] = "MP_Heist4_Tat_023_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_030",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_030_M",
                        [1] = "MP_Heist4_Tat_030_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_000",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_000",
                        [1] = "FM_Hip_F_Tat_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_002",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_002",
                        [1] = "FM_Hip_F_Tat_002"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_006",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_006",
                        [1] = "FM_Hip_F_Tat_006"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_011",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_011",
                        [1] = "FM_Hip_F_Tat_011"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_012",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_012",
                        [1] = "FM_Hip_F_Tat_012"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_013",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_013",
                        [1] = "FM_Hip_F_Tat_013"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_024",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_024",
                        [1] = "FM_Hip_F_Tat_024"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_025",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_025",
                        [1] = "FM_Hip_F_Tat_025"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_029",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_029",
                        [1] = "FM_Hip_F_Tat_029"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_030",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_030",
                        [1] = "FM_Hip_F_Tat_030"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_031",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_031",
                        [1] = "FM_Hip_F_Tat_031"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_032",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_032",
                        [1] = "FM_Hip_F_Tat_032"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_033",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_033",
                        [1] = "FM_Hip_F_Tat_033"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_035",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_035",
                        [1] = "FM_Hip_F_Tat_035"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_041",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_041",
                        [1] = "FM_Hip_F_Tat_041"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_046",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_046",
                        [1] = "FM_Hip_F_Tat_046"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_047",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_047",
                        [1] = "FM_Hip_F_Tat_047"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_IE_000",
                    collection = "mpimportexport_overlays",
                    overlay = {
                        [0] = "MP_MP_ImportExport_Tat_000_M",
                        [1] = "MP_MP_ImportExport_Tat_000_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_IE_001",
                    collection = "mpimportexport_overlays",
                    overlay = {
                        [0] = "MP_MP_ImportExport_Tat_001_M",
                        [1] = "MP_MP_ImportExport_Tat_001_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_IE_002",
                    collection = "mpimportexport_overlays",
                    overlay = {
                        [0] = "MP_MP_ImportExport_Tat_002_M",
                        [1] = "MP_MP_ImportExport_Tat_002_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_IE_009",
                    collection = "mpimportexport_overlays",
                    overlay = {
                        [0] = "MP_MP_ImportExport_Tat_009_M",
                        [1] = "MP_MP_ImportExport_Tat_009_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_IE_010",
                    collection = "mpimportexport_overlays",
                    overlay = {
                        [0] = "MP_MP_ImportExport_Tat_010_M",
                        [1] = "MP_MP_ImportExport_Tat_010_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_IE_011",
                    collection = "mpimportexport_overlays",
                    overlay = {
                        [0] = "MP_MP_ImportExport_Tat_011_M",
                        [1] = "MP_MP_ImportExport_Tat_011_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S2_000",
                    collection = "mplowrider2_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_000_M",
                        [1] = "MP_LR_Tat_000_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S2_008",
                    collection = "mplowrider2_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_008_M",
                        [1] = "MP_LR_Tat_008_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S2_011",
                    collection = "mplowrider2_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_011_M",
                        [1] = "MP_LR_Tat_011_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S2_012",
                    collection = "mplowrider2_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_012_M",
                        [1] = "MP_LR_Tat_012_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S2_016",
                    collection = "mplowrider2_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_016_M",
                        [1] = "MP_LR_Tat_016_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S2_019",
                    collection = "mplowrider2_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_019_M",
                        [1] = "MP_LR_Tat_019_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S2_031",
                    collection = "mplowrider2_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_031_M",
                        [1] = "MP_LR_Tat_031_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S2_032",
                    collection = "mplowrider2_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_032_M",
                        [1] = "MP_LR_Tat_032_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S1_001",
                    collection = "mplowrider_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_001_M",
                        [1] = "MP_LR_Tat_001_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S1_002",
                    collection = "mplowrider_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_002_M",
                        [1] = "MP_LR_Tat_002_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S1_004",
                    collection = "mplowrider_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_004_M",
                        [1] = "MP_LR_Tat_004_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S1_009",
                    collection = "mplowrider_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_009_M",
                        [1] = "MP_LR_Tat_009_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S1_010",
                    collection = "mplowrider_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_010_M",
                        [1] = "MP_LR_Tat_010_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S1_013",
                    collection = "mplowrider_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_013_M",
                        [1] = "MP_LR_Tat_013_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S1_014",
                    collection = "mplowrider_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_014_M",
                        [1] = "MP_LR_Tat_014_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S1_021",
                    collection = "mplowrider_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_021_M",
                        [1] = "MP_LR_Tat_021_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S1_026",
                    collection = "mplowrider_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_026_M",
                        [1] = "MP_LR_Tat_026_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_L2_002",
                    collection = "mpluxe2_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_002_M",
                        [1] = "MP_LUXE_TAT_002_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_L2_012",
                    collection = "mpluxe2_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_012_M",
                        [1] = "MP_LUXE_TAT_012_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_L2_022",
                    collection = "mpluxe2_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_022_M",
                        [1] = "MP_LUXE_TAT_022_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_L2_025",
                    collection = "mpluxe2_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_025_M",
                        [1] = "MP_LUXE_TAT_025_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_L2_027",
                    collection = "mpluxe2_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_027_M",
                        [1] = "MP_LUXE_TAT_027_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_L2_029",
                    collection = "mpluxe2_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_029_M",
                        [1] = "MP_LUXE_TAT_029_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_LX_003",
                    collection = "mpluxe_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_003_M",
                        [1] = "MP_LUXE_TAT_003_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_LX_006",
                    collection = "mpluxe_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_006_M",
                        [1] = "MP_LUXE_TAT_006_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_LX_007",
                    collection = "mpluxe_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_007_M",
                        [1] = "MP_LUXE_TAT_007_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_LX_008",
                    collection = "mpluxe_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_008_M",
                        [1] = "MP_LUXE_TAT_008_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_LX_014",
                    collection = "mpluxe_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_014_M",
                        [1] = "MP_LUXE_TAT_014_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_LX_015",
                    collection = "mpluxe_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_015_M",
                        [1] = "MP_LUXE_TAT_015_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_LX_024",
                    collection = "mpluxe_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_024_M",
                        [1] = "MP_LUXE_TAT_024_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_004",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_004_M",
                        [1] = "MP_Security_Tat_004_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_008",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_008_M",
                        [1] = "MP_Security_Tat_008_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_013",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_013_M",
                        [1] = "MP_Security_Tat_013_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_014",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_014_M",
                        [1] = "MP_Security_Tat_014_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_015",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_015_M",
                        [1] = "MP_Security_Tat_015_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_016",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_016_M",
                        [1] = "MP_Security_Tat_016_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_017",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_017_M",
                        [1] = "MP_Security_Tat_017_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_018",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_018_M",
                        [1] = "MP_Security_Tat_018_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_024",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_024_M",
                        [1] = "MP_Security_Tat_024_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_025",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_025_M",
                        [1] = "MP_Security_Tat_025_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_026",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_026_M",
                        [1] = "MP_Security_Tat_026_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_000",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_000_M",
                        [1] = "MP_Smuggler_Tattoo_000_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_002",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_002_M",
                        [1] = "MP_Smuggler_Tattoo_002_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_003",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_003_M",
                        [1] = "MP_Smuggler_Tattoo_003_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_006",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_006_M",
                        [1] = "MP_Smuggler_Tattoo_006_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_007",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_007_M",
                        [1] = "MP_Smuggler_Tattoo_007_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_009",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_009_M",
                        [1] = "MP_Smuggler_Tattoo_009_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_010",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_010_M",
                        [1] = "MP_Smuggler_Tattoo_010_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_013",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_013_M",
                        [1] = "MP_Smuggler_Tattoo_013_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_015",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_015_M",
                        [1] = "MP_Smuggler_Tattoo_015_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_016",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_016_M",
                        [1] = "MP_Smuggler_Tattoo_016_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_017",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_017_M",
                        [1] = "MP_Smuggler_Tattoo_017_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_018",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_018_M",
                        [1] = "MP_Smuggler_Tattoo_018_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_019",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_019_M",
                        [1] = "MP_Smuggler_Tattoo_019_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_021",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_021_M",
                        [1] = "MP_Smuggler_Tattoo_021_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_022",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_022_M",
                        [1] = "MP_Smuggler_Tattoo_022_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_024",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_024_M",
                        [1] = "MP_Smuggler_Tattoo_024_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_025",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_025_M",
                        [1] = "MP_Smuggler_Tattoo_025_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_011",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_011_M",
                        [1] = "MP_MP_Stunt_tat_011_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_012",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_012_M",
                        [1] = "MP_MP_Stunt_tat_012_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_014",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_014_M",
                        [1] = "MP_MP_Stunt_tat_014_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_018",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_018_M",
                        [1] = "MP_MP_Stunt_tat_018_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_019",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_019_M",
                        [1] = "MP_MP_Stunt_tat_019_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_024",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_024_M",
                        [1] = "MP_MP_Stunt_tat_024_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_026",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_026_M",
                        [1] = "MP_MP_Stunt_tat_026_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_027",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_027_M",
                        [1] = "MP_MP_Stunt_tat_027_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_029",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_029_M",
                        [1] = "MP_MP_Stunt_tat_029_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_030",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_030_M",
                        [1] = "MP_MP_Stunt_tat_030_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_033",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_033_M",
                        [1] = "MP_MP_Stunt_tat_033_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_034",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_034_M",
                        [1] = "MP_MP_Stunt_tat_034_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_037",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_037_M",
                        [1] = "MP_MP_Stunt_tat_037_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_040",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_040_M",
                        [1] = "MP_MP_Stunt_tat_040_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_041",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_041_M",
                        [1] = "MP_MP_Stunt_tat_041_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_044",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_044_M",
                        [1] = "MP_MP_Stunt_tat_044_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_046",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_046_M",
                        [1] = "MP_MP_Stunt_tat_046_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_048",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_048_M",
                        [1] = "MP_MP_Stunt_tat_048_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_000",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_000_M",
                        [1] = "MP_Vinewood_Tat_000_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_001",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_001_M",
                        [1] = "MP_Vinewood_Tat_001_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_003",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_003_M",
                        [1] = "MP_Vinewood_Tat_003_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_006",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_006_M",
                        [1] = "MP_Vinewood_Tat_006_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_007",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_007_M",
                        [1] = "MP_Vinewood_Tat_007_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_008",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_008_M",
                        [1] = "MP_Vinewood_Tat_008_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_009",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_009_M",
                        [1] = "MP_Vinewood_Tat_009_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_010",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_010_M",
                        [1] = "MP_Vinewood_Tat_010_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_011",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_011_M",
                        [1] = "MP_Vinewood_Tat_011_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_012",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_012_M",
                        [1] = "MP_Vinewood_Tat_012_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_015",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_015_M",
                        [1] = "MP_Vinewood_Tat_015_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_016",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_016_M",
                        [1] = "MP_Vinewood_Tat_016_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_017",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_017_M",
                        [1] = "MP_Vinewood_Tat_017_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_021",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_021_M",
                        [1] = "MP_Vinewood_Tat_021_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_022",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_022_M",
                        [1] = "MP_Vinewood_Tat_022_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_023",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_023_M",
                        [1] = "MP_Vinewood_Tat_023_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_024",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_024_M",
                        [1] = "MP_Vinewood_Tat_024_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_029",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_029_M",
                        [1] = "MP_Vinewood_Tat_029_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_030",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_030_M",
                        [1] = "MP_Vinewood_Tat_030_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_031",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_031_M",
                        [1] = "MP_Vinewood_Tat_031_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_032",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_032_M",
                        [1] = "MP_Vinewood_Tat_032_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_011",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_003",
                        [1] = "FM_Tat_Award_F_003"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_012",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_004",
                        [1] = "FM_Tat_Award_F_004"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_013",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_005",
                        [1] = "FM_Tat_Award_F_005"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_016",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_008",
                        [1] = "FM_Tat_Award_F_008"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_019",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_011",
                        [1] = "FM_Tat_Award_F_011"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_020",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_012",
                        [1] = "FM_Tat_Award_F_012"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_021",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_013",
                        [1] = "FM_Tat_Award_F_013"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_022",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_014",
                        [1] = "FM_Tat_Award_F_014"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_024",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_016",
                        [1] = "FM_Tat_Award_F_016"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_025",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_017",
                        [1] = "FM_Tat_Award_F_017"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_026",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_018",
                        [1] = "FM_Tat_Award_F_018"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_027",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_019",
                        [1] = "FM_Tat_Award_F_019"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_219",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_004",
                        [1] = "FM_Tat_F_004"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_213",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_009",
                        [1] = "FM_Tat_F_009"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_218",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_010",
                        [1] = "FM_Tat_F_010"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_214",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_011",
                        [1] = "FM_Tat_F_011"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_220",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_012",
                        [1] = "FM_Tat_F_012"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_215",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_013",
                        [1] = "FM_Tat_F_013"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_216",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_016",
                        [1] = "FM_Tat_F_016"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_217",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_019",
                        [1] = "FM_Tat_F_019"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_221",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_020",
                        [1] = "FM_Tat_F_020"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_225",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_024",
                        [1] = "FM_Tat_F_024"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_226",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_025",
                        [1] = "FM_Tat_F_025"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_230",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_029",
                        [1] = "FM_Tat_F_029"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_231",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_030",
                        [1] = "FM_Tat_F_030"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_235",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_034",
                        [1] = "FM_Tat_F_034"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_237",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_036",
                        [1] = "FM_Tat_F_036"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_245",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_044",
                        [1] = "FM_Tat_F_044"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_246",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_045",
                        [1] = "FM_Tat_F_045"
                    },
                    price = 100
                }
            }
        },
        {
            label = "ZONE_LEFT_ARM",
            products = {
                {
                    gfx = "TAT_AR_003",
                    collection = "mpairraces_overlays",
                    overlay = {
                        [0] = "MP_Airraces_Tattoo_003_M",
                        [1] = "MP_Airraces_Tattoo_003_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_024",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "MP_Bea_M_LArm_000",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_017",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "MP_Bea_M_LArm_001",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_002",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Bea_F_LArm_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_016",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Bea_F_LArm_001"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_012",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_012_M",
                        [1] = "MP_MP_Biker_Tat_012_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_016",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_016_M",
                        [1] = "MP_MP_Biker_Tat_016_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_020",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_020_M",
                        [1] = "MP_MP_Biker_Tat_020_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_024",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_024_M",
                        [1] = "MP_MP_Biker_Tat_024_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_025",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_025_M",
                        [1] = "MP_MP_Biker_Tat_025_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_035",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_035_M",
                        [1] = "MP_MP_Biker_Tat_035_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_045",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_045_M",
                        [1] = "MP_MP_Biker_Tat_045_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_053",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_053_M",
                        [1] = "MP_MP_Biker_Tat_053_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_055",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_055_M",
                        [1] = "MP_MP_Biker_Tat_055_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_003",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "MP_Buis_M_LeftArm_000",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_004",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "MP_Buis_M_LeftArm_001",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_F_005",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Buis_F_LArm_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_001",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_001_M",
                        [1] = "MP_Christmas2017_Tattoo_001_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_004",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_004_M",
                        [1] = "MP_Christmas2017_Tattoo_004_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_007",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_007_M",
                        [1] = "MP_Christmas2017_Tattoo_007_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_013",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_013_M",
                        [1] = "MP_Christmas2017_Tattoo_013_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_025",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_025_M",
                        [1] = "MP_Christmas2017_Tattoo_025_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_029",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_029_M",
                        [1] = "MP_Christmas2017_Tattoo_029_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_000",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_000",
                        [1] = "MP_Xmas2_F_Tat_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_010",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_010",
                        [1] = "MP_Xmas2_F_Tat_010"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_012",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_012",
                        [1] = "MP_Xmas2_F_Tat_012"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_020",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_020",
                        [1] = "MP_Xmas2_F_Tat_020"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_021",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_021",
                        [1] = "MP_Xmas2_F_Tat_021"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_004",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_004_M",
                        [1] = "MP_Gunrunning_Tattoo_004_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_008",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_008_M",
                        [1] = "MP_Gunrunning_Tattoo_008_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_015",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_015_M",
                        [1] = "MP_Gunrunning_Tattoo_015_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_016",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_016_M",
                        [1] = "MP_Gunrunning_Tattoo_016_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_025",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_025_M",
                        [1] = "MP_Gunrunning_Tattoo_025_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_027",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_027_M",
                        [1] = "MP_Gunrunning_Tattoo_027_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_040",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_040_M",
                        [1] = "mpHeist3_Tat_040_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_041",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_041_M",
                        [1] = "mpHeist3_Tat_041_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_009",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_009_M",
                        [1] = "MP_Heist4_Tat_009_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_003",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_003",
                        [1] = "FM_Hip_F_Tat_003"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_007",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_007",
                        [1] = "FM_Hip_F_Tat_007"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_015",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_015",
                        [1] = "FM_Hip_F_Tat_015"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_016",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_016",
                        [1] = "FM_Hip_F_Tat_016"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_026",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_026",
                        [1] = "FM_Hip_F_Tat_026"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_027",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_027",
                        [1] = "FM_Hip_F_Tat_027"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_028",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_028",
                        [1] = "FM_Hip_F_Tat_028"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_034",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_034",
                        [1] = "FM_Hip_F_Tat_034"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_037",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_037",
                        [1] = "FM_Hip_F_Tat_037"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_039",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_039",
                        [1] = "FM_Hip_F_Tat_039"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_043",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_043",
                        [1] = "FM_Hip_F_Tat_043"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_048",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_048",
                        [1] = "FM_Hip_F_Tat_048"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_IE_004",
                    collection = "mpimportexport_overlays",
                    overlay = {
                        [0] = "MP_MP_ImportExport_Tat_004_M",
                        [1] = "MP_MP_ImportExport_Tat_004_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_IE_008",
                    collection = "mpimportexport_overlays",
                    overlay = {
                        [0] = "MP_MP_ImportExport_Tat_008_M",
                        [1] = "MP_MP_ImportExport_Tat_008_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S2_006",
                    collection = "mplowrider2_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_006_M",
                        [1] = "MP_LR_Tat_006_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S2_018",
                    collection = "mplowrider2_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_018_M",
                        [1] = "MP_LR_Tat_018_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S2_022",
                    collection = "mplowrider2_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_022_M",
                        [1] = "MP_LR_Tat_022_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S1_005",
                    collection = "mplowrider_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_005_M",
                        [1] = "MP_LR_Tat_005_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S1_027",
                    collection = "mplowrider_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_027_M",
                        [1] = "MP_LR_Tat_027_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S1_033",
                    collection = "mplowrider_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_033_M",
                        [1] = "MP_LR_Tat_033_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_L2_005",
                    collection = "mpluxe2_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_005_M",
                        [1] = "MP_LUXE_TAT_005_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_L2_016",
                    collection = "mpluxe2_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_016_M",
                        [1] = "MP_LUXE_TAT_016_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_L2_018",
                    collection = "mpluxe2_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_018_M",
                        [1] = "MP_LUXE_TAT_018_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_L2_028",
                    collection = "mpluxe2_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_028_M",
                        [1] = "MP_LUXE_TAT_028_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_L2_031",
                    collection = "mpluxe2_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_031_M",
                        [1] = "MP_LUXE_TAT_031_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_LX_009",
                    collection = "mpluxe_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_009_M",
                        [1] = "MP_LUXE_TAT_009_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_LX_020",
                    collection = "mpluxe_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_020_M",
                        [1] = "MP_LUXE_TAT_020_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_LX_021",
                    collection = "mpluxe_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_021_M",
                        [1] = "MP_LUXE_TAT_021_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_006",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_006_M",
                        [1] = "MP_Security_Tat_006_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_010",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_010_M",
                        [1] = "MP_Security_Tat_010_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_011",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_011_M",
                        [1] = "MP_Security_Tat_011_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_019",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_019_M",
                        [1] = "MP_Security_Tat_019_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_004",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_004_M",
                        [1] = "MP_Smuggler_Tattoo_004_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_008",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_008_M",
                        [1] = "MP_Smuggler_Tattoo_008_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_014",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_014_M",
                        [1] = "MP_Smuggler_Tattoo_014_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_001",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_001_M",
                        [1] = "MP_MP_Stunt_tat_001_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_002",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_002_M",
                        [1] = "MP_MP_Stunt_tat_002_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_008",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_008_M",
                        [1] = "MP_MP_Stunt_tat_008_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_022",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_022_M",
                        [1] = "MP_MP_Stunt_tat_022_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_023",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_023_M",
                        [1] = "MP_MP_Stunt_tat_023_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_035",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_035_M",
                        [1] = "MP_MP_Stunt_tat_035_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_039",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_039_M",
                        [1] = "MP_MP_Stunt_tat_039_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_043",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_043_M",
                        [1] = "MP_MP_Stunt_tat_043_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_002",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_002_M",
                        [1] = "MP_Vinewood_Tat_002_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_005",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_005_M",
                        [1] = "MP_Vinewood_Tat_005_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_014",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_014_M",
                        [1] = "MP_Vinewood_Tat_014_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_019",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_019_M",
                        [1] = "MP_Vinewood_Tat_019_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_026",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_026_M",
                        [1] = "MP_Vinewood_Tat_026_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_009",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_001",
                        [1] = "FM_Tat_Award_F_001"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_015",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_007",
                        [1] = "FM_Tat_Award_F_007"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_023",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_015",
                        [1] = "FM_Tat_Award_F_015"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_201",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_005",
                        [1] = "FM_Tat_F_005"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_202",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_006",
                        [1] = "FM_Tat_F_006"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_203",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_015",
                        [1] = "FM_Tat_F_015"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_232",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_031",
                        [1] = "FM_Tat_F_031"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_242",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_041",
                        [1] = "FM_Tat_F_041"
                    },
                    price = 100
                }
            }
        },
        {
            label = "ZONE_LEFT_LEG",
            products = {
                {
                    gfx = "TAT_BB_027",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "MP_Bea_M_Lleg_000",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_002",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_002_M",
                        [1] = "MP_MP_Biker_Tat_002_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_015",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_015_M",
                        [1] = "MP_MP_Biker_Tat_015_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_027",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_027_M",
                        [1] = "MP_MP_Biker_Tat_027_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_036",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_036_M",
                        [1] = "MP_MP_Biker_Tat_036_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_037",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_037_M",
                        [1] = "MP_MP_Biker_Tat_037_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_044",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_044_M",
                        [1] = "MP_MP_Biker_Tat_044_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_056",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_056_M",
                        [1] = "MP_MP_Biker_Tat_056_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_057",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_057_M",
                        [1] = "MP_MP_Biker_Tat_057_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_F_006",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Buis_F_LLeg_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_001",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_001",
                        [1] = "MP_Xmas2_F_Tat_001"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_002",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_002",
                        [1] = "MP_Xmas2_F_Tat_002"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_005",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_005_M",
                        [1] = "MP_Gunrunning_Tattoo_005_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_007",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_007_M",
                        [1] = "MP_Gunrunning_Tattoo_007_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_011",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_011_M",
                        [1] = "MP_Gunrunning_Tattoo_011_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_023",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_023_M",
                        [1] = "MP_Gunrunning_Tattoo_023_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_032",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_032_M",
                        [1] = "mpHeist3_Tat_032_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_010",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_010_M",
                        [1] = "MP_Heist4_Tat_010_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_024",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_024_M",
                        [1] = "MP_Heist4_Tat_024_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_025",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_025_M",
                        [1] = "MP_Heist4_Tat_025_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_028",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_028_M",
                        [1] = "MP_Heist4_Tat_028_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_029",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_029_M",
                        [1] = "MP_Heist4_Tat_029_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_009",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_009",
                        [1] = "FM_Hip_F_Tat_009"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_019",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_019",
                        [1] = "FM_Hip_F_Tat_019"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_040",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_040",
                        [1] = "FM_Hip_F_Tat_040"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S2_029",
                    collection = "mplowrider2_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_029_M",
                        [1] = "MP_LR_Tat_029_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S1_007",
                    collection = "mplowrider_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_007_M",
                        [1] = "MP_LR_Tat_007_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S1_020",
                    collection = "mplowrider_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_020_M",
                        [1] = "MP_LR_Tat_020_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_L2_011",
                    collection = "mpluxe2_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_011_M",
                        [1] = "MP_LUXE_TAT_011_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_LX_000",
                    collection = "mpluxe_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_000_M",
                        [1] = "MP_LUXE_TAT_000_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_022",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_022_M",
                        [1] = "MP_Security_Tat_022_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_023",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_023_M",
                        [1] = "MP_Security_Tat_023_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_007",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_007_M",
                        [1] = "MP_MP_Stunt_tat_007_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_013",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_013_M",
                        [1] = "MP_MP_Stunt_tat_013_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_021",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_021_M",
                        [1] = "MP_MP_Stunt_tat_021_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_028",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_028_M",
                        [1] = "MP_MP_Stunt_tat_028_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_031",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_031_M",
                        [1] = "MP_MP_Stunt_tat_031_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_013",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_013_M",
                        [1] = "MP_Vinewood_Tat_013_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_027",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_027_M",
                        [1] = "MP_Vinewood_Tat_027_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_017",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_009",
                        [1] = "FM_Tat_Award_F_009"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_209",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_002",
                        [1] = "FM_Tat_F_002"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_211",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_008",
                        [1] = "FM_Tat_F_008"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_222",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_021",
                        [1] = "FM_Tat_F_021"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_224",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_023",
                        [1] = "FM_Tat_F_023"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_227",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_026",
                        [1] = "FM_Tat_F_026"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_233",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_032",
                        [1] = "FM_Tat_F_032"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_234",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_033",
                        [1] = "FM_Tat_F_033"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_236",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_035",
                        [1] = "FM_Tat_F_035"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_238",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_037",
                        [1] = "FM_Tat_F_037"
                    },
                    price = 100
                }
            }
        },
        {
            label = "ZONE_RIGHT_LEG",
            products = {
                {
                    gfx = "TAT_BB_025",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "MP_Bea_M_Rleg_000",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_007",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Bea_F_RLeg_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_004",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_004_M",
                        [1] = "MP_MP_Biker_Tat_004_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_022",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_022_M",
                        [1] = "MP_MP_Biker_Tat_022_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_028",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_028_M",
                        [1] = "MP_MP_Biker_Tat_028_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_040",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_040_M",
                        [1] = "MP_MP_Biker_Tat_040_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_048",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_048_M",
                        [1] = "MP_MP_Biker_Tat_048_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_F_010",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Buis_F_RLeg_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_014",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_014",
                        [1] = "MP_Xmas2_F_Tat_014"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_006",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_006_M",
                        [1] = "MP_Gunrunning_Tattoo_006_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_026",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_026_M",
                        [1] = "MP_Gunrunning_Tattoo_026_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_030",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_030_M",
                        [1] = "MP_Gunrunning_Tattoo_030_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_031",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_031_M",
                        [1] = "mpHeist3_Tat_031_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_027",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_027_M",
                        [1] = "MP_Heist4_Tat_027_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_038",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_038",
                        [1] = "FM_Hip_F_Tat_038"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_042",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_042",
                        [1] = "FM_Hip_F_Tat_042"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S2_030",
                    collection = "mplowrider2_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_030_M",
                        [1] = "MP_LR_Tat_030_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S1_017",
                    collection = "mplowrider_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_017_M",
                        [1] = "MP_LR_Tat_017_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S1_023",
                    collection = "mplowrider_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_023_M",
                        [1] = "MP_LR_Tat_023_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_L2_023",
                    collection = "mpluxe2_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_023_M",
                        [1] = "MP_LUXE_TAT_023_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_LX_001",
                    collection = "mpluxe_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_001_M",
                        [1] = "MP_LUXE_TAT_001_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_003",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_003_M",
                        [1] = "MP_Security_Tat_003_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_021",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_021_M",
                        [1] = "MP_Security_Tat_021_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_020",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_020_M",
                        [1] = "MP_Smuggler_Tattoo_020_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_005",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_005_M",
                        [1] = "MP_MP_Stunt_tat_005_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_015",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_015_M",
                        [1] = "MP_MP_Stunt_tat_015_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_020",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_020_M",
                        [1] = "MP_MP_Stunt_tat_020_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_025",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_025_M",
                        [1] = "MP_MP_Stunt_tat_025_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_032",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_032_M",
                        [1] = "MP_MP_Stunt_tat_032_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_045",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_045_M",
                        [1] = "MP_MP_Stunt_tat_045_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_047",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_047_M",
                        [1] = "MP_MP_Stunt_tat_047_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_020",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_020_M",
                        [1] = "MP_Vinewood_Tat_020_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_014",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_006",
                        [1] = "FM_Tat_Award_F_006"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_210",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_007",
                        [1] = "FM_Tat_F_007"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_212",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_017",
                        [1] = "FM_Tat_F_017"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_223",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_022",
                        [1] = "FM_Tat_F_022"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_240",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_039",
                        [1] = "FM_Tat_F_039"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_241",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_040",
                        [1] = "FM_Tat_F_040"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_243",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_042",
                        [1] = "FM_Tat_F_042"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_244",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_043",
                        [1] = "FM_Tat_F_043"
                    },
                    price = 100
                }
            }
        },
        {
            label = "ZONE_RIGHT_ARM",
            products = {
                {
                    gfx = "TAT_BB_026",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "MP_Bea_M_RArm_000",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_030",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "MP_Bea_M_RArm_001",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BB_015",
                    collection = "mpbeach_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Bea_F_RArm_001"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_007",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_007_M",
                        [1] = "MP_MP_Biker_Tat_007_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_014",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_014_M",
                        [1] = "MP_MP_Biker_Tat_014_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_033",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_033_M",
                        [1] = "MP_MP_Biker_Tat_033_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_042",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_042_M",
                        [1] = "MP_MP_Biker_Tat_042_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_046",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_046_M",
                        [1] = "MP_MP_Biker_Tat_046_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_047",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_047_M",
                        [1] = "MP_MP_Biker_Tat_047_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_049",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_049_M",
                        [1] = "MP_MP_Biker_Tat_049_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BI_054",
                    collection = "mpbiker_overlays",
                    overlay = {
                        [0] = "MP_MP_Biker_Tat_054_M",
                        [1] = "MP_MP_Biker_Tat_054_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_009",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "MP_Buis_M_RightArm_000",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_010",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "MP_Buis_M_RightArm_001",
                        [1] = ""
                    },
                    price = 100
                },
                {
                    gfx = "TAT_BUS_F_009",
                    collection = "mpbusiness_overlays",
                    overlay = {
                        [0] = "",
                        [1] = "MP_Buis_F_RArm_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_006",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_006_M",
                        [1] = "MP_Christmas2017_Tattoo_006_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_012",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_012_M",
                        [1] = "MP_Christmas2017_Tattoo_012_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_014",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_014_M",
                        [1] = "MP_Christmas2017_Tattoo_014_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_017",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_017_M",
                        [1] = "MP_Christmas2017_Tattoo_017_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_018",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_018_M",
                        [1] = "MP_Christmas2017_Tattoo_018_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_023",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_023_M",
                        [1] = "MP_Christmas2017_Tattoo_023_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H27_028",
                    collection = "mpchristmas2017_overlays",
                    overlay = {
                        [0] = "MP_Christmas2017_Tattoo_028_M",
                        [1] = "MP_Christmas2017_Tattoo_028_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_003",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_003",
                        [1] = "MP_Xmas2_F_Tat_003"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_004",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_004",
                        [1] = "MP_Xmas2_F_Tat_004"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_008",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_008",
                        [1] = "MP_Xmas2_F_Tat_008"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_022",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_022",
                        [1] = "MP_Xmas2_F_Tat_022"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_023",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_023",
                        [1] = "MP_Xmas2_F_Tat_023"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_026",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_026",
                        [1] = "MP_Xmas2_F_Tat_026"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_X2_027",
                    collection = "mpchristmas2_overlays",
                    overlay = {
                        [0] = "MP_Xmas2_M_Tat_027",
                        [1] = "MP_Xmas2_F_Tat_027"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_002",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_002_M",
                        [1] = "MP_Gunrunning_Tattoo_002_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_021",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_021_M",
                        [1] = "MP_Gunrunning_Tattoo_021_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_GR_024",
                    collection = "mpgunrunning_overlays",
                    overlay = {
                        [0] = "MP_Gunrunning_Tattoo_024_M",
                        [1] = "MP_Gunrunning_Tattoo_024_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H3_034",
                    collection = "mpheist3_overlays",
                    overlay = {
                        [0] = "mpHeist3_Tat_034_M",
                        [1] = "mpHeist3_Tat_034_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_000",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_000_M",
                        [1] = "MP_Heist4_Tat_000_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_001",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_001_M",
                        [1] = "MP_Heist4_Tat_001_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_002",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_002_M",
                        [1] = "MP_Heist4_Tat_002_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_003",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_003_M",
                        [1] = "MP_Heist4_Tat_003_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_005",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_005_M",
                        [1] = "MP_Heist4_Tat_005_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_006",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_006_M",
                        [1] = "MP_Heist4_Tat_006_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_007",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_007_M",
                        [1] = "MP_Heist4_Tat_007_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_008",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_008_M",
                        [1] = "MP_Heist4_Tat_008_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_011",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_011_M",
                        [1] = "MP_Heist4_Tat_011_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_012",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_012_M",
                        [1] = "MP_Heist4_Tat_012_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_026",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_026_M",
                        [1] = "MP_Heist4_Tat_026_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_031",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_031_M",
                        [1] = "MP_Heist4_Tat_031_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_H4_032",
                    collection = "mpheist4_overlays",
                    overlay = {
                        [0] = "MP_Heist4_Tat_032_M",
                        [1] = "MP_Heist4_Tat_032_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_001",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_001",
                        [1] = "FM_Hip_F_Tat_001"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_004",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_004",
                        [1] = "FM_Hip_F_Tat_004"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_008",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_008",
                        [1] = "FM_Hip_F_Tat_008"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_010",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_010",
                        [1] = "FM_Hip_F_Tat_010"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_014",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_014",
                        [1] = "FM_Hip_F_Tat_014"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_017",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_017",
                        [1] = "FM_Hip_F_Tat_017"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_018",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_018",
                        [1] = "FM_Hip_F_Tat_018"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_020",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_020",
                        [1] = "FM_Hip_F_Tat_020"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_022",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_022",
                        [1] = "FM_Hip_F_Tat_022"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_023",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_023",
                        [1] = "FM_Hip_F_Tat_023"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_036",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_036",
                        [1] = "FM_Hip_F_Tat_036"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_044",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_044",
                        [1] = "FM_Hip_F_Tat_044"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_HP_045",
                    collection = "mphipster_overlays",
                    overlay = {
                        [0] = "FM_Hip_M_Tat_045",
                        [1] = "FM_Hip_F_Tat_045"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_IE_003",
                    collection = "mpimportexport_overlays",
                    overlay = {
                        [0] = "MP_MP_ImportExport_Tat_003_M",
                        [1] = "MP_MP_ImportExport_Tat_003_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_IE_005",
                    collection = "mpimportexport_overlays",
                    overlay = {
                        [0] = "MP_MP_ImportExport_Tat_005_M",
                        [1] = "MP_MP_ImportExport_Tat_005_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_IE_006",
                    collection = "mpimportexport_overlays",
                    overlay = {
                        [0] = "MP_MP_ImportExport_Tat_006_M",
                        [1] = "MP_MP_ImportExport_Tat_006_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_IE_007",
                    collection = "mpimportexport_overlays",
                    overlay = {
                        [0] = "MP_MP_ImportExport_Tat_007_M",
                        [1] = "MP_MP_ImportExport_Tat_007_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S2_003",
                    collection = "mplowrider2_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_003_M",
                        [1] = "MP_LR_Tat_003_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S2_028",
                    collection = "mplowrider2_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_028_M",
                        [1] = "MP_LR_Tat_028_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S2_035",
                    collection = "mplowrider2_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_035_M",
                        [1] = "MP_LR_Tat_035_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_S1_015",
                    collection = "mplowrider_overlays",
                    overlay = {
                        [0] = "MP_LR_Tat_015_M",
                        [1] = "MP_LR_Tat_015_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_L2_010",
                    collection = "mpluxe2_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_010_M",
                        [1] = "MP_LUXE_TAT_010_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_L2_017",
                    collection = "mpluxe2_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_017_M",
                        [1] = "MP_LUXE_TAT_017_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_L2_026",
                    collection = "mpluxe2_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_026_M",
                        [1] = "MP_LUXE_TAT_026_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_L2_030",
                    collection = "mpluxe2_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_030_M",
                        [1] = "MP_LUXE_TAT_030_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_LX_004",
                    collection = "mpluxe_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_004_M",
                        [1] = "MP_LUXE_TAT_004_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_LX_013",
                    collection = "mpluxe_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_013_M",
                        [1] = "MP_LUXE_TAT_013_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_LX_019",
                    collection = "mpluxe_overlays",
                    overlay = {
                        [0] = "MP_LUXE_TAT_019_M",
                        [1] = "MP_LUXE_TAT_019_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_000",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_000_M",
                        [1] = "MP_Security_Tat_000_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_005",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_005_M",
                        [1] = "MP_Security_Tat_005_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_007",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_007_M",
                        [1] = "MP_Security_Tat_007_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_009",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_009_M",
                        [1] = "MP_Security_Tat_009_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_012",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_012_M",
                        [1] = "MP_Security_Tat_012_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FX_020",
                    collection = "mpsecurity_overlays",
                    overlay = {
                        [0] = "MP_Security_Tat_020_M",
                        [1] = "MP_Security_Tat_020_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_001",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_001_M",
                        [1] = "MP_Smuggler_Tattoo_001_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_005",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_005_M",
                        [1] = "MP_Smuggler_Tattoo_005_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_SM_023",
                    collection = "mpsmuggler_overlays",
                    overlay = {
                        [0] = "MP_Smuggler_Tattoo_023_M",
                        [1] = "MP_Smuggler_Tattoo_023_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_003",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_003_M",
                        [1] = "MP_MP_Stunt_tat_003_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_009",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_009_M",
                        [1] = "MP_MP_Stunt_tat_009_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_010",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_010_M",
                        [1] = "MP_MP_Stunt_tat_010_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_016",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_016_M",
                        [1] = "MP_MP_Stunt_tat_016_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_036",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_036_M",
                        [1] = "MP_MP_Stunt_tat_036_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_038",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_038_M",
                        [1] = "MP_MP_Stunt_tat_038_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_ST_049",
                    collection = "mpstunt_overlays",
                    overlay = {
                        [0] = "MP_MP_Stunt_tat_049_M",
                        [1] = "MP_MP_Stunt_tat_049_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_004",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_004_M",
                        [1] = "MP_Vinewood_Tat_004_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_018",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_018_M",
                        [1] = "MP_Vinewood_Tat_018_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_025",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_025_M",
                        [1] = "MP_Vinewood_Tat_025_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_VW_028",
                    collection = "mpvinewood_overlays",
                    overlay = {
                        [0] = "MP_Vinewood_Tat_028_M",
                        [1] = "MP_Vinewood_Tat_028_F"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_010",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_002",
                        [1] = "FM_Tat_Award_F_002"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_018",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_Award_M_010",
                        [1] = "FM_Tat_Award_F_010"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_204",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_000",
                        [1] = "FM_Tat_F_000"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_205",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_001",
                        [1] = "FM_Tat_F_001"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_206",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_003",
                        [1] = "FM_Tat_F_003"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_207",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_014",
                        [1] = "FM_Tat_F_014"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_208",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_018",
                        [1] = "FM_Tat_F_018"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_228",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_027",
                        [1] = "FM_Tat_F_027"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_229",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_028",
                        [1] = "FM_Tat_F_028"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_239",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_038",
                        [1] = "FM_Tat_F_038"
                    },
                    price = 100
                },
                {
                    gfx = "TAT_FM_247",
                    collection = "multiplayer_overlays",
                    overlay = {
                        [0] = "FM_Tat_M_047",
                        [1] = "FM_Tat_F_047"
                    },
                    price = 100
                }
            }
        },
    },
}

local shopConfig = {
    ["247"] = { label = "Supérette", type = "shop", blip = { sprite = 52, color = 2 }, pedModel = "ig_ashley" },
    ["ltd"] = { label = "Supérette", type = "shop", blip = { sprite = 52, color = 2 }, pedModel = "s_m_m_autoshop_02" },
    ["liquor"] = { label = "Supérette", type = "shop", blip = { sprite = 52, color = 2 }, pedModel = "a_m_m_genfat_02" },
    ["ammunation"] = { label = "Ammu-Nation", type = "weapon", blip = { sprite = 110, color = 17 }, pedModel = "s_m_y_ammucity_01" },
    ["tattoo"] = { label = "Tatoueur", type = "tattoo", blip = { sprite = 75, color = 1 }, pedModel = "u_m_y_tattoo_01" },
}

Config.Locations = {
    -- 24/7 Locations
    ["247supermarket"] = {
        label = shopConfig["247"].label,
        coords = vector4(24.14, -1347.22, 29.5, 273.39),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
        type = shopConfig["247"].type,
    },
    ["247supermarket2"] = {
        label = shopConfig["247"].label,
        coords = vector4(-3038.86, 584.36, 7.91, 22.65),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
        type = shopConfig["247"].type,
    },
    ["247supermarket3"] = {
        label = shopConfig["247"].label,
        coords = vector4(-3242.29, 999.76, 12.83, 0.41),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
        type = shopConfig["247"].type,
    },
    ["247supermarket4"] = {
        label = shopConfig["247"].label,
        coords = vector4(1727.7, 6415.4, 35.04, 237.95),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
        type = shopConfig["247"].type,
    },
    ["247supermarket5"] = {
        label = shopConfig["247"].label,
        coords = vector4(1959.84, 3739.86, 32.34, 299.67),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
        type = shopConfig["247"].type,
    },
    ["247supermarket6"] = {
        label = shopConfig["247"].label,
        coords = vector4(549.28, 2671.37, 42.16, 98.65),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
        type = shopConfig["247"].type,
    },
    ["247supermarket7"] = {
        label = shopConfig["247"].label,
        coords = vector4(2677.93, 3279.31, 55.24, 333.41),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
        type = shopConfig["247"].type,
    },
    ["247supermarket8"] = {
        label = shopConfig["247"].label,
        coords = vector4(2557.18, 380.64, 108.62, 1.74),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
        type = shopConfig["247"].type,
    },
    ["247supermarket9"] = {
        label = shopConfig["247"].label,
        coords = vector4(372.45, 326.52, 103.57, 254.29),
        products = Config.Products["normal"],
        blip = shopConfig["247"].blip,
        pedModel = shopConfig["247"].pedModel,
        type = shopConfig["247"].type,
    },

    -- LTD Gasoline Locations
    ["ltdgasoline"] = {
        label = shopConfig["ltd"].label,
        coords = vector4(-46.7, -1757.9, 29.42, 49.1),
        products = Config.Products["normal"],
        blip = shopConfig["ltd"].blip,
        pedModel = shopConfig["ltd"].pedModel,
        type = shopConfig["ltd"].type,
    },
    ["ltdgasoline2"] = {
        label = shopConfig["ltd"].label,
        coords = vector4(-706.16, -913.5, 19.22, 88.63),
        products = Config.Products["normal"],
        blip = shopConfig["ltd"].blip,
        pedModel = shopConfig["ltd"].pedModel,
        type = shopConfig["ltd"].type,
    },
    ["ltdgasoline3"] = {
        label = shopConfig["ltd"].label,
        coords = vector4(-1820.21, 794.29, 138.09, 126.03),
        products = Config.Products["normal"],
        blip = shopConfig["ltd"].blip,
        pedModel = shopConfig["ltd"].pedModel,
        type = shopConfig["ltd"].type,
    },
    ["ltdgasoline4"] = {
        label = shopConfig["ltd"].label,
        coords = vector4(1164.68, -322.59, 69.21, 110.25),
        products = Config.Products["normal"],
        blip = shopConfig["ltd"].blip,
        pedModel = shopConfig["ltd"].pedModel,
        type = shopConfig["ltd"].type,
    },
    ["ltdgasoline5"] = {
        label = shopConfig["ltd"].label,
        coords = vector4(1698.2, 4922.86, 42.06, 324.94),
        products = Config.Products["normal"],
        blip = shopConfig["ltd"].blip,
        pedModel = shopConfig["ltd"].pedModel,
        type = shopConfig["ltd"].type,
    },

    -- Rob's Liquor Locations
    ["robsliquor"] = {
        label = shopConfig["liquor"].label,
        coords = vector4(-1222.01, -908.37, 12.33, 31.52),
        products = Config.Products["normal"],
        blip = shopConfig["liquor"].blip,
        pedModel = shopConfig["liquor"].pedModel,
        type = shopConfig["liquor"].type,
    },
    ["robsliquor2"] = {
        label = shopConfig["liquor"].label,
        coords = vector4(-1486.2, -378.01, 40.16, 135.93),
        products = Config.Products["normal"],
        blip = shopConfig["liquor"].blip,
        pedModel = shopConfig["liquor"].pedModel,
        type = shopConfig["liquor"].type,
    },
    ["robsliquor3"] = {
        label = shopConfig["liquor"].label,
        coords = vector4(-2966.38, 390.94, 15.04, 86.14),
        products = Config.Products["normal"],
        blip = shopConfig["liquor"].blip,
        pedModel = shopConfig["liquor"].pedModel,
        type = shopConfig["liquor"].type,
    },
    ["robsliquor4"] = {
        label = shopConfig["liquor"].label,
        coords = vector4(1165.93, 2710.81, 38.16, 180.89),
        products = Config.Products["normal"],
        blip = shopConfig["liquor"].blip,
        pedModel = shopConfig["liquor"].pedModel,
        type = shopConfig["liquor"].type,
    },
    ["robsliquor5"] = {
        label = shopConfig["liquor"].label,
        coords = vector4(1134.15, -982.51, 46.42, 281.3),
        products = Config.Products["normal"],
        blip = shopConfig["liquor"].blip,
        pedModel = shopConfig["liquor"].pedModel,
        type = shopConfig["liquor"].type,
    },

    -- Ammu-Nation Locations
    ["ammunation"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(-661.61, -933.49, 21.83, 176.46),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
        type = shopConfig["ammunation"].type,
    },
    ["ammunation2"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(809.58, -2159.08, 29.62, 359.76),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
        type = shopConfig["ammunation"].type,
    },
    ["ammunation3"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(1692.65, 3761.4, 34.71, 225.95),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
        type = shopConfig["ammunation"].type,
    },
    ["ammunation4"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(-331.22, 6085.34, 31.45, 225.39),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
        type = shopConfig["ammunation"].type,
    },
    ["ammunation5"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(253.6, -51.11, 69.94, 64.6),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
        type = shopConfig["ammunation"].type,
    },
    ["ammunation6"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(23.06, -1105.72, 29.8, 162.29),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
        type = shopConfig["ammunation"].type,
    },
    ["ammunation7"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(2567.43, 292.62, 108.73, 1.02),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
        type = shopConfig["ammunation"].type,
    },
    ["ammunation8"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(-1118.56, 2700.09, 18.55, 229.33),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
        type = shopConfig["ammunation"].type,
    },
    ["ammunation9"] = {
        label = shopConfig["ammunation"].label,
        coords = vector4(841.8, -1035.26, 28.19, 356.67),
        products = Config.Products["weapons"],
        blip = shopConfig["ammunation"].blip,
        pedModel = shopConfig["ammunation"].pedModel,
        type = shopConfig["ammunation"].type,
    },

    -- TattooShop Locations
    ["tattooshop"] = {
        label = shopConfig["tattoo"].label,
        coords = vector4(319.67, 181.11, 103.59, 248.97),
        inShopCoords = vector4(324.69, 180.53, 103.59, 134.05),
        products = Config.Products["tattoo"],
        blip = shopConfig["tattoo"].blip,
        pedModel = shopConfig["tattoo"].pedModel,
        type = shopConfig["tattoo"].type,
    },
}
