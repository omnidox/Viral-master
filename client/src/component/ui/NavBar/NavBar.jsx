import { useContext, useState } from 'react';
import { Button, Dropdown, Navbar } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Role } from '../../../const/user';
import userContext from '../../../store/userContext';
import SearchBar from '../../form/SearchBar';
import LoginSignup from '../modal/LoginSignupModal';
import IconButton from "../button/IconButton";
import style from './NavBar.module.css'

const NavBar = ({ onToggle }) => {
    const user = useContext(userContext);
    const isGuest = user.userRole === Role.Guest;
    const isAdmin = user.userRole === Role.Admin;

    const navigate = useNavigate();
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
    const dropDownProfileHandler = event => {
        if (isGuest) showLoginSignupHandler(event, 'Please login to view your profile');
        else navigate(`/@${user.username}`);
    }
    const dropDownSettingsHandler = event => {
        if (isGuest) showLoginSignupHandler(event, 'Please login to view your settings');
        else navigate('/settings');
    }
    const dropDownLoginSignOutHandler = event => {
        if (isGuest) showLoginSignupHandler(event);
        else user.signOut();
    }

    return (
        <Navbar collapseOnSelect bg='dark' variant='dark' expand='md' sticky='top' className={`flex-row flex-nowrap gx-5 justify-content-between px-4 border-bottom border-1 ${style.blur}`}>
            {/* Brand button is used as a toggle switch */}
            <Navbar.Brand className='me-3 me-sm-0'>
                <Button onClick={onToggle} className='bg-transparent border-0 p-0'>
                    <small className='d-flex align-items-center'>
                        <img src='/logo512Alt.png' alt='logo' width={25} height={25} className='me-sm-3' />
                        <b className='d-none d-sm-block'>V I R A L</b>
                    </small>
                </Button>
            </Navbar.Brand>
            <SearchBar className='flex-grow-1 flex-sm-grow-0' />
            <div className='d-flex align-items-center ms-3 ms-sm-0'>
                {isGuest && <>
                    <Button onClick={showLoginSignupHandler} variant='danger' className='d-none d-sm-block rounded-5 bg-theme me-3'>
                        <i className="fa-solid fa-arrow-right-to-bracket me-2"></i>
                        <b>Login</b>
                    </Button>
                    <LoginSignup show={showLoginSignupModal.isShowing} message={showLoginSignupModal.message} onClose={closeLoginSignupHandler} />
                </>}
                {isAdmin && <>
                    <div className='d-flex align-items-center rounded-5 py-2 px-3 bg-theme me-3'>
                        <i className='fa-solid fa-shield-halved text-white me-2' />
                        <p className='fw-bold text-white'>Admin</p>
                    </div>
                    <LoginSignup show={showLoginSignupModal.isShowing} message={showLoginSignupModal.message} onClose={closeLoginSignupHandler} />
                </>}
                <Dropdown align='end'>
                    <Dropdown.Toggle className='d-flex align-items-center bg-transparent border-0 m-0 px-0 py-0' title=''>
                        {user.profilePicture ?
                            <img src={user.profilePicture} height={35} className='rounded-5' alt='User Profile' />
                            :
                            <i className="fa-regular fa-user text-white" style={{ fontSize: '1.2em' }} />
                        }
                        <i className="fa-solid fa-chevron-down ms-2"  style={{ fontSize: '0.7em' }} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu variant='dark' className={`border-0 ${style.blur}`}>
                        <Dropdown.Item onClick={dropDownProfileHandler} className='d-flex py-2 align-items-center'>
                            <i className="fa-regular fa-user me-3" />
                            Profile
                        </Dropdown.Item>
                        <Dropdown.Item onClick={dropDownSettingsHandler} className='d-flex py-2 align-items-center'>
                            <i className="fa-solid fa-gear me-3" />
                            Settings
                        </Dropdown.Item>
                        <Dropdown.Divider  />
                        <Dropdown.Item onClick={dropDownLoginSignOutHandler} className='bg-transparent'>
                            <IconButton icon='fa-solid fa-arrow-right-to-bracket' text={isGuest ? 'Login' : 'Sign out'} className='w-100' pillVariant />
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </Navbar>
    )
}

export default NavBar;
