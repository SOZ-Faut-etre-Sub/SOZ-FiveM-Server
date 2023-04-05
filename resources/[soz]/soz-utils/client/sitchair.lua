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

    --Poulpito list
    -1761659350, -- chaise bois
    -232870343, -- banc bois
    47332588, -- siege golf
    -403891623, -- banc pearl (4 places)
    -741944541, --chaise plastique pearl
    -1521264200, --chaise bois pearl
    1805980844, --banc metal (2 places)
    1404176808, --chaise metal/blanc
    525667351, --chaise metal arrondie
    764848282, -- chaise metal bois
    1681727376, --abri bus sud (3 places)
    -99500382, --banc beton (3 places)
    -628719744, --banc metal simple (3places)
    -1631057904, --banc yourad (3places)
    -1317098115, --banc metal bois (3places)
    1290593659, --banc mirror park (3places)
    1071807406, --chaise camping sandy
    -1841495633, --canap pourri sandy
}

local layingchair = {
    -1498352975, -- chaise longue remontée
}
local layingFlatBed = {
    -2024837020, -- chaise longue plat
}


function CoordChange(x,y,heading)
    heading2 = math.rad(heading)
    x2 = x*math.cos(heading2) - y*math.sin(heading2)
    y2 = x*math.sin(heading2) + y*math.cos(heading2)
    return x2, y2
end 

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

                local x2, y2 = CoordChange((offset.x or 0.0), (offset.y or 0.0), heading + (offset.heading or 0.0))

                TaskStartScenarioAtPosition(player, "PROP_HUMAN_SEAT_CHAIR_MP_PLAYER", coords.x + (x2 or 0.0), coords.y + (y2 or 0.0),
                                            coords.z + (offset.z or 0.0), heading + (offset.heading or 0.0), -1, true, true)
            end,
        },
    },
    distance = 1.2,
})

exports["qb-target"]:AddTargetModel(sitchair, {
    options = {
        {
            icon = "c:global/sit-beer.png",
            label = "S'asseoir et Boire une bière",
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

                local x2, y2 = CoordChange((offset.x or 0.0), (offset.y or 0.0), heading + (offset.heading or 0.0))
                TaskStartScenarioAtPosition(player, "PROP_HUMAN_SEAT_CHAIR_DRINK_BEER", coords.x + (x2 or 0.0), coords.y + (y2 or 0.0),
                                            coords.z + (offset.z or 0.0), heading + (offset.heading or 0.0), -1, false, true)
            end,
        },
    },
    distance = 1.2,
})

exports["qb-target"]:AddTargetModel(sitchair, {
    options = {
        {
            icon = "c:global/sit-burger.png",
            label = "S'asseoir et Manger",
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

                local x2, y2 = CoordChange((offset.x or 0.0), (offset.y or 0.0), heading + (offset.heading or 0.0))

                TaskStartScenarioAtPosition(player, "PROP_HUMAN_SEAT_CHAIR_FOOD", coords.x + (x2 or 0.0), coords.y + (y2 or 0.0),
                                            coords.z + (offset.z or 0.0), heading + (offset.heading or 0.0), -1, false, true)
            end,
        },
    },
    distance = 1.2,
})

exports["qb-target"]:AddTargetModel(layingchair, {
    options = {
        {
            icon = "c:global/sunbath.png",
            label = "S'allonger",
            action = function(entity)
                local player = PlayerPedId()
                local coords = GetEntityCoords(entity)
                FreezeEntityPosition(entity, true)
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

                local x2, y2 = CoordChange((offset.x or 0.0), (offset.y or 0.0), heading + (offset.heading or 0.0))

                TaskStartScenarioAtPosition(player, "PROP_HUMAN_SEAT_SUNLOUNGER", coords.x + (x2 or 0.0), coords.y + (y2 or 0.0),
                                            coords.z + (offset.z or 0.0), heading + (offset.heading or 0.0), -1, false, false)
                FreezeEntityPosition(entity, false)                          
            end,
        },
    },
    distance = 1.2,
})

exports["qb-target"]:AddTargetModel(layingFlatBed, {
    options = {
        {
            icon = "c:global/sunbath.png",
            label = "S'allonger sur le dos",
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

                local x2, y2 = CoordChange((offset.x or 0.0), (offset.y or 0.0), heading + (offset.heading or 0.0))

                TaskStartScenarioAtPosition(player, "WORLD_HUMAN_SUNBATHE_BACK", coords.x + (x2 or 0.0), coords.y + (y2 or 0.0),
                                            coords.z + (offset.z or 0.0), heading + (offset.heading or 0.0), -1, true, true)                          
            end,
        },
    },
    distance = 1.2,
})

exports["qb-target"]:AddTargetModel(layingFlatBed, {
    options = {
        {
            icon = "c:global/sunbath.png",
            label = "S'allonger sur le ventre",
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

                local x2, y2 = CoordChange((offset.x or 0.0), (offset.y or 0.0), heading + (offset.heading or 0.0))

                TaskStartScenarioAtPosition(player, "WORLD_HUMAN_SUNBATHE", coords.x + (x2 or 0.0), coords.y + (y2 or 0.0),
                                            coords.z + (offset.z or 0.0), heading + (offset.heading or 0.0), 0, true, true)                         
            end,
        },
    },
    distance = 1.2,
})

