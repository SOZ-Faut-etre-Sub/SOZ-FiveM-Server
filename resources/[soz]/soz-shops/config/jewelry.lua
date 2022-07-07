Config.Products["jewelry"] = {
    [GetHashKey("mp_m_freemode_01")] = {
        [0] = {
            label = "Chapeaux",
            overlay = "Head",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/props_male_hats.json"))[1],
        },
        [1] = {
            label = "Lunettes",
            overlay = "Glasses",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/props_male_glasses.json"))[1],
        },
        [2] = {
            label = "Oreilles",
            overlay = "Ear",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/props_male_ears.json"))[1],
        },
        [6] = {
            label = "Mains gauche",
            overlay = "LeftHand",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/props_male_watches.json"))[1],
        },
        [7] = {
            label = "Mains droite",
            overlay = "RightHand",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/props_male_bracelets.json"))[1],
        },
    },
    [GetHashKey("mp_f_freemode_01")] = {
        [0] = {
            label = "Chapeaux",
            overlay = "Head",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/props_female_hats.json"))[1],
        },
        [1] = {
            label = "Lunettes",
            overlay = "Glasses",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/props_female_glasses.json"))[1],
        },
        [2] = {
            label = "Oreilles",
            overlay = "Ear",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/props_female_ears.json"))[1],
        },
        [6] = {
            label = "Mains gauche",
            overlay = "LeftHand",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/props_female_watches.json"))[1],
        },
        [7] = {
            label = "Mains droite",
            overlay = "RightHand",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/props_female_bracelets.json"))[1],
        },
    },
}

Config.Locations["jewelry"] = {vector4(-623.22, -229.24, 38.06, 82.19)}
