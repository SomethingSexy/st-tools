import { attemptP, chain, map } from 'fluture';
import { eitherToFuture } from '../../../utils/sanctuary.js';
import { CREATED_AT, MODIFIED_AT, TABLE_ID } from '../../constants.js';
const CHARACTER_TABLE_NAME = 'name';
const CHARACTER_TABLE_SPLAT = 'splat';
const CHARACTER_TABLE = 'character';
export const CHARACTER_TABLE_ID = TABLE_ID;
const retrievedToEntity = (chronicle)=>({
        id: chronicle[0].id,
        name: chronicle[0].name,
        chronicleId: chronicle[0].chronicleId,
        concept: chronicle[0].concept,
        ambition: chronicle[0].ambition,
        desire: chronicle[0].desire,
        splat: chronicle[0].splat,
        created: chronicle[0].created_at,
        modified: chronicle[0].updated_at,
        // TODO: merge/apply defaults
        characteristics: {
        },
        stats: {
            health: 0
        },
        attributes: {
        },
        skills: {
        }
    })
;
// TODO: Long term this is probably not a good idea, having to do this for every single request.
export const createTable = (db)=>(data)=>attemptP(()=>{
            return db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(async ()=>{
                const exists = await db.schema.hasTable(CHARACTER_TABLE);
                if (!exists) {
                    await db.schema.createTable(CHARACTER_TABLE, (table)=>{
                        table.uuid(CHARACTER_TABLE_ID).defaultTo(db.raw('uuid_generate_v4()'));
                        table.foreign('chronicle_id').references('Chronicle.chronicle_id');
                        table.string('name');
                        table.text('concept');
                        table.text('ambition');
                        table.text('desire');
                        table.string('splat');
                        // This will hold all splat specific data
                        table.jsonb('characteristics');
                        table.jsonb('attributes');
                        table.jsonb('skills');
                        table.jsonb('stats');
                        table.timestamps();
                    });
                }
                return data;
            });
        })
;
const insertAndReturnCharacter = (db)=>(c)=>{
        return attemptP(()=>{
            const now = db.fn.now();
            return db(CHARACTER_TABLE).insert({
                [CHARACTER_TABLE_NAME]: c.name,
                [CHARACTER_TABLE_SPLAT]: c.splat,
                [CREATED_AT]: now,
                [MODIFIED_AT]: now
            }).returning([
                CHARACTER_TABLE_ID,
                CHARACTER_TABLE_NAME,
                CHARACTER_TABLE_SPLAT,
                CREATED_AT,
                MODIFIED_AT
            ]);
        });
    }
;
export const createCharacter = (db)=>(c)=>eitherToFuture(c).pipe(chain(createTable(db))).pipe(chain(insertAndReturnCharacter(db))).pipe(map(retrievedToEntity))
;
export const characterGateway = (db)=>({
    })
;
