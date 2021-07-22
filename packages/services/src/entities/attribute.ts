import { makeEntity, makeUpdateEntity } from './validator.js';
import Hapi from 'joi';

export interface GameAttribute {
  id: string;
  min: number;
  max: number;
  name: string;
  description: string;
  categoryId: string;
  gameId: string;
  created: string;
  modified: string;
}

export type CreateAttributeEntity = Pick<
  GameAttribute,
  'name' | 'description' | 'gameId' | 'categoryId' | 'min' | 'max'
>;
export type UpdateAttributeEntity = Partial<GameAttribute> & { id: string };

const Validation = Hapi.object({
  name: Hapi.string().required(),
  description: Hapi.string(),
  categoryId: Hapi.string().required(),
  gameId: Hapi.string().required(),
  max: Hapi.number().required(),
  min: Hapi.number().required()
});

const UpdateValidation = Hapi.object({
  id: Hapi.string().required(),
  // If name is being changed it needs to have some value
  name: Hapi.string().min(1),
  description: Hapi.string(),
  max: Hapi.number(),
  min: Hapi.number()
});

export const createAttributeEntity = makeEntity(Validation);

export const updateAttributeEntity = makeUpdateEntity(UpdateValidation);
