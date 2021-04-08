import { map } from 'fluture';
import { ChronicleGateway } from '../../../gateways/chronicle/types';
import { createChronicle } from '../../../use-cases/create-chronicle';
import { chronicleMessage } from '../messages/chronicle';
import { ICommand } from '../types';

/**
 * Handles creating a chronicle (game).  This game is tied to the discord server id.
 */
export default {
  name: 'create-chronicle',
  description: 'Creates a game.',
  execute(message, args: [string, 'vtm', 'v5'], chronicleGateway: ChronicleGateway) {
    // For each command, we will pass on the fluture but pipe here error results or success results
    // then the caller can just return the result
    return createChronicle(chronicleGateway)({
      name: args[0],
      referenceId: message.guild.id,
      referenceType: 'discord',
      game: args[1],
      version: args[2]
    }).pipe(
      map(chronicleMessage)
    )
  }
} as ICommand;
