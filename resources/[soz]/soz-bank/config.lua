Config = {}

Config.PayCheckTimeOut = 20
Config.MoneyCaseTrigger = 5000

Config.OffShoreMaxWashAmount = math.random(50000, 150000)

Config.DefaultAccountMoney = {["player"] = 5000, ["business"] = 200000}

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
    ["farm_news"] = {money = 100000, marked_money = 0},
    ["farm_stonk"] = {money = 2000000, marked_money = 0},
    ["farm_mtp"] = {money = 100000, marked_money = 0},
    ["farm_garbage"] = {money = 100000, marked_money = 0},
    ["farm_taxi"] = {money = 100000, marked_money = 0},
    ["farm_food"] = {money = 100000, marked_money = 0},
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
    ["safe_oil"] = {
        label = "Coffre MTP",
        owner = "oil",
        position = vector3(-234.58, 6090.64, 31.76),
        size = vec2(0.8, 1.25),
        heading = 45,
        offsetUpZ = 0.4,
        offsetDownZ = 0.5,
    },
    ["safe_bennys"] = {
        label = "Coffre Bennys",
        owner = "bennys",
        position = vector3(-204.6, -1333.11, 34.89),
        size = vec2(1.0, 2.5),
    },
    ["safe_food"] = {
        label = "Coffre Chateau-Marius",
        owner = "food",
        position = vector3(-1898.62, 2065.6, 141.0),
        size = vec2(0.8, 2.2),
        heading = 340,
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
    ["atm_big_1634972506"] = {accountId = "atm_big_1634972506", coords = {x = -3241.455, y = 997.9085}},
    ["atm_small_1855854659"] = {accountId = "atm_small_1855854659", coords = {x = -3144.887, y = 1127.811}},
    ["atm_big_-240811233"] = {accountId = "atm_big_-240811233", coords = {x = -3043.835, y = 594.1639}},
    ["atm_big_-1856027119"] = {accountId = "atm_big_-1856027119", coords = {x = -2974.586, y = 380.1269}},
    ["atm_big_989148083"] = {accountId = "atm_big_989148083", coords = {x = -2958.977, y = 487.3071}},
    ["atm_big_271713063"] = {accountId = "atm_big_271713063", coords = {x = -2956.848, y = 487.2158}},
    ["atm_big_-962794372"] = {accountId = "atm_big_-962794372", coords = {x = -2295.853, y = 357.9348}},
    ["atm_big_987045899"] = {accountId = "atm_big_987045899", coords = {x = -2295.069, y = 356.2556}},
    ["atm_big_-1637542684"] = {accountId = "atm_big_-1637542684", coords = {x = -2294.311, y = 354.6056}},
    ["atm_big_735194508"] = {accountId = "atm_big_735194508", coords = {x = -2071.928, y = -317.2862}},
    ["atm_big_1839712771"] = {accountId = "atm_big_1839712771", coords = {x = -1570.765, y = -547.7035}},
    ["atm_big_697321881"] = {accountId = "atm_big_697321881", coords = {x = -1569.841, y = -547.0309}},
    ["atm_small_-281473463"] = {accountId = "atm_small_-281473463", coords = {x = -1430.663, y = -211.3587}},
    ["atm_small_-173538119"] = {accountId = "atm_small_-173538119", coords = {x = -1415.481, y = -212.3324}},
    ["atm_big_683484861"] = {accountId = "atm_big_683484861", coords = {x = -1410.736, y = -98.92789}},
    ["atm_big_1318647156"] = {accountId = "atm_big_1318647156", coords = {x = -1410.183, y = -100.6454}},
    ["atm_big_-256264141"] = {accountId = "atm_big_-256264141", coords = {x = -1315.416, y = -834.431}},
    ["atm_big_1206976348"] = {accountId = "atm_big_1206976348", coords = {x = -1314.466, y = -835.6913}},
    ["atm_big_1603908035"] = {accountId = "atm_big_1603908035", coords = {x = -1305.708, y = -706.6881}},
    ["atm_small_1799303130"] = {accountId = "atm_small_1799303130", coords = {x = -1289.742, y = -227.165}},
    ["atm_small_-1496899310"] = {accountId = "atm_small_-1496899310", coords = {x = -1286.704, y = -213.7827}},
    ["atm_small_-1195324938"] = {accountId = "atm_small_-1195324938", coords = {x = -1285.136, y = -223.9422}},
    ["atm_small_-878997031"] = {accountId = "atm_small_-878997031", coords = {x = -1282.098, y = -210.5599}},
    ["atm_big_-1233725575"] = {accountId = "atm_big_-1233725575", coords = {x = -1206.142, y = -325.0316}},
    ["atm_big_-1798666306"] = {accountId = "atm_big_-1798666306", coords = {x = -1205.378, y = -326.5286}},
    ["atm_small_1558276123"] = {accountId = "atm_small_1558276123", coords = {x = -1110.228, y = -1691.154}},
    ["atm_small_-1216325514"] = {accountId = "atm_small_-1216325514", coords = {x = -1091.887, y = 2709.053}},
    ["atm_small_-1663557416"] = {accountId = "atm_small_-1663557416", coords = {x = -1044.466, y = -2739.641}},
    ["atm_big_51392298"] = {accountId = "atm_big_51392298", coords = {x = -867.9745, y = -186.3419}},
    ["atm_big_1322795916"] = {accountId = "atm_big_1322795916", coords = {x = -867.013, y = -187.9928}},
    ["atm_big_809238812"] = {accountId = "atm_big_809238812", coords = {x = -847.204, y = -340.4291}},
    ["atm_big_-2062538286"] = {accountId = "atm_big_-2062538286", coords = {x = -846.6537, y = -341.509}},
    ["atm_big_2125698499"] = {accountId = "atm_big_2125698499", coords = {x = -821.8936, y = -1081.555}},
    ["atm_big_-1697309195"] = {accountId = "atm_big_-1697309195", coords = {x = -720.6288, y = -415.5243}},
    ["atm_big_1125361186"] = {accountId = "atm_big_1125361186", coords = {x = -712.9357, y = -818.4827}},
    ["atm_big_1152134768"] = {accountId = "atm_big_1152134768", coords = {x = -710.0828, y = -818.4756}},
    ["atm_big_2029025428"] = {accountId = "atm_big_2029025428", coords = {x = -660.6763, y = -854.4882}},
    ["atm_big_-1328346503"] = {accountId = "atm_big_-1328346503", coords = {x = -617.8035, y = -708.8591}},
    ["atm_big_-1147992833"] = {accountId = "atm_big_-1147992833", coords = {x = -617.8035, y = -706.8521}},
    ["atm_big_2110283938"] = {accountId = "atm_big_2110283938", coords = {x = -614.5187, y = -705.5981}},
    ["atm_big_-961889096"] = {accountId = "atm_big_-961889096", coords = {x = -611.8581, y = -705.5981}},
    ["atm_big_-1484531863"] = {accountId = "atm_big_-1484531863", coords = {x = -596.1251, y = -1160.851}},
    ["atm_big_1318036671"] = {accountId = "atm_big_1318036671", coords = {x = -594.6144, y = -1160.852}},
    ["atm_big_-1215420232"] = {accountId = "atm_big_-1215420232", coords = {x = -537.8052, y = -854.9357}},
    ["atm_big_-1195274668"] = {accountId = "atm_big_-1195274668", coords = {x = -526.7791, y = -1223.374}},
    ["atm_big_-2126496766"] = {accountId = "atm_big_-2126496766", coords = {x = -386.4596, y = 6046.411}},
    ["atm_big_542704114"] = {accountId = "atm_big_542704114", coords = {x = -303.2257, y = -829.3121}},
    ["atm_big_1378866546"] = {accountId = "atm_big_1378866546", coords = {x = -301.6573, y = -829.5886}},
    ["atm_big_2039786242"] = {accountId = "atm_big_2039786242", coords = {x = -282.7141, y = 6226.4311}},
    ["atm_big_404989754"] = {accountId = "atm_big_404989754", coords = {x = -259.2767, y = -723.2652}},
    ["atm_big_-2054737893"] = {accountId = "atm_big_-2054737893", coords = {x = -256.6386, y = -715.8898}},
    ["atm_big_1223259268"] = {accountId = "atm_big_1223259268", coords = {x = -254.5219, y = -692.8869}},
    ["atm_big_-979756049"] = {accountId = "atm_big_-979756049", coords = {x = -204.0193, y = -861.0091}},
    ["atm_big_1379698393"] = {accountId = "atm_big_1379698393", coords = {x = -165.5844, y = 234.7659}},
    ["atm_big_1930385996"] = {accountId = "atm_big_1930385996", coords = {x = -165.5844, y = 232.6955}},
    ["atm_big_753906383"] = {accountId = "atm_big_753906383", coords = {x = -132.6663, y = 6366.876}},
    ["atm_big_-865137478"] = {accountId = "atm_big_-865137478", coords = {x = -97.63721, y = 6455.732}},
    ["atm_big_-1254931541"] = {accountId = "atm_big_-1254931541", coords = {x = -95.87029, y = 6457.462}},
    ["atm_small_-1052670178"] = {accountId = "atm_small_-1052670178", coords = {x = -57.17029, y = -92.37918}},
    ["atm_big_-1262459121"] = {accountId = "atm_big_-1262459121", coords = {x = -30.09957, y = -723.2863}},
    ["atm_big_97854004"] = {accountId = "atm_big_97854004", coords = {x = -27.89034, y = -724.1089}},
    ["atm_big_226458362"] = {accountId = "atm_big_226458362", coords = {x = 5.686035, y = -919.9551}},
    ["atm_big_1131566868"] = {accountId = "atm_big_1131566868", coords = {x = 24.5933, y = -945.543}},
    ["atm_big_224282187"] = {accountId = "atm_big_224282187", coords = {x = 89.81339, y = 2.880325}},
    ["atm_big_-370422692"] = {accountId = "atm_big_-370422692", coords = {x = 111.3886, y = -774.8401}},
    ["atm_big_-1195049754"] = {accountId = "atm_big_-1195049754", coords = {x = 112.4761, y = -819.808}},
    ["atm_big_-223375684"] = {accountId = "atm_big_-223375684", coords = {x = 114.5474, y = -775.9721}},
    ["atm_big_-195891882"] = {accountId = "atm_big_-195891882", coords = {x = 118.6416, y = -883.5695}},
    ["atm_big_-1922781717"] = {accountId = "atm_big_-1922781717", coords = {x = 145.8392, y = -1035.625}},
    ["atm_big_-1645113034"] = {accountId = "atm_big_-1645113034", coords = {x = 147.4731, y = -1036.218}},
    ["atm_big_1798656078"] = {accountId = "atm_big_1798656078", coords = {x = 156.1886, y = 6643.211}},
    ["atm_small_-1888550941"] = {accountId = "atm_small_-1888550941", coords = {x = 158.7965, y = 234.7452}},
    ["atm_big_657617889"] = {accountId = "atm_big_657617889", coords = {x = 173.8246, y = 6638.217}},
    ["atm_small_1196346786"] = {accountId = "atm_small_1196346786", coords = {x = 228.0324, y = 337.8501}},
    ["atm_big_-425796223"] = {accountId = "atm_big_-425796223", coords = {x = 285.3485, y = 142.9751}},
    ["atm_big_-1733595078"] = {accountId = "atm_big_-1733595078", coords = {x = 289.2679, y = -1282.321}},
    ["atm_big_-1206801198"] = {accountId = "atm_big_-1206801198", coords = {x = 289.531, y = -1256.788}},
    ["atm_big_1033701413"] = {accountId = "atm_big_1033701413", coords = {x = 296.1756, y = -896.2318}},
    ["atm_big_-456542311"] = {accountId = "atm_big_-456542311", coords = {x = 296.8775, y = -894.3196}},
    ["atm_small_-1102679577"] = {accountId = "atm_small_-1102679577", coords = {x = 357.1284, y = 174.0836}},
    ["atm_big_513671168"] = {accountId = "atm_big_513671168", coords = {x = 527.7776, y = -160.6609}},
    ["atm_big_-994968343"] = {accountId = "atm_big_-994968343", coords = {x = 1077.779, y = -776.9664}},
    ["atm_big_-31406404"] = {accountId = "atm_big_-31406404", coords = {x = 1137.811, y = -468.8625}},
    ["atm_big_942841185"] = {accountId = "atm_big_942841185", coords = {x = 1167.061, y = -455.6541}},
    ["atm_small_78086502"] = {accountId = "atm_small_78086502", coords = {x = 1171.523, y = 2703.139}},
    ["atm_small_-1535964382"] = {accountId = "atm_small_-1535964382", coords = {x = 1172.457, y = 2703.139}},
    ["atm_small_-2095358695"] = {accountId = "atm_small_-2095358695", coords = {x = 1687.395, y = 4815.911}},
    ["atm_small_1950825746"] = {accountId = "atm_small_1950825746", coords = {x = 1700.694, y = 6426.762}},
    ["atm_small_-430197987"] = {accountId = "atm_small_-430197987", coords = {x = 1822.971, y = 3682.577}},
    ["atm_big_1160659784"] = {accountId = "atm_big_1160659784", coords = {x = 2558.324, y = 350.988}},
    ["atm_small_-1439659778"] = {accountId = "atm_small_-1439659778", coords = {x = 2564.001, y = 2584.553}},
    -- Pacific main entrance
    ["atm_big_-569758227"] = {accountId = "atm_big_-569758227", coords = {x = 236.97763, y = 219.8757}},
    ["atm_big_-171801230"] = {accountId = "atm_big_-171801230", coords = {x = 237.40777, y = 218.9535}},
    ["atm_big_-783820523"] = {accountId = "atm_big_-783820523", coords = {x = 237.8377, y = 218.0313}},
    ["atm_big_1099861958"] = {accountId = "atm_big_1099861958", coords = {x = 238.2677, y = 217.1091}},
    ["atm_big_-550927913"] = {accountId = "atm_big_-550927913", coords = {x = 238.69786, y = 216.1869}},
    -- Pacific secondary entrance
    ["atm_big_-563506731"] = {accountId = "atm_big_-563506731", coords = {x = 266.2609, y = 213.7733}},
    ["atm_big_1723991143"] = {accountId = "atm_big_1723991143", coords = {x = 265.9129, y = 212.8171}},
    ["atm_big_-12234701"] = {accountId = "atm_big_-12234701", coords = {x = 265.5649, y = 211.8609}},
    ["atm_big_1648623750"] = {accountId = "atm_big_1648623750", coords = {x = 265.2169, y = 210.9048}},
    ["atm_big_5274613"] = {accountId = "atm_big_5274613", coords = {x = 264.8689, y = 209.9486}},
    -- Packs
    ["atm_big_pack1"] = {accountId = "atm_big_pack1", coords = {x = -2957.9125, y = 487.26145}},
    ["atm_big_pack2"] = {accountId = "atm_big_pack2", coords = {x = -2295.0776, y = 356.2653}},
    ["atm_big_pack3"] = {accountId = "atm_big_pack3", coords = {x = -1570.303, y = -547.3672}},
    ["atm_big_pack4"] = {accountId = "atm_big_pack4", coords = {x = -1410.4595, y = -99.786645}},
    ["atm_big_pack5"] = {accountId = "atm_big_pack5", coords = {x = -1314.941, y = -835.06115}},
    ["atm_big_pack6"] = {accountId = "atm_big_pack6", coords = {x = -1205.76, y = -325.7801}},
    ["atm_big_pack7"] = {accountId = "atm_big_pack7", coords = {x = -867.49375, y = -187.16735}},
    ["atm_big_pack8"] = {accountId = "atm_big_pack8", coords = {x = -846.92885, y = -340.96905}},
    ["atm_big_pack9"] = {accountId = "atm_big_pack9", coords = {x = -711.50925, y = -818.47915}},
    ["atm_big_pack10"] = {accountId = "atm_big_pack10", coords = {x = -617.8035, y = -707.8556}},
    ["atm_big_pack11"] = {accountId = "atm_big_pack11", coords = {x = -613.1884, y = -705.5981}},
    ["atm_big_pack12"] = {accountId = "atm_big_pack12", coords = {x = -595.36975, y = -1160.8515}},
    ["atm_big_pack13"] = {accountId = "atm_big_pack13", coords = {x = -301.6573, y = -829.5886}},
    ["atm_big_pack14"] = {accountId = "atm_big_pack14", coords = {x = -256.8124, y = -710.6806}},
    ["atm_big_pack15"] = {accountId = "atm_big_pack15", coords = {x = -165.5844, y = 233.7307}},
    ["atm_big_pack16"] = {accountId = "atm_big_pack16", coords = {x = -96.75375, y = 6456.597}},
    ["atm_big_pack17"] = {accountId = "atm_big_pack17", coords = {x = -28.994955, y = -723.6976}},
    ["atm_big_pack18"] = {accountId = "atm_big_pack18", coords = {x = 112.968, y = -775.4061}},
    ["atm_big_pack19"] = {accountId = "atm_big_pack19", coords = {x = 146.65615, y = -1035.9215}},
    ["atm_big_pack20"] = {accountId = "atm_big_pack20", coords = {x = 289.39945, y = -1269.5545}},
    ["atm_big_pack21"] = {accountId = "atm_big_pack21", coords = {x = 296.52655, y = -895.2757}},
    ["atm_big_pack22"] = {accountId = "atm_big_pack22", coords = {x = 237.837732, y = 218.0313}},
    ["atm_big_pack23"] = {accountId = "atm_big_pack23", coords = {x = 265.5649, y = 211.86094}},
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
