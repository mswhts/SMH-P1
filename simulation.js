let simulation = {
    day: 1,
    hour: 0,
    season: "autumn",

    weather: {
        temperature: 20,
        rainfall: 0,
humidity: 60,
sunlight: 8,
wind: 10
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
                crop.health -= 1;
            }
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

function updateWeather() {
    simulation.weather.temperature += (Math.random() * 2) - 1;
    simulation.weather.humidity += (Math.random() * 4) - 2;
    simulation.weather.wind += (Math.random() * 4) - 2;

    if (simulation.weather.temperature < 5) {
        simulation.weather.temperature = 5;
    }

    if (simulation.weather.temperature > 35) {
        simulation.weather.temperature = 35;
    }

    if (simulation.weather.humidity < 20) {
        simulation.weather.humidity = 20;
    }

    if (simulation.weather.humidity > 100) {
        simulation.weather.humidity = 100;
    }

    if (simulation.weather.wind < 0){
        simulation.weather.wind = 0;
    }
}



