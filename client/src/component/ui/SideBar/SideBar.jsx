import { useContext, useState } from 'react';
import { Role } from "../../../const/user";
import userContext from '../../../store/userContext';
import FlatButton from '../button/FlatButton';
import LoginSignup from "../modal/LoginSignupModal";
import style from './SideBar.module.css';

const SideBar = ({ onClose, reference }) => {
    const user = useContext(userContext);
    const isGuest = user.userRole === Role.Guest;
    const isAdmin = user.userRole === Role.Admin;

    // Modal to show to guests
    const [ showLoginSignupModal, setShowLoginSignupModal ] = useState({
        isShowing: false,
        message: '',
    });
    const showLoginSignupHandler = (_event, message = '') => setShowLoginSignupModal({
        isShowing: true,
        message,
    });
    const closeLoginSignupHandler = (_event, message = '') => setShowLoginSignupModal({
        isShowing: false,
        message,
    });
    const profileHandler = event => {
        if (isGuest) showLoginSignupHandler(event, 'Please login to view your profile');
        else onClose();
    }
    const postHandler = event => {
        if (isGuest) showLoginSignupHandler(event, 'Please login to post');
        else onClose();
    }
    const settingsHandler = event => {
        if (isGuest) showLoginSignupHandler(event, 'Please login to view your settings');
        else onClose();
    }

    return <>
        <div ref={reference} className={`bg-white border-end ${style.collapse} ${style.sidebar}`}>
            <div className='d-flex flex-column justify-items-stretch sticky-top overflow-hidden' style={{ top: '4em' }}>
                <FlatButton to='/recent' onClick={onClose} icon='fa-solid fa-clock-rotate-left' text='Recent' />
                <FlatButton to='/popular' onClick={onClose} icon='fa-solid fa-arrow-trend-up' text='Popular' />
                <hr className='my-2' />
                <FlatButton to={!isGuest ? `/@${user.username}` : undefined} onClick={profileHandler} icon='fa-regular fa-user' text='Profile' />
                <FlatButton to={!isGuest ? `/@${user.username}/bookmarks` : undefined} onClick={profileHandler} icon='fa-regular fa-bookmark' text='Bookmarks' />
                <FlatButton to={!isGuest ? '/post/create' : undefined} onClick={postHandler} icon='fa-regular fa-pen-to-square' text='Post' isHighlight />
                {isAdmin &&
                    <>
                        <hr className='my-2' />
                        <FlatButton to='/admin/users' onClick={postHandler} icon='fa-regular fa-user' text='All Users' />
                    </>}
                <hr className='my-2' />
                <FlatButton to={!isGuest ? '/settings' : undefined} onClick={settingsHandler} icon='fa-solid fa-gear' text='Settings' />
            </div>
        </div>
        <div onClick={onClose} className={`h-100 w-100 ${style.backdrop}`} />
        <LoginSignup show={showLoginSignupModal.isShowing} message={showLoginSignupModal.message} onClose={closeLoginSignupHandler} />
    </>;
};

export default SideBar;
