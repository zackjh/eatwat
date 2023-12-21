import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import HomePage from "./components/HomePage";
import ManageGroupsPage from "./components/ManageGroupsPage";
import AddNewGroupPage from "./components/AddNewGroupPage";
import EditGroupPage from "./components/EditGroupPage";
import colors from "./colors";

const db = SQLite.openDatabase("eatwat.db");

export default function App() {
  const [currentPage, setCurrentPage] = useState({ name: "HomePage" });

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, eatery_names TEXT NOT NULL)"
      );
    });
  }, []);

  const updateCurrentPage = (newPageObject) => setCurrentPage(newPageObject);

  const insertGroupIntoDatabase = (groupName) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO groups (name, eatery_names) VALUES (?, ?)",
        [groupName, "[]"],
        (txObj, resultSet) =>
          console.log(`The group '${groupName}' has been added.`),
        (txObj, error) => console.error(error)
      );
    });
  };

  const updateEateryNamesByGroupId = (eateryNames, groupId) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE groups SET eatery_names = (?) WHERE id = (?)",
        [JSON.stringify(eateryNames), groupId],
        (txObj, resultSet) =>
          console.log(`The group with the id '${groupId}' has been updated.`),
        (txObj, error) => console.error(error)
      );
    });
  };

  const deleteGroup = (groupId) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM groups WHERE id = (?)",
        [groupId],
        (txObj, resultSet) =>
          console.log(`The group with the id '${groupId}' has been deleted.`),
        (txObj, error) => console.error(error)
      );
    });
  };

  switch (currentPage.name) {
    case "HomePage":
      pageToRender = <HomePage db={db} updateCurrentPage={updateCurrentPage} />;
      break;

    case "ManageGroupsPage":
      pageToRender = (
        <ManageGroupsPage db={db} updateCurrentPage={updateCurrentPage} />
      );
      break;

    case "AddNewGroupPage":
      pageToRender = (
        <AddNewGroupPage
          updateCurrentPage={updateCurrentPage}
          insertGroupIntoDatabase={insertGroupIntoDatabase}
        />
      );
      break;

    case "EditGroupPage":
      pageToRender = (
        <EditGroupPage
          db={db}
          groupId={currentPage.groupId}
          updateCurrentPage={updateCurrentPage}
          updateEateryNamesByGroupId={updateEateryNamesByGroupId}
          deleteGroup={deleteGroup}
        />
      );
      break;
  }

  return (
    <PaperProvider>
      <StatusBar style="light" />
      {pageToRender}
    </PaperProvider>
  );
}
