import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../screens/Profile';
import Store from '../screens/Store';
import Contats from '../screens/Contats';

import Icon  from 'react-native-vector-icons/Ionicons';


export default function MainNav() {

const TabBar = createBottomTabNavigator();

  return (
    <TabBar.Navigator screenOptions={({route})=>({
      tabBarIcon:({focused,color,size})=>{
          let iconName

          switch(route.name) {
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                  break;
              case 'Store':
                iconName = focused ? 'cart' : 'cart-outline';
                  break;
              case 'Contacts':
                iconName = focused ? 'call' : 'call-outline';
                  break;
                 
          }
          size= focused ? 35 : 30;
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor:'#71747C',
        tabBarInactiveTintColor:'#671517',
        headerShown:false,
        tabBarShowLabel:false,
        
  })}>
      <TabBar.Screen name='Profile' component={Profile} />
      <TabBar.Screen name='Store' component={Store}/>
      <TabBar.Screen name='Contacts' component={Contats}/>
  </TabBar.Navigator>
  )
}

