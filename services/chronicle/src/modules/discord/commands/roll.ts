/**
 *  This command tests the ability of using other bots to handle things like rolling dice.
 */
export default {
  name: 'roll',
  description: 'Roll Thirst!',
  title: 'Roll',
  execute: () => {
    return '!v 5 2 5';
  }
};
