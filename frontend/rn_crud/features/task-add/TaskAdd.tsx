import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { 
    View,
    TextInput,
    Button,

    Platform,
    useColorScheme,
    Pressable
}
from 'react-native';

import styles, { themes } from '../../styles/s-TaskAdd';
import { RootState } from '../../app/store';

import { addTask } from '../task-list/taskListSlice';

export default function TaskAdd(): JSX.Element {
    const tasks = useSelector((state: RootState) => state.tasks);
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState(1);
    const [desc, setDesc] = useState('');

    const colorScheme = useColorScheme() == 'dark' ? 'dark' : 'light';
    const [prevColorScheme, setPrevColorScheme] = useState(colorScheme);
    const [style, setStyle] = useState(styles(colorScheme));

    if (prevColorScheme != colorScheme) {
        setPrevColorScheme(colorScheme);
        setStyle(styles(colorScheme));
    }

    return (
        <>
        <View style = { style.containerPriority } >
            <Pressable 
                style = {[ style.prioritySelector, priority == 3 ? { backgroundColor: themes[colorScheme].BG_pr_high }: {} ]} 
                onPress = { () => { setPriority(3) } }
            ></Pressable>
            <Pressable 
                style = {[ style.prioritySelector, priority == 2 ? { backgroundColor: themes[colorScheme].BG_pr_medium }: {} ]} 
                onPress = { () => { setPriority(2) } }
            ></Pressable>
            <Pressable 
                style = {[ style.prioritySelector, priority == 1 ? { backgroundColor: themes[colorScheme].BG_pr_low }: {} ]} 
                onPress = { () => { setPriority(1) } }
            ></Pressable>
        </View>
        <View style = { style.containerInput }>
            <TextInput 
                style = { style.inputAdd } placeholderTextColor = { themes[colorScheme].FG_INPUT_primary_placeholder }
                placeholder = 'add a task' value = { title }
                onChangeText = { setTitle }
            />
            <View style = { style.buttonAddOuter }>
                <Button 
                    title = { String.fromCharCode(parseInt('FF0B', 16)) }
                    color = { Platform.OS == 'ios' ? themes[colorScheme].FG_BTN_primary : style.buttonAddOuter.backgroundColor }
                    onPress = {() => {
                        if (title.trim() != '') {
                            let id = tasks.reduce((res, x) => Math.max(res, x.id), 0) + 1;
                            dispatch(addTask({
                                id,
                                title,
                                desc: desc.trim(),
                                priority
                            }));
                        }
                        setTitle('');
                        setDesc('');
                    }}
                />
            </View>
        </View>
        <TextInput
            style = { style.desc } placeholderTextColor = { themes[colorScheme].FG_INPUT_primary_placeholder }
            onChangeText = { setDesc }
            placeholder = 'Add a description' value = { desc } multiline
        />
        </>
    );
}