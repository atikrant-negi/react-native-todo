import { memo, useState, createContext, Context, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    View,
    Text,
    Pressable,
    Modal,
    TextInput,
    Button,

    Platform,
    useColorScheme,
} from 'react-native';
import TaskAdd from '../task-add/TaskAdd';

import { RootState } from '../../app/store';
import { TaskState } from './taskListSlice';

import { removeTask, updateTask } from './taskListSlice';
import { addFinished } from '../finished/finishedSlice';

import styles, { themes } from '../../styles/s-TaskList';
import { ScrollView } from 'react-native-gesture-handler';

const StyleContext = createContext<any>(null);
const ThemeContext = createContext<'light' | 'dark'>('dark');

export default function TaskScreen(): JSX.Element {
    return (
        <>
            <TaskAdd />
            <ScrollView bounces = { false }>
                <TaskList />
            </ScrollView>
        </>
    );
}

export function TaskList(): JSX.Element {
    const tasks = useSelector((state: RootState) => state.tasks.tasks);

    const colorScheme = useColorScheme() == 'dark' ? 'dark' : 'light';
    const [editID, setEditID] = useState(-1);
    const [prevColorScheme, setPrevColorScheme] = useState(colorScheme);
    const [style, setStyle] = useState(styles(colorScheme));

    if (prevColorScheme != colorScheme) {
        setPrevColorScheme(colorScheme);
        setStyle(styles(colorScheme));
    }

    const activeTask = editID >= 0 ? tasks.find(x => x.id == editID) : undefined;
    let pHigh: Array <TaskState> = [], pMedium: Array <TaskState> = [], pLow: Array <TaskState> = [];
    tasks.forEach(x => {
        if (x.priority == 3) pHigh.push(x);
        if (x.priority == 2) pMedium.push(x); 
        if (x.priority == 1) pLow.push(x); 
    })

    return (
        <ThemeContext.Provider value = { colorScheme }>
        <StyleContext.Provider value = { style }>
            { pHigh.length > 0 && <Text style = { style.priorityClass }> Priority: High </Text> }
            <View style = { style.tasksContainer }>
            {
                pHigh.map((x: TaskState) => (
                    <Task 
                        key = { x.id }
                        {...x}
                        setEditID = { setEditID }
                    />
                ))
            }
            </View>
            { pMedium.length > 0 && <Text style = { style.priorityClass }> Priority: Medium </Text> }
            {
                pMedium.map((x: TaskState) => (
                    <Task 
                        key = { x.id }
                        {...x}
                        setEditID = { setEditID }
                    />
                ))
            }
            { pLow.length > 0 && <Text style = { style.priorityClass }> Priority: Low </Text> }
            {
                pLow.map((x: TaskState) => (
                    <Task 
                        key = { x.id }
                        {...x}
                        setEditID = { setEditID }
                    />
                ))
            }
            { activeTask && <EditModal {...activeTask} setEditID = { setEditID } /> }
        </StyleContext.Provider>
        </ThemeContext.Provider>
    );
}

const Task = memo(function Task(props: TaskState & { setEditID: Function }): JSX.Element {
    const dispatch = useDispatch();
    const style = useContext(StyleContext);

    return (
        <View style = { style.task }>
            <Pressable 
                style = { style.status }
                onPress = {() => {
                    dispatch(removeTask(props.id));
                    dispatch(addFinished({
                        title: props.title,
                        desc: props.desc,
                        addDate: props.addDate
                    }));
                }}
            >
                <Text style = { style.statusIndicator }>{ String.fromCharCode(10008) }</Text>
            </Pressable>
            <View style = { style.title } >
                <Text style = { style.titleText }>{ props.title.toUpperCase() }</Text>
            </View>
            <Pressable 
                style = { style.edit }
                onPress = {() => {
                    props.setEditID(props.id);
                }}
            >
                <Text style = { style.editIndicator } >{ String.fromCharCode(parseInt('00B7', 16)).repeat(3) }</Text>
            </Pressable>
        </View>
    );
});

const EditModal = (props: TaskState & {setEditID: Function}): JSX.Element => {
    const [title, setTitle] = useState(props.title);
    const [desc, setDesc] = useState(props.desc);
    const [priority, setPriority] = useState(props.priority);

    const dispatch = useDispatch();
    const style = useContext(StyleContext);
    const theme = useContext(ThemeContext);
    
    return (
        <Modal
            animationType = 'slide'
            transparent = { true }
            supportedOrientations = {['portrait', 'landscape', 'portrait-upside-down', 'landscape-left', 'landscape-right']}
        >
            <View style = { style.modalEditContainer } >
                <TextInput
                    style = { style.modalEditTitle } placeholderTextColor = 'rgb(170 170 170)'
                    value = { title } onChangeText = { setTitle } placeholder = 'Add a title'
                />
                <TextInput 
                    style = { style.modalEditDesc } placeholderTextColor = 'rgb(170 170 170)'
                    value = { desc } onChangeText = { setDesc } placeholder = 'Add a description'
                    multiline = { true }
                />
                <View style = { style.modalEditPriorityContainer }>
                    <Pressable 
                        style = {[ 
                            style.modalEditPriority, 
                            priority == 1 ? style.colorPriorityLow : {} 
                        ]}
                        onPress = {() => setPriority(1)}
                    >
                        <Text style = { style.modalEditPriorityText }>LOW</Text>
                    </Pressable>
                    <Pressable 
                        style = {[
                            style.modalEditPriority, 
                            { marginRight: 0, marginLeft: 0 },
                            priority == 2 ? style.colorPriorityMedium : {} 
                        ]}
                        onPress = {() => setPriority(2)}
                    >
                        <Text style = { style.modalEditPriorityText }>MEDIUM</Text>
                    </Pressable>
                    <Pressable 
                        style = {[
                            style.modalEditPriority,
                            priority == 3 ? style.colorPriorityHigh : {}  
                        ]}
                        onPress = {() => setPriority(3)}
                    >
                        <Text style = { style.modalEditPriorityText }>HIGH</Text>
                    </Pressable>
                </View>
                <View style = { style.modalEditControlContainer } >
                    <View style = { style.modalEditControlCancel }>
                        <Button 
                            title = 'cancel'
                            color = { Platform.OS == 'ios' ? themes[theme].FG_BTN_primary : themes[theme].BG_BTN_primary }
                            onPress = {() => {
                                props.setEditID(-1);
                                setPriority(props.priority);
                                setDesc(props.desc);
                                setTitle(props.title);
                            }}
                        />
                    </View>
                    <View style = { style.modalEditControlUpdate }>
                        <Button 
                            title = 'udpate' 
                            color = { Platform.OS == 'ios' ? themes[theme].FG_BTN_primary : themes[theme].BG_BTN_primary }
                            onPress = {() => {
                                if (title.trim() == '') return;
                                props.setEditID(-1);
                                dispatch(updateTask({ 
                                    id: props.id, title: title.trim(), 
                                    desc: desc.trim(), priority 
                                }));
                                setTitle(title.trim());
                                setDesc(desc.trim());
                            }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}