import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import {Link, Outlet, useNavigate, useParams} from "react-router-dom";
import {DefaultProfilePicture, Role} from "../../const/user";
import userContext from "../../store/userContext";
import OutlineLinkButton from "../../component/ui/button/OutlineLinkButton";
import LoginSignup from "../../component/ui/modal/LoginSignupModal";
import Loading from "../../component/ui/Loading";
import Error from "../Error";

const SettingsPage = () => {
    const user = useContext(userContext);
    const { id } = useParams();
    const isGuest = user.userRole === Role.Guest;
    const navigate = useNavigate();
    // TODO: Implement protection in server side
    // const userId = user.userRole === Role.Admin ? id : user.id;
    const userId = user.userRole === Role.Admin && id ? id : user.id;


    const userQuery = useQuery(['users_id', userId], () => (
        axios.get(`/api/v1/user/${userId}`)
            .then(res => res.data)
    ), {
        enabled: user.role !== Role.Guest,
        retry: false,
    });

    useEffect(() => {
        const path = window.location.pathname;
        if (!window.location.pathname.includes(`settings/`)) {
            navigate(`${path}/account`, { replace: true });
        }

        document.title = 'Settings';
    }, [navigate]);

    // Modal to show to guests
    if (isGuest) return <LoginSignup show={true} message='Please login to view your settings' onClose={() => navigate('/')} />
    else if (userQuery.isLoading) return <Loading />;
    else if (userQuery.error) return <Error title={500} message={userQuery.error.toString()} />;
    else return (
        <Container className='my-4'>
            <Link to={`/@${userQuery.data.username}`} className='text-decoration-none'>
                <h1 className='text-theme d-flex align-items-center'>
                    <img src={userQuery.data.profilePicture ?? DefaultProfilePicture} height={60} className="rounded-5 me-2" alt='User Profile' />
                    Settings
                </h1>
            </Link>
            <Accordion defaultActiveKey='0' className='mb-3'>
                <Accordion.Item eventKey='0' className='outline-hover accordian-theme'>
                    <Accordion.Header>
                        <p className='fw-bold'>Profile Information</p>
                    </Accordion.Header>
                    <Accordion.Body className='pt-0'>
                        <p className='fw-bold'>Username:<span className='ms-2 text-theme'>{userQuery.data.username}</span></p>
                        <p className='fw-bold'>Email:<span className='ms-2 text-theme'>{userQuery.data.email}</span></p>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Row className='d-flex gx-2 pb-3'>
                <Col className='col-auto'>
                    <OutlineLinkButton to='account' text='Account' />
                </Col>
                <Col className='col-auto'>
                    <OutlineLinkButton to='password' text='Password' />
                </Col>
            </Row>
            <Outlet context={{ userData: userQuery.data, userQuery }} />
        </Container>
    );
};

export default SettingsPage;
