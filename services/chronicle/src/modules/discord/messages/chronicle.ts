import { Chronicle } from "../../../entities/chronicle";

export const chronicleMessage = (chronicle: Chronicle) => {
  return {
    embed: {
      color: 3447003,
      // author: {
      //   name: message.author.username
      //   // icon_url: client.user.avatarURL
      // },
      title: chronicle.name,
      // description: 'This is a test embed to showcase what they look like and what they can do.',
      fields: [
        {
          name: 'Game',
          value: `${chronicle.game} - ${chronicle.version}`
        },
        {
          name: 'Created',
          value: `${chronicle.created}`
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