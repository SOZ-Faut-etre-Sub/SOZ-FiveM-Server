local jobMenu, JobOption = nil, {JobList = {}}

function AdminMenuJob(menu, permission)
    if jobMenu == nil then
        jobMenu = MenuV:InheritMenu(menu, {subtitle = "Pour se construire un avenir"})
    end

    jobMenu:ClearItems()

    jobMenu:On("open", function(m)
        m:ClearItems()

        --- Menu entries
        m:AddSlider({
            label = "Changer de métier",
            value = nil,
            values = JobOption.JobList,
            select = function(_, value)
                TriggerServerEvent("admin:jobs:setjob", value.jobID, value.gradeId)
                exports["soz-hud"]:DrawNotification("Votre métier est maintenant : ~b~" .. value.label, "info")
            end,
        })

        m:AddCheckbox({
            label = "Passer en service",
            value = QBCore.Functions.GetPlayerData().job.onduty,
            change = function()
                TriggerServerEvent("QBCore:ToggleDuty")
            end,
        })
    end)

    --- Add to main menu
    menu:AddButton({icon = "⛑", label = "Gestion métier", value = jobMenu, disabled = permission ~= "admin"})
end

RegisterNetEvent("soz-jobs:Client:OnJobSync", function(jobs)
    JobOption.JobList = {}

    for jobID, jobData in pairs(jobs) do
        for _, grade in pairs(jobData.grades) do
            if grade.owner == 1 then
                table.insert(JobOption.JobList, {
                    label = jobData.label,
                    value = {label = jobData.label, jobID = jobID, gradeId = grade.id},
                })
            end
        end
    end

    table.sort(JobOption.JobList, function(a, b)
        return a.label < b.label
    end)
end)
