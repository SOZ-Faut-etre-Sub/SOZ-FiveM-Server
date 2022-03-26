Config = {}

Config.PayCheckTimeOut = 15
Config.MoneyCaseTrigger = 5000

Config.OffShoreMaxWashAmount = math.random(50000, 150000)

Config.DefaultAccountMoney = {["player"] = 5000, ["business"] = 100000}

Config.ErrorMessage = {
    ["unknown"] = "~r~Erreur de la banque !",
    ["action_forbidden"] = "~r~Vous n'avez pas de droit de faire cette action !",
    ["invalid_account"] = "~r~Le compte n'existe pas !",
    ["already_exist"] = "~r~Le compte existe déjà !",
    ["transfert_failed"] = "~r~Le transfer a subis une erreur !",
    ["no_account_money"] = "~r~Le compte ne possède pas assez d'argent !",
}

Config.SafeStorages = {
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
}

Config.ATMModels = {"prop_atm_01", "prop_atm_02", "prop_atm_03", "prop_fleeca_atm"}

Config.BankPedLocations = {
    vector4(149.42, -1042.15, 29.37, 340.3),
    vector4(313.79, -280.53, 54.16, 341.82),
    vector4(-351.3, -51.3, 49.04, 342.4),
    vector4(-1211.96, -331.94, 37.78, 23.77),
    vector4(-2961.13, 482.98, 15.7, 85.95),
    vector4(1175.01, 2708.3, 38.09, 176.68),
    vector4(-112.26, 6471.04, 31.63, 132.8),
    vector4(243.63, 226.24, 106.29, 158.33),
    vector4(247.04, 224.99, 106.29, 157.44),
    vector4(252.19, 223.16, 106.29, 160.18),
}
