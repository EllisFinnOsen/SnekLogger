import { Image, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { checkImageURL } from "@/src/utils";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { Colors, SIZES } from "@/src/constants/Theme";

interface SmallCardProps {
  pet: {
    id: number;
    name: string;
    species: string;
    morph: string;
    birthDate: string;
    weight: number;
    imageURL: string;
  };
}

const SmallCard = ({ pet }: SmallCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({ pathname: "/pets/[id]", params: { id: pet.id.toString() } });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.imageContainer}>
          <Image
            source={{
              uri: checkImageURL(pet?.imageURL)
                ? pet.imageURL
                : "https://files.oaiusercontent.com/file-DjW5L9b81xAoE1CS5dgfGf?se=2025-01-22T19%3A04%3A19Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D4bc93413-3775-4d04-bb36-d00efe395407.webp&sig=4s4GNu/F9s40L9WCGzcndpvr4bnYlv6ftC7%2BPRitiO0%3D",
            }}
            resizeMode="cover"
            style={styles.petImage}
          />
        </ThemedView>

        <ThemedView style={styles.textContainer}>
          <ThemedText type="subtitle">{pet.name}</ThemedText>
          <ThemedText type="smDetail">{pet.morph}</ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

export default SmallCard;

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "column",
    gap: 5,
    paddingBottom: SIZES.small,
  },
  imageContainer: {
    width: 160,
    height: 100,
    borderRadius: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  petImage: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1,
  },
  petName: {
    fontSize: SIZES.medium,
  },
  petType: {
    fontSize: SIZES.small - 10,
    marginTop: 3,
    textTransform: "capitalize",
  },
});
