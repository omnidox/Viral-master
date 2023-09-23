import axios from "axios";
import { Alert, Col, Form, Row } from "react-bootstrap";
import { useState } from "react";
import { stateHelper } from "../../../util/state";
import { formInputHandler } from "../../../util/form";
import IconButton from "../../ui/button/IconButton";

const ChangePassword = ({ userId, onSuccess }) => {
    const [ formState, setFormState ] = useState({
        // If the form was checked for validating input
        validated: false,
        // If an error occurred with form submission
        error: '',
        // input
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const setFormStateHelper = entry => stateHelper(setFormState, entry);
    const inputHandler = event => formInputHandler(event, setFormState);
    const confirmPasswordHandler = event => {
        const comparisonField = event.target.name === 'newPassword' ? 'confirmNewPassword' : 'newPassword';
        if (formState[comparisonField] !== event.target.value) {
            document.getElementById('newPassword').classList.add('is-invalid');
            document.getElementById('confirmPassword').classList.add('is-invalid');
            setFormStateHelper({error: 'Confirm password does not match new password'});
        }
        else if (formState.error) {
            document.getElementById('newPassword').classList.remove('is-invalid');
            document.getElementById('confirmPassword').classList.remove('is-invalid');
            setFormStateHelper({error: ''})
        }
        inputHandler(event)
    }
    const submitHandler = event => {
        event.preventDefault();
        const form = event.currentTarget;

        if (formState.newPassword !== formState.confirmNewPassword) {
            return
        }

        setFormStateHelper({ validated: true });
        if (form.checkValidity() === false) {
            event.stopPropagation();
            return;
        }

        const data = {
            currentPassword: formState.currentPassword,
            password: formState.newPassword,
        };
        axios.patch(`/api/v1/user/${userId}`, data).then(() => {
            setFormStateHelper({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
                validated: false,
            });
            onSuccess(`Password updated`);
        }).catch(error => {
            setFormStateHelper({ error: `Server Error: ${error.message}` });
        })
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
                    <Form.Control value={formState.currentPassword} onChange={inputHandler} type='password' name='currentPassword' placeholder='Current Password' required />
                    <Form.Control.Feedback type='invalid'>Current password is required</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} xxl={12}>
                    <hr className='my-1' />
                </Form.Group>
                <Form.Group as={Col} xxl={12}>
                    <Form.Control id='newPassword' value={formState.newPassword} onChange={confirmPasswordHandler} type='password' name='newPassword' placeholder='New Password' required />
                    <Form.Control.Feedback type='invalid'>New password is required</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} xxl={12}>
                    <Form.Control id='confirmPassword' value={formState.confirmNewPassword} onChange={confirmPasswordHandler} type='password' name='confirmNewPassword' placeholder='Confirm New Password' required />
                    <Form.Control.Feedback type='invalid'>Confirm password is required</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <IconButton type='submit' icon='fa-solid fa-pen' text='Update Password' pillVariant />
        </Form>
    );
};

export default ChangePassword;
