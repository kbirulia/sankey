export const selectedMinskA2 = {
    groups: {
        city: {
            index: 0,
            value: 3442
        },
        seniority_level: {
            index: 1,
            value: 2994
        },
        english_level: {
            index: 2,
            value: 1150
        },
    },
    nodes: [
        {
            id: "city_Minsk",
            name: "Minsk",
            value: 2994,
            group: "city"
        },
        {
            id: "city_Gomel",
            name: "Gomel",
            value: 278,
            group: "city"
        },
        {
            id: "city_Grodno",
            name: "Grodno",
            value: 111,
            group: "city"
        },
        {
            id: "city_Brest",
            name: "Brest",
            value: 59,
            group: "city"
        },
        {
            id: "seniority_level_A1",
            name: "A1",
            value: 355,
            group: "seniority_level"
        },
        {
            id: "seniority_level_A2",
            name: "A2",
            value: 1150,
            group: "seniority_level"
        },
        {
            id: "seniority_level_A3",
            name: "A3",
            value: 913,
            group: "seniority_level"
        },
        {
            id: "seniority_level_A4",
            name: "A4",
            value: 576,
            group: "seniority_level"
        },
        {
            id: "english_level_B1",
            name: "B1",
            value: 657,
            group: "english_level"
        },
        {
            id: "english_level_B2",
            name: "B2",
            value: 387,
            group: "english_level"
        },
        {
            id: "english_level_C1",
            name: "C1",
            value: 92,
            group: "english_level"
        },
        {
            id: "english_level_C2",
            name: "C2",
            value: 14,
            group: "english_level"
        }
    ],
    links: [
        {source: "city_Minsk", target: "seniority_level_A2", value: 1150},

        {source: "seniority_level_A2", target: "english_level_B1", value: 657},
        {source: "seniority_level_A2", target: "english_level_B2", value: 387},
        {source: "seniority_level_A2", target: "english_level_C1", value: 92},
        {source: "seniority_level_A2", target: "english_level_C2", value: 14},
    ]
};
