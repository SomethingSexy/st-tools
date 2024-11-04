import { type Chronicle } from '../../../entity/chronicle'
import { EmbedBuilder } from 'discord.js'

export const chronicleMessage = (chronicle: Chronicle) => {
  return {
    embeds: [
      new EmbedBuilder()
        .setColor(3447003)
        .setTitle(chronicle.name)
        .addFields(
          { name: 'Game', value: chronicle.game, inline: true },
          { name: 'Version', value: chronicle.version, inline: true },
          { name: '\u200B', value: '\u200B', inline: true }
        )
        .addFields({
          name: 'Description',
          value: chronicle.description,
        })
        .setTimestamp(),
    ],
  }
}
