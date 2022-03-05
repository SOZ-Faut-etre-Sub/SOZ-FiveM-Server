local QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("soz-driving-license:server:pay", function(licenseType)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end

    local lData = Config.Licenses[licenseType]
    if not lData or type(lData.price) ~= "number" then
        return
    end

    if Player.Functions.RemoveMoney("money", lData.price) then
        TriggerClientEvent("soz-driving-license:client:spawn_vehicle", Player.PlayerData.source, licenseType)
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "~r~Vous n'avez pas assez d'argent")
    end
end)

RegisterNetEvent("soz-driving-license:server:update_license", function(licenseType)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end

    local licences = Player.PlayerData.metadata["licences"]
    local licenceTbl = Config.Licenses[licenseType]
    if not licences or not licenceTbl then
        return
    end

    -- Update licence value
    licences[licenseType] = licenceTbl.points or true
    Player.Functions.SetMetaData("licences", licences)
    Player.Functions.Save(source)
end)

RegisterNetEvent("soz-driving-school:server:show-license", function(target)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end

    local charinfo = Player.PlayerData.charinfo
    local licences = Player.PlayerData.metadata["licences"]
    if not charinfo or not licences then
        return
    end

    TriggerClientEvent("soz-driving-school:client:show-licence", target,
                       {
        type = "show",
        firstName = charinfo.firstname,
        lastName = charinfo.lastname,
        licences = licences,
    })
end)
