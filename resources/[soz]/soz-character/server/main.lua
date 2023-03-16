QBCore = exports["qb-core"]:GetCoreObject()

local MappingCompomentKeyToReset = {
    ["1"] = "HideMask",
    ["4"] = "HidePants",
    ["5"] = "HideBag",
    ["6"] = "HideShoes",
    ["7"] = "HideChain",
    ["9"] = "HideBulletproof",
    ["11"] = "HideTop",
}

local MappingPropKeyToReset = {
    ["0"] = "HideHead",
    ["1"] = "HideGlasses",
    ["6"] = "HideLeftHand",
    ["7"] = "HideRightHand",
}

RegisterNetEvent("soz-character:server:SetPlayerClothes", function(clothes)
    local Player = QBCore.Functions.GetPlayer(source)
    local clothConfig = Player.PlayerData.cloth_config

    if clothes == nil then
        return
    end

    for componentId, component in pairs(clothes.Components or {}) do
        clothConfig["BaseClothSet"].Components[tostring(componentId)] = component
    end
    for propId, prop in pairs(clothes.Props or {}) do
        clothConfig["BaseClothSet"].Props[tostring(propId)] = prop
    end

    clothConfig["TemporaryClothSet"] = nil

    Player.Functions.SetClothConfig(clothConfig, false)
end)

RegisterNetEvent("soz-character:server:SetPlayerJobClothes", function(clothes, merge)
    local Player = QBCore.Functions.GetPlayer(source)
    local clothConfig = Player.PlayerData.cloth_config

    if clothes == nil then
        clothConfig["JobClothSet"] = clothes
    else
        if clothConfig["JobClothSet"] == nil or not merge then
            clothConfig["JobClothSet"] = {Components = {}, Props = {}}
        end

        for componentId, component in pairs(clothes.Components or {}) do
            clothConfig["JobClothSet"].Components[tostring(componentId)] = component
            if MappingCompomentKeyToReset[tostring(componentId)] then
                clothConfig.Config[MappingCompomentKeyToReset[tostring(componentId)]] = false
            end
        end
        for propId, prop in pairs(clothes.Props or {}) do
            clothConfig["JobClothSet"].Props[tostring(propId)] = prop
            if MappingPropKeyToReset[tostring(propId)] then
                clothConfig.Config[MappingPropKeyToReset[tostring(propId)]] = false
            end
            if tostring(propId) == "Helmet" then
                clothConfig.Config["ShowHelmet"] = true
            end
        end
    end

    if not merge then
        clothConfig.Config["Naked"] = false
        clothConfig["TemporaryClothSet"] = nil
    end

    Player.Functions.SetClothConfig(clothConfig, false)
end)

RegisterNetEvent("soz-character:server:SetPlayerTemporaryClothes", function(clothes, merge)
    local Player = QBCore.Functions.GetPlayer(source)
    local clothConfig = Player.PlayerData.cloth_config

    if clothes == nil then
        clothConfig["TemporaryClothSet"] = clothes
    else
        if clothConfig["TemporaryClothSet"] == nil or not merge then
            clothConfig["TemporaryClothSet"] = {Components = {}, Props = {}}
        end

        for componentId, component in pairs(clothes.Components or {}) do
            clothConfig["TemporaryClothSet"].Components[tostring(componentId)] = component
            if MappingCompomentKeyToReset[tostring(componentId)] then
                clothConfig.Config[MappingCompomentKeyToReset[tostring(componentId)]] = false
            end
        end
        for propId, prop in pairs(clothes.Props or {}) do
            clothConfig["TemporaryClothSet"].Props[tostring(propId)] = prop
            if MappingPropKeyToReset[tostring(propId)] then
                clothConfig.Config[MappingPropKeyToReset[tostring(propId)]] = false
            end
            if tostring(propId) == "Helmet" then
                clothConfig.Config["ShowHelmet"] = true
            end
        end
    end

    if not merge then
        clothConfig.Config["Naked"] = false
    end

    Player.Functions.SetClothConfig(clothConfig, false)
end)

RegisterNetEvent("soz-character:server:UpdateClothConfig", function(key, value)
    local player = QBCore.Functions.GetPlayer(source)
    local clothConfig = player.PlayerData.cloth_config

    if key ~= nil and value ~= nil then
        clothConfig.Config[key] = value

        if key == "HideBulletproof" then
            if value and clothConfig["JobClothSet"] and clothConfig["JobClothSet"].Components then
                clothConfig["JobClothSet"].Components["9"] = nil
            end
            player.Functions.SetArmour(not clothConfig.Config[key])
        end

        player.Functions.SetClothConfig(clothConfig, Player(source).state.isWearingPatientOutfit)
    end
end)
