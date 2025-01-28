import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateFeeding, fetchPets } from '../redux/actions';
import { fetchFeedingByIdFromDb, updateFeedingInDb } from '../database';
import { Picker } from '@react-native-picker/picker';

export default function EditFeedingScreen({ route, navigation }) {
  const { feedingId } = route.params;
  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets.pets || []);
  const [feeding, setFeeding] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Load the feeding details
  useEffect(() => {
    const loadFeeding = async () => {
      try {
        // Fetch the specific feeding by its ID
        const currentFeeding = await fetchFeedingByIdFromDb(feedingId);

        if (currentFeeding) {
          setFeeding(currentFeeding);
          setSelectedPetId(currentFeeding.petId);
          setDate(currentFeeding.date);
          setTime(currentFeeding.time);
        } else {
          console.error('Feeding not found for ID:', feedingId);
        }
      } catch (error) {
        console.error('Error loading feeding details:', error);
      }
    };

    loadFeeding();
    dispatch(fetchPets()); // Fetch pets for the picker
  }, [dispatch, feedingId]);

  const handleSave = async () => {
    try {
      await updateFeedingInDb(feedingId, selectedPetId, date, time);
      dispatch(updateFeeding({ id: feedingId, petId: selectedPetId, date, time }));
      navigation.goBack();
    } catch (error) {
      console.error('Error updating feeding:', error);
    }
  };

  if (!feeding) return <Text>Loading feeding details...</Text>;

  return (
    <View style={styles.container}>
      <Text>Edit Feeding</Text>

      {pets.length === 0 ? (
        <Text>No pets available</Text>
      ) : (
        <Picker
          selectedValue={selectedPetId}
          onValueChange={(itemValue) => setSelectedPetId(itemValue)}
        >
          {pets.map((pet) => (
            <Picker.Item key={pet.id} label={pet.name} value={pet.id} />
          ))}
        </Picker>
      )}

      <TextInput
        style={styles.input}
        placeholder="Date"
        value={date}
        onChangeText={(text) => setDate(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Time"
        value={time}
        onChangeText={(text) => setTime(text)}
      />

      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginVertical: 8,
    borderRadius: 5,
  },
});
