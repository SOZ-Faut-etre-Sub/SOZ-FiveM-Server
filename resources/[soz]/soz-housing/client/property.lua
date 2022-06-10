local function SetupEntryInteraction(propertyId, property)
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

local function SetupExitInteraction(propertyId, apartmentId, apartment)
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

RegisterNetEvent("housing:client:SyncProperties", function()
    local properties = QBCore.Functions.TriggerRpc("housing:server:GetAllProperties")
    for propertyId, property in pairs(properties or {}) do
        Properties[propertyId] = Property:new(property.identifier, property.entry_zone, property.garage_zone)

        for apartmentId, apartment in pairs(property.apartments) do
            Properties[propertyId]:AddApartment(apartmentId,
                                                Apartment:new(apartment.label, apartment.owner, apartment.price, apartment.inside_coord, apartment.exit_zone,
                                                              apartment.fridge_zone, apartment.stash_zone, apartment.closet_zone, apartment.money_zone))

            SetupExitInteraction(propertyId, apartmentId, Properties[propertyId]:GetApartment(apartmentId))
        end

        Housing.Functions.SetupBlips(Properties[propertyId])
        SetupEntryInteraction(propertyId, Properties[propertyId])
    end
end)
