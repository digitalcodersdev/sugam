/* eslint-disable no-void */
/*
 * This function is used to return global methods
 * @author Kindajobs <mohitkumar.webdev@gmail.com>
 */
import React from 'react';

const defaultAuthFunctions = {
  signIn: () => void 0,
  signOut: () => void 0,
};

export const AuthContext = React.createContext(defaultAuthFunctions);

export const AuthContextProvider = ({children, value}) => (
  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
);
