import React, { createContext, useEffect, useReducer, ReactNode } from "react";
import AuthReducer from "./AuthReducer";

interface AuthState {
  currentUser: any;
}

interface AuthContextProps {
  currentUser: any;
  dispatch: React.Dispatch<any>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const INITIAL_STATE: AuthState = {
  currentUser: JSON.parse(localStorage.getItem("user") as string) || null,
};

export const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  dispatch: () => null,
});

export const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.currentUser));
  }, [state.currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
