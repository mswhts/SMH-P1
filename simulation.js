let simulation = {
    day: 1,
    hour: 0,
    season: "autumn",
    harvest: {
        totalCrops: 0,
        totalYield: 0,
        wheat: 0,
        corn: 0,
        carrot: 0
    },
    weatherEvent: "Normal",
    weatherEventDuration: 0,

    weather: {
        temperature: 20,
        rainfall: 0,
humidity: 60,
sunlight: 8,
wind: 10,

normalTemperature: 20,
normalRainfall: 0,
normalWind: 10

    },

    farm: {
        width: 10,
        height: 10,
        plots: []
    }
};

for(let y = 0; y < simulation.farm.height; y++) {
    for (let x = 0; x < simulation.farm.width; x++){
        simulation.farm.plots.push({
            x: x,
            y: y,
            crop: null,

            soil: {
                moisture: 50,
                quality: 80,
                nutrients: 70
            }
        });
    }

}

console.log(simulation);

function updateTime() {
    simulation.hour++;

    if (simulation.hour >= 24) {
        simulation.hour = 0;
        simulation.day++;
    }
updateWeather();
updateWeatherEvent();
updateWeatherEventDuration();
updateSoil();
updateCrops();
}

function plantCrop(plot, cropType) {
    if (plot.crop != null) {
        return;
    }
    
    plot.crop = {
        type: cropType,
        growth: 0,
        health: crops[cropType].health
    };
}

function waterPlot(plot) {
    plot.soil.moisture += 20;

    if(plot.soil.moisture > 100) {
        plot.soil.moisture = 100;
    }
}

function updateCrops() {
    for (let plot of simulation.farm.plots) {

        if (plot.crop != null) {
            let crop = plot.crop;
            let cropInfo = crops[crop.type];

            let growthAmount = 100 / cropInfo.growthTime;

            if (plot.soil.moisture >= cropInfo.idealMoisture) {
                crop.growth += growthAmount;
            } else {
                crop.growth += growthAmount * 0.5;
            }
            calculateCropHealth(plot);

            if (crop.growth > 100) {
                crop.health = 100;
            }
            if (crop.health < 0) {
                crop.health = 0;
            }
        }
    }
}

function updateSoil() {
    for (let plot of simulation.farm.plots) {
        plot.soil.moisture += simulation.weather.rainfall;

        let evaporation = simulation.weather.temperature * 0.05;
        evaporation += simulation.weather.sunlight * 0.1;

        plot.soil.moisture -= evaporation;

        if (plot.soil.moisture < 0) {
            plot.soil.moisture = 0;
        }

        if (plot.soil.moisture > 100) {
            plot.soil.moisture = 100;
        }


    }
}

function calculateCropHealth(plot) {
    let crop = plot.crop;
    let cropInfo = crops[crop.type];

    let temperature = simulation.weather.temperature;
    let moisture = plot.soil.moisture;

    if (moisture < cropInfo.idealMoisture - 20){
        crop.health -= 2;
    }

    if (
        temperature < cropInfo.idealTemperature.min ||
    temperature > cropInfo.idealTemperature.max
) {
        crop.health -= 2;
    }

    if (crop.health < 0) {
        crop.health = 0;
    }

    if (crop.health > 100) {
        crop.health = 100;
    }
}

function canHarvestCrop(plot) {
    if (plot.crop == null) {
        return false;
    }

    let crop = plot.crop;
    let cropInfo = crops[crop.type];

    if (crop.growth < cropInfo.minmumHarvestGrowth) {
        return false;
    }
if (crop.health <= 0) {
    return false;
}
return true;
}

function calculateMoistureYieldModifier(plot) {
    let cropInfo = crops[plot.crop.type];
    let moisture = plot.soil.moisture;
    let ideal = cropInfo.idealMoisture;

    let difference = Math.abs(moisture - ideal);

    if (difference <= 10) {
        return 1;
    }

    if (difference <= 20) {
        return 0.9;
    }

    if (difference <= 30) {
        return 0.75;
    }

    return 0.6;
}

function calculateTemperatureYieldModifier() {
    let temperature = simulation.weather.temperature;
    let bestModifier = 1;

    for (let plot of simulation.farm.plots) {
        
            let cropInfo = crops[plot.crop.type];
            let temperature = simulation.weather.temperature;

              let minimum = cropInfo.idealTemperature.min;
            let maximum = cropInfo.idealTemperature.max;
            
            if (temperature >= minimum && temperature <= maximum) {
                return 1;
            }

            let distance;

            if (temperature < minimum) {
                distance = minimum - temperature;
            } else {
                distance = temperature - maximum;
            }

            if ( distance <= 5) {
                return 0.9;
            }

            if (distance <= 10) {
                return 0.75;
            }
            return 0.6;
            }
        }
    
 function calculateHealthYieldModifier(plot) {
    let health = plot.crop.health;

    if (health >= 90) {
        return 1;
    }

    if (health >=75) {
        return 0.9;
    }

    if (health >= 50) {
        return 0.75;
    }
    if (health >= 25) {
        return 0.5;
    }
    return 0.25;
 }

 function calculateCropYield(plot) {
    if (!canHarvestCrop(plot)) {
        return 0;
    }
    let crop = plot.crop;
    let cropInfo = crops[crop.type];

    let baseYield = cropInfo.baseYield;

    let healthModifier = calculateHealthYieldModifier(plot);
    let MoistureModifier = calculateHealthYieldModifier(plot);
    let temperaturemodifier = calculateTemperatureYieldModifier(plot);
let nutrientModifier = calculateNutrientYieldModifier(plot);

    let yieldAmount = baseYield;
 yieldAmount *= healthModifier;
 yieldAmount *= MoistureModifier;
 yieldAmount *= temperaturemodifier;
 yieldAmount *= nutrientModifier;

 let variation = 0.9 + Math.random() * 0.2;

 yieldAmount *= variation;

 return Math.round(yieldAmount);
 }

function harvestCrop(plot) {
    if (!canHarvestCrop(plot)) {
        return 0;
    }
    let cropType = plot.crop.type;
    let cropInfo = crops[cropType];

    let yieldAmount = calculateCropYield(plot);

    simulation.harvest.totalCrops++;
    simulation.harvest.totalYield += yieldAmount;
    simulation.harvest[cropType] += yieldAmount;

    plot.soil.nutrients -= cropInfo.nutrientUse;

    if (plot.soil.nutrients < 0) {
        plot.soil.nutrients = 0;
    }
    plot.crop = null;
    return yieldAmount;
}

 function calculateNutrientYieldModifier(plot) {
    let nutrients = plot.soil.nutrients;

    if (nutrients >= 70) {
        return 1;
    }

    if (nutrients >= 50) {
        return 0.9;
    }

    if (nutrients >= 30) {
        return 0.75;
    }
return 0.6;
 }
