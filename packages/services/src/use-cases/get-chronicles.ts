// This will need to be able to retrieve a chronicle by an external id or internal id
import { chain, reject } from 'fluture';
import type { ChronicleGateway } from '../gateways/chronicle/types';

// TODO: This should handle filtering, sorting, paging, etc
export const getChronicles = (gateway: ChronicleGateway) => () => gateway.list();
