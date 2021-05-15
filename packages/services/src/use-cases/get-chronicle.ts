// This will need to be able to retrieve a chronicle by an external id or internal id
import type { ChronicleGateway } from '../gateways/chronicle/types';

export const getChronicle = (gateway: ChronicleGateway) => (id: string) => gateway.getChronicleById(id);
