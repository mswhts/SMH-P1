let selectedCrop = "wheat";
let lastHarvest = "";

function showWeather() {
    let weather = simulation.weather;

    document.getElementById("weather").innerHTML = `
        <p>Day: ${simulation.day}</p>
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
        plantCrop(plot, selectedCrop);
        showCropInfo(plot);
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

    info.innerHTML = ` <p>Crop: ${cropInfo.name}</p>
        <p>Growth: ${Math.round(plot.crop.growth)}%</p>
        <p>Health: ${Math.round(plot.crop.health)}%</p>
        <p>Soil moisture: ${Math.round(plot.soil.moisture)}</p>
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

function updateScreen(){
    showWeather();
    showFarm();
    showHarvestStats();
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
    updateTime();
    updateScreen();
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
