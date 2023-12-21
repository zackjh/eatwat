import { ScrollView, StyleSheet, View } from "react-native";
import { List, Switch, Text, TextInput } from "react-native-paper";
import colors from "../colors";

export default function EateryList({
  eateries,
  customPercentagesEnabled,
  toggleEatery,
  updateEateryPercentage,
}) {
  // Define direct event handlers
  const handleEateryToggle = (eateryName) => toggleEatery(eateryName);

  const handleEateryPercentageChange = (eateryName, nextPercentage) =>
    updateEateryPercentage(eateryName, nextPercentage);

  // Render percentage text input fields for each eatery if custom percentages are enabled
  if (customPercentagesEnabled) {
    return (
      <ScrollView style={styles.eateryListContainer}>
        <List.Section style={styles.list}>
          {Object.keys(eateries).map((eateryName, index) => (
            <List.Item
              key={eateryName}
              title={eateryName}
              left={(props) => (
                <Switch
                  {...props}
                  value={eateries[eateryName].switchOn}
                  onValueChange={() => handleEateryToggle(eateryName)}
                  color={colors.primaryPurple}
                  ios_backgroundColor={colors.secondaryGrey}
                />
              )}
              right={(props) => (
                <View style={styles.listItemRightContainer}>
                  <TextInput
                    {...props}
                    inputMode="numeric"
                    value={eateries[eateryName].percentage.toString()}
                    onChangeText={(nextPercentage) =>
                      handleEateryPercentageChange(eateryName, nextPercentage)
                    }
                    maxLength={3}
                    mode="outlined"
                    textColor={colors.text}
                    selectionColor={colors.text}
                    outlineColor={colors.greyBorder}
                    activeOutlineColor={colors.greyBorder}
                    style={styles.percentageTextInput}
                  />
                  <Text style={styles.percentageUnit}>%</Text>
                </View>
              )}
              titleStyle={styles.listItemTitle}
              style={index === 0 ? styles.listItemFirst : styles.listItem}
            />
          ))}
        </List.Section>
      </ScrollView>
    );
  }

  // Render each eatery without percentage text input fields if custom percentages are disabled
  return (
    <ScrollView style={styles.eateryListContainer}>
      <List.Section style={styles.list}>
        {Object.keys(eateries).map((eateryName, index) => (
          <List.Item
            key={eateryName}
            title={eateryName}
            left={(props) => (
              <Switch
                {...props}
                value={eateries[eateryName].switchOn}
                onValueChange={() => handleEateryToggle(eateryName)}
                color={colors.primaryPurple}
                ios_backgroundColor={colors.secondaryGrey}
              />
            )}
            titleStyle={styles.listItemTitle}
            style={index === 0 ? styles.listItemFirst : styles.listItem}
          />
        ))}
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  eateryListContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.greyBorder,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorder,
  },
  list: {
    marginVertical: 0,
  },
  listItem: {
    height: 60,
    paddingLeft: 30,
    paddingRight: 40,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorder,
  },
  listItemFirst: {
    height: 60,
    paddingLeft: 30,
    paddingRight: 40,
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: colors.greyBorder,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorder,
  },
  listItemTitle: { color: colors.text },
  listItemRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  percentageTextInput: {
    width: 62,
    height: 30,
    bottom: 3,
    backgroundColor: colors.secondaryGrey,
    textAlign: "center",
  },
  percentageUnit: {
    marginLeft: 5,
    color: colors.text,
  },
});
