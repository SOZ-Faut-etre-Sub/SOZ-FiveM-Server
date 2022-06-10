--- @class Property
Property = {}

function Property:new(identifier, entry_zone, garage_zone)
    self.__index = self

    if not identifier then
        error("Property:new() - identifier is required")
    end
    if not entry_zone then
        error("Property:new() - entry_zone is required")
    end

    return setmetatable({
        identifier = identifier,
        entry_zone = decode_json(entry_zone),
        garage_zone = decode_json(garage_zone),

        --- @type Apartment[]
        apartments = {},
    }, self)
end

--- Apartments
function Property:GetApartments()
    return self.apartments
end

--- @return Apartment
function Property:GetApartment(id)
    return self.apartments[tostring(id)]
end

function Property:AddApartment(id, apartment)
    self.apartments[tostring(id)] = apartment
end

function Property:UpdateApartment(id, apartment)
    self.apartments[tostring(id)] = apartment
end

--- Getters
function Property:IsBuilding()
    return table.length(self.apartments) > 1
end

function Property:HasGarage()
    return self.garage_zone ~= nil
end

function Property:HasAvailableApartment()
    for _, apartment in pairs(self.apartments) do
        if apartment:IsAvailable() then
            return true
        end
    end
    return false
end

function Property:HasRentedApartment(citizenid)
    for _, apartment in pairs(self.apartments) do
        if apartment:IsOwner(citizenid) then
            return true
        end
    end
    return false
end

function Property:GetRentedApartments(citizenid)
    local apartments = {}
    for apartmentId, apartment in pairs(self.apartments) do
        if apartment:IsOwner(citizenid) then
            apartments[apartmentId] = apartment
        end
    end
    return apartments
end

function Property:GetEntryZone()
    return self.entry_zone
end
