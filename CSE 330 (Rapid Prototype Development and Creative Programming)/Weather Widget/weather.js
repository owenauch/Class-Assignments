// weather.js

// send AJAX request to weather server
function fetchWeather() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://classes.engineering.wustl.edu/cse330/content/weather_json.php", true);
	xhr.addEventListener("load", fetchWeatherCallback, false);
	xhr.send(null);
}

// callback for weather data
function fetchWeatherCallback(event) {
	var weatherData = JSON.parse(event.target.responseText);

	document.getElementsByClassName('weather-loc')[0].innerHTML = "<strong>" + weatherData.location.city + "</strong>   " + weatherData.location.state;
	document.getElementsByClassName('weather-humidity')[0].innerHTML = weatherData.atmosphere.humidity;
	document.getElementsByClassName('weather-temp')[0].innerHTML = weatherData.current.temp;

	var weatherCode = weatherData.tomorrow.code;
	var tomorrowURL =  "http://us.yimg.com/i/us/nws/weather/gr/" + weatherCode + "ds.png";
	document.getElementsByClassName('weather-tomorrow')[0].setAttribute('src', tomorrowURL);

	var weatherCode = weatherData.dayafter.code;
	var tomorrowURL =  "http://us.yimg.com/i/us/nws/weather/gr/" + weatherCode + "ds.png";
	document.getElementsByClassName('weather-dayaftertomorrow')[0].setAttribute('src', tomorrowURL);

	// set event listener on button too
	document.getElementById('btn').addEventListener("click", fetchWeather, false);
}

// get it when page loads
document.addEventListener("DOMContentLoaded", fetchWeather, false);
