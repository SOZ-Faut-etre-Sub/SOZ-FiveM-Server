local createCharacterMenu = MenuV:CreateMenu(nil, "", "menu_char_creation", "soz", "create-character")

local function OpenCreateCharacterMenu(skin, clothConfig, SpawnId)
    local p = promise.new()
    createCharacterMenu:ClearItems()

    local clothShopConfig = CreateClothShopConfigSouth

    if SpawnId == "spawn2" then
        clothShopConfig = CreateClothShopConfigNorth
    end

    local playerId = PlayerId()
    local modelMenu = CreateModelMenu(createCharacterMenu, playerId, skin, clothConfig)
    local bodyMenu = CreateBodyMenu(createCharacterMenu, playerId, skin)
    local hairMenu = CreateHairMenu(createCharacterMenu, playerId, skin)
    local makeupMenu = CreateMakeupMenu(createCharacterMenu, playerId, skin)
    local clothMenu = CreateClothMenu(createCharacterMenu, playerId, clothShopConfig, clothConfig, "BaseClothSet")

    createCharacterMenu:AddButton({label = "Identité", value = modelMenu})
    createCharacterMenu:AddButton({label = "Physique", value = bodyMenu})
    createCharacterMenu:AddButton({label = "Coiffure", value = hairMenu})
    createCharacterMenu:AddButton({label = "Maquillage", value = makeupMenu})
    createCharacterMenu:AddButton({label = "Vêtements", value = clothMenu})

    createCharacterMenu:Open()
    createCharacterMenu:On("close", function()
        p:resolve({Skin = skin, ClothConfig = clothConfig})
    end)

    return Citizen.Await(p)
end

function CreateAndApplyDefaultCharacter(gender)
    local skin = GetDefaultBodySkin(gender)
    local baseClothSet = GetMaleDefaultBaseClothSet()
    local nakedClothSet = GetMaleDefaultNakedClothSet()

    if gender == 1 then
        baseClothSet = GetFemaleDefaultBaseClothSet()
        nakedClothSet = GetFemaleDefaultNakedClothSet()
    end

    local clothConfig = GetDefaultClothConfig(baseClothSet, nakedClothSet)

    ApplyPlayerBodySkin(PlayerId(), skin)
    ApplyPlayerClothConfig(PlayerId(), clothConfig)

    return {Skin = skin, ClothConfig = clothConfig}
end

function CreateCharacterWizard(spawnId, character)
    local player = PlayerPedId()
    local confirm = false

    DoScreenFadeOut(500)
    Wait(500)

    SetEntityCoords(player, Config.PlayerCustomization.x, Config.PlayerCustomization.y, Config.PlayerCustomization.z, 0, 0, 0, false)
    SetEntityHeading(player, Config.PlayerCustomization.w)

    DoScreenFadeIn(500)

    while not confirm do
        Camera.Activate()
        character = OpenCreateCharacterMenu(character.Skin, character.ClothConfig, spawnId);
        Camera.Deactivate()

        local confirmWord = exports["soz-hud"]:Input("Entrer 'OUI' pour confirmer le skin de ce personnage", 32) or ""

        if confirmWord:lower() == "oui" then
            confirm = true
            TriggerServerEvent("soz-character:server:InCharacterMenu", false)
            TriggerServerEvent("soz-character:server:SetGodmode", false)
        end
    end

    DoScreenFadeOut(500)
    Wait(500)

    SpawnPlayer(spawnId)

    return character
end
