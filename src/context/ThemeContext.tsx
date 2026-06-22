import { createContext, useState, useContext, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): Theme => {
    try {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "light" || storedTheme === "dark") {
            return storedTheme;
        }
    } catch { /* private browsing or storage unavailable */ }

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
    }

    return "light";
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        try { localStorage.setItem("theme", theme); } catch { /* storage unavailable */ }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
