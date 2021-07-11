import Hapi from 'joi';
import { makeEntity } from './validator.js';

export interface Game {
  id: string;
  name: string;
  version: string;
  created: string;
  modified: string;
  // classes: Classes;
  // skills: GameSkill[];
  // attributes: GameAttribute[];
  // races: Races;
  // attributeCategories: Array<{
  //   name: string;
  //   description: string;
  //   id: string;
  // }>;
  // skillCategories: Array<{
  //   name: string;
  //   description: string;
  //   id: string;
  // }>;
}

export type CreateGameEntity = Pick<Game, 'name' | 'version'>;

export const Validation = Hapi.object({
  name: Hapi.string().required(),
  version: Hapi.string().required()
});

export const createGameEntity = makeEntity(Validation);
