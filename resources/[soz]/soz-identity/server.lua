local QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("soz-identity:server:request-data", function(target, scope)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end

    local charinfo = Player.PlayerData.charinfo
    local licences = Player.PlayerData.metadata["licences"]
    if not charinfo or not licences then
        return
    end

    local gender = "Masculin"
    if charinfo.gender then
        gender = "Féminin"
    end

    TriggerClientEvent("soz-identity:client:show-ui", target, {
        type = "show",
        scope = scope,
        firstName = "Lorem",
        lastName = charinfo.lastname,
        licences = licences,
        nationality = charinfo.nationality,
        gender = gender,
        address = "-",
        phone = charinfo.phone
    })
end)
