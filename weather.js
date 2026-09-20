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
function updateWeatherEvent() {
    if (simulation.weatherEventDuration > 0) {
        simulation.weatherEventDuration--;

        if (simulation.weatherEventDuration == 0) {
            simulation.weatherEvent = "Normal";
            resetWeatherAfterEvent();
        }

        return;
    }

    simulation.weatherEvent = "Normal";

      let chance = Math.random();
    
    if (chance < 0.05) {
        simulation.weatherEvent = "Heatwave";
        simulation.weather.temperature += 8;
        simulation.weatherEventDuration = 5;
    } else if (chance < 0.10) {
        simulation.weatherEvent = "Storm";
        simulation.weather.rainfall += 10;
        simulation.weather.wind += 15;
        simulation.weatherEventDuration = 5;
    } else if (chance < 0.15) {
        simulation.weatherEvent = "Cold Snap";
        simulation.weather.temperature -= 8;
        simulation.weatherEventDuration = 5;
    }

    if (simulation.weather.temperature > 35) {
        simulation.weather.temperature = 35;
    }
    if (simulation.weather.temperature < 5) {
        simulation.weather.temperature = 5;
    }
    if (simulation.weather.rainfall > 20) {
        simulation.weather.rainfall = 20;
    }
}

function resetWeatherAfterEvent() {
    simulation.weather.temperature = simulation.weather.normalTemperature;
    simulation.weather.rainfall = simulation.weather.normalRainfall;
    simulation.weather.wind = simulation.weather.normalWind;
}
