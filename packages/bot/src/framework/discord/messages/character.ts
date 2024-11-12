import { type Character } from '../../../entity/character.js'
import { EmbedBuilder } from 'discord.js'
import { compose } from '../../../utils/function.js'
import { joinNewline } from '../../../utils/array.js'
import { prependNewline } from '../../../utils/string.js'

/**
 * Translates a character to an embed.
 *
 * @param character
 * @returns
 */
export const characterMessage = (character: Character) => {
  return {
    embeds: [
      new EmbedBuilder()
        .setColor(3447003)
        .setTitle(character.name)
        // .addFields(
        //   { name: 'Game', value: chronicle.game, inline: true },
        //   { name: 'Version', value: chronicle.version, inline: true },
        //   { name: '\u200B', value: '\u200B', inline: true }
        // )
        // .addFields({
        //   name: 'Description',
        //   value: chronicle.description,
        // })
        .setTimestamp(),
    ],
  }
}

/**
 * Translates a list of characters to a string message whose contains are MD.
 *
 * @param characters
 * @returns
 */
export const charactersMessage = (characters: Character[]): string =>
  characters.length ? characterRows(characters) : NO_CHARACTERS

const NO_CHARACTERS = 'No characters were found.'

const characterRow = (character: Character): string =>
  `* ${character.name} - ${character.id}`

const characterRows = compose(
  prependNewline,
  joinNewline,
  (results: Character[]) => results.map(characterRow)
)
