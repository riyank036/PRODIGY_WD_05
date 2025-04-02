'use strict';

const API_KEY = 'b62279332c834665806181335240111';
const API_URL = 'https://api.weatherapi.com/v1/current.json';

const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');

let cityInput = "Valsad";

// Set up event listeners
const setupEventListeners = () => {
    cities.forEach((city) => {
        city.addEventListener('click', (e) => {
            cityInput = e.target.innerHTML;
            fetchWeatherData();
            app.style.opacity = "0";
        });
    });

    form.addEventListener('submit', (e) => {
        if (search.value.length === 0) {
            alert('Please type in a city name');
        } else {
            cityInput = search.value;
            fetchWeatherData();
            search.value = ""; 
            app.style.opacity = "0"; 
        }
        e.preventDefault();
    });
};

const formatDate = (day, month, year) => {
    const date = new Date(`${year}-${month}-${day}`);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

// Get weather background and button style based on condition code
const getWeatherStyle = (code, isDay) => {
    const timeOfDay = isDay ? "day" : "night";
    let weatherType = 'snowy';
    
    if (code === 1000) {
        weatherType = 'clear';
    } else if ([1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282].includes(code)) {
        weatherType = 'cloudy';
    } else if ([1063, 1069, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252].includes(code)) {
        weatherType = 'rainy';
    } else {
        weatherType = 'snowy';
    }
    
    const btnColors = {
        day: {
            clear: '#e5ba92',
            cloudy: '#fa6d1b',
            rainy: '#647d75',
            snowy: '#4d72aa'
        },
        night: {
            clear: '#181e27',
            cloudy: '#181e27',
            rainy: '#325c80',
            snowy: '#1b1b1b'
        }
    };
    
    return {
        background: `url(./images/${timeOfDay}/${weatherType}.jpg)`,
        btnColor: btnColors[timeOfDay][weatherType]
    };
};

// Fetch weather data
const fetchWeatherData = async () => {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}&q=${encodeURIComponent(cityInput)}`);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        updateDOM(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        app.style.opacity = "1";
        alert('City not found, please try again');
    }
};

// Update DOM with weather data
const updateDOM = data => {
    // Temperature
    temp.innerHTML = `${(data.current.temp_c)}&#176;`;
    
    // Condition & city name
    conditionOutput.innerHTML = data.current.condition.text;
    nameOutput.innerHTML = data.location.name;
    
    // Date and time
    const date = data.location.localtime;
    const [dateStr, timeStr] = date.split(' ');
    const [year, month, day] = dateStr.split('-');
    
    dateOutput.innerHTML = formatDate(day, month, year);
    timeOutput.innerHTML = timeStr;
    
    // Weather icon
    icon.src = `https:${data.current.condition.icon}`;
    icon.alt = data.current.condition.text;
    
    // Weather details
    cloudOutput.innerHTML = `${data.current.cloud}%`;
    humidityOutput.innerHTML = `${data.current.humidity}%`;
    windOutput.innerHTML = `${data.current.wind_kph} km/h`;
    
    // Update background and button styles
    const { background, btnColor } = getWeatherStyle(data.current.condition.code, data.current.is_day);
    app.style.backgroundImage = background;
    btn.style.background = btnColor;
    app.style.opacity = "1";
};

const init = () => {
    setupEventListeners();
    fetchWeatherData();
    app.style.opacity = "1";
};

init();
