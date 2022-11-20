--- @class TattooShop
TattooShop = {}
local cam, camVariationList, camVariationId, camVariationCoord = nil, {}, 1, nil

function TattooShop:new(...)
    local shop = setmetatable(ShopShell:new(...), {__index = TattooShop})
    setmetatable(TattooShop, {__index = ShopShell})
    return shop
end

function TattooShop:getShopProducts()
    return Config.Products["tattoo"]
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

function TattooShop:GenerateMenu(skipIntro)
    shopMenu.Texture = "menu_shop_tattoo"
    shopMenu:ClearItems()
    shopMenu:SetSubtitle(self.label)

    local gender = QBCore.Functions.GetPlayerData().charinfo.gender

    self:PreGenerateMenu(skipIntro)

    shopMenu:AddButton({
        icon = "⚠️",
        label = "Se faire retirer les tatouages",
        description = "Suite à une encre de mauvaise qualité, vous pouvez retirer tous vos tatouages.",
        value = nil,
        select = function(item)
            local validation = exports["soz-hud"]:Input("Voulez-vous vraiment ce tatouage ? [oui/non]", 3)
            if validation == "oui" then
                TriggerServerEvent("shops:server:resetTattoos")
            end
        end,
    })

    for categoryId, category in pairs(Config.TattooCategories) do
        if MenuV:IsNamespaceAvailable("tattoo:cat:" .. categoryId) then
            Config.TattooCategories[categoryId].menu = MenuV:InheritMenu(shopMenu, {Subtitle = category.label}, "tattoo:cat:" .. categoryId)
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

        shopMenu:AddButton({label = category.label, value = Config.TattooCategories[categoryId].menu})
    end

    TriggerScreenblurFadeIn(50)
    for _, tattoo in pairs(self:getShopProducts()) do
        local overlayField = gender == 0 and "HashNameMale" or "HashNameFemale"

        if tattoo[overlayField] ~= "" then
            local label = GetLabelText(tattoo["Name"])
            if label == "NULL" or tattoo["LocalizedName"] ~= nil then
                label = tattoo["LocalizedName"]
            end
            if label == nil then
                print(tattoo["Name"])
            else
                Config.TattooCategories[tattoo["Zone"]].menu:AddButton({
                    label = label,
                    value = {collection = tattoo["Collection"], overlay = tattoo[overlayField]},
                    rightLabel = "$" .. QBCore.Shared.GroupDigits(tattoo["Price"]),
                    select = function(item)
                        local validation = exports["soz-hud"]:Input("Voulez-vous vraiment ce tatouage ? [oui/non]", 3)
                        if validation == "oui" then
                            TriggerServerEvent("shops:server:pay", "tattoo", item:GetValue(), 1)
                        end
                    end,
                })
            end

            QBCore.Functions.DrawText(0.4, 0.9, 0.0, 0.0, 0.8, 255, 255, 255, 255, "Chargement en cours...")
            Citizen.Wait(0)
        end
    end
    TriggerScreenblurFadeOut(50)

    shopMenu:On("close", function(m)
        self:OnMenuClose()
        m:ClearItems()
    end)

    shopMenu:Open()
end

function TattooShop:PreGenerateMenu(skipIntro)
    if skipIntro ~= true and Config.TattooLocationsInShop[currentShop] then
        TaskGoStraightToCoord(PlayerPedId(), Config.TattooLocationsInShop[currentShop].x, Config.TattooLocationsInShop[currentShop].y,
                              Config.TattooLocationsInShop[currentShop].z, 1.0, 1000, Config.TattooLocationsInShop[currentShop].w, 0.0)
        Wait(4000)
    end

    -- set naked
    TriggerEvent("soz-character:Client:SetTemporaryNaked", true)

    self:DeleteCam()
    self:CreateCam()

    CreateThread(function()
        local sc = self:SetupScaleform("instructional_buttons")
        while shopMenu.IsOpen do
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

function TattooShop:OnMenuClose()
    self:DeleteCam()

    -- Unset naked
    TriggerEvent("soz-character:Client:ApplyCurrentClothConfig")
    TriggerEvent("soz-character:Client:ApplyCurrentSkin")
end

function TattooShop:MenuEntryAction(item)
    local playerData = QBCore.Functions.GetPlayerData()
    local skin = playerData.skin

    skin.Tattoos = skin.Tattoos or {}

    table.insert(skin.Tattoos, {
        Collection = GetHashKey(item.Value.collection),
        Overlay = GetHashKey(item.Value.overlay),
    })

    TriggerEvent("soz-character:Client:ApplyTemporarySkin", skin)
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
ShopContext["tattoo"] = TattooShop:new("Tatoueur", "tattoo", {sprite = 75, color = 1}, "u_m_y_tattoo_01")
