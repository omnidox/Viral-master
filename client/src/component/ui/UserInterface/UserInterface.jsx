import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { smallBreakpoint } from '../../../const/layout';
import Footer from '../Footer';
import NavBar from '../NavBar';
import SideBar from '../SideBar';
import sidebarStyle from '../SideBar/SideBar.module.css';

const UserInterface = ({ children }) => {
    let sideBarRef = useRef(null);
    let navigate = useNavigate();

    const toggleHandler = () => {
        const windowWidth = window.innerWidth;
        if (windowWidth > smallBreakpoint) navigate('/');
        else sideBarRef.current.classList.toggle(sidebarStyle.collapse);
    };

    return (
        <div className='d-flex flex-column vh-100'>
            <div className='d-flex flex-column flex-grow-1'>
                <NavBar onToggle={toggleHandler} />
                <div className='d-flex flex-row flex-grow-1'>
                    <SideBar reference={sideBarRef} onClose={toggleHandler} />
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserInterface;
