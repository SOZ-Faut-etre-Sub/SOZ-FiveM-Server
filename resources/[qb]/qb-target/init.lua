function Load(name)
	local resourceName = GetCurrentResourceName()
	local chunk = LoadResourceFile(resourceName, ('data/%s.lua'):format(name))
	if chunk then
		local err
		chunk, err = load(chunk, ('@@%s/data/%s.lua'):format(resourceName, name), 't')
		if err then
			error(('\n^1 %s'):format(err), 0)
		end
		return chunk()
	end
end

-------------------------------------------------------------------------------
-- Settings
-------------------------------------------------------------------------------

Config = {}

-- It's possible to interact with entities through walls so this should be low
Config.MaxDistance = 5.0

-- Enable debug options
Config.Debug = false

-- Supported values: true, false
Config.Standalone = false

-- Enable outlines around the entity you're looking at
Config.EnableOutline = false

-- Enable default options (Toggling vehicle doors)
Config.EnableDefaultOptions = false

-- Disable the target eye whilst being in a vehicle
Config.DisableInVehicle = false

-- Key to open the target
Config.OpenKey = 'LMENU' -- Left Alt
Config.OpenControlKey = 19 -- Control for keypress detection also Left Alt for the eye itself, controls are found here https://docs.fivem.net/docs/game-references/controls/

-- Key to open the menu
Config.MenuControlKey = 238 -- Control for keypress detection on the context menu, this is the Right Mouse Button, controls are found here https://docs.fivem.net/docs/game-references/controls/

-------------------------------------------------------------------------------
-- Target Configs
-------------------------------------------------------------------------------

-- These are all empty for you to fill in, refer to the .md files for help in filling these in

Config.CircleZones = {
}

Config.BoxZones = {
}

Config.PolyZones = {

}

Config.TargetBones = {

}

Config.TargetEntities = {

}

Config.TargetModels = {

}

Config.GlobalPedOptions = {

}

Config.GlobalVehicleOptions = {

}

Config.GlobalObjectOptions = {

}

Config.GlobalPlayerOptions = {

}

Config.Peds = {

}

-------------------------------------------------------------------------------
-- Functions
-------------------------------------------------------------------------------
local function JobCheck() return true end
local function SousMenu() return true end
local function GangCheck() return true end
local function ItemCount() return true end
local function CitizenCheck() return true end
local function RoleCheck() return true end
local function FeatureCheck() return true end
local function GlobalCheck() return true end
local function BlackoutGlobalCheck() return true end
local function BlackoutJobCheck() return true end

CreateThread(function()
	if not Config.Standalone then
		local QBCore = exports['qb-core']:GetCoreObject()
		local SozJobCore = exports["soz-jobs"]:GetCoreObject()
		local PlayerData = QBCore.Functions.GetPlayerData()

		ItemCount = function(item)
			for _, v in pairs(PlayerData.items) do
				if v.name == item then
					return v.amount
				end
			end
			return 0
		end

		JobCheck = function(job, permission)
			if type(job) == 'table' then
				if job[PlayerData.job.id] and tonumber(PlayerData.job.grade) >= job[PlayerData.job.id] then
					return true
				end
			elseif type(job) == 'string' and job == PlayerData.job.id then
				if permission then
					return SozJobCore.Functions.HasPermission(job, permission)
				end

				return true
			end

			return false
		end

		GangCheck = function(gang)
			if type(gang) == 'table' then
				gang = gang[PlayerData.gang.name]
				if PlayerData.gang.grade.level >= gang then
					return true
				end
			elseif gang == 'all' or gang == PlayerData.gang.name then
				return true
			end
			return false
		end

		SousMenu = function(menu)
			if menu == true then
				return true
			end
			return false
		end

		CitizenCheck = function(citizenid)
			return (citizenid == PlayerData.citizenid or citizenid[PlayerData.citizenid])
		end

		RoleCheck = function(role)
			if type(role) == "table" then
				for _, r in pairs(role) do
					if PlayerData.role == r then
						return true
					end
				end

				return false
			end

			return PlayerData.role == role
		end

		FeatureCheck = function(feature)
			local features = PlayerData.features or {}

			if PlayerData.role == "admin" then
				return true
			end

			for _, playerFeature in pairs(features) do
				if feature == playerFeature then
					return true
				end
			end

			return false
		end

		GlobalCheck = function()
			if PlayerData.metadata["isdead"] or PlayerData.metadata["inlaststand"] or PlayerData.metadata["ishandcuffed"] then
				return false
			end

			if exports["soz-phone"]:isPhoneVisible() then
				return false
			end

			return true
		end

		BlackoutGlobalCheck = function()
			if GlobalState.blackout_level > 3 then
				return false
			end

			return true
		end

		BlackoutJobCheck = function()
			local jobEnergy = GlobalState.job_energy[PlayerData.job.id] or 100;

			if jobEnergy <= 1 then
				return false
			end

			return true
		end

		RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
			PlayerData = QBCore.Functions.GetPlayerData()
			SpawnPeds()
		end)

		RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
			PlayerData = {}
		end)

		RegisterNetEvent('QBCore:Client:OnJobUpdate', function(JobInfo)
			PlayerData.job = JobInfo
		end)

		RegisterNetEvent('QBCore:Client:OnGangUpdate', function(GangInfo)
			PlayerData.gang = GangInfo
		end)

		RegisterNetEvent('QBCore:Player:SetPlayerData', function(val)
			PlayerData = val
		end)
	else
		local firstSpawn = false
		AddEventHandler('playerSpawned', function()
			if not firstSpawn then
				SpawnPeds()
				firstSpawn = true
			end
		end)
	end
end)

function CheckOptions(data, entity, distance)
	if not GlobalCheck() then return false end
	if distance and data.distance and distance > data.distance then return false end
	if data.job and not JobCheck(data.job) then return false end
	if not data.allowVehicle and IsPedInAnyVehicle(PlayerPedId(), false) then return false end
	if data.menu and SousMenu(data.menu) then return false end
	if data.gang and not GangCheck(data.gang) then return false end
	if data.item and ItemCount(data.item) < 1 then return false end
	if data.citizenid and not CitizenCheck(data.citizenid) then return false end
	if data.role and not RoleCheck(data.role) then return false end
	if data.feature and not FeatureCheck(data.feature) then return false end
	if data.blackoutGlobal and not BlackoutGlobalCheck() then return false end
	if data.blackoutJob and not BlackoutJobCheck() then return false end
	if data.canInteract and not data.canInteract(entity, distance, data) then return false end
	return true
end