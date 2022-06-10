Housing.Functions.Components.SetupEntryInteraction = function(propertyId, property)
    local entryZone = property:GetEntryZone()
    local zoneName = "property_" .. propertyId .. "_entry"

    Housing.Functions.TargetInteraction(zoneName, entryZone, {
        {
            label = "Acheter",
            icon = "c:housing/acheter.png",
            canInteract = function()
                return property:HasAvailableApartment() and not Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerEvent("housing:client:ShowBuyMenu", propertyId)
            end,
        },
        {
            label = "Vendre",
            icon = "c:housing/vendre.png",
            canInteract = function()
                return property:HasRentedApartment(PlayerData.citizenid) and not Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerEvent("housing:client:ShowSellMenu", propertyId)
            end,
        },
        {
            label = "Rentrer",
            icon = "c:housing/entrer.png",
            event = "soz-housing:client:rentrer",
            canInteract = function()
                return property:HasRentedApartment(PlayerData.citizenid) and not Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerEvent("housing:client:ShowEnterMenu", propertyId)
            end,
        },
        {
            label = "Garage",
            icon = "c:housing/garage.png",
            canInteract = function()
                return property:HasGarage() and property:HasRentedApartment(PlayerData.citizenid) and not Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerEvent("soz-housing:client:garage", property.identifier)
            end,
        },
    })
end

Housing.Functions.Components.SetupExitInteraction = function(propertyId, apartmentId, apartment)
    local exitZone = apartment:GetExitCoord()
    local zoneName = "apartment_" .. apartmentId .. "_exit"

    Housing.Functions.TargetInteraction(zoneName, exitZone, {
        {
            label = "Sortir",
            icon = "c:housing/entrer.png",
            canInteract = function()
                return Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerServerEvent("housing:server:ExitProperty", propertyId, apartmentId)
            end,
        },
    })
end
