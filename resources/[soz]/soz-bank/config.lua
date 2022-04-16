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
}

Config.FarmAccountMoney = {
    ["farm_news"] = {money = 50000, marked_money = 0},
    ["farm_stonk"] = {money = 2000000, marked_money = 0},
}

Config.SafeStorages = {
    ["safe_cash-transfer"] = {
        label = "Coffre Stonk Depository",
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
        label = "Coffre Rogers",
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
    ["bank1"] = vector4(149.42, -1042.15, 29.37, 340.3),
    ["bank2"] = vector4(313.79, -280.53, 54.16, 341.82),
    ["bank3"] = vector4(-351.3, -51.3, 49.04, 342.4),
    ["bank4"] = vector4(-1211.96, -331.94, 37.78, 23.77),
    ["bank5"] = vector4(-2961.13, 482.98, 15.7, 85.95),
    ["bank6"] = vector4(1175.01, 2708.3, 38.09, 176.68),
    ["bank7"] = vector4(-112.26, 6471.04, 31.63, 132.8),
}

Config.BankAtmDefault = {
    ["pacific"] = {maxMoney = 600000},
    ["bank"] = {maxMoney = 100000},
    ["big"] = {maxMoney = 20000},
    ["small"] = {maxMoney = 5000},
}
