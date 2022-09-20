Citizen.CreateThread(function()
    while true do
        local processingItem = exports["soz-inventory"]:GetFirstItem(GarbageConfig.Processing.ProcessingStorage)

        if processingItem then
            local itemToProcess = GarbageConfig.RecycleItem[processingItem.item.name] or GarbageConfig.RecycleItem["default"]

            if processingItem.amount < itemToProcess then
                itemToProcess = processingItem.amount
            end

            if exports["soz-inventory"]:RemoveItem(GarbageConfig.Processing.ProcessingStorage, processingItem.item.name, itemToProcess) then
                local resellPrice = GarbageConfig.SellPrice[processingItem.item.name] or GarbageConfig.SellPrice["default"]

                TriggerEvent("banking:server:TransferMoney", "farm_garbage", "safe_garbage", itemToProcess * resellPrice)
                TriggerEvent("monitor:server:event", "job_bluebird_recycling_garbage_bag", {
                    item = processingItem.item.name,
                }, {quantity = tonumber(itemToProcess)})
            end
        end

        Citizen.Wait(GarbageConfig.Processing.Duration)
    end
end)
