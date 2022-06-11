local QBCore = exports["qb-core"]:GetCoreObject()

--- @type Property[]
Properties = {}

local function IsPropertyValid(house)
    if house.identifier == nil then
        exports["soz-monitor"]:Log("ERROR", ("Entry #%s skipped because it has no identifier"):format(house.id))
        return false
    end
    if house.entry_zone == nil then
        exports["soz-monitor"]:Log("ERROR", ("Entry %s skipped because it has no entry_zone"):format(house.identifier))
        return false
    end
    return true
end

local function IsApartmentValid(house)
    if house.price == nil then
        exports["soz-monitor"]:Log("ERROR", ("Entry %s skipped because it has no price"):format(house.label))
        return false
    end
    if house.property_id == nil then
        exports["soz-monitor"]:Log("ERROR", ("Entry %s skipped because it has no property_id"):format(house.label))
        return false
    end
    if house.inside_coord == nil then
        exports["soz-monitor"]:Log("ERROR", ("Entry %s skipped because it has no inside_coord"):format(house.label))
        return false
    end
    if house.exit_zone == nil then
        exports["soz-monitor"]:Log("ERROR", ("Entry %s skipped because it has no exit_zone"):format(house.label))
        return false
    end
    return true
end

MySQL.ready(function()
    local properties = MySQL.query.await("SELECT * FROM housing_property")
    for _, property in pairs(properties or {}) do
        if not IsPropertyValid(property) then
            goto continue
        end

        Properties[property.id] = Property:new(property.identifier, property.entry_zone, property.garage_zone)

        ::continue::
    end

    local apartments = MySQL.query.await("SELECT * FROM housing_apartment")
    for _, apartment in pairs(apartments or {}) do
        if not IsApartmentValid(apartment) then
            goto continue
        end

        Properties[apartment.property_id]:AddApartment(apartment.id,
                                                       Apartment:new(apartment.identifier, apartment.label, apartment.owner, apartment.price,
                                                                     apartment.inside_coord, apartment.exit_zone, apartment.fridge_zone, apartment.stash_zone,
                                                                     apartment.closet_zone, apartment.money_zone))

        ::continue::
    end
end)

--- Functions
QBCore.Functions.CreateCallback("housing:server:GetAllProperties", function(source, cb)
    cb(Properties)
end)

QBCore.Functions.CreateCallback("housing:server:GetPlayerProperties", function(source, cb)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end

    local properties = {}
    for propertyId, property in pairs(Properties) do
        if property:HasRentedApartmentForCitizenId(Player.PlayerData.citizenid) then
            properties[propertyId] = property
        end
    end

    cb(properties)
end)

RegisterNetEvent("housing:server:SetPlayerInApartment", function(propertyId, apartmentId, target)
    local Player = QBCore.Functions.GetPlayerByCitizenId(target)
    if not Player then
        return
    end

    local inside = Player.PlayerData.metadata["inside"]

    local apartment = Properties[propertyId]:GetApartment(apartmentId)
    if apartment == nil then
        exports["soz-monitor"]:Log("ERROR", ("EnterProperty %s - Apartment %s | skipped because it has no apartment"):format(propertyId, apartmentId))
        return
    end

    TriggerClientEvent("housing:client:Teleport", Player.PlayerData.source, apartment:GetInsideCoord())

    inside.apartment = apartmentId
    inside.exitCoord = GetEntityCoords(GetPlayerPed(Player.PlayerData.source))
    Player.Functions.SetMetaData("inside", inside)
end)

RegisterNetEvent("housing:server:EnterProperty", function(propertyId, apartmentId)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end

    local apartment = Properties[propertyId]:GetApartment(apartmentId)
    if apartment == nil then
        exports["soz-monitor"]:Log("ERROR", ("EnterProperty %s - Apartment %s | skipped because it has no apartment"):format(propertyId, apartmentId))
        return
    end

    if not apartment:OwnerIs(Player.PlayerData.citizenid) then
        exports["soz-monitor"]:Log("ERROR", ("EnterProperty %s - Apartment %s | skipped because it is not owner"):format(propertyId, apartmentId))
        return
    end

    TriggerEvent("housing:server:SetPlayerInApartment", propertyId, apartmentId, Player.PlayerData.citizenid)
end)

RegisterNetEvent("housing:server:ExitProperty", function(propertyId, apartmentId)
    local Player = QBCore.Functions.GetPlayer(source)
    local inside = Player.PlayerData.metadata["inside"]

    local apartment = Properties[propertyId]:GetApartment(apartmentId)
    if apartment == nil then
        exports["soz-monitor"]:Log("ERROR", ("EnterProperty %s - Apartment %s | skipped because it has no apartment"):format(propertyId, apartmentId))
        return
    end

    TriggerClientEvent("housing:client:Teleport", Player.PlayerData.source, inside.exitCoord)

    inside.apartment = false
    inside.exitCoord = false
    Player.Functions.SetMetaData("inside", inside)
end)

RegisterNetEvent("housing:server:InspectProperty", function(propertyId, apartmentId)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        return
    end

    local apartment = Properties[propertyId]:GetApartment(apartmentId)
    if apartment == nil then
        exports["soz-monitor"]:Log("ERROR", ("EnterProperty %s - Apartment %s | skipped because it has no apartment"):format(propertyId, apartmentId))
        return
    end

    if not apartment:IsAvailable() then
        exports["soz-monitor"]:Log("ERROR", ("EnterProperty %s - Apartment %s | skipped because it is not available"):format(propertyId, apartmentId))
        return
    end

    TriggerEvent("housing:server:SetPlayerInApartment", propertyId, apartmentId, Player.PlayerData.citizenid)
end)

RegisterNetEvent("housing:server:BellProperty", function(propertyId, apartmentId)
    local Player = QBCore.Functions.GetPlayer(source)

    local apartment = Properties[propertyId]:GetApartment(apartmentId)
    if apartment == nil then
        exports["soz-monitor"]:Log("ERROR", ("EnterProperty %s - Apartment %s | skipped because it has no apartment"):format(propertyId, apartmentId))
        return
    end

    if apartment:IsAvailable() then
        exports["soz-monitor"]:Log("ERROR", ("EnterProperty %s - Apartment %s | skipped because it is available"):format(propertyId, apartmentId))
        return
    end

    local Owner = QBCore.Functions.GetPlayerByCitizenId(apartment:GetOwner())

    TriggerClientEvent("housing:client:PlayerRequestEnter", Owner.PlayerData.source, propertyId, apartmentId, Player.PlayerData.citizenid)
end)

RegisterNetEvent("housing:server:BuyProperty", function(propertyId, apartmentId)
    local Player = QBCore.Functions.GetPlayer(source)

    local apartment = Properties[propertyId]:GetApartment(apartmentId)
    if apartment == nil then
        exports["soz-monitor"]:Log("ERROR", ("EnterProperty %s - Apartment %s | skipped because it has no apartment"):format(propertyId, apartmentId))
        return
    end

    if not apartment:IsAvailable() then
        exports["soz-monitor"]:Log("ERROR", ("EnterProperty %s - Apartment %s | skipped because it is not available"):format(propertyId, apartmentId))
        return
    end

    if Player.Functions.RemoveMoney("money", apartment:GetPrice()) then
        MySQL.update.await("UPDATE housing_apartment SET owner = ? WHERE id = ?", {
            Player.PlayerData.citizenid,
            apartmentId,
        })
        apartment:SetOwner(Player.PlayerData.citizenid)

        TriggerEvent("monitor:server:event", "house_buy", {player_source = Player.PlayerData.source},
                     {house_id = apartment:GetIdentifier(), amount = apartment:GetPrice()})

        TriggerClientEvent("housing:client:UpdateApartment", -1, propertyId, apartmentId, apartment)
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous venez ~g~d'acquérir~s~ une maison pour ~b~$" .. apartment:GetPrice())
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas assez d'argent", "error")
    end
end)

RegisterNetEvent("housing:server:SellProperty", function(propertyId, apartmentId)
    local Player = QBCore.Functions.GetPlayer(source)

    local apartment = Properties[propertyId]:GetApartment(apartmentId)
    if apartment == nil then
        exports["soz-monitor"]:Log("ERROR", ("EnterProperty %s - Apartment %s | skipped because it has no apartment"):format(propertyId, apartmentId))
        return
    end

    if apartment:IsAvailable() then
        exports["soz-monitor"]:Log("ERROR", ("EnterProperty %s - Apartment %s | skipped because it is available"):format(propertyId, apartmentId))
        return
    end

    if Player.Functions.AddMoney("money", apartment:GetResellPrice()) then
        MySQL.update.await("UPDATE housing_apartment SET owner = NULL WHERE id = ?", {apartmentId})
        apartment:SetOwner(nil)

        TriggerEvent("monitor:server:event", "house_sell", {player_source = Player.PlayerData.source},
                     {house_id = apartment:GetIdentifier(), amount = apartment:GetResellPrice()})

        TriggerClientEvent("housing:client:UpdateApartment", -1, propertyId, apartmentId, apartment)
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source,
                           "Vous venez de ~r~céder~s~ votre maison pour ~b~$" .. apartment:GetResellPrice())
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas assez d'argent", "error")
    end
end)
