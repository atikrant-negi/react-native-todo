import { StyleSheet } from "react-native";
import ColorsLight from "./themes/theme-light";
import ColorsDark from "./themes/theme-dark";

export const themes = {
    dark: ColorsDark,
    light: ColorsLight
};

const styles = (theme: Theme) => StyleSheet.create({
    loginContainer: {
        flex: 1,
        margin: 20,
        justifyContent: 'flex-start'
    },

    textInput: {
        backgroundColor: themes[theme].BG_INPUT_primary,
        height: 50,
        padding: 10,
        marginBottom: 10, 
        borderRadius: 2,

        color: themes[theme].FG_INPUT_primary,
        fontWeight: 'bold'
    },
    submitOuter: {
        backgroundColor: themes[theme].BG_BTN_primary,
        height: 40,
        justifyContent: 'center',
        marginBottom: 10,
        borderRadius: 2,
        overflow: 'hidden'
    }
});

export type Theme = 'light' | 'dark';
export default styles;