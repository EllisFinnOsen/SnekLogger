import React, { useMemo, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import {
  LineChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
} from "react-native-chart-kit";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { format } from "date-fns"; // <-- Import the format function
import EditHeader from "../../EditHeader";

// Helper: Generate an array of dates (as YYYY-MM-DD strings) from start to end (inclusive)
const generateDateRange = (startDate, endDate) => {
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

export default function PetDataScreen({ pet }) {
  const textColor = useThemeColor({}, "text");
  const screenWidth = Dimensions.get("window").width;
  const allFeedings = useSelector((state) => state.feedings);

  // Local states
  const [loading, setLoading] = useState(true);
  const [petFeedings, setPetFeedings] = useState([]);

  useEffect(() => {
    // Filter feedings for the current pet
    const filtered = allFeedings.filter(
      (feeding) => Number(feeding.petId) === Number(pet.id)
    );
    setPetFeedings(filtered);
    // Simulate a short delay for loading (adjust as needed)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [allFeedings, pet.id]);

  // All hooks are always called even if loading is true

  /* 
    1. Dynamic Aggregated Data (Only include days with feedings):
       Sum the preyWeight per day, and format those dates as "D MMM YY".
  */
  const aggregatedWeightData = useMemo(() => {
    const weightByDate = {};
    petFeedings.forEach((feeding) => {
      const dateKey = feeding.feedingDate.split("T")[0];
      if (!weightByDate[dateKey]) {
        weightByDate[dateKey] = {
          sum: feeding.preyWeight,
          weightType: feeding.preyWeightType, // store the feeding's preyWeightType
        };
      } else {
        weightByDate[dateKey].sum += feeding.preyWeight;
      }
    });
    const existingDates = Object.keys(weightByDate).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    if (existingDates.length === 0) {
      return { labels: [], dataPoints: [], weightTypes: [] };
    }
    const formattedLabels = existingDates.map((date) =>
      format(new Date(date), "d MMM yy")
    );
    const dataPoints = existingDates.map((date) => weightByDate[date].sum);
    const weightTypes = existingDates.map(
      (date) => weightByDate[date].weightType
    );
    return { labels: formattedLabels, dataPoints, weightTypes };
  }, [petFeedings]);

  /* 
    2. Data for a Pie Chart:
       Group feedings by preyType.
  */
  const pieChartData = useMemo(() => {
    const typeCounts = {};
    petFeedings.forEach((feeding) => {
      const type = feeding.preyType;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    const colors = ["#F68C1F", "#C62C2C", "#F47B27", "#E62B37", "#F05F31"];
    return Object.keys(typeCounts).map((type, index) => ({
      name: type,
      count: typeCounts[type],
      color: colors[index % colors.length],
      legendFontColor: textColor,
      legendFontSize: 12,
    }));
  }, [petFeedings, textColor]);

  /* 
    3. Data for a Progress Chart:
       Show the ratio of completed feedings.
  */
  const progressData = useMemo(() => {
    const total = petFeedings.length;
    if (total === 0) return [0];
    const completed = petFeedings.filter((f) => f.complete === 1).length;
    return [completed / total];
  }, [petFeedings]);

  /* 
    4. Dynamic Contribution Graph Data:
       Fill in all dates in the range with counts (0 if no feedings).
  */
  const contributionData = useMemo(() => {
    const countByDate = {};
    petFeedings.forEach((feeding) => {
      const dateKey = feeding.feedingDate.split("T")[0];
      countByDate[dateKey] = (countByDate[dateKey] || 0) + 1;
    });
    if (Object.keys(countByDate).length === 0) return [];
    const startDate = new Date(
      Math.min(...Object.keys(countByDate).map((d) => new Date(d)))
    );
    const endDate = new Date(
      Math.max(...Object.keys(countByDate).map((d) => new Date(d)))
    );
    const fullDates = generateDateRange(startDate, endDate);
    return fullDates.map((date) => ({ date, count: countByDate[date] || 0 }));
  }, [petFeedings]);

  // For the contribution graph, determine the total number of days and the end date
  const { numDays, contributionEndDate } = useMemo(() => {
    if (contributionData.length === 0)
      return {
        numDays: 0,
        contributionEndDate: new Date().toISOString().split("T")[0],
      };
    const firstDate = new Date(contributionData[0].date);
    const lastDate = new Date(
      contributionData[contributionData.length - 1].date
    );
    const days = Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;
    return {
      numDays: days,
      contributionEndDate: lastDate.toISOString().split("T")[0],
    };
  }, [contributionData]);

  // Dynamic width calculation for the first chart based on number of labels
  const dynamicChartWidth = useMemo(() => {
    const minWidth = screenWidth - 32;
    // Assume each label requires at least 80 pixels
    const calculatedWidth = aggregatedWeightData.labels.length * 80;
    return Math.max(minWidth, calculatedWidth);
  }, [aggregatedWeightData.labels.length, screenWidth]);

  // Shared chart configuration
  const chartConfig = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: { borderRadius: 16 },
  };

  return (
    <ScrollView style={styles.container}>
      <EditHeader
        label="Data"
        description="View info about your pet and their feedings over time."
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={textColor} />
        </View>
      ) : (
        <>
          {/* 1. Line Chart Display for Aggregated Prey Weight */}
          <ThemedText style={[styles.chartTitle, { color: textColor }]}>
            Prey Weight Over Time (Line Chart)
          </ThemedText>
          {aggregatedWeightData.labels.length > 0 ? (
            <View style={{ position: "relative", overflow: "visible" }}>
              <ScrollView horizontal>
                <LineChart
                  data={{
                    labels: aggregatedWeightData.labels,
                    datasets: [
                      { data: aggregatedWeightData.dataPoints, strokeWidth: 2 },
                    ],
                  }}
                  width={dynamicChartWidth}
                  height={300}
                  verticalLabelRotation={25}
                  chartConfig={chartConfig}
                  bezier
                  formatYLabel={(yValue) => `${yValue}`}
                  style={styles.chartStyle}
                  renderDotContent={({ x, y, index }) => {
                    const value = aggregatedWeightData.dataPoints[index];
                    const weightType =
                      aggregatedWeightData.weightTypes[index] || "";
                    const displayValue = value != null ? String(value) : "";
                    return (
                      <View
                        key={index}
                        style={{
                          position: "absolute",
                          left: x - 10,
                          top: y - 300,
                          zIndex: 999,
                          elevation: 10,
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          paddingHorizontal: 4,
                          borderRadius: 4,
                        }}
                      >
                        <Text style={{ fontSize: 12, color: "#000" }}>
                          {displayValue} {weightType}
                        </Text>
                      </View>
                    );
                  }}
                />
              </ScrollView>
            </View>
          ) : (
            <ThemedText style={{ color: textColor }}>
              No feeding data available.
            </ThemedText>
          )}

          {/* 2. Pie Chart Display with Legend Above */}
          <ThemedText style={[styles.chartTitle, { color: textColor }]}>
            Prey Type by Feedings
          </ThemedText>
          {pieChartData.length > 0 ? (
            <>
              {/* Custom Legend */}
              <View style={styles.legendContainer}>
                {pieChartData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendColorBox,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <Text
                      style={[
                        styles.legendText,
                        { color: item.legendFontColor },
                      ]}
                    >
                      {item.name} ({item.count})
                    </Text>
                  </View>
                ))}
              </View>
              <ScrollView horizontal>
                <PieChart
                  data={pieChartData}
                  width={screenWidth - 32}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="count"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                  style={styles.chartStyle}
                />
              </ScrollView>
            </>
          ) : (
            <ThemedText style={{ color: textColor }}>
              No feeding data available.
            </ThemedText>
          )}

          {/* 4. Contribution Graph Display (Horizontal Scroll) */}
          <ThemedText style={[styles.chartTitle, { color: textColor }]}>
            Feeding Calendar
          </ThemedText>
          <ScrollView horizontal>
            <ContributionGraph
              values={contributionData}
              endDate={contributionEndDate}
              numDays={numDays}
              width={screenWidth * 1.5}
              height={220}
              chartConfig={chartConfig}
              style={styles.chartStyle}
            />
          </ScrollView>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
    marginVertical: 2,
  },
  legendColorBox: {
    width: 12,
    height: 12,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
  },
});
