Housing.Functions.Components.SetupEntryInteraction = function(propertyId, property)
    local entryZone = property:GetEntryZone()
    local zoneName = "property_" .. propertyId .. "_entry"

    Housing.Functions.TargetInteraction(zoneName, entryZone, {
        {
            label = "Acheter",
            icon = "c:housing/buy.png",
            blackoutGlobal = true,
            canInteract = function()
                return not property:HasOwnedApartmentForCitizenId(PlayerData.citizenid) and property:HasAvailableApartment() and
                           not Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerEvent("housing:client:ShowBuyMenu", propertyId)
            end,
        },
        {
            label = "Vendre",
            icon = "c:housing/sell.png",
            blackoutGlobal = true,
            canInteract = function()
                return property:HasOwnedApartmentForCitizenId(PlayerData.citizenid) and not Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerEvent("housing:client:ShowSellMenu", propertyId)
            end,
        },
        {
            label = "Visiter",
            icon = "c:housing/inspect.png",
            canInteract = function()
                return property:HasAvailableApartment() and not Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerEvent("housing:client:ShowInspectMenu", propertyId)
            end,
        },
        {
            label = "Sonner",
            icon = "c:housing/bell.png",
            canInteract = function()
                return property:HasRentedApartment() and property:HasRentedApartmentsBesidesForCitizenId(PlayerData.citizenid) and
                           not Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerEvent("housing:client:ShowBellMenu", propertyId)
            end,
        },
        {
            label = "Entrer",
            icon = "c:housing/enter.png",
            canInteract = function()
                return property:HasRentedApartmentForCitizenId(PlayerData.citizenid) and not Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerEvent("housing:client:ShowEnterMenu", propertyId)
            end,
        },
        {
            label = "Garage",
            icon = "c:housing/garage.png",
            canInteract = function()
                return property:HasGarage() and property:HasRentedApartmentForCitizenId(PlayerData.citizenid) and not Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerEvent("housing:client:ShowGarageMenu", propertyId)
            end,
        },
        {
            label = "Ranger mon véhicule",
            icon = "c:housing/garage.png",
            canInteract = function()
                return property:HasGarage() and property:HasRentedApartmentForCitizenId(PlayerData.citizenid) and not Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerEvent("housing:client:GarageStoreVehicle", propertyId)
            end,
        },
        {
            label = "Ajouter Colocataire",
            blackoutGlobal = true,
            icon = "c:jobs/enroll.png",
            canInteract = function()
                return property:HasOwnedApartmentForCitizenId(PlayerData.citizenid) and property:CanAddRoommate(PlayerData.citizenid) and
                           not Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerEvent("housing:client:ShowAddRoommateMenu", propertyId)
            end,
        },
        {
            label = "Retirer Colocataire",
            blackoutGlobal = true,
            icon = "c:jobs/fire.png",
            canInteract = function()
                return property:HasOwnedApartmentForCitizenId(PlayerData.citizenid) and property:CanRemoveRoommate(PlayerData.citizenid) and
                           not Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerEvent("housing:client:ShowRemoveRoommateMenu", propertyId)
            end,
        },
        {
            label = "Partir de la colocation",
            blackoutGlobal = true,
            icon = "c:jobs/fire.png",
            canInteract = function()
                return property:HasApartmentAsRoommate(PlayerData.citizenid) and not Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerEvent("housing:client:QuitColocation", propertyId)
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
            icon = "c:housing/enter.png",
            canInteract = function()
                return Housing.Functions.IsInsideApartment()
            end,
            action = function()
                TriggerServerEvent("housing:server:ExitProperty", propertyId, apartmentId)
            end,
        },
    })
end
