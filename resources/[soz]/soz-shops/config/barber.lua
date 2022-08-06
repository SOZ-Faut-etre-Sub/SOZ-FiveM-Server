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
            components = {["BeardType"] = true, ["BeardColor"] = true},
            items = Config.CharacterComponentList.BeardMale,
        },
        {
            price = 20,
            category = "Makeup",
            label = "Maquillage",
            overlay = "Makeup",
            components = {
                ["FullMakeupType"] = true,
                ["FullMakeupPrimaryColor"] = true,
                ["FullMakeupSecondaryColor"] = true,
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
            components = {["BlushType"] = true, ["BlushColor"] = true},
            items = Config.CharacterComponentList.Blush,
        },
        {
            price = 15,
            category = "Lipstick",
            label = "Rouge à lèvre",
            overlay = "Makeup",
            components = {["LipstickType"] = true, ["LipstickColor"] = true},
            items = Config.CharacterComponentList.Lipstick,
        },
        {
            price = 20,
            category = "Makeup",
            label = "Maquillage",
            overlay = "Makeup",
            components = {
                ["FullMakeupType"] = true,
                ["FullMakeupPrimaryColor"] = true,
                ["FullMakeupSecondaryColor"] = true,
            },
            items = Config.CharacterComponentList.Makeup,
        },
    },
}

Config.Locations["barber"] = {
    vector4(-813.4, -181.86, 37.57, 126.21),
    vector4(138.35, -1708.18, 29.3, 110.08),
    vector4(1212.64, -474.02, 66.22, 42.01),
    vector4(-278.59, 6227.0, 31.71, 23.14),
    vector4(-1282.2, -1118.39, 7.0, 62.16),
    vector4(1932.48, 3731.46, 32.85, 181.57),
    vector4(-34.41, -152.48, 57.09, 327.14),
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
