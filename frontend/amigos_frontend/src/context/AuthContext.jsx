// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const init = async () => {
      const user = localStorage.getItem("currentUser");
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
      await loadDummyData();
      setLoading(false);
    };
    init();
  }, []);

  // Dark mode effect
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const register = async (userData) => {
    const users = (await axios.get("/users")).data;
    const userExists = users.find(
      (u) => u.username === userData.username || u.email === userData.email,
    );

    if (userExists) {
      throw new Error("Username or email already exists");
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      bio: "",
      followers: [],
      following: [],
      createdAt: new Date().toISOString(),
    };

    await axios.post("/users", [...users, newUser]);
    return newUser;
  };

  const login = async (email, password) => {
    const users = (await axios.get("/users")).data;
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    setCurrentUser(userWithoutPassword);
    return userWithoutPassword;
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  const updateUser = async (updatedData) => {
    const users = (await axios.get("/users")).data;
    const userIndex = users.findIndex((u) => u.id === currentUser.id);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      await axios.post("/users", users);
      const updatedUser = { ...currentUser, ...updatedData };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      return updatedUser;
    }
    throw new Error("User not found");
  };

  const deleteUser = async () => {
    const users = (await axios.get("/users")).data;
    const filteredUsers = users.filter((u) => u.id !== currentUser.id);
    await axios.post("/users", filteredUsers);

    const posts = (await axios.get("/posts")).data;
    const filteredPosts = posts.filter((p) => p.userId !== currentUser.id);
    await axios.post("/posts", filteredPosts);

    logout();
  };

  const loadDummyData = async () => {
    try {
      const existingUsers = (await axios.get("/users")).data;
      console.log("Existing users count:", existingUsers.length);
      
      if (existingUsers.length === 0) {
        console.log("Loading dummy data...");
        const response = await fetch("/dummy-data.json");
        const dummyData = await response.json();
        
        console.log("Dummy users loaded:", dummyData.users.length);
        console.log("Dummy posts loaded:", dummyData.posts.length);
        
        await axios.post("/users", dummyData.users);
        await axios.post("/posts", dummyData.posts);
        
        console.log("Dummy data loaded successfully!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error loading dummy data:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        darkMode,
        setDarkMode,
        register,
        login,
        logout,
        updateUser,
        deleteUser,
        loadDummyData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};