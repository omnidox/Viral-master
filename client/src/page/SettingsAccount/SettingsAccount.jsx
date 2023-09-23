import { useEffect, useState } from 'react';
import { Accordion, Alert, Col, Row } from 'react-bootstrap';
import { useOutletContext } from "react-router-dom";
import ChangeEmail from '../../component/form/ChangeEmail';
import ChangeUsername from '../../component/form/ChangeUsername';
import ChangeBiography from "../../component/form/ChangeBiography";
import ChangeUserPicture from "../../component/form/ChangeUserPicture";

const SettingsAccount = () => {
    const [ isSuccess, setIsSuccess ] = useState('');
    const { userData, userQuery } = useOutletContext();

    useEffect(() => {
        document.title = 'Account Settings';
    }, []);

    const successHandler = message => {
        userQuery.refetch();
        setIsSuccess(message);
    };

    return <>
        {isSuccess &&
            <Alert variant='success' className='fw-bold mb-3 py-3 px-3 border-0'>
                <i className="fa-solid fa-circle-check me-2" />
                {isSuccess}
            </Alert>}
        <Row className='gy-3'>
            <Col xxl={12}>
                <Accordion>
                    <Accordion.Item eventKey='0' className='outline-hover accordian-theme'>
                        <Accordion.Header>
                            <p className='fw-bold'>Update Biography</p>
                        </Accordion.Header>
                        <Accordion.Body className='pt-0'>
                            <ChangeBiography userId={userData.id} bio={userData.bio} onSuccess={successHandler} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
            <Col xxl={12}>
                <Accordion>
                    <Accordion.Item eventKey='0' className='outline-hover accordian-theme'>
                        <Accordion.Header>
                            <p className='fw-bold'>Update Profile Picture</p>
                        </Accordion.Header>
                        <Accordion.Body className='pt-0'>
                            <ChangeUserPicture userId={userData.id} profilePicture={userData.profilePicture} onSuccess={successHandler} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
            <Col xxl={12}>
                <Accordion>
                    <Accordion.Item eventKey='0' className='outline-hover accordian-theme'>
                        <Accordion.Header>
                            <p className='fw-bold'>Update Username</p>
                        </Accordion.Header>
                        <Accordion.Body className='pt-0'>
                            <ChangeUsername userId={userData.id} onSuccess={successHandler} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
            <Col xxl={12}>
                <Accordion>
                    <Accordion.Item eventKey='0' className='outline-hover accordian-theme'>
                        <Accordion.Header>
                            <p className='fw-bold'>Update Email</p>
                        </Accordion.Header>
                        <Accordion.Body className='pt-0'>
                            <ChangeEmail userId={userData.id} onSuccess={successHandler} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
        </Row>
    </>;
};

export default SettingsAccount;
