import React, { useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecurringFeedingsAction } from "@/redux/actions/recurringFeedingActions";
import { selectAllRecurringFeedings } from "@/redux/selectors/recurringFeedingSelectors";

const RecurringFeedingsList = () => {
  const dispatch = useDispatch();
  const recurringFeedings = useSelector(selectAllRecurringFeedings);

  useEffect(() => {
    dispatch(fetchRecurringFeedingsAction());
  }, [dispatch]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Recurring Feedings
      </Text>
      {recurringFeedings.length === 0 ? (
        <Text>No recurring feedings found.</Text>
      ) : (
        <FlatList
          data={recurringFeedings}
          keyExtractor={(item) => `${item.id}-${item.feedingTime}`}
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: 10,
                padding: 10,
                borderWidth: 1,
                borderRadius: 5,
              }}
            >
              <Text>Pet ID: {item.petId}</Text>
              <Text>
                Feeding Time: {new Date(item.feedingTime).toLocaleString()}
              </Text>
              <Text>Prey Type: {item.preyType}</Text>
              <Text>
                Prey Weight: {item.preyWeight} {item.preyWeightType}
              </Text>
              <Text>Notes: {item.notes || "None"}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default RecurringFeedingsList;
