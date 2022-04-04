--- @class ShopShell
ShopShell = {}

function ShopShell:new(label, brand, blip, ped)
    return setmetatable({label = label, brand = brand, blip = blip, ped = ped}, {__index = ShopShell})
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
    }
end

function ShopShell:SpawnPed(location, ...)
    exports["qb-target"]:SpawnPed({
        {
            model = self.ped,
            coords = location,
            minusOne = true,
            freeze = true,
            invincible = true,
            blockevents = true,
            scenario = "WORLD_HUMAN_STAND_IMPATIENT",
            target = {options = {self:GetPedAction(), ...}, distance = 2.5},
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
