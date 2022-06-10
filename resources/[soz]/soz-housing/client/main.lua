QBCore = exports["qb-core"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()
HousingMap = false
Housing = {}

--- @type Property[]
Properties = {}

--- QBCore Functions
RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
    TriggerEvent("housing:client:SyncProperties")
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data

    local oldHousingMap = HousingMap
    HousingMap = false

    for _, item in pairs(PlayerData.items or {}) do
        if item.name == "house_map" then
            HousingMap = true
        end
    end

    if oldHousingMap ~= HousingMap then
        for _, property in pairs(Properties or {}) do
            Housing.Functions.SetupBlips(property)
        end
    end
end)

--- Main Functions
RegisterNetEvent("housing:client:Teleport", function(coords)
    Housing.Functions.Teleport("Ouvre la porte", coords)
end)

RegisterNetEvent("housing:client:UpdateApartment", function(propertyId, apartmentId, data)
    local property = Properties[propertyId]
    if property then
        local newApartment = Apartment:new(data.label, data.owner, data.price, data.inside_coord, data.exit_zone, data.fridge_zone, data.stash_zone,
                                           data.closet_zone, data.money_zone)
        property:UpdateApartment(apartmentId, newApartment)

        Housing.Functions.SetupBlips(property)
        Housing.Functions.Components.SetupExitInteraction(propertyId, apartmentId, newApartment)
        Housing.Functions.Components.SetupCloakroomInteraction(propertyId, apartmentId, newApartment)
        Housing.Functions.Components.SetupFridgeInteraction(propertyId, apartmentId, newApartment)
        Housing.Functions.Components.SetupStashInteraction(propertyId, apartmentId, newApartment)
        Housing.Functions.Components.SetupMoneyInteraction(propertyId, apartmentId, newApartment)
    end
end)

RegisterNetEvent("housing:client:SyncProperties", function()
    local properties = QBCore.Functions.TriggerRpc("housing:server:GetAllProperties")
    for propertyId, property in pairs(properties or {}) do
        Properties[propertyId] = Property:new(property.identifier, property.entry_zone, property.garage_zone)

        for apartmentId, apartment in pairs(property.apartments) do
            Properties[propertyId]:AddApartment(apartmentId,
                                                Apartment:new(apartment.label, apartment.owner, apartment.price, apartment.inside_coord, apartment.exit_zone,
                                                              apartment.fridge_zone, apartment.stash_zone, apartment.closet_zone, apartment.money_zone))

            local apartmentData = Properties[propertyId]:GetApartment(apartmentId)
            Housing.Functions.Components.SetupExitInteraction(propertyId, apartmentId, apartmentData)
            Housing.Functions.Components.SetupCloakroomInteraction(propertyId, apartmentId, apartmentData)
            Housing.Functions.Components.SetupFridgeInteraction(propertyId, apartmentId, apartmentData)
            Housing.Functions.Components.SetupStashInteraction(propertyId, apartmentId, apartmentData)
            Housing.Functions.Components.SetupMoneyInteraction(propertyId, apartmentId, apartmentData)
        end

        Housing.Functions.SetupBlips(Properties[propertyId])
        Housing.Functions.Components.SetupEntryInteraction(propertyId, Properties[propertyId])
    end
end)

AddEventHandler("onResourceStart", function(resource)
    if resource == GetCurrentResourceName() then
        Citizen.Wait(3000)

        TriggerEvent("housing:client:SyncProperties")
    end
end)
