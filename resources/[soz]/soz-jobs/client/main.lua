QBCore = exports["qb-core"]:GetCoreObject()
local PromoteMenu = MenuV:CreateMenu(nil, "", "menu_job_poleemploi", "soz", "job-promote")
PlayerData = QBCore.Functions.GetPlayerData()

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

    local job = SozJobCore.Jobs[PlayerData.job.id]

    if not job then
        return
    end

    for gradeId, grade in pairs(job.grades) do
        local label = "Grade : " .. grade.name

        PromoteMenu:AddButton({label = label, value = "set_grade"}):On("select", function()
            TriggerServerEvent("job:promote", target, gradeId)
            PromoteMenu:Close()
        end)
    end

    PromoteMenu:Open()
end

CreateThread(function()
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {
                label = "Recruter dans l'entreprise",
                action = function(entity)
                    local targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    TriggerServerEvent("job:recruit", targetSource)
                end,
                canInteract = function(entity)
                    if not SozJobCore.Functions.HasPermission(PlayerData.job.id, SozJobCore.JobPermission.ManageGrade) then
                        return false
                    end

                    local targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    local targetJob = QBCore.Functions.TriggerRpc("soz-jobs:GetPlayerJob", targetSource)

                    return targetJob.id == SozJobCore.JobType.Unemployed
                end,
            },
            {
                label = "Virer de l'entreprise",
                action = function(entity)
                    local targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    TriggerServerEvent("job:fire", targetSource)
                end,
                canInteract = function(entity)
                    if not SozJobCore.Functions.HasPermission(PlayerData.job.id, SozJobCore.JobPermission.ManageGrade) then
                        return false
                    end

                    local targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    local targetJob = QBCore.Functions.TriggerRpc("soz-jobs:GetPlayerJob", targetSource)

                    return targetJob.id == PlayerData.job.id
                end,
            },
            {
                label = "Promouvoir",
                action = function(entity)
                    local targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    BuildPromoteMenu(targetSource)
                end,
                canInteract = function(entity)
                    if not SozJobCore.Functions.HasPermission(PlayerData.job.id, SozJobCore.JobPermission.ManageGrade) then
                        return false
                    end

                    local targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    local targetJob = QBCore.Functions.TriggerRpc("soz-jobs:GetPlayerJob", targetSource)

                    return targetJob.id == PlayerData.job.id
                end,
            },
        },
        distance = 2.5,
    })
end)
