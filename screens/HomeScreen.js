import React, { useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPets, fetchFeedingsByPet } from '../redux/actions';
import { initializeDatabase, insertMockData } from '../database';

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

  const formatFeedings = () => {
    const upcomingFeedings = feedings.filter((feeding) => {
      // Convert to ISO format (e.g., "2025-02-01T12:00:00")
      const isoDateTime = new Date(`${feeding.date}T${convertTo24HourFormat(feeding.time)}`);
      
      if (isNaN(isoDateTime.getTime())) {
        console.warn('Invalid feeding date:', feeding.date, feeding.time);
        return false; // Skip invalid dates
      }
      return isoDateTime >= new Date();
    });
  
    const sortedFeedings = upcomingFeedings.sort((a, b) => {
      const dateA = new Date(`${a.date}T${convertTo24HourFormat(a.time)}`);
      const dateB = new Date(`${b.date}T${convertTo24HourFormat(b.time)}`);
      return dateA - dateB;
    });
  
    console.log('Formatted Feedings:', sortedFeedings); // Debug log
    return sortedFeedings;
  };
  
  // Helper function to convert "12:00 PM" to "12:00:00"
  const convertTo24HourFormat = (time) => {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    
    if (modifier === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    } else if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
    
    return `${hours}:${minutes}:00`;
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
      {feedings.length > 0 ? (
        <FlatList
                data={feedings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.feedingCard}
                    onPress={() => navigation.navigate('EditFeeding', { feedingId: item.id })}
                  >
                    <Text style={styles.feedingText}>{`${item.date} - ${item.time}`}</Text>
                  </TouchableOpacity>
                )}
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
