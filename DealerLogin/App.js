import * as React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, useColorScheme } from 'react-native';

import ApplicationFormScreen from './screens/ApplicationFormScreen';
import PendingFilesScreen from './screens/PendingFilesScreen';
import ViewLoanApplicationScreen from './screens/ViewLoanApplicationScreen';
import ApprovedFilesScreen from './screens/ApprovedFilesScreen';
import ViewRejectedApplicationScreen from './screens/ViewRejectedApplicationScreen';
import RejectedFilesScreen from './screens/RejectedFilesScreen';
import ViewApprovedApplicationScreen from './screens/ViewApprovedApplicationScreen';

import { ThemeProvider } from './theme/ThemeContext'; // you will create this file

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const colorScheme = useColorScheme(); // light or dark

  React.useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };
    checkLogin();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#3450A1" />
      </View>
    );
  }

  return (
    <ThemeProvider scheme={colorScheme}>
      <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator initialRouteName={isLoggedIn ? "Dashboard" : "Login"}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ApplyForm" component={ApplicationFormScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PendingFiles" component={PendingFilesScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ViewLoanApplicationScreen" component={ViewLoanApplicationScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ApprovedFiles" component={ApprovedFilesScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ViewApprovedApplicationScreen" component={ViewApprovedApplicationScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RejectedFiles" component={RejectedFilesScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ViewRejectedApplicationScreen" component={ViewRejectedApplicationScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
