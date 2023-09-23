import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import { useContext } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { DefaultProfilePicture, Role } from "../../../const/user";
import UserContext from "../../../store/userContext";
import Loading from "../../../component/ui/Loading";
import Error from "../../Error";
import {Link} from "react-router-dom";

const ListUsers = () => {

    const user = useContext(UserContext);
    const isAdmin = user.userRole === Role.Admin;

    const usersQuery = useQuery(['AllUsers'], () =>
        axios.get('/api/v1/user').then(res => res.data)
    );

    console.log(usersQuery.data);

    if (!isAdmin) return <Error title={404}  message="Requested page doesn't exist" />
    else if (usersQuery.isLoading) return <Loading />;
    else if (usersQuery.error) return <Error title={500} message={usersQuery.error.toString()} />;
    else return (
        <Container className='my-4'>
            <div className='d-flex flex-row align-items-center mb-4'>
                <h1 className='m-0'>
                    <i className='fa-regular fa-user mx-2' style={{ fontSize: '1.3em' }}/>
                </h1>
                <div>
                    <h3 className='m-0 mb-1'>Registered Users</h3>
                    <h5 className='m-0 mb-0'>Total: {usersQuery.data.length}</h5>
                </div>
            </div>
            <Row className='gy-2'>
                {usersQuery.data.map(user => (
                    <Col xxl={12} key={`user_${user.id}`}>
                        <Card>
                            <Card.Body>
                                <img src={user.profilePicture ?? DefaultProfilePicture} height={25} className='rounded-5 me-2' alt='User Profile'/>
                                <b>{user.username}</b>
                                {user.role === Role.Admin && <i className='ms-1 text-theme fa-solid fa-shield-halved' />}
                                <Link to={`/@${user.username}`} className='stretched-link' />
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ListUsers;
