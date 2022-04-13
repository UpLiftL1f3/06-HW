// GIVEN a weather dashboard with form inputs
// When  i search for a city
// THEN present current and future weather conditions for that city &&&&& add that city to search history
// WHEN i view current weather conditions for that city
// THEN i am presented with the city name/date/an icon representing the current weather condition/the temp/humidity/wind speed/UV index
// When i view the UV index
// THEN i am presented with a color that indicates whether the conditions are favorable/moderate/severe
// WHEN i view future conditions for that city
// THEN i am presented with a 5 day forecast that displays the date/an icon representing weather conditions/temp/wind speed/and humidity for those 5 days
// WHEN i click on a city in the search history
// THEN i am again presented with current and future conditions for that city

// VARIABLES
let searchBtn = $('#search-btn');
let searchHistoryContainer = $('#search-history-container');
let searchHistoryArr = [];
let apiKey = 'f44b46adae4f2a1382ec3ffdb78f40c8';
// right-side-body variables
// top
let rightTopHeader = document.getElementById('top-right-header');
let currTemp = document.getElementById('currTemp');
let currWind = document.getElementById('wind-speed');
let currHumidity = document.getElementById('humidity');
let currUV = document.getElementById('uv-index');

// FUNCTION Declarations
function onSearch(e) {
  e.preventDefault();
  let userCity = document.querySelector('#search-input').value;
  rightTopHeader.textContent = userCity + ' ' + '(' + currentDate + ')';
  let element = e.target;
  clearHistory(element);

  getCityInfo(userCity, apiKey);
  searchHistory(userCity);
  return userCity;
}

function clearHistory(element) {
  let history =
    element.parentElement.nextElementSibling.firstChild.nextElementSibling;
  console.log(history);
  console.log(history.firstChild);
  if (history.firstChild) {
    while (history.firstChild) {
      history.removeChild(history.firstChild);
    }
  }
}

// Not working correctly Need to find a way select container's children (keep getting Undefined)
function searchHistory(city) {
  searchHistoryArr.unshift(city);

  let uniqCity = [...new Set(searchHistoryArr)];
  if (uniqCity.length > 5) {
    searchHistoryArr.pop();
  }
  console.log(uniqCity);
  for (let i = 0; i < uniqCity.length; i++) {
    let newBtn = document.createElement('button');
    newBtn.setAttribute('class', 'btn btn-secondary w-100 m-2');
    newBtn.textContent = uniqCity[i];
    console.log(newBtn);
    searchHistoryContainer.append(newBtn);
    console.log(searchHistoryContainer);
  }
}
console.log(searchHistoryArr);

// main purpose of this function is to get Longitude and Latitude & run current weather function
function getCityInfo(city, key) {
  let apiUrl =
    'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + key;
  console.log(apiUrl);

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          let lat = data[0].lat;
          let lon = data[0].lon;
          console.log([lat, lon, 'yes']);
          getCurrentWeather(lat, lon, key);
          fiveDayForecast(lat, lon, key);
        });
      } else {
        alert('Error: 2 ' + response.statusText); // if response was not okay then its sending an Alert (which is bad bc its a blocker) with the response status displayed
      }
    })
    .catch(function (error) {
      alert('Unable to connect to weatherAPI'); //is there is a server side error then an Alert (which is bad bc its a blocker) with the response will be displayed
    });
}

// Function to get current weather (initiated in City Info function)
function getCurrentWeather(lat, lon, key) {
  let apiUrl =
    'https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=' +
    lat +
    '&lon=' +
    lon +
    '&appid=' +
    key;
  console.log('current weather api:' + apiUrl);

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
        });
        currTemp.textContent = 'Current Temperature: ' + data.main.temp;
        currHumidity.textContent = 'Current Humidity: ' + data.main.humidity;
        currWind.textContent = 'Current Wind Speed: ' + data.wind.speed;
      } else {
        alert('Error: 1 ' + response.statusText); // if response was not okay then its sending an Alert (which is bad bc its a blocker) with the response status displayed
      }
    })
    .catch(function (error) {
      alert('Unable to connect to weatherAPI'); //is there is a server side error then an Alert (which is bad bc its a blocker) with the response will be displayed
    });
}

function fiveDayForecast(lat, lon, key) {
  let apiUrl =
    'https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=' +
    lat +
    '&lon=' +
    lon +
    '&exclude=minutely,hourly,alerts&appid=' +
    key;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          currTemp.textContent = 'Temperature: ' + data.current.temp;
          currHumidity.textContent = 'Humidity: ' + data.current.humidity;
          currWind.textContent = 'Wind Speed: ' + data.current.speed;
          currUV.textContent = 'UV Index: ' + data.current.uvi;
        });
      } else {
        alert('Error: ' + response.statusText); // if response was not okay then its sending an Alert (which is bad bc its a blocker) with the response status displayed
      }
    })
    .catch(function (error) {
      alert('1 Unable to connect to weatherAPI'); //is there is a server side error then an Alert (which is bad bc its a blocker) with the response will be displayed
    });
}

// functional CODE
let currentDate = moment().format('l');
searchBtn.on('click', onSearch);

// top-right-header
