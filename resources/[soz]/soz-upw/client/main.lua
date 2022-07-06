QBCore = exports["qb-core"]:GetCoreObject()
SozCoreJobs = exports["soz-jobs"]:GetCoreObject()

local function GetZoneConfig(zone)
    local config = {
        ["plant"] = {
            {create = CreateEnergyZone, zone = "zones.energyZone"},
            {create = CreateWasteZone, zone = "zones.wasteZone"},
        },
        ["inverter"] = {create = CreateInverterZone, zone = "zone"},
        ["terminal"] = {create = CreateTerminalZone, zone = "zone"},
    }

    if config[zone] == nil then
        error("Invalid config or facility type: " .. facility.type)
    end

    return config[zone]
end

local function PrepareZoneData(data, path)
    local zoneData = data

    local attrs = QBCore.Shared.SplitStr(path, "%.")

    for _, attr in ipairs(attrs) do
        zoneData = zoneData[attr]

        if zoneData == nil then
            return -- Skip is zone not exists
        end
    end

    zoneData.coords = vector3(zoneData.coords.x, zoneData.coords.y, zoneData.coords.z)

    return zoneData
end

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    -- Blip
    if not QBCore.Functions.GetBlip("job_upw") then
        QBCore.Functions.CreateBlip("job_upw", {
            name = Config.Blip.station.Name,
            coords = Config.Blip.station.Coords,
            sprite = Config.Blip.station.Sprite,
            scale = Config.Blip.station.Scale,
        })
    end
end)

Citizen.CreateThread(function()
    local function createZone(facility, createFunc, zonePath)
        local data = json.decode(facility.data)
        local zone = PrepareZoneData(data, zonePath)

        if zone then
            createFunc(facility.identifier, zone)
        end
    end

    -- Fetch facilities from database
    local facilities = QBCore.Functions.TriggerRpc("soz-upw:server:GetFacilitiesFromDb", {
        "plant",
        "inverter",
        "terminal",
    })

    for _, facility in ipairs(facilities) do
        local conf = GetZoneConfig(facility.type)
        local data = json.decode(facility.data)

        if conf.create == nil then
            for _, c in ipairs(conf) do
                createZone(facility, c.create, c.zone)
            end
        else
            createZone(facility, conf.create, conf.zone)
        end

        -- Blip
        local blip_id = ("job_upw_%s"):format(facility.identifier)

        if not QBCore.Functions.GetBlip(blip_id) then
            local blipConfig
            local coords

            if facility.type == "plant" then
                coords = data.zones.energyZone.coords
                blipConfig = Config.Blip.plant
            end

            if facility.type == "inverter" then
                blipConfig = Config.Blip.inverter
                coords = data.zone.coords
            end

            if facility.type == "terminal" then
                coords = data.zone.coords

                if data.scope == "entreprise" then
                    blipConfig = Config.Blip.terminal_job
                else
                    blipConfig = Config.Blip.terminal_global
                end
            end

            if blipConfig then
                local blipCoords = vector3(coords.x, coords.y, coords.z)

                QBCore.Functions.CreateBlip(blip_id, {
                    name = blipConfig.Name,
                    coords = blipCoords,
                    sprite = blipConfig.Sprite,
                    scale = blipConfig.Scale,
                    color = blipConfig.Color,
                })
            end
        end

        QBCore.Functions.HideBlip(blip_id, true)
    end

    -- Resale zone
    CreateResaleZone(Config.Upw.Resale.Zone)
end)

function CreateZone(identifier, zoneType, data)
    local zoneName = string.format("%s_%s", identifier, zoneType)

    exports["qb-target"]:AddBoxZone(zoneName, data.coords, data.sx, data.sy, {
        heading = data.heading,
        minZ = data.minZ,
        maxZ = data.maxZ,
        debugPoly = false,
    }, {options = data.options})
end

RegisterNetEvent("soz-upw:client:CreateZone", function(identifier, zoneType, data)
    local conf = GetZoneConfig(zoneType)

    if conf.create then
        conf.create(identifier, data)
    else
        exports["soz-hud"]:DrawNotification("Erreur lors de la création de la zone", "error")
    end
end)

--
-- UTILS
--
function OnDuty(job)
    local job = job or "upw"
    local PlayerData = QBCore.Functions.GetPlayerData()
    return PlayerData.job.id == job and PlayerData.job.onduty
end
