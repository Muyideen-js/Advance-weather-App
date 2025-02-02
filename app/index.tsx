import { View, StyleSheet, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';
import { WeatherData, ForecastData, fetchWeatherData, fetchForecastData, fetchWeatherByCity, fetchForecastByCity } from './utils/weatherApi';
import SearchBar from './components/SearchBar';

export default function Home() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      if (!location) return;
      
      const [weather, forecast] = await Promise.all([
        fetchWeatherData(location.coords.latitude, location.coords.longitude),
        fetchForecastData(location.coords.latitude, location.coords.longitude)
      ]);
      
      setWeatherData(weather);
      setForecastData(forecast);
    } catch (error) {
      setErrorMsg('Error fetching weather data');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [location]);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg('Error getting location');
      }
    })();
  }, []);

  useEffect(() => {
    if (location) {
      fetchData();
    }
  }, [location]);

  const formatForecastData = () => {
    if (!forecastData) return [];
    
    return forecastData.list
      .filter((item, index) => index % 8 === 0) // Get one reading per day
      .slice(0, 5) // Get 5 days
      .map(item => ({
        dt: item.dt,
        temp: item.main.temp,
        condition: item.weather[0].main
      }));
  };

  const handleCitySearch = async (city: string) => {
    try {
      setErrorMsg(null);
      const [weather, forecast] = await Promise.all([
        fetchWeatherByCity(city),
        fetchForecastByCity(city)
      ]);
      setWeatherData(weather);
      setForecastData(forecast);
    } catch (error) {
      setErrorMsg('City not found');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SearchBar onSearch={handleCitySearch} />
      {errorMsg ? (
        <WeatherCard error={errorMsg} />
      ) : !weatherData ? (
        <ActivityIndicator size="large" color="#f4511e" />
      ) : (
        <>
          <WeatherCard
            temperature={Math.round(weatherData.main.temp)}
            condition={weatherData.weather[0].main}
            location={weatherData.name}
            feelsLike={Math.round(weatherData.main.feels_like)}
            humidity={weatherData.main.humidity}
          />
          <ForecastCard forecast={formatForecastData()} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 20,
  },
}); 