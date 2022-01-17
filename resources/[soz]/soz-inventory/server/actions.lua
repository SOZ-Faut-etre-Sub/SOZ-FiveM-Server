QBCore.Functions.CreateCallback("inventory:server:openPlayerInventory", function(source, cb, type, id)
    local ply = Player(source)
    local Player = QBCore.Functions.GetPlayer(source)

    if not ply.state.inv_busy then
        cb(Inventory(Player.PlayerData.source))
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Inventaire en cours d'utilisation")
        cb(nil)
    end
end)

RegisterNetEvent("inventory:server:UseItemSlot", function(slot)
    local Player = QBCore.Functions.GetPlayer(source)
    local itemData = Player.Functions.GetItemBySlot(slot)

    if itemData ~= nil then
        if itemData.type == "weapon" then
            if itemData.metadata.quality ~= nil then
                if itemData.metadata.quality > 0 then
                    TriggerClientEvent("inventory:client:UseWeapon", Player.PlayerData.source, itemData, true)
                else
                    TriggerClientEvent("inventory:client:UseWeapon", Player.PlayerData.source, itemData, false)
                end
            else
                TriggerClientEvent("inventory:client:UseWeapon", Player.PlayerData.source, itemData, true)
            end
        elseif itemData.useable then
            TriggerClientEvent("QBCore:Client:UseItem", Player.PlayerData.source, itemData)
        end
    end
end)

RegisterServerEvent("inventory:server:GiveItem", function(target, item, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    local Target = QBCore.Functions.GetPlayer(tonumber(target))
    local dist = #(GetEntityCoords(GetPlayerPed(Player.PlayerData.source)) - GetEntityCoords(GetPlayerPed(Target.PlayerData.source)))

    if Player == Target then
        return
    end
    if dist > 2 then
        return TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Personne n'est à portée de vous")
    end

    if amount <= item.amount then
        if amount == 0 then
            amount = item.amount
        end

        Inventory.TransfertItem(Player.PlayerData.source, Target.PlayerData.source, item.name, amount, item.metadata, item.slot, function(success, reason)
            if success then
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, string.format("Vous avez donné ~o~%s ~b~%s", amount, item.label))
                TriggerClientEvent("hud:client:DrawNotification", Target.PlayerData.source, string.format("Vous avez reçu ~o~%s ~b~%s", amount, item.label))

                TriggerClientEvent("SyncPlayEmoteSource", Player.PlayerData.source, "give2")
                TriggerClientEvent("SyncPlayEmoteSource", Target.PlayerData.source, "give2")
            else
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "~r~Vous ne pouvez pas donner cet objet !")
                TriggerClientEvent("hud:client:DrawNotification", Target.PlayerData.source, "~r~Vous ne pouvez pas recevoir d'objet !")
            end
        end)
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "~r~Vous ne possédez pas le nombre d'items requis pour le transfert")
    end
end)

RegisterServerEvent("inventory:server:GiveMoney", function(target, amount)
    local Player = QBCore.Functions.GetPlayer(source)
    local Target = QBCore.Functions.GetPlayer(tonumber(target))
    local dist = #(GetEntityCoords(GetPlayerPed(Player.PlayerData.source)) - GetEntityCoords(GetPlayerPed(Target.PlayerData.source)))

    if Player == Target then
        return
    end
    if dist > 2 then
        return TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Personne n'est à portée de vous")
    end
    if Player.Functions.RemoveMoney("money", amount) then
        Target.Functions.AddMoney("money", amount)
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, string.format("Vous avez donné ~r~%s$", amount))
        TriggerClientEvent("hud:client:DrawNotification", Target.PlayerData.source, string.format("Vous avez reçu ~g~%s$", amount))

        TriggerClientEvent("SyncPlayEmoteSource", Player.PlayerData.source, "give2")
        TriggerClientEvent("SyncPlayEmoteSource", Target.PlayerData.source, "give2")
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "~r~Vous ne possédez pas l'argent requis pour le transfert")
    end
end)

--- Temporary functions to test useable function with Startup item
QBCore.Functions.CreateUseableItem("driver_license", function(source, item)
    for k, v in pairs(QBCore.Functions.GetPlayers()) do
        local PlayerPed = GetPlayerPed(source)
        local TargetPed = GetPlayerPed(v)
        local dist = #(GetEntityCoords(PlayerPed) - GetEntityCoords(TargetPed))
        if dist < 3.0 then
            TriggerClientEvent("chat:addMessage", v, {
                template = "<div class=\"chat-message advert\"><div class=\"chat-message-body\"><strong>{0}:</strong><br><br> <strong>First Name:</strong> {1} <br><strong>Last Name:</strong> {2} <br><strong>Birth Date:</strong> {3} <br><strong>Licenses:</strong> {4}</div></div>",
                args = {
                    "Drivers License",
                    item.metadata.firstname,
                    item.metadata.lastname,
                    item.metadata.birthdate,
                    item.metadata.type,
                },
            })
        end
    end
end)

QBCore.Functions.CreateUseableItem("id_card", function(source, item)
    for k, v in pairs(QBCore.Functions.GetPlayers()) do
        local PlayerPed = GetPlayerPed(source)
        local TargetPed = GetPlayerPed(v)
        local dist = #(GetEntityCoords(PlayerPed) - GetEntityCoords(TargetPed))
        if dist < 3.0 then
            local gender = "Man"
            if item.metadata.gender == 1 then
                gender = "Woman"
            end
            TriggerClientEvent("chat:addMessage", v, {
                template = "<div class=\"chat-message advert\"><div class=\"chat-message-body\"><strong>{0}:</strong><br><br> <strong>Civ ID:</strong> {1} <br><strong>First Name:</strong> {2} <br><strong>Last Name:</strong> {3} <br><strong>Birthdate:</strong> {4} <br><strong>Gender:</strong> {5} <br><strong>Nationality:</strong> {6}</div></div>",
                args = {
                    "ID Card",
                    item.metadata.citizenid,
                    item.metadata.firstname,
                    item.metadata.lastname,
                    item.metadata.birthdate,
                    gender,
                    item.metadata.nationality,
                },
            })
        end
    end
end)
