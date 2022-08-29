--- @class ClothingShop
ClothingShop = {}
local cam = nil

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

    for categoryID, content in pairs(self:getShopProducts()[PlayerData.skin.Model.Hash]) do
        local partMenu = MenuV:InheritMenu(shopMenu, {subtitle = content.Name})

        partMenu:On("open", function()
            partMenu:ClearItems()

            for collectionID, collection in pairs(content.Collections) do
                local collectionMenu = MenuV:InheritMenu(partMenu, {subtitle = collection.Name})

                collectionMenu:On("switch", function(_, item)
                    local ped = PlayerPedId()
                    for id, component in pairs(item.Value.ApplyComponents) do
                        SetPedComponentVariation(ped, id, component.Drawable, component.Texture or 0, component.Palette or 0);
                    end

                    local torsoDrawable, torsoTexture = GetProperTorso(ped, GetPedDrawableVariation(ped, 11), GetPedTextureVariation(ped, 11))
                    if torsoDrawable ~= -1 and torsoTexture ~= -1 then
                        SetPedComponentVariation(ped, 3, torsoDrawable, torsoTexture, 0)
                    end
                end)

                collectionMenu:On("open", function()
                    collectionMenu:ClearItems()

                    for itemID, item in pairs(collection.Items) do
                        collectionMenu:AddButton({
                            label = item.Name,
                            description = "Changer de tenue pour $" .. collection.Price,
                            value = item,
                            select = function()
                                local ped = PlayerPedId()
                                local torsoDrawable, torsoTexture = GetPedDrawableVariation(ped, 3), GetPedTextureVariation(ped, 3)

                                TriggerServerEvent("shops:server:pay", self.brand, {
                                    category = categoryID,
                                    collection = collectionID,
                                    item = itemID,
                                    torso = {drawable = torsoDrawable, texture = torsoTexture},
                                }, 1)
                            end,
                        })
                    end
                end)

                partMenu:AddButton({label = collection.Name, value = collectionMenu})
            end
        end)

        partMenu:On("close", function()
            TriggerEvent("soz-character:Client:ApplyCurrentClothConfig")
            TriggerEvent("soz-character:Client:ApplyCurrentSkin")

            partMenu:ClearItems()
        end)

        shopMenu:AddButton({label = content.Name, value = partMenu})
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
