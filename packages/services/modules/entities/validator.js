const validator = (schema)=>(payload)=>{
        const { error  } = schema.validate(payload);
        if (error) {
            const message = error.details.map((el)=>el.message
            ).join('\n');
            return {
                error: message
            };
        }
        return true;
    }
;
