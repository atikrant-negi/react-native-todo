import { StyleSheet } from "react-native";
import ColorsDark from "./themes/theme-dark";
import ColorsLight from "./themes/theme-light";

export const themes = {
    dark: ColorsDark,
    light: ColorsLight
};

const styles = (theme: Theme) => StyleSheet.create({
    topWindow: {
        backgroundColor: themes[theme].BG_main
    },

    // --------- containers

    containerMain: {
        height: '100%',
        width: '100%'
    },
    containerTitle: {
        backgroundColor: themes[theme].BG_primary,
        position: 'absolute', left: 0, top: 0,
        width: "100%",
        height: 50,
        justifyContent: 'center',
        borderBottomColor: themes[theme].FG_primary, borderBottomWidth: 3,
    },

    // ---------- nav

    navMenu: {
        position: 'absolute', right: 0, top: 0,
        width: 50,
        height: 47,
        justifyContent: 'center'
    },
    navMenuText: {
        color: themes[theme].FG_primary,
        top: -3,
        textAlign: 'center',
        fontSize: 30,
    },

    // ---------- menu modal

    modalMenuContainer: {
        height: '100%',
        backgroundColor: themes[theme].BG_MODAL_backdrop,
        justifyContent: 'flex-end',
        padding: 10
    },
    modalMenuItem: {
        backgroundColor: themes[theme].BG_secondary,
        height: 40,
        justifyContent: 'center',
        marginTop: 10
    },
    modalMenuItemText: {
        color: themes[theme].FG_secondary,
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    modalMenuButtonOuter: {
        backgroundColor: themes[theme].BG_BTN_primary,
        height: 40,
        justifyContent: 'center',
        overflow: 'hidden',
        marginTop: 10,
        borderRadius: 2
    },

    // ---------- components

    titleText: {
        color: themes[theme].FG_primary,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    }
});

type Theme = 'dark' | 'light';

export default styles;