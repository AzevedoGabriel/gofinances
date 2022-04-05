import React, { createContext, ReactNode, useContext } from 'react';

import * as AuthSession from 'expo-auth-session';

interface AuthProviderProps{
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: StoreExceptionsInformation;
}

interface AuthContextData {
    user: User;
    signInWithGoogle(): Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({children}: AuthProviderProps){
    const user = {
        id: '1',
        name: 'Gabriel',
        email: 'gabriel.gemeo@gmail.com'
    };

    async function signInWithGoogle() {
        try {
            const CLIENT_ID = '994099202931-gge2hjmilmmgg771cuc2vkucu12ej1oc.apps.googleusercontent.com';
            const REDIRECT_URI = 'https://auth.expo.io/@gabriel.azevedo/gofinances';
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email');

            const authUrl = `https://accounts.googl.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope${SCOPE}`;

            const response = AuthSession.startAsync({ authUrl });

        } catch (error) {
            throw new Error(error);
        }
    }

    return (
        <AuthContext.Provider value={{ 
            user,
            signInWithGoogle 
            }}>
          {children}
        </AuthContext.Provider>
    )
}

function useAuth(){
    const context = useContext(AuthContext);
    
    return context;
}

export { AuthProvider, useAuth}