--- @class AccountShell
AccountShell = {}

function AccountShell.new()
    return setmetatable({}, {
        __index = AccountShell,
        __tostring = function()
            return "AccountShell"
        end,
    })
end

--- load
--- @param id any
--- @param owner any
--- @return table, boolean
function AccountShell:load(id, owner)
    print("^8" .. tostring(self) .. ":load() is not implemented !")
    return {}, false
end

--- AccessAllowed
--- @param owner any
--- @param player any
--- @return boolean
function AccountShell:AccessAllowed(owner, player)
    print("^8" .. tostring(self) .. ":AccessAllowed() is not implemented !")
    return true
end

--- save
--- @param id any
--- @param owner any
--- @param money number
--- @param marked_money number
--- @return boolean
function AccountShell:save(id, owner, money, marked_money)
    print("^8" .. tostring(self) .. ":save() is not implemented !")
    return false
end
