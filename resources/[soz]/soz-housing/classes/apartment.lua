--- @class Apartment
Apartment = {}

function Apartment:new(
    identifier,
    label,
    owner,
    roommate,
    price,
    inside_coord,
    exit_zone,
    fridge_zone,
    stash_zone,
    closet_zone,
    money_zone,
    tier,
    has_parking_place,
    temporary_access
)
    self.__index = self

    return setmetatable({
        identifier = identifier,
        label = label,
        owner = owner,
        roommate = roommate,
        price = price,
        inside_coord = decode_json(inside_coord),
        tier = tier or 0,
        has_parking_place = has_parking_place,
        --- Zones
        exit_zone = decode_json(exit_zone),
        fridge_zone = decode_json(fridge_zone),
        stash_zone = decode_json(stash_zone),
        closet_zone = decode_json(closet_zone),
        money_zone = decode_json(money_zone),
        --- Keys
        temporary_access = temporary_access or {},
    }, self)
end

---
--- GETTERS
---
function Apartment:IsAvailable()
    return self.owner == nil
end

function Apartment:IsRented()
    return self.owner ~= nil
end

function Apartment:IsOwner(citizenid)
    return self.owner == citizenid
end

function Apartment:IsCitizen(citizenid)
    return self.owner == citizenid or self.roommate == citizenid
end

function Apartment:IsRoommate(citizenid)
    return self.roommate == citizenid
end

function Apartment:HasAccess(citizenid)
    return self.owner == citizenid or self.roommate == citizenid or self.temporary_access[citizenid] == true
end

function Apartment:HasRoommate()
    return self.roommate ~= nil
end

function Apartment:GetIdentifier()
    return self.identifier
end

function Apartment:GetLabel()
    return self.label
end

function Apartment:GetOwner()
    return self.owner
end

function Apartment:GetRoomMate()
    return self.roommate
end

function Apartment:GetPrice()
    return self.price
end

function Apartment:GetResellPrice()
    local resellPrice = self.price / 2
    for i = 0, self.tier, 1 do
        local tierPrice = self.price * Config.UpgradesPercent[i] / 100
        resellPrice = resellPrice + tierPrice / 2
    end
    return resellPrice
end

function Apartment:GetZone(zone)
    return self[zone]
end

function Apartment:GetInsideCoord()
    return self.inside_coord
end

function Apartment:GetExitCoord()
    return self.exit_zone
end

function Apartment:GetFridgeCoord()
    return self.fridge_zone
end

function Apartment:GetStashCoord()
    return self.stash_zone
end

function Apartment:GetClosetCoord()
    return self.closet_zone
end

function Apartment:GetMoneyCoord()
    return self.money_zone
end

function Apartment:GetTier()
    return self.tier
end

function Apartment:HasParkingPlace()
    return self.has_parking_place
end

---
--- SETTERS
---
function Apartment:SetIdentifier(identifier)
    self.identifier = identifier
end

function Apartment:SetLabel(label)
    self.label = label
end

function Apartment:SetPrice(price)
    self.price = price
end

function Apartment:SetOwner(owner)
    self.owner = owner
end

function Apartment:SetRoommate(roommate)
    self.roommate = roommate
end

function Apartment:AddTemporaryAccess(citizenid)
    self.temporary_access[citizenid] = true
end

function Apartment:SetInsideCoord(inside_coord)
    self.inside_coord = decode_json(inside_coord)
end

function Apartment:SetZone(name, config)
    if name ~= "exit_zone" and name ~= "fridge_zone" and name ~= "stash_zone" and name ~= "closet_zone" and name ~= "money_zone" then
        return
    end

    self[name] = decode_json(config)
end

function Apartment:SetTier(tier)
    self.tier = tier
end

function Apartment:SetParkingPlace(value)
    self.has_parking_place = value
end
