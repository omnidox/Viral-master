import axios from "axios";
import { Alert, Col, Form, Row } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { UsernameState } from "../../../const/user";
import { stateHelper } from "../../../util/state";
import { formDataToObj, formInputHandler } from "../../../util/form";
import userContext from "../../../store/userContext";
import IconButton from "../../ui/button/IconButton";

const ChangeUsername = ({ userId, onSuccess }) => {
    const user = useContext(userContext);
    const [ formState, setFormState ] = useState({
        // If the form was checked for validating input
        validated: false,
        // If an error occurred with form submission
        error: '',
        // If the requested username is already taken by another user
        usernameAvailable: UsernameState.Empty,
        // input
        username: '',
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

        axios.patch(`/api/v1/user/${userId}`, formDataToObj(form)).then(() => {
            onSuccess(`Username updated to ${formState.username}`);
            // If an admin is not modifying someone else's data
            if (user.id === userId) user.setUsername(formState.username);
            setFormStateHelper({
                username: '',
                validated: false,
            });
        }).catch(error => {
            setFormStateHelper({ error: `Server Error: ${error.message}` });
        })
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
        <Form onSubmit={submitHandler} validated={formState.validated} noValidate>
            {formState.error &&
                <Alert variant='danger' className='fw-bold mb-2 py-2 px-3 border-0'>
                    <i className="fa-solid fa-circle-exclamation me-2" />
                    {formState.error}
                </Alert>}
            <Row className='gy-2 pb-3'>
                <Form.Group as={Col} xxl={12}>
                    <Form.Control value={formState.username} onChange={inputHandler} type='text' name='username' placeholder='New Username' required />
                    {formState.usernameAvailable &&
                        <Alert variant={formState.usernameAvailable.variant} className='fw-bold my-2 py-2 px-3 border-0'>
                            <i className={`${formState.usernameAvailable.icon} me-2`} />
                            Username is {formState.usernameAvailable.message}
                        </Alert>}
                    <Form.Control.Feedback type='invalid'>Username is required</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <IconButton type='submit' icon='fa-solid fa-pen' text='Update Username' pillVariant />
        </Form>
    );
};

export default ChangeUsername;
