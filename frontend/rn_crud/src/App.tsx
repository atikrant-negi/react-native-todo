import 'react-native-gesture-handler';

import React from 'react';
import { Provider } from 'react-redux';

import { useColorScheme } from 'react-native';
import TaskTracker from './components/TaskTracker';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import store from './app/store';

import { themes } from './styles/s-App';

export default function App(): JSX.Element {
  const isDarkMode = useColorScheme() == 'dark';
  const navTheme = isDarkMode ? {
    dark: true,
    colors: {
      ...DefaultTheme.colors,
      primary: 'rgb(180 210 240)',
      background: themes['dark'].BG_main,
      card: themes['dark'].BG_primary,
      text: themes['dark'].FG_main
    }
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'rgb(90 105 120)',
      background: themes['light'].BG_main,
      card: themes['light'].BG_primary
    }
  }

  return (
    <Provider store = { store }>
      <NavigationContainer theme = { navTheme } >
        <TaskTracker />
      </NavigationContainer>
    </Provider>
  );
};