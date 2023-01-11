Housing.Functions.Components.SetupFridgeInteraction = function(propertyId, apartmentId, apartment)
    local fridgeZone = apartment:GetFridgeCoord()
    local zoneName = "apartment_" .. apartmentId .. "_fridge"

    Housing.Functions.TargetInteraction(zoneName, fridgeZone, {
        {
            label = "Frigo",
            icon = "c:inventory/ouvrir_le_stockage.png",
            canInteract = function()
                return not apartment:IsAvailable() and Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerServerEvent("inventory:server:openInventory", "house_fridge", apartment:GetIdentifier())
            end,
        },
    })
end

Housing.Functions.Components.SetupStashInteraction = function(propertyId, apartmentId, apartment)
    local stashZone = apartment:GetStashCoord()
    local zoneName = "apartment_" .. apartmentId .. "_stash"

    Housing.Functions.TargetInteraction(zoneName, stashZone, {
        {
            label = "Coffre",
            icon = "c:inventory/ouvrir_le_stockage.png",
            canInteract = function()
                return not apartment:IsAvailable() and Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerServerEvent("inventory:server:openInventory", "house_stash", apartment:GetIdentifier(), {
                    apartmentTier = apartment:GetTier(),
                })
            end,
        },
    })
end

Housing.Functions.Components.SetupMoneyInteraction = function(propertyId, apartmentId, apartment)
    local moneyZone = apartment:GetMoneyCoord()
    local zoneName = "apartment_" .. apartmentId .. "_money"

    Housing.Functions.TargetInteraction(zoneName, moneyZone, {
        {
            label = "Coffre d'argent",
            icon = "c:bank/compte_safe.png",
            canInteract = function()
                return not apartment:IsAvailable() and Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerEvent("banking:client:openHouseSafe", apartment:GetIdentifier(), {
                    apartmentTier = apartment:GetTier(),
                })
            end,
        },
    })
end
