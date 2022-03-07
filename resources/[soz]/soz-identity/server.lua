local QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("soz-identity:server:show-license", function(target)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end

    local charinfo = Player.PlayerData.charinfo
    local licences = Player.PlayerData.metadata["licences"]
    if not charinfo or not licences then
        return
    end

    TriggerClientEvent("soz-identity:client:show-licence", target,
                       {
        type = "show",
        scope = "licenses",
        firstName = charinfo.firstname,
        lastName = charinfo.lastname,
        licences = licences,
    })
end)
