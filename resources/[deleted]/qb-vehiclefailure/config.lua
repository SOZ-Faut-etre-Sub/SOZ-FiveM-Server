BackEngineVehicles = {
    ["ninef"] = true,
    ["adder"] = true,
    ["vagner"] = true,
    ["t20"] = true,
    ["infernus"] = true,
    ["zentorno"] = true,
    ["reaper"] = true,
    ["comet2"] = true,
    ["jester"] = true,
    ["jester2"] = true,
    ["cheetah"] = true,
    ["cheetah2"] = true,
    ["prototipo"] = true,
    ["turismor"] = true,
    ["pfister811"] = true,
    ["ardent"] = true,
    ["nero"] = true,
    ["nero2"] = true,
    ["tempesta"] = true,
    ["vacca"] = true,
    ["bullet"] = true,
    ["osiris"] = true,
    ["entityxf"] = true,
    ["turismo2"] = true,
    ["fmj"] = true,
    ["re7b"] = true,
    ["tyrus"] = true,
    ["italigtb"] = true,
    ["penetrator"] = true,
    ["monroe"] = true,
    ["ninef2"] = true,
    ["stingergt"] = true,
    ["surfer"] = true,
    ["surfer2"] = true,
    ["comet3"] = true,
}

cfg = {

	deformationMultiplier = -1,					-- How much should the vehicle visually deform from a collision. Range 0.0 to 10.0 Where 0.0 is no deformation and 10.0 is 10x deformation. -1 = Don't touch
	deformationExponent = 1.0,					-- How much should the handling file deformation setting be compressed toward 1.0. (Make cars more similar). A value of 1=no change. Lower values will compress more, values above 1 it will expand. Dont set to zero or negative.
	collisionDamageExponent = 1.0,				-- How much should the handling file deformation setting be compressed toward 1.0. (Make cars more similar). A value of 1=no change. Lower values will compress more, values above 1 it will expand. Dont set to zero or negative.

	damageFactorEngine = 1.0,					-- Sane values are 1 to 100. Higher values means more damage to vehicle. A good starting point is 10
	damageFactorBody = 6.0,						-- Sane values are 1 to 100. Higher values means more damage to vehicle. A good starting point is 10
	damageFactorPetrolTank = 60.0,				-- Sane values are 1 to 100. Higher values means more damage to vehicle. A good starting point is 64
	engineDamageExponent = 1.0,					-- How much should the handling file engine damage setting be compressed toward 1.0. (Make cars more similar). A value of 1=no change. Lower values will compress more, values above 1 it will expand. Dont set to zero or negative.
	weaponsDamageMultiplier = 0.124,			-- How much damage should the vehicle get from weapons fire. Range 0.0 to 10.0, where 0.0 is no damage and 10.0 is 10x damage. -1 = don't touch
	degradingHealthSpeedFactor = 1.0,			-- Speed of slowly degrading health, but not failure. Value of 10 means that it will take about 0.25 second per health point, so degradation from 800 to 305 will take about 2 minutes of clean driving. Higher values means faster degradation
	cascadingFailureSpeedFactor = 2.0,			-- Sane values are 1 to 100. When vehicle health drops below a certain point, cascading failure sets in, and the health drops rapidly until the vehicle dies. Higher values means faster failure. A good starting point is 8

	degradingFailureThreshold = 500.0,			-- Below this value, slow health degradation will set in
	cascadingFailureThreshold = 200.0,			-- Below this value, health cascading failure will set in
	engineSafeGuard = 100.0,					-- Final failure value. Set it too high, and the vehicle won't smoke when disabled. Set too low, and the car will catch fire from a single bullet to the engine. At health 100 a typical car can take 3-4 bullets to the engine before catching fire.

	torqueMultiplierEnabled = true,				-- Decrease engine torge as engine gets more and more damaged

	limpMode = true,							-- If true, the engine never fails completely, so you will always be able to get to a mechanic unless you flip your vehicle and preventVehicleFlip is set to true
	limpModeMultiplier = 0.05,					-- The torque multiplier to use when vehicle is limping. Sane values are 0.05 to 0.25

	preventVehicleFlip = true,					-- If true, you can't turn over an upside down vehicle

	randomTireBurstInterval = 0, -- Number of minutes (statistically, not precisely) to drive above 22 mph before you get a tire puncture. 0=feature is disabled

	classDamageMultiplier = {
		[0] = 	0.8,		--	0: Compacts
				0.8,		--	1: Sedans
				0.8,		--	2: SUVs
				0.76,		--	3: Coupes
				0.8,		--	4: Muscle
				0.76,		--	5: Sports Classics
				0.76,		--	6: Sports
				0.76,		--	7: Super
				0.216,		--	8: Motorcycles
				0.56,		--	9: Off-road
				0.20,		--	10: Industrial
				0.28,		--	11: Utility
				0.68,		--	12: Vans
				0.8,		--	13: Cycles
				0.32,		--	14: Boats
				0.56,		--	15: Helicopters
				0.56,		--	16: Planes
				0.6,		--	17: Service
				0.68,		--	18: Emergency
				0.536,		--	19: Military
				0.344,		--	20: Commercial
				0.8			--	21: Trains
	}
}
