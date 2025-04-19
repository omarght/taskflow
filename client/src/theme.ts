import { createTheme } from '@mui/material/styles';

// Extend the default theme
declare module '@mui/material/styles' {
    interface CustomTheme {
      custom: {
        darkPaper: string;
        navBackgroundColor: string;
        navItemTextColor: string;
        navItemHoverColor: string;
        mobileNavTransformActive: string;
        mobileNavTransform: string;
        deleteButtonsBackground: string;
        deleteButtonsBackgroundHover: string;
        deleteButtonsText: string;
        editButtonsBackground: string;
        editButtonsBackgroundHover: string;
        editButtonsText: string;
      };
    }
    interface Theme extends CustomTheme {}
    interface ThemeOptions extends CustomTheme {}
}

const colors = {
    primary: "#007bff",
    primaryLight: "#5ac8fa",
    primaryDark: "#86aaf0",
    secondary: "#343a40",
    backgroundDefault: "#f8f9fa",
    backgroundPaper: "#ffffff",
    backgroundDarkPaper: "#ffffff",
    textPrimary: "#343a40",
    white: "#ffffff",
    deleteButtonsBackground: '#ee8484',
    deleteButtonsBackgroundHover: '#e63946',
    deleteButtonsText: '#ffffff',
    editButtonsBackground: '#86aaf0',
    editButtonsBackgroundHover: '#0056b3',
    editButtonsText: '#ffffff',
}

const theme = createTheme({
    palette: {
        mode: 'light', // or 'dark'
        primary: {
          main: colors.primary,
          light: colors.secondary,
          dark: colors.primaryDark,
          contrastText: colors.white,
        },
        secondary: {
          main: colors.secondary,
        },
        background: {
          default: colors.backgroundDefault,
          paper: colors.backgroundPaper,
        },
        text: {
          primary: colors.textPrimary
        }
    },
    custom: {
        darkPaper: colors.backgroundDarkPaper, // 💡 Add custom here
        navBackgroundColor: colors.secondary,
        navItemTextColor: colors.white,
        navItemHoverColor: colors.primaryDark,
        mobileNavTransformActive: "translateY(-200%)",
        mobileNavTransform: "translateY(0)",
        deleteButtonsBackground: colors.deleteButtonsBackground,
        deleteButtonsBackgroundHover: colors.deleteButtonsBackgroundHover,
        deleteButtonsText: colors.deleteButtonsText,
        editButtonsBackground: colors.editButtonsBackground,
        editButtonsBackgroundHover: colors.editButtonsBackgroundHover,
        editButtonsText: colors.editButtonsText,
    },
    typography: {
      fontFamily: 'Segoe UI, Helvetica Neue, Arial, sans-serif',
      h1: { fontSize: '2rem', fontWeight: 700 },
      h2: { fontSize: '1.5rem', fontWeight: 600 },
      body1: { fontSize: '1rem' },
    },
    spacing: 8, // 1 unit = 8px
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                  borderRadius: 8,
                  textTransform: "none",
                  padding: "10px 16px",
                  "&:hover": {
                    backgroundColor: colors.primary,
                    color: colors.white,
                  },
                },
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: 16,
                }
            }
        },
    }
});

export default theme;