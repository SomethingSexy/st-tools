import { attemptP, chain, map, reject, resolve } from 'fluture';
import { atLeastOne, head, mapAll } from '../../../utils/array.js';
import { compose } from '../../../utils/function.js';
import { pick } from '../../../utils/object.js';
import { eitherToFuture } from '../../../utils/sanctuary.js';
import { CREATED_AT, MODIFIED_AT, TABLE_ID } from '../../constants.js';
export const CHARACTER_TABLE_NAME = 'name';
export const CHARACTER_TABLE_SPLAT = 'splat';
export const CHARACTER_TABLE = 'character';
export const CHARACTER_CHRONICLE_ID = 'chronicle_id';
export const CHARACTER_TABLE_REFERENCE_ID = 'referenceId';
export const CHARACTER_TABLE_REFERENCE_TYPE = 'referenceType';
export const CHARACTER_TABLE_ID = TABLE_ID;
const updateKeys = pick([
    'name',
    'concept',
    'ambition',
    'desire',
    'splat'
]);
const searchFields = [
    CHARACTER_TABLE_REFERENCE_ID,
    CHARACTER_TABLE_ID
];
const mapRetrievedToEntity = (chronicle)=>chronicle ? {
        id: chronicle.id,
        referenceId: chronicle.referenceId,
        referenceType: chronicle.referenceType,
        name: chronicle.name,
        chronicleId: chronicle[CHARACTER_CHRONICLE_ID],
        concept: chronicle.concept,
        ambition: chronicle.ambition,
        desire: chronicle.desire,
        splat: chronicle.splat,
        created: chronicle.created_at,
        modified: chronicle.updated_at,
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
    } : null
;
const mapAllRetrieved = mapAll(mapRetrievedToEntity);
const retrievedToEntity = compose(mapRetrievedToEntity, head);
export const createTable = (db)=>db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(()=>db.schema.createTable(CHARACTER_TABLE, (table)=>{
            table.uuid(CHARACTER_TABLE_ID).unique().defaultTo(db.raw('uuid_generate_v4()'));
            // Reference ID can be null, the only time we will have an id is for player
            // characters created via apps like discord
            table.string(CHARACTER_TABLE_REFERENCE_ID);
            // Reference Type should never be null
            table.string(CHARACTER_TABLE_REFERENCE_TYPE).notNullable();
            // table.foreign(CHARACTER_CHRONICLE_ID).references('chronicle.id');
            table.uuid(CHARACTER_CHRONICLE_ID).notNullable().references('id').inTable('chronicle').onDelete('CASCADE');
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
        })
    )
;
export const dropTable = (db)=>db.schema.dropTable(CHARACTER_TABLE)
;
const insertAndReturnCharacter = (db)=>(c)=>{
        return attemptP(()=>{
            const now = db.fn.now();
            return db(CHARACTER_TABLE).insert({
                [CHARACTER_TABLE_NAME]: c.name,
                [CHARACTER_TABLE_SPLAT]: c.splat,
                [CHARACTER_TABLE_REFERENCE_TYPE]: c.referenceType,
                [CHARACTER_CHRONICLE_ID]: c.chronicleId,
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
const updateAndReturnCharacter = (db)=>(c)=>{
        return attemptP(()=>{
            // This needs to figure out the exact properties that we are trying to update
            // and make changes to them.  It should only update what is provided.
            const now = db.fn.now();
            return db(CHARACTER_TABLE).where({
                id: c.id
            }).update(updateKeys(c)).returning([
                CHARACTER_TABLE_ID,
                CHARACTER_TABLE_NAME,
                CHARACTER_TABLE_SPLAT,
                CREATED_AT,
                MODIFIED_AT
            ]);
        });
    }
;
const findAllCharacters = (db)=>({ chronicleId  })=>{
        return attemptP(()=>{
            return db(CHARACTER_TABLE).where({
                [CHARACTER_CHRONICLE_ID]: chronicleId
            }).returning([
                CHARACTER_TABLE_ID,
                CHARACTER_TABLE_NAME,
                CHARACTER_TABLE_SPLAT,
                CREATED_AT,
                MODIFIED_AT,
                CHARACTER_CHRONICLE_ID
            ]);
        });
    }
;
const findCharacterById = (db)=>({ id  })=>attemptP(()=>{
            return db.select([
                CHARACTER_TABLE_ID
            ]).from(CHARACTER_TABLE).where({
                [CHARACTER_TABLE_ID]: id
            });
        })
;
const hasCharacterBy = (f)=>(db)=>(data)=>f(db)(data).pipe(map(atLeastOne))
;
const getCharacterBy = (by)=>(db)=>(id)=>attemptP(()=>db.select([
                    CHARACTER_TABLE_ID,
                    CHARACTER_TABLE_REFERENCE_ID,
                    CHARACTER_TABLE_REFERENCE_TYPE,
                    CHARACTER_TABLE_NAME,
                    CHARACTER_TABLE_SPLAT,
                    CREATED_AT,
                    MODIFIED_AT
                ]).from(CHARACTER_TABLE).where({
                    [by]: id
                })
            ).pipe(map(retrievedToEntity)).pipe(chain((x)=>x === null ? reject('Character not found.') : resolve(x)
            ))
;
export const hasChronicleById = hasCharacterBy(findCharacterById);
export const getCharacter = getCharacterBy(CHARACTER_TABLE_REFERENCE_ID);
export const getCharacterById = getCharacterBy(CHARACTER_TABLE_ID);
export const createCharacter = (db)=>(c)=>eitherToFuture(c).pipe(chain(insertAndReturnCharacter(db))).pipe(map(retrievedToEntity))
;
export const updateCharacter = (db)=>(c)=>eitherToFuture(c).pipe(chain(updateAndReturnCharacter(db))).pipe(map(retrievedToEntity))
;
/**
 * Retrieves all characters for a given chronicle.  This can be updated in the future to
 * support filtering, paging, and sorting.
 * @param db
 * @returns
 */ export const getCharacters = (db)=>(data)=>{
        return findAllCharacters(db)(data).pipe(map(mapAllRetrieved));
    }
;
export const characterGateway = (db)=>({
        create: createCharacter(db),
        getCharacterById: getCharacterById(db),
        getCharacters: getCharacters(db),
        update: updateCharacter(db)
    })
;
