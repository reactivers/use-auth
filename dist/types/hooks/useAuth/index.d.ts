import { Dispatch, SetStateAction } from 'react';
import { UserInfo } from './context';
interface IUseAuth {
    setToken: (token: string) => void;
    login: (data: any) => void;
    logout: () => void;
    setUser: Dispatch<SetStateAction<UserInfo>>;
    user: UserInfo;
    isLoggedIn: boolean;
    token: string;
}
declare const useAuth: () => IUseAuth;
export default useAuth;
