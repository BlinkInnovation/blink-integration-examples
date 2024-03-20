import 'react-native-gesture-handler';
import React from "react";
import Login from './Login';
import HomeTabs from './Home';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Authorise'
        screenOptions={{
          headerTitle: "Back to authorise"
        }}
      >
        <Stack.Screen name="Authorise" component={Login}
        options={{
            headerTitle: "Authorise Page",
        }}
        />
        <Stack.Screen name="Home" component={HomeTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}


