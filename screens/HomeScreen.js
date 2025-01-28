import React, { useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPets, fetchFeedingsByPet } from '../redux/actions';
import { initializeDatabase, insertMockData } from '../database';

// 1. Import from your utils/dateUtils.js
import { getUpcomingFeedings, toISODateTime, formatDateString, formatTimeString } from '../utils/dateUtils';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets.pets || []);
  const feedings = useSelector((state) => state.feedings || []);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
        await insertMockData();
        dispatch(fetchPets());
      } catch (error) {
        console.error('Error setting up database:', error);
      }
    };

    setupDatabase();
  }, [dispatch]);

  useEffect(() => {
    if (pets.length > 0) {
      pets.forEach((pet) => dispatch(fetchFeedingsByPet(pet.id)));
    }
  }, [dispatch, pets]);

  // 2. Use the new utility function to filter and sort the feedings
  const upcomingFeedings = getUpcomingFeedings(feedings);
  const renderFeedingItem = ({ item }) => {
    const dateObj = toISODateTime(item.date, item.time);








    
    return (
      <TouchableOpacity
        style={styles.feedingCard}
        onPress={() => navigation.navigate('EditFeeding', { feedingId: item.id })}
      >
        {dateObj ? (
          <Text>
            {formatDateString(dateObj, 'DD/MM')} - {formatTimeString(dateObj)}
          </Text>
        ) : (
          <Text>{item.date} - {item.time}</Text>
        )}
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pets</Text>
      {pets.length > 0 ? (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Button
              title={item.name}
              onPress={() => navigation.navigate('PetProfile', { petId: item.id })}
            />
          )}
        />
      ) : (
        <Text>No pets available</Text>
      )}

      <Text style={styles.title}>Feedings</Text>
      {upcomingFeedings.length > 0 ? (
        <FlatList
          data={upcomingFeedings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFeedingItem}
        />
      ) : (
        <Text>No upcoming feedings available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  feedingCard: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  feedingText: {
    fontSize: 16,
  },
});
