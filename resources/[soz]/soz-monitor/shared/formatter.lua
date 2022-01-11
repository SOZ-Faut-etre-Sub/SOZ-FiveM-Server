--- FormattedDateTime
--- @param timestamp number Farmat date for specific timestamp (default: now)
function FormattedDateTime(timestamp)
    return os.date(Config.dateFormat, timestamp)
end

function ReplaceString(str, this, that)
    local b, e = str:find(this, 1, true)

    if b == nil then
        return str
    else
        return str:sub(1, b - 1) .. that .. ReplaceString(str:sub(e + 1), this, that)
    end
end
