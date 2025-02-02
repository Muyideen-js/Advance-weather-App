import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ForecastItem {
  dt: number;
  temp: number;
  condition: string;
}

interface ForecastCardProps {
  forecast: ForecastItem[];
}

export default function ForecastCard({ forecast }: ForecastCardProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'rain':
        return 'weather-rainy';
      case 'clear':
        return 'weather-sunny';
      case 'clouds':
        return 'weather-cloudy';
      default:
        return 'weather-partly-cloudy';
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>5-Day Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {forecast.map((item, index) => (
          <View key={index} style={styles.forecastItem}>
            <Text style={styles.day}>{formatDate(item.dt)}</Text>
            <MaterialCommunityIcons
              name={getWeatherIcon(item.condition)}
              size={32}
              color="#333"
            />
            <Text style={styles.temp}>{Math.round(item.temp)}°C</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginTop: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  forecastItem: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 60,
  },
  day: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  temp: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
}); 