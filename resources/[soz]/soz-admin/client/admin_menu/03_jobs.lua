local jobMenu
local jobGradeSlider

function BuildCurrentGradesValues(jobId)
    local SozJobCore = exports["soz-jobs"]:GetCoreObject()
    local job = SozJobCore.Jobs[jobId]
    local values = {}

    if not job then
        return values
    end

    for gradeId, grade in pairs(job.grades) do
        table.insert(values, {label = grade.name, value = {label = grade.name, jobID = jobId, gradeId = gradeId}})
    end

    return values
end

function BuildJobList()
    local SozJobCore = exports["soz-jobs"]:GetCoreObject()
    local JobList = {}

    for jobID, jobData in pairs(SozJobCore.Jobs) do
        for _, grade in pairs(jobData.grades) do
            if grade.owner == 1 then
                table.insert(JobList, {
                    label = jobData.label,
                    value = {label = jobData.label, jobID = jobID, gradeId = grade.id},
                })
            end
        end
    end

    table.sort(JobList, function(a, b)
        return a.label < b.label
    end)

    return JobList
end

function AdminMenuJob(menu, permission)
    if jobMenu == nil then
        jobMenu = MenuV:InheritMenu(menu, {subtitle = "Pour se construire un avenir"})
    end

    jobMenu:ClearItems()
    jobGradeSlider = nil

    jobMenu:On("open", function(m)
        local playerData = QBCore.Functions.GetPlayerData()

        m:ClearItems()

        m:AddSlider({
            label = "Changer de métier",
            value = nil,
            values = BuildJobList(),
            select = function(_, value)
                TriggerServerEvent("admin:jobs:setjob", value.jobID, value.gradeId)
                exports["soz-hud"]:DrawNotification("Votre métier est maintenant : ~b~" .. value.label, "info")

                jobGradeSlider:ClearValues()
                jobGradeSlider:AddValues(BuildCurrentGradesValues(value.jobID))
            end,
        })

        jobGradeSlider = m:AddSlider({
            label = "Changer de grade",
            value = nil,
            values = BuildCurrentGradesValues(playerData.job.id),
            select = function(_, value)
                TriggerServerEvent("admin:jobs:setjob", value.jobID, value.gradeId)
                exports["soz-hud"]:DrawNotification("Votre grade est maintenant : ~b~" .. value.label, "info")
            end,
        })

        m:AddCheckbox({
            label = "Passer en service",
            value = playerData.job.onduty,
            change = function()
                TriggerServerEvent("QBCore:ToggleDuty")
            end,
        })
    end)

    --- Add to main menu
    menu:AddButton({icon = "⛑", label = "Gestion métier", value = jobMenu, disabled = permission ~= "admin"})
end
