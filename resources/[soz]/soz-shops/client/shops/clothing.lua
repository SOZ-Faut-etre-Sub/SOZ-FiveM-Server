--- @class ClothingShop
ClothingShop = {}
local cam = nil

local function tablelength(T)
    local count = 0
    for _ in pairs(T) do
        count = count + 1
    end
    return count
end

local function displayLabel(text)
    if string.match(text, "#") ~= nil then
        return GetLabelText(text:gsub("#", ""))
    end
    return text
end

function ClothingShop:new(...)
    local shop = setmetatable(ShopShell:new(...), {__index = ClothingShop})
    setmetatable(ClothingShop, {__index = ShopShell})
    return shop
end

function ClothingShop:getShopProducts()
    return Config.Products[self.brand]
end

--- Camera
function ClothingShop:setupCam()
    if not DoesCamExist(cam) then
        local ped = PlayerPedId()
        local pedX, pedY, pedZ, pedW = table.unpack(Config.ClothingLocationsInShop[currentShop])

        SetPedCoordsKeepVehicle(ped, pedX, pedY, pedZ - 1.0)
        SetEntityHeading(ped, pedW)
        FreezeEntityPosition(ped, true)

        cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", true)

        local x, y, z, _ = table.unpack(Config.ClothingCameraPositionsInShop[currentShop])
        SetCamCoord(cam, x, y, z)
        PointCamAtCoord(cam, pedX, pedY, pedZ)
        SetCamActive(cam, true)
        RenderScriptCams(true, false, 0, true, true)

        self:playIdleAnimation()
    end
end

function ClothingShop:deleteCam()
    if DoesCamExist(cam) then
        RenderScriptCams(false, false, 0, 1, 0)
        DestroyCam(cam, false)
    end

    FreezeEntityPosition(PlayerPedId(), false)
    self:clearAllAnimations()
end

--- Idle animation
function ClothingShop:playIdleAnimation()
    local animDict = "anim@heists@heist_corona@team_idles@male_c"

    while not HasAnimDictLoaded(animDict) do
        RequestAnimDict(animDict)
        Wait(100)
    end

    local playerPed = PlayerPedId()
    ClearPedTasksImmediately(playerPed)
    TaskPlayAnim(playerPed, animDict, "idle", 1.0, 1.0, -1, 1, 1, 0, 0, 0)
end

function ClothingShop:clearAllAnimations()
    ClearPedTasksImmediately(PlayerPedId())

    if HasAnimDictLoaded("anim@heists@heist_corona@team_idles@male_c") then
        RemoveAnimDict("anim@heists@heist_corona@team_idles@male_c")
    end
end

function ClothingShop:GenerateMenu(skipIntro)
    if self.brand == "ponsonbys" then
        shopMenu.Texture = "menu_shop_clothe_luxe"
    else
        shopMenu.Texture = "menu_shop_clothe_normal"
    end
    shopMenu:ClearItems()
    shopMenu:SetSubtitle(self.label)

    if skipIntro ~= true and Config.ClothingLocationsInShop[currentShop] then
        local x, y, z, w = table.unpack(Config.ClothingLocationsInShop[currentShop])
        TaskGoStraightToCoord(PlayerPedId(), x, y, z, 1.0, 4000, w, 0.0)
        Wait(4000)
    end

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

    local products = QBCore.Functions.TriggerRpc("shops:server:GetShopContent", self.brand)

    local createProduct = function(menu, productId, product, categoryID, collectionID)
        if product.label == nil or product.price == nil then
            return
        end

        local description = "Ce produit n'est plus en stock"
        if product.stock > 0 then
            description = "Il ne reste que " .. product.stock .. " exemplaire(s) de ce produit"
        end

        menu:AddButton({
            label = (product.stock > 0 and "" or "^9") .. displayLabel(product.label),
            rightLabel = "$" .. product.price,
            description = description,
            value = product.data,
            select = function()
                if product.stock <= 0 then
                    return
                end

                TriggerServerEvent("shops:server:pay", self.brand, {
                    category = categoryID,
                    collection = collectionID,
                    item = productId,
                }, 1)
            end,
        })
    end

    for categoryID, content in pairs(products) do
        local partMenu = MenuV:InheritMenu(shopMenu, {subtitle = content.name})

        partMenu:On("open", function()
            partMenu:ClearItems()

            for collectionID, collection in pairs(content.items) do
                if tablelength(collection.items or {}) > 0 then
                    local collectionMenu = MenuV:InheritMenu(partMenu, {subtitle = collection.name})

                    collectionMenu:On("switch", function(_, item)
                        local ped = PlayerPedId()
                        for id, component in pairs(item.Value.components) do
                            SetPedComponentVariation(ped, tonumber(id), component.Drawable, component.Texture or 0, component.Palette or 0);
                            if tonumber(id) == 11 then
                                local properTorso = Config.Torsos[GetEntityModel(ped)][component.Drawable]
                                if properTorso ~= null then
                                    SetPedComponentVariation(ped, 3, properTorso, 0, 0)
                                end
                            end
                        end
                    end)

                    for clotheId, clothe in pairs(collection.items) do
                        createProduct(collectionMenu, clotheId, clothe, categoryID, collectionID)
                    end

                    partMenu:AddButton({label = collection.name, value = collectionMenu})
                end

                createProduct(partMenu, collectionID, collection, categoryID, collectionID)
            end
        end)

        partMenu:On("close", function()
            TriggerEvent("soz-character:Client:ApplyCurrentClothConfig")
            TriggerEvent("soz-character:Client:ApplyCurrentSkin")

            partMenu:ClearItems()
        end)

        shopMenu:AddButton({label = content.name, value = partMenu})
    end

    shopMenu:On("close", function()
        TriggerEvent("soz-character:Client:ApplyCurrentClothConfig")
        TriggerEvent("soz-character:Client:ApplyCurrentSkin")
        self:clearAllAnimations()
        self:deleteCam()
    end)

    shopMenu:Open()
end

--- Exports shop
ShopContext["ponsonbys"] = ClothingShop:new("PONSONBYS", "ponsonbys", {sprite = 73, color = 26}, "s_f_m_shop_high")
ShopContext["suburban"] = ClothingShop:new("SubUrban", "suburban", {sprite = 73, color = 29}, "s_f_y_shop_mid")
ShopContext["binco"] = ClothingShop:new("Binco", "binco", {sprite = 73, color = 33}, "s_f_y_shop_low")
