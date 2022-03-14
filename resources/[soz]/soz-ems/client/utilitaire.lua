local lit_ems = {2117668672, 1631638868}

exports["qb-target"]:AddTargetModel(lit_ems, {
    options = {
        {
            icon = "fas fa-bed",
            label = "S'allonger sur le lit",
            action = function(entity)
                local player = GetPlayerPed(-1)
                local coords = GetEntityCoords(entity)
                local heading = GetEntityHeading(entity)
                if heading >= 180 then
                    heading = heading - 179
                else
                    heading = heading + 179
                end
                SetEntityHeading(player, heading)
                SetPedCoordsKeepVehicle(player, coords.x, coords.y, coords.z)
                isInHospitalBed = true
                TaskPlayAnim(player, "anim@gangops@morgue@table@", "body_search", 1.0, 1.0, -1, 1, 0, 0, 0, 0)
            end,
        },
    },
    distance = 2.5,
})
