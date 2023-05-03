import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Pressable,
  Modal,
  Button,

  useColorScheme,
  Platform,
  Alert
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Credentials from '../credentials/Credentials';
import TaskScreen from '../task-list/TaskList';
import FinishedScreen from '../finished/FinishedList';

import { RootState, AppDispatch } from '../../app/store';
import { setMenu } from '../commons/commonsSlice';
import { logout, resetStatus } from '../credentials/credentialsSlice';
import { syncTasks, resetSyncStatus } from '../task-list/taskListSlice';
import styles, { themes } from '../../styles/s-App';

const Drawer = createDrawerNavigator();

export default function TaskTracker():JSX.Element {
    const dispatch = useDispatch<AppDispatch>();
    const menu = useSelector((state: RootState) => state.commons.menuIndex);
    const syncStatus = useSelector((state: RootState) => state.tasks.syncStatus);
    const credentials = useSelector((state: RootState) => state.credentials);
    
    const colorScheme = useColorScheme() == 'dark' ? 'dark' : 'light';
    const [prevColorScheme, setPrevColorScheme] = useState(colorScheme);
    const [style, setStyle] = useState(styles(colorScheme));
    if (prevColorScheme != colorScheme) {
      setPrevColorScheme(colorScheme);
      setStyle(styles(colorScheme));
    }
  
    // check the status of logout action
    useEffect(() => {
      if (credentials.status == 'destroyed') {
        dispatch(resetStatus(undefined));
        dispatch(setMenu(0));
      }
      else if (menu != 0 && credentials.status == 'rejected') {
        Alert.alert(credentials.statusText);
        dispatch(resetStatus(undefined));
      }
    }, [credentials]);
  
    // check the status of syncing with the server
    useEffect(() => {
      if (syncStatus == 'synced') {
        dispatch(resetSyncStatus(undefined));
        Alert.alert('sync successful');
      }
      else if (syncStatus == 'rejected') {
        dispatch(resetStatus(undefined));
        Alert.alert('sync failed');
      }
    }, [syncStatus]);
  
    return (
      <SafeAreaView style = { style.topWindow }>
        <StatusBar hidden />
        <Header style = { style } colorScheme = { colorScheme } />
        {
          menu == 0 ? (
            <Credentials />
          ): (
            <Drawer.Navigator 
              initialRouteName = 'Tasks'
              screenOptions = {{
                headerShown: false,
              }}
            >
              <Drawer.Screen name = 'Tasks' component = { TaskScreen } />
              <Drawer.Screen name = 'Finished Tasks' component = { FinishedScreen } />
            </Drawer.Navigator>
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
    const menu = useSelector((state: RootState) => state.commons.menuIndex);
    const [showMenu, setShowMenu] = useState(false);
  
    return (
      <>
        <View style = { props.style.containerTitle }>
          <Text style = { props.style.titleText }> Task Tracker </Text>
          {
            menu != 0 ? (
              <Pressable style = { props.style.navMenu } onPress = { () => setShowMenu(true) }>
                <Text style = { props.style.navMenuText }> { String.fromCharCode(parseInt('2630', 16)) } </Text>
              </Pressable>
            ) : (
              <></>
            )
          }
        </View>
        <View style = {{ marginTop: 50 }} ></View>
        {
          showMenu ? (
            <MenuModal style = { props.style } colorScheme = { props.colorScheme } setShowMenu = { setShowMenu } />
          ): (
            <></>
          )
        }
      </>
    )
  };
  
  type MenuModalProps = HeaderProps & Readonly <{ 
    setShowMenu: Function 
  }>;
  const MenuModal = (props: MenuModalProps): JSX.Element => {
    const dispatch = useDispatch<AppDispatch>();
  
    return (
      <Modal
        animationType = 'slide'
        transparent = { true }
        supportedOrientations = {['portrait', 'landscape', 'landscape-left', 'landscape-right', 'portrait-upside-down']}
      >
        <View style = { props.style.modalMenuContainer } >

          <View style = { props.style.modalMenuButtonOuter } >
            <Button title = 'sync with server' color = { 
                Platform.OS == 'ios' ? themes[props.colorScheme].FG_BTN_primary : themes[props.colorScheme].BG_BTN_primary
              } onPress = {() => {
                props.setShowMenu(false);
                dispatch(syncTasks());
              }}
            />
          </View>
          <View style = { props.style.modalMenuButtonOuter } >
            <Button title = 'logout' color = { 
                Platform.OS == 'ios' ? themes[props.colorScheme].FG_BTN_primary : themes[props.colorScheme].BG_BTN_primary
              } onPress = {() => { 
                props.setShowMenu(false);
                Alert.alert("Are you sure you want to logout?", "", [
                  { text: 'no', onPress: () => {  } },
                  { text: 'yes', onPress: () => { dispatch(logout(undefined)) } }
                ])
              }}
            />
          </View>
          <View style = { props.style.modalMenuButtonOuter } >
            <Button title = 'close' color = { 
                Platform.OS == 'ios' ? themes[props.colorScheme].FG_BTN_primary : themes[props.colorScheme].BG_BTN_primary
              } onPress = {() => { props.setShowMenu(false); }}
            />
          </View>
  
        </View>
      </Modal>
    );
  }