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
