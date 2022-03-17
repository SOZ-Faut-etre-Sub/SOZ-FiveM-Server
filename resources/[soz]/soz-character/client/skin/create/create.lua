local createCharacterMenu = MenuV:CreateMenu(nil, "", "menu_job_lspd", "soz", "create-character")

local function OpenCreateCharacterMenu(skin)
    createCharacterMenu:ClearItems()

    local playerId = PlayerId()
    local modelMenu = CreateModelMenu(createCharacterMenu, playerId, skin)
    local bodyMenu = CreateBodyMenu(createCharacterMenu, playerId, skin)
    local faceMenu = CreateFaceMenu(createCharacterMenu, playerId, skin)
    local clothMenu = CreateClothMenu(createCharacterMenu, playerId, skin)

    createCharacterMenu:AddButton({label = "Identité", value = modelMenu})
    createCharacterMenu:AddButton({label = "Physique", value = bodyMenu})
    createCharacterMenu:AddButton({label = "Soins", value = faceMenu})
    createCharacterMenu:AddButton({label = "Vêtements", value = clothMenu})

    createCharacterMenu:Open()
    createCharacterMenu:On("close", function()
        print("close")
    end)
end

function CreateCharacter()
    local skin = GetDefaultBodySkin()
    ApplyPlayerBodySkin(PlayerId(), skin)
    Camera.Activate()

    OpenCreateCharacterMenu(skin);

    -- Camera.Deactivate()
end
