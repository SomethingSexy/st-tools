import { services as chronicleServices } from './chronicle.js';
import { services as characterServices } from './character.js';

export const services = [...chronicleServices, ...characterServices];
