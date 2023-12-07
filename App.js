import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, Appbar } from 'react-native-paper';
import Malas from './components/Malas';
import Lembretes from './components/Lembretes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MalaProvider } from './components/MalaContext';
import { LembreteProvider } from './components/LembreteContext';

const Stack = createStackNavigator();

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  
  useEffect(() => {
    const retrieveTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme !== null) {
          setIsDarkTheme(storedTheme === 'dark');
        }
      } catch (error) {
        console.error('Error retrieving theme from AsyncStorage:', error);
      }
    };
    
    retrieveTheme();
  }, []);
  
  const HeaderRight = ({ toggleTheme }) => (
    <Appbar.Header>
    <Appbar.Action icon="lightbulb-outline" color={isDarkTheme ? 'white' : 'black'} onPress={toggleTheme} />
    </Appbar.Header>
    );
    
    const toggleTheme = () => {
      const newTheme = !isDarkTheme;
      setIsDarkTheme(newTheme);
      const storeTheme = async () => {
        try {
          await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
        } catch (error) {
          console.error('Error storing theme in AsyncStorage:', error);
        }
      };
      
      storeTheme();
    };
    
    return (
      <MalaProvider isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme}>
      <LembreteProvider isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme}>
      <PaperProvider theme={isDarkTheme ? DarkTheme : DefaultTheme}>
      <NavigationContainer theme={isDarkTheme ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="Malas">
      <Stack.Screen
      name="Malas"
      component={Malas}
      initialParams={{ isDarkTheme }}
      options={{
        headerRight: () => <HeaderRight toggleTheme={toggleTheme} />,
        headerRightContainerStyle: {
          top: -10,
        },
      }}
      />
      <Stack.Screen
      name="Lembretes"
      component={Lembretes}
      initialParams={{ isDarkTheme }}
      options={{
        headerRight: () => <HeaderRight toggleTheme={toggleTheme} />,
        headerRightContainerStyle: {
          top: -10,
        },
      }}
      />
      </Stack.Navigator>
      </NavigationContainer>
      </PaperProvider>
      </LembreteProvider>
      </MalaProvider>
      );
    }
    