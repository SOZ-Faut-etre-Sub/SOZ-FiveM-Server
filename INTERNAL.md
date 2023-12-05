# Internal or How does this server works?

This server use the [FiveM](https://fivem.net/) framework to run a gta roleplay server.
The server is using a lot of resources, some of them are written by us, some of them are written by the community.

## Actual plan

We started this server by using `qb-core` as a base for our modules and resources. But over time we were not happy with the way the server was working and
we decided to start our new features with a base of our own into the `soz-core` resource.

Any new feature that we want to add to the server will be added to the `soz-core` resource, and we are slowly moving all other resources and features into this one.

Only bug fixes and **very small features** will be added to the other resources.

## Directory structure

In the long term everything will be in the `soz-core` or `soz-phone` resource (except for maps, vehicles or others graphics assets), but for now we have a lot of resources that are not part of the `soz-core` resource:

 * `lib/` contains the code that is used to develop and compile some resources for the server, it only contains the `menuv` library and will be removed in the future
 * `resources/` contains all the resources that are used by the server
   * `[clothes]` contains all the modules with custom clothes, those modules are only used if you own a valid license for FiveM
   * `[default]` contains the default modules of FiveM, like the `chat` module or the `mapmanager` module
   * `[lib]` contains the libraries that are used by the server, like the `oxmysql` library, those resources will be removed in the future
   * `[mapping]` contains specific mapping for this server
   * `[props]` contains specific objects / props for this server
   * `[qb]` qb-core resources, those resources will be removed in the future
   * `[soz]` contains the resources developed by our team and used by the server
   * `[vanilla]` when only using modules inside this folder: allow to run the server without any custom resources, it's only used for testing purpose
   * `[vehicles]` contains specific vehicles for this server
   * `[weapons]` contains specific weapon configuration and sound for this server

## Linting

### Typescript (or javascript)

We are using [ESLint](https://eslint.org/) to lint our code, you can run the linter with the following command:

### Lua

We are using [LuaFormatter](https://github.com/Koihik/LuaFormatter) to lint the Lua code.

