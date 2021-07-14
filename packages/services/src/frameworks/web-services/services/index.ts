import { services as characterServices } from './character.js';
import { services as chronicleServices } from './chronicle.js';

export const services = [...chronicleServices, ...characterServices];
