import React, { useState } from 'react';
import { Modal, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { PREY_TYPES } from '@/constants/FeedingTypes';
import { SIZES } from '@/constants/Theme';
import { useThemeColor } from '@/hooks/useThemeColor';

type FeedingTypeDropdownProps = {
  value: string;
  onSelect: (type: string) => void;
  isVisible: boolean;
  onClose: () => void;
};

export const FeedingTypeDropdown = ({ 
  value, 
  onSelect, 
  isVisible, 
  onClose 
}: FeedingTypeDropdownProps) => {
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
            {PREY_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.option,
                  { backgroundColor: type === value ? fieldColor : 'transparent' }
                ]}
                onPress={() => {
                  onSelect(type);
                  onClose();
                }}
              >
                <ThemedText type="default">{type}</ThemedText>
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
  },
});