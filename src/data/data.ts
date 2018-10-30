export const details = {
    "city_Minsk": {
        name: "Minsk",
        value: 2994
    },
    "city_Gomel": {
        name: "Gomel",
        value: 278
    },
    "city_Grodno": {
        name: "Grodno",
        value: 111
    },
    "city_Brest": {
        name: "Brest",
        value: 59
    },

    "seniority_level_A1": {
        name: "A1",
        value: 410
    },
    "seniority_level_A2": {
        name: "A2",
        value: 1337
    },
    "seniority_level_A3": {
        name: "A3",
        value: 1059
    },
    "seniority_level_A4": {
        name: "A4",
        value: 636
    },

    "english_level_B1": {
            name: "B1",
            value: 1754
    },
    "english_level_B2": {
        name: "B2",
        value: 1302
    },
    "english_level_C1": {
        name: "C1",
        value: 337
    },
    "english_level_C2": {
        name: "C2",
        value: 49
    },
}

export const data = {
        nodes: [
            { id: "city_Minsk" },
            { id: "city_Gomel" },
            { id: "city_Grodno" },
            { id: "city_Brest" },

            { id: "seniority_level_A1" },
            { id: "seniority_level_A2" },
            { id: "seniority_level_A3" },
            { id: "seniority_level_A4" },

            { id: "english_level_B1" },
            { id: "english_level_B2" },
            { id: "english_level_C1" },
            { id: "english_level_C2" },

        ],
    links: [
        { source: "city_Minsk", target: "seniority_level_A1", value: 355 },
        { source: "city_Minsk", target: "seniority_level_A2", value: 1150 },
        { source: "city_Minsk", target: "seniority_level_A3", value: 913 },
        { source: "city_Minsk", target: "seniority_level_A4", value: 576 },

        { source: "city_Gomel", target: "seniority_level_A1", value: 35 },
        { source: "city_Gomel", target: "seniority_level_A2", value: 114 },
        { source: "city_Gomel", target: "seniority_level_A3", value: 93 },
        { source: "city_Gomel", target: "seniority_level_A4", value: 36 },

        { source: "city_Grodno", target: "seniority_level_A1", value: 12 },
        { source: "city_Grodno", target: "seniority_level_A2", value: 50 },
        { source: "city_Grodno", target: "seniority_level_A3", value: 33 },
        { source: "city_Grodno", target: "seniority_level_A4", value: 16 },

        { source: "city_Brest", target: "seniority_level_A1", value: 8 },
        { source: "city_Brest", target: "seniority_level_A2", value: 23 },
        { source: "city_Brest", target: "seniority_level_A3", value: 20 },
        { source: "city_Brest", target: "seniority_level_A4", value: 8 },

        { source: "seniority_level_A1", target: "english_level_B1", value: 248 },
        { source: "seniority_level_A1", target: "english_level_B2", value: 103 },
        { source: "seniority_level_A1", target: "english_level_C1", value: 46 },
        { source: "seniority_level_A1", target: "english_level_C2", value: 13 },

        { source: "seniority_level_A2", target: "english_level_B1", value: 765 },
        { source: "seniority_level_A2", target: "english_level_B2", value: 450 },
        { source: "seniority_level_A2", target: "english_level_C1", value: 105 },
        { source: "seniority_level_A2", target: "english_level_C2", value: 17 },

        { source: "seniority_level_A3", target: "english_level_B1", value: 515 },
        { source: "seniority_level_A3", target: "english_level_B2", value: 421 },
        { source: "seniority_level_A3", target: "english_level_C1", value: 113 },
        { source: "seniority_level_A3", target: "english_level_C2", value: 10 },

        { source: "seniority_level_A4", target: "english_level_B1", value: 226 },
        { source: "seniority_level_A4", target: "english_level_B2", value: 328 },
        { source: "seniority_level_A4", target: "english_level_C1", value: 73 },
        { source: "seniority_level_A4", target: "english_level_C2", value: 9 },
    ]
};
