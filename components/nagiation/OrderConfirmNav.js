import { View, Text } from 'react-native'
import React, { Component } from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack'
import ConfirmOrder from '../screens/ConfirmOrder'
import ConfirmDelivery from '../screens/ConfirmDelivery'

const Stack = createStackNavigator();

export default function LoginNav() {

    return (
      <>
        <Stack.Navigator screenOptions={{headerShown : false}}> 
        <Stack.Screen name={'confirm-order'} component={ConfirmOrder} />
          <Stack.Screen name={'confirm-delivery'} component={ConfirmDelivery}/>
        </Stack.Navigator>
       
      </>
    )
  }
  