local QBCore = exports["qb-core"]:GetCoreObject()

local PoleMenu = MenuV:CreateMenu(nil, "", "menu_pole", "soz", "job-panel")

local adsl_position = {x = 479.17, y = -107.53, z = 63.16}
local livraison_position = {x = -424.06, y = -2789.62, z = 6.4}
local pole_emploi_coords = vector3(236.53, -409.22, 47.92)

QBCore.Functions.CreateBlip("pole_emploi_local", {
    name = "Pôle emploi",
    coords = pole_emploi_coords,
    sprite = 280,
    color = 2,
})

exports["qb-target"]:AddBoxZone("pole emploi", vector3(236.46, -409.33, 47.92), 1, 1, {
    name = "pole emploi",
    heading = 0,
    debugPoly = false,
}, {
    options = {
        {
            type = "client",
            event = "jobs:pole:menu",
            icon = "fas fa-sign-in-alt",
            label = "information pôle emploi",
            job = "unemployed",
        },
    },
    distance = 2.5,
})

local function JobPosition(job, coords, sprite)
    blip = AddBlipForCoord(coords.x, coords.y, coords.z)
    SetBlipScale(blip, 1.0)
    SetBlipSprite(blip, sprite)
    SetBlipColour(blip, 32)
    AddTextEntry(job, "commencer le job")
    BeginTextCommandSetBlipName(job)
    EndTextCommandSetBlipName(blip)
    SetBlipCategory(blip, 2)
end

local function JobPanel(menu)
    local adsl = menu:AddButton({
        label = "job adsl",
        description = "rendez vous au point sur votre gps pour commencez le job adsl",
    })
    local livraison = menu:AddButton({
        label = "job de livraison",
        description = "rendez vous au point sur votre gps pour commencez le job de livraison",
    })
    adsl:On("select", function()
        if blip ~= nil then
            destroyblip(blip)
        end
        JobPosition("adsl", adsl_position, 280)
    end)
    livraison:On("select", function()
        if blip ~= nil then
            destroyblip(blip)
        end
        JobPosition("livraison", livraison_position, 280)
    end)
end

RegisterNetEvent("jobs:pole:menu", function()
    if PoleMenu.IsOpen then
        PoleMenu:Close()
    else
        PoleMenu:ClearItems()
        JobPanel(PoleMenu)

        PoleMenu:Open()
    end
end)

-- function general au job pole emploi

function DeleteVehicule(vehicule)
    SetEntityAsMissionEntity(vehicule, true, true)
    DeleteVehicle(vehicule)
end

function destroyblip(blip)
    RemoveBlip(blip)
    blip = nil
end
