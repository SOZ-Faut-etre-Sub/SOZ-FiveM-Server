local QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("soz-identity:server:request-data", function(target, scope, action, clientData)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end

    local charinfo = Player.PlayerData.charinfo
    local licences = Player.PlayerData.metadata["licences"]
    if not charinfo or not licences then
        return
    end

    TriggerClientEvent("soz-identity:client:display-ui", target, {
        type = "display",
        scope = scope,
        action = action,
        firstName = charinfo.firstname,
        lastName = charinfo.lastname,
        gender = clientData.gender,
        job = clientData.job,
        address = "-",
        phone = charinfo.phone,
        licences = licences,
        source = source,
    })
end)

RegisterNetEvent("soz-identity:server:hide-around", function(players)
    if type(players) == "table" and #players > 0 then
        for _, player in ipairs(players) do
            TriggerClientEvent("soz-identity:client:hide", player, source)
        end
    end
end)
