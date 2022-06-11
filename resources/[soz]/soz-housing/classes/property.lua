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
        if apartment:OwnerIs(citizenid) then
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
        if apartment:OwnerIs(citizenid) then
            apartments[apartmentId] = apartment
        end
    end
    return apartments
end

function Property:IsBuilding()
    return table.length(self.apartments) > 1
end

function Property:HasGarage()
    return self.garage_zone ~= nil
end

function Property:GetEntryZone()
    return self.entry_zone
end

function Property:GetGarageZone()
    return self.garage_zone
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
