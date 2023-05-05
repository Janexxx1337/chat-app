import { useContext, createContext } from "react";
import { auth } from "./FirebaseConfig";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const value = {
        user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}