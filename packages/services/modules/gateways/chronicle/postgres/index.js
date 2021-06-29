import { attemptP, chain, map } from 'fluture';
import { atLeastOne, head, mapAll } from '../../../utils/array.js';
import { eitherToFuture, S } from '../../../utils/sanctuary.js';
import { compose } from '../../../utils/function.js';
import { CREATED_AT, MODIFIED_AT, TABLE_ID } from '../../constants.js';
export const CHRONICLE_TABLE = 'chronicle';
export const CHRONICLE_TABLE_NAME = 'name';
export const CHRONICLE_TABLE_REFERENCE_ID = 'referenceId';
export const CHRONICLE_TABLE_ID = TABLE_ID;
export const CHRONICLE_TABLE_GAME = 'game';
export const CHRONICLE_TABLE_VERSION = 'version';
export const CHRONICLE_TABLE_REFERENCE_TYPE = 'referenceType';
const searchFields = [
    CHRONICLE_TABLE_REFERENCE_ID,
    CHRONICLE_TABLE_ID,
    CHRONICLE_TABLE_REFERENCE_TYPE
];
const mapRetrievedToEntity = (chronicle)=>({
        id: chronicle.id,
        referenceId: chronicle.referenceId,
        referenceType: chronicle.referenceType,
        name: chronicle.name,
        game: chronicle.game,
        version: chronicle.version,
        created: chronicle.created_at,
        modified: chronicle.updated_at
    })
;
const mapAllRetrieved = mapAll(mapRetrievedToEntity);
const retrievedToEntity = compose(mapRetrievedToEntity, head);
export const createTable = (db)=>db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(()=>db.schema.createTable(CHRONICLE_TABLE, (table)=>{
            // Reference ID could be null if a game is created outside of an
            // app like discord
            table.string(CHRONICLE_TABLE_REFERENCE_ID);
            table.string(CHRONICLE_TABLE_NAME);
            table.string(CHRONICLE_TABLE_VERSION).notNullable();
            table.string(CHRONICLE_TABLE_GAME).notNullable();
            table.string(CHRONICLE_TABLE_REFERENCE_TYPE).notNullable();
            table.uuid(CHRONICLE_TABLE_ID).unique().defaultTo(db.raw('uuid_generate_v4()'));
            table.index([
                CHRONICLE_TABLE_REFERENCE_ID,
                CHRONICLE_TABLE_ID
            ]);
            table.timestamps();
        })
    )
;
export const dropTable = (db)=>db.schema.dropTable(CHRONICLE_TABLE)
;
const insertAndReturnChronicle = (db)=>(c)=>attemptP(()=>{
            const now = db.fn.now();
            return db(CHRONICLE_TABLE).insert({
                [CHRONICLE_TABLE_NAME]: c.name,
                [CHRONICLE_TABLE_REFERENCE_ID]: c.referenceId,
                [CHRONICLE_TABLE_VERSION]: c.version,
                [CHRONICLE_TABLE_GAME]: c.game,
                [CHRONICLE_TABLE_REFERENCE_TYPE]: c.referenceType,
                [CREATED_AT]: now,
                [MODIFIED_AT]: now
            }).returning([
                CHRONICLE_TABLE_ID,
                CHRONICLE_TABLE_REFERENCE_ID,
                CHRONICLE_TABLE_REFERENCE_TYPE,
                CHRONICLE_TABLE_NAME,
                CHRONICLE_TABLE_GAME,
                CHRONICLE_TABLE_VERSION,
                CREATED_AT,
                MODIFIED_AT
            ]);
        })
;
const findChronicleByReference = (db)=>({ id , type  })=>attemptP(()=>{
            return db.select(CHRONICLE_TABLE_ID).from(CHRONICLE_TABLE).where({
                [CHRONICLE_TABLE_REFERENCE_ID]: id,
                [CHRONICLE_TABLE_REFERENCE_TYPE]: type
            });
        })
;
const findChronicleById = (db)=>({ id  })=>attemptP(()=>{
            return db.select(CHRONICLE_TABLE_ID).from(CHRONICLE_TABLE).where({
                [CHRONICLE_TABLE_ID]: id
            });
        })
;
const hasChronicleBy = (f)=>(db)=>(data)=>f(db)(data).pipe(map(atLeastOne))
;
/**
 * Search by an array of tuples that represent the value in the data and the database field to search by
 * @param by
 * @returns
 */ const getChronicleBy = (by)=>(db)=>(data)=>attemptP(()=>db.select([
                    CHRONICLE_TABLE_ID,
                    CHRONICLE_TABLE_REFERENCE_ID,
                    CHRONICLE_TABLE_REFERENCE_TYPE,
                    CHRONICLE_TABLE_NAME,
                    CHRONICLE_TABLE_GAME,
                    CHRONICLE_TABLE_VERSION,
                    CREATED_AT,
                    MODIFIED_AT
                ]).from(CHRONICLE_TABLE).where(by.reduce((a, [key, column])=>({
                        ...a,
                        [column]: data[key]
                    })
                , {
                }))
            ).pipe(map(retrievedToEntity))
;
export const listAllChronicles = (db)=>()=>attemptP(()=>db.select([
                CHRONICLE_TABLE_ID,
                CHRONICLE_TABLE_REFERENCE_ID,
                CHRONICLE_TABLE_REFERENCE_TYPE,
                CHRONICLE_TABLE_NAME,
                CHRONICLE_TABLE_GAME,
                CHRONICLE_TABLE_VERSION,
                CREATED_AT,
                MODIFIED_AT
            ]).from(CHRONICLE_TABLE)
        ).pipe(map(mapAllRetrieved))
;
/**
 * Creates a new chronicle
 * @param db
 */ export const createChronicle = (db)=>(c)=>eitherToFuture(c).pipe(chain(insertAndReturnChronicle(db))).pipe(map(retrievedToEntity))
;
/**
 * Determines if a chronicle already exists given the type and reference id.
 * @param db
 */ export const hasChronicleByReference = hasChronicleBy(findChronicleByReference);
export const hasChronicleById = hasChronicleBy(findChronicleById);
export const hasChronicle = (db)=>({ id , type  })=>{
        return !type && !id ? S.Left('Id or type is required to check if a chronicle exists') : type ? hasChronicleByReference(db)({
            id,
            type
        }) : hasChronicleById(db)({
            id
        });
    }
;
export const getChronicleByReference = getChronicleBy([
    [
        'id',
        CHRONICLE_TABLE_REFERENCE_ID
    ],
    [
        'type',
        CHRONICLE_TABLE_REFERENCE_TYPE
    ]
]);
export const getChronicleById = getChronicleBy([
    [
        'id',
        CHRONICLE_TABLE_ID
    ]
]);
export const getChronicle = (db)=>({ id , type  })=>{
        return !type && !id ? S.Left('Id or type is required to get a chronicle') : type ? getChronicleByReference(db)({
            id,
            type
        }) : getChronicleById(db)({
            id
        });
    }
;
/**
 * Complete gateway for accessing chronicle data from a postgres database
 * @param db
 */ export const chronicleGateway = (db)=>{
    return {
        create: createChronicle(db),
        exists: hasChronicle(db),
        existsByReference: hasChronicleByReference(db),
        existsById: hasChronicleById(db),
        getChronicle: getChronicle(db),
        getChronicleById: getChronicleById(db),
        list: listAllChronicles(db)
    };
};
