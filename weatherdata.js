async function getLocation() {
    let cityname = document.getElementById("cityname").innerText;
    const apiKey = "682b38de5fca30505fe62f316684bcf7";
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=1&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        getCurrentWeather(data[0].lat, data[0].lon);
    } catch (error) {
        console.error("Error fetching location data:", error);
    }
}

async function getCurrentWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,apparent_temperature&timezone=auto`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        document.getElementById("wthr").innerText = `${Math.round(data.current.temperature_2m)}°C`;
        document.getElementById("feel").innerText = `feels like: ${Math.round(data.current.apparent_temperature)}°C`;
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

getLocation();