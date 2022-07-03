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

Citizen.CreateThread(function()
    -- Blip
    if not QBCore.Functions.GetBlip("job_upw") then
        QBCore.Functions.CreateBlip("job_upw", {
            name = Config.Blip.Name,
            coords = Config.Blip.Coords,
            sprite = Config.Blip.Sprite,
        })
    end

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

        if conf.create == nil then
            for _, c in ipairs(conf) do
                createZone(facility, c.create, c.zone)
            end
        else
            createZone(facility, conf.create, conf.zone)
        end
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
function OnDuty()
    local PlayerData = QBCore.Functions.GetPlayerData()
    return PlayerData.job.id == "upw" and PlayerData.job.onduty
end
