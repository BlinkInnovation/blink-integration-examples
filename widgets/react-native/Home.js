import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import WidgetView from './Widget';

const Tab = createBottomTabNavigator();

export default function HomeTabs({ navigation }) {
  return (
    <Tab.Navigator initialRouteName="Dashboard">
        <Tab.Screen
        name="Dashboard"
        component={WidgetView}
        initialParams={{ view: "insurance" }}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Passengers"
        component={WidgetView}
        initialParams={{ view: "account/passengers" }}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={WidgetView}
        initialParams={{ view: "account" }}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="account-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f9ff",
  },
  homeContainer: {
    marginTop: 20,
    alignItems: "center",
    width: "80%",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  cardText: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
