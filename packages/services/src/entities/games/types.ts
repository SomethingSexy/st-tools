// This would be a character skill
export interface GameSkill {
  min: number;
  max: number;
  name: string;
  description?: string;
  specialty?: string;
  category: string;
}

// This would be direct attributes of a character, like dexterity, stamina, intelligence, etc.
export interface GameAttribute {
  min: number;
  max: number;
  name: string;
  description?: string;
  category: string;
}

export interface GamePower {
  // What is required to use this power
  cost?: string;
  // This might be an object of attributes or skills that are combined
  dice: string;
  name: string;
  // This would be a high level blurb about the power
  description: string;
  // This would be a description of how the ability works
  // this could be combined with outcome or renamed
  ability: string;
  process?: string;
  outcome: string;
  ingredients?: string;
  // This could come from a list of possible durations set at the game level
  duration: string;
  category: string;
}

// TODO: Need to determine the rules for how to filter down skills, attributes, and powers
// while taking into account classes.
export interface GameRace {
  name: string;
  description: string;
  allowedClasses: [];
  allowedSkills: [
    {
      // allow a category of skills
      category?: string;
      skill?: string;
      // or it could be by skill itself
    }
  ];
  allowedAttributes: [
    {
      category?: string;
      attribute?: string;
    }
  ];
  allowedPowers: [
    {
      // Can they add this upon character creation
      allowedOnCreation: boolean;
      // Can this specific race get this power later?
      earned: boolean;
      category?: string;
      power?: string;
    }
  ];
}

export type Races = GameRace[];

// This would be class in d&d or a clan in vtm, probably include thin-blood as a class
export interface GameClass {
  allowedSkills: [
    {
      // allow a category of skills
      category?: string;
      // or it could be by skill itself
      skill?: string;
    }
  ];
  allowedAttributes: [
    {
      category?: string;
      attribute?: string;
    }
  ];
  allowedPowers: [
    {
      // Can they add this upon character creation
      allowedOnCreation: boolean;
      // Can this specific race get this power later?
      earned: boolean;
      category?: string;
      power?: string;
    }
  ];
}

export type Classes = GameClass[];

export interface GameCharacter {
  attributes: [Record<string, string>];
  skills: [Record<string, string>];
}
