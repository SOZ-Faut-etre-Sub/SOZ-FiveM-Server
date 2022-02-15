local QBCore = exports["qb-core"]:GetCoreObject()

Citizen.CreateThread(function()
    -- Blip
    if not QBCore.Functions.GetBlip("driving_school") then
        local blipCoords = Config.Peds["secretary"]
        QBCore.Functions.CreateBlip("driving_school", {
            name = Config.BlipName,
            coords = vector2(blipCoords.x, blipCoords.y),
            sprite = Config.BlipSprite,
            color = Config.BlipColor
        })
    end

    -- Format licenses target options
    local options = {}
    for _, data in pairs(Config.Licenses) do
        table.insert(options, {
            event = data.event,
            icon = data.icon,
            label = string.format(data.label, data.price)
        })
    end

    -- Secretary Ped
    local sData = Config.Peds["secretary"]
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
            target = {
                options = options,
                distance = 2.5,
            },
        },
    })
end)
