local sit = false
local lastCoord = nil
local sitchair = {
    1580642483,
    -1278649385,
    -109356459,
    -1633198649,
    -377849416,
    1037469683,
    603897027,
    49088219,
    1339364336,
}

RegisterCommand("unsit", function()
    local player = GetPlayerPed(-1)
    if sit == true then
        SetPedCoordsKeepVehicle(player, lastCoord)
        sit = false
    end
end, false)

RegisterKeyMapping("unsit", "", "keyboard", "x")

exports["qb-target"]:AddTargetModel(sitchair, {
    options = {
        {
            icon = "c:global/sit.png",
            label = "S'asseoir",
            action = function(entity)
                local player = GetPlayerPed(-1)
                local coords = GetEntityCoords(entity)
                local heading = GetEntityHeading(entity)
                sit = true
                lastCoord = GetEntityCoords(player)
                if heading >= 180 then
                    heading = heading - 179
                else
                    heading = heading + 179
                end
                TaskStartScenarioAtPosition(player, "PROP_HUMAN_SEAT_CHAIR_MP_PLAYER", coords.x, coords.y, coords.z - 0.05, heading, 0, true, true)
            end,
        },
    },
    distance = 1,
})

