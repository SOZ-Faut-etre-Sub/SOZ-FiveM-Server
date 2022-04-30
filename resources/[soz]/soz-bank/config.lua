Config = {}

Config.PayCheckTimeOut = 15
Config.MoneyCaseTrigger = 5000

Config.OffShoreMaxWashAmount = math.random(50000, 150000)

Config.DefaultAccountMoney = {["player"] = 5000, ["business"] = 100000}

Config.ErrorMessage = {
    ["unknown"] = "Erreur de la banque !",
    ["action_forbidden"] = "Vous n'avez pas de droit de faire cette action !",
    ["invalid_account"] = "Le compte n'existe pas !",
    ["already_exist"] = "Le compte existe déjà !",
    ["transfert_failed"] = "Le transfer a subis une erreur !",
    ["no_account_money"] = "Le compte ne possède pas assez d'argent !",
    ["invalid_liquidity"] = "Liquidité insuffisante à ce terminal",
    ["max_widthdrawal_limit"] = "Vous ne pouvez pas retirer plus de ~b~$%s~s~ depuis ce terminal",
    ["limit"] = "Limite de retait atteinte : max. ~b~$%i~s~ par tranche de %i minutes. ",
    ["withdrawal_limit"] = "~b~$%i~s~ retirables.",
    ["time_limit"] = "Revenez dans ~b~%i minutes~s~.",
}

Config.FarmAccountMoney = {
    ["farm_news"] = {money = 50000, marked_money = 0},
    ["farm_stonk"] = {money = 2000000, marked_money = 0},
}

Config.SafeStorages = {
    ["safe_cash-transfer"] = {
        label = "Coffre STONK Depository",
        owner = "cash-transfer",
        position = vector3(-33.94, -715.14, 40.62),
        size = vector2(1.0, 3.0),
        heading = 113.9,
    },
    ["safe_lspd"] = {
        label = "Coffre LSPD",
        owner = "lspd",
        position = vector3(622.21, -30.71, 90.51),
        size = vec2(1.0, 2.5),
        heading = 160.0,
    },
    ["safe_bcso"] = {
        label = "Coffre BCSO",
        owner = "bcso",
        position = vector3(1855.94, 3690.49, 37.75),
        size = vec2(1.0, 2.5),
        heading = 120.0,
    },
    ["safe_lsmc"] = {
        label = "Coffre LSMC",
        owner = "lsmc",
        position = vector3(311.04, -1424.3, 32.51),
        size = vec2(0.8, 1.95),
        heading = 320,
    },
    ["safe_news"] = {
        label = "Coffre Twitch News",
        owner = "news",
        position = vector3(-575.83, -937.5, 28.7),
        size = vec2(1.3, 2.5),
    },
    ["safe_garbage"] = {
        label = "Coffre BlueBird",
        owner = "garbage",
        position = vector3(-623.89, -1616.37, 33.01),
        size = vec2(0.2, 1.8),
        heading = 354,
        offsetUpZ = 1.5,
    },
    ["safe_taxi"] = {
        label = "Coffre Carl'jr",
        owner = "taxi",
        position = vector3(907.77, -149.83, 74.17),
        size = vec2(0.4, 1.4),
        heading = 328,
        offsetUpZ = 2.2,
    },
}

Config.ATMModels = {
    ["prop_atm_01"] = "small",
    ["prop_atm_02"] = "big",
    ["prop_atm_03"] = "big",
    ["prop_fleeca_atm"] = "big",
}

Config.BankPedLocations = {
    ["pacific1"] = vector4(243.63, 226.24, 106.29, 158.33),
    ["pacific2"] = vector4(247.04, 224.99, 106.29, 157.44),
    ["pacific3"] = vector4(252.19, 223.16, 106.29, 160.18),
    ["fleeca1"] = vector4(149.42, -1042.15, 29.37, 340.3),
    ["fleeca2"] = vector4(313.79, -280.53, 54.16, 341.82),
    ["fleeca3"] = vector4(-351.3, -51.3, 49.04, 342.4),
    ["fleeca4"] = vector4(-1211.96, -331.94, 37.78, 23.77),
    ["fleeca5"] = vector4(-2961.13, 482.98, 15.7, 85.95),
    ["fleeca6"] = vector4(1175.01, 2708.3, 38.09, 176.68),
    ["fleeca7"] = vector4(-112.26, 6471.04, 31.63, 132.8),
}

Config.BankAtmDefault = {
    ["pacific"] = {
        maxMoney = 600000,
        maxWithdrawal = 100000,
        limit = 600000, -- in ms
    },
    ["fleeca"] = {
        maxMoney = 100000,
        maxWithdrawal = 10000,
        limit = 600000, -- in ms
    },
    ["big"] = {
        maxMoney = 20000,
        maxWithdrawal = 1000,
        limit = 600000, -- in ms
    },
    ["small"] = {
        maxMoney = 5000,
        maxWithdrawal = 500,
        limit = 600000, -- in ms
    },
}

Config.AtmLocations = {
    {accountId = "atm_big_1634972506", coords = {x = -3241.455, y = 997.9085}},
    {accountId = "atm_small_1855854659", coords = {x = -3144.887, y = 1127.811}},
    {accountId = "atm_big_-240811233", coords = {x = -3043.835, y = 594.1639}},
    {accountId = "atm_big_-1856027119", coords = {x = -2974.586, y = 380.1269}},
    {accountId = "atm_big_989148083", coords = {x = -2958.977, y = 487.3071}},
    {accountId = "atm_big_271713063", coords = {x = -2956.848, y = 487.2158}},
    {accountId = "atm_big_-962794372", coords = {x = -2295.853, y = 357.9348}},
    {accountId = "atm_big_987045899", coords = {x = -2295.069, y = 356.2556}},
    {accountId = "atm_big_-1637542684", coords = {x = -2294.311, y = 354.6056}},
    {accountId = "atm_big_735194508", coords = {x = -2071.928, y = -317.2862}},
    {accountId = "atm_big_1839712771", coords = {x = -1570.765, y = -547.7035}},
    {accountId = "atm_big_697321881", coords = {x = -1569.841, y = -547.0309}},
    {accountId = "atm_small_-281473463", coords = {x = -1430.663, y = -211.3587}},
    {accountId = "atm_small_-173538119", coords = {x = -1415.481, y = -212.3324}},
    {accountId = "atm_big_683484861", coords = {x = -1410.736, y = -98.92789}},
    {accountId = "atm_big_1318647156", coords = {x = -1410.183, y = -100.6454}},
    {accountId = "atm_big_-256264141", coords = {x = -1315.416, y = -834.431}},
    {accountId = "atm_big_1206976348", coords = {x = -1314.466, y = -835.6913}},
    {accountId = "atm_big_1603908035", coords = {x = -1305.708, y = -706.6881}},
    {accountId = "atm_small_1799303130", coords = {x = -1289.742, y = -227.165}},
    {accountId = "atm_small_-1496899310", coords = {x = -1286.704, y = -213.7827}},
    {accountId = "atm_small_-1195324938", coords = {x = -1285.136, y = -223.9422}},
    {accountId = "atm_small_-878997031", coords = {x = -1282.098, y = -210.5599}},
    {accountId = "atm_big_-1233725575", coords = {x = -1206.142, y = -325.0316}},
    {accountId = "atm_big_-1798666306", coords = {x = -1205.378, y = -326.5286}},
    {accountId = "atm_small_1558276123", coords = {x = -1110.228, y = -1691.154}},
    {accountId = "atm_small_-1216325514", coords = {x = -1091.887, y = 2709.053}},
    {accountId = "atm_small_-1663557416", coords = {x = -1044.466, y = -2739.641}},
    {accountId = "atm_big_51392298", coords = {x = -867.9745, y = -186.3419}},
    {accountId = "atm_big_1322795916", coords = {x = -867.013, y = -187.9928}},
    {accountId = "atm_big_809238812", coords = {x = -847.204, y = -340.4291}},
    {accountId = "atm_big_-2062538286", coords = {x = -846.6537, y = -341.509}},
    {accountId = "atm_big_2125698499", coords = {x = -821.8936, y = -1081.555}},
    {accountId = "atm_big_-1697309195", coords = {x = -720.6288, y = -415.5243}},
    {accountId = "atm_big_1125361186", coords = {x = -712.9357, y = -818.4827}},
    {accountId = "atm_big_1152134768", coords = {x = -710.0828, y = -818.4756}},
    {accountId = "atm_big_2029025428", coords = {x = -660.6763, y = -854.4882}},
    {accountId = "atm_big_-1328346503", coords = {x = -617.8035, y = -708.8591}},
    {accountId = "atm_big_-1147992833", coords = {x = -617.8035, y = -706.8521}},
    {accountId = "atm_big_2110283938", coords = {x = -614.5187, y = -705.5981}},
    {accountId = "atm_big_-961889096", coords = {x = -611.8581, y = -705.5981}},
    {accountId = "atm_big_-1484531863", coords = {x = -596.1251, y = -1160.851}},
    {accountId = "atm_big_1318036671", coords = {x = -594.6144, y = -1160.852}},
    {accountId = "atm_big_-1215420232", coords = {x = -537.8052, y = -854.9357}},
    {accountId = "atm_big_-1195274668", coords = {x = -526.7791, y = -1223.374}},
    {accountId = "atm_big_-2126496766", coords = {x = -386.4596, y = 6046.411}},
    {accountId = "atm_big_542704114", coords = {x = -303.2257, y = -829.3121}},
    {accountId = "atm_big_1378866546", coords = {x = -301.6573, y = -829.5886}},
    {accountId = "atm_big_2039786242", coords = {x = -282.7141, y = 6226.4311}},
    {accountId = "atm_big_404989754", coords = {x = -259.2767, y = -723.2652}},
    {accountId = "atm_big_-2054737893", coords = {x = -256.6386, y = -715.8898}},
    {accountId = "atm_big_1223259268", coords = {x = -254.5219, y = -692.8869}},
    {accountId = "atm_big_-979756049", coords = {x = -204.0193, y = -861.0091}},
    {accountId = "atm_big_1379698393", coords = {x = -165.5844, y = 234.7659}},
    {accountId = "atm_big_1930385996", coords = {x = -165.5844, y = 232.6955}},
    {accountId = "atm_big_753906383", coords = {x = -132.6663, y = 6366.876}},
    {accountId = "atm_big_-865137478", coords = {x = -97.63721, y = 6455.732}},
    {accountId = "atm_big_-1254931541", coords = {x = -95.87029, y = 6457.462}},
    {accountId = "atm_small_-1052670178", coords = {x = -57.17029, y = -92.37918}},
    {accountId = "atm_big_-1262459121", coords = {x = -30.09957, y = -723.2863}},
    {accountId = "atm_big_97854004", coords = {x = -27.89034, y = -724.1089}},
    {accountId = "atm_big_226458362", coords = {x = 5.686035, y = -919.9551}},
    {accountId = "atm_big_1131566868", coords = {x = 24.5933, y = -945.543}},
    {accountId = "atm_big_224282187", coords = {x = 89.81339, y = 2.880325}},
    {accountId = "atm_big_-370422692", coords = {x = 111.3886, y = -774.8401}},
    {accountId = "atm_big_-1195049754", coords = {x = 112.4761, y = -819.808}},
    {accountId = "atm_big_-223375684", coords = {x = 114.5474, y = -775.9721}},
    {accountId = "atm_big_-195891882", coords = {x = 118.6416, y = -883.5695}},
    {accountId = "atm_big_-1922781717", coords = {x = 145.8392, y = -1035.625}},
    {accountId = "atm_big_-1645113034", coords = {x = 147.4731, y = -1036.218}},
    {accountId = "atm_big_1798656078", coords = {x = 156.1886, y = 6643.211}},
    {accountId = "atm_small_-1888550941", coords = {x = 158.7965, y = 234.7452}},
    {accountId = "atm_big_657617889", coords = {x = 173.8246, y = 6638.217}},
    {accountId = "atm_small_1196346786", coords = {x = 228.0324, y = 337.8501}},
    {accountId = "atm_big_-425796223", coords = {x = 285.3485, y = 142.9751}},
    {accountId = "atm_big_-1733595078", coords = {x = 289.2679, y = -1282.321}},
    {accountId = "atm_big_-1206801198", coords = {x = 289.531, y = -1256.788}},
    {accountId = "atm_big_1033701413", coords = {x = 296.1756, y = -896.2318}},
    {accountId = "atm_big_-456542311", coords = {x = 296.8775, y = -894.3196}},
    {accountId = "atm_small_-1102679577", coords = {x = 357.1284, y = 174.0836}},
    {accountId = "atm_big_513671168", coords = {x = 527.7776, y = -160.6609}},
    {accountId = "atm_big_-994968343", coords = {x = 1077.779, y = -776.9664}},
    {accountId = "atm_big_-31406404", coords = {x = 1137.811, y = -468.8625}},
    {accountId = "atm_big_942841185", coords = {x = 1167.061, y = -455.6541}},
    {accountId = "atm_small_78086502", coords = {x = 1171.523, y = 2703.139}},
    {accountId = "atm_small_-1535964382", coords = {x = 1172.457, y = 2703.139}},
    {accountId = "atm_small_-2095358695", coords = {x = 1687.395, y = 4815.911}},
    {accountId = "atm_small_1950825746", coords = {x = 1700.694, y = 6426.762}},
    {accountId = "atm_small_-430197987", coords = {x = 1822.971, y = 3682.577}},
    {accountId = "atm_big_1160659784", coords = {x = 2558.324, y = 350.988}},
    {accountId = "atm_small_-1439659778", coords = {x = 2564.001, y = 2584.553}},
    -- Pacific main entrance
    {accountId = "atm_big_-569758227", coords = {x = 236.97763, y = 219.8757}},
    {accountId = "atm_big_-171801230", coords = {x = 237.40777, y = 218.9535}},
    {accountId = "atm_big_-783820523", coords = {x = 237.8377, y = 218.0313}},
    {accountId = "atm_big_1099861958", coords = {x = 238.2677, y = 217.1091}},
    {accountId = "atm_big_-550927913", coords = {x = 238.69786, y = 216.1869}},
    -- Pacific secondary entrance
    {accountId = "atm_big_-563506731", coords = {x = 266.2609, y = 213.7733}},
    {accountId = "atm_big_1723991143", coords = {x = 265.9129, y = 212.8171}},
    {accountId = "atm_big_-12234701", coords = {x = 265.5649, y = 211.8609}},
    {accountId = "atm_big_1648623750", coords = {x = 265.2169, y = 210.9048}},
    {accountId = "atm_big_5274613", coords = {x = 264.8689, y = 209.9486}},
    -- Packs
    {accountId = "atm_big_pack1", coords = {x = -2957.9125, y = 487.26145}},
    {accountId = "atm_big_pack2", coords = {x = -2295.0776, y = 356.2653}},
    {accountId = "atm_big_pack3", coords = {x = -1570.303, y = -547.3672}},
    {accountId = "atm_big_pack4", coords = {x = -1410.4595, y = -99.786645}},
    {accountId = "atm_big_pack5", coords = {x = -1314.941, y = -835.06115}},
    {accountId = "atm_big_pack6", coords = {x = -1205.76, y = -325.7801}},
    {accountId = "atm_big_pack7", coords = {x = -867.49375, y = -187.16735}},
    {accountId = "atm_big_pack8", coords = {x = -846.92885, y = -340.96905}},
    {accountId = "atm_big_pack9", coords = {x = -711.50925, y = -818.47915}},
    {accountId = "atm_big_pack10", coords = {x = -617.8035, y = -707.8556}},
    {accountId = "atm_big_pack11", coords = {x = -613.1884, y = -705.5981}},
    {accountId = "atm_big_pack12", coords = {x = -595.36975, y = -1160.8515}},
    {accountId = "atm_big_pack13", coords = {x = -301.6573, y = -829.5886}},
    {accountId = "atm_big_pack14", coords = {x = -256.8124, y = -710.6806}},
    {accountId = "atm_big_pack15", coords = {x = -165.5844, y = 233.7307}},
    {accountId = "atm_big_pack16", coords = {x = -96.75375, y = 6456.597}},
    {accountId = "atm_big_pack17", coords = {x = -28.994955, y = -723.6976}},
    {accountId = "atm_big_pack18", coords = {x = 112.968, y = 775.4061}},
    {accountId = "atm_big_pack19", coords = {x = 146.65615, y = -1035.9215}},
    {accountId = "atm_big_pack20", coords = {x = 289.39945, y = -1269.5545}},
    {accountId = "atm_big_pack21", coords = {x = 296.52655, y = -895.2757}},
    {accountId = "atm_big_pack22", coords = {x = 237.837732, y = 218.0313}},
    {accountId = "atm_big_pack23", coords = {x = 265.5649, y = 211.86094}},
}

Config.AtmPacks = {
    ["atm_big_989148083"] = "atm_big_pack1",
    ["atm_big_271713063"] = "atm_big_pack1",
    ["atm_big_-962794372"] = "atm_big_pack2",
    ["atm_big_987045899"] = "atm_big_pack2",
    ["atm_big_-1637542684"] = "atm_big_pack2",
    ["atm_big_1839712771"] = "atm_big_pack3",
    ["atm_big_697321881"] = "atm_big_pack3",
    ["atm_big_683484861"] = "atm_big_pack4",
    ["atm_big_1318647156"] = "atm_big_pack4",
    ["atm_big_-256264141"] = "atm_big_pack5",
    ["atm_big_1206976348"] = "atm_big_pack5",
    ["atm_big_-1233725575"] = "atm_big_pack6",
    ["atm_big_-1798666306"] = "atm_big_pack6",
    ["atm_big_51392298"] = "atm_big_pack7",
    ["atm_big_1322795916"] = "atm_big_pack7",
    ["atm_big_809238812"] = "atm_big_pack8",
    ["atm_big_-2062538286"] = "atm_big_pack8",
    ["atm_big_1125361186"] = "atm_big_pack9",
    ["atm_big_1152134768"] = "atm_big_pack9",
    ["atm_big_-1328346503"] = "atm_big_pack10",
    ["atm_big_-1147992833"] = "atm_big_pack10",
    ["atm_big_2110283938"] = "atm_big_pack11",
    ["atm_big_-961889096"] = "atm_big_pack11",
    ["atm_big_-1484531863"] = "atm_big_pack12",
    ["atm_big_1318036671"] = "atm_big_pack12",
    ["atm_big_542704114"] = "atm_big_pack13",
    ["atm_big_1378866546"] = "atm_big_pack13",
    ["atm_big_404989754"] = "atm_big_pack14",
    ["atm_big_-2054737893"] = "atm_big_pack14",
    ["atm_big_1223259268"] = "atm_big_pack14",
    ["atm_big_1379698393"] = "atm_big_pack15",
    ["atm_big_1930385996"] = "atm_big_pack15",
    ["atm_big_-865137478"] = "atm_big_pack16",
    ["atm_big_-1254931541"] = "atm_big_pack16",
    ["atm_big_-1262459121"] = "atm_big_pack17",
    ["atm_big_97854004"] = "atm_big_pack17",
    ["atm_big_-370422692"] = "atm_big_pack18",
    ["atm_big_-223375684"] = "atm_big_pack18",
    ["atm_big_-1922781717"] = "atm_big_pack19",
    ["atm_big_-1645113034"] = "atm_big_pack19",
    ["atm_big_-1733595078"] = "atm_big_pack20",
    ["atm_big_-1206801198"] = "atm_big_pack20",
    ["atm_big_1033701413"] = "atm_big_pack21",
    ["atm_big_-456542311"] = "atm_big_pack21",
    -- Pacific main entrance
    ["atm_big_-569758227"] = "atm_big_pack22",
    ["atm_big_-171801230"] = "atm_big_pack22",
    ["atm_big_-783820523"] = "atm_big_pack22",
    ["atm_big_1099861958"] = "atm_big_pack22",
    ["atm_big_-550927913"] = "atm_big_pack22",
    -- Pacific secondary entrance
    ["atm_big_-563506731"] = "atm_big_pack23",
    ["atm_big_1723991143"] = "atm_big_pack23",
    ["atm_big_-12234701"] = "atm_big_pack23",
    ["atm_big_1648623750"] = "atm_big_pack23",
    ["atm_big_5274613"] = "atm_big_pack23",
}
