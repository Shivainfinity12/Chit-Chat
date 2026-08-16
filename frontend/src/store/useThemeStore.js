import { create } from "zustand";


// save the theme to the local storage so that whenever we refresh our page we still have the selected theme
export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "coffee",  // state
    
    setTheme: (theme) => {                     // set the function
        localStorage.setItem("chat-theme", theme);
        set({ theme });
    },
}));