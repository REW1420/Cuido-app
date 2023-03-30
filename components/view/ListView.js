import { StyleSheet, Text, View, ScrollView, SearchBar } from "react-native";
import React, { useState, useCallback, useRef } from "react";

import { ListItem, Avatar } from "react-native-elements";
import COLORS from "../config/COLORS";
import contactData from "../assets/data/contactsTest";

export default function ListView({ navigation }) {
  return contactData.map((item, i) => {
    return (
      <ScrollView>
        <ListItem
          key={i}
          bottomDivider
          style={{ backgroundColor: COLORS.secondary_backgroud, margin: 5 }}
          onPress={{item:item}}
        >
          <Avatar source={{ uri: item.logo }} />
          <ListItem.Content>
            <ListItem.Title>{item.name}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </ScrollView>
    );
  });
}

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: COLORS.secondary_backgroud,
  },
});
