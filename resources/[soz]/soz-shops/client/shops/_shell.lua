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
        canInteract = function(entity)
            return currentShop ~= nil and currentShopBrand == self.brand and not IsEntityPlayingAnim(entity, "random@robbery", "robbery_main_female", 3)
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
function ShopShell:ZkeaStock()
    return {
        event = "",
        icon = "fas fa-store",
        label = "Vérifier le stock",
        canInteract = function()
            return self.brand == "zkea" and currentShop ~= nil and currentShopBrand == self.brand
        end,
        blackoutGlobal = true,
        action = function()
            TriggerServerEvent("shops:server:CheckZkeaStock")
        end,
    }
end
function ShopShell:ZkeaUpgrade()
    return {
        event = "soz-core:client:housing:open-upgrades-menu",
        icon = "fas fa-store",
        label = "Améliorations",
        canInteract = function()
            local playerData = QBCore.Functions.GetPlayerData()

            if not playerData.apartment or not playerData.apartment.owner then
                return false
            end

            if playerData.apartment.owner ~= playerData.citizenid then
                return false
            end

            return self.brand == "zkea" and currentShop ~= nil and currentShopBrand == self.brand
        end,
        blackoutGlobal = true,
    }
end

function ShopShell:GetRemoveClothAction()
    return {
        event = "soz-core:client:crimi:remove-cloth",
        label = "Enlever la tenue temporaire",
        color = "crimi",
        canInteract = function()
            if self.brand ~= "ponsonbys" and self.brand ~= "suburban" and self.brand ~= "binco" then
                return false
            end

            local playerData = QBCore.Functions.GetPlayerData()

            if playerData.cloth_config.TemporaryClothSet == nil then
                return false
            end

            return true
        end,
        blackoutGlobal = true,
    }
end

function ShopShell:AddTargetModel()
    exports["qb-target"]:AddTargetModel(self.ped, {
        options = {
            self:GetPedAction(),
            self:GetRemoveClothAction(),
            self:GunSmith(),
            self:ZkeaStock(),
            self:ZkeaUpgrade(),
            {
                icon = "c:stonk/collecter.png",
                label = "Collecter",
                canInteract = function()
                    return exports["soz-core"]:CanBagsBeCollected(currentShopBrand, currentShop)
                end,
                blackoutGlobal = true,
                blackoutJob = true,
                action = function()
                    TriggerServerEvent("soz-core:server:job:stonk:collect", currentShopBrand, currentShop)
                end,
            },
        },
        distance = 2.5,
    })
end

function ShopShell:RemoveTargetModel()
    exports["qb-target"]:RemoveTargetModel(self.ped)
end

function ShopShell:SpawnPed(location)
    local ret = exports["qb-target"]:SpawnPed({
        model = self.ped,
        coords = location,
        minusOne = true,
        freeze = true,
        invincible = true,
        blockevents = true,
        spawnNow = true,
        scenario = "WORLD_HUMAN_STAND_IMPATIENT",
    })

    return ret.currentpednumber
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
