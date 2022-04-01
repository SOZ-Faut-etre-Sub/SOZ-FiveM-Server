--- Callbacks
QBCore.Functions.CreateCallback("police:server:getVehicleOwner", function(source, cb, plate)
    local player = MySQL.single.await(
                       "SELECT JSON_VALUE(player.charinfo, '$.firstname') as firstname, JSON_VALUE(player.charinfo, '$.lastname') as lastname FROM player_vehicles INNER JOIN player ON player_vehicles.citizenid = player.citizenid WHERE plate = ?",
                       {plate})

    if player then
        cb(player.firstname .. " " .. player.lastname)
    else
        cb("inconnu")
    end
end)
