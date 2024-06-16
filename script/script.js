document.getElementById('getWeatherBtn').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value;
    const apiKey = '87deb4e3d693c00a9fdfab2dfbfa88f7'; // Replace with your OpenWeatherMap API key

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found or network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const { coord } = data;
            const lat = coord.lat;
            const lon = coord.lon;

            // Fetch weather forecast data using Forecast API
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${apiKey}`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if(data.cod === 200) {
                // Display weather forecast
                const forecast = data.daily.map(day => `
                    <div>
                        <h3>${new Date(day.dt * 1000).toLocaleDateString()}</h3>
                        <p>Weather: ${day.weather[0].description}</p>
                        <p>Temperature: ${day.temp.day}°C</p>
                        <p>Humidity: ${day.humidity}%</p>
                        <p>Wind Speed: ${day.wind_speed} m/s</p>
                    </div>
                `).join('');

                document.getElementById('weatherInfo').innerHTML = forecast;
            } else {
                document.getElementById('weatherInfo').innerHTML = `<p class="text-red-500">${data.message}</p>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('weatherInfo').innerHTML = `<p class="text-red-500">${error.message}</p>`;
        });
});
