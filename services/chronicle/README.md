# Chronicle

## mjs format
* Files need to include .js extensions to work with Node mjs modules.
* Some third party libraries don't support mjs yet, for these cases we will need to import default

## TODO
* Need to think about how we are going to store game rules and configuration, probably just json files within the server.  Some format that would allow us to support other versions of games, thinking vtm v5 vs v20.  I guess it depends on how we want to reference this information in the database, is it important that we have links between a skill and something else outside of the character
