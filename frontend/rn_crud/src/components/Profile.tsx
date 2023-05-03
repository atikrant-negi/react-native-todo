import { useEffect, useState } from 'react';
import { View, Button, Alert, useColorScheme, Platform } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../app/store';
import { RootState } from '../app/store';

import { logout, resetStatus } from '../features/credentials/credentialsSlice';
import { setMenu } from '../features/commons/commonsSlice';

import styles, { themes } from '../styles/s-Profile';

export default function ProfileScreen():JSX.Element {
    const dispatch = useDispatch<AppDispatch> ();
    const credentials = useSelector((state: RootState) => state.credentials);
    const menu = useSelector((state: RootState) => state.commons.menuIndex);

    const colorScheme = useColorScheme() == 'dark' ? 'dark' : 'light';
    const [prevColorScheme, setPrevColorScheme] = useState(colorScheme);
    const [style, setStyle] = useState(styles(colorScheme));
    if (colorScheme != prevColorScheme) {
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
    }, [credentials, menu]);

    return (
        <View style = { style.profileContainer }>
            <View style = { style.btnOuter }>
                <Button 
                    title = 'logout' 
                    color = { Platform.OS == 'ios' ? themes[colorScheme].FG_BTN_primary : themes[colorScheme].BG_BTN_primary }
                    onPress = {() => {
                        Alert.alert('Log out?', 'All unsaved data will be lost', [
                            { text: 'no', onPress: () => {} },
                            { text: 'yes', onPress: () => { dispatch(logout(null)); } }
                        ])
                    }}
                />
            </View>
        </View>
    );
}