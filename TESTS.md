# Check procedure when developing a module

As the code grows and changes, side effects might happen. To prevent this, here's a list of things to check depending on what you're modifying:

- Benny's:
  - Should be able to make modification on a vehicle
  - Must not be able to apply armoring or weapons on a vehicle
  - Must be able to see the vehicle condition with the tablet.

- Vehicle:
  - Should sync a vehicle condition with everyone.

- Dealership:
  - Can see the list of vehicles in each citizen dealership.
  - Can preview the model in each citizen dealership.
  - Must not remove a player's vehicle parked on the preview spot and instead alert it.
  - Can remove a NPC vehicle on the preview spot.
  - Can see the list of vehicles in the business dealership.
  - Can buy a vehicle from the citizen and business dealership.
  - Can spawn a vehicle after buying it in the business dealership

- Fuel:
  - Can retrieve and set the fuel usage of a vehicle
  - Must consumes fuel when the vehicle engine's on.
  - Can refill at the gasoil station
  - Can be refilled from an MTP's tank

- Garage:
  - Can see the list of vehicles parked in a public, private and housing garage.
  - Can take out a vehicle
  - The vehicle must apply the saved modification from the Benny's and LS Custom
  - The vehicle must persist the modification that has been applied onto it (aesthetics, engine, fuel, etc.).
  - Can park a vehicle inside a public, private and housing garage.
  - Must pay a parking fee when taking out a vehicle from a private garage.
  - Should check if a spot is available when taking out a vehicle.

- Impound:
  - When rebooting the server with the command `/reboot`, any vehicles that have been in the wild should be put inside an impound and lose a life.
  - When the vehicle has no more life, the vehicle is sent to the void.
  - A destroyed vehicle should be sent to the void directly and not into an impound.
