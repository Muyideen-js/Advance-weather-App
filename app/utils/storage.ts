import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecentSearch } from '../types/weather';

const RECENT_SEARCHES_KEY = 'recent_searches';
const FAVORITE_CITIES_KEY = 'favorite_cities';

export const saveRecentSearch = async (city: string) => {
  try {
    const recentSearches = await getRecentSearches();
    const newSearch: RecentSearch = { city, timestamp: Date.now() };
    const updated = [newSearch, ...recentSearches.filter(s => s.city !== city)].slice(0, 5);
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recent search:', error);
  }
};

export const getRecentSearches = async (): Promise<RecentSearch[]> => {
  try {
    const searches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
    return searches ? JSON.parse(searches) : [];
  } catch (error) {
    return [];
  }
};

export const toggleFavoriteCity = async (city: string) => {
  try {
    const favorites = await getFavoriteCities();
    const updated = favorites.includes(city)
      ? favorites.filter(c => c !== city)
      : [...favorites, city];
    await AsyncStorage.setItem(FAVORITE_CITIES_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error toggling favorite city:', error);
    return [];
  }
};

export const getFavoriteCities = async (): Promise<string[]> => {
  try {
    const cities = await AsyncStorage.getItem(FAVORITE_CITIES_KEY);
    return cities ? JSON.parse(cities) : [];
  } catch (error) {
    return [];
  }
}; 