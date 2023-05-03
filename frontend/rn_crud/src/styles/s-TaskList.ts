import { StyleSheet, ViewStyle } from 'react-native';
import ColorsDark from './themes/theme-dark';
import ColorsLight from './themes/theme-light';

export const themes = {
    dark: ColorsDark,
    light: ColorsLight
}

const modalEditControlButton = (theme: Theme): ViewStyle => ({
    backgroundColor: themes[theme].BG_BTN_primary,
    flex: 0.5,
    height: 40,
    margin: 10,
    borderRadius: 2,
    justifyContent: 'center',
    overflow: 'hidden'
});

const styles = (theme: Theme) => StyleSheet.create({

    // ---------- style snippets

    colorPriorityLow: {
        backgroundColor: themes[theme].BG_pr_low,
    },
    colorPriorityMedium: {
        backgroundColor: themes[theme].BG_pr_medium,
    },
    colorPriorityHigh: {
        backgroundColor: themes[theme].BG_pr_high,
    },

    // ---------- containers

    tasksContainer: {
        flex: 1
    },

    // ---------- components

    priorityClass: {
        color: themes[theme].FG_main,
        margin: 10, marginTop: 0, marginLeft: 5,
        fontSize: 16,
        fontWeight: 'bold'
    },
    task: {
        backgroundColor: themes[theme].BG_secondary,
        flexDirection: 'row',
        height: 40,
        margin: 20, marginBottom: 10, marginTop: 0,
        borderRadius: 2,
        overflow: 'hidden'
    },
    status: {
        backgroundColor: themes[theme].BG_BTN_primary,
        width: 40,
        justifyContent: 'center',
    },
    statusIndicator: {
        textAlign: 'center',
        fontSize: 24,
        color: themes[theme].FG_BTN_primary
    },
    title: {
        flex: 1,
        paddingLeft: 10, paddingRight: 10,
        justifyContent: 'center',
    },
    titleText: {
        color: themes[theme].FG_secondary,
        fontSize: 12,
        fontWeight: 'bold'
    },
    edit: {
        backgroundColor: themes[theme].BG_BTN_secondary,
        width: 40,
        justifyContent: 'center'
    },
    editIndicator: {
        color: themes[theme].FG_BTN_secondary,
        textAlign: 'center',
        fontSize: 26
    },
    syncButton: {
        backgroundColor: themes[theme].BG_BTN_primary,
        position: 'absolute', right: 20, bottom: 20,
        width: 70, height: 70,
        borderRadius: 50,
        justifyContent: 'center'
    },

    // ---------- edit modal

    modalEditContainer: {
        backgroundColor: themes[theme].BG_MODAL_backdrop,
        height: '100%',
        justifyContent: 'flex-end'
    },
    modalEditTitle: {
        backgroundColor: themes[theme].BG_INPUT_primary,
        height: 50,
        margin: 10, marginTop: 20,
        borderRadius: 2,
        padding: 10,

        color: 'rgb(20 20 20)',
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalEditDesc: {
        backgroundColor: themes[theme].BG_INPUT_primary,
        minHeight: 50,
        marginLeft: 10, marginRight: 10,
        borderRadius: 2,
        padding: 10,

        color: 'rgb(20 20 20)',
        fontSize: 13
    },
    modalEditPriorityContainer: {
        flexDirection: 'row',
        height: 50,
    },
    modalEditPriority: {
        flex: 0.34,
        backgroundColor: themes[theme].BG_BTN_secondary,
        margin: 10, marginBottom: 0,
        borderRadius: 2,
        justifyContent: 'center'
    },
    modalEditPriorityText: {
        color: themes[theme].FG_BTN_secondary,
        textAlign: 'center'
    },
    modalEditControlContainer: {
        flexDirection: 'row'
    },
    modalEditControlCancel: {
        ...modalEditControlButton(theme),
        marginRight: 0
    },
    modalEditControlUpdate: modalEditControlButton(theme)
});

type Theme = 'dark' | 'light';

export type style = typeof styles
export default styles;