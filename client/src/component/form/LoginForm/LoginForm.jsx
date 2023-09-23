import { useContext, useState } from 'react';
import { Alert, Row, Col, Form } from 'react-bootstrap';
import { formInputHandler } from "../../../util/form";
import { stateHelper } from "../../../util/state";
import UserContext from "../../../store/userContext";

const LoginForm = ({ onSuccess }) => {
    const user = useContext(UserContext);
    const [ formState, setFormState ] = useState({
        // If the form was checked for validating input
        validated: false,
        // If an error occurred with form submission
        error: '',
        // input
        username: '',
        password: '',
    });

    const setFormStateHelper = entry => stateHelper(setFormState, entry);
    const inputHandler = event => formInputHandler(event, setFormState, true);
    const submitHandler = event => {
        event.preventDefault();
        const form = event.currentTarget;

        setFormStateHelper({ validated: true });
        if (form.checkValidity() === false) {
            event.stopPropagation();
            return;
        }

        user.login(
            formState.username,
            formState.password,
            () => onSuccess(),
            error => {
                let message;
                if (error.response.status === 404) message = 'Invalid username or password';
                else message = `Server Error: ${error.message}`;
                setFormStateHelper({ error: message, validated: false });
            },
        );
    };

    return (
        <Form id='Login' onSubmit={submitHandler} validated={formState.validated} noValidate>
            {formState.error &&
                <Alert variant='danger' className='fw-bold mb-2 py-2 px-3 border-0'>
                    <i className="fa-solid fa-circle-exclamation me-2" />
                    {formState.error}
                </Alert>}
            <Row className='gy-2'>
                <Form.Group as={Col} xxl='12'>
                    <Form.Control onChange={inputHandler} value={formState.username} type='text' name='username' placeholder='Username or Email' autoFocus required />
                    <Form.Control.Feedback type='invalid'>Username or Email is required</Form.Control.Feedback>
                </Form.Group >
                <Form.Group as={Col} xxl='12'>
                    <Form.Control onChange={inputHandler} value={formState.password} type='password' name='password' placeholder='Password' required />
                    <Form.Control.Feedback type='invalid'>Password is required</Form.Control.Feedback>
                </Form.Group >
            </Row>
        </Form>
    );
};

export default LoginForm;
