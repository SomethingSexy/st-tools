import type { Gateways } from '../gateways';

// TODO: This should handle filtering, sorting, paging, etc
export const getChronicles = ({ chronicleGateway }: Gateways) => () => chronicleGateway.list();
