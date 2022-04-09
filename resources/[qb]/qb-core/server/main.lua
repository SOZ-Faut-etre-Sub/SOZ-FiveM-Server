QBCore = {}
QBCore.Config = QBConfig
QBCore.Shared = QBShared
QBCore.ServerCallbacks = {}
QBCore.ServerRPC = {}
QBCore.UseableItems = {}

exports('GetCoreObject', function()
    return QBCore
end)
