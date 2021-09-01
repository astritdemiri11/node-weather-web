const weatherForm = document.getElementById('weather-form');
const weatherInput = document.getElementById('weather-input');
const weatherOutput = document.getElementById('weather-output');

if(weatherForm && weatherInput && weatherOutput) {
    weatherForm.addEventListener('submit', event => {
        event.preventDefault();
        weatherOutput.textContent = 'Loading...';

        fetch('/api/weather?address=' + weatherInput.value).then((response) => {
            response.json().then(data => {
                if(data.error) {
                    weatherOutput.textContent = data.error;
                } else {
                    weatherOutput.innerHTML = `<b>${data.location}</b>: ${data.forecast}`;
                }
            });
        });
    });
}