import { StyleSheet, Dimensions } from "react-native";
import ColorsDark from "./themes/theme-dark";
import ColorsLight from "./themes/theme-light";

export const themes = {
    dark: ColorsDark,
    light: ColorsLight
};

const styles = (theme: Theme) => StyleSheet.create({
    topWindow: {
        backgroundColor: themes[theme].BG_main,
        flex: 1
    },

    // --------- containers

    containerTitle: {
        backgroundColor: themes[theme].BG_primary,
        height: 50,
        borderBottomColor: themes[theme].FG_primary, borderBottomWidth: 3,
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