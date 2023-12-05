--- Callbacks
QBCore.Functions.CreateCallback("police:server:getVehicleOwner", function(source, cb, plate)
    local owner = MySQL.single.await(
                      "SELECT JSON_VALUE(player.charinfo, '$.firstname') as firstname, JSON_VALUE(player.charinfo, '$.lastname') as lastname, player_vehicles.job FROM player_vehicles INNER JOIN player ON player_vehicles.citizenid = player.citizenid WHERE plate = ?",
                      {plate})

    if owner then
        if owner.job then
            cb(SozJobCore.Jobs[owner.job].label or owner.job)
        else
            cb(owner.firstname .. " " .. owner.lastname)
        end
    else
        cb("inconnu")
    end
end)
