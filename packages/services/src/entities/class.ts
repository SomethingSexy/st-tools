import Hapi from 'joi';
import { makeEntity, makeUpdateEntity } from './validator.js';

export interface GameClass {
  id: string;
  name: string;
  description: string;
  gameId: string;
  created: string;
  modified: string;
  // allowedSkills: [
  //   {
  //     // allow a category of skills
  //     category?: string;
  //     // or it could be by skill itself
  //     skill?: string;
  //   }
  // ];
  // allowedAttributes: [
  //   {
  //     category?: string;
  //     attribute?: string;
  //   }
  // ];
  // allowedPowers: [
  //   {
  //     // Can they add this upon character creation
  //     allowedOnCreation: boolean;
  //     // Can this specific race get this power later?
  //     earned: boolean;
  //     category?: string;
  //     power?: string;
  //   }
  // ];
}

export type CreateClassEntity = Pick<GameClass, 'name' | 'description' | 'gameId'>;
export type UpdateClassEntity = Partial<GameClass> & { id: string };

// TODO: Might contain classes, powers, skills, and attributes upon creation
const Validation = Hapi.object({
  name: Hapi.string().required(),
  description: Hapi.string().required()
});

const UpdateValidation = Hapi.object({
  id: Hapi.string().required(),
  // If name is being changed it needs to have some value
  name: Hapi.string().min(1),
  description: Hapi.string()
});

export const createClassEntity = makeEntity(Validation);

export const updateClassEntity = makeUpdateEntity(UpdateValidation);
