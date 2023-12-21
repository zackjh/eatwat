import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, FAB, IconButton, List } from "react-native-paper";
import colors from "../colors.js";

export default function ManageGroupsPage({ db, updateCurrentPage }) {
  // Define state variables
  const [groups, setGroups] = useState([]);

  // Query database for all groups
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT id, name FROM groups",
        null,
        (txObj, resultSet) => setGroups(resultSet.rows._array),
        (txObj, error) => console.error(error)
      );
    });
  }, []);

  // Define direct event Handlers
  const handleBackButtonPress = () => updateCurrentPage({ name: "HomePage" });

  const handleGroupListItemPress = (groupId) =>
    updateCurrentPage({ name: "EditGroupPage", groupId: groupId });

  const handleAddNewGroupButtonPress = () =>
    updateCurrentPage({ name: "AddNewGroupPage" });

  return (
    <View style={styles.manageGroupsPageContainer}>
      <Appbar.Header mode="small" style={styles.appbar}>
        <Appbar.BackAction
          onPress={handleBackButtonPress}
          color={colors.onSecondaryGrey}
        />
        <Appbar.Content title="Manage Groups" color={colors.onSecondaryGrey} />
      </Appbar.Header>
      <ScrollView>
        {groups.map((group, index) => (
          <FAB
            key={group.id}
            size="small"
            label={group.name}
            onPress={() => handleGroupListItemPress(group.id)}
            color={colors.onSecondaryGrey}
            style={index === 0 ? styles.groupButtonFirst : styles.groupButton}
          />
        ))}
        <IconButton
          onPress={handleAddNewGroupButtonPress}
          icon="plus"
          mode="contained"
          iconColor={colors.onSecondaryGrey}
          containerColor={colors.secondaryGrey}
          style={styles.addNewGroupButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  manageGroupsPageContainer: {
    height: "100%",
    backgroundColor: colors.backgroundGrey,
  },
  appbar: {
    backgroundColor: colors.secondaryGrey,
  },
  groupButtonFirst: {
    width: "60%",
    marginTop: 35,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: colors.secondaryGrey,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    borderRadius: 10,
  },
  groupButton: {
    width: "60%",
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: colors.secondaryGrey,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    borderRadius: 10,
  },
  addNewGroupButton: {
    marginTop: 30,
    marginBottom: 40,
    alignSelf: "center",
  },
});
