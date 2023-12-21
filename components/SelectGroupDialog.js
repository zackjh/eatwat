import { useState, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Dialog, RadioButton } from "react-native-paper";
import colors from "../colors";

export default function SelectGroupDialog({
  db,
  updateSelectedGroup,
  hideDialog,
  visible,
}) {
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

  // Define direct event handlers
  const handleGroupSelected = (selectedGroup) => {
    updateSelectedGroup(selectedGroup);
    hideDialog();
  };

  return (
    <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
      <Dialog.Title style={styles.dialogTitle}>Select Group</Dialog.Title>
      <Dialog.ScrollArea style={styles.dialogContent}>
        <ScrollView>
          {groups.map((group, index) => (
            <RadioButton.Item
              key={group.id}
              label={group.name}
              onPress={() => handleGroupSelected(group)}
              labelStyle={styles.radioButtonLabel}
              style={index === 0 ? styles.radioButtonFirst : styles.radioButton}
            />
          ))}
        </ScrollView>
      </Dialog.ScrollArea>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: colors.secondaryGrey,
    height: "60%",
  },
  dialogTitle: {
    color: colors.text,
  },
  dialogContent: {
    paddingHorizontal: 0,
    borderTopColor: colors.greyBorder,
    borderBottomColor: colors.greyBorder,
  },
  radioButton: {
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorder,
  },
  radioButtonFirst: {
    borderTopWidth: 1,
    borderTopColor: colors.greyBorder,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorder,
  },
  radioButtonLabel: {
    color: colors.text,
  },
});
