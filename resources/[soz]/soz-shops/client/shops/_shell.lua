--- @class ShopShell
ShopShell = {}

function ShopShell:new(label, brand, blip, ped)
    return setmetatable({label = label, brand = brand, blip = blip, ped = ped, target = {}}, {__index = ShopShell})
end

--- Ped functions
function ShopShell:GetPedAction()
    return {
        event = "shops:client:GetShop",
        icon = "fas fa-shopping-cart",
        label = "Accéder au magasin",
        canInteract = function()
            return currentShop ~= nil and currentShopBrand == self.brand
        end,
        blackoutGlobal = true,
    }
end
function ShopShell:GunSmith()
    return {
        event = "soz-core:client:weapon:open-gunsmith",
        icon = "fas fa-store",
        label = "Accéder au GunSmith",
        canInteract = function()
            return self.brand == "ammunation" and currentShop ~= nil and currentShopBrand == self.brand
        end,
        blackoutGlobal = true,
    }
end

function ShopShell:AddTargetModel()
    exports["qb-target"]:AddTargetModel({self.ped}, {
        options = {self:GetPedAction(), self:GunSmith(), self.target},
        distance = 2.5,
    })
end

function ShopShell:RemoveTargetModel()
    exports["qb-target"]:RemoveTargetModel({self.ped})
end

function ShopShell:SpawnPed(location, target)
    if target then
        self.target = target
    end
    exports["qb-target"]:SpawnPed({
        {
            model = self.ped,
            coords = location,
            minusOne = true,
            freeze = true,
            invincible = true,
            blockevents = true,
            scenario = "WORLD_HUMAN_STAND_IMPATIENT",
        },
    })
end

--- Shop functions
function ShopShell:getShopProducts()
    error("Function getShopProducts() not implemented !")
    return {}
end

--- Menu functions
function ShopShell:GenerateMenu()
    error("Function GenerateMenu() not implemented !")
end
