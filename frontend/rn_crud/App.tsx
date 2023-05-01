import React, { useEffect, useState } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';

import {
  SafeAreaView,
  ScrollView,
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
import Credentials from './features/credentials/Credentials';
import TaskList from './features/task-list/TaskList';
import TaskAdd from './features/task-add/TaskAdd';

import store, { RootState, AppDispatch } from './app/store';
import { setMenu } from './features/commons/commonsSlice';
import { setCredentials } from './features/credentials/credentialsSlice';
import { useLogoutMutation, useDeleteTasksMutation, useAddTasksMutation } from './features/api/apiSlice';
import styles, { themes } from './styles/s-App';

export default function App(): JSX.Element {
  return (
    <Provider store = { store }>
      <TaskTracker />
    </Provider>
  );
}

const TaskTracker = () => {
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
      <StatusBar
        barStyle = { colorScheme == 'dark' ? 'light-content' : 'dark-content' }
      />
      <ScrollView style = { style.containerMain } bounces = { false } >
        <Header style = { style } colorScheme = { colorScheme } />
        {
          menu == 0 ? (
            <Credentials />
          ): menu == 1 ? (
            <>
              <TaskAdd />
              <TaskList />
            </>
          ) : (
            <></>
          )
        }

      </ScrollView>
    </SafeAreaView>
  );
}

type HeaderProps = Readonly<{
  style: ReturnType <typeof styles>,
  colorScheme: 'light' | 'dark'
}>;
const Header = (props: HeaderProps): JSX.Element => {
  const dispatch = useDispatch();
  const menu = useSelector((state: RootState) => state.commons.menuIndex);
  const tasks = useSelector((state: RootState) => state.tasks);
  const credentials = useSelector((state: RootState) => state.credentials);

  const [logout, logoutStatus] = useLogoutMutation();
  const [deleteTasks, deleteTasksStatus] = useDeleteTasksMutation();
  const [addTasks, addTasksStatus] = useAddTasksMutation();

  const [showMenu, setShowMenu] = useState(false);

  // check sync status
  useEffect(() => {
    if (addTasksStatus.isSuccess) {
      addTasksStatus.reset();
      Alert.alert('Sync successful');
    }
    else if (deleteTasksStatus.isSuccess) {
      addTasks({ ...credentials, tasks: tasks });
      deleteTasksStatus.reset();
    }
    else if (deleteTasksStatus.isError || addTasksStatus.isError) {
      Alert.alert('Sync Failed')
    }
  }, [deleteTasksStatus, addTasksStatus]);

  // check logout status
  useEffect(() => {
    if (logoutStatus.isSuccess) {
      dispatch(setCredentials({ username: '', sessionID: '' }));
      dispatch(setMenu(0));
    }
    else if (logoutStatus.isError) {
      const err = logoutStatus.error as any;
      Alert.alert(err.data.message);
    }
  }, [logoutStatus]);

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
          <MenuModal 
            style = { props.style } colorScheme = { props.colorScheme } 
            setShowMenu = { setShowMenu } logout = { logout } deleteTasks = { deleteTasks }
          />
        ): (
          <></>
        )
      }
    </>
  )
};

// todo: complete logout action
type MenuModalProps = HeaderProps & Readonly <{ 
  setShowMenu: Function,
  logout: Function,
  deleteTasks: Function
}>;
const MenuModal = (props: MenuModalProps): JSX.Element => {
  const menu = useSelector((state: RootState) => state.commons.menuIndex);
  const credentials = useSelector((state: RootState) => state.credentials);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    props.setShowMenu(false);
    props.logout(credentials);
  };

  const handleSync = () => {
    props.setShowMenu(false);
    props.deleteTasks(credentials);
  };

  return (
    <Modal
      animationType = 'slide'
      transparent = { true }
      supportedOrientations = {['portrait', 'landscape', 'landscape-left', 'landscape-right', 'portrait-upside-down']}
    >
      {/* Menu Navigation Buttons */}
      <View style = { props.style.modalMenuContainer } >
        <Pressable 
          style = {[
            props.style.modalMenuItem, 
            menu == 1 && { backgroundColor: themes[props.colorScheme].BG_secondary_highlight } 
          ]} onPress = {() => { dispatch(setMenu(1)); }}
        >
          <Text style = { props.style.modalMenuItemText } > Active Tasks </Text>
        </Pressable>
        <Pressable 
          style = {[
            props.style.modalMenuItem, 
            menu == 2 && { backgroundColor: themes[props.colorScheme].BG_secondary_highlight } 
          ]} onPress = {() => { dispatch(setMenu(2)); }}
        >
          <Text style = { props.style.modalMenuItemText } > Completed Tasks </Text>
        </Pressable>

        {/* Control Buttons */}
        <View style = { props.style.modalMenuButtonOuter } >
          <Button title = 'sync with server' color = { 
              Platform.OS == 'ios' ? themes[props.colorScheme].FG_BTN_primary : themes[props.colorScheme].BG_BTN_primary
            } onPress = { handleSync }
          />
        </View>
        <View style = { props.style.modalMenuButtonOuter } >
          <Button title = 'logout' color = { 
              Platform.OS == 'ios' ? themes[props.colorScheme].FG_BTN_primary : themes[props.colorScheme].BG_BTN_primary
            } onPress = {() => { 
              props.setShowMenu(false);
              Alert.alert("Are you sure you want to logout?", "", [
                { text: 'no', onPress: () => {} },
                { text: 'yes', onPress: handleLogout }
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