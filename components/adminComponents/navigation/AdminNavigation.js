import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CrudContacts from '../screens/CrudContacts'
import CcrudOrders from "../screens/crudOrders";
import CrudProducts from "../screens/crudProducts";

import Icon from "react-native-vector-icons/Ionicons";

export default function AdminNavigation() {
  const TabBar = createBottomTabNavigator();

  return (
    <TabBar.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "CrudOrders":
              iconName = focused ? "layers" : "layers-outline";
              break;
            case "CrudContacts":
              iconName = focused ? "person" : "person-outline";
              break;
            case "CrudProducts":
              iconName = focused ? "cart" : "cart-outline";
              break;
          }
          size = focused ? 30 : 25;
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#71747C",
        tabBarInactiveTintColor: "#671517",
        headerShown: false,
        tabBarShowLabel: false,
      })}
    >
      <TabBar.Screen name="CrudOrders" component={CcrudOrders} />
      <TabBar.Screen name="CrudContacts" component={CrudContacts} />
      <TabBar.Screen name="CrudProducts" component={CrudProducts} />
    </TabBar.Navigator>
  );
}
