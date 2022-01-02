
QBCore.Commands.Add("giveitem", "Give An Item", {{name="id", help="Player ID"},{name="item", help="Name of the item"}, {name="amount", help="Amount of items"}}, true, function(source, args)
    local Player = QBCore.Functions.GetPlayer(tonumber(args[1]))
    local amount = tonumber(args[3])
    local itemData = QBCore.Shared.Items[tostring(args[2]):lower()]
    if Player ~= nil then
        if amount > 0 then
            if itemData ~= nil then
                -- check iteminfo
                local info = {}
                if itemData["name"] == "id_card" then
                    info.citizenid = Player.PlayerData.citizenid
                    info.firstname = Player.PlayerData.charinfo.firstname
                    info.lastname = Player.PlayerData.charinfo.lastname
                    info.birthdate = Player.PlayerData.charinfo.birthdate
                    info.gender = Player.PlayerData.charinfo.gender
                    info.nationality = Player.PlayerData.charinfo.nationality
                elseif itemData["name"] == "driver_license" then
                    info.firstname = Player.PlayerData.charinfo.firstname
                    info.lastname = Player.PlayerData.charinfo.lastname
                    info.birthdate = Player.PlayerData.charinfo.birthdate
                    info.type = "Class C Driver License"
                elseif itemData["type"] == "weapon" then
                    amount = 1
                    info.serie = tostring(QBCore.Shared.RandomInt(2) .. QBCore.Shared.RandomStr(3) .. QBCore.Shared.RandomInt(1) .. QBCore.Shared.RandomStr(2) .. QBCore.Shared.RandomInt(3) .. QBCore.Shared.RandomStr(4))
                end

                if Player.Functions.AddItem(itemData["name"], amount, false, info) then
                    TriggerClientEvent('hud:client:DrawNotification', source, string.format("Vous avez donné ~o~%s ~b~%s ~s~à ~o~%s", amount, itemData["name"], GetPlayerName(tonumber(args[1]))))
                else
                    TriggerClientEvent('hud:client:DrawNotification', source,  "~r~L'objet ne peut pas être donné")
                end
            else
                TriggerClientEvent('hud:client:DrawNotification', source,  "~r~L'objet n'existe pas !")
            end
        end
    end
end, "admin")
