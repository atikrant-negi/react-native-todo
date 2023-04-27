import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AppDispatch, RootState } from '../../app/store';

import {
    View,
    TextInput,
    Button,

    Alert,
    Platform, 
    useColorScheme
} from 'react-native';

import { resetStatus } from './credentialsSlice';
import { setMenu } from '../commons/commonsSlice';
import styles, { themes } from '../../styles/s-Credentials';

// ---------- components

export default function Credentials(): JSX.Element {
    const credentials = useSelector((state: RootState) => state.credentials);
    const dispatch = useDispatch<AppDispatch>();

    const [type, setType]: ['login' | 'signup', Function] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(['', '']);

    const colorScheme = useColorScheme() == 'dark' ? 'dark': 'light';
    const [prevColorScheme, setPrevColorScheme] = useState(colorScheme);
    const [style, setStyle] = useState(styles(colorScheme));
    if (prevColorScheme != colorScheme) {
        setPrevColorScheme(colorScheme);
        setStyle(styles(colorScheme));
    }

    let resetAll = useCallback(() => {
        setName(''); setUsername('');
        setEmail(''); setPassword(['', '']);
    }, []);

    // handles login / singup success and failure
    useEffect(() => {
        if (type == 'login') {
            if (credentials.status == 'authorized') {
                resetAll();
                dispatch(setMenu(1));
                dispatch(resetStatus(undefined));
                dispatch({ type: 'LOAD_TASKS' });
            }
            else if (credentials.status == 'rejected') {
                setPassword(['', '']);
                dispatch(resetStatus(undefined));
                Alert.alert(credentials.statusText);
            }
        }
        else {
            if (credentials.status == 'created') {
                Alert.alert('Account created successfully');
                resetAll();
                dispatch(resetStatus(undefined));
            }
            else if (credentials.status == 'rejected') {
                Alert.alert(credentials.statusText);
                setPassword(['', '']);
                dispatch(resetStatus(undefined));
            }
        }
    }, [credentials, type]);

    return (
        <View style = { style.loginContainer }>
            {
                type != 'login' ? (
                    <>
                    <TextInput 
                        style = { style.textInput } placeholderTextColor = { themes[colorScheme].FG_INPUT_primary_placeholder }
                        value = { name } placeholder = 'full name'
                        onChangeText = { setName }
                    />
                    <TextInput 
                        style = { style.textInput } placeholderTextColor = { themes[colorScheme].FG_INPUT_primary_placeholder }
                        value = { email.toLowerCase() } placeholder = 'email'
                        onChangeText = { setEmail }
                    />
                    </>
                ): (<></>)
            }
            <TextInput 
                style = { style.textInput } placeholderTextColor = { themes[colorScheme].FG_INPUT_primary_placeholder }
                value = { username.toLowerCase() } placeholder = 'username'
                onChangeText = { setUsername } autoCapitalize = 'none'
            />
            <TextInput 
                style = { style.textInput } placeholderTextColor = { themes[colorScheme].FG_INPUT_primary_placeholder }
                value = { password[0] } placeholder = 'password' secureTextEntry = { true }
                onChangeText = {(x) => { setPassword([x, password[1]]) }} autoCapitalize = 'none'
            />
            {
                type != 'login' ? (
                    <TextInput 
                        style = { style.textInput } placeholderTextColor = { themes[colorScheme].FG_INPUT_primary_placeholder }
                        value = { password[1] } placeholder = 'confirm password' secureTextEntry = { true }
                        onChangeText = {(x) => { setPassword([password[0], x]); }} 
                    />
                ): (<></>)
            }
            <View style = { style.submitOuter }>
                <Button 
                    title = { type } 
                    color = { Platform.OS == 'ios' ? themes[colorScheme].FG_BTN_primary : themes[colorScheme].BG_BTN_primary }
                    onPress = {() => {
                        if (type == 'login') {
                            submitForm('login', { username, password: password[0] }, dispatch);
                        }
                        else {
                            submitForm('signup', {
                                name, username, email,
                                password: password[0], passwordConf: password[1]
                            }, dispatch);
                        }
                    }}
                />
            </View>
            <View style = { style.submitOuter }>
                <Button 
                    title = { type == 'login' ? 'new user' : 'existing user' } 
                    color = { Platform.OS == 'ios' ? themes[colorScheme].FG_BTN_primary : themes[colorScheme].BG_BTN_primary }
                    onPress = {() => { 
                        setType(type == 'login' ? 'sign up' : 'login');
                        setEmail(''); setName(''); setPassword(['', '']);
                    }}
                />
            </View>
        </View>
    );
};

// ---------- helper functions

function submitForm(type: 'login' | 'signup', cred: any, dispatch: Function): void {
    if (type == 'login') {
        if (!cred.username || !cred.password) {
            Alert.alert('All fields are required');
        }
        else if (cred.password.length < 8) { 
            Alert.alert('Password should be at least 8 characters long');
        }
        else {
            dispatch({ type: 'LOGIN', payload: cred })
        }
    }
    else {
        if (!cred.name || !cred.email || !cred.username || !cred.password || !cred.passwordConf) {
            Alert.alert('All fields are required');
        }
        else if (cred.password.length < 8) {
            Alert.alert('Password should be at least 8 characters long');
        }
        else if (cred.password != cred.passwordConf) {
            Alert.alert('Passwords do not match');
        }
        else {
            delete cred.passwordConf;
            dispatch({ type: 'SIGNUP', payload: cred });
        }
    }
};