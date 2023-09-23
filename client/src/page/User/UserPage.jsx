import axios from 'axios';
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import { Accordion, Card, Col, Container, Row } from 'react-bootstrap';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DefaultProfilePicture, Role } from "../../const/user";
import UserContext from "../../store/userContext";
import Loading from '../../component/ui/Loading';
import OutlineLinkButton from '../../component/ui/button/OutlineLinkButton';
import Error from "../Error";
import IconButton from "../../component/ui/button/IconButton";
import ConfirmationModal from "../../component/ui/modal/ConfirmationModal";

const UserPage = () => {
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const [ confirmationPrompt, setConfirmationPrompt ] = useState({});
    const { username } = useParams();

    const userQuery = useQuery(['users', username], () => (
        axios.get(`/api/v1/user/${username}`)
            .then(res => res.data)
    ), {
        retry: false,
    })

    const closeConfirmationPromptHandler = () => setConfirmationPrompt({ show: false });

    const deleteUserConfirmationHandler = () => {
        let confirmationData = {
            show: true,
            title: 'Delete User',
            message: 'This user will be permanently deleted',
        };

        const onClick = () => {
            axios.delete(`/api/v1/user/${userQuery.data.id}`)
                .then(() => {
                    setConfirmationPrompt({
                        ...confirmationData,
                        disabled: true,
                        message: '',
                        alert: {
                            variant: 'success',
                            message: 'User has been deleted',
                        },
                    });
                    userQuery.refetch();
                })
                .catch(error => {
                    setConfirmationPrompt({
                        ...confirmationData,
                        alert: {
                            variant: 'danger',
                            message: `Failure: ${error.toString()}`,
                        },
                    });
                });
        };

        setConfirmationPrompt({
            onClick,
            ...confirmationData,
        });
    }

    useEffect(() => {
        const path = window.location.pathname;
        if (!window.location.pathname.includes(`${username}/`)) {
            navigate(`${path}/posts`, { replace: true });
        }

        if (username.match(`^@[A-z0-9]+$`) === null) navigate('/404', { replace: true });
        else document.title = username;
    }, [username, navigate]);

    return <>
        <ConfirmationModal
            show={confirmationPrompt.show}
            title={confirmationPrompt.title}
            message={confirmationPrompt.message}
            alert={confirmationPrompt.alert}
            disabled={confirmationPrompt.disabled}
            onClick={confirmationPrompt.onClick}
            onClose={closeConfirmationPromptHandler}
        />
        {userQuery.isLoading && <Loading />}
        {userQuery.error?.response.status === 404
            ?
            <Error title={404} message={userQuery.error.response.data.message} />
            : userQuery.error ?
            <Error title={userQuery.error.response.status} message={userQuery.error.toString()} />
            : userQuery.data &&
            <Container className='d-flex flex-column my-4'>
                {(user.userRole === Role.Admin || user.id === userQuery.data.id) &&
                    <Card className='mb-1'>
                        <Card.Body className='p-2'>
                            <IconButton to={`/settings/${userQuery.data.id}/account`} icon='fa-solid fa-pen' text='Edit' />
                            {user.userRole === Role.Admin && user.id !== userQuery.data.id /* Can't delete themselves */ &&
                                <IconButton onClick={deleteUserConfirmationHandler} icon='fa-solid fa-circle-xmark' text='Delete'/>}
                        </Card.Body>
                    </Card>}
                <Accordion defaultActiveKey='0' className='my-3'>
                    <Accordion.Item eventKey='0' className='outline-hover accordian-theme'>
                        <Accordion.Header>
                            <h1 className='text-theme d-flex align-items-center'>
                                <img
                                    src={userQuery.data.profilePicture ?? DefaultProfilePicture}
                                    height={60}
                                    className="rounded-5 me-2"
                                    alt='User profile'
                                />
                                <div>
                                    {username}
                                    {userQuery.data.role === Role.Admin &&
                                        <h5 className='m-0 mt-2 text-black'>
                                            <i className="ms-1 fa-solid fa-shield-halved me-2" />
                                            Administrator
                                        </h5>}
                                </div>
                            </h1>
                        </Accordion.Header>
                        <Accordion.Body className='pt-0'>
                            <hr className='m-0 mb-3' />
                            <ReactMarkdown className='markdown' children={userQuery.data.bio ?? 'No biography set'} remarkPlugins={[remarkGfm]} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Row className='d-flex gx-2 pb-3'>
                    <Col className='col-auto'>
                        <OutlineLinkButton to='posts' text='Posts' />
                    </Col>
                    <Col className='col-auto'>
                        <OutlineLinkButton to='comments' text='Comments' />
                    </Col>
                    <Col className='col-auto'>
                        <OutlineLinkButton to='bookmarks' text='Bookmarks' />
                    </Col>
                </Row>
                <Outlet context={{ userData: userQuery.data }} />
            </Container>}
    </>;
}

export default UserPage;
