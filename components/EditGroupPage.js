import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, FAB, IconButton, TextInput } from "react-native-paper";
import colors from "../colors";

export default function EditGroupPage({
  db,
  groupId,
  updateCurrentPage,
  updateEateryNamesByGroupId,
  deleteGroup,
}) {
  // Define state variables
  const [eateryNames, setEateryNames] = useState([]);

  // Query database for the selected group's current eatery names
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT eatery_names FROM groups WHERE id = (?)",
        [groupId],
        (txObj, resultSet) =>
          setEateryNames(JSON.parse(resultSet.rows._array[0].eatery_names)),
        (txObj, error) => console.error(error)
      );
    });
  }, []);

  // Define direct event handlers
  const handleBackButtonPress = () =>
    updateCurrentPage({ name: "ManageGroupsPage" });

  const handleEateryNameChange = (nextEateryName, eateryIndex) => {
    const nextEateryNames = eateryNames.map((eateryName, index) => {
      if (index === eateryIndex) {
        return nextEateryName;
      }
      return eateryName;
    });

    setEateryNames(nextEateryNames);
  };

  const handleDeleteEateryButtonPress = (eateryIndex) => {
    const nextEateryNames = eateryNames.filter(
      (eateryName, index) => index !== eateryIndex
    );

    setEateryNames(nextEateryNames);
  };

  const handleAddAnotherEateryButtonPress = () =>
    setEateryNames([...eateryNames, ""]);

  const handleSaveButtonPress = () => {
    updateEateryNamesByGroupId(eateryNames, groupId);
    updateCurrentPage({ name: "ManageGroupsPage" });
  };

  const handleDeleteGroupButtonPress = () => {
    deleteGroup(groupId);
    updateCurrentPage({ name: "ManageGroupsPage" });
  };

  return (
    <View style={styles.editGroupPageContainer}>
      <Appbar.Header mode="small" style={styles.appbar}>
        <Appbar.BackAction
          onPress={handleBackButtonPress}
          color={colors.onSecondaryGrey}
        />
        <Appbar.Content title="Edit Group" color={colors.onSecondaryGrey} />
      </Appbar.Header>
      <ScrollView style={{ paddingTop: 20 }}>
        {eateryNames.map((eateryName, index) => (
          <View key={index} style={styles.listItem}>
            <TextInput
              inputMode="text"
              value={eateryName}
              onChangeText={(nextEateryName) =>
                handleEateryNameChange(nextEateryName, index)
              }
              mode="outlined"
              textColor={colors.text}
              selectionColor={colors.text}
              outlineColor={colors.greyBorder}
              activeOutlineColor={colors.greyBorder}
              style={styles.eateryNameInput}
            />
            <IconButton
              icon="close"
              onPress={() => handleDeleteEateryButtonPress(index)}
              iconColor={colors.greyBorder}
              style={styles.deleteEateryButton}
              size={24}
            />
          </View>
        ))}
        <IconButton
          onPress={handleAddAnotherEateryButtonPress}
          icon="plus"
          mode="contained"
          iconColor={colors.onSecondaryGrey}
          containerColor={colors.secondaryGrey}
          style={styles.addAnotherEateryButton}
        />
        <FAB
          label="Save Changes"
          onPress={eateryNames.includes("") ? null : handleSaveButtonPress}
          color={
            eateryNames.includes("")
              ? colors.textDisabled
              : colors.onPrimaryPurple
          }
          style={
            eateryNames.includes("")
              ? styles.saveButtonDisabled
              : styles.saveButton
          }
        />
        <FAB
          label="Delete Group"
          onPress={handleDeleteGroupButtonPress}
          color={colors.onErrorRed}
          style={styles.deleteButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  editGroupPageContainer: {
    height: "100%",
    backgroundColor: colors.backgroundGrey,
  },
  appbar: {
    backgroundColor: colors.secondaryGrey,
  },
  listItem: {
    width: "80%",
    marginTop: 10,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  eateryNameInput: {
    width: "80%",
    height: 45,
    bottom: 3,
    marginLeft: 45,
    backgroundColor: colors.secondaryGrey,
    textAlign: "center",
  },
  deleteEateryButton: {
    width: 40,
    marginLeft: 5,
    marginRight: 0,
  },
  addAnotherEateryButton: {
    marginTop: 15,
    alignSelf: "center",
  },
  saveButton: {
    width: "55%",
    marginTop: 40,
    alignSelf: "center",
    backgroundColor: colors.primaryPurple,
  },
  saveButtonDisabled: {
    width: "55%",
    marginTop: 40,
    alignSelf: "center",
    backgroundColor: colors.secondaryGrey,
  },
  deleteButton: {
    width: "40%",
    marginTop: 20,
    marginBottom: 55,
    alignSelf: "center",
    backgroundColor: colors.errorRed,
  },
});
