import { createTheme } from '@rneui/themed';

export const colors = {
  maize: '#FFCB05',
  blue: '#00274C',
  blueLight: '#33597D',
  cream: '#F7F4ED',
  ink: '#17212B',
  muted: '#66717C',
  border: '#DCE2E7',
  danger: '#B42318',
};

const darkColors = {
  primary: colors.maize,
  secondary: '#8EBCE6',
  background: '#101820',
  surface: '#17212B',
  text: '#F7F4ED',
  muted: '#B4C0CA',
  border: '#405468',
  subtle: '#253443',
  onPrimary: '#17212B',
  danger: '#FFB4AB',
};

const lightPalette = {
  primary: colors.blue,
  secondary: colors.blueLight,
  background: colors.cream,
  surface: '#FFFFFF',
  text: colors.ink,
  muted: colors.muted,
  border: colors.border,
  subtle: '#EDF1F4',
  onPrimary: '#FFFFFF',
  danger: colors.danger,
};

export function getAppColors(isDark) {
  return isDark ? darkColors : lightPalette;
}

export const appTheme = createTheme({
  lightColors: {
    primary: colors.blue,
    secondary: colors.maize,
    background: colors.cream,
    white: '#FFFFFF',
    black: colors.ink,
    grey0: colors.ink,
    grey3: colors.muted,
    grey5: colors.border,
  },
  darkColors: {
    primary: darkColors.primary,
    secondary: darkColors.secondary,
    background: darkColors.background,
    white: darkColors.onPrimary,
    black: darkColors.text,
    grey0: darkColors.text,
    grey3: darkColors.muted,
    grey5: darkColors.border,
  },
  mode: 'light',
  components: {
    Button: {
      radius: 10,
      titleStyle: { fontWeight: '700' },
    },
    Card: {
      containerStyle: {
        borderRadius: 16,
        borderWidth: 0,
        margin: 0,
      },
    },
  },
});

export function getAppTheme(isDark) {
  return { ...appTheme, mode: isDark ? 'dark' : 'light' };
}
