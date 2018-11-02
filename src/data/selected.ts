export const selectedData = {
    groups: {
        city: {
            index: 0,
            value: 1337
        },
        seniority_level: {
            index: 1,
            value: 3442
        },
        english_level: {
            index: 2,
            value: 1337
        },
    },
    nodes: [
        {
            id: "city_Minsk",
            name: "Minsk",
            value: 1150,
            group: "city"
        },
        {
            id: "city_Gomel",
            name: "Gomel",
            value: 114,
            group: "city"
        },
        {
            id: "city_Grodno",
            name: "Grodno",
            value: 50,
            group: "city"
        },
        {
            id: "city_Brest",
            name: "Brest",
            value: 23,
            group: "city"
        },
        {
            id: "seniority_level_A1",
            name: "A1",
            value: 410,
            group: "seniority_level"
        },
        {
            id: "seniority_level_A2",
            name: "A2",
            value: 1337,
            group: "seniority_level"
        },
        {
            id: "seniority_level_A3",
            name: "A3",
            value: 1059,
            group: "seniority_level"
        },
        {
            id: "seniority_level_A4",
            name: "A4",
            value: 636,
            group: "seniority_level"
        },
        {
            id: "english_level_B1",
            name: "B1",
            value: 765,
            group: "english_level"
        },
        {
            id: "english_level_B2",
            name: "B2",
            value: 450,
            group: "english_level"
        },
        {
            id: "english_level_C1",
            name: "C1",
            value: 105,
            group: "english_level"
        },
        {
            id: "english_level_C2",
            name: "C2",
            value: 17,
            group: "english_level"
        }
    ],
    links: [
        {source: "city_Minsk", target: "seniority_level_A2", value: 1150},

        {source: "city_Gomel", target: "seniority_level_A2", value: 114},

        {source: "city_Grodno", target: "seniority_level_A2", value: 50},

        {source: "city_Brest", target: "seniority_level_A2", value: 23},


        {source: "seniority_level_A2", target: "english_level_B1", value: 765},
        {source: "seniority_level_A2", target: "english_level_B2", value: 450},
        {source: "seniority_level_A2", target: "english_level_C1", value: 105},
        {source: "seniority_level_A2", target: "english_level_C2", value: 17},
    ]
};
