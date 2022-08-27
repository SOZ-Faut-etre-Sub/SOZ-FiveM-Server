local Elevators = {
    ["stonk:0"] = {
        name = "Stonk:Elevator0",
        label = "Sous-sol",
        buttons = vector2(11.99, -668.57),
        heading = 6.3,
        z = {min = 33.48, max = 34.05},
        upTo = {"stonk:2L", "stonk:1L"},
        downTo = nil,
        spawnPoint = vector4(10.53, -671.79, 32.45, 359.77),
    },
    ["stonk:1L"] = { -- Level 1, Left-side (facing elevators from outside)
        name = "Stonk:Elevator1L",
        label = "Coffre",
        buttons = vector2(15.79, -689.22),
        heading = 24.38,
        z = {min = 40.6, max = 41.1},
        upTo = "stonk:2L",
        downTo = "stonk:0",
        spawnPoint = vector4(17.27, -690.0, 39.73, 23.0),
    },
    ["stonk:1R"] = { -- Level 1, Right-side (facing elevators from outside)
        name = "Stonk:Elevator1R",
        label = "Coffre",
        buttons = vector2(13.05, -690.47),
        heading = 24.38,
        z = {min = 40.6, max = 41.1},
        upTo = "stonk:2R",
        downTo = "stonk:0",
        spawnPoint = vector4(14.59, -691.35, 39.73, 23.0),
    },
    ["stonk:2L"] = { -- Level 2, Left-side (facing elevators from outside)
        name = "Stonk:Elevator2L",
        label = "Niveau principal",
        buttons = vector2(15.75, -689.18),
        heading = 24.38,
        z = {min = 45.9, max = 46.4},
        upTo = nil,
        downTo = {"stonk:1L", "stonk:0"},
        spawnPoint = vector4(17.3, -689.98, 45.01, 23.0),
    },
    ["stonk:2R"] = { -- Level 2, Right-side (facing elevators from outside)
        name = "Stonk:Elevator2R",
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
        name = "LSMC:Elevator0",
        label = "Rez-de-chaussée",
        buttons = vector2(337.33, -1433.18),
        heading = 320,
        z = {min = 32.51, max = 33.51},
        upTo = "lsmc:1",
        downTo = nil,
        spawnPoint = vector4(336.04, -1430.85, 32.51, 146.98),
    },
    ["lsmc:1"] = {
        name = "LSMC:Elevator1",
        label = "Toit",
        buttons = vector2(337.45, -1433.03),
        heading = 140,
        z = {min = 46.52, max = 47.52},
        upTo = nil,
        downTo = "lsmc:0",
        spawnPoint = vector4(336.3, -1431.05, 46.52, 140.67),
    },
    --- LSPD
    ["lspd:0"] = {
        name = "LSPD:Elevator0",
        label = "Rez-de-chaussée",
        buttons = vector2(609.72, -0.13),
        size = vector2(0.9, 0.1),
        heading = 350,
        z = {min = 69.63, max = 72.08},
        upTo = "lspd:1",
        downTo = nil,
        spawnPoint = vector4(611.07, -1.55, 70.63, 86.33),
    },
    ["lspd:1"] = {
        name = "LSPD:Elevator1",
        label = "Toit",
        buttons = vector2(565.19, 4.88),
        size = vector2(1.45, 0.4),
        heading = 0,
        z = {min = 102.23, max = 104.63},
        upTo = nil,
        downTo = "lspd:0",
        spawnPoint = vector4(565.96, 4.89, 103.23, 271.47),
    },
    --- BENNY'S
    ["bennys:0"] = {
        name = "Bennys:Elevator0",
        label = "Rez-de-chaussée",
        buttons = vector2(-173.83, -1272.33),
        size = vector2(0.2, 0.1),
        heading = 0,
        z = {min = 32.6, max = 33.0},
        upTo = "bennys:1",
        downTo = nil,
        spawnPoint = vector4(-172.57, -1273.25, 32.6, 86.66),
    },
    ["bennys:1"] = {
        name = "Bennys:Elevator1",
        label = "Toit",
        buttons = vector2(-171.17, -1274.1),
        size = vector2(0.2, 0.1),
        heading = 0,
        z = {min = 48.0, max = 48.2},
        upTo = nil,
        downTo = "bennys:0",
        spawnPoint = vector4(-172.49, -1273.3, 47.9, 270.31),
    },
    --- FBI
    ["fbi:0"] = {
        name = "FBI:Elevator0",
        label = "Rez-de-chaussée",
        buttons = vector2(138.08, -763.93),
        size = vector2(0.05, 3.35),
        heading = 340,
        z = {min = 45.45, max = 46.35},
        upTo = "fbi:1",
        downTo = nil,
        spawnPoint = vector4(136.14, -761.89, 45.75, 162.03),
    },
    ["fbi:1"] = {
        name = "FBI:Elevator1",
        label = "Étage",
        buttons = vector2(136.64, -763.40),
        size = vector2(0.05, 0.35),
        heading = 340,
        z = {min = 241.9, max = 242.75},
        upTo = nil,
        downTo = "fbi:0",
        spawnPoint = vector4(135.99, -761.77, 242.15, 161.57),
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
        data.size = data.size or vector2(0.1, 0.35)
        exports["qb-target"]:AddBoxZone(data.name, data.buttons, data.size.x, data.size.y, {
            heading = data.heading,
            minZ = data.z.min,
            maxZ = data.z.max,
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
