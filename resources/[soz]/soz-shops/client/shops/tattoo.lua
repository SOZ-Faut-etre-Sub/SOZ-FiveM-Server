--- @class TattooShop
TattooShop = {}

function TattooShop.new()
    return setmetatable({}, {
        __index = TattooShop,
        __tostring = function()
            return "TattooShop"
        end,
    })
end

function TattooShop:FilterItems(shop)
    local items = {}
    local playerjob = QBCore.Functions.GetPlayerData().job.name

    for _, product in pairs(self:GetShopData(shop).products) do
        if not product.requiredJob then
            items[#items + 1] = product
        else
            for _, job in ipairs(product.requiredJob) do
                if playerjob == job then
                    items[#items + 1] = product
                end
            end
        end
    end

    return items
end

--- SetBanner
--- @param menu Menu
--- @param shop string
function TattooShop:SetBanner(menu, shop)
    menu.Texture = "menu_shop_tattoo"
end

--- DisplayMenu
--- @param menu Menu
--- @param shop string
function TattooShop:GenerateMenu(menu, shop)
    local gender = QBCore.Functions.GetPlayerData().charinfo.gender
    if self:GetShopData(shop) == nil then
        return
    end

    menu:ClearItems()
    menu:SetSubtitle(self:GetShopData(shop).label)
    self:SetBanner(menu, shop)

    self:PreGenerateMenu(menu, shop)


    for catID, cat in pairs(self:FilterItems(shop)) do
        if cat.products ~= nil then
            if not MenuV:IsNamespaceAvailable("tattoo:cat:" .. catID) then
                MenuV:DeleteNamespace("tattoo:cat:" .. catID)
            end
            local categoryMenu = MenuV:InheritMenu(menu, { Subtitle = cat.label }, "tattoo:cat:" .. catID)
            menu:AddButton({ label = cat.label, value = categoryMenu })

            for tattooID, tattoo in pairs(cat.products) do
                if tattoo.overlay[gender] ~= "" then
                    local entry = categoryMenu:AddButton({
                        label = GetLabelText(tattoo.gfx),
                        value = { collection = tattoo.collection, overlay = tattoo.overlay[gender] },
                        rightLabel = "$" .. QBCore.Shared.GroupDigits(tattoo.price),
                    })
                    --entry:On("select", function(val)
                    --    local amount = exports["soz-hud"]:Input("Quantité", 4, "1")
                    --
                    --    if amount and tonumber(amount) > 0 then
                    --        TriggerServerEvent("shops:server:pay", shop, val.Value, tonumber(amount))
                    --
                    --        menu:Close()
                    --        self:GenerateMenu(menu, shop)
                    --    end
                    --end)
                end
            end

            categoryMenu:On("switch", function(_, currentItem)
                self:MenuEntryAction(currentItem)
            end)
        end
    end

    menu:On("close", function()
        self:OnMenuClose(menu, shop)
    end)

    menu:Open()
end

--- PreGenerateMenu
--- @param menu Menu
--- @param shop string
function TattooShop:PreGenerateMenu(menu, shop)
    shop = self:GetShopData(shop)

    if shop.inShopCoords then
        TaskGoStraightToCoord(PlayerPedId(), shop.inShopCoords.x, shop.inShopCoords.y, shop.inShopCoords.z, 1.0, 10.0, shop.inShopCoords.w, 0.0)
        Wait(3000)
    end

    CreateThread(function()
        while menu.IsOpen do
            DisableControlAction(0, 32, true) -- W
            DisableControlAction(0, 34, true) -- A
            DisableControlAction(0, 31, true) -- S
            DisableControlAction(0, 30, true) -- D
            DisableControlAction(0, 22, true) -- Jump
            DisableControlAction(0, 44, true) -- Cover

            Wait(0)
        end
    end)
end

function TattooShop:OnMenuClose(menu, shop)
    TriggerServerEvent("cui_character:requestPlayerData")
end

function TattooShop:MenuEntryAction(item)
    local ped = PlayerPedId()
    local ClotheData = {}
    local gender = QBCore.Functions.GetPlayerData().charinfo.gender

    if gender == 0 then
        ClotheData = {
            ["tshirt_1"] = 15, ["tshirt_2"] = 0,
            ["arms_1"] = 15, ["arms_2"] = 0,
            ["torso_1"] = 91, ["torso_2"] = 0,
            ["pants_1"] = 14,  ["pants_2"] = 0,
        }
    else
        ClotheData = {
            ["tshirt_1"] = 34, ["tshirt_2"] = 0,
            ["arms_1"] = 15, ["arms_2"] = 0,
            ["torso_1"] = 101, ["torso_2"] = 1,
            ["pants_1"] = 16, ["pants_2"] = 0,
        }
    end
    TriggerEvent("skinchanger:loadClothes", nil, ClotheData)

    print(item.Value.collection, item.Value.overlay)

    ClearPedDecorations(ped)
    AddPedDecorationFromHashes(ped, GetHashKey(item.Value.collection), GetHashKey(item.Value.overlay))
end

--- Exports functions
setmetatable(TattooShop, { __index = ShopShell })
ShopContext["tattoo"] = TattooShop.new()
