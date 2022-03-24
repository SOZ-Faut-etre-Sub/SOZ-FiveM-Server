--- @class TattooShop
TattooShop = {}
local confirmMenu, confirmItem, confirmValue = nil, nil, {}
local cam, camVariationList, camVariationId, camVariationCoord = nil, {}, 1, nil

function TattooShop.new()
    return setmetatable({}, {
        __index = TattooShop,
        __tostring = function()
            return "TattooShop"
        end,
    })
end

function TattooShop:SetupScaleform(scaleformType)
    local scaleform = RequestScaleformMovie(scaleformType)
    while not HasScaleformMovieLoaded(scaleform) do
        Wait(0)
    end

    -- draw it once to set up layout
    DrawScaleformMovieFullscreen(scaleform, 255, 255, 255, 0, 0)

    BeginScaleformMovieMethod(scaleform, "CLEAR_ALL")
    EndScaleformMovieMethod()

    BeginScaleformMovieMethod(scaleform, "SET_CLEAR_SPACE")
    ScaleformMovieMethodAddParamInt(200)
    EndScaleformMovieMethod()

    BeginScaleformMovieMethod(scaleform, "SET_DATA_SLOT")
    ScaleformMovieMethodAddParamInt(0)
    ScaleformMovieMethodAddParamPlayerNameString(GetControlInstructionalButton(0, 21, true))
    BeginTextCommandScaleformString("STRING")
    AddTextComponentSubstringKeyboardDisplay("Faire pivoter la caméra")
    EndTextCommandScaleformString()
    EndScaleformMovieMethod()

    BeginScaleformMovieMethod(scaleform, "DRAW_INSTRUCTIONAL_BUTTONS")
    EndScaleformMovieMethod()

    BeginScaleformMovieMethod(scaleform, "SET_BACKGROUND_COLOUR")
    ScaleformMovieMethodAddParamInt(0)
    ScaleformMovieMethodAddParamInt(0)
    ScaleformMovieMethodAddParamInt(0)
    ScaleformMovieMethodAddParamInt(80)
    EndScaleformMovieMethod()

    return scaleform
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
function TattooShop:GenerateMenu(menu, shop, skipIntro)
    local gender = QBCore.Functions.GetPlayerData().charinfo.gender
    if self:GetShopData(shop) == nil then
        return
    end

    menu:ClearItems()
    menu:SetSubtitle(self:GetShopData(shop).label)
    self:SetBanner(menu, shop)

    self:PreGenerateMenu(menu, shop, skipIntro)

    if MenuV:IsNamespaceAvailable("shop:tattoo:confirm") then
        confirmMenu = MenuV:CreateMenu(nil, nil, "menu_shop_tattoo", "soz", "shop:tattoo:confirm")
    end

    confirmMenu:ClearItems()
    confirmItem = confirmMenu:AddConfirm({label = "Voulez-vous vraiment ce tatouage ?", value = "n"})

    for categoryId, category in pairs(Config.TattooCategories) do
        if MenuV:IsNamespaceAvailable("tattoo:cat:" .. categoryId) then
            Config.TattooCategories[categoryId].menu = MenuV:InheritMenu(menu, {Subtitle = category.label}, "tattoo:cat:" .. categoryId)
        end

        Config.TattooCategories[categoryId].menu:ClearItems()

        if #camVariationList == 0 and camVariationCoord == nil then
            camVariationList = category.cam
            camVariationCoord = category.player

            self:UpdateCam()
        end

        Config.TattooCategories[categoryId].menu:On("open", function()
            camVariationList = category.cam
            camVariationCoord = category.player
        end)

        Config.TattooCategories[categoryId].menu:On("switch", function(_, currentItem)
            self:MenuEntryAction(currentItem)
            self:UpdateCam()
        end)

        menu:AddButton({label = category.label, value = Config.TattooCategories[categoryId].menu})
    end

    for _, tattoo in pairs(self:GetShopData(shop).products) do
        local overlayField = gender == 0 and "HashNameMale" or "HashNameFemale"

        if tattoo[overlayField] ~= "" then
            local entry = Config.TattooCategories[tattoo["Zone"]].menu:AddButton({
                label = GetLabelText(tattoo["Name"]),
                value = {collection = tattoo["Collection"], overlay = tattoo[overlayField]},
                rightLabel = "$" .. QBCore.Shared.GroupDigits(tattoo["Price"]),
            })

            --- @param select Item
            entry:On("select", function(select)
                confirmValue = select:GetValue()
                confirmMenu:Open()
            end)
        end
    end

    confirmItem:On("confirm", function()
        TriggerServerEvent("shops:server:pay", shop, confirmValue, 1)

        MenuV:CloseAll(function()
            self:GenerateMenu(menu, shop, true)
        end)
    end)

    menu:On("close", function()
        self:OnMenuClose(menu, shop)
    end)

    menu:Open()
end

--- PreGenerateMenu
--- @param menu Menu
--- @param shop string
function TattooShop:PreGenerateMenu(menu, shop, skipIntro)
    shop = self:GetShopData(shop)
    local ClotheData = {}
    local playerData = QBCore.Functions.GetPlayerData()

    if skipIntro ~= true and shop.inShopCoords then
        TaskGoStraightToCoord(PlayerPedId(), shop.inShopCoords.x, shop.inShopCoords.y, shop.inShopCoords.z, 1.0, 1000, shop.inShopCoords.w, 0.0)
        Wait(4000)
    end

    if playerData.charinfo.gender == 0 then
        ClotheData = {
            ["tshirt_1"] = 15,
            ["tshirt_2"] = 0,
            ["arms_1"] = 15,
            ["arms_2"] = 0,
            ["torso_1"] = 91,
            ["torso_2"] = 0,
            ["pants_1"] = 14,
            ["pants_2"] = 0,
        }
    else
        ClotheData = {
            ["tshirt_1"] = 34,
            ["tshirt_2"] = 0,
            ["arms_1"] = 15,
            ["arms_2"] = 0,
            ["torso_1"] = 101,
            ["torso_2"] = 1,
            ["pants_1"] = 16,
            ["pants_2"] = 0,
        }
    end
    TriggerEvent("skinchanger:loadClothes", nil, ClotheData)

    self:DeleteCam()
    self:CreateCam()

    CreateThread(function()
        local sc = self:SetupScaleform("instructional_buttons")
        while menu.IsOpen do
            DisableControlAction(0, 32, true) -- W
            DisableControlAction(0, 34, true) -- A
            DisableControlAction(0, 31, true) -- S
            DisableControlAction(0, 30, true) -- D
            DisableControlAction(0, 22, true) -- Jump
            DisableControlAction(0, 44, true) -- Cover

            if IsControlJustPressed(0, 21) then
                if camVariationId == #camVariationList then
                    camVariationId = 1
                else
                    camVariationId = camVariationId + 1
                end

                self:UpdateCam()
            end

            DrawScaleformMovieFullscreen(sc, 255, 255, 255, 255, 0)

            Wait(0)
        end
    end)
end

function TattooShop:OnMenuClose(menu, shop)
    self:DeleteCam()
    -- TriggerServerEvent("cui_character:requestPlayerData")
end

function TattooShop:MenuEntryAction(item)
    local ped = PlayerPedId()
    local playerData = QBCore.Functions.GetPlayerData()

    SetPlayerTattoo(playerData.metadata.tattoo)
    AddPedDecorationFromHashes(ped, GetHashKey(item.Value.collection), GetHashKey(item.Value.overlay))
end

function TattooShop:CreateCam()
    if not DoesCamExist(cam) then
        cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", 1)
        SetCamActive(cam, true)
        RenderScriptCams(true, false, 0, true, true)
        StopCamShaking(cam, true)
    end
end

function TattooShop:UpdateCam()
    if GetCamCoord(cam) ~= GetOffsetFromEntityInWorldCoords(PlayerPedId(), camVariationList[camVariationId]) then
        SetCamCoord(cam, GetOffsetFromEntityInWorldCoords(PlayerPedId(), camVariationList[camVariationId]))
        PointCamAtCoord(cam, GetOffsetFromEntityInWorldCoords(PlayerPedId(), camVariationCoord))
    end
end

function TattooShop:DeleteCam()
    if DoesCamExist(cam) then
        DetachCam(cam)
        SetCamActive(cam, false)
        RenderScriptCams(false, false, 0, 1, 0)
        DestroyCam(cam, false)
    end
    camVariationList, camVariationId, camVariationCoord = {}, 1, nil
end

--- Exports functions
setmetatable(TattooShop, {__index = ShopShell})
ShopContext["tattoo"] = TattooShop.new()
