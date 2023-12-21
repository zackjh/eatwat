import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, FAB, IconButton, Portal, Text } from "react-native-paper";
import SelectGroupDialog from "./SelectGroupDialog";
import RandomEateryGenerator from "./RandomEateryGenerator";
import colors from "../colors";

export default function HomePage({ db, updateCurrentPage }) {
  // Define state variables
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectGroupDialogVisible, setSelectGroupDialogVisible] =
    useState(false);
  const [randomlySelectedEatery, setRandomlySelectedEatery] = useState(null);

  // Define direct event handlers
  const handleManageGroupsButtonPress = () =>
    updateCurrentPage({ name: "ManageGroupsPage" });

  const handleSelectGroupButtonPress = () => setSelectGroupDialogVisible(true);

  const handleBackButtonPress = () => setRandomlySelectedEatery(null);

  // Define indirect event handlers

  const updateSelectedGroup = (nextSelectedGroup) =>
    setSelectedGroup(nextSelectedGroup);

  const hideSelectGroupDialog = () => setSelectGroupDialogVisible(false);

  const updateRandomlySelectedEatery = (updatedRandomlySelectedEatery) =>
    setRandomlySelectedEatery(updatedRandomlySelectedEatery);

  // Render random eatery generator page if there is no randomly selected eatery
  if (!randomlySelectedEatery) {
    return (
      <View style={styles.homePageContainer}>
        <Appbar.Header mode="small" style={styles.appbar}></Appbar.Header>
        <View style={styles.buttonContainer}>
          <FAB
            label={selectedGroup ? selectedGroup.name : "Select Group"}
            onPress={handleSelectGroupButtonPress}
            color={colors.text}
            style={
              selectedGroup
                ? styles.selectGroupButtonSelected
                : styles.selectGroupButton
            }
          />
          <IconButton
            icon="cog"
            iconColor={colors.onSecondaryGrey}
            onPress={handleManageGroupsButtonPress}
            style={styles.manageGroupsButton}
          />
        </View>
        <Portal>
          <SelectGroupDialog
            db={db}
            updateSelectedGroup={updateSelectedGroup}
            visible={selectGroupDialogVisible}
            hideDialog={hideSelectGroupDialog}
          />
        </Portal>
        {selectedGroup && (
          <RandomEateryGenerator
            key={selectedGroup}
            db={db}
            selectedGroupId={selectedGroup.id}
            updateRandomlySelectedEatery={updateRandomlySelectedEatery}
          />
        )}
      </View>
    );
  }

  // Render result page if there is a randomly selected eatery
  return (
    <View style={styles.homePageContainer}>
      <Appbar.Header mode="small" style={styles.appbar}>
        <Appbar.BackAction
          onPress={handleBackButtonPress}
          color={colors.onSecondaryGrey}
        />
      </Appbar.Header>
      <View style={styles.successMessageContainer}>
        <Text variant="headlineSmall" style={styles.successMessageSentence}>
          You will eat at:
        </Text>
        <Text variant="headlineLarge" style={styles.successMessageEatery}>
          {randomlySelectedEatery}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  homePageContainer: {
    height: "100%",
    backgroundColor: colors.backgroundGrey,
  },
  appbar: {
    backgroundColor: colors.secondaryGrey,
  },
  buttonContainer: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  selectGroupButton: {
    width: "60%",
    marginLeft: 45,
    backgroundColor: colors.secondaryGrey,
    borderRadius: 10,
  },
  selectGroupButtonSelected: {
    width: "60%",
    marginLeft: 45,
    backgroundColor: colors.secondaryGrey,
    borderWidth: 2,
    borderColor: colors.primaryPurple,
    borderRadius: 10,
  },
  manageGroupsButton: {
    width: 40,
    marginLeft: 5,
    marginRight: 0,
  },
  successMessageContainer: {
    marginTop: 200,
    alignItems: "center",
  },
  successMessageSentence: { color: colors.text },
  successMessageEatery: {
    marginTop: 20,
    color: colors.primaryPurple,
  },
});
