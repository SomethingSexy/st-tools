// TODO: This will eventually come from a database
export const config = {
    // Should we have additional character types here?
    // vampire, mortal, thin-blood? or is thin-blood just a another clan with special rules
    // within that character type we would have different races (which would be clans here)
    character: {
        attributes: {
            min: 0,
            max: 5,
            categories: [
                {
                }
            ],
            available: [
                {
                    name: '',
                    description: ''
                }
            ]
        },
        skills: {
            min: 0,
            max: 5,
            // These would be how you would organize all skills
            categories: [
                {
                }
            ],
            available: [
                {
                    name: '',
                    description: '',
                    specialty: ''
                }
            ]
        },
        // disciplines
        // these will get broken down into categories
        powers: {
        },
        characteristics: {
        },
        // These would be consider clans
        races: [
            {
                name: 'Ventrue',
                description: '',
                allowedSkills: [
                    {
                        category: ''
                    }
                ]
            }
        ]
    }
};
