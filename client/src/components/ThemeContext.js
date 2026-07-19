
import React, { createContext, useState, useContext, useEffect } from 'react';
import { lightTheme, darkTheme } from '../components/themes'; // Define your themes

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
 const [theme, setTheme] = useState("light");

  // Check for saved theme in localStorage
 useEffect(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  }
}, []);

const toggleTheme = () => {
  const newTheme = theme === "light" ? "dark" : "light";
  setTheme(newTheme);
  localStorage.setItem("theme", newTheme);
};

useEffect(() => {
  document.body.classList.toggle("dark-theme", theme === "dark");
  document.body.classList.toggle("light-theme", theme === "light");
}, [theme]);


const themeObject = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeObject, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
