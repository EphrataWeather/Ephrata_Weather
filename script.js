const defaultLoc = { lat: 40.1806, lon: -76.1828 }; // Ephrata, PA

async function initWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => fetchNWSData(pos.coords.latitude, pos.coords.longitude),
            () => fetchNWSData(defaultLoc.lat, defaultLoc.lon)
        );
    } else {
        fetchNWSData(defaultLoc.lat, defaultLoc.lon);
    }
}

async function fetchNWSData(lat, lon) {
    try {
        // Step 1: Get metadata for the location
        const pointsRes = await fetch(`https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`);
        const pointsData = await pointsRes.json();
        
        // Step 2: Get forecast and current obs
        const forecastUrl = pointsData.properties.forecastHourly;
        const stationUrl = pointsData.properties.observationStations;

        const weatherRes = await fetch(forecastUrl);
        const weatherData = await weatherRes.json();
        const current = weatherData.properties.periods[0];

        // Update UI
        document.getElementById('location-name').innerText = pointsData.properties.relativeLocation.properties.city + ", " + pointsData.properties.relativeLocation.properties.state;
        document.getElementById('temp').innerText = current.temperature;
        document.getElementById('description').innerText = current.shortForecast;
        document.getElementById('wind').innerText = `${current.windSpeed} ${current.windDirection}`;
        document.getElementById('humidity').innerText = current.relativeHumidity.value + "%";
        document.getElementById('weather-icon').src = current.icon;
        
        // Pressure and Dewpoint often come from observation stations, 
        // using simplified placeholder mapping from forecast grid for this template
        document.getElementById('dewpoint').innerText = current.dewpoint.value.toFixed(0);
        document.getElementById('pressure').innerText = "29.92"; // Static fallback for standard template
        
    } catch (err) {
        console.error("Error fetching weather:", err);
    }
}

initWeather();
