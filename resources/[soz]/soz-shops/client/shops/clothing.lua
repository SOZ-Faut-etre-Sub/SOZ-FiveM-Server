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
        TaskGoStraightToCoord(PlayerPedId(), Config.ClothingLocationsInShop[currentShop].x, Config.ClothingLocationsInShop[currentShop].y,
                              Config.ClothingLocationsInShop[currentShop].z, 1.0, 1000, Config.ClothingLocationsInShop[currentShop].w, 0.0)
        Wait(4000)
    end

    local PlayerData = QBCore.Functions.GetPlayerData()

    self:deleteCam()
    self:setupCam()

    for categoryID, content in pairs(self:getShopProducts()[PlayerData.skin.Model.Hash]) do
        local partMenu = MenuV:InheritMenu(shopMenu, {subtitle = content.Name})

        partMenu:On("open", function()
            for collectionID, collection in pairs(content.Collections) do
                local itemOptions = {}

                for itemIndex, item in pairs(collection.Items) do
                    itemOptions[#itemOptions + 1] = {value = itemIndex, label = item.Name, item = item}
                end

                partMenu:AddSlider({
                    label = collection.Name,
                    description = "Changer de tenue pour $" .. collection.Price,
                    value = 0,
                    values = itemOptions,
                    change = function(_, value)
                        for id, component in pairs(itemOptions[value].item.Components) do
                            SetPedComponentVariation(PlayerPedId(), id, component.Drawable, component.Texture or 0, component.Palette or 0);
                        end
                    end,
                    select = function(_, value)
                        TriggerServerEvent("shops:server:pay", self.brand, {
                            category = categoryID,
                            collection = collectionID,
                            item = value,
                        }, 1)
                    end,
                })
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
