# Chronicle

## TODO
* Need to think about how we are going to store game rules and configuration, probably just json files within the server.  Some format that would allow us to support other versions of games, thinking vtm v5 vs v20.  I guess it depends on how we want to reference this information in the database, is it important that we have links between a skill and something else outside of the character

// Name, Player will be in the title
// Concept and Ambition can/will go in the bottom in their own fields or at the time

// The main call for a character sheet should bring back the most important stuff first
// Health, Willpower, Hunger, Exp, humanity, resonance, blood potency (some of this can be automatic based on character creation)
// then attributes, skills, powers

// Finally all of the other details can come back, character appearance, age, sire, concept, ambition, all of that nonsense

Need to think about how to handle things that are temporary as well.  That should come back in the main fetch of your character