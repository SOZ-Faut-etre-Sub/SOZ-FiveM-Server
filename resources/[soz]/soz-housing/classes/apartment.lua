--- @class Apartment
Apartment = {}

function Apartment:new(label, owner, price, inside_coord, exit_zone, fridge_zone, stash_zone, closet_zone, money_zone)
    self.__index = self

    return setmetatable({
        label = label,
        owner = owner,
        price = price,
        inside_coord = decode_json(inside_coord),
        exit_zone = decode_json(exit_zone),
        fridge_zone = decode_json(fridge_zone),
        stash_zone = decode_json(stash_zone),
        closet_zone = decode_json(closet_zone),
        money_zone = decode_json(money_zone),
    }, self)
end

--- Core Functions
function Apartment:SetOwner(owner)
    self.owner = owner
end

--- Functions
function Apartment:IsAvailable()
    return self.owner == nil
end

function Apartment:IsOwner(citizenid)
    return self.owner == citizenid
end

function Apartment:GetIdentifier()
    return self.label
end

function Apartment:GetPrice()
    return self.price
end

function Apartment:GetResellPrice()
    return self.price / 2
end

function Apartment:GetInsideCoord()
    return self.inside_coord
end

function Apartment:GetExitCoord()
    return self.exit_zone
end
