import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { FAB, List, Switch, Text } from "react-native-paper";
import EateryList from "./EateryList";
import colors from "../colors";

function selectRandomArrayElement(items, weightage, weighted) {
  if (weighted) {
    const weightedItems = [];

    for (let i = 0; i < items.length; i++) {
      currentItem = items[i];

      for (let j = 0; j < weightage[i]; j++) {
        weightedItems.push(currentItem);
      }
    }

    const randomIndex = Math.floor(Math.random() * 100);
    return weightedItems[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }
}

function generateRandomEatery(eateries, customPercentagesEnabled) {
  if (customPercentagesEnabled) {
    return selectRandomArrayElement(
      Object.keys(eateries),
      Object.values(eateries).map((percentage) => Number(percentage)),
      true
    );
  }
  return selectRandomArrayElement(Object.keys(eateries), null, false);
}

function createEateriesObject(eateryNames) {
  // Convert array of eatery names into an array of objects
  // E.g. [ "Eatery 1" ] => [ { "Eatery 1": { "selected": false } } ]
  eateriesArray = eateryNames.map((eateryName) => ({
    [eateryName]: { switchOn: true, percentage: "" },
  }));

  // Combine all objects in the array into a single object and return it
  return Object.assign({}, ...eateriesArray);
}

export default function RandomEateryGenerator({
  db,
  selectedGroupId,
  updateRandomlySelectedEatery,
}) {
  // Define state variables
  const [eateries, setEateries] = useState({});
  const [customPercentagesEnabled, setcustomPercentagesEnabled] =
    useState(false);

  // Query database for the selected group's eatery names
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT eatery_names FROM groups WHERE id = (?)",
        [selectedGroupId],
        (txObj, resultSet) =>
          setEateries(
            createEateriesObject(
              JSON.parse(resultSet.rows._array[0].eatery_names)
            )
          ),
        (txObj, error) => console.error(error)
      );
    });
  }, [selectedGroupId]);

  // Define direct event handlers
  const handleCustomPercentagesToggle = () =>
    setcustomPercentagesEnabled(!customPercentagesEnabled);

  const handleRandomiseButtonPress = () => {
    updateRandomlySelectedEatery(
      generateRandomEatery(
        activeEateriesAndPercentages,
        customPercentagesEnabled
      )
    );
  };

  // Define indirect event handlers
  const toggleEatery = (eateryName) => {
    const nextSwitchOn = !eateries[eateryName].switchOn;

    const nextEatery = {
      ...eateries[eateryName],
      switchOn: nextSwitchOn,
    };

    setEateries({
      ...eateries,
      [eateryName]: nextEatery,
    });
  };

  const updateEateryPercentage = (eateryName, updatedPercentage) => {
    const nextEatery = {
      ...eateries[eateryName],
      percentage: updatedPercentage,
    };

    setEateries({
      ...eateries,
      [eateryName]: nextEatery,
    });
  };

  // Get names of active eateries (i.e. eateries which are toggled 'on')
  const namesOfActiveEateries = Object.keys(eateries).filter(
    (eateryName) => eateries[eateryName].switchOn
  );

  // Create an object that maps active eatery names to their percentages
  const activeEateriesAndPercentages = {};

  namesOfActiveEateries.forEach((eateryName) => {
    activeEateriesAndPercentages[eateryName] = eateries[eateryName].percentage;
  });

  // Calculate sum of active eatery percentages
  const sumOfPercentages = Object.values(activeEateriesAndPercentages).reduce(
    (previousValue, currentValue) =>
      Number(previousValue) + Number(currentValue),
    0
  );

  return (
    <View style={styles.randomEateryGeneratorContainer}>
      <List.Item
        title="Use Custom Percentages"
        right={(props) => (
          <Switch
            {...props}
            value={customPercentagesEnabled}
            onValueChange={handleCustomPercentagesToggle}
            color={colors.primaryPurple}
            ios_backgroundColor={colors.secondaryGrey}
          />
        )}
        titleStyle={styles.customPercentageText}
        style={styles.customPercentageListItem}
      />
      <EateryList
        eateries={eateries}
        customPercentagesEnabled={customPercentagesEnabled}
        toggleEatery={toggleEatery}
        updateEateryPercentage={updateEateryPercentage}
      />
      <View style={styles.bottomContainer}>
        <Text variant="bodyLarge" style={styles.eateriesSelectedText}>
          {namesOfActiveEateries.length} Eateries Selected
        </Text>
        <FAB
          label={
            sumOfPercentages === 100 || !customPercentagesEnabled
              ? "¯\\_(ツ)_/¯"
              : "Percentages do not add up to 100%."
          }
          onPress={
            sumOfPercentages === 100 || !customPercentagesEnabled
              ? handleRandomiseButtonPress
              : null
          }
          color={
            sumOfPercentages === 100 || !customPercentagesEnabled
              ? colors.onPrimaryPurple
              : colors.textDisabled
          }
          style={
            sumOfPercentages === 100 || !customPercentagesEnabled
              ? styles.randomiseButton
              : styles.randomiseButtonDisabled
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  randomEateryGeneratorContainer: {
    height: "100%",
    marginTop: 20,
  },
  bottomContainer: {
    height: 380,
    paddingTop: 20,
    alignItems: "center",
  },
  customPercentageListItem: {
    height: 60,
    paddingLeft: 10,
  },
  customPercentageText: {
    color: colors.text,
  },
  eateriesSelectedText: {
    color: colors.text,
  },
  randomiseButton: {
    width: "80%",
    marginTop: 15,
    backgroundColor: colors.primaryPurple,
  },
  randomiseButtonDisabled: {
    width: "80%",
    marginTop: 15,
    backgroundColor: colors.secondaryGrey,
  },
});
