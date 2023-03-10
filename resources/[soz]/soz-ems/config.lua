QBCore = exports["qb-core"]:GetCoreObject()

Config = {}

Config.AllowedJobInteraction = {"lsmc"}

Config.ConditionType = {NoRun = "NoRun", NoHair = "NoHair"}

Config.DiseaseRange = {
    [QBCore.Shared.Pollution.Level.Low] = 2000,
    [QBCore.Shared.Pollution.Level.Neutral] = 1000,
    [QBCore.Shared.Pollution.Level.High] = 500,
}
