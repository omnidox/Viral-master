import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Alert, Col, Form, Row } from 'react-bootstrap';
import { UsernameState } from '../../../const/user';
import { formDataToObj, formInputHandler } from "../../../util/form";
import { stateHelper } from "../../../util/state";
import UserContext from "../../../store/userContext";

const SignupForm = ({ onSuccess }) => {
    const user = useContext(UserContext);
    const [formState, setFormState] = useState({
        // If the form was checked for validating input
        validated: false,
        // If an error occurred with form submission
        error: '',
        // If the requested username is already taken by another user
        usernameAvailable: UsernameState.Empty,
        // input
        username: '',
        email: '',
    });

    const setFormStateHelper = entry => stateHelper(setFormState, entry);
    const inputHandler = event => formInputHandler(event, setFormState, true);
    const submitHandler = event => {
        event.preventDefault();
        const form = event.currentTarget;

        if (formState.usernameAvailable === UsernameState.Taken) {
            return;
        }

        setFormStateHelper({ validated: true });
        if (form.checkValidity() === false) {
            event.stopPropagation();
            return;
        }

        // Check if passwords match
        const password = form.elements.password.value;
        const confirmPassword = form.elements.confirmPassword.value;
        if (password !== confirmPassword) {
            setFormStateHelper({ error: 'Passwords do not match' });
            return;
        }

        user.signUp({
            // TODO: first/last name
            firstname: '',
            lastname: '',
            ...formDataToObj(form),
        },
            () => onSuccess(),
            error => setFormStateHelper({ error: `Server Error: ${error.message}` }),
        );
    };

    // Check availability of username
    useEffect(() => {
        const delay = setTimeout(() => {
            if (formState.username) {
                axios.get(`/api/v1/user/@${formState.username}/available`).then(res => {
                    let availableState = res.data.exists ? UsernameState.Taken : UsernameState.Available;
                    setFormStateHelper({ usernameAvailable: availableState });
                }).catch(error => {
                    setFormStateHelper({ error: `Server Error: ${error.message}` });
                });
            } else setFormStateHelper({ usernameAvailable: UsernameState.Empty });
        }, 500)

        return () => clearTimeout(delay)
    }, [formState.username]);

    return (
        <Form id='Sign up' onSubmit={submitHandler} validated={formState.validated} noValidate>
            {formState.error &&
                <Alert variant='danger' className='fw-bold mb-2 py-2 px-3 border-0'>
                    <i className="fa-solid fa-circle-exclamation me-2" />
                    {formState.error}
                </Alert>}
            <Row className='gy-2'>
                <Form.Group as={Col} xxl='12'>
                    <Form.Control onChange={inputHandler} value={formState.username} type='text' name='username' placeholder='Username' autoFocus required />
                    <Form.Control.Feedback type='invalid'>Username is required</Form.Control.Feedback>
                    {formState.usernameAvailable &&
                        <Alert variant={formState.usernameAvailable.variant} className='fw-bold my-2 py-2 px-3 border-0'>
                            <i className={`${formState.usernameAvailable.icon} me-2`} />
                            Username is {formState.usernameAvailable.message}
                        </Alert>}
                </Form.Group>
                <Form.Group as={Col} xxl='12'>
                    <Form.Control onChange={inputHandler} value={formState.email} type='email' name='email' placeholder='Email' required />
                    <Form.Control.Feedback type='invalid'>Email is required</Form.Control.Feedback>
                </Form.Group >
                <Form.Group as={Col} xxl='12'>
                    <Form.Control type='password' name='password' placeholder='Password' required />
                    <Form.Control.Feedback type='invalid'>Password is required</Form.Control.Feedback>
                </Form.Group >
                <Form.Group as={Col} xxl='12'>
                    <Form.Control type='password' name='confirmPassword' placeholder='Confirm Password' required />
                    <Form.Control.Feedback type='invalid'>Confirm Password is required</Form.Control.Feedback>
                </Form.Group >
            </Row>
        </Form>
    );
};

export default SignupForm;
