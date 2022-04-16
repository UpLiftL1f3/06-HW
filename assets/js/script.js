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
let searchHistoryContainer = document.getElementById(
  'search-history-container'
);
let searchHistoryArr = [];
let apiKey = 'f44b46adae4f2a1382ec3ffdb78f40c8';
// right-side-body variables

// top (current)
let rightTopHeader = document.getElementById('top-right-header');
let currTemp = document.getElementById('currTemp');
let currWind = document.getElementById('wind-speed');
let currHumidity = document.getElementById('humidity');
let currUV = document.getElementById('uv-index');
let currDay = document.getElementById('currDay');
let currIcon = document.getElementById('currIcon');
let currWeather = document.getElementById('currWeatherDescription');
// Bottom (weekly)
let rightSideBottom = document.getElementById('right-side-bottom');

// FUNCTION Declarations
function onSearch(e) {
  e.preventDefault();
  let userCity = document.querySelector('#search-input').value;
  let element = e.target;
  clearHistory(element);

  getCityInfo(userCity, apiKey);
  searchHistory(userCity);
  return userCity;
}

function clearHistory(element) {
  let history =
    element.parentElement.nextElementSibling.nextElementSibling.firstChild
      .nextElementSibling;
  console.log(history);
  console.log(history.firstChild);
  if (history.firstChild) {
    while (history.firstChild) {
      history.removeChild(history.firstChild);
    }
  }
}

// Not working correctly Need to find a way select container's children (keep getting Undefined)
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach((attr) => {
    element.setAttribute(attr, attributes[attr]);
  });
}
function searchHistory(city) {
  searchHistoryArr.unshift(city);

  let uniqCity = [...new Set(searchHistoryArr)];
  if (uniqCity.length > 5) {
    searchHistoryArr.pop();
  }
  console.log(uniqCity);
  for (let i = 0; i < uniqCity.length; i++) {
    let newBtn = document.createElement('button');
    let btnAttributes = {
      id: uniqCity[i],
      class: 'btn btn-secondary w-100 m-2',
    };
    setAttributes(newBtn, btnAttributes);
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
  console.log(city);
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          let lat = data[0].lat;
          let lon = data[0].lon;
          console.log([lat, lon, 'yes']);
          OneCallApi(city, lat, lon, key);
          // fiveDayForecast(lat, lon, key);
        });
      } else {
        alert('Error: 2 ' + response.statusText); // if response was not okay then its sending an Alert (which is bad bc its a blocker) with the response status displayed
      }
    })
    .catch(function (error) {
      alert('Unable to connect to weatherAPI 15'); //is there is a server side error then an Alert (which is bad bc its a blocker) with the response will be displayed
    });
}

// Function to get current weather (initiated in City Info function)
function OneCallApi(userCity, lat, lon, key) {
  let apiUrl =
    'https://api.openweathermap.org/data/2.5/onecall?lat=' +
    lat +
    '&lon=' +
    lon +
    '&exclude=minutely,hourly,alerts&units=imperial&appid=' +
    key;
  console.log('current weather api:' + apiUrl);

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        console.log(data);
        currentData(userCity, data);
        weeklyData(data);
      });
    } else {
      alert('Error: 1 ' + response.statusText); // if response was not okay then its sending an Alert (which is bad bc its a blocker) with the response status displayed
    }
  });
}

function currentData(userCity, data) {
  // Todays date
  let currentDT = data.current.dt;
  let todaysDate = moment.unix(currentDT).format('dddd');
  currDay.textContent = todaysDate;
  currWeather.textContent = data.current.weather[0].description;
  rightTopHeader.textContent = userCity + ' ' + '(' + currentDate + ')';
  currTemp.textContent = data.current.temp + '°F';
  currHumidity.textContent = 'Humidity: ' + data.current.humidity + '%';
  currWind.textContent = 'Wind Speed: ' + data.current.wind_speed + 'mph';
  currUV.textContent = 'UV index: ' + data.current.uvi;

  assignIcon(data.current.weather[0].id, currIcon);
}

function weeklyData(data) {
  rightSideBottom.setAttribute('style', 'border-top: 1.5px solid black;');
  let weeklyTitle = document.getElementById('weekly-title');
  weeklyTitle.textContent = '5 Day Forecast';
  for (let i = 1; i <= 5; i++) {
    // Data Analysis
    let corrWeatherId = data.daily[i].weather[0].id;
    let corrWeather = data.daily[i].weather[0].description;
    console.log(corrWeather);
    let corrTemp = data.daily[i].temp.day;
    let corrWind = data.daily[i].wind_speed;

    let currentDT = data.daily[i].dt;

    // TEXT CONTENT
    let determinedIconEl = document.getElementById('determined-Icon' + i);
    assignIcon(corrWeatherId, determinedIconEl);
    let determinedDate = moment
      .unix(currentDT)
      .add([i], 'days')
      .format('dddd')
      .slice(0, 3);
    let displayedDate = document.getElementById('day' + i);
    displayedDate.textContent = determinedDate;
    let determinedWeather = document.getElementById('determined-weather' + i);
    console.log(i);
    console.log(determinedWeather);
    determinedWeather.textContent = corrWeather;
    let determinedTemp = document.getElementById('determined-temp' + i);
    determinedTemp.textContent = Math.round(corrTemp) + '°F';
    let determinedWind = document.getElementById('determined-wind-speed' + i);
    determinedWind.textContent = Math.round(corrWind) + ' mph';
    let daySection = document.getElementById('day' + i + '-data');
    if (daySection != document.getElementById('day5-data')) {
      daySection.setAttribute(
        'style',
        '  list-style: none; text-align: center; border-right: solid 1px black;'
      );
    } else {
      daySection.setAttribute(
        'style',
        '  list-style: none; text-align: center;'
      );
    }
  }
}

function assignIcon(dailyId, block) {
  if (block.firstChild) {
    block.removeChild(block.firstChild);
  }
  var img = document.createElement('img');
  if (dailyId > 800) {
    img.src = 'assets/images/Weather_Icons/clouds.png';
    img.className += 'weather-icon';
    // var block = document.getElementById('day' + dayNum);
    block.appendChild(img);
  } else if (dailyId === 800) {
    img.src = 'assets/images/Weather_Icons/clear.png';
    img.className += 'weather-icon';
    // var block = document.getElementById('day' + dayNum);
    block.appendChild(img);
  } else if (dailyId > 700) {
    img.src = 'assets/images/Weather_Icons/fog.png';
    img.className += 'weather-icon';
    // var block = document.getElementById('day' + dayNum);
    block.appendChild(img);
  } else if (dailyId >= 600) {
    img.src = 'assets/images/Weather_Icons/snow.png';
    img.className += 'weather-icon';
    // var block = document.getElementById('day' + dayNum);
    block.appendChild(img);
  } else if (dailyId >= 500) {
    img.src = 'assets/images/Weather_Icons/rain.png';
    img.className += 'weather-icon';
    // var block = document.getElementById('day' + dayNum);
    block.appendChild(img);
  } else if (dailyId >= 300) {
    img.src = 'assets/images/Weather_Icons/drizzle.png';
    img.className += 'weather-icon';
    // var block = document.getElementById('day' + dayNum);
    block.appendChild(img);
  } else if (dailyId >= 200) {
    img.src = 'assets/images/Weather_Icons/thunder.png';
    img.className += 'weather-icon';
    // var block = document.getElementById('day' + dayNum);
    block.appendChild(img);
  } else {
    console.log('big error lol');
  }
}

// functional CODE
let currentDate = moment().format('l');
searchBtn.on('click', onSearch);

searchHistoryContainer.addEventListener('click', (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {
    return;
  } else {
    let userCity = event.target.getAttribute('id');
    console.log(userCity);

    getCityInfo(userCity, apiKey);
    // searchHistory(userCity);
  }
});
