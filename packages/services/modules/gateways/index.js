import { characterGateway } from './character/postgres/index.js';
import { chronicleGateway } from './chronicle/postgres/index.js';
export const gateways = (db)=>({
        chronicleGateway: chronicleGateway(db),
        characterGateway: characterGateway(db)
    })
;
