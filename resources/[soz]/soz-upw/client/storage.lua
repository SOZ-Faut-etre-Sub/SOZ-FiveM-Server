function CreateInverterZone(identifier, data)
    data.options = {
        {
            label = "Stocker l'énergie",
            event = "soz-upw:client:HarvestLoop",
            identifier = identifier,
            harvest = "inverter-in",
            canInteract = function()
                return OnDuty()
            end,
        },
        {
            label = "Collecter l'énergie",
            event = "soz-upw:client:HarvestLoop",
            identifier = identifier,
            harvest = "inverter-out",
            canInteract = function()
                return OnDuty()
            end,
        },
        {
            label = "Remplissage",
            type = "server",
            event = "soz-upw:server:FacilityCapacity",
            identifier = identifier,
            facility = "inverter",
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
