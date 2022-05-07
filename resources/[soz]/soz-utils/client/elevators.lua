local Elevators = {
    ["stonk:0"] = {
        name = "Elevator0",
        label = "Sous-sol",
        buttons = vector2(11.99, -668.57),
        heading = 6.3,
        z = {min = 33.48, max = 34.05},
        upTo = {"stonk:2L", "stonk:1L"},
        downTo = nil,
        spawnPoint = vector4(10.53, -671.79, 32.45, 359.77),
    },
    ["stonk:1L"] = { -- Level 1, Left-side (facing elevators from outside)
        name = "Elevator1L",
        label = "Coffre",
        buttons = vector2(15.79, -689.22),
        heading = 24.38,
        z = {min = 40.6, max = 41.1},
        upTo = "stonk:2L",
        downTo = "stonk:0",
        spawnPoint = vector4(17.27, -690.0, 39.73, 23.0),
    },
    ["stonk:1R"] = { -- Level 1, Right-side (facing elevators from outside)
        name = "Elevator1R",
        label = "Coffre",
        buttons = vector2(13.05, -690.47),
        heading = 24.38,
        z = {min = 40.6, max = 41.1},
        upTo = "stonk:2R",
        downTo = "stonk:0",
        spawnPoint = vector4(14.59, -691.35, 39.73, 23.0),
    },
    ["stonk:2L"] = { -- Level 2, Left-side (facing elevators from outside)
        name = "Elevator2L",
        label = "Niveau principal",
        buttons = vector2(15.75, -689.18),
        heading = 24.38,
        z = {min = 45.9, max = 46.4},
        upTo = nil,
        downTo = {"stonk:1L", "stonk:0"},
        spawnPoint = vector4(17.3, -689.98, 45.01, 23.0),
    },
    ["stonk:2R"] = { -- Level 2, Right-side (facing elevators from outside)
        name = "Elevator2R",
        label = "Niveau principal",
        buttons = vector2(13.09, -690.53),
        heading = 24.38,
        z = {min = 45.9, max = 46.4},
        upTo = nil,
        downTo = {"stonk:1R", "stonk:0"},
        spawnPoint = vector4(14.58, -691.15, 45.01, 26.12),
    },
    --- LSMC
    ["lsmc:0"] = {
        name = "Elevator0",
        label = "Rez de chaussez",
        buttons = vector2(337.33, -1433.18),
        heading = 320,
        z = {min = 32.51, max = 33.51},
        upTo = "lsmc:1",
        downTo = nil,
        spawnPoint = vector4(336.04, -1430.85, 32.51, 146.98),
    },
    ["lsmc:1"] = {
        name = "Elevator1",
        label = "Toit",
        buttons = vector2(337.45, -1433.03),
        heading = 50,
        z = {min = 46.52, max = 47.52},
        upTo = nil,
        downTo = "lsmc:0",
        spawnPoint = vector4(336.3, -1431.05, 46.52, 140.67),
    },
}

---Create QB-Target options for a possible elevator destination
---@param elevatorData table Current elevator data
local function CreateTargetOptions(elevatorData)
    local directions = {
        ["up"] = {field = "upTo", label = "Monter %s", icon = "c:elevators/monter.png"},
        ["down"] = {field = "downTo", label = "Descendre %s", icon = "c:elevators/descendre.png"},
    }

    local options = {}
    for _, dir in pairs(directions) do
        local destinations = elevatorData[dir.field]
        if destinations then
            if type(destinations) ~= "table" then
                destinations = {destinations}
            end

            for _, dest in ipairs(destinations) do
                local destination = Elevators[dest]
                if destination then
                    table.insert(options, {
                        icon = dir.icon,
                        label = string.format(dir.label, destination.label),
                        event = elevatorData.event or "soz-utils:client:elevator",
                        destination = dest,
                    })
                end
            end
        end
    end

    return options
end

-- Initiate all elevators
Citizen.CreateThread(function()
    for _, data in pairs(Elevators) do
        exports["qb-target"]:AddBoxZone(data.name, data.buttons, 0.1, 0.35, {
            heading = data.heading,
            minZ = data.z.min,
            maxZ = data.z.max,
            debugPoly = false,
        }, {options = CreateTargetOptions(data)})
    end
end)

AddEventHandler("soz-utils:client:elevator", function(data)
    if not data.destination or not Elevators[data.destination] then
        return
    end

    local fadeDelay = 500
    Citizen.CreateThread(function()
        DoScreenFadeOut(fadeDelay)
        Citizen.Wait(fadeDelay)

        local dest = Elevators[data.destination]
        local ped = PlayerPedId()
        SetEntityCoords(ped, dest.spawnPoint)
        SetEntityRotation(ped, 0.0, 0.0, dest.spawnPoint.w, 0, false)

        DoScreenFadeIn(fadeDelay)
    end)
end)
