import { resolve } from "fluture";
import type { ICommand } from "../types";

/**
 *  This command tests the ability of using other bots to handle things like rolling dice.
 */
export default {
  name: 'roll',
  description: 'Roll Thirst!',
  title: 'Roll',
  execute: () => {
    return resolve('!v 5 2 5');
  }
} as ICommand;
