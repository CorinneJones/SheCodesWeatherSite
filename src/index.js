
//Format the date into text
function fDate(currentDate) {
  let fDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let fDay = fDays[currentDate.getDay()];

  let fMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let fMonth = fMonths[currentDate.getMonth()];
  return (
    fDay + ", " +
    fMonth +
    " " +
    currentDate.getDate() +
    " " +
    currentDate.getFullYear()
  );
}

function setDateTime(){
  //Get the current date & time
  let now = new Date();
  //get and set the time using "theTime" id
  let time = document.querySelector("#theTime");
  let mins = now.getMinutes();
  //Add a Zero to keep mins double digits
  if (mins < 10) {
    mins = "0" + mins;
  }
  let theCurrentTime = `${now.getHours()}:${mins}`;
  time.innerHTML = theCurrentTime;

  //get and set the date using "todaysDate" id
  let dateToday = fDate(now);
  let today = document.querySelector("#todaysDate");
  today.innerHTML = dateToday.toUpperCase();
}

setDateTime(); //Set the current date time for theTime & todaysDate elements

//update the current city name to match what was searched/submitted
function searchYourCity(event) {
  event.preventDefault();
  let input = document.querySelector("#citySearch");
  let cityName = document.querySelector("#searchedCity");
  if(input.value.length > 0)
  {
    cityName.innerHTML = input.value.toUpperCase();
    checkWeatherByCity(input.value,checkUnitsSelected());
  }
  else
  {
    alert("Please enter a city");
  }
}

function checkUnitsSelected(){
  let units = "metric";
  let unitC = document.querySelector("#tempC");
    //If °C is selected
    if (unitC.classList.contains("selectedTempUnit")==true)
    {
      units = "metric";
    }
    //If °F is selected
    else
    {
      units = "imperial";
    }
    return units;
}


//Temperature conversion
function convertFtoC(tempF){
  return Math.floor(((tempF -32)*5/9)*100)/100;
}

function convertCtoF(tempC){
  return Math.floor(((tempC*9/5) + 32)*100)/100;
}

//Unit conversions
function convertUnits(){
  let windSpeed = document.querySelector("#wind_Speed");
  let feels_like = document.querySelector("#feels_Like");
  let rainAmount = document.querySelector("#rain_Amount");

  if (checkUnitsSelected()==="metric")
  {
    windSpeed.innerHTML = Math.floor(windSpeed.innerHTML.substring(0,windSpeed.innerHTML.length-3)*0.621371*100)/100;
    feels_like.innerHTML = convertFtoC(feels_like.innerHTML.substring(0,feels_like.innerHTML.length-2));
    rainAmount.innerHTML = Math.floor(rainAmount.innerHTML.substring(0,rainAmount.innerHTML.length-1)*25.4*100)/100;
  }
  //else °F is selected
  else
  {
    windSpeed.innerHTML = Math.floor(windSpeed.innerHTML.substring(0,windSpeed.innerHTML.length-4)*1.609343502101025*100)/100;
    feels_like.innerHTML = convertCtoF(feels_like.innerHTML.substring(0,feels_like.innerHTML.length-2));
    rainAmount.innerHTML = Math.floor(rainAmount.innerHTML.substring(0,rainAmount.innerHTML.length-2)/25.4*100)/100;
  }

  addUnits();
}


//Update temperature display
function displayTemp(currentTemp){
  let current_temp = document.querySelector("#currentCityTemp");
  //If °C is selected
  if (checkUnitsSelected()==="metric")
  {
    current_temp.innerHTML = currentTemp+"°C";
  }
  //else °F is selected
  else
  {
    current_temp.innerHTML = currentTemp+"°F";
  }
}

function changeUnit(){
  let unitC = document.querySelector("#tempC");
  let unitF = document.querySelector("#tempF");
  let temp = document.querySelector("#currentCityTemp");

  //If °F is selected
  if (unitC.classList.contains("selectedTempUnit")==false)
  {
    unitF.classList.remove("selectedTempUnit");
    unitC.classList.add("selectedTempUnit");
    temp.innerHTML = convertFtoC(temp.innerHTML.substring(0,temp.innerHTML.length-2))+"°C";
    convertUnits();
  }
  //else °C is selected
  else
  {
    unitC.classList.remove("selectedTempUnit");
    unitF.classList.add("selectedTempUnit");
    temp.innerHTML = convertCtoF(temp.innerHTML.substring(0,temp.innerHTML.length-2))+"°F";
    convertUnits();
  }
}

//Capture user temperature unit selection
let tempC = document.querySelector("#tempC");
tempC.addEventListener("click", changeUnit);

let tempF = document.querySelector("#tempF");
tempF.addEventListener("click", changeUnit);

//weather search city
let apiKeyWeather = "bd7e1a6abf699f2eca2f3fae90b453ff";
let apiCallWeather = "https://api.openweathermap.org/data/2.5/weather?";

let lastSearchedCityWeather = {};


//create URL
function checkWeatherByCity(city,units){
  //api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
  let weatherCheckUrl = apiCallWeather +"q="+ city + "&appid=" + apiKeyWeather + "&units=" + units;
  //Get weather information from URL and then display weather
  axios.get(weatherCheckUrl).then(displayWeather);
} 


//Display Temperature of URL
function displayWeather(response) {
  lastSearchedCityWeather = response;
  displayTemp(lastSearchedCityWeather.data.main.temp);

  // Update city name
  let cityName = document.querySelector("#searchedCity");
  cityName.innerHTML = lastSearchedCityWeather.data.name.toUpperCase();

  // Update wind speed
  document.querySelector("#wind_Speed").innerHTML = lastSearchedCityWeather.data.wind.speed;

  // Update Rain
  if (lastSearchedCityWeather.data.rain === undefined) {
    document.querySelector("#rain_Amount").innerHTML = 0;
  } else {
    document.querySelector("#rain_Amount").innerHTML =
      lastSearchedCityWeather.data.rain["1h"];
  }
  // Update weather description
  document.querySelector("#weather_Description").innerHTML = lastSearchedCityWeather.data.weather[0].description.toUpperCase();

  // Update weather icon
  let currentWeatherIcon = document.querySelector("#today_Icon");
  currentWeatherIcon.setAttribute("src",`https://openweathermap.org/img/wn/${lastSearchedCityWeather.data.weather[0].icon}@2x.png`);
  currentWeatherIcon.setAttribute("alt",lastSearchedCityWeather.data.weather[0].description);

  // Update feels like
  document.querySelector("#feels_Like").innerHTML =lastSearchedCityWeather.data.main.feels_like;

  // Update humidity
  document.querySelector("#humidity").innerHTML =lastSearchedCityWeather.data.main.humidity + "%";

  addUnits();
  
  console.log(response);
}

function addUnits(){
  if (checkUnitsSelected()==="metric")
  {
    document.querySelector("#feels_Like").innerHTML = document.querySelector("#feels_Like").innerHTML+"°C";
    document.querySelector("#wind_Speed").innerHTML = document.querySelector("#wind_Speed").innerHTML + "km/h";
    document.querySelector("#rain_Amount").innerHTML = document.querySelector("#rain_Amount").innerHTML + "mm";
  }
  //If °F is selected
  else
  {
    document.querySelector("#feels_Like").innerHTML = document.querySelector("#feels_Like").innerHTML+"°F";
    document.querySelector("#wind_Speed").innerHTML = document.querySelector("#wind_Speed").innerHTML + "mph";
    document.querySelector("#rain_Amount").innerHTML = document.querySelector("#rain_Amount").innerHTML + '"';
  }
}

//geo location
function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  
  //Get weather information from URL and then display temp
  checkWeatherByLocation(lat,lon,checkUnitsSelected());
  
}

function checkWeatherByLocation(lat,lon,units){
  let currentLat = `lat=${lat}`;
  let currentLon = `lon=${lon}`;
  //api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
  let weatherCheckUrl = apiCallWeather + currentLat + "&" + currentLon + "&appid=" + apiKeyWeather + "&units=" + units;
  //Get weather information from URL and then display weather
  axios.get(weatherCheckUrl).then(displayWeather);
}

//Get the position
function findLocation(){
  navigator.geolocation.getCurrentPosition(showPosition);
}



let searchCity = document.querySelector("#searchButton");
searchCity.addEventListener("click", searchYourCity);

let searchLocation = document.querySelector("#locationButton");
searchLocation.addEventListener("click", findLocation);

