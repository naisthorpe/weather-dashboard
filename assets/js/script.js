var city = "charlotte";
var apiKey = "b4e8ac44b0c5c42611f58c1a12a6a7b6";
var citySearchEl = $("#city-search");
var citySearchBtn = $("#city-btn");
var clearHistoryBtn = $("#clear-history");
var requestCityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
var storageArray = [];
var storageNoDups = [];

function checkForDuplicates() {
    for (var i=0; i<storageArray.length; i++) {
        if (storageNoDups.indexOf(storageArray[i]) == -1) {
            storageNoDups.push(storageArray[i]);
        }
    }
}

var handleFormSubmit = function (event) {
    event.preventDefault();

    city = citySearchEl.val().toLowerCase();

    $("input[type='text'], textarea").val("");

    getApi();
}

function getApi() {

    var requestCityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;


    fetch(requestCityUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            
            var weatherIconCode = data.weather[0].icon;

            var weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

            var weatherIcon = document.createElement("img");
            weatherIcon.setAttribute("src", weatherIconUrl);

            var cityDate = moment.unix(data.dt).format("M/d/yyy");

            

            var cityText = $("#city-name");
            cityText.text(data.name + ' ' + `(${cityDate}) `);
            cityText.append(weatherIcon);

            var temp = $("#temp");
            temp.text(data.main.temp + " °F");

            var humidity = $("#humidity");
            humidity.text(data.main.humidity + " %");

            var windSpeed = $("#wind-speed");
            windSpeed.text(data.wind.speed + " MPH");

            var lat = data.coord.lat;
            var lon = data.coord.lon;

            var uvIndex = $("#uv-index");

            var uvIndexUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            fetch (uvIndexUrl)
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    //console.log(data);
                    uvIndex.text(data.value);

                    if (data.value <= 2.5) {
                        uvIndex.attr("class", "uv-block uv-low");
                    } else if (data.value <= 5.5) {
                        uvIndex.attr("class", "uv-block uv-moderate");
                    } else if (data.value <= 7.5) {
                        uvIndex.attr("class", "uv-block uv-high");
                    } else {
                        uvIndex.attr("class", "uv-block uv-very-high");
                    }
                })

            

        storageArray.push(data.name);

        checkForDuplicates();

        localStorage.setItem("cities", JSON.stringify(storageNoDups));
    
        renderSearchHistory();

        renderFutureForecast();
            
        })
}

var searchHistoryEl = $("#search-history");

function renderSearchHistory() {

    searchHistoryEl.empty();
    
    for (var i=0; i<storageNoDups.length; i++) {

        var searchText = document.createElement("button");
        searchText.setAttribute("class", "control m-1 has-text-centered is-justify-content-center");
        searchText.setAttribute("data-index", [i]);
        searchText.textContent = storageNoDups[i];
        searchHistoryEl.append(searchText);
    }
}

function renderFutureForecast() {

    var cityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(cityUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        //console.log(data);
        var lat = data.coord.lat;
        var lon = data.coord.lon;

        var futureForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,hourly,minutely&appid=${apiKey}`;
            
        fetch (futureForecastUrl)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                //console.log(data);
                var weatherCardContainer = $("#weather-cards");
                weatherCardContainer.empty();
                //console.log(data.daily.length);
                for (var i=0; i<5; i++) {
                    var weatherCard = document.createElement("div");
                    weatherCard.setAttribute("class", "card column has-background-link m-3");
                    weatherCardContainer.append(weatherCard);

                    var weatherCardDate = document.createElement("div");
                    weatherCardDate.setAttribute("class", "has-text-white has-text-centered is-size-4")
                    weatherCardDate.textContent = moment.unix(data.daily[i].dt).format("M/D/yyyy");
                    weatherCard.append(weatherCardDate);

                    var weatherIconContainer = document.createElement("div");
                    weatherIconContainer.setAttribute("class", "is-flex is-justify-content-center");
                    weatherCard.append(weatherIconContainer);

                    var weatherCardIcon = document.createElement("img");
                    var weatherIconCode = data.daily[i].weather[0].icon;
                    weatherCardIcon.setAttribute("class", "weather-icon");
                    weatherCardIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`);
                    weatherIconContainer.append(weatherCardIcon);

                    var weatherCardTemp = document.createElement("div");
                    weatherCardTemp.setAttribute("class", "has-text-white has-text-centered");
                    weatherCardTemp.textContent = "Temp: " + data.daily[i].temp.day + " °F";
                    weatherCard.append(weatherCardTemp);

                    var weatherCardHumidity = document.createElement("div");
                    weatherCardHumidity.setAttribute("class", "has-text-white has-text-centered");
                    weatherCardHumidity.textContent = "Humidity: " + data.daily[i].humidity + " %";
                    weatherCard.append(weatherCardHumidity);
                    
                }
            }) 
    })
}


function clearHistory() {
    localStorage.clear();
    storageArray = [];
    storageNoDups = [];
    init();
}

var getButtonInfo = function(event) {
    event.stopPropagation();
    var element = event.target;


    if (element.matches("button") === true) {
        var cityIndex = element.getAttribute("data-index");
        //console.log(cityIndex);
        city = storageNoDups[cityIndex];
        //console.log(city);

        ;

        getApi();
    }
}

function init() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !== null) {
        storageNoDups = storedCities;
    }
    
    city = "Charlotte";
    
    getApi();

    renderSearchHistory();
}

init();


citySearchBtn.on("click", handleFormSubmit);

clearHistoryBtn.on("click", clearHistory);

searchHistoryEl.on("click", getButtonInfo);

