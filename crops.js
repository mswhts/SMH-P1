let crops = {
    wheat: {
        name: "wheat",
        stages: ["🌱", "🌿", "🌾"],
        emoji: "🌾",
        growthTime: 48,
        idealMoisture: 60,
        idealTemperature: {
            min: 10,
            max: 25
        },
        health: 100,
        baseYield: 40,
        minimumHarvestGrowth: 100,
        nutrientUse: 2
    },

    corn: {
        name: "corn",
        stages: ["🌱", "🌿", "🌽"],
        emoji: "🌽",
        growthTime: 60,
        idealMoisture: 70,
        idealTemperature: {
            min: 18,
            max: 32
        },
        health: 100,
        baseYield: 60,
        minimumHarvestGrowth: 100,
        nutrientUse: 3
    },

    carrot: {
        name: "carrot",
        stages: ["🌱", "🌿", "🥕"],
        emoji: "🥕",
        growthTime: 36,
        idealMoisture: 65,
        idealTemperature: {
            min: 10,
            max: 24
        },
        health: 100,
        baseYield: 30,
        minimumHarvestGrowth: 100,
        nutrientUse: 1,
    }
};
