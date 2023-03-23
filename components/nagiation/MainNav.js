import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/home'

const Tab = createBottomTabNavigator();

export default function MainNav() {
  return (
   <Tab.Navigator>
    <Tab.Screen name='home' component={Home}/>
   </Tab.Navigator>
  )
}

