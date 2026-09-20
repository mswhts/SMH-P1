let selectedCrop = "wheat";
let lastHarvest = "";

function showWeather() {
    let weather = simulation.weather;

    document.getElementById("weather").innerHTML = `
        <p>Day: ${simulation.day}</p>
        <p>Season: ${simulation.seasons[simulation.season].name}</p>
        <p>Hour: ${simulation.hour}</p>
        <p>Temperature: ${weather.temperature.toFixed(1)}°C</p>
        <p>Humidity: ${weather.humidity.toFixed(1)}%</p>
        <p>Rainfall: ${weather.rainfall.toFixed(1)}</p>
        <p>Wind: ${weather.wind.toFixed(1)}</p>
        <p>Weather event: ${simulation.weatherEvent}</p>
    `;
}
function showFarm(){
    let farm = document.getElementById("farm");

    farm.innerHTML ="";

    for (let plot of simulation.farm.plots){
        let plotElement = document.createElement("div");

        plotElement.className = "plot";
        
        if (plot.crop == null) {
            plotElement.textContent = Math.round(plot.soil.moisture);
        } else {
            let cropInfo = crops[plot.crop.type];

           let growth = plot.crop.growth;
let stage;

if (growth < 33) {
    stage = 0;
} else if (growth < 66) {
    stage = 1;
} else {
    stage = 2;
}

plotElement.textContent = cropInfo.stages[stage];

if (growth >= 100) {
    plotElement.textContent = "✨" + cropInfo.stages[2];
    plotElement.title = "Ready to harvest";
}
        }

plotElement.addEventListener("click", function() {
    if (plot.crop == null) {
    let planted = plantSelectedCrop(plot, selectedCrop);

    if (planted) {
        showCropInfo(plot);
    } else {
        lastHarvest = "Not enough seeds to plant this crop.";
    }
} else if (canHarvestCrop(plot)) {
        let cropType = plot.crop.type;
        let yieldAmount = harvestCrop(plot);

        lastHarvest = `Harvested ${yieldAmount} units of ${crops[cropType].name}`;
    } else {
        waterPlot(plot);
        showCropInfo(plot);
    }

    updateScreen();
});

        farm.appendChild(plotElement);

    }
}
function showCropInfo(plot) {
    let info = document.getElementById("cropInfo");

if (lastHarvest !="") {
    info.innerHTMl = `
    <p>${lastHarvest}</p>
    `;
    return;
}

    if (plot.crop == null) {
        info.innerHTML =`
        <p>Empty plot</p>
        <p>Soil moisture: ${Math.round(plot.soil.moisture)}</p>
        <p>Soil quality: ${plot.soil.quality}</p>
        <p>Nutrients: ${plot.soil.nutrients}</p>
        `;

        return;
    }

    let cropInfo = crops[plot.crop.type];
let growthStage = getCropGrowthStage(plot);
let healthStatus = getCropHealthStatus(plot);
let moistureStatus = getMoistureStatus(plot);
let soilStatus = getSoilStatus(plot);

    info.innerHTML = ` <p>Crop: ${cropInfo.name}</p>
        <p>Growth: ${Math.round(plot.crop.growth)}%</p>
        <p>Growth stage: ${growthStage}</p>
        <p>Health: ${Math.round(plot.crop.health)}%</p>
        <p>Health Status: ${healthStatus}</p>
        <p>Soil moisture: ${Math.round(plot.soil.moisture)}</p>
       <p>Moisture status: ${moistureStatus}</p>
       <p>Soil quality: ${plot.soil.quality}</p>
       <p>Nutrients: ${plot.soil.nutrients}</p>
<p>Soil status: ${soilStatus}</p>
        `;
}

function showHarvestStats() {
    let harvest = simulation.harvest;

    document.getElementById("totalCrops").textContent = harvest.totalCrops;
    document.getElementById("totalYield").textContent = harvest.totalYield;
    document.getElementById("wheatYield").textContent = harvest.wheat;
    document.getElementById("cornYield").textContent = harvest.corn;
    document.getElementById("carrotYield").textContent = harvest.carrot;
}

function showFarmManagement() {
    let farm = simulation.farm;
    let statistics = farm.statistics;

    document.getElementById("farmMoney").textContent =
    farm.money;
document.getElementById("plantedCrops").textContent =
countEmptyPlots();

document.getElementById("emptyPlots").textContent =
countEmptyPlots();
document.getElementById("healthyCrops").textContent =
countHealthyCrops();

document.getElementById("unhealthyCrops").textContent =
countUnhealthyCrops();
document.getElementById("farmValue").textContent =
getFarmValue();
document.getElementById("wheatSeeds").textContent =
farm.seeds.wheat;
document.getElementById("cornSeeds").textContent =
farm.seeds.corn;
document.getElementById("carrotSeeds").textContent =
farm.seeds.carrot;
document.getElementById("farmAverageHealth").textContent =
getAverageFarmHealth().toFixed(1);
document.getElementById("farmAverageGrowth").textContent = 
getAverageFarmGrowth().toFixed(1);

document.getElementById("farmAverageMoisture").textContent =
getFarmMoisture().toFixed(1);
document.getElementById("farmEfficiency").textContent =
getFarmEfficiency().toFixed(1);
document.getElementById("wateredPlots").textContent =
farm.statistics.watered;




}


function showAnalytics() {
    let history = simulation.history;

    document.getElementById("recordedHours").textContent = history.time.length; 
if (history.crops.length == 0) {
    document.getElementById("averageMoisture").textContent = "0";
    document.getElementById("averageHealth").textContent = "0";
    document.getElementById("averageGrowth").textContent = "0";
    document.getElementById("growingCrops").textContent = "0";
    document.getElementById("matureCrops").textContent = "0";
return;
}
let latestSoil = history.soil[history.soil.length - 1];

let latestCrops = history.crops[history.crops.length - 1];
document.getElementById("averageMoisture").textContent = latestSoil.averageHealth.toFixed(1);
document.getElementById("averageHealth").textContent =
latestCrops.averageHealth.toFixed(1);
document.getElementById("averageGrowth").textContent =
latestCrops.averageGrowth.toFixed(1);
document.getElementById("growingCrops").textContent =
latestCrops.growingCrops;
document.getElementById("MatureCrops").textContent =
latestCrops.matureCrops;

}

function showSeasonInfo() {
    let season = simulation.seasons[simulation.season];

    document.getElementById("currentSeason").textContent = season.name;
    document.getElementById("seasonTemperature").textContent = season.temperatureMin + "-" + season.temperatureMax;
    document.getElementById("seasonRainfall").textContent = season.rainfallMin.toFixed(1) + "-" +
    season.rainfallMax.toFixed(1);

    document.getElementById("seasonSunlight").textContent = season.sunlightMin.toFixed(1) + "-" +
    season.sunlightMax.toFixed(1);
}


function updateScreen(){
    showWeather();
    showFarm();
    showHarvestStats();
    showAnalytics();
    showSeasonInfo
    showFarmManagement();
}

document.getElementById("wheatButton").addEventListener("click", function() {
    selectedCrop = "wheat";
});

document.getElementById("cornButton").addEventListener("click", function() {
    selectedCrop = "corn";
});

document.getElementById("carrotButton").addEventListener("click", function() {
    selectedCrop = "carrot";
});

document.getElementById("advanceButton").addEventListener("click", function(){
    runSimulationStep();
});

document.getElementById("rainfallInput").addEventListener("input", function() {
    simulation.weather.rainfall = Number(this.value);

    document.getElementById("rainfallValue").textContent = this.value;

    updateScreen();
});

document.getElementById("temperatureInput").addEventListener("input", function() {
    simulation.weather.temperature = Number(this.value);

    document.getElementById("temperatureValue").textContent = this.value;

    updateScreen();
});

document.getElementById("sunlightInput").addEventListener("input", function() {
    simulation.weather.sunlight = number(this.value);

    document.getElementById("sunlightValue").textContent = this.value;
    updateScreen();
});
document.getElementById("buyWheat").addEventListener("click", function()  {
    
    buySeeds("wheat", 5);
    updateScreen();
});
document.getElementById("buyCorn").addEventListener("click", function() {
    buySeeds("corn", 5);
    updateScreen();
});
document.getElementById("buyCarrot").addEventListener("click", function () {
    buySeeds("carrot", 5);
    updateScreen();
});

Document.getElementById("waterALLButton").addEventListener("click", function() {
    let watered = 0;

    for (let plot of simulation.farm.plots) {
        if (plot.crop != null) {
            waterSelectedPlot(plot);
            watered++;
        }
    }

    if (watered > 0) {
        document.getElementById("actionMessage").textContent = `Watered ${watered} crops.`;

    } else {
        document.getElementById("actionMessage").textContent =
        "There are no crops to water"
    }
    updateScreen();
});
document.getElementById("removeCropButton").addEventListener("click", function() {
    document.getElementById("actionMessage").textContent =
    "Select a crop plot first.";
});

document.getElementById("startButton").addEventListener("click", function() {
    startSimulation();
    
    document.getElementById("simulationStatus").textContent = "Running";
    document.getElementById("simulationSpeed").textContent = simulation.speed + "x"; 

});
document.getElementById("pauseButton").addEventListener("click", function() {
    pauseSimulation();
    document.getElementById("simulationStatus").textContent = "Paused";

    document.getElementById("simulationSpeed").textContent = "1x";
});
document.getElementById("speedInput").addEventListener("change", function() {
    let speed = Number(this.value);
    setSimulationSpeed(speed);
    document.getElementById("simulationSpeed").textContent =
    speed + "x";

    if (simulation.running) {
        document.getElementById("simulationStatus").textContent =
        "Running";
    }
    updateScreen();
});


