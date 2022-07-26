QBCore = exports["qb-core"]:GetCoreObject()

local playerInsideZone = false -- Is player inside for for NPC interaction ?

Citizen.CreateThread(function()
    -- Blip
    if not QBCore.Functions.GetBlip("driving_school") then
        local blipCoords = Config.Peds.secretary
        QBCore.Functions.CreateBlip("driving_school", {
            name = Config.BlipName,
            coords = vector2(blipCoords.x, blipCoords.y),
            sprite = Config.BlipSprite,
            color = Config.BlipColor,
            scale = Config.BlipScale,
        })
    end

    -- Format licenses target options
    local options = {}
    for licenseType, data in pairs(Config.Licenses) do
        table.insert(options, {
            license = licenseType,
            event = "soz-driving-license:client:start_exam",
            icon = data.icon,
            label = string.format(data.label, data.price),
            blackoutGlobal = true,
            canInteract = function()
                return playerInsideZone
            end,
        })
    end

    -- Secretary Ped
    local sData = Config.Peds.secretary
    exports["qb-target"]:SpawnPed({
        {
            spawnNow = true,
            model = sData.modelHash,
            coords = vector4(sData.x, sData.y, sData.z, sData.rotation),
            minusOne = true,
            freeze = true,
            invincible = true,
            blockevents = true,
            scenario = "WORLD_HUMAN_CLIPBOARD",
            target = {options = options, distance = 2.5},
        },
    })

    -- BoxZone
    local zone = BoxZone:Create(vector3(sData.x, sData.y, sData.z), 4.0, 4.0, {
        name = "drivingschool",
        heading = sData.rotation,
    })
    zone:onPlayerInOut(function(isInside)
        playerInsideZone = isInside
    end)

end)

-- TODO To be moved elsewhere
function setupModel(model)
    RequestModel(model)
    while not HasModelLoaded(model) do
        RequestModel(model)
        Citizen.Wait(0)
    end
end
