RunInverterRefreshLoop = false

function CreateInverterZone(identifier, data)
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

function CreateTerminalZone(identifier, data, facility)
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
                if facility.scope == "entreprise" then
                    return OnDutyUpwOrJob(facility.job)
                else
                    return OnDuty()
                end
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
