import React from 'react';
import { Modal, TouchableOpacity, View, StyleSheet, ScrollView, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SIZES } from '@/constants/Theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { checkImageURL } from '@/utils';
import { useDispatch } from 'react-redux';
import { updateFeeding } from '@/store/feedingsSlice';
import { useSQLiteContext } from 'expo-sqlite';

type PetSelectorDropdownProps = {
  pets: Array<{
    id: number;
    name: string;
    imageURL: string;
  }>;
  selectedPetId: number;
  feedingId: number;
  feeding: any;
  onSelect: (petId: number) => void;
  isVisible: boolean;
  onClose: () => void;
};

export const PetSelectorDropdown = ({ 
  pets,
  selectedPetId,
  onSelect,
  isVisible,
  onClose 
}: PetSelectorDropdownProps) => {
  const bgColor = useThemeColor({}, "background");
  const fieldColor = useThemeColor({}, "field");

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
          <ScrollView>
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={[
                  styles.option,
                  { backgroundColor: pet.id === selectedPetId ? fieldColor : 'transparent' }
                ]}
                onPress={() => {
                  onSelect(pet.id);
                  onClose();
                }}
              >
                <Image
                  source={{
                    uri: checkImageURL(pet.imageURL)
                      ? pet.imageURL
                      : "default_url",
                  }}
                  style={styles.petImage}
                />
                <ThemedText type="subtitle">{pet.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '50%',
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
  },
  option: {
    padding: SIZES.small,
    borderRadius: SIZES.xSmall,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  petImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});