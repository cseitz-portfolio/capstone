import { createTheme, CssBaseline, useMediaQuery, ThemeProvider } from "@mui/material";
import { AppProps } from "next/app";
import { useMemo } from "react";
import { QueryClient } from "react-query";
import { NavBar } from "../ui/components/navbar";
import '../ui/styles/global.scss';

export default function App({ Component, pageProps }: AppProps) {
    const prefersDarkMode = useMediaQuery(`(prefers-color-scheme: dark)`);
    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: prefersDarkMode ? 'dark' : 'light',
                background: {
                    default: prefersDarkMode ? '#35363a' : 'white',
                }
            },
            components: {
                MuiPagination: {
                    styleOverrides: {
                        ul: {
                            justifyContent: 'center'
                        }
                    }
                }
            }
        })
    }, [prefersDarkMode]);
    return <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar />
        <Component {...pageProps} />
    </ThemeProvider>
}