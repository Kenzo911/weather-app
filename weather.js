const weatherCodes = {
    0: 'Clear Sky',
    1: 'Mainly clear',
    2: 'partly cloudy',
    3: 'overcast',
    45: 'Fog',
    48: 'depositing rime fog',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'dense intensity Drizzle',
    56: 'Light Freezing Drizzle',
    57: 'Dense Intensity Drizzle',
    61: 'Slight Rain',
    63: 'Moderate Rain',
    65: 'Heavy Intensity Rain',
    66: 'Light Freezing Rain',
    67: 'Heavy Intensity',
    71: 'Slight Snowfall',
    73: 'Moderate Snowfall',
    75: 'Heavy Intensity Snowfall',
    77: 'Snow grains',
    80: 'Slight Rain Showers',
    81: 'Moderate Rain Showers',
    82: 'Violent Rain Showers',
    85: 'Slight Snow Showers',
    86: 'Heavy Snow Showers',
    95: 'Moderate Thunderstorm',
    96: 'Slight Thunderstorm',
    99: 'Heavy Hail Thunderstorm '
} 
const weatherIcons = {
    day: {
        0: 'weather icons/glass weather icons/Day/sunny.png',
        1: 'weather icons/glass weather icons/Day/pcloudy.png',
        2: 'weather icons/glass weather icons/Day/pcloudy.png',
        3: 'weather icons/glass weather icons/Day/mcloudy.png',
        45: 'weather icons/glass weather icons/Day/foggy.png',
        48: 'weather icons/glass weather icons/Day/foggy.png',
        51: 'weather icons/glass weather icons/Day/Rain.png',
        53: 'weather icons/glass weather icons/Day/Rain.png',
        55: 'weather icons/glass weather icons/Day/Rain.png',
        56: 'weather icons/glass weather icons/Day/Rain.png',
        57: 'weather icons/glass weather icons/Day/Rain.png',
        61: 'weather icons/glass weather icons/Day/Rain.png',
        63: 'weather icons/glass weather icons/Day/Rain.png',
        65: 'weather icons/glass weather icons/Day/Rain.png',
        66: 'weather icons/glass weather icons/Day/Rain.png',
        67: 'weather icons/glass weather icons/Day/Rain.png',
        71: 'weather icons/glass weather icons/Day/Snow.png',
        73: 'weather icons/glass weather icons/Day/Snow.png',
        75: 'weather icons/glass weather icons/Day/Snow.png',
        77: 'weather icons/glass weather icons/Day/Snow.png',
        80: 'weather icons/glass weather icons/Day/Rain.png',
        81: 'weather icons/glass weather icons/Day/Rain.png',
        82: 'weather icons/glass weather icons/Day/Rain.png',
        85: 'weather icons/glass weather icons/Day/Snow.png',
        86: 'weather icons/glass weather icons/Day/Snow.png',
        95: 'weather icons/glass weather icons/Day/TStorm.png',
        96: 'weather icons/glass weather icons/Day/Tstorm.png',
        99: 'weather icons/glass weather icons/Day/Tstorm.png'
    },
    night: {
        0: 'weather icons/glass weather icons/Night/moon.png',
        1: 'weather icons/glass weather icons/Night/pcloudy0.png',
        2: 'weather icons/glass weather icons/Night/pcloudy0.png',
        3: 'weather icons/glass weather icons/Night/mcloudy0.png',
        45: 'weather icons/glass weather icons/Night/foggy.png',
        48: 'weather icons/glass weather icons/Night/foggy.png',
        51: 'weather icons/glass weather icons/Night/Rain0.png',
        53: 'weather icons/glass weather icons/Night/Rain0.png',
        55: 'weather icons/glass weather icons/Night/Rain0.png',
        56: 'weather icons/glass weather icons/Night/Rain0.png',
        57: 'weather icons/glass weather icons/Night/Rain0.png',
        61: 'weather icons/glass weather icons/Night/Rain0.png',
        63: 'weather icons/glass weather icons/Night/Rain0.png',
        65: 'weather icons/glass weather icons/Night/Rain0.png',
        66: 'weather icons/glass weather icons/Night/Rain0.png',
        67: 'weather icons/glass weather icons/Night/Rain0.png',
        71: 'weather icons/glass weather icons/Night/Snow.png',
        73: 'weather icons/glass weather icons/Night/Snow.png',
        75: 'weather icons/glass weather icons/Night/Snow.png',
        77: 'weather icons/glass weather icons/Night/Snow.png',
        80: 'weather icons/glass weather icons/Night/Rain0.png',
        81: 'weather icons/glass weather icons/Night/Rain0.png',
        82: 'weather icons/glass weather icons/Night/Rain0.png',
        85: 'weather icons/glass weather icons/Night/Snow.png',
        86: 'weather icons/glass weather icons/Night/Snow.png',
        95: 'weather icons/glass weather icons/Night/Tstorm.png',
        96: 'weather icons/glass weather icons/Night/Tstorm.png',
        99: 'weather icons/glass weather icons/Night/Tstorm.png'
    }
};

function getWeatherIcon(weatherCode, is_day) {
    if (is_day == 0){
        return weatherIcons['night'][weatherCode];
    }
    else{
        return weatherIcons['day'][weatherCode];
    }
}

async function getCoordinates(cityName) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`; 
    const response = await fetch(url);
    const data = await response.json();

    if (data.results.length > 0) {
        return data.results[0];
    }
    throw new Error('error');
}

async function getWeatherData(latitude, longitude){
    const url=  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=is_day,wind_speed_10m&hourly=temperature_2m,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;
    const response = await fetch(url);
    return response.json();
}

async function findCity(city = null) {
    const cityName = city || document.getElementById('city-input').value;
    const spinner = document.getElementById('spinner');
    spinner.classList.remove('hidden');  // Show spinner
    try {
        const coordinates = await getCoordinates(cityName);
        const weatherData = await getWeatherData(coordinates.latitude, coordinates.longitude);
        populateWeatherToday(cityName, weatherData,  coordinates.country, coordinates.country_code);
        populateWeatherNext(weatherData);

    } catch (error) {
        console.error('error', error);
    } finally {
        spinner.classList.add('hidden');  
    }
}

async function populateCity(cityName, cardId) { //for euro city
    try {
        const coordinates = await getCoordinates(cityName);
        const weatherData = await getWeatherData(coordinates.latitude, coordinates.longitude);
        const is_day = weatherData.current.is_day;
        const temperature_min = weatherData.daily.temperature_2m_min[0];
        const temperature_max = weatherData.daily.temperature_2m_max[0];
        const weather_code = weatherData.daily.weather_code[0];
        const weatherIconSrc = getWeatherIcon(weather_code, is_day);
        const country = coordinates.country;

        const card = document.getElementById(cardId);
        const text = cityName + ', ' + country
        card.querySelector('.city-name').textContent = text;
        card.querySelector('.temperature').textContent = `${temperature_min}°C - ${temperature_max}°C`;
        card.querySelector('img').src = weatherIconSrc;
    } catch (error) {
        console.error('Error occurred', error);
    }
}

function createEuroCard(cardId) {
    const cardHtml = `
        <div class="cards-euro" id="${cardId}">
            <div class="euro-img"> 
                <img src="weather icons/3d solid weather icons/sunny.png" alt="">
            </div>
            <div class="euro-text">
                <div class="col-1">
                    <p class="city-name"></p>
                </div>
                <div class="col-2">
                    <p class="temperature"></p>
                </div>
            </div>
        </div>
    `;
    return cardHtml;
}

async function populateEuroCities(cities) {
    const euroCityCardsContainer = document.getElementById('euro-city-cards');
    euroCityCardsContainer.innerHTML = ''; 
    console.log(euroCityCardsContainer);

    for (const [index, city] of cities.entries()) {
        const cardId = `euro-card-${index}`;
        console.log(cardId);
        euroCityCardsContainer.innerHTML += createEuroCard(cardId);
        await populateCity(city, cardId);
    }
}

function feelsLike(feels_like, temp){
    let colder;
    if (feels_like < temp){
        colder = true;
    }
    else {
        colder = false
    }
    return colder;
}

async function populateWeatherToday(city, weatherData, country, country_code) {
    const temperature_min = weatherData.daily.temperature_2m_min[0];
    const temperature_max = weatherData.daily.temperature_2m_max[0];
    const is_day = weatherData.current.is_day;
    const temp = Math.floor((temperature_max + temperature_min) / 2); 
    const weather_code = weatherData.daily.weather_code[0];

    country_code = country_code.toLowerCase();

    const feels_like = weatherData.hourly.apparent_temperature[0];
    const weatherIconSrc = getWeatherIcon(weather_code, is_day);
    const cardImageContainer = document.querySelector('.card-image');
    const weather_code_text = weatherCodes[weather_code];
    const wind = weatherData.current.wind_speed_10m;
    const uv = weatherData.daily.uv_index_max[0];
    const city_name = city.charAt(0).toUpperCase() + city.slice(1); //change user input ke upper case untuk huruf pertama

    
    var uv_decision = "";
    var uv_color = "";
    if (uv < 3) { //1 case
        uv_decision = "(Low Danger)";
        uv_color = "green";
    } else if (uv >= 3 && uv < 6) { //2 case
        uv_decision = "(Moderate risk)";
        uv_color = "yellow";
    } else if (uv >= 6 && uv < 8) { //3 case
        uv_decision = "(High Risk)";
        uv_color = "orange";
    } else if (uv >= 8 && uv < 11) { //4 case
        uv_decision = "(Very High Risk)";
        uv_color = "red";
    } else if (uv >= 11) { //5 case
        uv_decision = "(Extreme risk)";
        uv_color = "purple";
    }

    const sunrise = new Date(weatherData.daily.sunrise[0]).toLocaleString();
    const sunset = new Date(weatherData.daily.sunset[0]).toLocaleString();
    cardImageContainer.innerHTML = `
        <img class="today-img" src="${weatherIconSrc}" alt="weather icon">
    `;

    const contentContainer = document.querySelector('.today-content');
    contentContainer.innerHTML = `
        <h1 class="today-city"> ${city_name}, ${country}</h1>
        <img class="country-img" src="https://hatscripts.github.io/circle-flags/flags/${country_code}.svg" alt="weather icon">
        <h1 class="today-temperature"> ${temp}°C</h1>
        <p class="today-weather-code">${weather_code_text} </p> 
        <p class="today-details"> Feels Like ${feels_like}°C</p>
    `;
    var colder_decision = feelsLike(feels_like,temp);
    const todayDetailsElement = document.querySelector('.today-details');
    if (colder_decision == true){
        todayDetailsElement.style.color = '#5cc8cf';
    }
    else{
        todayDetailsElement.style.color = '#d73021';
    }
    const content2Container = document.querySelector('.card-today-detailed');
    content2Container.innerHTML = `
                            <div class="col">
                                <img src="wind.png" alt="">
                            </div>
                            <div class="col">
                                <img src="uv.png" alt="">
                            </div>
                            <div class="col">
                                <img src="sunrise.png" alt="">
                            </div>
                            <div class="col">
                                <img src="sunset.png" alt="">
                            </div>
    `;
    const content3Container = document.querySelector('.card-today-detailed-info');
    content3Container.innerHTML = `
                            <div class="col">
                                <p class="wind">${wind}km/h</p>
                            </div>
                            <div class="col">
                            <p class="uv" style="color: ${uv_color}">${uv} ${uv_decision}</p>
                            </div>
                            <div class="col">
                                <p class="sunrise">${sunrise}</p>
                            </div>
                            <div class="col">
                                <p class="sunset">${sunset}</p>
                            </div>
    `;
}

function getDayName(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function populateWeatherNext(weatherData) {
    for (let i = 0; i < 7; i++) {
        const weatherNextCard = document.getElementById(`weather-next-${i+1}`);
        const is_day = weatherData.current.is_day;
        const weather_code = weatherData.daily.weather_code[i];
        const weatherIconSrc = getWeatherIcon(weather_code, is_day);
        const day = getDayName(weatherData.daily.time[i]);
        const probability = weatherData.daily.precipitation_probability_max[i]

        weatherNextCard.innerHTML = `
        <div class="card-next-img"> 
            <p class='day'>${day}</p>
            <img src="${weatherIconSrc}" alt="weather icon">
            <div class="bawah">
                <p>${probability}%</p>
                <p>${weatherData.daily.temperature_2m_min[i]}°C - ${weatherData.daily.temperature_2m_max[i]}°C</p>
            </div>
        </div>
        `;
    }
}

document.getElementById('search-button').addEventListener('click', () => findCity());
document.getElementById('toggle-sidebar').addEventListener('click', () => {
    const euroContent = document.getElementById('euro-content');
    const content = document.getElementById('content');

    euroContent.classList.toggle('active');
    content.classList.toggle('sidebar-active');
});

window.onload = () => {
    defaultView("Jakarta");
    const euro_cities = ["Berlin", "Cologne", "Dortmund", "Dusseldorf", "Frankfurt", "Gelsenkirchen", "Hamburg", "Leipzig", "Munich", "Stuttgart"];
    populateEuroCities(euro_cities); //save api calls
};

async function defaultView(city = null) {
    const cityName = city || document.getElementById('city-input').value;
    try {
        const coordinates = await getCoordinates(cityName);
        const weatherData = await getWeatherData(coordinates.latitude, coordinates.longitude);
        populateWeatherToday(cityName, weatherData,  coordinates.country, coordinates.country_code);
        populateWeatherNext(weatherData);
    } catch (error) {
        console.error('error', error);
    } 
}