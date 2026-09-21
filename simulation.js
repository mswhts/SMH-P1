let simulation = {
    day: 1,
    hour: 0,
    running: false,
    speed: 1,
    timer: null,
    season: "autumn",
    seasons: {
        autumn: {
            name: "Autumn",
            startDay: 1,
            temperatureMin: 10,
            temperatureMax: 24,
            rainfallMin: 0,
            rainfallMax: 8,
            sunlightMin: 6,
            sunlightMax: 10,
            humidityMin: 50,
            humidityMax: 75,
            windMin: 5,
            windMax: 15
        },

        winter: {
            name: "Winter",
            startDay: 15,
            temperatureMin:5,
            temperatureMax: 18,
            rainfallMin: 1,
            rainfallMax: 10,
            sunlightMin: 4,
            sunlightMax: 8,
            humidityMin: 60,
            humidityMax: 85,
            windMin: 8,
            windMax: 20
        },
spring: {
    name: "Spring",
    startDay: 29,
    temperatureMin: 12,
    temperatureMax: 26,
    rainfallMin: 1,
    rainfallMax: 9,
    sunlightMin: 7,
    sunlightMax: 12,
    humidityMin: 50,
    humidityMax: 75,
    windMin: 5,
windMax: 16
},
summer: {
    name: "Summer",
    startDay: 43,
    temperatureMin: 18,
temperatureMax: 18,
rainfallMin: 0,
rainfallMax: 6,
sunlightMin: 9,
sunlightMax: 6,
humidityMin: 35,
humidityMax: 65,
windMin: 4,
windMax: 14

}

    },
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
        plots: [],
        money: 500,
        seeds: {
            wheat: 10,
            corn: 10,
            carrot: 10
        },
        seedCosts: {
            wheat: 5,
            corn: 8,
            carrot: 4,
        },
        cropIncome: {
            wheat: 12,
            corn: 18,
            carrot: 9,
        },
        statistics: {
            planted: 0,
            harvested: 0,
            watered: 0,
            moneyEarned: 0,
            moneyspent: 0,
            actions: 0,
failedActions: 0
        }
    },

    history: {
        time: [],
        weather: [],
        soil: [],
        crops: [],
        harvest: []
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
        updateSeason();
    }
    updateSeasonalWeather();
updateWeather();
updateWeatherEvent();
updateWeatherEventDuration();
updateSoil();
updateCrops();
recordsSimulationHistory();
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

function canPlantCrop(plot, cropType) {
    if (plot.crop != null) {
        return false;
    }
    if (crops[cropType] == null) {
        return false;
    }
    if (simulation.farm.seeds[cropType] <= 0) {
        return false;
    }
    return true;
}
function getCropSeedCost(cropType) {
    if (simulation.farm.seedCosts[cropType] == null) {
        return 0;
    }
    return simulation.farm.seedCosts[cropType];
}
function buySeeds(cropType, amount) {
    if (crops[cropType] == null) {
        return false;
    }

    if (amount <= 0) {
        return false;
    }

    let cost = getCropSeedCost(cropType) * amount;

    if (simulation.farm.money < cost) {
        return false;
    }

    simulation.farm.money -= cost;
    simulation.farm.statistics.moneyspent += cost;
    simulation.farm.seeds[cropType] += amount;

    return true;
}
function plantSelectedCrop(plot, cropType) {
    if (!canPlantCrop(plot, cropType)) {
        return false;
    }
    let cropInfo = crops[cropType];
    plot.crop = {
        type: cropType,
        growth: 0,
        health: cropInfo.health
    };
    simulation.farm.seeds[cropType]--;
    simulation.farm.statistics.planted++;

    return true;
}

function removeCrop(plot) {
    if (plot.crop == null) {
        return false;
    }
    let cropType = plot.crop.type;
    plot.crop = null;
    simulation.farm.seeds[cropType]++;
    return true;
}

function updateCrops() {
    for (let plot of simulation.farm.plots) {

        if (plot.crop != null) {
            let crop = plot.crop;
            let cropInfo = crops[crop.type];

            let growthAmount = 100 / cropInfo.growthTime;
            let environmentalModifier = calculateEnvironmentalGrowthModifier(plot);
            

            if (plot.soil.moisture >= cropInfo.idealMoisture) {
                 growthAmount *= 1;
            } else {
                 growthAmount * 0.5;
            }
growthAmount *= environmentalModifier;

crop.growth += growthAmount;

if (crop.growth > 100) {
    crop.growth = 100;
}

            
            calculateCropHealth(plot);
let weatherHealthModifier = calculateWeatherHealthModifier(plot);

crop.health += weatherHealthModifier;
crop.health += calculateWeatherHealthModifier;

            if (crop.growth > 100) {
                crop.growth = 100;
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
    let incomePerUnit = simulation.farm.cropIncome[cropType];
    let income = yieldAmount * incomePerUnit;
    simulation.farm.money += income;
    simulation.farm.statistics.moneyEarned += income;
    simulation.farm.statistics.harvested++;

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

 function countPlantedCrops() {
    let count = 0;
    for (let plot of simulation.farm.plots) {
        if (plot.crop != null) {
            count++;
        }
    }
    return count;
 }

 function countEmptyPlots() {
    let count = 0;

    for (let plot of simulation.farm.plots) {
        if (plot.crop == null) {
            count++;
        }
    }
    return count;
 }

function countHealthyCrops() {
    let count = 0;
    for (let plot of simulation.farm.plots) {
        if (plot.crop != null && plot.crop.health >= 75) {
            count++;
        }
    }
    return count;
}

function countUnhealthyCrops() {
    let count = 0;
    for (let plot of simulation.farm.plots) {
        if (plot.crop != null && plot.crop.health < 50) {
            count++;
        }
    }
    return count;
}

function getFarmValue() {
    let value = simulation.farm.money;
    for (let cropType in simulation.farm.seeds) {
        let seedAmount = simulation.farm.seeds[cropType];
        let seedCost = simulation.farm.seedCosts[cropType];
        value += seedAmount * seedCost;
    }
    return value;
}

function getPlotStatus(plot) {
    if (plot.crop == null) {
        return "Empty";

    }
    if (plot.crop.health <= 25) {
        return "Critical";
    }
    if (plot.crop.health < 50) {
        return "Unhealthy";
    }
    if (plot.crop.growth >= 100) {
        return "Ready";
    }
    if (plot.crop.growth >= 66) {
        return "mature";
    }
    if (plot.crop.growth >= 33) {
        return "Growing";
    }
    return "Seedling";
}

function getMoistureStatus(plot) {
    let moisture = plot.soil.moisture;
    if (moisture < 20) {
        return "Very Dry"
    }
    if (moisture < 40) {
        return "Dry"
    }
    if (moisture <= 80) {
        return "Good";
    }
    if (moisture <= 100) {
        return "Wet";
    }
    return "waterlogged";
}

function getSoilStatus(plot) {
    let nutrients = plot.soil.nutrients;
    if (nutrients < 20) {
        return "Depleted";
    }
    if (nutrients < 40) {
        return "Low";

    }
    if (nutrients < 70) {
        return "Moderate";
    }
    return "Healthy"
}

function getCropGrowthStage(plot) {
    if (plot.crop == null) {
        return "Empty";

    }
    let growth = plot.crop.growth;
    if (growth < 33) {
        return "Seedling";
    }
    if (growth < 66) {
        return "Growing";
    }
    if (growth < 100) {
        return "mature";
    }
    return "Ready to harvest"

}

function getCropHealthStatus(plot) {
    if (plot.crop == null) {
        return "No crop";
    }
    let health = plot.crop.health;
    if (health >= 90) {
        return "Excellent"
    }
    if (health >= 75) {
        return "Healthy";
    }
    if (health >= 50) {
        return "Fair";
    }
    if (health >= 25) {
        return "poor";
    }
    return "Critical";
}

function waterSelectedPlot(plot) {
    if (plot.crop == null) {
        waterPlot(plot);
        simulation.farm.statistics.watered++;
        return true;
    }
    waterPlot(plot);
    simulation.farm.statistics.watered++;

    return true;
}

function recordFarmAction(success) {
    simulation.farm.statistics.actions++;

    if (!success) {
        simulation.farm.statistics.failedActions++;
    }
}

function getFarmEfficiency() {
    let statistics = simulation.farm.statistics;

    if (statistics.actions == 0) {
        return 100;
    }
    let successfulActions =
    statistics.actions - statistics.failedActions;

    return (successfulActions / statistics.actions) * 100;
}
function getFarmCropCounts() {
    let counts = {
        wheat: 0,
        corn: 0,
        carrot: 0
    };
    for (let plot of simulation.farm.plots) {
        if (plot.crop !=null) {
            counts[plot.crop.type]++;
        }
    }
    return counts;
}
function getAverageFarmHealth() {
    let totalHealth = 0;
    let cropCount = 0;
    for (let plot of simulation.farm.plots) {
        if (plot.crop != null) {
            totalHealth += plot.crop.health;
            cropCount++;
        }
    }
    if (cropCount == 0) {
        return 0;
    }
    return totalHealth / cropCount;
}

function getAverageFarmGrowth() {
    let totalGrowth = 0;
    let cropCount = 0;
    for (let plot of simulation.farm.plots) {
        if (plot.crop != null) {
            totalGrowth += plot.crop.growth;
            cropCount++;
        }
    }
    if (cropCount == 0) {
        return 0;
    }
    return totalGrowth / cropCount;
}

function getFarmMoisture() {
    let totalMoisture = 0;
    for (let plot of simulation.farm.plots) {
        totalMoisture += plot.soil.moisture;
    }
    return totalMoisture / simulation.farm.plots.length;
}

function runSimulationStep() {
    updateTime();
    updateScreen();
}
function startSimulation() {
    if (simulation.running) {
        return;
    }

    simulation.running = true;
    simulation.timer = setInterval(function() {
        runSimulationStep();
    }, 1000 / simulation.speed);
}

function pauseSimulation() {
    simulation.running = false;
    if (simulation.timer != null) {
        clearInterval(simulation.timer);
        simulation.timer = null;
    }
}

function setSimulationSpeed(speed) {
    if (speed <= 0) {
        return;
    }
    simulation.speed = speed;

    if (simulation.running) {
        pauseSimulation();
        startSimulation();
    }
}

function createFarmPlots(){
    simulation.farm.plots = [];

    for (let y = 0; y < simulation.farm.height; y++) {
        for (let x = 0; x < simulation.farm.width; x++) {
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
}

function resetSimulation() {
    pauseSimulation();
    simulation.day = 1;
    simulation.hour = 0;
    simulation.season = "autumn";
    simulation.weatherEvent = "Normal";
    simulation.weatherEventDuration = 0;
    simulation.weather.temperature = 20;
    simulation.weather.rainfall = 0;
    simulation.weather.humidity = 60;
    simulation.weather.sunlight = 8;
    simulation.weather.wind = 10;
    simulation.weather.normalTemperature = 20;
simulation.weather.normalRainfall = 0;
simulation.weather.normalWind = 10;

simulation.harvest.totalCrops = 0;
simulation.harvest.totalYield = 0;
simulation.harvest.wheat = 0;
simulation.harvest.corn = 0;
simulation.harvest.carrot = 0;

simulation.farm.money = 500;
simulation.farm.seeds.wheat = 10;
simulation.farm.seeds.corn = 10;
simulation.farm.seeds.carrot = 10;

simulation.farm.statistics.planted = 0;
simulation.farm.statistics.harvested = 0;
simulation.farm.statistics.watered = 0;
simulation.farm.statistics.moneyEarned = 0;
simulation.farm.statistics.moneySpent = 0;
simulation.farm.statistics.actions = 0;
simulation.farm.statistics.failedActions = 0;

simulation.history.time = [];
simulation.history.weather = [];
simulation.history.soil = [];
simulation.history.crops = [];
simulation.history.harvest = [];

createFarmPlots();
lastHarvest = "";
updateScreen();

}

function getCurrentSeason() {
    if (simulation.day >= 43) {
        return "Summer";
    }
if (simulation.day >= 29) {
    return "Spring";
}
if (simulation.day >= 15) {
    return "Winter";
}
return "autumn";

}

function updateSeason() {
    simulation.season = getCurrentSeason();
}
function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function updateSeasonalWeather() {
    let season = simulation.seasons[simulation.season];

simulation.weather.temperature = randomBetween(season.temperatureMin, season.temperatureMax);
simulation.weather.rainfall = randomBetween(season.rainfallMin, season.rainfallMax);
simulation.weather.sunlight = randomBetween(season.sunlightMin, season.sunlightMax);
simulation.weather.humidity = randomBetween(season.humidityMin, season.humidityMax);
simulation.weather.wind = randomBetween(season.windMin, season.windMax);

}

function calculateEnvironmentalGrowthModifier(plot) {
    let cropInfo = crops[plot.crop.type];
    let temperature = simulation.weather.temperature;
    let humidity = simulation.weather.humidity;
    let sunlight = simulation.weather.sunlight;

    let modifier = 1;
    if (
        temperature < cropInfo.idealTemperature.min || temperature > cropInfo.idealTemperature.max
    )
     {
        modifier *= 0.7;
     }
     if (humidity < 35 || humidity > 85) {
        modifier *=0.8;
     }
if (sunlight < 4) {
    modifier *= 0.7;
} else if (sunlight > 12) {
    modifier *= 0.9;
}
if (simulation.season == "winter") {
    modifier *= 0.85;
}

if (simulation.season == "summer") {
    if (temperature > cropInfo.idealTemperature.max) {
        modifier *= 0.75;
    }
}
return modifier;
}

function calculateWeatherHealthModifier(plot) {
    let cropInfo = crops[plot.crop.type];
    let temperature = simulation.weather.temperature;
    let moisture = plot.soil.moisture;
    let modifier = 0;

    if (
        temperature < cropInfo.idealTemperature.min || temperature > cropInfo.idealTemperature.max
    ) {
        modifier -= 1;
    }
    if (moisture < cropInfo.idealMoisture - 25) {
        modifier -= 1;
    }
    if (moisture > cropInfo.idealMoisture + 30) {
        modifier -= 1;
    }
    if (simulation.weather.humidity > 90) {
        modifier -= 1;
    }
    if (simulation.weather.wind > 18) {
        modifier -= 1;
    }
    return modifier;
}
