export const data = {
    nodes: [
        { id: "Minsk" },
        { id: "Gomel" },
        { id: "Grodno" },
        { id: "Brest" },

        { id: "A1" },
        { id: "A2" },
        { id: "A3" },
        { id: "A4" },

        { id: "B1" },
        { id: "B2" },
        { id: "C1" },
        { id: "C2" },

    ],
    links: [
        { source: "Minsk", target: "A1", value: 355 },
        { source: "Minsk", target: "A2", value: 1150 },
        { source: "Minsk", target: "A3", value: 913 },
        { source: "Minsk", target: "A4", value: 576 },

        { source: "Gomel", target: "A1", value: 35 },
        { source: "Gomel", target: "A2", value: 114 },
        { source: "Gomel", target: "A3", value: 93 },
        { source: "Gomel", target: "A4", value: 36 },

        { source: "Grodno", target: "A1", value: 12 },
        { source: "Grodno", target: "A2", value: 50 },
        { source: "Grodno", target: "A3", value: 33 },
        { source: "Grodno", target: "A4", value: 16 },

        { source: "Brest", target: "A1", value: 8 },
        { source: "Brest", target: "A2", value: 23 },
        { source: "Brest", target: "A3", value: 20 },
        { source: "Brest", target: "A4", value: 8 },

        { source: "A1", target: "B1", value: 248 },
        { source: "A1", target: "B2", value: 103 },
        { source: "A1", target: "C1", value: 46 },
        { source: "A1", target: "C2", value: 13 },

        { source: "A2", target: "B1", value: 765 },
        { source: "A2", target: "B2", value: 450 },
        { source: "A2", target: "C1", value: 105 },
        { source: "A2", target: "C2", value: 17 },

        { source: "A3", target: "B1", value: 515 },
        { source: "A3", target: "B2", value: 421 },
        { source: "A3", target: "C1", value: 113 },
        { source: "A3", target: "C2", value: 10 },

        { source: "A4", target: "B1", value: 226 },
        { source: "A4", target: "B2", value: 328 },
        { source: "A4", target: "C1", value: 73 },
        { source: "A4", target: "C2", value: 9 },
    ]
};
