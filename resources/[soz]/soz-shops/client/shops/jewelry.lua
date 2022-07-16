--- @class JewelryShop
JewelryShop = {}

function JewelryShop:new(...)
    local shop = setmetatable(ShopShell:new(...), {__index = JewelryShop})
    setmetatable(JewelryShop, {__index = ShopShell})
    return shop
end

function JewelryShop:getShopProducts()
    return Config.Products["jewelry"]
end

--- Camera
function JewelryShop:setupCam()
    if not DoesCamExist(cam) then
        local ped = PlayerPedId()
        SetEntityHeading(ped, 199.156)
        FreezeEntityPosition(ped, true)
        local x, y, z = table.unpack(GetEntityCoords(ped))
        cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", true)

        SetCamCoord(cam, GetEntityCoords(ped))
        SetCamRot(cam, 0.0, 0.0, 0.0)
        SetCamActive(cam, true)
        RenderScriptCams(true, false, 0, true, true)
        SetCamCoord(cam, x, y - 0.5, z + 0.7)

        self:playIdleAnimation()
    end
end

function JewelryShop:deleteCam()
    if DoesCamExist(cam) then
        RenderScriptCams(false, false, 0, 1, 0)
        DestroyCam(cam, false)
    end

    FreezeEntityPosition(PlayerPedId(), false)
    self:clearAllAnimations()
end

--- Idle animation
function JewelryShop:playIdleAnimation()
    local animDict = "anim@heists@heist_corona@team_idles@male_c"

    while not HasAnimDictLoaded(animDict) do
        RequestAnimDict(animDict)
        Wait(100)
    end

    local playerPed = PlayerPedId()
    ClearPedTasksImmediately(playerPed)
    TaskPlayAnim(playerPed, animDict, "idle", 1.0, 1.0, -1, 1, 1, 0, 0, 0)
end

function JewelryShop:clearAllAnimations()
    ClearPedTasksImmediately(PlayerPedId())

    if HasAnimDictLoaded("anim@heists@heist_corona@team_idles@male_c") then
        RemoveAnimDict("anim@heists@heist_corona@team_idles@male_c")
    end
end

function JewelryShop:GenerateMenu()
    shopMenu.Texture = "menu_shop_jewelry"
    shopMenu:ClearItems()
    shopMenu:SetSubtitle(self.label)

    local PlayerData = QBCore.Functions.GetPlayerData()

    self:deleteCam()
    self:setupCam()

    shopMenu:AddCheckbox({
        label = "Libérer la caméra",
        value = cam,
        change = function(_, value)
            if value then
                self:deleteCam()
                FreezeEntityPosition(PlayerPedId(), true)
            else
                self:setupCam()
            end
        end,
    })

    for _, content in pairs(self:getShopProducts()[PlayerData.skin.Model.Hash]) do
        shopMenu:AddButton({label = content.label, value = content.menu})

        if content.menu == nil then
            TriggerEvent("hud:client:DrawNotification", string.format("Le vendeur est occupé, veuillez réessayer dans quelques instants."))
            self:deleteCam()
            FreezeEntityPosition(PlayerPedId(), false)
            return
        end
    end

    shopMenu:On("close", function()
        TriggerEvent("soz-character:Client:ApplyCurrentClothConfig")
        self:clearAllAnimations()
        self:deleteCam()
    end)

    shopMenu:Open()
end

function JewelryShop:GenerateSubMenu(parentMenu, model, categoryPropIndex, index, subCategoryName, subCategory, items)
    local subMenu = MenuV:CreateMenu(nil, subCategoryName, "menu_shop_jewelry", "soz", "jewelry:cat:" .. model .. ":" .. index .. ":" .. subCategoryName)

    table.sort(items)
    for component, drawables in pairs(items) do
        table.sort(drawables)
        for drawable, labels in pairs(drawables) do
            local label = GetLabelText(labels.GXT)
            if label == "NULL" then
                label = labels.Localized
            end
            if label == "NULL" then
                print("Check value for " .. categoryPropIndex .. " " .. component .. " " .. drawable)
            end
            subMenu:AddButton({
                label = label,
                rightLabel = "$" .. subCategory.price,
                value = {categoryPropIndex, component, drawable},
                select = function()
                    TriggerServerEvent("shops:server:pay", "jewelry", {
                        overlay = subCategory.overlay,
                        categoryIndex = index,
                        category = categoryPropIndex,
                        component = component,
                        drawable = drawable,
                    }, 1)
                end,
            })
        end
    end

    subMenu:On("switch", function(_, item)
        SetPedPropIndex(PlayerPedId(), tonumber(item.Value[1]), tonumber(item.Value[2]), tonumber(item.Value[3]), 2)
    end)

    parentMenu:AddButton({label = subCategoryName, value = subMenu})
end

--- Init
CreateThread(function()
    for pedModel, categories in pairs(JewelryShop:getShopProducts()) do
        for index, category in pairs(categories) do
            local categoryEntry = JewelryShop:getShopProducts()[pedModel][index]

            if MenuV:IsNamespaceAvailable("jewelry:cat:" .. pedModel .. ":" .. index) then
                categoryEntry.menu = MenuV:CreateMenu(nil, category.label, "menu_shop_jewelry", "soz", "jewelry:cat:" .. pedModel .. ":" .. index)

                table.sort(category.items)
                for itemKey, drawables in pairs(category.items) do
                    if tonumber(itemKey) == nil then
                        JewelryShop:GenerateSubMenu(categoryEntry.menu, pedModel, category.propId, index, itemKey, categoryEntry, drawables)
                    else
                        print("Warning: ItemKey isn't in a category " .. itemKey)
                        local component = itemKey
                        table.sort(drawables)
                        for drawable, labels in pairs(drawables) do
                            local label = GetLabelText(labels.GXT)
                            if label == "NULL" then
                                label = labels.Localized
                            end
                            if label == "NULL" then
                                print("Check value for " .. category.propId .. " " .. component .. " " .. drawable)
                            end
                            categoryEntry.menu:AddButton({
                                label = label,
                                rightLabel = "$" .. category.price,
                                value = {category.propId, component, drawable},
                                select = function()
                                    TriggerServerEvent("shops:server:pay", "jewelry", {
                                        overlay = category.overlay,
                                        categoryIndex = index,
                                        category = category.propId,
                                        component = component,
                                        drawable = drawable,
                                    }, 1)
                                end,
                            })
                        end
                    end
                end
            end
        end
    end
end)

--- Exports shop
ShopContext["jewelry"] = JewelryShop:new("Bijoutier", "jewelry", {sprite = 617, color = 0}, "u_m_m_jewelsec_01")
