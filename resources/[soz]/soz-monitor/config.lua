Config               = {}

--- Available format
--- @param %a abbreviated weekday name (e.g., Wed)
--- @param %A full weekday name (e.g., Wednesday)
--- @param %b abbreviated month name (e.g., Sep)
--- @param %B full month name (e.g., September)
--- @param %c date and time (e.g., 09/16/98 23:48:10)
--- @param %d day of the month (16) [01-31]
--- @param %H hour, using a 24-hour clock (23) [00-23]
--- @param %I hour, using a 12-hour clock (11) [01-12]
--- @param %M minute (48) [00-59]
--- @param %m month (09) [01-12]
--- @param %p either "am" or "pm" (pm)
--- @param %S second (10) [00-61]
--- @param %w weekday (3) [0-6 = Sunday-Saturday]
--- @param %x date (e.g., 09/16/98)
--- @param %X time (e.g., 23:48:10)
--- @param %Y full year (1998)
--- @param %y two-digit year (98) [00-99]
--- @param %% the character `%´
Config.dateFormat    = "%xT%X"

--- Available replacement
--- @param %level% string
--- @param %date% date
--- @param %emitter% string log emitter
--- @param %msg% string log message
Config.logFormat     = "%level% [%date%] %emitter% - %msg%"

Config.logLevelIndex = {
    ['TRACE'] = 0,
    ['DEBUG'] = 1,
    ['INFO']  = 2,
    ['WARN']  = 3,
    ['ERROR'] = 4,
    ['FATAL'] = 5,
}

Config.logLevelColor = {
    ['TRACE'] = '^9',
    ['DEBUG'] = '^6',
    ['INFO']  = '^7',
    ['WARN']  = '^3',
    ['ERROR'] = '^1',
    ['FATAL'] = '^8',
}
