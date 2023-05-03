import { StyleSheet } from 'react-native';
import ColorsDark from './themes/theme-dark';
import ColorsLight from './themes/theme-light';

export const themes = {
    dark: ColorsDark,
    light: ColorsLight
};

const styles = (theme: 'dark' | 'light') => StyleSheet.create({
    // ---------- containers

    profileContainer: {
        flex: 1,
        padding: 10,
    },

    // ---------- buttons

    btnOuter: {
        backgroundColor: themes[theme].BG_BTN_primary,
        height: 40,
        borderRadius: 2,
        marginBottom: 10,
        overflow: 'hidden',
        justifyContent: 'center'
    }
});

export default styles;