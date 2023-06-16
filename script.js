var apiKey = "4693f906705cbf93ba70c5a75cd47371";
var searchButton = document.querySelector(".search");
var searchInput = document.querySelector("input");
var weather = document.querySelector(".today-weather");
var forecast = document.querySelector(".forecast");
var searchHistory = document.querySelector(".search-history");
var forecastTitle = document.querySelector('.forecast-title')

var prevSearches = [];

var storedCityString = localStorage.getItem("city");

var storedCity = JSON.parse(storedCityString);

storedCity.forEach(function (city) {
  if (!prevSearches.includes(city)) {
    prevSearches.push(city)
    var prevSearchBtn = document.createElement("button");
    prevSearchBtn.innerText = city;
    prevSearchBtn.classList.add("search-history");
    searchHistory.prepend(prevSearchBtn);

    function handleSearchBtnClick(e) {
      var cityName = e.target.innerText;
      searchInput.value = cityName;
      displayWeather();
    }
    prevSearchBtn.addEventListener("click", handleSearchBtnClick);
  }
});

function displayWeather() {
  var cityName = searchInput.value;
  forecastTitle.style.display = 'block'
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=imperial&q=${cityName},US`
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      weather.style.display = "block";
      var weatherDiv = `
        <h2>${data.name} ${dayjs.unix(data.dt).format("MM/DD/YYYY")}</h2>`;

      weather.innerHTML = `
        <h2>${data.name} ${dayjs.unix(data.dt).format("MM/DD/YYYY")}</h2>
        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
        <p>Temp: ${data.main.temp}°</p>
        <p>Wind: ${data.wind.speed}mph</p>
        <p>Humidity: ${data.main.humidity}%</p>`;

      if (!prevSearches.includes(cityName)) {
        prevSearches.push(cityName);

        // Store updated search history in localStorage
        localStorage.setItem("city", JSON.stringify(prevSearches));

        var prevSearchBtn = document.createElement("button");
        prevSearchBtn.innerText = searchInput.value;
        prevSearchBtn.classList.add("search-history");
        searchHistory.prepend(prevSearchBtn);

        function handleSearchBtnClick(e) {
          var cityName = e.target.innerText;
          searchInput.value = cityName;
          displayWeather();
        }
        prevSearchBtn.addEventListener("click", handleSearchBtnClick);
      }

      //   prevSearches.push(searchInput.value);

      //   var searchString = JSON.stringify(prevSearches);

      //   localStorage.setItem("city", searchString);

      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=imperial&lat=${data.coord.lat}&lon=${data.coord.lon}`
      )
        .then(function (res) {
          return res.json();
        })
        .then(function (forecastData) {
          forecast.innerHTML = "";

          forecastData.list.forEach((day) => {
            if (day.dt_txt.includes("12:00:00")) {
              forecast.innerHTML += `
                <div class="day">
                  <h3>${dayjs(day.dt_txt).format("MM/DD/YYYY")}</h3>
                  <img src="https://openweathermap.org/img/w/${
                    day.weather[0].icon
                  }.png">
                  <p>${day.weather[0].main}</p>
                  <p>Temp: ${day.main.temp}</p>
                  <p>Wind: ${day.wind.speed}°</p>
                  <p>Humidity: ${day.main.humidity}%</p>
                </div>`;
            }
          });
        });
    });
}

searchButton.addEventListener("click", displayWeather);
