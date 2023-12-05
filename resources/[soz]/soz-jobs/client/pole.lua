local PoleMenu = MenuV:CreateMenu(nil, "", "menu_job_poleemploi", "soz", "job-panel")

local adsl_position = {x = 479.17, y = -107.53, z = 63.16}
local livraison_position = {x = -424.06, y = -2789.62, z = 6.4}
local religion_position = {x = -766.26, y = -24.39, z = 41.08}
local metal_position = {x = -343.23, y = -1554.57, z = 25.22}
local pole_emploi_coords = vector3(236.53, -409.22, 47.92)

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    QBCore.Functions.CreateBlip("pole_emploi_local", {
        name = "Pôle emploi",
        coords = pole_emploi_coords,
        sprite = 280,
        color = 2,
        scale = 0.8,
    })

end)

local function notif()
    TriggerServerEvent("job:anounce", "Rendez vous au point sur votre carte pour prendre le métier")
end

local function JobPosition(job, coords, sprite)
    blip = AddBlipForCoord(coords.x, coords.y, coords.z)
    SetBlipScale(blip, 0.8)
    SetBlipSprite(blip, sprite)
    SetBlipColour(blip, 32)
    AddTextEntry(job, "Commencer le job")
    BeginTextCommandSetBlipName(job)
    EndTextCommandSetBlipName(blip)
    SetBlipCategory(blip, 2)
    SetNewWaypoint(coords.x, coords.y)
end

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
            job = SozJobCore.JobType.Unemployed,
        },
        {
            icon = "fas fa-sign-in-alt",
            label = "Gps Adsl",
            job = SozJobCore.JobType.Adsl,
            action = function()
                notif()
                JobPosition("adsl", adsl_position, 280)
            end,
        },
        {
            icon = "fas fa-sign-in-alt",
            label = "Gps Fougère Prime",
            job = SozJobCore.JobType.Delivery,
            action = function()
                notif()
                JobPosition("delivery", livraison_position, 280)
            end,
        },
        {
            icon = "fas fa-sign-in-alt",
            label = "Gps DeMetal",
            job = SozJobCore.JobType.Scrapper,
            action = function()
                notif()
                JobPosition("metal", metal_position, 280)
            end,
        },
        {
            icon = "fas fa-sign-in-alt",
            label = "Gps InfoChat",
            job = SozJobCore.JobType.Religious,
            action = function()
                notif()
                JobPosition("religion", religion_position, 280)
            end,
        },
    },
    distance = 2.5,
})

local function JobPanel(menu)
    local adsl = menu:AddButton({label = "Adsl", description = " Poseur de cable d'ADSL "})
    local livraison = menu:AddButton({label = "Fougère Prime", description = "Livraison à Domicile"})
    local religion = menu:AddButton({label = "InfoChat", description = "Religion"})
    local metal = menu:AddButton({
        label = "DeMetal Company",
        description = "Récolte de metal, Industrie Métallurgique",
    })
    adsl:On("select", function()
        if blip ~= nil then
            destroyblip(blip)
        end
        notif()
        JobPosition("adsl", adsl_position, 280)
    end)
    livraison:On("select", function()
        if blip ~= nil then
            destroyblip(blip)
        end
        notif()
        JobPosition("delivery", livraison_position, 280)
    end)
    religion:On("select", function()
        if blip ~= nil then
            destroyblip(blip)
        end
        notif()
        JobPosition("religion", religion_position, 280)
    end)
    metal:On("select", function()
        if blip ~= nil then
            destroyblip(blip)
        end
        notif()
        JobPosition("metal", metal_position, 280)
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

function createblip(name, description, sprite, coords)
    job_blip = AddBlipForCoord(coords.x, coords.y, coords.z)
    SetBlipScale(job_blip, 0.8)
    SetBlipSprite(job_blip, sprite)
    SetBlipColour(job_blip, 32)
    AddTextEntry(name, description)
    BeginTextCommandSetBlipName(name)
    EndTextCommandSetBlipName(job_blip)
    SetBlipCategory(job_blip, 2)
end

function DrawInteractionMarker(ObjectifCoord, show)
    local a, b, c, d, entity = GetShapeTestResult(StartShapeTestCapsule(ObjectifCoord.x, ObjectifCoord.y, ObjectifCoord.z, ObjectifCoord.x, ObjectifCoord.y,
                                                                        ObjectifCoord.z, 1.0, 16, 0, 7))
    SetEntityDrawOutlineColor(0, 180, 0, 255)
    SetEntityDrawOutlineShader(1)
    SetEntityDrawOutline(entity, show)
end
