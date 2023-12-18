$(document).ready(function() {
    $('#search-form').on('submit', function(event) {
      event.preventDefault();
      const city = $('#search-input').val();
      searchCity(city);
    });
    
    function searchCity(cityName) {
      // Call the OpenWeatherMap API to get coordinates
      const apiKey = '9f13ef579cd71e113bc4f51a3501588f'; 
      const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  
      $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function(response) {
        const { lat, lon } = response.coord;
        getWeather(lat, lon, cityName);
      }).fail(function() {
        alert("City not found, please try again.");
      });
    }
    
    function getWeather(latitude, longitude, cityName) {
      const apiKey = '9f13ef579cd71e113bc4f51a3501588f'; 
      const queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  
      $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function(response) {
        displayCurrentWeather(response, cityName);
        displayForecast(response);
        saveToSearchHistory(cityName);
      });
    }

    function displayCurrentWeather(data, cityName) {
      const currentWeather = data.list[0];
      $('#today').html(`
        <h2>Current Weather for ${cityName} (${currentWeather.dt_txt})</h2>
        <p>Temperature: ${currentWeather.main.temp} °C</p>
        <p>Wind: ${currentWeather.wind.speed} KPH</p>
        <p>Humidity: ${currentWeather.main.humidity}%</p>
        <img src="http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png" alt="${currentWeather.weather[0].description}">
      `);
    }

    function displayForecast(data) {
      $('#forecast').empty(); // Clear previous forecasts
      // Loop over each day in the forecast data at 3-hour intervals
      for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        $('#forecast').append(`
          <div class="forecast-day">
            <h3>${forecast.dt_txt.split(' ')[0]}</h3>
            <p>Temperature: ${forecast.main.temp} °C</p>
            <p>Wind: ${forecast.wind.speed} KPH</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
            <img src="http://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
          </div>
        `);
      }
    }

    function saveToSearchHistory(cityName) {
      let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
      if (!history.includes(cityName)) {
        history.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        renderSearchHistory();
      }
    }

    function renderSearchHistory() {
      const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
      $('#history').empty();
      history.forEach(city => {
        $('#history').append(`<button class="list-group-item list-group-item-action">${city}</button>`);
      });
      // Reattach event to history buttons
      $('.list-group-item-action').on('click', function() {
        const cityName = $(this).text();
        searchCity(cityName);
      });
    }

    // Initial render of search history
    renderSearchHistory();
});
