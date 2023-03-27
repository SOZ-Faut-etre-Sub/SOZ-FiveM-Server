--- @class Property
Property = {}

function Property:new(identifier, entry_zone, garage_zone, exterior_culling)
    self.__index = self

    return setmetatable({
        identifier = identifier,
        entry_zone = decode_json(entry_zone),
        garage_zone = decode_json(garage_zone),
        exterior_culling = decode_json(exterior_culling),

        --- @type Apartment[]
        apartments = {},
    }, self)
end

---
--- GETTERS
---
function Property:GetApartments()
    return self.apartments
end

--- @return Apartment
function Property:GetApartment(id)
    return self.apartments[tostring(id)]
end

function Property:HasAvailableApartment()
    for _, apartment in pairs(self.apartments) do
        if apartment:IsAvailable() then
            return true
        end
    end
    return false
end

function Property:HasRentedApartment()
    for _, apartment in pairs(self.apartments) do
        if apartment:IsRented() then
            return true
        end
    end
    return false
end

function Property:HasRentedApartmentForCitizenId(citizenid)
    for _, apartment in pairs(self.apartments) do
        if apartment:HasAccess(citizenid) then
            return true
        end
    end
    return false
end

function Property:HasRentedApartmentsBesidesForCitizenId(citizenid)
    for _, apartment in pairs(self.apartments) do
        if not apartment:HasAccess(citizenid) then
            return true
        end
    end
    return false
end

function Property:HasApartmentAsRoommate(citizenId)
    for _, apartment in pairs(self.apartments) do
        if apartment:IsRoommate(citizenId) then
            return true
        end
    end
    return false
end

function Property:HasOwnedApartmentForCitizenId(citizenid)
    for _, apartment in pairs(self.apartments) do
        if apartment:IsOwner(citizenid) then
            return true
        end
    end
    return false
end

function Property:GetAvailableApartments()
    local apartments = {}
    for apartmentId, apartment in pairs(self.apartments) do
        if apartment:IsAvailable() then
            apartments[apartmentId] = apartment
        end
    end
    return apartments
end

function Property:GetRentedApartments()
    local apartments = {}
    for apartmentId, apartment in pairs(self.apartments) do
        if not apartment:IsAvailable() then
            apartments[apartmentId] = apartment
        end
    end
    return apartments
end

function Property:GetRentedApartmentsForCitizenId(citizenid)
    local apartments = {}
    for apartmentId, apartment in pairs(self.apartments) do
        if apartment:HasAccess(citizenid) then
            apartments[apartmentId] = apartment
        end
    end
    return apartments
end

function Property:GetRentedApartmentsBesidesForCitizenId(citizenid)
    local apartments = {}
    for apartmentId, apartment in pairs(self.apartments) do
        if apartment:IsRented() and not apartment:HasAccess(citizenid) then
            apartments[apartmentId] = apartment
        end
    end
    return apartments
end

function Property:GetApartmentAsRoommate(citizenId)
    for apartmentId, apartment in pairs(self.apartments) do
        if apartment:IsRoommate(citizenId) then
            return apartmentId, apartment
        end
    end
    return nil, nil
end

function Property:GetOwnedApartmentsForCitizenId(citizenid)
    local apartments = {}
    for apartmentId, apartment in pairs(self.apartments) do
        if apartment:IsOwner(citizenid) then
            apartments[apartmentId] = apartment
        end
    end
    return apartments
end

function Property:CanAddRoommate(citizenid)
    for _, apartment in pairs(self.apartments) do
        if apartment:IsCitizen(citizenid) and not apartment:HasRoommate() then
            return true
        end
    end
    return false
end

function Property:CanRemoveRoommate(citizenid)
    for _, apartment in pairs(self.apartments) do
        if apartment:IsCitizen(citizenid) and apartment:HasRoommate() then
            return true
        end
    end
    return false
end

function Property:IsBuilding()
    return table.length(self.apartments) > 1
end

function Property:IsTrailer()
    return string.find(self.identifier, "trailer") ~= nil
end

function Property:HasGarage()
    return self.garage_zone ~= nil
end

function Property:GetIdentifier()
    return self.identifier
end

function Property:GetZone(zone)
    return self[zone]
end

function Property:GetEntryZone()
    return self.entry_zone
end

function Property:GetGarageZone()
    return self.garage_zone
end

function Property:GetExteriorCulling()
    return self.exterior_culling
end

function Property:GetGarageName()
    return "property_" .. self.identifier
end

---
--- SETTERS
---
function Property:AddApartment(id, apartment)
    self.apartments[tostring(id)] = apartment
end

function Property:UpdateApartment(id, apartment)
    self.apartments[tostring(id)] = apartment
end

function Property:SetZone(name, config)
    if name ~= "entry_zone" and name ~= "garage_zone" then
        return
    end

    self[name] = decode_json(config)
end
