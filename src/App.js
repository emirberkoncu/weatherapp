import React, { useState, useEffect, useRef } from 'react'; // useRef'i içe aktar
import axios from 'axios';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('tr');
  const inputRef = useRef(null); // Input referansı için useRef kullan

  const apiKey = '9de9fe38a6baf002927de950b8f6fbf1';

  const getWeather = async () => {
    if (!city) {
      setError('Lütfen bir şehir adı giriniz.');
      return;
    }

    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=${language}`
      );
      setWeather(weatherResponse.data);
      setError('');

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=${language}`
      );
      setForecast(forecastResponse.data);
    } catch (error) {
      setError('Şehir bulunamadı. Lütfen geçerli bir şehir adı giriniz.');
      console.error('Hava durumu verisi alınamadı:', error);
    }
  };

  // Fahrenheit'e dönüştürme fonksiyonu
  const toFahrenheit = (celsius) => (celsius * 9) / 5 + 32;

  // Enter tuşuna basıldığında getWeather fonksiyonunu çağır
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      getWeather();
    }
  };

  // Sayfa yüklendiğinde input alanına odaklan
  useEffect(() => {
    inputRef.current.focus(); // Input alanına odaklan
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-200 text-black">
      <h1 className="text-4xl font-bold mb-8">
        {language === 'tr' ? 'Hava Durumu Uygulaması' : 'Weather App'}
      </h1>
      <div className="flex flex-col items-center space-y-4">
        <input
          type="text"
          placeholder={language === 'tr' ? 'Şehir giriniz' : 'Enter city'}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef} // Input referansını ekle
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
        />
        <button
          onClick={getWeather}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        >
          {language === 'tr' ? 'Hava Durumunu Al' : 'Get Weather'}
        </button>
        {error && <p className="text-red-500">{error}</p>}

        {/* Dil Seçeneği */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm cursor-pointer"
        >
          <option value="tr">Türkçe</option>
          <option value="en">English</option>
        </select>
      </div>

      {weather && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md text-center w-96">
          <h2 className="text-2xl font-semibold">{weather.name}</h2>
          <p className="text-gray-700 capitalize">
            {weather.weather[0].description}
          </p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
            className="w-16 h-16 mx-auto"
          />
          <p className="text-gray-800 mt-2 text-lg">
            {language === 'tr' ? 'Sıcaklık' : 'Temperature'}:{' '}
            {language === 'en'
              ? toFahrenheit(weather.main.temp).toFixed(1) + '°F'
              : weather.main.temp + '°C'}
          </p>
          <p className="text-gray-800 mt-2">
            {language === 'tr' ? 'Nem' : 'Humidity'}: {weather.main.humidity}%
          </p>
          <p className="text-gray-800 mt-2">
            {language === 'tr' ? 'Rüzgar' : 'Wind'}: {weather.wind.speed} m/s
          </p>
        </div>
      )}

      {forecast && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md text-center w-full max-w-4xl">
          <h2 className="text-2xl font-semibold">
            {language === 'tr' ? '5 Günlük Tahmin' : '5-Day Forecast'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            {forecast.list.slice(0, 5).map((item, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg shadow-md flex flex-col items-center w-full"
              >
                <p className="font-semibold">
                  {new Date(item.dt * 1000).toLocaleDateString()}
                </p>
                <img
                  src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                  alt={item.weather[0].description}
                  className="w-16 h-16 mx-auto"
                />
                <p className="text-center" style={{ wordBreak: 'break-word' }}>
                  {language === 'tr' ? 'Durum' : 'Status'}:{' '}
                  {item.weather[0].description}
                </p>
                <p>
                  {language === 'tr' ? 'Sıcaklık' : 'Temperature'}:{' '}
                  {language === 'en'
                    ? toFahrenheit(item.main.temp).toFixed(1) + '°F'
                    : item.main.temp + '°C'}
                </p>
                <p>
                  {language === 'tr' ? 'Nem' : 'Humidity'}: {item.main.humidity}
                  %
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
