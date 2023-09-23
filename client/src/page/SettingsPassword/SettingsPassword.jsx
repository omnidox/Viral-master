import { useEffect, useState } from "react";
import { Accordion, Alert } from "react-bootstrap";
import ChangePassword from "../../component/form/ChangePassword";
import {useOutletContext} from "react-router-dom";

const SettingsPassword = () => {
    const [ isSuccess, setIsSuccess ] = useState('');
    const { userData } = useOutletContext();

    useEffect(() => {
        document.title = 'Account Settings';
    }, []);

    const successHandler = message => setIsSuccess(message);

    useEffect(() => {
        document.title = 'Password Settings';
    }, []);

    return (
        <>
            {isSuccess &&
                <Alert variant='success' className='fw-bold mb-3 py-3 px-3 border-0'>
                    <i className="fa-solid fa-circle-check me-2" />
                    {isSuccess}
                </Alert>}
            <Accordion defaultActiveKey='0'>
                <Accordion.Item eventKey='0' className='outline-hover accordian-theme'>
                    <Accordion.Header>
                        <p className='fw-bold'>Update Password</p>
                    </Accordion.Header>
                    <Accordion.Body className='pt-0'>
                        <ChangePassword userId={userData.id} onSuccess={successHandler} />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    );
};

export default SettingsPassword;
