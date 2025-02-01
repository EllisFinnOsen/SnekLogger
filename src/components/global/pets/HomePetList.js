import React from "react";
import { useSelector } from "react-redux";
import PetList from "@/components/global/pets/PetList";

export default function HomePetList() {
  const pets = useSelector((state) => state.pets.pets || []);

  return (
    <PetList
      pets={pets}
      title="Your Pets"
      showAllLink={true}
      noPetsText="No pets available"
    />
  );
}
