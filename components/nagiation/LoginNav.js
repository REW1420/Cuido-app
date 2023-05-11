import { View, Text } from "react-native";
import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import SingUp from "../screens/SingUp";
import MainNav from "./MainNav";

const Stack = createStackNavigator();

export default function LoginNav() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={"login"} component={Login} />
          <Stack.Screen name={"sing-up"} component={SingUp} />
          <Stack.Screen name="MainNav" component={MainNav} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
