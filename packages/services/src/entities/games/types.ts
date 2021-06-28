// This would be a character skill
export interface GameSkill {
  min: number
  max: number
  name: string;
  description?: string
  specialty?: string;
  category: string;
}

// This would be direct attributes of a character, like dexterity, stamina, intelligence, etc.
export interface GameAttribute {
  min: number
  max: number
  name: string;
  description?: string
  category: string;
}

export interface GamePower {
  // What is required to use this power
  cost?: string
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

export interface GameRace {
  name: string;
  description: string;
  allowedSkills: [{
    // allow a category of skills
    category?: string
    skill?: string
    // or it could be by skill itself
  }]
  allowedAttributes: [{
    category?: string;
    attribute?: string;
  }],
  allowedPowers: [{
    // Can they add this upon character creation
    allowedOnCreation: boolean;
    // Can this specific race get this power later?
    earned: boolean
    category?: string;
    power?: string;
  }]
}

export type Races = GameRace[];

/**
 * A character could filter attributes, skills, and powers and the race
 * of a character could further filter those down
 */
export interface GameCharacter {
  // Attributes available for this character type
  attributes: [{

  }],
  // Skills available for this character type
  skills: [{

  }]
}

export interface GameConfig {
  character: GameCharacter[];
  skills: GameSkill[];
  attributes: GameAttribute[]
  races: Races;
  attributeCategories:  Array<{
    name: string
    description: string;
    id: string;
  }>
  skillCategories: Array<{
    name: string;
    description: string;
    id: string;
  }>
}
