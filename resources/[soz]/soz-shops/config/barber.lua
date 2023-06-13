Config.Products["barber"] = {
    [GetHashKey("mp_m_freemode_01")] = {
        {
            price = 30,
            category = "Hair",
            label = "Cheveux",
            overlay = "Hair",
            components = {["HairType"] = true, ["HairColor"] = true, ["HairSecondaryColor"] = true},
            items = Config.CharacterComponentList.HairMale,
        },
        {
            price = 15,
            category = "Beard",
            label = "Barbe",
            overlay = "Hair",
            components = {["BeardType"] = true, ["BeardColor"] = true, ["BeardOpacity"] = true},
            items = Config.CharacterComponentList.BeardMale,
        },
        {
            price = 20,
            category = "Makeup",
            label = "Maquillage",
            overlay = "Makeup",
            components = {
                ["FullMakeupType"] = true,
                ["FullMakeupDefaultColor"] = true,
                ["FullMakeupPrimaryColor"] = true,
                ["FullMakeupSecondaryColor"] = true,
                ["FullMakeupOpacity"] = true,
            },
            items = Config.CharacterComponentList.Makeup,
        },
    },
    [GetHashKey("mp_f_freemode_01")] = {
        {
            price = 30,
            category = "Hair",
            label = "Cheveux",
            overlay = "Hair",
            components = {["HairType"] = true, ["HairColor"] = true, ["HairSecondaryColor"] = true},
            items = Config.CharacterComponentList.HairFemale,
        },
        {
            price = 15,
            category = "Blush",
            label = "Blush",
            overlay = "Makeup",
            components = {["BlushType"] = true, ["BlushColor"] = true, ["BlushOpacity"] = true},
            items = Config.CharacterComponentList.Blush,
        },
        {
            price = 15,
            category = "Lipstick",
            label = "Rouge à lèvre",
            overlay = "Makeup",
            components = {["LipstickType"] = true, ["LipstickColor"] = true, ["LipstickOpacity"] = true},
            items = Config.CharacterComponentList.Lipstick,
        },
        {
            price = 20,
            category = "Makeup",
            label = "Maquillage",
            overlay = "Makeup",
            components = {
                ["FullMakeupType"] = true,
                ["FullMakeupDefaultColor"] = true,
                ["FullMakeupPrimaryColor"] = true,
                ["FullMakeupSecondaryColor"] = true,
                ["FullMakeupOpacity"] = true,
            },
            items = Config.CharacterComponentList.Makeup,
        },
    },
}

Config.Locations["barber"] = {
    ["barber"] = vector4(-823.04, -183.63, 37.57, 208.03),
    ["barber2"] = vector4(134.98, -1707.95, 29.29, 152.50),
    ["barber3"] = vector4(1211.68, -470.88, 66.21, 74.72),
    ["barber4"] = vector4(-277.87, 6230.14, 31.70, 50.93),
    ["barber5"] = vector4(-1283.93, -1115.55, 6.99, 89.85),
    ["barber6"] = vector4(1930.92, 3728.27, 32.84, 218.55),
    ["barber7"] = vector4(-30.98, -151.74, 57.08, 346.24),
}

if not IsDuplicityVersion() then
    Config.CharacterComponentList = exports["soz-character"]:GetLabels()
    Config.CharacterComponentColors = exports["soz-character"]:GetColors()

    CreateThread(function()
        local numHairColors = GetNumHairColors();
        local numMakeupColors = GetNumMakeupColors();

        for i = 0, numHairColors - 1 do
            local r, g, b = GetHairRgbColor(i);

            table.insert(Config.CharacterComponentColors.Hair, {
                value = i,
                label = "HAIR_COLOR_" .. i,
                r = r,
                g = g,
                b = b,
            });
        end

        for i = 0, numMakeupColors - 1 do
            local r, g, b = GetMakeupRgbColor(i);

            table.insert(Config.CharacterComponentColors.Makeup, {
                value = i,
                label = "MAKEUP_COLOR_" .. i,
                r = r,
                g = g,
                b = b,
            });
        end
    end)
end
