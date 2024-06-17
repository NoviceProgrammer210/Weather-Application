from flask import Flask, render_template, request
import requests 

app = Flask(__name__,template_folder="temp")

# OpenWeatherMap API key
API_KEY = 'c9063d9b020e16c545f70cbcc776a179'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather', methods=['POST'])
def weather():
    city = request.form['city']
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric'
    response = requests.get(url)
    data = response.json()
    if data['cod'] == 200:
        weather_data = {
            'city': city,
            'temperature': data['main']['temp'],
            'description': data['weather'][0]['description'].capitalize(),
            'icon': data['weather'][0]['icon']
        }
        return render_template('index.html', weather=weather_data)
    else:
        error_msg = f'Error: {data["message"]}'
        return render_template('index.html', error=error_msg)

if __name__ == '__main__':
    app.run(debug=True)
