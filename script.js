'use strict';

const submitBtn = document.getElementById('submit');
const input = document.querySelector('.user-input');
const currentLocation = document.querySelector('.current-location');
const currentTemp = document.querySelector('.current-temp');
const currentSky = document.querySelector('.current-sky');
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind-speed');
const weatherIcon = document.querySelector('.weather-icon');
const advBtn = document.querySelector('.adv-btn');
const boxOne = document.querySelector('.box-one');
const boxThree = document.querySelector('.box-three');
const currentDate = document.querySelector('.current-date');
const currentTime = document.querySelector('.current-time');
const dataContainer = document.querySelector('.data-container');
const sunriseSearchText = document.querySelector('.sunrise-search-text');
const sunsetSearchText = document.querySelector('.sunset-search-text');
const sunriseLocalText = document.querySelector('.sunrise-local-text');
const sunsetLocalText = document.querySelector('.sunset-local-text');
const sunInfo = document.querySelector('.sun-info');
const boxOneLocation = document.querySelector('.country-name');
const locationFlag = document.querySelector('.location-flag');
const lon = document.querySelector('.lon');
const lat = document.querySelector('.lat');
const linkMap = document.querySelector('.link-map');

weatherIcon.classList.add('hidden');
boxOne.classList.add('hidden');
boxThree.classList.add('hidden');

function updateClock() {
  const nowDate = new Date().toLocaleDateString('en-GB');
  const nowTime = new Date().toLocaleTimeString('en-GB');
  currentDate.textContent = nowDate;
  currentTime.textContent = nowTime;
}

setInterval(updateClock, 1000);

function findMatch() {
  const cityName = input.value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=514184891f50b4ca2b89f248bd718cdb&units=metric`;
  fetch(url)
    .then((res) => res.json())
    .then((weatherData) => {
      if (!weatherData.name) {
        // if the location name doesn't exist (grammar mistakes), then it give this message, and hides the other info
        currentLocation.textContent = `Couldn\'t find: ${cityName}. Unknown location.`;
        dataContainer.classList.add('hidden');
        boxOne.classList.add('hidden');
        boxThree.classList.add('hidden');
      } else {
        //Searched location sunrise time in the searched location timezone
        let searchedSunrise = new Date(weatherData.sys.sunrise * 1000);
        searchedSunrise.setSeconds(searchedSunrise.getSeconds() + weatherData.timezone);
        searchedSunrise.setHours(searchedSunrise.getHours() - 2);
        let searchedSunriseTime = searchedSunrise.toLocaleTimeString('en-GB');
        console.log(searchedSunriseTime);

        //Searched location sunset time in the searched location timezone
        let searchedSunset = new Date(weatherData.sys.sunset * 1000);
        searchedSunset.setSeconds(searchedSunset.getSeconds() + weatherData.timezone);
        searchedSunset.setHours(searchedSunset.getHours() - 2);
        let searchedSunsetTime = searchedSunset.toLocaleTimeString('en-GB');
        console.log(searchedSunsetTime);

        //Calculating the searched locations local time
        let searchDate = new Date();
        searchDate.setSeconds(searchDate.getSeconds() + weatherData.timezone);
        searchDate.setHours(searchDate.getHours() - 2);
        let searchedTime = searchDate.toLocaleTimeString('en-GB');

        weatherIcon.classList.remove('hidden');
        advBtn.classList.remove('hidden');
        dataContainer.classList.remove('hidden');
        currentLocation.textContent = `Weather in ${weatherData.name}`;
        currentTemp.textContent = `${Math.round(weatherData.main.temp * 10) / 10}°C`;
        currentSky.textContent = weatherData.weather[0].main;
        humidity.textContent = `Humidity: ${weatherData.main.humidity}%`;
        windSpeed.textContent = `Wind speed: ${Math.round(weatherData.wind.speed * 10) / 10}km/h`;

        // if statement to determine the sky icon
        if (currentSky.textContent) {
          weatherIcon.src = `weathericons/PNG/4Set/${currentSky.textContent}.png`;
          /* If the sun has set in the location, the "clear" icon will be moon, but if the sun has risen and not set yet, the icon
          will be a sun*/
          if (
            (weatherData.weather[0].main === 'Clear' &&
              searchDate.getHours() >= searchedSunset.getHours()) ||
            (weatherData.weather[0].main === 'Clear' &&
              searchDate.getHours() <= searchedSunrise.getHours())
          ) {
            weatherIcon.src = `weathericons/PNG/4Set/Clear-night.png`;
          } else if (
            (weatherData.weather[0].main === 'Clear' &&
              searchDate.getHours() < searchedSunset.getHours()) ||
            (weatherData.weather[0].main === 'Clear' &&
              searchDate.getHours() > searchedSunrise.getHours())
          ) {
            weatherIcon.src = `weathericons/PNG/4Set/Clear.png`;
          }
        } else {
          weatherIcon.src = `weathericons/PNG/4Set/${currentSky.textContent}.png`;
        }

        //Searched location sunrise and sunset in users local time
        let localSunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-GB');
        let localSunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-GB');

        sunriseLocalText.textContent = localSunrise;
        sunsetLocalText.textContent = localSunset;

        sunriseSearchText.textContent = searchedSunriseTime;
        sunsetSearchText.textContent = searchedSunsetTime;

        sunInfo.textContent = `Sunrise and sunset times, left according to ${weatherData.name}'s time, right according to your local time.`;

        // console.log() below checks what the searchdate hours are, as well as the searched locations sunrise and sunset, to compare them for the
        console.log(searchDate.getHours(), searchedSunrise.getHours(), searchedSunset.getHours());
      }
      // Left side box JS
      boxOneLocation.textContent = weatherData.name;
      locationFlag.src = `images/flags/png250px/${weatherData.sys.country.toLowerCase()}.png`;
      linkMap.href = `https://www.google.com/maps/search/?api=1&query=${weatherData.coord.lat},${weatherData.coord.lon}`;

      function toggleAdv() {
        boxOne.classList.toggle('hidden');
        boxThree.classList.toggle('hidden');
      }

      advBtn.addEventListener('click', toggleAdv);
      console.log(weatherData);
    })
    .catch((error) => {
      console.error(error);
    });
}

submitBtn.addEventListener('click', findMatch);
input.addEventListener('keypress', function (e) {
  if (e.keyCode === 13) {
    findMatch();
  }
});
