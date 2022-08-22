--- @class BarberShop
BarberShop = {}
local cam = nil

function BarberShop:new(...)
    local shop = setmetatable(ShopShell:new(...), {__index = BarberShop})
    setmetatable(BarberShop, {__index = ShopShell})
    return shop
end

--- Camera
function BarberShop:getShopProducts()
    return Config.Products["barber"]
end

function BarberShop:setupCam()
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

function BarberShop:deleteCam()
    if DoesCamExist(cam) then
        RenderScriptCams(false, false, 0, 1, 0)
        DestroyCam(cam, false)
    end
    FreezeEntityPosition(PlayerPedId(), false)
    self:clearAllAnimations()
end

--- Idle animation
function BarberShop:playIdleAnimation()
    local animDict = "anim@heists@heist_corona@team_idles@male_c"

    while not HasAnimDictLoaded(animDict) do
        RequestAnimDict(animDict)
        Wait(100)
    end

    local playerPed = PlayerPedId()
    ClearPedTasksImmediately(playerPed)
    TaskPlayAnim(playerPed, animDict, "idle", 1.0, 1.0, -1, 1, 1, 0, 0, 0)
end

function BarberShop:clearAllAnimations()
    ClearPedTasksImmediately(PlayerPedId())

    if HasAnimDictLoaded("anim@heists@heist_corona@team_idles@male_c") then
        RemoveAnimDict("anim@heists@heist_corona@team_idles@male_c")
    end
end

function BarberShop:GenerateMenu()
    shopMenu.Texture = "menu_shop_barber"
    shopMenu:ClearItems()
    shopMenu:SetSubtitle(self.label)

    local ped = PlayerPedId()
    local PlayerData = QBCore.Functions.GetPlayerData()

    local playerUpdater = {}

    self:deleteCam()
    self:setupCam()

    for index, content in pairs(self:getShopProducts()[PlayerData.skin.Model.Hash]) do
        shopMenu:AddTitle({label = content.label})
        playerUpdater[content.overlay] = {}
        local category = content.category

        if category == "Hair" then
            CreateSliderList(shopMenu, "Type", PlayerData.skin.Hair.HairType, content.items, function(value)
                playerUpdater.Hair.HairType = value
                SetPedComponentVariation(ped, 2, value, 0, 2)
            end)
            CreateColorSliderList(shopMenu, "Couleur", PlayerData.skin.Hair.HairColor, Config.CharacterComponentColors.Hair, function(value)
                playerUpdater.Hair.HairColor = value
                SetPedHairColor(ped, value, playerUpdater.Hair.HairSecondaryColor or PlayerData.skin.Hair.HairSecondaryColor or 0)
            end)
            CreateColorSliderList(shopMenu, "Couleur secondaire", PlayerData.skin.Hair.HairSecondaryColor, Config.CharacterComponentColors.Hair, function(value)
                playerUpdater.Hair.HairSecondaryColor = value
                SetPedHairColor(ped, playerUpdater.Hair.HairColor or PlayerData.skin.Hair.HairColor or 0, value)
            end)
        elseif category == "Beard" then
            CreateSliderList(shopMenu, "Type", PlayerData.skin.Hair.BeardType, content.items, function(value)
                playerUpdater.Hair.BeardType = value
                SetPedHeadOverlay(ped, 1, value, 1.0);
            end)
            CreateRangeOpacitySliderItem(shopMenu, "Densité", PlayerData.skin.Hair.BeardOpacity, function(value)
                playerUpdater.Hair.BeardOpacity = value
                SetPedHeadOverlay(ped, 1, playerUpdater.Hair.BeardType, value);
            end)
            CreateColorSliderList(shopMenu, "Couleur", PlayerData.skin.Hair.BeardColor, Config.CharacterComponentColors.Hair, function(value)
                playerUpdater.Hair.BeardColor = value
                SetPedHeadOverlayColor(ped, 1, 1, value, 0);
            end)
        elseif category == "Makeup" then
            CreateSliderList(shopMenu, "Type", PlayerData.skin.Makeup.FullMakeupType, content.items, function(value)
                playerUpdater.Makeup.FullMakeupType = value
                SetPedHeadOverlay(ped, 4, value, 1.0)
            end)
            CreateRangeOpacitySliderItem(shopMenu, "Densité", PlayerData.skin.Makeup.FullMakeupOpacity, function(value)
                playerUpdater.Makeup.FullMakeupOpacity = value
                SetPedHeadOverlay(ped, 4, playerUpdater.Makeup.FullMakeupType or PlayerData.skin.Makeup.FullMakeupType, value)
            end)
            shopMenu:AddCheckbox({
                label = "Utiliser couleur par défaut",
                value = PlayerData.skin.Makeup.FullMakeupDefaultColor,
            }):On("change", function(_, value)
                playerUpdater.Makeup.FullMakeupDefaultColor = value
            end)
            CreateColorSliderList(shopMenu, "Couleur principale", PlayerData.skin.Makeup.FullMakeupPrimaryColor, Config.CharacterComponentColors.Makeup,
                                  function(value)
                playerUpdater.Makeup.FullMakeupPrimaryColor = value
                SetPedHeadOverlayColor(ped, 4, 2, value, playerUpdater.Makeup.FullMakeupSecondaryColor or PlayerData.skin.Makeup.FullMakeupSecondaryColor or 0)
            end)
            CreateColorSliderList(shopMenu, "Couleur secondaire", PlayerData.skin.Makeup.FullMakeupSecondaryColor, Config.CharacterComponentColors.Makeup,
                                  function(value)
                playerUpdater.Makeup.FullMakeupSecondaryColor = value
                SetPedHeadOverlayColor(ped, 4, 2, playerUpdater.Makeup.FullMakeupPrimaryColor or PlayerData.skin.Makeup.FullMakeupPrimaryColor or 0, value)
            end)
        elseif category == "Blush" then
            CreateSliderList(shopMenu, "Type", PlayerData.skin.Makeup.BlushType, content.items, function(value)
                playerUpdater.Makeup.BlushType = value
                SetPedHeadOverlay(ped, 5, value, 1.0)
            end)
            CreateRangeOpacitySliderItem(shopMenu, "Densité", PlayerData.skin.Makeup.BlushOpacity, function(value)
                playerUpdater.Makeup.BlushOpacity = value
                SetPedHeadOverlay(ped, 5, playerUpdater.Makeup.BlushType or PlayerData.skin.Makeup.BlushType, value)
            end)
            CreateColorSliderList(shopMenu, "Couleur du blush", PlayerData.skin.Makeup.BlushColor, Config.CharacterComponentColors.Makeup, function(value)
                playerUpdater.Makeup.BlushColor = value
                SetPedHeadOverlayColor(ped, 5, 2, value, 0)
            end)
        elseif category == "Lipstick" then
            CreateSliderList(shopMenu, "Type", PlayerData.skin.Makeup.LipstickType, content.items, function(value)
                playerUpdater.Makeup.LipstickType = value
                SetPedHeadOverlay(ped, 8, value, 1.0)
            end)
            CreateRangeOpacitySliderItem(shopMenu, "Densité", PlayerData.skin.Makeup.LipstickOpacity, function(value)
                playerUpdater.Makeup.LipstickOpacity = value
                SetPedHeadOverlay(ped, 8, playerUpdater.Makeup.LipstickType or PlayerData.skin.Makeup.LipstickType, value)
            end)
            CreateColorSliderList(shopMenu, "Couleur du rouge à lèvre", PlayerData.skin.Makeup.LipstickColor, Config.CharacterComponentColors.Makeup,
                                  function(value)
                playerUpdater.Makeup.LipstickColor = value
                SetPedHeadOverlayColor(ped, 8, 2, value, 0)
            end)
        end

        shopMenu:AddButton({
            label = "Valider les modifications",
            rightLabel = "$" .. content.price,
            select = function()
                TriggerServerEvent("shops:server:pay", "barber",
                                   {
                    category = category,
                    categoryIndex = index,
                    overlay = content.overlay,
                    data = playerUpdater[content.overlay],
                }, 1)
            end,
        })
    end

    shopMenu:On("close", function()
        TriggerEvent("soz-character:Client:ApplyCurrentSkin")
        self:clearAllAnimations()
        self:deleteCam()
    end)

    shopMenu:Open()
end

--- Exports shop
ShopContext["barber"] = BarberShop:new("Coiffeur", "barber", {sprite = 71, color = 0}, "s_f_m_fembarber")
