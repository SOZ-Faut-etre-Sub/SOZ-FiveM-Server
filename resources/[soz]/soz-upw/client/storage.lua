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
            label = "Remplissage",
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
