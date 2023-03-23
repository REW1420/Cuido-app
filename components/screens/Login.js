import * as React from 'react';
import { Text, View, StyleSheet,Button } from 'react-native';


export default function Login({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{color:'red',fontSize:40,}}>login</Text>
      <Button
        title="Continue"
        onPress={() => navigation.navigate('MainNav')}
      />
      <Button
        title="Sing up"
        onPress={() => navigation.navigate('sing-up')}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  
});