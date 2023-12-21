import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, FAB, TextInput } from "react-native-paper";
import colors from "../colors";

export default function AddNewGroupPage({
  updateCurrentPage,
  insertGroupIntoDatabase,
}) {
  // Define state variables
  const [groupName, setGroupName] = useState("");

  // Define direct event handlers
  const handleBackButtonPress = () =>
    updateCurrentPage({ name: "ManageGroupsPage" });

  const handleAddNewGroupButtonPress = () => {
    insertGroupIntoDatabase(groupName);
    updateCurrentPage({ name: "ManageGroupsPage" });
  };

  return (
    <View style={styles.addNewGroupPageContainer}>
      <Appbar.Header mode="small" style={styles.appbar}>
        <Appbar.BackAction
          onPress={handleBackButtonPress}
          color={colors.onSecondaryGrey}
        />
        <Appbar.Content title="Add New Group" color={colors.onSecondaryGrey} />
      </Appbar.Header>
      <View style={styles.formContainer}>
        <TextInput
          inputMode="text"
          value={groupName}
          onChangeText={(nextGroupName) => setGroupName(nextGroupName)}
          mode="outlined"
          textColor={colors.text}
          selectionColor={colors.text}
          outlineColor={colors.greyBorder}
          activeOutlineColor={colors.greyBorder}
          style={styles.groupNameInput}
        />
        <FAB
          label="Create New Group"
          onPress={() => handleAddNewGroupButtonPress(groupName)}
          color={colors.onPrimaryPurple}
          style={styles.addNewGroupButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addNewGroupPageContainer: {
    height: "100%",
    backgroundColor: colors.backgroundGrey,
  },
  appbar: { backgroundColor: colors.secondaryGrey },
  formContainer: { marginTop: 200 },
  groupNameInput: {
    width: "60%",
    alignSelf: "center",
    backgroundColor: colors.secondaryGrey,
    textAlign: "center",
  },
  addNewGroupButton: {
    width: "50%",
    marginTop: 30,
    alignSelf: "center",
    backgroundColor: colors.primaryPurple,
  },
});
