
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


//temperature conversion
function convertFtoC(tempF){
  return Math.floor(((tempF -32)*5/9)*100)/100;
}

function convertCtoF(tempC){
  return Math.floor(((tempC*9/5) + 32)*100)/100;
}

//Update temperature display
function displayTemp(currentTemp){
  let temp = document.querySelector("#currentCityTemp");
  //If °C is selected
  if (checkUnitsSelected()==="metric")
  {
    temp.innerHTML = currentTemp+"°C";
  }
  //If °F is selected
  else
  {
    temp.innerHTML = currentTemp+"°F";
  }
}

function changeUnit(){
  let unitC = document.querySelector("#tempC");
  let unitF = document.querySelector("#tempF");
  let temp = document.querySelector("#currentCityTemp");

  //If °C is selected
  if (unitC.classList.contains("selectedTempUnit")==false)
  {
    unitF.classList.remove("selectedTempUnit");
    unitC.classList.add("selectedTempUnit");
    temp.innerHTML = convertFtoC(temp.innerHTML.substring(0,temp.innerHTML.length-2))+"°C";
  }
  //If °F is selected
  else
  {
    unitC.classList.remove("selectedTempUnit");
    unitF.classList.add("selectedTempUnit");
    temp.innerHTML = convertCtoF(temp.innerHTML.substring(0,temp.innerHTML.length-2))+"°F";
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
  let cityName = document.querySelector("#searchedCity");
  cityName.innerHTML = lastSearchedCityWeather.data.name.toUpperCase();
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

