import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  SafeAreaView,
  StatusBar,
  View,
  Text,

  useColorScheme,
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Credentials from '../features/credentials/Credentials';
import TaskScreen from '../features/task-list/TaskList';
import FinishedScreen from '../features/finished/FinishedList';
import ProfileScreen from './Profile';

import { RootState } from '../app/store';
import styles from '../styles/s-App';

const Drawer = createDrawerNavigator();

export default function TaskTracker():JSX.Element {
  const menu = useSelector((state: RootState) => state.commons.menuIndex);

  const colorScheme = useColorScheme() == 'dark' ? 'dark' : 'light';
  const [prevColorScheme, setPrevColorScheme] = useState(colorScheme);
  const [style, setStyle] = useState(styles(colorScheme));
  if (prevColorScheme != colorScheme) {
    setPrevColorScheme(colorScheme);
    setStyle(styles(colorScheme));
  }

  return (
    <SafeAreaView style = { style.topWindow }>

      <StatusBar barStyle = { colorScheme == 'dark' ? 'light-content': 'dark-content' } />
      <Header style = { style } colorScheme = { colorScheme } />
      {
        menu == 0 ? (
          <Credentials />
        ): (
          <>
            <Drawer.Navigator 
              initialRouteName = 'Tasks'
              screenOptions = {{
                headerShown: false,
              }}
            >
              <Drawer.Screen name = 'Tasks' component = { TaskScreen } />
              <Drawer.Screen name = 'Finished Tasks' component = { FinishedScreen } />
              <Drawer.Screen name = 'Profile' component = { ProfileScreen } />
            </Drawer.Navigator>
          </>
        )
      }
    </SafeAreaView>
  );
}

type HeaderProps = Readonly<{
  style: ReturnType <typeof styles>,
  colorScheme: 'light' | 'dark'
}>;
const Header = (props: HeaderProps): JSX.Element => {
  return (
    <>
      <View style = { props.style.containerTitle }>
        <View style = {{ flex: 1, justifyContent: 'center' }} >
          <Text style = { props.style.titleText }> Task Tracker </Text>
        </View>
      </View>
    </>
  )
};