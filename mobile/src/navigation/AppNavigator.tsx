// navigation/AppNavigator.tsx

import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";

// Screens
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import MapScreen from "../screens/MapScreen";
import OccurrencesListScreen from "../screens/OccurrencesListScreen";
import AddOccurrenceScreen from "../screens/AddOccurrenceScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ==================== AUTH STACK ====================
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: "#fff",
        },
      } as any}
    >
      <Stack.Screen 
        name="LoginScreen" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// ==================== HOME STACK ====================
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      } as any}
    >
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
      <Stack.Screen
        name="OccurrenceDetail"
        component={DashboardScreen}
      />
    </Stack.Navigator>
  );
}

// ==================== OCCURRENCES STACK ====================
function OccurrencesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      } as any}
    >
      <Stack.Screen
        name="OccurrencesListScreen"
        component={OccurrencesListScreen}
      />
      <Stack.Screen
        name="AddOccurrence"
        component={AddOccurrenceScreen}
      />
      <Stack.Screen
        name="OccurrenceDetail"
        component={DashboardScreen}
      />
    </Stack.Navigator>
  );
}

// ==================== MAP STACK ====================
function MapStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      } as any}
    >
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
      />
    </Stack.Navigator>
  );
}

// ==================== PROFILE STACK ====================
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      } as any}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

// ==================== APP TABS ====================
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Map") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "Occurrences") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4ecdc4",
        tabBarInactiveTintColor: "#d1d5db",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          paddingTop: 8,
          paddingBottom: 12,
          height: 70,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: "Início",
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapStack}
        options={{
          tabBarLabel: "Mapa",
        }}
      />
      <Tab.Screen
        name="Occurrences"
        component={OccurrencesStack}
        options={{
          tabBarLabel: "Ocorrências",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: "Perfil",
        }}
      />
    </Tab.Navigator>
  );
}

// ==================== MAIN NAVIGATOR ====================
export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#4ecdc4" />
      </View>
    );
  }

  return (
    <NavigationContainer
      fallback={
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <ActivityIndicator size="large" color="#4ecdc4" />
        </View>
      }
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        } as any}
      >
        {isAuthenticated ? (
          <Stack.Group screenOptions={{ animationEnabled: false } as any}>
            <Stack.Screen name="AppTabs" component={AppTabs} />
          </Stack.Group>
        ) : (
          <Stack.Group screenOptions={{ animationEnabled: false } as any}>
            <Stack.Screen name="AuthStack" component={AuthStack} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ==================== TYPES ====================
declare global {
  namespace ReactNavigation {
    interface RootParamList {
      AuthStack: undefined;
      LoginScreen: undefined;
      AppTabs: undefined;
      Home: undefined;
      Occurrences: undefined;
      Profile: undefined;
      OccurrencesListScreen: undefined;
      AddOccurrence: undefined;
      OccurrenceDetail: { occurrenceId?: string };
      ProfileScreen: undefined;
    }
  }
}