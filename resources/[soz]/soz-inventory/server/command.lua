
QBCore.Commands.Add('clearinv', 'Clear Players Inventory (Admin Only)', { { name = 'id', help = 'Player ID' } }, false, function(source, args)
    local playerId = args[1] or source
    local Player = QBCore.Functions.GetPlayer(tonumber(playerId))
    if Player then
        Inventory.Clear(Player.PlayerData.source, false)
    else
        TriggerClientEvent('QBCore:Notify', source, 'Player Not Online', 'error')
    end
end, 'admin')

QBCore.Commands.Add("giveitem", "Give An Item", {{name="id", help="Player ID"},{name="item", help="Name of the item"}, {name="amount", help="Amount of items"}}, true, function(source, args)
    local Player = QBCore.Functions.GetPlayer(tonumber(args[1]))
    local amount = tonumber(args[3])
    local itemData = QBCore.Shared.Items[tostring(args[2]):lower()]
    if Player ~= nil then
        if amount > 0 then
            if itemData ~= nil then
                -- check iteminfo
                local metadata = {}
                if itemData["name"] == "id_card" then
                    metadata.citizenid = Player.PlayerData.citizenid
                    metadata.firstname = Player.PlayerData.charinfo.firstname
                    metadata.lastname = Player.PlayerData.charinfo.lastname
                    metadata.birthdate = Player.PlayerData.charinfo.birthdate
                    metadata.gender = Player.PlayerData.charinfo.gender
                    metadata.nationality = Player.PlayerData.charinfo.nationality
                elseif itemData["name"] == "driver_license" then
                    metadata.firstname = Player.PlayerData.charinfo.firstname
                    metadata.lastname = Player.PlayerData.charinfo.lastname
                    metadata.birthdate = Player.PlayerData.charinfo.birthdate
                    metadata.type = "Class C Driver License"
                elseif itemData["type"] == "weapon" then
                    amount = 1
                    metadata.serie = tostring(QBCore.Shared.RandomInt(2) .. QBCore.Shared.RandomStr(3) .. QBCore.Shared.RandomInt(1) .. QBCore.Shared.RandomStr(2) .. QBCore.Shared.RandomInt(3) .. QBCore.Shared.RandomStr(4))
                end

                Inventory.AddItem(Player.PlayerData.source, itemData["name"], amount, metadata, false, function(success, reason)
                    if success then
                        TriggerClientEvent('hud:client:DrawNotification', source, string.format("Vous avez donné ~o~%s ~b~%s ~s~à ~o~%s", amount, itemData["name"], GetPlayerName(tonumber(args[1]))))
                    else
                        TriggerClientEvent('hud:client:DrawNotification', source,  "~r~L'objet ne peut pas être donné: ".. reason)
                    end
                end)
            else
                TriggerClientEvent('hud:client:DrawNotification', source,  "~r~L'objet n'existe pas !")
            end
        end
    end
end, "admin")
