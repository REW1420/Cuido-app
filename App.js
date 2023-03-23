import { View, Text } from 'react-native'
import React from 'react'

import { NavigationContainer } from '@react-navigation/native'
import LoginNav from './components/nagiation/LoginNav'

export default function App() {
  return (
   <>
   <NavigationContainer>
      <LoginNav/>
   </NavigationContainer>
   </>
  )
}