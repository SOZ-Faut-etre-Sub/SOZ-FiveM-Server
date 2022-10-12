QBCore = exports["qb-core"]:GetCoreObject()

local ConfigKeyToReset = {"Naked", "HideChain", "HideBulletproof", "HideTop", "HidePants", "HideShoes"}

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

    Player.Functions.SetClothConfig(clothConfig, false)
end)

RegisterNetEvent("soz-character:server:SetPlayerJobClothes", function(clothes, removeAnOutfit)
    local Player = QBCore.Functions.GetPlayer(source)
    local clothConfig = Player.PlayerData.cloth_config

    if removeAnOutfit then
        if not exports["soz-inventory"]:RemoveItem(source, "work_clothes", 1) then
            TriggerClientEvent("hud:client:DrawNotification", source, "Vous n'avez pas de tenue de travail dans vos poches.", "error")
            return
        end
    end

    if clothes == nil then
        clothConfig["JobClothSet"] = clothes
    else
        if clothConfig["JobClothSet"] == nil then
            clothConfig["JobClothSet"] = {Components = {}, Props = {}}
        end

        for componentId, component in pairs(clothes.Components or {}) do
            clothConfig["JobClothSet"].Components[tostring(componentId)] = component
        end
        for propId, prop in pairs(clothes.Props or {}) do
            clothConfig["JobClothSet"].Props[tostring(propId)] = prop
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

        if key == "HideBulletproof" then
            if value and clothConfig["JobClothSet"] and clothConfig["JobClothSet"].Components then
                clothConfig["JobClothSet"].Components["9"] = nil
            end
            Player.Functions.SetArmour(not clothConfig.Config[key])
        end

        Player.Functions.SetClothConfig(clothConfig, false)
    end
end)
