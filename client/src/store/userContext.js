import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { createContext, useState } from 'react';
import { Role } from '../const/user';
import { stateHelper } from "../util/state";
import Loading from "../component/ui/Loading";

const UserContext = createContext({
    // Attributes
    username: '',
    id: 0,
    userRole: Role.Guest,
    profilePicture: '',
    // Methods
    setUsername: () => {},
    setProfilePicture: () => {},
    login: () => {},
    signOut: () => {},
    signUp: () => {},
});

const InitialState = {
    username: '',
    id: 0,
    role: Role.Guest,
    profilePicture: '',
}

export function UserContextProvider({ children }) {
    const [ userState, setUserState ] = useState(InitialState);

    const setUserStateHelper = entry => stateHelper(setUserState, entry);
    const setUsernameHandler = username => setUserStateHelper({ username });
    const setProfilePictureHandler = profilePicture => setUserStateHelper({ profilePicture });
    const loginHandler = (username, password, onSuccess, onError) => {
        axios.post('/api/v1/auth/login', { username, password }).then(res => {
            const data = res.data;
            setUserState({
                username: data.username,
                id: data.id,
                role: data.role,
                profilePicture: data.profilePicture,
            });
            onSuccess(data);
        }).catch(onError);
    };
    const signOutHandler = () => {
        axios.get('/api/v1/auth/logout').then(() => setUserState(InitialState));
    };
    const signUpHandler = (data, onSuccess, onError) => {
        axios.post('/api/v1/auth/signup', data).then(res => {
            const data = res.data;
            setUserState({
                username: data.username,
                id: data.id,
                role: data.role,
                profilePicture: data.profilePicture,
            });
            onSuccess(data);
        }).catch(onError);
    };

    const context = {
        username: userState.username,
        userRole: userState.role,
        id: userState.id,
        profilePicture: userState.profilePicture,
        setUsername: setUsernameHandler,
        setProfilePicture: setProfilePictureHandler,
        login: loginHandler,
        signOut: signOutHandler,
        signUp: signUpHandler,
    };

    const pingUserQuery = useQuery(['userPing'], () => (
        axios.get(`/api/v1/auth/ping`).then(res => res.data)
    ), {
        onSettled: data => {
            // Set user state if data is not empty (user is currently logged in)
            if (data) setUserStateHelper({
                username: data.username,
                id: data.id,
                profilePicture: data.profilePicture,
                role: data.role,
            });
        },
        cacheTime: 0,
        refetchOnWindowFocus: false,
    });

    return (
        <UserContext.Provider value={context}>
            {pingUserQuery.isLoading ? <Loading className='vh-100' /> : children}
        </UserContext.Provider>
    );
}

export default UserContext;
