import { Chronicle } from '../../../entities/chronicle';

export const chronicleMessage = (chronicle: Chronicle) => {
  return {
    embed: {
      color: 3447003,
      title: chronicle.name,
      fields: [
        {
          name: 'Game',
          value: `${chronicle.game} - ${chronicle.version}`
        },
        {
          name: 'Created',
          // TODO: This should be formatted
          value: `${chronicle.created}`
        }
      ],
      timestamp: new Date()
    }
  };
};
