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
        local newApartment = Apartment:new(data.label, data.owner, data.price, data.fridge_zone, data.stash_zone, data.closet_zone, data.money_zone)

        property:UpdateApartment(apartmentId, newApartment)
        Housing.Functions.SetupBlips(property)
    end
end)
