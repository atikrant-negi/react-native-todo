import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../../app/store';

import {
    View,
    TextInput,
    Button,

    Alert,
    Platform, 
    useColorScheme
} from 'react-native';

import { setCredentials } from './credentialsSlice';
import { setMenu } from '../commons/commonsSlice';
import { useLoginMutation, useSignupMutation } from '../api/apiSlice';
import styles, { themes } from '../../styles/s-Credentials';

// ---------- components

export default function Credentials(): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();

    const [login, loginStatus] = useLoginMutation();
    const [signup, signupStatus] = useSignupMutation();

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

    const resetAll = () => {
        setName(''); setUsername('');
        setEmail(''); setPassword(['', '']);
    };

    const handleLogin = async () => {
        if (type == 'login' && !loginStatus.isLoading) {
            if (canSubmitForm('login', { username, password: password[0] })) {
                login({ username, password: password[0] });
            }
        }
        else if (!signupStatus.isLoading) {
            if (canSubmitForm('signup', {
                name, email, username,
                password: password[0],
                passwordConf: password[1]
            })) {
                signup({ name, email, username, password: password[0] });
            }
        }
    };

    // handles login / singup success and failure
    useEffect(() => {
        if (type == 'login') {
            if (loginStatus.isSuccess) {
                const data = loginStatus.data;
                resetAll();
                dispatch(setCredentials(data));
                dispatch(setMenu(1));
            }
            else if (loginStatus.isError) {
                let err = loginStatus.error as any;
                Alert.alert(err.data.message);
            }
        }
        else {
            if (signupStatus.isSuccess) {
                Alert.alert('Account created successfully');
                resetAll();
                setType('login');
            }
            else if (signupStatus.isError) {
                let err = signupStatus.error as any;
                Alert.alert(err.data.message);
                setPassword(['', '']);
            }
        }
    }, [loginStatus, signupStatus, type]);

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
                    onPress = { handleLogin }
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

function canSubmitForm(type: 'login' | 'signup', cred: any): boolean {
    if (type == 'login') {
        if (!cred.username || !cred.password) {
            Alert.alert('All fields are required');
            return false;
        }
        else return true;
    }
    else {
        if (!cred.name || !cred.email || !cred.username || !cred.password || !cred.passwordConf) {
            Alert.alert('All fields are required');
            return false;
        }
        else if (cred.password.length < 8) {
            Alert.alert('Password should be at least 8 characters long');
            return false;
        }
        else if (cred.password != cred.passwordConf) {
            Alert.alert('Passwords do not match');
            return false;
        }
        else return true;
    }
};