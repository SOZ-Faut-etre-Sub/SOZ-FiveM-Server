Config.Products["jewelry"] = {
    [GetHashKey("mp_m_freemode_01")] = {
        {
            propId = 0,
            label = "Chapeaux",
            overlay = "Head",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/jewelry/male/props_male_hats.json"))[1],
        },
        {
            propId = 0,
            label = "Casques",
            overlay = "Helmet",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/jewelry/male/props_male_helmets.json"))[1],
        },
        {
            propId = 1,
            label = "Lunettes",
            overlay = "Glasses",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/jewelry/male/props_male_glasses.json"))[1],
        },
        {
            propId = 2,
            label = "Oreilles",
            overlay = "Ear",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/jewelry/male/props_male_ears.json"))[1],
        },
        {
            propId = 6,
            label = "Mains gauche",
            overlay = "LeftHand",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/jewelry/male/props_male_lefthand.json"))[1],
        },
        {
            propId = 7,
            label = "Mains droite",
            overlay = "RightHand",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/jewelry/male/props_male_righthand.json"))[1],
        },
    },
    [GetHashKey("mp_f_freemode_01")] = {
        {
            propId = 0,
            label = "Chapeaux",
            overlay = "Head",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/jewelry/female/props_female_hats.json"))[1],
        },
        {
            propId = 0,
            label = "Casques",
            overlay = "Helmet",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/jewelry/female/props_female_helmets.json"))[1],
        },
        {
            propId = 1,
            label = "Lunettes",
            overlay = "Glasses",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/jewelry/female/props_female_glasses.json"))[1],
        },
        {
            propId = 2,
            label = "Oreilles",
            overlay = "Ear",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/jewelry/female/props_female_ears.json"))[1],
        },
        {
            propId = 6,
            label = "Mains gauche",
            overlay = "LeftHand",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/jewelry/female/props_female_lefthand.json"))[1],
        },
        {
            propId = 7,
            label = "Mains droite",
            overlay = "RightHand",
            price = 50,
            items = json.decode(LoadResourceFile(GetCurrentResourceName(), "config/datasource/jewelry/female/props_female_righthand.json"))[1],
        },
    },
}

Config.Locations["jewelry"] = {vector4(-623.22, -229.24, 38.06, 82.19)}
