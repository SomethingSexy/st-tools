import { REST, Routes } from 'discord.js'
import { commands } from './configurations.js'

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env

const rest = new REST().setToken(DISCORD_TOKEN)

const slashCommands = commands.map((command) => command.command.toJSON())

;(async () => {
  try {
    console.log(`Started refreshing ${commands.size} application (/) commands.`)

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = (await rest.put(
      Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
      { body: slashCommands }
    )) as Array<unknown>

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    )
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error)
  }
})()
