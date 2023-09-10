RunInverterRefreshLoop = false

local objectIdJobs = {}

function CreateInverterZone(identifier, data)
    exports["soz-core"]:CreateObject({
        id = identifier,
        position = {data.coords.x, data.coords.y, data.coords.z, data.heading},
        model = GetHashKey("upwpile"),
    });

    data.options = {
        {
            label = "Accéder à l'onduleur",
            icon = "c:inventory/ouvrir_le_stockage.png",
            event = "inventory:client:qTargetOpenInventory",
            storageID = identifier,
            storage = {type = "inverter"},
            canInteract = function()
                return OnDuty()
            end,
        },
    }

    BoxZone:Create(data.coords, 100.0, 100.0, {
        name = identifier .. "_visual",
        heading = data.heading,
        minZ = data.minZ - 50.0,
        maxZ = data.maxZ + 50.0,
        debugPoly = false,
    }):onPlayerInOut(function(isIn)
        RunInverterRefreshLoop = isIn
        if isIn then
            Citizen.CreateThread(function()
                while RunInverterRefreshLoop do
                    local capacity = QBCore.Functions.TriggerRpc("soz-upw:server:GetInverterStorage", identifier)

                    if capacity == 100 then
                        AddReplaceTexture("upwpiletex", "UPW_Emit_100", "upwpiletex", "UPW_Emit_100")
                    elseif capacity >= 66 then
                        AddReplaceTexture("upwpiletex", "UPW_Emit_100", "upwpiletex", "UPW_Emit_66")
                    elseif capacity >= 33 then
                        AddReplaceTexture("upwpiletex", "UPW_Emit_100", "upwpiletex", "UPW_Emit_33")
                    else
                        AddReplaceTexture("upwpiletex", "UPW_Emit_100", "upwpiletex", "UPW_Emit_0")
                    end

                    Citizen.Wait(5000)
                end
            end)
        else
            RemoveReplaceTexture("upwpiletex", "UPW_Emit_100")
        end
    end)

    return CreateZone(identifier, "inverter", data)
end

local function getTerminalProp(scope)
    if scope == "default" then
        return "soz_prop_elec01"
    elseif scope == "entreprise" then
        return "soz_prop_elec02"
    end
end

local function getTerminalTargetProp(scope)
    if scope == "default" then
        return {"soz_prop_elec01", "soz_prop_elec01_hs2"}
    elseif scope == "entreprise" then
        return {"soz_prop_elec02", "soz_prop_elec02_hs2"}
    end
end

function CreateTerminalZone(identifier, data, facility)
    local prop = getTerminalProp(facility.scope)

    exports["soz-core"]:CreateObject({
        id = identifier,
        position = {data.coords.x, data.coords.y, data.coords.z, data.heading},
        model = GetHashKey(prop),
    });

    objectIdJobs[identifier] = facility.job
end

function CreateTerminalTarget()
    CreateTerminalTargetScope("default")
    CreateTerminalTargetScope("entreprise")
end

function CreateTerminalTargetScope(scope)
    local prop = getTerminalTargetProp(scope)
    local options = {
        {
            label = "Déposer l'énergie",
            action = function(entity)
                local objectId = exports["soz-core"]:GetObjectIdFromEntity(entity)

                if not objectId then
                    return
                end

                TriggerEvent("soz-upw:client:HarvestLoop", {identifier = objectId, harvest = "terminal-in"})
            end,
            canInteract = function()
                return OnDuty()
            end,
        },
        {
            label = "État d'énergie",
            action = function(entity)
                local objectId = exports["soz-core"]:GetObjectIdFromEntity(entity)

                if not objectId then
                    return
                end

                TriggerServerEvent("soz-upw:server:FacilityCapacity", {identifier = objectId, facility = "terminal"})
            end,
            scope = scope,
            canInteract = function(entity, distance, data)
                local objectId = exports["soz-core"]:GetObjectIdFromEntity(entity)

                if not objectId then
                    return false
                end

                if data.scope == "entreprise" then
                    return OnDutyUpwOrJob(objectIdJobs[objectId])
                else
                    return OnDuty()
                end
            end,
        },
    }

    exports["qb-target"]:AddTargetModel(prop, {options = options, distance = 2})
end
