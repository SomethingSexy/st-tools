import { makeEntity, makeUpdateEntity } from './validator.js';
import Hapi from 'joi';

export interface GameCategory {
  id: string;
  name: string;
  description?: string;
  gameId: string;
  created: string;
  modified: string;
}

export type CreateCategoryEntity = Pick<GameCategory, 'name' | 'description' | 'gameId'>;
export type UpdateCategoryEntity = Partial<GameCategory> & { id: string };

const Validation = Hapi.object({
  name: Hapi.string().required(),
  description: Hapi.string()
});

const UpdateValidation = Hapi.object({
  id: Hapi.string().required(),
  // If name is being changed it needs to have some value
  name: Hapi.string().min(1),
  description: Hapi.string()
});

export const createCategoryEntity = makeEntity(Validation);

export const updateCategoryEntity = makeUpdateEntity(UpdateValidation);
