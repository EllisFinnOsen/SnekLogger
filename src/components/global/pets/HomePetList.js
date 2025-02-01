import React from "react";
import { useSelector } from "react-redux";
import PetList from "@/components/global/pets/PetList";
import { useNavigation } from "@react-navigation/native";
export default function HomePetList() {
  const pets = useSelector((state) => state.pets.pets || []);
  const navigation = useNavigation();
  return (
    <PetList
      pets={pets}
      title="Your Pets"
      showAllLink={true}
      onShowAllPress={() => navigation.navigate("Collection")}
    />
  );
}
