import axios from "axios";
import { Alert, Col, Form, Row } from "react-bootstrap";
import { useState } from "react";
import { stateHelper } from "../../../util/state";
import { formInputHandler } from "../../../util/form";
import IconButton from "../../ui/button/IconButton";

const ChangeEmail = ({ userId, onSuccess }) => {
    const [ formState, setFormState ] = useState({
        // If the form was checked for validating input
        validated: false,
        // If an error occurred with form submission
        error: '',
        // input
        newEmail: '',
        confirmEmail: '',
    });

    const setFormStateHelper = entry => stateHelper(setFormState, entry);
    const inputHandler = event => formInputHandler(event, setFormState, true);
    const confirmEmailHandler = event => {
        const comparisonField = event.target.name === 'newEmail' ? 'confirmEmail' : 'newEmail';
        if (formState[comparisonField] !== event.target.value) {
            document.getElementById('newEmail').classList.add('is-invalid');
            document.getElementById('confirmEmail').classList.add('is-invalid');
            setFormStateHelper({error: 'Confirm email does not match new email'});
        }
        else if (formState.error) {
            document.getElementById('newEmail').classList.remove('is-invalid');
            document.getElementById('confirmEmail').classList.remove('is-invalid');
            setFormStateHelper({error: ''})
        }
        inputHandler(event)
    }
    const submitHandler = event => {
        event.preventDefault();
        const form = event.currentTarget;

        setFormStateHelper({ validated: true });
        if (form.checkValidity() === false) {
            event.stopPropagation();
            return;
        }

        axios.patch(`/api/v1/user/${userId}`, { email: formState.newEmail }).then(() => {
            onSuccess(`Email updated to ${formState.newEmail}`);
            setFormStateHelper({
                newEmail: '',
                confirmEmail: '',
                validated: false,
            });
        }).catch(error => {
            setFormStateHelper({ error: `Server Error: ${error.message}` });
        });
    };

    return (
        <Form onSubmit={submitHandler} validated={formState.validated} noValidate>
            {formState.error &&
                <Alert variant='danger' className='fw-bold mb-2 py-2 px-3 border-0'>
                    <i className="fa-solid fa-circle-exclamation me-2" />
                    {formState.error}
                </Alert>}
            <Row className='gy-2 pb-3'>
                <Form.Group as={Col} xxl={12}>
                    <Form.Control id='newEmail' value={formState.newEmail} onChange={confirmEmailHandler} type='email' name='newEmail' placeholder='New Email' required />
                    <Form.Control.Feedback type='invalid'>Email is required</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} xxl={12}>
                    <Form.Control id='confirmEmail' value={formState.confirmEmail} onChange={confirmEmailHandler} type='email' name='confirmEmail' placeholder='Confirm New Email' required />
                    <Form.Control.Feedback type='invalid'>Confirm New Email is required</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <IconButton type='submit' icon='fa-solid fa-pen' text='Update Email' pillVariant />
        </Form>
    );
};

export default ChangeEmail;
