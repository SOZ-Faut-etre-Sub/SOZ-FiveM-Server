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
    444105316,
    536071214,
    1085033290,
    1037469683,
    -1108904010,
    98421364,
    49088219,
    -1173315865,
    847910771,
    "soz_v_club_bahbarstool",
    "soz_v_club_baham_bckt_chr",
}

RegisterCommand("unsit", function()
    if lastCoord == nil then
        return
    end
    local player = PlayerPedId()
    local distance = #(lastCoord - GetEntityCoords(player))
    if sit == true and distance <= 2.5 then
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
                local player = PlayerPedId()
                local coords = GetEntityCoords(entity)
                local heading = GetEntityHeading(entity)
                sit = true
                lastCoord = GetEntityCoords(player)
                if heading >= 180 then
                    heading = heading - 179
                else
                    heading = heading + 179
                end
                local offset = Config.SeatChairOffset[GetEntityModel(entity)] or {
                    z = -(GetEntityHeightAboveGround(entity)),
                }
                TaskStartScenarioAtPosition(player, "PROP_HUMAN_SEAT_CHAIR_MP_PLAYER", coords.x + (offset.x or 0.0), coords.y + (offset.y or 0.0),
                                            coords.z + (offset.z or 0.0), heading, 0, true, true)
            end,
        },
    },
    distance = 1,
})
