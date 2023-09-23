import { useContext } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Role } from "../../const/user";
import userContext from "../../store/userContext";
import CreatePost from '../../component/form/CreateEditPost';
import LoginSignup from "../../component/ui/modal/LoginSignupModal";

const PostCreatePage = () => {
    const navigate = useNavigate();
    const user = useContext(userContext);
    const isGuest = user.userRole === Role.Guest;

    const createdPostHandler = post => {
        navigate(`/post/${post.id}`, { replace: true });
    };

    // Modal to show to guests
    if (isGuest) return <LoginSignup show={true} message='Please login to post' onClose={() => navigate('/')} />
    else return (
        <Container className='mt-2'>
            <Row className='align-content-baseline mt-3 mb-1 gx-3'>
                <Col className='col-auto'>
                    <h3>Create Post</h3>
                </Col>
                <Col className='col-auto'>
                    <Alert variant='info' className='m-0 py-1 px-2 border-0'>
                        <p><i className='fa-solid fa-circle-exclamation me-2' />All posts are public</p>
                    </Alert>
                </Col>
            </Row>
            <CreatePost onSuccess={createdPostHandler} />
        </Container>
    );
};

export default PostCreatePage;
