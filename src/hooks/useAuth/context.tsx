import { useLocalStorage } from "@reactivers/use-local-storage";
import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useCallback, useContext, useEffect, useState } from "react";

interface AuthContextProps {
    localStorageTokenKeyName: string;
    user?: UserInfo;
    setUser: Dispatch<SetStateAction<UserInfo>>;
    setToken: (token: string) => void;
    onLogin: (info: UserInfo) => void;
    onLogout: () => void;
}

interface AuthProviderProps {
    localStorageTokenKeyName?: string;
    authTokenKeyName?: string;
    initialCheckToken?: boolean;
    user?: UserInfo;
    onLogin?: (info: UserInfo) => void;
    onLogout?: () => void;
}

export interface UserInfo {
    username?: string;
    token?: string;
    isLoggedIn: boolean;
    userInfo?: any;
}

const AuthContext = createContext({} as AuthContextProps);

const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({
    authTokenKeyName = 'token',
    localStorageTokenKeyName = "token",
    user: _user,
    onLogin: _onLogin,
    onLogout: _onLogout,
    initialCheckToken,
    children
}) => {

    const { getItem, removeItem, setItem } = useLocalStorage(localStorageTokenKeyName)
    const [user, setUser] = useState<UserInfo>({
        ..._user,
        token: getItem()
    });

    const onLogin = useCallback((info) => {
        const oldToken = getItem();
        const newToken = info[authTokenKeyName];

        if (!oldToken || !!newToken) {
            setItem(newToken)
        }

        const newUser = {
            token: newToken || oldToken,
            ...(info || {})
        };

        setUser({
            ...newUser,
            isLoggedIn: true
        })
        if (_onLogin) _onLogin(info)
    }, [_onLogin, authTokenKeyName])

    const onLogout = useCallback(() => {
        setUser({
            isLoggedIn: false,
        })
        removeItem()
        if (_onLogout) _onLogout()
    }, [_onLogout])

    const setToken = useCallback((token?: string) => {
        if (token === undefined) {
            setUser(old => ({
                ...old,
                isLoggedIn: false,
                token: undefined
            }))
            removeItem()
        } else {
            setUser((old) => ({ ...old, token }))
            setItem(token)
        }
    }, [])

    useEffect(() => {
        if (initialCheckToken) {
            const oldToken = getItem();
            if (oldToken) {
                setToken(oldToken)
            }
        }
    }, [initialCheckToken, setToken])

    return (
        <AuthContext.Provider value={{
            localStorageTokenKeyName,
            user,
            setUser,
            setToken,
            onLogin,
            onLogout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthContext.Provider');
    }
    return context;
};

AuthProvider.defaultProps = {
    localStorageTokenKeyName: "token",
    authTokenKeyName: "token",
    user: { isLoggedIn: false },
    initialCheckToken: true,
}

export default AuthProvider;
