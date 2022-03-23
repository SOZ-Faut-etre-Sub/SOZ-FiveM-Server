--- Callbacks
QBCore.Functions.CreateCallback("police:server:getVehicleOwner", function(source, cb, plate)
    local player = MySQL.single.await(
                       "SELECT JSON_VALUE(players.charinfo, '$.firstname') as firstname, JSON_VALUE(players.charinfo, '$.lastname') as lastname FROM player_vehicles INNER JOIN players ON player_vehicles.citizenid = players.citizenid WHERE plate = ?",
                       {plate})

    if player then
        cb(player.firstname .. " " .. player.lastname)
    else
        cb("inconnu")
    end
end)
