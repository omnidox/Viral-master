import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import UserInterface from './component/ui/UserInterface';
import Home from './page/Home';
import Post from './page/Post';
import PostCreate from "./page/PostCreate";
import PostEdit from './page/PostEdit';
import User from './page/User';
import UserPosts from './page/UserPosts';
import UserComments from './page/UserComments';
import UserBookmarks from './page/UserBookmarks';
import SettingsPage from './page/Settings';
import SettingsAccount from './page/SettingsAccount';
import SettingsPassword from './page/SettingsPassword';
import SearchPostPage from "./page/SearchPost";
import Error from "./page/Error";
import ListUsers from "./page/admin/ListUsers";

const App = () => {
    return <UserInterface>
        <Routes>
            <Route path='/' element={<Navigate to='/recent' />} />
            <Route path='/recent' element={<Home />} />
            <Route path='/popular' element={<Home popular />} />
            <Route path='/post' element={<Outlet />}>
                <Route path='create' element={<PostCreate />} />
                <Route path=':id/edit' element={<PostEdit />} />
                <Route path=':id' element={<Post />} />
            </Route>
            <Route path='/:username' element={<User />}>
                <Route path='posts' element={<UserPosts />} />
                <Route path='comments' element={<UserComments />} />
                <Route path='bookmarks' element={<UserBookmarks />} />
            </Route>
            <Route path='/settings/:id?' element={<SettingsPage />}>
                <Route path='account' element={<SettingsAccount />} />
                <Route path='password' element={<SettingsPassword />} />
            </Route>
            <Route path='/search' element={<Outlet />}>
                <Route path='post/:query' element={<SearchPostPage />} />
            </Route>
            <Route path='/admin'>
                <Route path='users' element={<ListUsers />} />
            </Route>
            <Route path='/*' element={<Error title={404} message="Requested page doesn't exist" />} />
        </Routes>
    </UserInterface>;
};

export default App;
