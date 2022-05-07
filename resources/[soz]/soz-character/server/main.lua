QBCore = exports["qb-core"]:GetCoreObject()

local ConfigKeyToReset = {
    "Naked",
    "HideHead",
    "HideMask",
    "HideGlasses",
    "HideEar",
    "HideChain",
    "HideBulletproof",
    "HideTop",
    "HideLeftHand",
    "HideRightHand",
    "HideBag",
    "HidePants",
    "HideShoes",
}

RegisterNetEvent("soz-character:server:SetPlayerJobClothes", function(clothes)
    local Player = QBCore.Functions.GetPlayer(source)
    local clothConfig = Player.PlayerData.cloth_config

    if clothes == nil then
        clothConfig["JobClothSet"] = clothes
    else
        if clothConfig["JobClothSet"] == nil then
            clothConfig["JobClothSet"] = {Components = {}, Props = {}}
        end

        for componentId, component in pairs(clothes.Components or {}) do
            clothConfig["JobClothSet"].Components[tonumber(componentId)] = component
        end
        for propId, prop in pairs(clothes.Props or {}) do
            clothConfig["JobClothSet"].Props[tonumber(propId)] = prop
        end
    end

    for _, key in pairs(ConfigKeyToReset) do
        clothConfig.Config[key] = false
    end

    Player.Functions.SetClothConfig(clothConfig, false)
end)

RegisterNetEvent("soz-character:server:UpdateClothConfig", function(key, value)
    local Player = QBCore.Functions.GetPlayer(source)
    local clothConfig = Player.PlayerData.cloth_config

    if key ~= nil and value ~= nil then
        clothConfig.Config[key] = value

        Player.Functions.SetClothConfig(clothConfig, false)
    end
end)
