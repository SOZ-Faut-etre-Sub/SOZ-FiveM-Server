RunInverterRefreshLoop = false

function CreateInverterZone(identifier, data)
    local inverterSkin = table.deepclone(data)

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

    inverterSkin.sx = 100.0
    inverterSkin.sy = 100.0
    inverterSkin.minZ = inverterSkin.minZ - 50.0
    inverterSkin.maxZ = inverterSkin.maxZ + 50.0
    inverterSkin.onPlayerInOut = function(isIn)
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

                    Citizen.Wait(1000)
                end
            end)
        else
            RemoveReplaceTexture("upwpiletex", "UPW_Emit_100")
        end
    end

    CreateZone(identifier .. "_visual", "inverter", inverterSkin)
    return CreateZone(identifier, "inverter", data)
end

function CreateTerminalZone(identifier, data)
    data.options = {
        {
            label = "Déposer l'énergie",
            event = "soz-upw:client:HarvestLoop",
            identifier = identifier,
            harvest = "terminal-in",
            canInteract = function()
                return OnDuty()
            end,
        },
        {
            label = "État d'énergie",
            type = "server",
            event = "soz-upw:server:FacilityCapacity",
            identifier = identifier,
            facility = "terminal",
            canInteract = function()
                return OnDuty()
            end,
        },
    }

    return CreateZone(identifier, "terminal", data)
end

function CreateCloakroomZone()
    exports["qb-target"]:AddBoxZone("upw:cloakroom1", vector3(585.13, 2747.34, 41.86), 1.2, 4.4,
                                    {name = "upw:cloakroom1", heading = 4, minZ = 40.86, maxZ = 43.86}, {
        options = {
            {label = "S'habiller", icon = "c:jobs/habiller.png", event = "upw:client:OpenCloakroomMenu", job = "upw"},
        },
        distance = 2.5,
    })
    exports["qb-target"]:AddBoxZone("upw:cloakroom2", vector3(577.8, 2747.03, 41.86), 1.0, 5.0,
                                    {name = "upw:cloakroom2", heading = 4, minZ = 40.86, maxZ = 43.86}, {
        options = {
            {label = "S'habiller", icon = "c:jobs/habiller.png", event = "upw:client:OpenCloakroomMenu", job = "upw"},
        },
        distance = 2.5,
    })
end
