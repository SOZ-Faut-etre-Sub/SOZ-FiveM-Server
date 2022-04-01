--- @class FarmAccount
FarmAccount = {}

function FarmAccount.new()
    return setmetatable({}, {
        __index = FarmAccount,
        __tostring = function()
            return "FarmAccount"
        end,
    })
end

function FarmAccount:save(id, owner, amount, marked_money)
    return true
end

--- Exports functions
setmetatable(FarmAccount, {__index = AccountShell})
_G.AccountType["farm"] = FarmAccount.new()
