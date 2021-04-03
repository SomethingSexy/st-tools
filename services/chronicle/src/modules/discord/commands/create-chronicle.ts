import { ChronicleGateway } from '../../../gateways/chronicle/types';
import { createChronicle } from '../../../use-cases/create-chronicle';
import { ICommand } from '../types';

/**
 * Handles creating a chronicle (game).  This game is tied to the discord server id.
 */
export default {
  name: 'create-chronicle',
  description: 'Creates a game.',
  execute(message, args: [string, 'vtm', 'v5'], chronicleGateway: ChronicleGateway) {
    // TODO: We need to execute this!
    createChronicle(chronicleGateway)({
      name: args[0],
      referenceId: message.guild.id,
      referenceType: 'discord',
      game: args[1],
      version: args[2]
    })
    return {
      embed: {
        color: 3447003,
        author: {
          name: message.author.username
          // icon_url: client.user.avatarURL
        },
        title: 'Character: Bob - Ravnos',
        url: 'http://google.com',
        // description: 'This is a test embed to showcase what they look like and what they can do.',
        fields: [
          {
            name: 'Concept',
            value: 'Nomad biker, always on the move'
          },
          {
            name: 'Ambition',
            value: 'Fight the local Cammies.'
          },
          {
            name: 'Predator',
            value: 'Foo',
            inline: true
          },
          {
            name: 'Sire',
            value: 'Bob',
            inline: true
          },
          {
            name: 'Generation',
            value: '11',
            inline: true
          },
          {
            name: 'Generation',
            value: '11',
            inline: true
          },
          {
            name: 'Attributes',
            inline: false,
            value: '\u200b'
          },
          {
            name: 'Physical',
            inline: true,
            value: '`Strength 1`\n`Dexterity 2`\n`Stamina 3`'
          },
          {
            name: 'Social',
            inline: true,
            value: '`Charisma 1`\n`Manipulation 2`\n`Composure 3`'
          },
          {
            name: 'Mental',
            inline: true,
            value: '`Intelligence 1`\n`Witts 2`\n`Resolve 3`'
          }
        ],
        timestamp: new Date(),
        footer: {
          // icon_url: client.user.avatarURL,
          // text: '© Example'
        }
      }
    };
  }
} as ICommand;
