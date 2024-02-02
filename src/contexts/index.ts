import { createContext, Dispatch, SetStateAction } from 'react';
import { UserData } from '../types/userType';

export interface ITheme {
  theme: string
}

export interface AppContextProperties {
  user: UserData,
  setUser: Dispatch<SetStateAction<UserData>>,
  theme: ITheme,
  setTheme: Dispatch<SetStateAction<ITheme>>
}

const AppContext = createContext<AppContextProperties>({ 
  user: {
    _id: '',
    authenticated: false,
    account: "",
    role: false
  }, 
  setUser: () => {},
  theme: {
    theme: 'white'
  },
  setTheme: () => {}
});

export { AppContext };
