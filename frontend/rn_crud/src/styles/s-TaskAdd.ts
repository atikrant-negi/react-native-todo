import { StyleSheet } from 'react-native';
import ColorsDark from './themes/theme-dark';
import ColorsLight from './themes/theme-light';

export const themes = {
    dark: ColorsDark,
    light: ColorsLight
};

const styles = (theme: Theme) => StyleSheet.create({
    
    // ---------- containers

    containerPriority: {
        flexDirection: 'row',
        height: 20,
        marginLeft: 20, marginTop: 20
    },
    containerInput: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 20, marginTop: 10, marginBottom: 10
    },

    // ---------- components

    prioritySelector: {
        backgroundColor: themes[theme].BG_BTN_secondary,
        width: 20,
        height: 20,
        marginRight: 10,
        borderRadius: 2
    },
    inputAdd: {
        backgroundColor: themes[theme].BG_INPUT_primary,
        flex: 1,
        padding: 10,
        borderBottomLeftRadius: 2,
        borderTopLeftRadius: 2,

        color: themes[theme].FG_INPUT_primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    buttonAddOuter: {
        backgroundColor: themes[theme].BG_BTN_primary,
        width: 40,
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    desc: {
        backgroundColor: themes[theme].BG_INPUT_primary,
        minHeight: 40,
        margin: 20, marginTop: 0,
        borderRadius: 2,
        padding: 10,
        color: themes[theme].FG_INPUT_primary
    },
});

type Theme = 'light' | 'dark';

export default styles;