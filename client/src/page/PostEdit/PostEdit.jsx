import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Role } from "../../const/user";
import userContext from "../../store/userContext";
import EditPost from '../../component/form/CreateEditPost';
import Loading from "../../component/ui/Loading";
import IconButton from "../../component/ui/button/IconButton";
import LoginSignup from "../../component/ui/modal/LoginSignupModal";
import Error from "../Error";

const PostEditPage = () => {
    const user = useContext(userContext);
    const isGuest = user.userRole === Role.Guest;
    let navigate = useNavigate();
    let { id } = useParams();

    // TODO: Current post: User validation ensure, requires sessions on server side
    const postQuery = useQuery([`post`, id], () =>
        axios.get(`/api/v1/post/${id}`).then(res => res.data),
    );
    // If submission of the edit is successful
    const successfulEditHandler = () => {
        navigate(`/post/${id}`);
    }

    useEffect(() => {
        if (postQuery.data?.title) document.title = `Edit Post: ${postQuery.data.title}`;
    }, [postQuery.data]);

    // Modal to show to guests
    if (isGuest) return <LoginSignup show={true} message='Please login to edit posts' onClose={() => navigate('/')} />
    else if (postQuery.isLoading) return <Loading />;
    else if (postQuery.error) return <Error title={500} message={postQuery.error.toString()} />
    else if (!postQuery.data) return <Error title={404} message='Post does not exist' />
    else return (
        <Container className='mt-2'>
            <Row className='align-content-baseline mt-3 mb-1 gx-1'>
                <Col className='col-auto'>
                    <IconButton to={`/post/${id}`} icon='fa-solid fa-chevron-left' text='Cancel' pillVariant />
                </Col>
                <Col className='col-auto'>
                    <h3>Edit Post</h3>
                </Col>
            </Row>
            <EditPost onSuccess={successfulEditHandler} title={postQuery.data.title} content={postQuery.data.content} editId={id} />
        </Container>
    );
};

export default PostEditPage;
