--- @class JewelryShop
JewelryShop = {}
local cam = nil

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

    local ped = PlayerPedId()
    local PlayerData = QBCore.Functions.GetPlayerData()

    self:deleteCam()
    self:setupCam()

    for _, content in pairs(self:getShopProducts()[PlayerData.skin.Model.Hash]) do
        shopMenu:AddButton({label = content.label, value = content.menu})

        if content.menu == nil then
            return
        end

        content.menu:On("switch", function(_, item)
            SetPedPropIndex(ped, tonumber(item.Value[1]), tonumber(item.Value[2]), tonumber(item.Value[3]), 2)
        end)
    end

    shopMenu:On("close", function()
        TriggerEvent("soz-character:Client:ApplyCurrentSkin")
        self:clearAllAnimations()
        self:deleteCam()
    end)

    shopMenu:Open()
end

--- Init
CreateThread(function()
    for model, products in pairs(JewelryShop:getShopProducts()) do
        for category, content in pairs(products) do
            local categoryEntry = JewelryShop:getShopProducts()[model][category]

            if MenuV:IsNamespaceAvailable("jewelry:cat:" .. model .. ":" .. category) then
                categoryEntry.menu = MenuV:CreateMenu(nil, content.label, "menu_shop_jewelry", "soz", "jewelry:cat:" .. model .. ":" .. category)

                table.sort(content.items)
                for component, drawables in pairs(content.items) do
                    table.sort(drawables)
                    for drawable, labels in pairs(drawables) do
                        categoryEntry.menu:AddButton({
                            label = GetLabelText(labels.GXT),
                            rightLabel = "$" .. content.price,
                            value = {category, component, drawable},
                            select = function()
                                TriggerServerEvent("shops:server:pay", "jewelry",
                                                   {
                                    overlay = content.overlay,
                                    category = category,
                                    component = component,
                                    drawable = drawable,
                                }, 1)
                            end,
                        })

                        Wait(5)
                    end
                end
            end
        end
    end
end)

--- Exports shop
ShopContext["jewelry"] = JewelryShop:new("Bijoutier", "jewelry", {sprite = 617, color = 0}, "u_m_m_jewelsec_01")
