function showWeather() {
    let weather = simulation.weather;

    document.getElementById("weather").innerHTML = `
        <p>Day: ${simulation.day}</p>
        <p>Hour: ${simulation.hour}</p>
        <p>Temperature: ${weather.temperature.toFixed(1)}°C</p>
        <p>Humidity: ${weather.humidity.toFixed(1)}%</p>
        <p>Rainfall: ${weather.rainfall.toFixed(1)}</p>
        <p>Wind: ${weather.wind.toFixed(1)}</p>
    `;
}
function showFarm(){
    let farm = document.getElementById("farm");

    farm.innerHTML ="";

    for (let plot of simulation.farm.plots){
        let plotElement = document.createElement("div");

        plotElement.className = "plot";
        plotElement.textContent = Math.round(plot.soil.moisture);

        farm.appendChild(plotElement);

    }
}

function updateScreen(){
    showWeather();
    showFarm();
}

document.getElementById("advanceButton").addEventListener("click", function(){
    updateTime();
    updateScreen();
});

updateScreen();
