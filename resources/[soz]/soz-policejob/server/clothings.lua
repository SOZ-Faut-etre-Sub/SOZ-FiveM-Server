--- Item
QBCore.Functions.CreateUseableItem("armor", function(source, item)
    local ped = GetPlayerPed(source)
    local Player = QBCore.Functions.GetPlayer(source)
    local armorType = item.metadata["type"] or "unmark"

    if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item.name, 1, item.metadata) then
        Player.Functions.SetMetaData("armor", {current = 100, hidden = false})
        SetPedArmour(ped, 100)

        TriggerClientEvent("police:client:setupArmor", source, armorType)
    end
end)

QBCore.Functions.CreateUseableItem("outfit", function(source, item)
    local player = QBCore.Functions.GetPlayer(source)

    if exports["soz-inventory"]:RemoveItem(player.PlayerData.source, item.name, 1, item.metadata) then
        if item.metadata["type"] == "lspd" or item.metadata["type"] == "bcso" then
            TriggerClientEvent("police:client:applyDutyClothing", source, item.metadata["type"])
        elseif item.metadata["type"] == "lsmc" then
            TriggerClientEvent("ems:client:applyDutyClothing", source, item.metadata["type"])
        elseif item.metadata["type"] == "stonk" then
            TriggerClientEvent("stonk:client:applyDutyClothing", source)
        elseif item.metadata["type"] == "patient" then
            Player(source).state.isWearingPatientOutfit = true
            TriggerClientEvent("ems:client:applyPatientClothing", source)
        end
    end
end)
