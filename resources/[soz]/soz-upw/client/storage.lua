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
            event = "soz-upw:client:InverterCapacity",
            identifier = identifier,
            canInteract = function()
                return OnDuty()
            end,
        },
    }

    return CreateZone(identifier, "inverter", data)
end
