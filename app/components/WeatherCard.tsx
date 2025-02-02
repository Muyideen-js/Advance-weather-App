import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface WeatherCardProps {
  temperature?: number;
  condition?: string;
  location?: string;
  feelsLike?: number;
  humidity?: number;
  error?: string;
}

export default function WeatherCard({
  temperature,
  condition,
  location,
  feelsLike,
  humidity,
  error
}: WeatherCardProps) {
  if (error) {
    return (
      <View style={styles.card}>
        <MaterialCommunityIcons name="alert-circle" size={64} color="#f44336" />
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.location}>{location || 'Loading location...'}</Text>
      <MaterialCommunityIcons 
        name={condition?.toLowerCase().includes('rain') ? 'weather-rainy' : 'weather-partly-cloudy'} 
        size={64} 
        color="#333" 
      />
      <Text style={styles.temperature}>{temperature ? `${temperature}°C` : '--°C'}</Text>
      <Text style={styles.condition}>{condition || 'Loading...'}</Text>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="thermometer" size={24} color="#666" />
          <Text style={styles.detailText}>Feels like: {feelsLike}°C</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="water-percent" size={24} color="#666" />
          <Text style={styles.detailText}>Humidity: {humidity}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  condition: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    marginTop: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  error: {
    color: '#f44336',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
}); 
