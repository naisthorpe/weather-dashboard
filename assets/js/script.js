var city = "Charlotte";

var apiKey = "b4e8ac44b0c5c42611f58c1a12a6a7b6";

var citySearchEl = $("#city-search");

var citySearchBtn = $("#city-btn");

var requestCityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;


var storageArray = [];


console.log(storageArray);

citySearchBtn.on("submit", handleFormSubmit);

var handleFormSubmit = function (event) {
    event.preventDefault();

    citySearchEl.text("");

    city = citySearchEl.val().toLowerCase();
    citySearchEl.text("");

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

            var city = $("#city-name");
            city.text(data.name);

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
                    console.log(data);
                    uvIndex.text(data.value);
                })

            storageArray.push(data.name);

            localStorage.setItem("cities", JSON.stringify(storageArray));
        
            renderSearchHistory();

            

            
        });


        
}


function renderSearchHistory() {

    var searchHistoryEl = $("#search-history");

    searchHistoryEl.empty();
    
    for (var i=0; i<storageArray.length; i++) {

        var searchText = document.createElement("button");
        searchText.setAttribute("class", "control m-1 has-text-centered is-justify-content-center");
        
        searchText.textContent = storageArray[i];
        searchHistoryEl.append(searchText);
    }
}

function clearHistory() {
    localStorage.clear();
    storageArray = [];
    init();
}



function init() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !== null) {
        storageArray = storedCities;
    }
    
    

    renderSearchHistory();
}

init();


citySearchBtn.on("click", handleFormSubmit);

var clearHistoryBtn = $("#clear-history");

clearHistoryBtn.on("click", clearHistory);

