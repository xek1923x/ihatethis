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
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day,apparent_temperature&timezone=auto`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        document.getElementById("wthr").innerText = `${Math.round(data.current.temperature_2m)}°C`;
        document.getElementById("feel").innerText = `feels like: ${Math.round(data.current.apparent_temperature)}°C`;
        const currentHour = data.current.time.split("T")[1].split(":")[0];
        document.getElementById("wdescription").innerText = `${currentHour}:00`;
        
        getHourlyWeather(lat, lon, currentHour)

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

getLocation();

async function getHourlyWeather(lat, lon, currentHour) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,is_day&timezone=auto&forecast_days=3`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        renderHourly(data.hourly, currentHour);
    } catch (error) {
        console.error("Error fetching hourly weather data:", error);
    }
    
}

async function renderHourly(hourlyData, currentHour) {
    const hourlyContainer = document.getElementById("hourlycards");
    hourlyContainer.innerHTML = "";

    let cur = 0;
    for (let a = 0; a < hourlyData.time.length; a++) {
        let dhour = parseInt(hourlyData.time[a].split("T")[1].split(":")[0]);
        if (dhour == currentHour) {
            cur = a;
            break;
        }
    }
    for (let i = cur; i < cur + 24; i++) {
        let hour = parseInt(hourlyData.time[i].split("T")[1].split(":")[0]);
        const card = document.createElement("div");
        card.className = "hourlycard";

        const time = document.createElement("div");
        time.className = "hourlytime";
        time.innerText = `${hour}:00`;

        const weathericon = document.createElement("div");
        weathericon.className = "hourlyicon";
        const iconcode = getWeatherIcon(hourlyData.weather_code[i], hourlyData.is_day[i]);
        const img = document.createElement("img");
        img.src = `${iconcode}`;
        img.alt = "Weather Icon";
        weathericon.appendChild(img);
        card.appendChild(weathericon);

        const temp = document.createElement("div");
        temp.className = "hourlytemp";
        temp.innerText = `${Math.round(hourlyData.temperature_2m[i])}°C`;

        card.appendChild(time);
        card.appendChild(temp);
        hourlyContainer.appendChild(card);
    }
}


function getWeatherIcon(code, isDay) {
    if (isDay == 0) {
        if (code == 0) return "/public/moon.png";
        else if (code == 1 || code == 2 || code == 3) return "/public/cloudy.png";
        else if (code >= 45 && code <= 48) return "/public/fog.png";
        else if (code >= 51 && code <= 57) return "/public/lightrain1.png";
        else if (code >= 61 && code <= 67) return "/public/rain.png";
        else if (code >= 71 && code <= 77) return "/public/snowatnight.png";
        else if (code >= 80 && code <= 82) return "/public/middlerain.png";
        else if (code >= 85 && code <= 86) return "/public/snowatnight.png";
        else if (code >= 95 && code <= 99) return "/public/nighthunder.png";
    } else {
        if (code == 0) return "/public/sunny_light.png";
        else if (code == 1 || code == 2 || code == 3) return "/public/cloudy.png";
        else if (code >= 45 && code <= 48) return "/public/fog.png";
        else if (code >= 51 && code <= 57) return "/public/lightrain1.png";
        else if (code >= 61 && code <= 67) return "/public/rain.png";
        else if (code >= 71 && code <= 77) return "/public/snow.png";
        else if (code >= 80 && code <= 82) return "/public/middlerain.png";
        else if (code >= 85 && code <= 86) return "/public/snow.png";
        else if (code >= 95 && code <= 99) return "/public/thunder.png";
    }
}   