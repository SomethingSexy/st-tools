import { attemptP, chain, map } from 'fluture';
import { atLeastOne } from '../../../utils/array.js';
import { eitherToFuture } from '../../../utils/sanctuary.js';
import { CREATED_AT, MODIFIED_AT, TABLE_ID } from '../../constants.js';
const CHRONICLE_TABLE = 'chronicle';
export const CHRONICLE_TABLE_NAME = 'name';
export const CHRONICLE_TABLE_REFERENCE_ID = 'referenceId';
export const CHRONICLE_TABLE_ID = TABLE_ID;
export const CHRONICLE_TABLE_GAME = 'game';
export const CHRONICLE_TABLE_VERSION = 'version';
export const CHRONICLE_TABLE_REFERENCE_TYPE = 'referenceType';
const searchFields = [
    CHRONICLE_TABLE_REFERENCE_ID,
    CHRONICLE_TABLE_ID
];
const retrievedToEntity = (chronicle)=>({
        id: chronicle[0].id,
        referenceId: chronicle[0].referenceId,
        referenceType: chronicle[0].referenceType,
        name: chronicle[0].name,
        game: chronicle[0].game,
        version: chronicle[0].version,
        created: chronicle[0].created_at,
        modified: chronicle[0].updated_at
    })
;
// TODO: Long term this is probably not a good idea, having to do this for every single request.
const createTable = (db)=>(data)=>attemptP(()=>db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(()=>db.schema.hasTable(CHRONICLE_TABLE).then((exists)=>{
                    if (!exists) {
                        return db.schema.createTable(CHRONICLE_TABLE, (table)=>{
                            table.string(CHRONICLE_TABLE_REFERENCE_ID);
                            table.string(CHRONICLE_TABLE_NAME);
                            table.string(CHRONICLE_TABLE_VERSION);
                            table.string(CHRONICLE_TABLE_GAME);
                            table.string(CHRONICLE_TABLE_REFERENCE_TYPE);
                            table.uuid(CHRONICLE_TABLE_ID).defaultTo(db.raw('uuid_generate_v4()'));
                            table.index([
                                CHRONICLE_TABLE_REFERENCE_ID,
                                CHRONICLE_TABLE_ID
                            ]);
                            table.timestamps();
                        }).then(()=>data
                        );
                    }
                    return Promise.resolve(data);
                })
            )
        )
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
/**
 * Creates a new chronicle
 * @param db
 */ export const createChronicle = (db)=>(c)=>eitherToFuture(c).pipe(chain(createTable(db))).pipe(chain(insertAndReturnChronicle(db))).pipe(map(retrievedToEntity))
;
const hasChronicleBy = (f)=>(db)=>(data)=>createTable(db)(data).pipe(chain((x)=>f(db)(x)
            )).pipe(map((x)=>atLeastOne(x)
            ))
;
/**
 * Determines if a chronicle already exists given the type and reference id.
 * @param db
 */ export const hasChronicleByReference = hasChronicleBy(findChronicleByReference);
export const hasChronicleById = hasChronicleBy(findChronicleById);
const getChronicleBy = (by)=>(db)=>(id)=>createTable(db)(id).pipe(chain((id1)=>attemptP(()=>db.select([
                        CHRONICLE_TABLE_ID,
                        CHRONICLE_TABLE_REFERENCE_ID,
                        CHRONICLE_TABLE_REFERENCE_TYPE,
                        CHRONICLE_TABLE_NAME,
                        CHRONICLE_TABLE_GAME,
                        CHRONICLE_TABLE_VERSION,
                        CREATED_AT,
                        MODIFIED_AT
                    ]).from(CHRONICLE_TABLE).where({
                        [by]: id1
                    })
                )
            )).pipe(map(retrievedToEntity))
;
export const getChronicle = getChronicleBy(CHRONICLE_TABLE_REFERENCE_ID);
export const getChronicleById = getChronicleBy(CHRONICLE_TABLE_ID);
/**
 * Complete gateway for accessing chronicle data from a postgres database
 * @param db
 */ export const chronicleGateway = (db)=>{
    return {
        create: createChronicle(db),
        existsByReference: hasChronicleByReference(db),
        existsById: hasChronicleById(db),
        getChronicle: getChronicle(db),
        getChronicleById: getChronicleById(db)
    };
};
