import { StyleSheet } from "react-native";
import ColorsLight from "./themes/theme-light";
import ColorsDark from "./themes/theme-dark";

export const themes = {
    dark: ColorsDark,
    light: ColorsLight
};

const styles = (theme: Theme) => StyleSheet.create({
    loginContainer: {
        margin: 20,
    },

    textInput: {
        backgroundColor: themes[theme].BG_INPUT_primary,
        height: 50,
        padding: 10,
        marginBottom: 10,
        borderRadius: 2,

        color: themes[theme].FG_INPUT_primary,
        fontWeight: 'bold',
    },
    submitOuter: {
        backgroundColor: themes[theme].BG_BTN_primary,
        height: 50,
        marginBottom: 10,
        borderRadius: 2,
        justifyContent: 'center'
    }
});

export type Theme = 'light' | 'dark';
export default styles;