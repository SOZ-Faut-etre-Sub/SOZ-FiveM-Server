QBCore = exports["qb-core"]:GetCoreObject()
local PromoteMenu = MenuV:CreateMenu(nil, "", "menu_job_poleemploi", "soz", "job-promote")
PlayerData = QBCore.Functions.GetPlayerData()
local bossZones = {}

CreateThread(function()
    while true do
        Wait(0)
        if NetworkIsSessionStarted() then
            TriggerServerEvent("soz-jobs:AskJobSync")
            return
        end
    end
end)

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

RegisterNetEvent("soz-jobs:Client:OnJobSync", function(jobs)
    SozJobCore.Jobs = jobs
end)

exports("GetCoreObject", function()
    return SozJobCore
end)

exports("GetJobLabel", function(jobId)
    return SozJobCore.Jobs[jobId].label
end)

local function BuildPromoteMenu(target)
    PromoteMenu:ClearItems()
    PromoteMenu:SetSubtitle("Promouvoir un joueur")

    if PlayerData.job.id == nil then
        return
    end
    local job = SozJobCore.Jobs[PlayerData.job.id]
    if job == nil then
        print("Couldn't find job with id " .. PlayerData.job.id .. ".")
        return
    end

    local jobGrade = job.grades[tostring(PlayerData.job.grade)]
    if jobGrade == nil then
        print("Couldn't find grade " .. PlayerData.job.grade .. " of job " .. PlayerData.job.id .. ". Will use default value.")
        return
    end
    local playerGradeWeight = jobGrade.weight or 0

    if not job then
        return
    end

    for gradeId, grade in pairs(job.grades) do
        if grade.weight <= playerGradeWeight then
            local label = "Grade : " .. grade.name

            PromoteMenu:AddButton({label = label, value = "set_grade"}):On("select", function()
                TriggerServerEvent("job:promote", target, gradeId)
                PromoteMenu:Close()
            end)
        end
    end

    PromoteMenu:Open()
end

CreateThread(function()
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {
                label = "Recruter dans l'entreprise",
                icon = "c:jobs/enroll.png",
                action = function(entity)
                    local targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    TriggerServerEvent("job:recruit", targetSource)
                end,
                blackoutGlobal = true,
                canInteract = function(entity)
                    if not SozJobCore.Functions.HasPermission(PlayerData.job.id, SozJobCore.JobPermission.ManageGrade) and
                        not SozJobCore.Functions.HasPermission(PlayerData.job.id, SozJobCore.JobPermission.Enrollment) then
                        return false
                    end

                    local playerPosition = GetEntityCoords(GetPlayerPed(-1))
                    local targetPosition = GetEntityCoords(entity)
                    for _, bossZone in pairs(bossZones[PlayerData.job.id]) do
                        if bossZone ~= nil and (bossZone:isPointInside(playerPosition) and bossZone:isPointInside(targetPosition)) then
                            local targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                            local targetJob = QBCore.Functions.TriggerRpc("soz-jobs:GetPlayerJob", targetSource)

                            return targetJob.id == SozJobCore.JobType.Unemployed
                        end
                    end

                    return false
                end,
            },
            {
                label = "Virer de l'entreprise",
                icon = "c:jobs/fire.png",
                action = function(entity)
                    local targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    TriggerServerEvent("job:fire", targetSource)
                end,
                blackoutGlobal = true,
                canInteract = function(entity)
                    if not SozJobCore.Functions.HasPermission(PlayerData.job.id, SozJobCore.JobPermission.ManageGrade) and
                        not SozJobCore.Functions.HasPermission(PlayerData.job.id, SozJobCore.JobPermission.Enrollment) then
                        return false
                    end

                    local playerPosition = GetEntityCoords(GetPlayerPed(-1))
                    local targetPosition = GetEntityCoords(entity)
                    for _, bossZone in pairs(bossZones[PlayerData.job.id]) do
                        if bossZone ~= nil and (bossZone:isPointInside(playerPosition) and bossZone:isPointInside(targetPosition)) then
                            local targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                            local targetJob = QBCore.Functions.TriggerRpc("soz-jobs:GetPlayerJob", targetSource)

                            return targetJob.id == PlayerData.job.id
                        end
                    end

                    return false
                end,
            },
            {
                label = "Promouvoir",
                icon = "c:jobs/promote.png",
                blackoutGlobal = true,
                action = function(entity)
                    local targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    BuildPromoteMenu(targetSource)
                end,
                canInteract = function(entity)
                    if not SozJobCore.Functions.HasPermission(PlayerData.job.id, SozJobCore.JobPermission.ManageGrade) and
                        not SozJobCore.Functions.HasPermission(PlayerData.job.id, SozJobCore.JobPermission.Enrollment) then
                        return false
                    end

                    local playerPosition = GetEntityCoords(GetPlayerPed(-1))
                    local targetPosition = GetEntityCoords(entity)
                    for _, bossZone in pairs(bossZones[PlayerData.job.id]) do
                        if bossZone ~= nil and (bossZone:isPointInside(playerPosition) and bossZone:isPointInside(targetPosition)) then
                            local targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                            local targetJob = QBCore.Functions.TriggerRpc("soz-jobs:GetPlayerJob", targetSource)

                            return targetJob.id == PlayerData.job.id
                        end
                    end

                    return false
                end,
            },
        },
        distance = 2.5,
    })

    for jobId, job in pairs(SozJobCore.Jobs) do
        if job.canInvoice then
            exports["qb-target"]:AddGlobalPlayer({
                options = {
                    {
                        label = "Facturer",
                        color = jobId,
                        icon = "c:jobs/facture.png",
                        event = "jobs:client:InvoicePlayer",
                        canInteract = function()
                            return PlayerData.job.onduty
                        end,
                        job = jobId,
                        blackoutGlobal = true,
                        blackoutJob = jobId,
                    },
                    {
                        label = "Facturer la société",
                        color = jobId,
                        icon = "c:jobs/facture.png",
                        event = "jobs:client:InvoiceSociety",
                        canInteract = function()
                            return PlayerData.job.onduty and SozJobCore.Functions.HasPermission(jobId, SozJobCore.JobPermission.SocietyBankInvoices)
                        end,
                        job = jobId,
                        blackoutGlobal = true,
                        blackoutJob = jobId,
                    },
                },
                distance = 1.5,
            })
        end
        if job.bossZones then
            for _, bossZone in pairs(job.bossZones) do
                if bossZones[jobId] == nil then
                    bossZones[jobId] = {}
                end
                table.insert(bossZones[jobId], BoxZone:Create(vector3(bossZone.x, bossZone.y, bossZone.z), bossZone.sx, bossZone.sy, {
                    name = jobId .. ":boss",
                    heading = bossZone.heading,
                    minZ = bossZone.minZ,
                    maxZ = bossZone.maxZ,
                    debugPoly = bossZone.debugPoly or false,
                }))
            end
        end
    end
end)
