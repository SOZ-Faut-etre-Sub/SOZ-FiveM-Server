local jobMenu = MenuV:InheritMenu(AdminMenu, { subtitle = "Pour se construire un avenir"})

local JobOption = {JobList = {}}

for _, jobData in pairs(SozJobCore.Jobs) do
    for _, grade in pairs(jobData.grades) do
        if grade.owner == 1 then
            table.insert(JobOption.JobList, {label = jobData.label, value = {label = jobData.label, jobID = grade.jobID, gradeId = grade.id}})
        end
    end
end

--- Menu entries
jobMenu:AddSlider({
    label = "Changer de métier",
    value = nil,
    values = JobOption.JobList,
    select = function(_, value)
        TriggerServerEvent("admin:jobs:setjob", value.jobID, value.gradeId)
        exports["soz-hud"]:DrawNotification("Votre métier est maintenant : ~b~" .. value.label, "info")
    end,
})

--- Add to main menu
AdminMenu:AddButton({icon = "⛑", label = "Gestion métier", value = jobMenu })
