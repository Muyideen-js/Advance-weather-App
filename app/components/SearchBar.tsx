import { View, TextInput, StyleSheet, TouchableOpacity, FlatList, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { AutocompleteCity, RecentSearch } from '../types/weather';
import { fetchCityAutocomplete } from '../utils/weatherApi';
import { getRecentSearches, getFavoriteCities } from '../utils/storage';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteCity[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [favoriteCities, setFavoriteCities] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    loadRecentAndFavorites();
  }, []);

  const loadRecentAndFavorites = async () => {
    const [recent, favorites] = await Promise.all([
      getRecentSearches(),
      getFavoriteCities()
    ]);
    setRecentSearches(recent);
    setFavoriteCities(favorites);
  };

  const handleTextChange = async (text: string) => {
    setSearchText(text);
    if (text.length >= 2) {
      const cities = await fetchCityAutocomplete(text);
      setSuggestions(cities);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (city: string) => {
    onSearch(city);
    setSearchText('');
    setShowSuggestions(false);
    loadRecentAndFavorites();
  };

  const renderSuggestionItem = ({ item }: { item: AutocompleteCity }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectCity(`${item.name}, ${item.country}`)}
    >
      <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
      <Text style={styles.suggestionText}>{`${item.name}, ${item.country}`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search city..."
          value={searchText}
          onChangeText={handleTextChange}
        />
        <TouchableOpacity 
          style={styles.button}
          onPress={() => searchText && handleSelectCity(searchText)}
        >
          <MaterialCommunityIcons name="magnify" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestionItem}
            keyExtractor={(item, index) => `${item.name}-${index}`}
          />
        </View>
      )}

      {!showSuggestions && recentSearches.length > 0 && (
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          {recentSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentItem}
              onPress={() => handleSelectCity(search.city)}
            >
              <MaterialCommunityIcons name="history" size={20} color="#666" />
              <Text style={styles.recentText}>{search.city}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    width: 50,
    height: 50,
    backgroundColor: '#f4511e',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  recentContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#666',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  recentText: {
    marginLeft: 10,
    fontSize: 16,
  },
}); 