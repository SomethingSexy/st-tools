# Bot
A service that acts as a bot, interfacing with different applications.  Currently only supports discord.

This could turn into a discord specific bot or it could turn into a discord-game specific bot if that will make things
easier for the end user.  We could have vtm vs dnd bots.

## mjs format
* Files need to include .js extensions to work with Node mjs modules.
* Some third party libraries don't support mjs yet, for these cases we will need to import default

## notes
For cases where we might allow the user to do a search against terms and present options they can select from, we could use
reactions for them to pick the one 
https://stackoverflow.com/questions/62291369/how-can-i-make-discord-bot-detect-emoji-reaction-and-clicktrigger-it