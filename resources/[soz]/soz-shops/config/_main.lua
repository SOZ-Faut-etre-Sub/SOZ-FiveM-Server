Config = {}

Config.Products = {}
Config.Locations = {}

if IsDuplicityVersion() then
    Config.CharacterComponentList = {}
    Config.CharacterComponentColors = {}

    function GetLabelText(label)
        return "#" .. label
    end
else
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
