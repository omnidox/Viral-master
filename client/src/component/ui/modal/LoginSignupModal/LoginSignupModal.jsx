import { useState } from "react";
import { Modal } from "react-bootstrap";
import LoginForm from "../../../form/LoginForm";
import SignupForm from "../../../form/SignupForm";
import FakeLinkButton from "../../button/FakeLinkButton";
import IconButton from "../../button/IconButton";

const ModalState = {
    Login: 'Login',
    Signup: 'Sign up',
};

const LoginSignupModal = ({ show, onClose, message }) => {
    const [ modalState, setModalState ] = useState(ModalState.Login);
    const toggleModalStateHandler = () => {
        setModalState(modalState === ModalState.Login ? ModalState.Signup : ModalState.Login)
    };
    const isLogin = modalState === ModalState.Login;

    const onSuccessHandler = () => {
        // Close Modal
        onClose();
    }

    return (
        <Modal size='md' show={show} onHide={onClose} backdropClassName='backdrop-theme' centered>
            <Modal.Header className='border-0' closeButton>
                <Modal.Title className='d-flex align-content-baseline fw-bold text-theme'>
                    <img src='/logo512.png' alt='logo' width={40} height={40} className='me-2' />
                    {modalState}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='pt-2 pb-0'>
                {message && <p className='mb-2 fw-bold text-secondary'>{message}</p>}
                {isLogin ?
                    <LoginForm onSuccess={onSuccessHandler} />
                    :
                    <SignupForm onSuccess={onSuccessHandler} />}
                <div className='py-2'>
                    <i className='fa-solid fa-circle-exclamation me-1 text-theme' />
                    <small className='block'>
                        <span className='me-1'>{isLogin ? "Don't h" : 'H'}ave an account?</span>
                        <FakeLinkButton onClick={toggleModalStateHandler} text={`${isLogin ? 'Sign up' : 'Login'} here`}/>
                    </small>
                </div>
            </Modal.Body>
            <Modal.Footer className='border-0 p-3'>
                <IconButton form={modalState} type='submit' icon='fa-solid fa-arrow-right-to-bracket' className='m-0 w-100' text={modalState} pillVariant />
            </Modal.Footer>
        </Modal>
    );
};

export default LoginSignupModal;
